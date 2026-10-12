import { createHash, randomInt, randomUUID } from "node:crypto";
import type { Answer } from "@/lib/enquiry";
import { getDb } from "@/lib/mongodb";
import { ENQUIRIES, valueOf } from "@/lib/submissions";

/**
 * A client dashboard.
 *
 * Every enquiry becomes a project: the same document that holds the answers
 * also holds the dashboard the client signs in to see. That keeps one record
 * per client instead of two lists that can drift apart.
 */

/* The dashboard's shape and labels live in their own module so browser
   components can use them without the MongoDB driver. */
export * from "@/lib/project-types";
import {
  MESSAGE_LIMIT,
  MESSAGE_MAX_LENGTH,
  PROJECT_STATUSES,
  STATUS_NOTES,
  type Project,
  type ProjectItem,
  type ProjectLink,
  type ProjectMessage,
  type ProjectStat,
  type ProjectStatus,
  type ProjectUpdate,
} from "@/lib/project-types";

/* How a dashboard is stored on an enquiry document. */
type ProjectDoc = {
  id: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  answers?: Answer[];
  codeHash?: string;
  codeCreatedAt?: Date | string;
  status?: string;
  title?: string;
  statusNote?: string;
  workingOn?: string;
  deadline?: string;
  deadlineLabel?: string;
  stats?: ProjectStat[];
  updates?: ProjectUpdate[];
  checklist?: ProjectItem[];
  links?: ProjectLink[];
  messages?: ProjectMessage[];
};

/* --------------------------------------------------------- access codes ---- */

/**
 * 12 characters from a 32-symbol alphabet with no lookalikes (no 0/O, 1/I).
 * That is 60 bits of randomness, so a leaked database is not a password list:
 * a stored SHA-256 of a code is not worth attacking offline.
 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const GROUPS = 3;
const GROUP_SIZE = 4;
export const ACCESS_CODE_LENGTH = GROUPS * GROUP_SIZE;

export function newAccessCode() {
  const groups: string[] = [];
  for (let group = 0; group < GROUPS; group += 1) {
    let chunk = "";
    for (let index = 0; index < GROUP_SIZE; index += 1) {
      chunk += ALPHABET[randomInt(ALPHABET.length)];
    }
    groups.push(chunk);
  }
  return groups.join("-");
}

/** Case- and punctuation-insensitive, so a pasted code always matches. */
export function normalizeAccessCode(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, ACCESS_CODE_LENGTH);
}

export function isAccessCodeShaped(input: string) {
  return normalizeAccessCode(input).length === ACCESS_CODE_LENGTH;
}

export function hashAccessCode(input: string) {
  return createHash("sha256").update(normalizeAccessCode(input)).digest("hex");
}

/* ------------------------------------------------------------- defaults ---- */

const AGAIN = "I'll update this page as it moves.";

function defaultChecklist(): ProjectItem[] {
  return [
    ["Enquiry received", true],
    ["Kick-off call", false],
    ["Content collected", false],
    ["First design look", false],
    ["Build", false],
    ["Your review", false],
    ["Launch", false],
  ].map(([label, done]) => ({ id: randomUUID(), label: label as string, done: done as boolean }));
}

function defaultTitle(answers: Answer[]) {
  const named = valueOf(answers, "projectName").trim();
  if (named) return named;
  const kind = valueOf(answers, "projectType").trim();
  return kind ? `${kind}` : "Your website";
}

function defaultStats(answers: Answer[]): ProjectStat[] {
  const stats: ProjectStat[] = [{ id: randomUUID(), label: "Stage", value: "Brief review" }];
  const pages = valueOf(answers, "pages");
  if (pages) {
    const count = pages.split(",").map((page) => page.trim()).filter(Boolean).length;
    stats.push({ id: randomUUID(), label: "Pages", value: String(count) });
  }
  return stats;
}

