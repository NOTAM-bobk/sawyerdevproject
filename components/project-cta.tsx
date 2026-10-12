"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { PROJECT_FLAG_EVENT, hasProjectFlag } from "@/lib/client-flags";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(PROJECT_FLAG_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(PROJECT_FLAG_EVENT, onChange);
  };
}

/** The server has no storage, so it always renders the first-time button. */
const onServer = () => false;

/**
 * Whether this browser has sent an enquiry before.
 *
 * Read as an external store rather than in an effect, so the server-rendered
 * markup ("Start a project") is what hydrates, and the swap to the dashboard
 * happens in the same commit that reads the flag — no cascading render.
 */
export function useHasStarted() {
  return useSyncExternalStore(subscribe, hasProjectFlag, onServer);
}

/**
 * The site's main call to action.
 *
 * A first-time visitor is asked to start a project; someone who has already
 * sent one is offered their dashboard instead, because that is where they are
 * meant to go next.
 */
export function ProjectCta({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
  className?: string;
}) {
  const started = useHasStarted();
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <ButtonLink
      href={started ? "/dashboard" : "/start"}
      variant={variant}
      size={size}
      className={className}
    >
      {started ? (
        <>
          <LayoutDashboard className={icon} />
          Open dashboard
        </>
      ) : (
        <>
          Start a project
          <ArrowUpRight className={icon} />
        </>
      )}
    </ButtonLink>
  );
}
