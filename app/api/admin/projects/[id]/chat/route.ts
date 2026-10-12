import { NextResponse } from "next/server";
import { isSameOrigin, isSignedIn } from "@/lib/admin";
import { isStorageConfigured } from "@/lib/mongodb";
import { MESSAGE_MAX_LENGTH } from "@/lib/project-types";
import {
  appendProjectMessage,
  deleteProjectMessage,
  getProjectMessages,
} from "@/lib/projects";

/**
 * Sawyer's side of a client's live chat. Separate from the project editor's
 * save, so posting a reply can never overwrite unsaved edits in the editor.
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

async function guard(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }
  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: false, error: "Storage is not connected." }, { status: 503 });
  }
  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const { id } = await params;

  try {
    const messages = await getProjectMessages(id);
    if (!messages) {
      return NextResponse.json({ ok: false, error: "No such project." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, messages }, { headers: NO_STORE });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not read the thread." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const { id } = await params;

  const payload = (await request.json().catch(() => null)) as { body?: unknown } | null;
  const body = typeof payload?.body === "string" ? payload.body : "";

  if (body.trim() === "") {
    return NextResponse.json({ ok: false, error: "Write something first." }, { status: 422 });
  }
  if (body.length > MESSAGE_MAX_LENGTH) {
    return NextResponse.json(
      { ok: false, error: `Messages are limited to ${MESSAGE_MAX_LENGTH} characters.` },
      { status: 422 },
    );
  }

  try {
    const message = await appendProjectMessage(id, "sawyer", body);
    if (!message) {
      return NextResponse.json({ ok: false, error: "No such project." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, message }, { headers: NO_STORE });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not send that." },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const { id } = await params;
  const messageId = new URL(request.url).searchParams.get("messageId") ?? "";
  if (messageId === "") {
    return NextResponse.json({ ok: false, error: "Which message?" }, { status: 400 });
  }

  try {
    const deleted = await deleteProjectMessage(id, messageId);
    return NextResponse.json({ ok: deleted }, { status: deleted ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not delete that." },
      { status: 502 },
    );
  }
}
