"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  Plus,
  Save,
  ScanEye,
  Trash2,
  X,
} from "lucide-react";
import {
  PROJECT_STATUSES,
  STATUS_LABELS,
  projectProgress,
  type Project,
  type ProjectItem,
  type ProjectLink,
  type ProjectStat,
  type ProjectUpdate,
  type ProjectStatus,
} from "@/lib/project-types";
import { ProjectChat } from "@/components/project-chat";
import { DashboardMedia } from "@/components/dashboard-media";

type Draft = {
  title: string;
  status: ProjectStatus;
  statusNote: string;
  workingOn: string;
  deadline: string;
  deadlineLabel: string;
  stats: ProjectStat[];
  updates: ProjectUpdate[];
  checklist: ProjectItem[];
  links: ProjectLink[];
};

function id() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function draftOf(project: Project): Draft {
  return {
    title: project.title,
    status: project.status,
    statusNote: project.statusNote,
    workingOn: project.workingOn,
    deadline: project.deadline,
    deadlineLabel: project.deadlineLabel,
    stats: project.stats,
    updates: project.updates,
    checklist: project.checklist,
    links: project.links,
  };
}

const input =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-muted/60 hover:border-line-strong focus:border-ink focus:outline-none";
const label = "mb-2 block font-mono text-[11px] tracking-[0.14em] text-muted uppercase";
const smallButton =
  "inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink";