function asIso(value: Date | string | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function byNewest(a: ProjectUpdate, b: ProjectUpdate) {
  return b.at.localeCompare(a.at);
}

function toProject(doc: ProjectDoc): Project {
  const answers = doc.answers ?? [];
  const status = PROJECT_STATUSES.includes(doc.status as ProjectStatus)
    ? (doc.status as ProjectStatus)
    : "reviewing";

  return {
    id: doc.id,
    createdAt: asIso(doc.createdAt),
    updatedAt: asIso(doc.updatedAt) || asIso(doc.createdAt),
    name: valueOf(answers, "name").trim() || "there",
    email: valueOf(answers, "email").trim(),
    title: doc.title?.trim() || defaultTitle(answers),
    status,
    statusNote: doc.statusNote?.trim() || STATUS_NOTES[status],
    workingOn: doc.workingOn ?? "",
    deadline: doc.deadline ?? "",
    deadlineLabel: doc.deadlineLabel?.trim() || "Target launch",
    stats: doc.stats ?? [],
    updates: [...(doc.updates ?? [])].sort(byNewest),
    checklist: doc.checklist ?? [],
    links: doc.links ?? [],
    messages: doc.messages ?? [],
    answers,
    hasCode: Boolean(doc.codeHash),
    codeCreatedAt: asIso(doc.codeCreatedAt),
  };
}

/* ------------------------------------------------------------- writing ---- */

/**
 * Turns a stored enquiry into a dashboard: mints the client's access code and
 * seeds the page so it is never empty when they first sign in.
 */
export async function startProject(id: string, answers: Answer[]) {
  const db = await getDb();
  const code = newAccessCode();
  const now = new Date();
  const askedFor = valueOf(answers, "deadline").trim();

  const result = await db.collection<ProjectDoc>(ENQUIRIES).updateOne(
    { id },
    {
      $set: {
        codeHash: hashAccessCode(code),
        codeCreatedAt: now,
        updatedAt: now,
        status: "reviewing",
        title: defaultTitle(answers),
        statusNote: STATUS_NOTES.reviewing,
        workingOn: "Reading your brief and working out what it needs before I quote it.",
        deadline: askedFor,
        deadlineLabel: askedFor ? "Your requested date" : "Target launch",
        stats: defaultStats(answers),
        checklist: defaultChecklist(),
        links: [],
        messages: [
          {
            id: randomUUID(),
            at: now.toISOString(),
            from: "sawyer",
            body: "This is our thread — ask me anything about the build here and I'll answer in it. It stays with your project, so nothing gets lost in an inbox.",
          },
        ],
        updates: [
          {
            id: randomUUID(),
            at: now.toISOString(),
            title: "Enquiry received",
            body: `Thanks for getting in touch. Your brief is with me and I'll reply within a day. ${AGAIN}`,
          },
        ],
      },
    },
  );

  return result.matchedCount === 1 ? { code } : null;
}

/** Replaces the project's code. The old one stops working immediately. */
export async function rotateAccessCode(id: string) {
  const db = await getDb();
  const code = newAccessCode();
  const now = new Date();
  const result = await db.collection<ProjectDoc>(ENQUIRIES).updateOne(
    { id },
    { $set: { codeHash: hashAccessCode(code), codeCreatedAt: now, updatedAt: now } },
  );
  return result.matchedCount === 1 ? { code } : null;
}

/* -------------------------------------------------------------- reading ---- */

export async function getProject(id: string): Promise<Project | null> {
  const db = await getDb();
  const doc = await db
    .collection<ProjectDoc>(ENQUIRIES)
    .findOne({ id }, { projection: { _id: 0 } });
  return doc ? toProject(doc) : null;
}

export async function listProjects(): Promise<Project[]> {
  const db = await getDb();
  const docs = await db
    .collection<ProjectDoc>(ENQUIRIES)
    .find({ codeHash: { $exists: true } }, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(300)
    .toArray();
  return docs.map(toProject);
}

export async function getProjectByCode(input: string): Promise<Project | null> {
  if (!isAccessCodeShaped(input)) return null;
  const db = await getDb();
  const doc = await db
    .collection<ProjectDoc>(ENQUIRIES)
    .findOne({ codeHash: hashAccessCode(input) }, { projection: { _id: 0 } });
  return doc ? toProject(doc) : null;
}

/* ---------------------------------------------------------------- chat ---- */

/**
 * Live chat between Sawyer and one client, stored on the same record as the
 * dashboard so a client only ever sees their own thread.
 *
 * There is no socket: the browser polls. A serverless deployment has no
 * long-lived process to hold a connection open, and a five-second poll on a
 * thread between two people is indistinguishable from live.
 */
export async function appendProjectMessage(
  id: string,
  from: ProjectMessage["from"],
  body: string,
): Promise<ProjectMessage | null> {
  const text = body.replace(/\r\n/g, "\n").trim().slice(0, MESSAGE_MAX_LENGTH);
  if (text === "") return null;

  const message: ProjectMessage = {
    id: randomUUID(),
    at: new Date().toISOString(),
    from,
    body: text,
  };

  const db = await getDb();
  const result = await db.collection<ProjectDoc>(ENQUIRIES).updateOne(
    { id },
    {
      $push: { messages: { $each: [message], $slice: -MESSAGE_LIMIT } },
      $set: { updatedAt: new Date() },
    },
  );

  return result.matchedCount === 1 ? message : null;
}

/** Removes one message — the admin's way to take back a typo. */
export async function deleteProjectMessage(id: string, messageId: string): Promise<boolean> {
  const db = await getDb();
  const result = await db
    .collection<ProjectDoc>(ENQUIRIES)
    .updateOne({ id }, { $pull: { messages: { id: messageId } } });
  return result.modifiedCount === 1;
}

/** The thread alone, for the polling endpoint. Null means no such project. */
export async function getProjectMessages(id: string): Promise<ProjectMessage[] | null> {
  const db = await getDb();
  const doc = await db
    .collection<ProjectDoc>(ENQUIRIES)
    .findOne({ id }, { projection: { _id: 0, messages: 1 } });
  return doc ? (doc.messages ?? []) : null;
}

/* -------------------------------------------------------------- editing ---- */

export type ProjectPatch = Partial<
  Pick<
    Project,
    | "title"
    | "status"
    | "statusNote"
    | "workingOn"
    | "deadline"
    | "deadlineLabel"
    | "stats"
    | "updates"
    | "checklist"
    | "links"
  >
>;

const LIMITS = { stats: 8, updates: 60, checklist: 40, links: 10 } as const;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function list<T extends { id?: unknown }>(value: unknown, max: number) {
  return Array.isArray(value) ? (value.slice(0, max) as T[]) : [];
}

function cleanStats(value: unknown): ProjectStat[] {
  return list<ProjectStat>(value, LIMITS.stats)
    .map((entry) => ({
      id: text(entry?.id, 64) || randomUUID(),
      label: text(entry?.label, 60),
      value: text(entry?.value, 120),
    }))
    .filter((entry) => entry.label !== "" || entry.value !== "");
}

function cleanUpdates(value: unknown): ProjectUpdate[] {
  return list<ProjectUpdate>(value, LIMITS.updates)
    .map((entry) => {
      const at = text(entry?.at, 40);
      const parsed = at ? new Date(at) : null;
      return {
        id: text(entry?.id, 64) || randomUUID(),
        at: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString(),
        title: text(entry?.title, 120),
        body: text(entry?.body, 2000),
      };
    })
    .filter((entry) => entry.title !== "" || entry.body !== "");
}

function cleanChecklist(value: unknown): ProjectItem[] {
  return list<ProjectItem>(value, LIMITS.checklist)
    .map((entry) => ({
      id: text(entry?.id, 64) || randomUUID(),
      label: text(entry?.label, 120),
      done: entry?.done === true,
    }))
    .filter((entry) => entry.label !== "");
}

function cleanLinks(value: unknown): ProjectLink[] {
  return list<ProjectLink>(value, LIMITS.links)
    .map((entry) => ({
      id: text(entry?.id, 64) || randomUUID(),
      label: text(entry?.label, 60),
      href: text(entry?.href, 500),
    }))
    .filter((entry) => entry.label !== "" && /^https?:\/\//i.test(entry.href));
}

/** Applies an edit from the admin panel. Returns the saved project. */
export async function updateProject(id: string, patch: ProjectPatch): Promise<Project | null> {
  const db = await getDb();
  const $set: Record<string, unknown> = { updatedAt: new Date() };

  if (patch.title !== undefined) $set.title = text(patch.title, 120);
  if (patch.status !== undefined && PROJECT_STATUSES.includes(patch.status)) {
    $set.status = patch.status;
  }
  if (patch.statusNote !== undefined) $set.statusNote = text(patch.statusNote, 500);
  if (patch.workingOn !== undefined) $set.workingOn = text(patch.workingOn, 2000);
  if (patch.deadlineLabel !== undefined) $set.deadlineLabel = text(patch.deadlineLabel, 60);
  if (patch.deadline !== undefined) {
    const raw = text(patch.deadline, 10);
    $set.deadline = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
  }
  if (patch.stats !== undefined) $set.stats = cleanStats(patch.stats);
  if (patch.updates !== undefined) $set.updates = cleanUpdates(patch.updates);
  if (patch.checklist !== undefined) $set.checklist = cleanChecklist(patch.checklist);
  if (patch.links !== undefined) $set.links = cleanLinks(patch.links);

  const doc = await db
    .collection<ProjectDoc>(ENQUIRIES)
    .findOneAndUpdate(
      { id },
      { $set },
      { returnDocument: "after", projection: { _id: 0 } },
    );

  return doc ? toProject(doc as ProjectDoc) : null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.collection<ProjectDoc>(ENQUIRIES).deleteOne({ id });
  return result.deletedCount === 1;
}

