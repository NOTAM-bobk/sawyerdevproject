"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { site } from "@/content/site";

/**
 * One sign-in for both sides: a client's dashboard code, or Sawyer's own
 * admin secret. The server decides which one it is.
 */
export function DashboardLogin({ ready }: { ready: boolean }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (response.ok && data?.ok) {
        setCode("");
        router.refresh();
        return;
      }
      setError(data?.error ?? "That didn't work.");
    } catch {
      setError("I couldn't reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
        <KeyRound className="h-3.5 w-3.5 text-warm" />
        Dashboard
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Sign in.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
        This page is for clients following their build. Use the dashboard code you were given when
        you sent your enquiry — it&apos;s in the confirmation you saw, and in the copy I received.
      </p>

      {!ready ? (
        <p className="mt-6 rounded-xl border border-line bg-mist p-4 text-sm leading-relaxed text-ink-soft">
          Dashboards aren&apos;t switched on for this site yet. Email {""}
          <span className="text-ink">{site.email}</span> and I&apos;ll send you an update
          directly.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-7">
          <label
            htmlFor="dashboard-code"
            className="mb-2 block font-mono text-[11px] tracking-[0.14em] text-muted uppercase"
          >
            Dashboard code
          </label>
          <div className="relative">
            <input
              id="dashboard-code"
              type={reveal ? "text" : "password"}
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full rounded-lg border border-line bg-paper py-3 pr-12 pl-4 font-mono text-sm tracking-[0.08em] text-ink transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-muted/60 focus:border-ink focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setReveal((value) => !value)}
              aria-label={reveal ? "Hide the code" : "Show the code"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted transition-colors hover:text-ink"
            >
              {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Dashes and capitals don&apos;t matter — paste it as it is and it will work.
          </p>

          {error ? (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || code.trim() === ""}
            className="btn3d btn3d-dark mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-paper disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? "Checking…" : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
