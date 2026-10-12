import { NextResponse } from "next/server";
import { getDb, isStorageConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing ID." }, { status: 400 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: false, error: "Storage not configured." }, { status: 503 });
  }

  try {
    const db = await getDb();
    const file = await db.collection("project_media_files").findOne({ id });

    if (!file || !file.data) {
      return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
    }

    const buffer = Buffer.from(file.data, "base64");
    const mimeType = file.mimeType || "application/octet-stream";
    const filename = file.filename || "file";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.length),
        "Content-Disposition": `inline; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Error serving file." },
      { status: 500 },
    );
  }
}
