import { randomUUID } from "node:crypto";
import type { Answer } from "@/lib/enquiry";
import { getDb, isStorageConfigured } from "@/lib/mongodb";

/**
 * Enquiries are stored here as well as emailed, so a mail outage or a missing
 * email key can never lose a lead. Read back in /admin.
 */
export const ENQUIRIES = "enquiries";
const MAX_LISTED = 300;

type SubmissionDoc = {
  id: string;
  createdAt: Date;
  answers: Answer[];
};

export type Submission = {
  id: string;
  createdAt: string;
  answers: Answer[];
};

export { isStorageConfigured };

/** Flattens an answer list value into display text. */
export function valueOf(answers: Answer[], name: string) {
  const answer = answers.find((entry) => entry.name === name);
  if (!answer) return "";
  return Array.isArray(answer.value) ? answer.value.join(", ") : answer.value;
}

export function submissionName(submission: Submission) {
  return valueOf(submission.answers, "name") || "Unnamed enquiry";
}

export function submissionEmail(submission: Submission) {
  return valueOf(submission.answers, "email");
}

export async function saveSubmission(
  answers: Answer[],
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const db = await getDb();
    const id = randomUUID();
    await db.collection<SubmissionDoc>(ENQUIRIES).insertOne({ id, createdAt: new Date(), answers });
    return { ok: true, id };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save the enquiry.",
    };
  }
}

export async function listSubmissions(): Promise<Submission[]> {
  const db = await getDb();
  const docs = await db
    .collection<SubmissionDoc>(ENQUIRIES)
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(MAX_LISTED)
    .toArray();

  return docs.map((doc) => ({
    id: doc.id,
    createdAt: doc.createdAt.toISOString(),
    answers: doc.answers ?? [],
  }));
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection<SubmissionDoc>(ENQUIRIES).deleteOne({ id });
  return result.deletedCount === 1;
}

export async function countSubmissions(): Promise<number> {
  const db = await getDb();
  return db.collection<SubmissionDoc>(ENQUIRIES).countDocuments();
}

/* ------------------------------------------------------------------ CSV ---- */

function csvCell(value: string) {
  // Quote everything: labels contain commas and quotes.
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * A spreadsheet-friendly export: the fields you need at a glance, then every
 * answer to the enquiry in one column.
 */
export function submissionsCsv(submissions: Submission[]) {
  const header = ["Received", "Name", "Email", "Phone", "Project type", "Timeframe", "Details"];

  const rows = submissions.map((submission) =>
    [
      new Date(submission.createdAt).toISOString(),
      submissionName(submission),
      submissionEmail(submission),
      valueOf(submission.answers, "phone"),
      valueOf(submission.answers, "projectType"),
      valueOf(submission.answers, "timeframe"),
      submission.answers
        .filter((answer) =>
          Array.isArray(answer.value) ? answer.value.length > 0 : answer.value.trim() !== "",
        )
        .map((answer) => {
          const value = Array.isArray(answer.value) ? answer.value.join(", ") : answer.value;
          return `${answer.label}: ${value}`;
        })
        .join(" | "),
    ].map(csvCell),
  );

  return [header.map(csvCell).join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}
