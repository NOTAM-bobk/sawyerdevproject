import { NextResponse } from "next/server";
import { isValidEmail, REQUIRED_ANSWER_NAMES, type Answer } from "@/lib/enquiry";
import { sendProjectEnquiry } from "@/lib/notify";

/** Enquiries are delivered by email, so this route always runs on demand. */
export const dynamic = "force-dynamic";

const MAX_FIELD_LENGTH = 2000;
const MAX_ANSWERS = 40;

function cleanAnswer(input: unknown): Answer | null {
  if (!input || typeof input !== "object") return null;
  const { name, label, value } = input as Record<string, unknown>;
  if (typeof name !== "string" || typeof label !== "string") return null;

  const cleanValue = Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .slice(0, 30)
        .map((item) => item.slice(0, 200).trim())
    : typeof value === "string"
      ? value.slice(0, MAX_FIELD_LENGTH).trim()
      : "";

  return { name, label: label.slice(0, 200), value: cleanValue };
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: a field no human fills in. Pretend it worked and drop it.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const answers = (Array.isArray(body.answers) ? body.answers : [])
    .slice(0, MAX_ANSWERS)
    .map(cleanAnswer)
    .filter((answer): answer is Answer => answer !== null);

  const answeredNames = new Set(
    answers
      .filter((answer) => (Array.isArray(answer.value) ? answer.value.length > 0 : answer.value !== ""))
      .map((answer) => answer.name),
  );

  const missing = REQUIRED_ANSWER_NAMES.filter((name) => !answeredNames.has(name));
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required answers: ${missing.join(", ")}` },
      { status: 422 },
    );
  }

  const email = answers.find((answer) => answer.name === "email")?.value;
  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address looks wrong." },
      { status: 422 },
    );
  }

  const result = await sendProjectEnquiry(answers, email);

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (!result.configured) {
    // No email provider connected yet — the client offers a pre-filled email instead.
    return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  }

  return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
}
