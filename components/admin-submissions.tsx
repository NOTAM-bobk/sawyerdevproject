"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, LogOut, Mail, Search, Trash2 } from "lucide-react";

type Submission = {
  id: string;
  createdAt: string;
  answers: { name: string; label: string; value: string | string[] }[];
};

function valueOf(submission: Submission, name: string) {
  const answer = submission.answers.find((entry) => entry.name === name);
  if (!answer) return "";
  return Array.isArray(answer.value) ? answer.value.join(", ") : answer.value;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  });
}

/** List of stored enquiries, with delete, search and CSV export. */
export function AdminSubmissions({
  submissions,
  storageReady,
  storageError = "",
}: {
  submissions: Submission[];
  storageReady: boolean;
  /** Set when the database could not be reached. */
  storageError?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return submissions;
    return submissions.filter((submission) =>
      submission.answers.some((answer) => {
        const value = Array.isArray(answer.value) ? answer.value.join(", ") : answer.value;
        return value.toLowerCase().includes(needle);
      }),
    );
  }, [query, submissions]);

  async function remove(id: string) {
    setDeleting(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Could not delete that enquiry.");
        return;
      }
      router.refresh();
    } catch {
      setError("I couldn't reach the server.");
    } finally {
      setDeleting(null);
    }
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">Admin</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Enquiries.</h1>
          <p className="mt-3 text-sm text-muted">
            {!storageReady
              ? "Storage is not connected yet."
              : storageError
                ? "Storage could not be reached."
                : `${submissions.length} stored. Newest first.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/api/admin/export"
            className="btn3d btn3d-light inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] font-medium text-ink"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </a>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>

      {!storageReady ? (
        <p className="mt-8 rounded-xl border border-line bg-mist p-5 text-sm leading-relaxed text-ink-soft">
          Add <code className="font-mono text-xs">MONGODB_URI</code> to your environment variables and
          redeploy. Until then the form still works, but nothing is kept here — it only offers the
          pre-filled email.
        </p>
      ) : null}

      {storageError ? (
        <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm leading-relaxed text-red-700">
          The database could not be reached, so nothing is listed here. Enquiries are still being
          emailed, and anything that arrives while it is down is not stored — check{" "}
          <code className="font-mono text-xs">MONGODB_URI</code> and the cluster&apos;s network access
          rules.
          <span className="mt-2 block font-mono text-[11px] break-all opacity-80">{storageError}</span>
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {storageReady && submissions.length > 0 ? (
        <div className="relative mt-8 max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search answers…"
            aria-label="Search enquiries"
            className="w-full rounded-lg border border-line bg-paper py-2.5 pr-4 pl-9 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
          />
        </div>
      ) : null}

      {storageReady && submissions.length === 0 ? (
        <p className="mt-10 text-sm text-muted">No enquiries yet. They will appear here.</p>
      ) : null}

      {storageReady && filtered.length === 0 && submissions.length > 0 ? (
        <p className="mt-10 text-sm text-muted">Nothing matches “{query}”.</p>
      ) : null}

      <ul className="mt-8 space-y-5">
        {filtered.map((submission) => {
          const email = valueOf(submission, "email");
          const name = valueOf(submission, "name");
          return (
            <li key={submission.id} className="surface p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-base font-medium tracking-[-0.02em]">{name || "Unnamed"}</h2>
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      <Mail className="h-3.5 w-3.5 text-warm" />
                      {email}
                    </a>
                  ) : null}
                </div>
                <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
                  {formatDate(submission.createdAt)}
                </span>
              </div>

              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
                <span>{valueOf(submission, "phone") || "No phone"}</span>
                <span>{valueOf(submission, "projectType") || "No project type"}</span>
                <span>{valueOf(submission, "timeframe") || "No timeframe"}</span>
              </p>

              <details className="group mt-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 border-t border-line pt-4 font-mono text-[11px] tracking-[0.14em] text-muted uppercase [&::-webkit-details-marker]:hidden">
                  All answers
                  <span aria-hidden="true" className="text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <dl className="mt-4 space-y-3">
                  {submission.answers
                    .filter((answer) =>
                      Array.isArray(answer.value) ? answer.value.length > 0 : answer.value.trim() !== "",
                    )
                    .map((answer) => (
                      <div key={answer.name} className="grid gap-1 sm:grid-cols-[230px_1fr] sm:gap-4">
                        <dt className="text-xs text-muted">{answer.label}</dt>
                        <dd className="text-sm text-ink-soft">
                          {Array.isArray(answer.value) ? answer.value.join(", ") : answer.value}
                        </dd>
                      </div>
                    ))}
                </dl>
              </details>

              <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-line pt-4">
                {email ? (
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent("Your website enquiry")}`}
                    className="text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    Reply
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(submission.id)}
                  disabled={deleting === submission.id}
                  className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-red-700 disabled:opacity-60"
                >
                  {deleting === submission.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
