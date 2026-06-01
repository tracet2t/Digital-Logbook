import { ArticleImageType } from "@prisma/client";

import {
  ensureBucket,
  getMinioClient,
  getPublicUrl,
  MINIO_BUCKET,
} from "@/lib/minio";
import prisma from "@/lib/prisma";

export interface ArticleImageRecord {
  id: string;
  url: string;
  key: string;
  type: ArticleImageType;
  order: number;
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export const mediaRepository = {
  /**
   * Upload a file to MinIO under cms/{userId}/{articleId}/{timestamp}-{filename}.
   * For COVER type, the existing cover is replaced (old object + DB row deleted first).
   * For GALLERY type, max 5 images per article is enforced.
   * Returns the saved ArticleImage record.
   */
  async uploadFile(
    userId: string,
    articleId: string,
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    type: ArticleImageType,
  ): Promise<ArticleImageRecord> {
    await ensureBucket();
    const client = getMinioClient();

    if (type === ArticleImageType.COVER) {
      // Replace existing cover if one exists
      const existing = await prisma.articleImage.findFirst({
        where: { articleId, type: ArticleImageType.COVER },
      });
      if (existing) {
        await client.removeObject(MINIO_BUCKET, existing.key).catch(() => null);
        await prisma.articleImage.delete({ where: { id: existing.id } });
      }
    } else {
      // GALLERY — enforce 5-image limit
      const count = await prisma.articleImage.count({
        where: { articleId, type: ArticleImageType.GALLERY },
      });
      if (count >= 5) {
        throw Object.assign(new Error("Maximum 5 gallery images per article"), {
          code: "MAX_IMAGES_EXCEEDED",
        });
      }
    }

    const key = `cms/${userId}/${articleId}/${Date.now()}-${sanitizeFileName(originalName)}`;

    await client.putObject(MINIO_BUCKET, key, buffer, buffer.byteLength, {
      "Content-Type": mimeType,
    });

    const galleryOrder =
      type === ArticleImageType.GALLERY
        ? await prisma.articleImage.count({
            where: { articleId, type: ArticleImageType.GALLERY },
          })
        : 0;

    const record = await prisma.articleImage.create({
      data: {
        articleId,
        url: getPublicUrl(key),
        key,
        type,
        order: galleryOrder,
      },
    });

    return {
      id: record.id,
      url: record.url,
      key: record.key,
      type: record.type,
      order: record.order,
    };
  },

  /**
   * Delete a single image by its DB id.
   * Removes the MinIO object (best-effort) then deletes the DB row.
   */
  async deleteImage(imageId: string): Promise<void> {
    const record = await prisma.articleImage.findUnique({
      where: { id: imageId },
    });
    if (!record) return;

    const client = getMinioClient();
    await client.removeObject(MINIO_BUCKET, record.key).catch(() => null);
    await prisma.articleImage.delete({ where: { id: imageId } });
  },

  /**
   * Reorder gallery images for an article.
   * orderedIds is the full ordered array of GALLERY image ids.
   */
  async reorderImages(articleId: string, orderedIds: string[]): Promise<void> {
    await prisma.$transaction(
      orderedIds.map((id, i) =>
        prisma.articleImage.update({
          where: { id, articleId },
          data: { order: i },
        }),
      ),
    );
  },
};
