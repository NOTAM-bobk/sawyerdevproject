import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

/**
 * Cloudflare R2 storage integration.
 *
 * Cloudflare R2 provides S3-compatible object storage with zero egress fees,
 * perfect for storing client logos, photography, and project documents.
 *
 * When Cloudflare R2 credentials are set, files are uploaded directly to R2.
 * When not yet configured, files fall back safely to database storage so the
 * upload feature works reliably out of the box.
 */

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();
const bucketName = process.env.CLOUDFLARE_R2_BUCKET?.trim();
const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim().replace(/\/+$/, "");

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey && bucketName);
}

function getR2Client(): S3Client {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are not configured");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function detectCategory(mimeType: string, filename: string): "logo" | "image" | "document" | "other" {
  const lowerName = filename.toLowerCase();
  const lowerMime = mimeType.toLowerCase();

  if (lowerName.includes("logo") || lowerMime === "image/svg+xml") {
    return "logo";
  }
  if (lowerMime.startsWith("image/")) {
    return "image";
  }
  if (
    lowerMime.includes("pdf") ||
    lowerMime.includes("word") ||
    lowerMime.includes("document") ||
    lowerMime.includes("text") ||
    lowerName.endsWith(".pdf") ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".txt")
  ) {
    return "document";
  }
  return "other";
}

function sanitizeKey(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);
}

/**
 * Uploads a file buffer to Cloudflare R2.
 * Returns the public or signed URL of the uploaded asset.
 */
export async function uploadToR2({
  buffer,
  filename,
  mimeType,
  projectId,
}: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  projectId: string;
}): Promise<{ url: string; key: string }> {
  const client = getR2Client();
  const uniqueKey = `projects/${projectId}/${Date.now()}-${randomUUID().slice(0, 8)}-${sanitizeKey(filename)}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    Body: buffer,
    ContentType: mimeType || "application/octet-stream",
  });

  await client.send(command);

  const url = publicBaseUrl
    ? `${publicBaseUrl}/${uniqueKey}`
    : `/api/media/r2?key=${encodeURIComponent(uniqueKey)}`;

  return { url, key: uniqueKey };
}

/**
 * Deletes an object from Cloudflare R2.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  if (!isR2Configured() || !key) return false;

  try {
    const client = getR2Client();
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await client.send(command);
    return true;
  } catch {
    return false;
  }
}
