"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

/** Password gate for /admin. Nothing is rendered until it is passed. */
export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (response.ok && data?.ok) {
        setPassword("");
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
        <Lock className="h-3.5 w-3.5 text-warm" />
        Admin
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">Sign in.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
        Enquiries from the project form. This page is private and is not listed anywhere.
      </p>

      {!configured ? (
        <p className="mt-6 rounded-xl border border-line bg-mist p-4 text-sm leading-relaxed text-ink-soft">
          No admin password is set yet. Add <code className="font-mono text-xs">ADMIN_PASSWORD</code>{" "}
          to your environment variables and redeploy, then sign in with that value.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-7">
          <label htmlFor="admin-password" className="mb-2 block font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
          />

          {error ? (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy || password === ""}
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
