"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number; past: boolean };

function split(target: number, now: number): Parts {
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    past: false,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Counts down to the target launch date. Renders the plain date first and only
 * starts ticking once mounted, so the server and client markup agree.
 */
export function DeadlineCountdown({ deadline, label }: { deadline: string; label: string }) {
  // End of the chosen day, in the reader's own timezone.
  const target = new Date(`${deadline}T23:59:59`).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    // The first update goes through a timeout rather than running straight
    // inside the effect, so mounting does not trigger a second render pass.
    const kick = window.setTimeout(tick, 0);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(kick);
    };
  }, []);

  const dateLabel = new Date(`${deadline}T12:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const parts = now === null ? null : split(target, now);

  return (
    <div className="surface p-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{label}</p>
      <p className="mt-3 text-sm text-ink-soft">{dateLabel}</p>

      {parts === null ? (
        <p className="mt-4 font-mono text-2xl tracking-[-0.02em] text-muted">…</p>
      ) : parts.past ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          That date has passed. Email me if you need it moved.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="font-mono text-3xl tracking-[-0.03em] tabular-nums">
            {parts.days}
            <span className="ml-1.5 text-sm text-muted">{parts.days === 1 ? "day" : "days"}</span>
          </span>
          <span className="font-mono text-sm text-muted tabular-nums">
            {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
          </span>
        </div>
      )}
    </div>
  );
}
