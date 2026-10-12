import type { Answer } from "@/lib/enquiry";

/**
 * The shape of a client dashboard, with no database attached.
 *
 * Kept separate from lib/projects.ts so components that run in the browser can
 * use these types and labels without pulling in the MongoDB driver.
 */

/* --------------------------------------------------------------- shapes ---- */

export const PROJECT_STATUSES = ["reviewing", "accepted", "declined", "delivered"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  reviewing: "Under review",
  accepted: "Accepted — in progress",
  declined: "Not taken on",
  delivered: "Delivered",
};

/** Copy shown to the client for each status, written in the first person. */
export const STATUS_NOTES: Record<ProjectStatus, string> = {
  reviewing: "Thanks for the brief — I'm reading it now and will reply within a day.",
  accepted: "Your project is on. I'll keep this page up to date as it moves.",
  declined: "I'm not able to take this one on. Nothing is owed, and I'm happy to say why.",
  delivered: "Your site is live. Anything that breaks in the first 30 days, tell me and I'll fix it.",
};

export type ProjectUpdate = { id: string; at: string; title: string; body: string };
export type ProjectMessage = {
  id: string;
  at: string;
  /** Who wrote it: Sawyer, or the client whose dashboard it is. */
  from: "sawyer" | "client";
  body: string;
};
export type ProjectItem = { id: string; label: string; done: boolean };
export type ProjectLink = { id: string; label: string; href: string };
export type ProjectStat = { id: string; label: string; value: string };

export type ProjectMedia = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  category: "logo" | "image" | "document" | "other";
  url: string;
  uploadedAt: string;
  uploadedBy: "client" | "sawyer";
  storage: "r2" | "database";
  r2Key?: string;
};

/** Longest message the chat will store, matching the API's own limit. */
export const MESSAGE_MAX_LENGTH = 1000;
/** Chat is a conversation, not an archive: only the last few hundred are kept. */
export const MESSAGE_LIMIT = 500;

export type Project = {
  id: string;
  createdAt: string;
  updatedAt: string;
  /** Client name, taken from the enquiry. */
  name: string;
  email: string;
  title: string;
  status: ProjectStatus;
  statusNote: string;
  workingOn: string;
  /** `YYYY-MM-DD`, or empty. */
  deadline: string;
  deadlineLabel: string;
  stats: ProjectStat[];
  updates: ProjectUpdate[];
  checklist: ProjectItem[];
  links: ProjectLink[];
  /** The live chat thread, oldest first. */
  messages: ProjectMessage[];
  media: ProjectMedia[];
  answers: Answer[];
  /** False if no code has ever been issued, so there is nothing to sign in with. */
  hasCode: boolean;
  codeCreatedAt: string;
};

/** Checklist completion — drives the progress bar on the client's page. */
export function projectProgress(project: Project) {
  const total = project.checklist.length;
  const done = project.checklist.filter((item) => item.done).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}
