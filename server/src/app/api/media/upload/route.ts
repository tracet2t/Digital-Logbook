import { mediaRepository } from "@/repositories/media_repository_impl";
import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";

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
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
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

  const buffer = Buffer.from(await file.arrayBuffer());
  const { key, url } = await mediaRepository.uploadFile(
    session.getId() as string,
    buffer,
    file.name,
    file.type,
  );

  return NextResponse.json({ url, key }, { status: 201 });
}
