import getSession from "@/server_actions/getSession";
import { Article, ArticleEvent } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now()
  );
}

type ArticleWithEvent = Article & { event: ArticleEvent | null };

function cardFromArticle(article: ArticleWithEvent) {
  const ev = article.event;
  const rawDate = ev?.eventDate ? ev.eventDate.toISOString().split("T")[0] : "";
  const rawTime = ev?.eventTime ?? "";

  let date = "TBD — SET DATE";
  if (rawDate) {
    const d = new Date(rawDate + "T00:00:00");
    const datePart = d
      .toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
      .toUpperCase();
    date = rawTime ? `${datePart} AT ${rawTime}` : datePart;
  }

  return {
    id: article.id,
    title: article.title,
    description: article.content,
    date,
    rawDate,
    rawTime,
    isVisible: article.status === "PUBLISHED",
    imageName: article.featuredImage
      ? (article.featuredImage.split("/").pop() ?? null)
      : null,
    imageUrl: article.featuredImage ?? null,
    tag: ev?.tag ?? "",
    registerLink: ev?.registerLink ?? "",
    venue: ev?.venue ?? "",
    venueMapLink: ev?.venueMapLink ?? "",
  };
}

// ─── GET /api/articles ────────────────────────────────────────────────────────

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const articles = await prisma.article.findMany({
    where: { isEvent: true },
    include: { event: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(articles.map(cardFromArticle));
}

// ─── POST /api/articles ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const {
    title,
    description,
    rawDate,
    rawTime,
    isVisible,
    imageUrl,
    tag,
    registerLink,
    venue,
    venueMapLink,
  } = body;

  const article = await prisma.article.create({
    data: {
      title: title || "Draft Event Title",
      slug: slugify(title || "draft-event"),
      content: description || "",
      status: isVisible ? "PUBLISHED" : "DRAFT",
      isEvent: true,
      featuredImage: imageUrl ?? null,
      authorId: session.getId() as string,
      event: {
        create: {
          eventDate: rawDate ? new Date(rawDate + "T00:00:00") : null,
          eventTime: rawTime || null,
          tag: tag || null,
          registerLink: registerLink || null,
          venue: venue || null,
          venueMapLink: venueMapLink || null,
        },
      },
    },
    include: { event: true },
  });

  return NextResponse.json(cardFromArticle(article), { status: 201 });
}
