import getSession from "@/server_actions/getSession";
import { Article, ArticleEvent, ArticleImage } from "@prisma/client";
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

type ArticleWithEvent = Article & {
  event: ArticleEvent | null;
  images: ArticleImage[];
};

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

  const sorted = [...article.images].sort((a, b) => a.order - b.order);
  const cover = sorted.find((i) => i.type === "COVER") ?? null;
  const gallery = sorted.filter((i) => i.type === "GALLERY");

  return {
    id: article.id,
    title: article.title,
    description: article.content,
    date,
    rawDate,
    rawTime,
    isVisible: article.status === "PUBLISHED",
    coverImage: cover ? { id: cover.id, url: cover.url, key: cover.key } : null,
    images: gallery.map((i) => ({
      id: i.id,
      url: i.url,
      key: i.key,
      order: i.order,
    })),
    tag: ev?.tag ?? "",
    registerLink: ev?.registerLink ?? "",
    venue: ev?.venue ?? "",
    venueMapLink: ev?.venueMapLink ?? "",
  };
}

// ─── GET /api/articles ────────────────────────────────────────────────────────

export async function GET() {
  const session = await getSession();
  if (!session.isAuthenticated())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const articles = await prisma.article.findMany({
    where: { isEvent: true },
    include: { event: true, images: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(articles.map(cardFromArticle));
}

// ─── POST /api/articles ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const userId = session.getId() as string;

  // Verify user exists in database (handles stale sessions after DB resets)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json(
      { message: "User not found. Please re-login." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const {
    title,
    description,
    rawDate,
    rawTime,
    isVisible,
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
      authorId: userId,
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
    include: { event: true, images: true },
  });

  return NextResponse.json(cardFromArticle(article), { status: 201 });
}
