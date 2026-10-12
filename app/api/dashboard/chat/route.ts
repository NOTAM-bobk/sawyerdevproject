import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/admin";
import { clientProjectId } from "@/lib/client-auth";
import { isStorageConfigured } from "@/lib/mongodb";
import { MESSAGE_MAX_LENGTH } from "@/lib/project-types";
import { appendProjectMessage, getProjectMessages } from "@/lib/projects";

/**
 * The client's side of the live chat.
 *
 * The project id comes from the signed session cookie, never from the request,
 * so a client can only ever read or write their own thread.
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * A brake on a runaway loop. Serverless instances each keep their own count, so
 * treat it as a speed bump, not a wall — the sign-in is what protects the thread.
 */
const WINDOW_MS = 5 * 60 * 1000;
const MAX_MESSAGES = 20;
const sent = new Map<string, { count: number; resetAt: number }>();

function noteSend(key: string) {
  const now = Date.now();
  const entry = sent.get(key);
  if (!entry || entry.resetAt <= now) {
    sent.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_MESSAGES;
}

export async function GET() {
  const projectId = await clientProjectId();
  if (!projectId) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Storage is not connected." },
      { status: 503 },
    );
  }

  try {
    const messages = await getProjectMessages(projectId);
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

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  const projectId = await clientProjectId();
  if (!projectId) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Storage is not connected." },
      { status: 503 },
    );
  }

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
  if (!noteSend(projectId)) {
    return NextResponse.json(
      { ok: false, error: "That is a lot of messages at once. Give me a minute." },
      { status: 429 },
    );
  }

  try {
    const message = await appendProjectMessage(projectId, "client", body);
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