/** Everything there is to edit about one client's dashboard. */
export function AdminProjectEditor({ project }: { project: Project }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(() => draftOf(project));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const progress = projectProgress({ ...project, checklist: draft.checklist });

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function editList<K extends "stats" | "updates" | "checklist" | "links">(
    key: K,
    index: number,
    patch: Partial<Draft[K][number]>,
  ) {
    setDraft((current) => ({
      ...current,
      [key]: current[key].map((entry, position) =>
        position === index ? { ...entry, ...patch } : entry,
      ),
    }));
    setSaved(false);
  }

  function removeFromList(key: "stats" | "updates" | "checklist" | "links", index: number) {
    setDraft((current) => ({
      ...current,
      [key]: current[key].filter((_, position) => position !== index),
    }));
    setSaved(false);
  }

  function addToList(key: "stats" | "updates" | "checklist" | "links") {
    const entry =
      key === "stats"
        ? { id: id(), label: "", value: "" }
        : key === "updates"
          ? { id: id(), at: new Date().toISOString(), title: "", body: "" }
          : key === "checklist"
            ? { id: id(), label: "", done: false }
            : { id: id(), label: "", href: "https://" };

    setDraft((current) => ({
      ...current,
      [key]: key === "updates" ? [entry, ...current.updates] : [...current[key], entry],
    }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; project?: Project; error?: string }
        | null;

      if (!response.ok || !data?.ok || !data.project) {
        setError(data?.error ?? "Could not save that.");
        return;
      }
      setDraft(draftOf(data.project));
      setSaved(true);
      router.refresh();
    } catch {
      setError("I couldn't reach the server.");
    } finally {
      setSaving(false);
    }
  }

  async function issueCode() {
    setIssuing(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}/code`, { method: "POST" });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; code?: string; error?: string }
        | null;
      if (!response.ok || !data?.ok || !data.code) {
        setError(data?.error ?? "Could not issue a code.");
        return;
      }
      setCode(data.code);
      setCopied(false);
      router.refresh();
    } catch {
      setError("I couldn't reach the server.");
    } finally {
      setIssuing(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete ${project.title} and its enquiry for good?`)) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      if (response.ok) router.push("/admin");
      else setError("Could not delete that.");
    } catch {
      setError("I couldn't reach the server.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Client dashboard
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {project.name}
            {project.email ? ` · ${project.email}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/dashboard/p/${project.id}`}
            className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <ScanEye className="h-3.5 w-3.5 text-warm" />
            Preview
          </Link>
          <Link href="/admin" className="text-sm text-muted transition-colors hover:text-ink">
            Back to admin
          </Link>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {/* Status ------------------------------------------------------------ */}
      <section className="surface mt-10 p-6 md:p-7">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Where it stands
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECT_STATUSES.map((status) => {
            const active = draft.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => set("status", status)}
                aria-pressed={active}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  active ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-line-strong"
                }`}
              >
                {STATUS_LABELS[status]}
              </button>
            );
          })}
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <div>
            <label className={label} htmlFor="project-title">
              Project title
            </label>
            <input
              id="project-title"
              className={input}
              value={draft.title}
              onChange={(event) => set("title", event.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="project-status-note">
              Note under the status
            </label>
            <input
              id="project-status-note"
              className={input}
              value={draft.statusNote}
              placeholder="Leave blank for my default wording"
              onChange={(event) => set("statusNote", event.target.value)}
            />
          </div>
          <div className="lg:col-span-2">
            <label className={label} htmlFor="project-working-on">
              What I&apos;m working on right now
            </label>
            <textarea
              id="project-working-on"
              rows={3}
              className={`${input} resize-y`}
              value={draft.workingOn}
              onChange={(event) => set("workingOn", event.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="project-deadline">
              Launch date
            </label>
            <input
              id="project-deadline"
              type="date"
              className={input}
              value={draft.deadline}
              onChange={(event) => set("deadline", event.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="project-deadline-label">
              What to call that date
            </label>
            <input
              id="project-deadline-label"
              className={input}
              value={draft.deadlineLabel}
              placeholder="Target launch"
              onChange={(event) => set("deadlineLabel", event.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Stats ------------------------------------------------------------- */}
      <section className="surface mt-6 p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Current stats
          </h2>
          <button type="button" onClick={() => addToList("stats")} className={smallButton}>
            <Plus className="h-3.5 w-3.5" />
            Add a stat
          </button>
        </div>

        {draft.stats.length === 0 ? (
          <p className="mt-5 text-sm text-muted">No stats shown. Add a couple of figures.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {draft.stats.map((stat, index) => (
              <li key={stat.id} className="flex flex-wrap items-center gap-3">
                <input
                  aria-label="Stat label"
                  className={`${input} sm:w-52`}
                  value={stat.label}
                  placeholder="Pages"
                  onChange={(event) => editList("stats", index, { label: event.target.value })}
                />
                <input
                  aria-label="Stat value"
                  className={`${input} sm:flex-1`}
                  value={stat.value}
                  placeholder="3 of 5"
                  onChange={(event) => editList("stats", index, { value: event.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeFromList("stats", index)}
                  aria-label="Remove this stat"
                  className="text-muted transition-colors hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Checklist --------------------------------------------------------- */}
      <section className="surface mt-6 p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              Checklist
            </h2>
            <p className="mt-2 text-xs text-muted">
              Ticking these off moves the progress bar on the client&apos;s page:{" "}
              {progress.done}/{progress.total} · {progress.percent}%
            </p>
          </div>
          <button type="button" onClick={() => addToList("checklist")} className={smallButton}>
            <Plus className="h-3.5 w-3.5" />
            Add a step
          </button>
        </div>

        {draft.checklist.length === 0 ? (
          <p className="mt-5 text-sm text-muted">No steps yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {draft.checklist.map((item, index) => (
              <li key={item.id} className="flex items-center gap-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.done}
                  aria-label={item.label || "Step"}
                  onClick={() => editList("checklist", index, { done: !item.done })}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    item.done
                      ? "border-ink bg-ink text-paper"
                      : "border-line-strong text-transparent hover:border-ink"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <input
                  aria-label="Step"
                  className={input}
                  value={item.label}
                  placeholder="Launch"
                  onChange={(event) => editList("checklist", index, { label: event.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeFromList("checklist", index)}
                  aria-label="Remove this step"
                  className="text-muted transition-colors hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Updates ----------------------------------------------------------- */}
      <section className="surface mt-6 p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              Updates
            </h2>
            <p className="mt-2 text-xs text-muted">
              Newest first on the client&apos;s page. Adding one stamps it with today.
            </p>
          </div>
          <button type="button" onClick={() => addToList("updates")} className={smallButton}>
            <Plus className="h-3.5 w-3.5" />
            Add an update
          </button>
        </div>

        {draft.updates.length === 0 ? (
          <p className="mt-5 text-sm text-muted">Nothing posted yet.</p>
        ) : (
          <ul className="mt-6 space-y-5">
            {draft.updates.map((update, index) => (
              <li key={update.id} className="rounded-xl border border-line p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    aria-label="Update title"
                    className={`${input} sm:flex-1`}
                    value={update.title}
                    placeholder="Design first look is ready"
                    onChange={(event) => editList("updates", index, { title: event.target.value })}
                  />
                  <span className="font-mono text-[11px] whitespace-nowrap text-muted uppercase">
                    {new Date(update.at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      timeZone: "America/Chicago",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFromList("updates", index)}
                    aria-label="Remove this update"
                    className="text-muted transition-colors hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  aria-label="Update body"
                  rows={3}
                  className={`${input} mt-3 resize-y`}
                  value={update.body}
                  placeholder="A sentence or two on where things are."
                  onChange={(event) => editList("updates", index, { body: event.target.value })}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Chat -------------------------------------------------------------- */}
      <ProjectChat
        endpoint={`/api/admin/projects/${project.id}/chat`}
        role="admin"
        otherName={project.name || "the client"}
        initialMessages={project.messages}
      />


      {/* Client Media & Assets */}
      <section className="surface mt-6 p-6 md:p-7">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase mb-4">
          Client media & assets
        </h2>
        <DashboardMedia initialMedia={project.media || []} projectId={project.id} isAdmin={true} />
      </section>

      {/* Links ------------------------------------------------------------- */}
      <section className="surface mt-6 p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Project links
          </h2>
          <button type="button" onClick={() => addToList("links")} className={smallButton}>
            <Plus className="h-3.5 w-3.5" />
            Add a link
          </button>
        </div>

        {draft.links.length === 0 ? (
          <p className="mt-5 text-sm text-muted">
            Nothing shared yet. A staging URL or a design file goes here.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {draft.links.map((link, index) => (
              <li key={link.id} className="flex flex-wrap items-center gap-3">
                <input
                  aria-label="Link label"
                  className={`${input} sm:w-52`}
                  value={link.label}
                  placeholder="Staging site"
                  onChange={(event) => editList("links", index, { label: event.target.value })}
                />
                <input
                  aria-label="Link address"
                  className={`${input} sm:flex-1`}
                  value={link.href}
                  placeholder="https://"
                  onChange={(event) => editList("links", index, { href: event.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeFromList("links", index)}
                  aria-label="Remove this link"
                  className="text-muted transition-colors hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted">
          Only http and https addresses are kept — anything else is dropped on save.
        </p>
      </section>

      {/* Save -------------------------------------------------------------- */}
      <div className="sticky bottom-4 z-10 mt-6">
        <div className="surface flex flex-wrap items-center justify-between gap-4 border border-line-strong p-4">
          <p className="text-sm text-muted">
            {saved ? (
              <span className="inline-flex items-center gap-2 text-mint">
                <Check className="h-4 w-4" />
                Saved. The client sees this straight away.
              </span>
            ) : (
              "Changes are live as soon as you save."
            )}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="btn3d btn3d-dark inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Access code ------------------------------------------------------- */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Access code
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
          {project.hasCode
            ? "This client has a code. It is stored hashed, so I can't show it again — issue a new one and send it to them, and the old one stops working immediately."
            : "No code has been issued for this dashboard yet. Issue one and send it to the client."}
          {project.codeCreatedAt
            ? ` Current code issued ${new Date(project.codeCreatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "America/Chicago",
              })}.`
            : ""}
        </p>

        {code ? (
          <div className="mt-5 rounded-xl border border-warm/40 bg-warm-tint p-5">
            <p className="font-mono text-[11px] tracking-[0.18em] text-warm-deep uppercase">
              New code — copy it now
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <code className="chip3d rounded-lg border border-line bg-paper px-4 py-2.5 font-mono text-lg tracking-[0.14em]">
                {code}
              </code>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(code);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  } catch {
                    setCopied(false);
                  }
                }}
                className={smallButton}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-3 text-xs text-warm-deep">
              Shown once. Send it to {project.email || "the client"} now.
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={issueCode}
            disabled={issuing}
            className={smallButton}
          >
            {issuing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {issuing ? "Issuing…" : project.hasCode ? "Issue a new code" : "Issue a code"}
          </button>
          <Link
            href={`/dashboard/p/${project.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            See their page
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Danger zone ------------------------------------------------------- */}
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Delete
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
          Removes the dashboard <em>and</em> the original enquiry — it is the same record. The
          client&apos;s code stops working.
        </p>
        <button
          type="button"
          onClick={remove}
          disabled={deleting}
          className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-red-700 disabled:opacity-60"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete this dashboard
        </button>
      </section>
    </div>
  );
}
