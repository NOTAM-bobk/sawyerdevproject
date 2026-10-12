"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Reading progress for the page: a bar pinned to the very top of the viewport
 * plus a percentage dial that doubles as a back-to-top button.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const percent = Math.round(progress * 100);
  const started = progress > 0.04;

  const toTop = () => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  };

  return (
    <>
      {/* Top bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-60 h-[3px] bg-line/70"
      >
        <div
          className="h-full origin-left bg-ink transition-transform duration-100 ease-out"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Percentage dial / back to top */}
      <button
        type="button"
        onClick={toTop}
        aria-label={`Back to top — ${percent}% of the page read`}
        tabIndex={started ? 0 : -1}
        aria-hidden={!started}
        className={`fixed right-5 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper/90 text-ink backdrop-blur transition-all duration-300 hover:border-ink sm:right-7 sm:bottom-7 ${
          started ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 44 44"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="2" className="text-line" />
          <circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
            className="text-ink"
          />
        </svg>
        <span className="relative flex h-4 w-full items-center justify-center">
          <span
            className={`absolute font-mono text-[10px] leading-none tabular-nums transition-opacity duration-300 ${
              progress > 0.985 ? "opacity-0" : "opacity-100"
            }`}
          >
            {percent}%
          </span>
          <ArrowUp
            aria-hidden="true"
            className={`absolute h-3.5 w-3.5 transition-opacity duration-300 ${
              progress > 0.985 ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
      </button>
    </>
  );
}
