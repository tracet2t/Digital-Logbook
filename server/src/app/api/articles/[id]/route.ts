import { mediaRepository } from "@/repositories/media_repository_impl";
import getSession from "@/server_actions/getSession";
// ─── Helper (same as in route.ts) ─────────────────────────────────────────────

import { Article, ArticleEvent, ArticleImage } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

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

// ─── PUT /api/articles/[id] ───────────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session.isAuthenticated())
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
      event: {
        upsert: {
          create: eventData,
          update: eventData,
        },
      },
    },
    include: { event: true, images: true },
  });

  return NextResponse.json(cardFromArticle(article));
}

// ─── DELETE /api/articles/[id] ────────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session.isAuthenticated())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;

  // Best-effort cleanup — delete all article images from MinIO
  const articleImages = await prisma.articleImage.findMany({
    where: { articleId: id },
  });
  await Promise.all(
    articleImages.map((img) =>
      mediaRepository.deleteImage(img.id).catch(() => null),
    ),
  );

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
