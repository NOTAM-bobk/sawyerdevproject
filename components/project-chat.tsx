"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, Trash2 } from "lucide-react";
import { MESSAGE_MAX_LENGTH, type ProjectMessage } from "@/lib/project-types";

/** How often the thread is re-read. There is no socket to hold open. */
const POLL_MS = 5000;
const TIME_ZONE = "America/Chicago";

function when(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

/**
 * The live chat between Sawyer and one client.
 *
 * Messages arrive on the server, so both sides read the same thread: the client
 * posts to /api/dashboard/chat, Sawyer posts to the admin route for that
 * project. This component polls it, which is what makes it live — a five-second
 * poll between two people reads as instant, and it survives serverless hosting
 * where nothing can stay connected.
 */
export function ProjectChat({
  endpoint,
  role,
  otherName,
  initialMessages,
  readOnly = false,
  showTitle = true,
}: {
  endpoint: string;
  /** Who is reading: decides which side of the thread belongs to them. */
  role: "client" | "admin";
  /** What to call the other person when their message appears. */
  otherName: string;
  initialMessages: ProjectMessage[];
  /** True in the admin's preview of a client page: nothing here can post. */
  readOnly?: boolean;
  /** False when the page around it already provides the section heading. */
  showTitle?: boolean;
}) {
  const [messages, setMessages] = useState<ProjectMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      if (!response.ok) {
        setConnected(false);
        return;
      }
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; messages?: ProjectMessage[] }
        | null;
      if (!data?.ok || !Array.isArray(data.messages)) {
        setConnected(false);
        return;
      }
      setMessages(data.messages);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (readOnly) return;
    let stopped = false;
    const tick = () => {
      if (!stopped && document.visibilityState === "visible") void load();
    };
    const timer = window.setInterval(tick, POLL_MS);
    // Read once on mount, and read again whenever the tab comes back.
    const first = window.setTimeout(tick, 0);

    const onVisibility = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopped = true;
      window.clearTimeout(first);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load, readOnly]);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages.length]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (body === "" || sending) return;

    setSending(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: ProjectMessage; error?: string }
        | null;
      const sent = data?.message;

      if (!response.ok || !data?.ok || !sent) {
        setError(data?.error ?? "Could not send that.");
        return;
      }
      setMessages((current) =>
        current.some((message) => message.id === sent.id) ? current : [...current, sent],
      );
      setDraft("");
      setConnected(true);
    } catch {
      setError("I couldn't reach the server.");
    } finally {
      setSending(false);
    }
  }

  async function remove(messageId: string) {
    setError("");
    try {
      const response = await fetch(`${endpoint}?messageId=${encodeURIComponent(messageId)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setError("Could not delete that.");
        return;
      }
      setMessages((current) => current.filter((message) => message.id !== messageId));
    } catch {
      setError("I couldn't reach the server.");
    }
  }

  const mine = role === "admin" ? "sawyer" : "client";
  const whoIs = { sawyer: role === "admin" ? "You" : otherName, client: role === "admin" ? otherName : "You" };

  return (
    <section className="surface mt-6 p-6 md:p-7" aria-labelledby="project-chat-heading">
      <div className={`flex flex-wrap items-center gap-4 ${showTitle ? "justify-between" : "justify-end"}`}>
        {showTitle ? (
          <div>
            <h2
              id="project-chat-heading"
              className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase"
            >
              Live chat
            </h2>
            <p className="mt-2 text-xs text-muted">
              {role === "admin"
                ? `Messages here land on ${otherName}'s dashboard while they are on the page.`
                : "Message me here and my reply shows up in this thread."}
            </p>
          </div>
        ) : (
          <h2 id="project-chat-heading" className="sr-only">
            Chat
          </h2>
        )}
        {readOnly ? (
          <span className="chip3d inline-flex items-center rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
            Preview — read only
          </span>
        ) : (
          <span
            className="chip3d inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase"
            aria-live="polite"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-line-strong"}`}
            />
            {connected ? "Live" : "Reconnecting…"}
          </span>
        )}
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        className="mt-6 max-h-[420px] space-y-4 overflow-y-auto overscroll-contain rounded-xl border border-line bg-mist p-4"
      >
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">
            No messages yet. Say hello and I&apos;ll answer here.
          </p>
        ) : (
          <ol className="flex flex-col gap-4">
            {messages.map((message) => {
              const isMine = message.from === mine;
              return (
                <li
                  key={message.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      isMine
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-ink-soft"
                    }`}
                  >
                    {message.body}
                  </div>
                  <p className="mt-1.5 flex items-center gap-2 font-mono text-[10px] tracking-wide text-muted uppercase">
                    {whoIs[message.from]} · {when(message.at)}
                    {role === "admin" ? (
                      <button
                        type="button"
                        onClick={() => remove(message.id)}
                        aria-label={`Delete this message from ${whoIs[message.from]}`}
                        className="text-muted transition-colors hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    ) : null}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {readOnly ? (
        <p className="mt-4 text-xs text-muted">
          This is the client&apos;s side of the thread. Reply from the editor and it appears here on
          their dashboard.
        </p>
      ) : (
      <form onSubmit={send} className="mt-4">
        <label htmlFor={`chat-${role}`} className="sr-only">
          Message
        </label>
        <textarea
          id={`chat-${role}`}
          rows={2}
          value={draft}
          maxLength={MESSAGE_MAX_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send(event);
            }
          }}
          placeholder={
            role === "admin"
              ? "Reply to the client — Enter to send, Shift+Enter for a new line"
              : "Ask me anything — Enter to send, Shift+Enter for a new line"
          }
          className="w-full resize-y rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-muted/60 hover:border-line-strong focus:border-ink focus:outline-none"
        />

        {error ? (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-wide text-muted uppercase">
            {draft.length}/{MESSAGE_MAX_LENGTH}
          </p>
          <button
            type="submit"
            disabled={sending || draft.trim() === ""}
            className="btn3d btn3d-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-paper disabled:opacity-60"
          >
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
      )}
    </section>
  );
}
