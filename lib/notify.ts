import { site } from "@/content/site";
import { enquiryText, type Answer } from "@/lib/enquiry";

/**
 * Sends project enquiries by email through Plunk's transactional API.
 * https://docs.useplunk.com/api-reference/public-api/sendEmail
 */
const PLUNK_ENDPOINT = "https://next-api.useplunk.com/v1/send";

export type SendResult =
  | { ok: true; id?: string }
  | { ok: false; configured: false }
  | { ok: false; configured: true; error: string };

export function isEmailConfigured() {
  return Boolean(process.env.PLUNK_SECRET_KEY);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );
}

export async function sendProjectEnquiry(answers: Answer[], replyTo?: string): Promise<SendResult> {
  const key = process.env.PLUNK_SECRET_KEY;
  if (!key) return { ok: false, configured: false };

  const rows = enquiryText(answers)
    .split("\n")
    .map((line) => {
      const separator = line.indexOf(": ");
      const label = separator === -1 ? line : line.slice(0, separator);
      const value = separator === -1 ? "" : line.slice(separator + 2);
      return `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;color:#666;white-space:nowrap;font-weight:600">${escapeHtml(
        label,
      )}</td><td style="padding:6px 0;vertical-align:top">${escapeHtml(value)}</td></tr>`;
    })
    .join("");

  const name = answers.find((answer) => answer.name === "name")?.value;
  const subjectName = typeof name === "string" && name.trim() !== "" ? name : "website project";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(PLUNK_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: process.env.CONTACT_TO_EMAIL ?? site.email,
        from: process.env.CONTACT_FROM_EMAIL ?? site.email,
        subject: `New project enquiry — ${subjectName}`,
        body: `<h2 style="font-family:sans-serif">New project enquiry</h2><table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table><p style="font-family:sans-serif;font-size:12px;color:#666">Sent from ${site.url}/start</p>`,
        ...(replyTo ? { reply: replyTo } : {}),
      }),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => null)) as
      | {
          success?: boolean;
          data?: { emails?: { email?: string }[] };
          error?: { message?: string };
        }
      | null;

    if (!response.ok || !data?.success) {
      return {
        ok: false,
        configured: true,
        error: data?.error?.message ?? `Plunk responded with ${response.status}`,
      };
    }

    return { ok: true, id: data.data?.emails?.[0]?.email };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      error: error instanceof Error ? error.message : "Unknown error sending the enquiry",
    };
  } finally {
    clearTimeout(timeout);
  }
}
