import {
  ensureBucket,
  getMinioClient,
  getPublicUrl,
  MINIO_BUCKET,
} from "@/lib/minio";

const MINIO_PUBLIC_URL =
  process.env.MINIO_PUBLIC_URL ?? "http://localhost:9000";

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export const mediaRepository = {
  /**
   * Upload a file to MinIO under cms/{userId}/{timestamp}-{filename}.
   * Returns the object key and the public browser-accessible URL.
   */
  async uploadFile(
    userId: string,
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<{ key: string; url: string }> {
    await ensureBucket();

    const key = `cms/${userId}/${Date.now()}-${sanitizeFileName(originalName)}`;
    const client = getMinioClient();

    await client.putObject(MINIO_BUCKET, key, buffer, buffer.byteLength, {
      "Content-Type": mimeType,
    });

    return { key, url: getPublicUrl(key) };
  },

  /**
   * Delete a file from MinIO by its object key.
   * No-op for external URLs (e.g. Unsplash seed images).
   */
  async deleteFile(keyOrUrl: string): Promise<void> {
    const prefix = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/`;

    // Resolve full URL to key, or use as-is if already a key
    let key: string;
    if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
      if (!keyOrUrl.startsWith(prefix)) return; // external URL — skip
      key = keyOrUrl.slice(prefix.length);
    } else {
      key = keyOrUrl;
    }

    const client = getMinioClient();
    await client.removeObject(MINIO_BUCKET, key);
  },
};
