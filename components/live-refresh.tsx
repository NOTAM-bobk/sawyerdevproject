"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-renders a server-rendered page on a timer, so the status, updates and
 * checklist a client is watching keep up with what Sawyer is editing — and a
 * countdown never silently drifts. Refresh preserves whatever is typed into the
 * chat box, because only the server components are re-fetched.
 */
export function LiveRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      // A hidden tab does not need to keep asking.
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);

    return () => window.clearInterval(timer);
  }, [router, seconds]);

  return null;
}
