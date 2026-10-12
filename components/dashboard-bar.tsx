import Link from "next/link";
import { ArrowUpLeft, LayoutDashboard } from "lucide-react";
import { DashboardSignOut } from "@/components/dashboard-sign-out";
import { Container } from "@/components/ui";

/**
 * The dashboard's own top bar.
 *
 * These pages deliberately drop the marketing header, so this is the only
 * chrome: where you are, any shortcuts, a way back to the main site and the way
 * out. It stays put while the page scrolls.
 */
export function DashboardBar({
  label,
  links = [],
  signedIn = true,
}: {
  label: string;
  /** Extra shortcuts, e.g. back to the client list in the admin's view. */
  links?: readonly { href: string; label: string }[];
  signedIn?: boolean;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-warm" />
          <span className="truncate">{label}</span>
        </p>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-sm text-ink-soft transition-colors hover:text-ink sm:inline"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/"
            className="btn3d btn3d-light inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] font-medium text-ink"
          >
            <ArrowUpLeft className="h-3.5 w-3.5" />
            Main site
          </Link>

          {signedIn ? <DashboardSignOut /> : null}
        </div>
      </Container>
    </div>
  );
}
