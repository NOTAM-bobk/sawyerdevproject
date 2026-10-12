"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui";

export type DashboardSection = { id: string; label: string };

/**
 * In-page navigation for a dashboard.
 *
 * The sections are anchors rather than routes, so switching between them is
 * instant and nothing is reloaded. The active link follows the reader with an
 * IntersectionObserver — no scroll listener, and no jumpiness on a long page.
 * It parks directly under the top bar, which is why it is sticky at top-14.
 */
export function DashboardNav({ sections }: { sections: readonly DashboardSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  // Watching the ids as a string keeps the observer from being rebuilt every
  // time the parent re-renders and hands over a fresh array.
  const ids = sections.map((section) => section.id).join(",");

  useEffect(() => {
    const nodes = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (onScreen.length > 0) setActive(onScreen[0].target.id);
      },
      // Ignore the strip hidden behind the bars, and treat the top half of the
      // viewport as the place where a section counts as "the one you're on".
      { rootMargin: "-112px 0px -55% 0px" },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [ids]);

  return (
    <nav
      aria-label="Dashboard sections"
      className="sticky top-14 z-30 border-b border-line bg-paper/90 backdrop-blur-md"
    >
      <Container className="flex h-12 items-center gap-1 overflow-x-auto">
        {sections.map((section) => {
          const current = section.id === active;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={current ? "true" : undefined}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors ${
                current ? "bg-ink text-paper" : "text-muted hover:text-ink"
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </Container>
    </nav>
  );
}
