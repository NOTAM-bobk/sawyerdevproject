"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { avatarUrl } from "@/lib/dicebear";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // The mobile panel closes on navigation, so it never lingers over the new page.
  const closeMenu = () => setOpen(false);

  // While the menu is open the rest of the page is blurred, dimmed and held
  // still, so the panel is the only thing left to act on. Escape closes it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/*
        Sibling of <header>, not a child: an ancestor with backdrop-filter
        becomes the containing block for fixed-position children, which would
        clip this overlay to the height of the top bar.
      */}
      {open ? (
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-md md:hidden"
        />
      ) : null}

      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_6px_18px_-16px_rgba(10,10,10,0.5)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
          {/* The identity block sits on the left, avatar outermost. */}
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5"
            aria-label={`${site.company} — home`}
          >
            <span className="chip3d relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line-strong bg-paper transition-colors duration-300 group-hover:border-ink">
              <Image
                src={avatarUrl({ size: 128, format: "png" })}
                alt=""
                width={36}
                height={36}
                preload
                className="h-full w-full scale-[1.08] object-cover transition-transform duration-300 group-hover:scale-[1.16]"
              />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs leading-tight font-medium tracking-tight text-balance sm:text-sm">
                {site.company}
              </span>
              <span className="hidden text-[11px] leading-tight text-muted lg:block">
                {site.role}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative rounded-full px-3 py-2 text-sm transition-colors ${
                    isActive(item.href) ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-ink" />
                  ) : null}
                </Link>
              ))}
            </nav>

            <Link
              href="/start"
              className="btn3d btn3d-dark hidden items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-paper sm:inline-flex"
            >
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="chip3d inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-paper text-ink md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open ? (
          <div id="mobile-nav" className="border-t border-line bg-paper md:hidden">
            <nav className="mx-auto flex w-full max-w-6xl flex-col px-6 py-3" aria-label="Mobile">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`border-b border-line py-3 text-sm last:border-b-0 ${
                    isActive(item.href) ? "text-ink" : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/start"
                onClick={closeMenu}
                className="btn3d btn3d-dark mt-4 inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-paper"
              >
                Start a project
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
