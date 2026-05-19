import getSession from "@/server_actions/getSession";
// ─── Helper (same as in route.ts) ─────────────────────────────────────────────

import { Article, ArticleEvent } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

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

// ─── PUT /api/articles/[id] ───────────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
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

  const eventData = {
    eventDate: rawDate ? new Date(rawDate + "T00:00:00") : null,
    eventTime: rawTime || null,
    tag: tag || null,
    registerLink: registerLink || null,
    venue: venue || null,
    venueMapLink: venueMapLink || null,
  };

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: title || "Draft Event Title",
      content: description || "",
      status: isVisible ? "PUBLISHED" : "DRAFT",
      featuredImage: imageUrl ?? null,
      event: {
        upsert: {
          create: eventData,
          update: eventData,
        },
      },
    },
    include: { event: true },
  });

  return NextResponse.json(cardFromArticle(article));
}

// ─── DELETE /api/articles/[id] ────────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
