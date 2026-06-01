import { mediaRepository } from "@/repositories/media_repository_impl";
import getSession from "@/server_actions/getSession";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reorderSchema = z.object({
  articleId: z.string().min(1),
  orderedIds: z.array(z.string()).min(1),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated())
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.getRole() !== "superAdmin")
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const parsed = reorderSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request body", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { articleId, orderedIds } = parsed.data;
  await mediaRepository.reorderImages(articleId, orderedIds);
  return NextResponse.json({ success: true });
}
