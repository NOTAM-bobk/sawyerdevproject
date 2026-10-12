"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Full-screen surface for the "Start a project" form. It covers the site
 * header and footer, so clicking Start feels like stepping into the form
 * rather than landing on another page. Background scrolling is locked while
 * it is open, and Escape takes you back to the site.
 */
export function FullscreenShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [router]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Start a project"
      className="fixed inset-0 z-70 overflow-y-auto overscroll-contain bg-mist"
    >
      {children}
    </div>
  );
}
