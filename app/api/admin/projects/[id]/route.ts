import { NextResponse } from "next/server";
import { isSameOrigin, isSignedIn } from "@/lib/admin";
import { isStorageConfigured } from "@/lib/mongodb";
import { deleteProject, updateProject, type ProjectPatch } from "@/lib/projects";

export const dynamic = "force-dynamic";

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

/** Saves everything editable about a client's dashboard. */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  try {
    const project = await updateProject(id, (body ?? {}) as ProjectPatch);
    if (!project) {
      return NextResponse.json({ ok: false, error: "No such project." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, project });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not save that.",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const blocked = await guard(request);
  if (blocked) return blocked;

  const { id } = await params;

  try {
    const deleted = await deleteProject(id);
    return NextResponse.json({ ok: deleted }, { status: deleted ? 200 : 404 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not delete that." },
      { status: 502 },
    );
  }
}
