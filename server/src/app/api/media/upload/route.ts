import { mediaRepository } from "@/repositories/media_repository_impl";
import getSession from "@/server_actions/getSession";
import { ArticleImageType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file");
  const articleId = formData.get("articleId");
  const typeRaw = formData.get("type");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  if (typeof articleId !== "string" || !articleId) {
    return NextResponse.json(
      { message: "articleId is required" },
      { status: 400 },
    );
  }

  if (typeRaw !== "cover" && typeRaw !== "gallery") {
    return NextResponse.json(
      { message: "type must be 'cover' or 'gallery'" },
      { status: 400 },
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { message: "Invalid file type. Allowed: jpeg, png, webp, gif" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { message: "File too large. Maximum size is 5 MB" },
      { status: 400 },
    );
  }

  // Verify article exists
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return NextResponse.json({ message: "Article not found" }, { status: 404 });
  }

  const imageType =
    typeRaw === "cover" ? ArticleImageType.COVER : ArticleImageType.GALLERY;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const record = await mediaRepository.uploadFile(
      session.getId() as string,
      articleId,
      buffer,
      file.name,
      file.type,
      imageType,
    );
    return NextResponse.json(record, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      (err as Error & { code?: string }).code === "MAX_IMAGES_EXCEEDED"
    ) {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    throw err;
  }
}
