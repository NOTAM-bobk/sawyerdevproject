import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isSameOrigin, isSignedIn } from "@/lib/admin";
import { clientProjectId } from "@/lib/client-auth";
import {
  deleteFromR2,
  detectCategory,
  isR2Configured,
  uploadToR2,
} from "@/lib/cloudflare-r2";
import { getDb, isStorageConfigured } from "@/lib/mongodb";
import type { ProjectMedia } from "@/lib/project-types";
import { appendProjectMedia, deleteProjectMedia, getProjectMedia } from "@/lib/projects";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" } as const;

/** 25 MB max per upload file */
const MAX_FILE_SIZE = 25 * 1024 * 1024;

async function resolveAuth(request: Request) {
  // Check if admin
  if (await isSignedIn()) {
    const url = new URL(request.url);
    const targetId = url.searchParams.get("projectId");
    if (targetId) {
      return { projectId: targetId, role: "sawyer" as const };
    }
  }

  // Client session
  const clientPid = await clientProjectId();
  if (clientPid) {
    return { projectId: clientPid, role: "client" as const };
  }

  return null;
}

export async function GET(request: Request) {
  const auth = await resolveAuth(request);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: false, error: "Storage is not connected." }, { status: 503 });
  }

  try {
    const media = await getProjectMedia(auth.projectId);
    return NextResponse.json({ ok: true, media, isR2: isR2Configured() }, { headers: NO_STORE });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to load media." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  const auth = await resolveAuth(request);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: false, error: "Database storage is not connected." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "No file was uploaded." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "File exceeds the 25 MB limit." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name || "unnamed-file";
    const mimeType = file.type || "application/octet-stream";
    const category = detectCategory(mimeType, filename);
    const mediaId = randomUUID();

    let fileUrl = "";
    let storageType: "r2" | "database" = "database";
    let r2Key: string | undefined;

    if (isR2Configured()) {
      try {
        const uploadResult = await uploadToR2({
          buffer,
          filename,
          mimeType,
          projectId: auth.projectId,
        });
        fileUrl = uploadResult.url;
        r2Key = uploadResult.key;
        storageType = "r2";
      } catch (err) {
        console.error("Cloudflare R2 upload failed, falling back to database storage:", err);
      }
    }

    // Database fallback if R2 is not configured or failed
    if (storageType === "database") {
      const db = await getDb();
      await db.collection("project_media_files").insertOne({
        id: mediaId,
        projectId: auth.projectId,
        filename,
        mimeType,
        size: file.size,
        data: buffer.toString("base64"),
        createdAt: new Date(),
      });
      fileUrl = `/api/media/${mediaId}`;
    }

    const mediaItem: ProjectMedia = {
      id: mediaId,
      name: filename,
      size: file.size,
      mimeType,
      category,
      url: fileUrl,
      uploadedAt: new Date().toISOString(),
      uploadedBy: auth.role,
      storage: storageType,
      r2Key,
    };

    const saved = await appendProjectMedia(auth.projectId, mediaItem);
    if (!saved) {
      return NextResponse.json({ ok: false, error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, media: saved }, { status: 201, headers: NO_STORE });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  const auth = await resolveAuth(request);
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const mediaId = url.searchParams.get("id");
    if (!mediaId) {
      return NextResponse.json({ ok: false, error: "Missing media ID." }, { status: 400 });
    }

    const removed = await deleteProjectMedia(auth.projectId, mediaId);
    if (!removed) {
      return NextResponse.json({ ok: false, error: "Media item not found." }, { status: 404 });
    }

    // Cleanup storage
    if (removed.storage === "r2" && removed.r2Key) {
      await deleteFromR2(removed.r2Key);
    } else {
      const db = await getDb();
      await db.collection("project_media_files").deleteOne({ id: mediaId });
    }

    return NextResponse.json({ ok: true, mediaId }, { headers: NO_STORE });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete file." },
      { status: 500 },
    );
  }
}
