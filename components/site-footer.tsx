import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SketchFlourish } from "@/components/doodles";
import { Container } from "@/components/ui";
import { nav, site } from "@/content/site";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-mist">
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="relative inline-block text-2xl font-semibold tracking-[-0.03em]">
              {site.name}
              <SketchFlourish
                delay={200}
                className="absolute -bottom-2 left-0 h-[0.5em] w-full text-ink"
              />
            </p>
            <p className="mt-8 max-w-xs text-sm leading-relaxed text-muted text-pretty">
              {site.role} in {site.location}. Building clean, dependable web products — usually with
              Next.js and a strong opinion about whitespace.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              {site.availability}
            </p>
          </div>

          <FooterColumn title="Pages">
            <FooterLink href="/">Home</FooterLink>
            {nav.map((item) => (
              <FooterLink key={item.href} href={item.href}>
                {item.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Elsewhere">
            {site.socials.map((social) => (
              <FooterLink key={social.label} href={social.href} external>
                {social.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Get in touch">
            <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>
            <FooterLink href={site.phoneHref}>{site.phone}</FooterLink>
            <li className="pt-1 text-sm text-muted">{site.location}</li>
            <li className="text-sm text-muted">{site.timezone}</li>
            <li className="pt-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
              >
                Start a project
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">
            Built with Next.js &amp; Tailwind — pencil marks included.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = "text-sm text-ink-soft transition-colors hover:text-ink";
  if (external || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <li>
        <a
          href={href}
          className={className}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}
