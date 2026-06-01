import { mediaRepository } from "@/repositories/media_repository_impl";
import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
) {
  const session = await getSession();
  if (!session.isAuthenticated())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { imageId } = await params;
  await mediaRepository.deleteImage(imageId);
  return NextResponse.json({ success: true });
}
