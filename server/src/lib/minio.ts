import * as Minio from "minio";

let _client: Minio.Client | null = null;

export const MINIO_BUCKET = process.env.MINIO_BUCKET ?? "digital-logbook";

const MINIO_PUBLIC_URL =
  process.env.MINIO_PUBLIC_URL ?? "http://localhost:9000";

export function getMinioClient(): Minio.Client {
  if (!_client) {
    _client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
      port: Number(process.env.MINIO_PORT ?? 9000),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
      secretKey: process.env.MINIO_SECRET_KEY ?? "minioadmin",
    });
  }
  return _client;
}

export async function ensureBucket(): Promise<void> {
  const client = getMinioClient();
  const exists = await client.bucketExists(MINIO_BUCKET);
  if (!exists) {
    await client.makeBucket(MINIO_BUCKET);
    // Set public-read policy so stored URLs are directly accessible in the browser
    const policy = JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
        },
      ],
    });
    await client.setBucketPolicy(MINIO_BUCKET, policy);
  }
}

export function getPublicUrl(key: string): string {
  return `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${key}`;
}
