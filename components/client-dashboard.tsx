import Link from "next/link";
import { ArrowUpRight, Check, ExternalLink, Mail, Phone, Radio } from "lucide-react";
import { DashboardSignOut } from "@/components/dashboard-sign-out";
import { DeadlineCountdown } from "@/components/deadline-countdown";
import { LiveRefresh } from "@/components/live-refresh";
import { ProjectChat } from "@/components/project-chat";
import { DashboardMedia } from "@/components/dashboard-media";
import { Container } from "@/components/ui";
import { site } from "@/content/site";
import { STATUS_LABELS, projectProgress, type Project } from "@/lib/projects";

const statusStyles: Record<Project["status"], string> = {
  reviewing: "border-warm/40 bg-warm-tint text-warm-deep",
  accepted: "border-mint/30 bg-paper text-mint",
  declined: "border-line bg-mist text-muted",
  delivered: "border-plum/30 bg-plum-tint text-plum",
};

function shortDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });
}

/**
 * What a client sees after signing in.
 *
 * Rendered on the server from the stored project, so there is one source of
 * truth for both this page and the admin editor.
 */
export function ClientDashboard({
  project,
  preview = false,
}: {
  project: Project;
  /** True when Sawyer is looking at a client's page from the admin side. */
  preview?: boolean;
}) {
  const progress = projectProgress(project);
  const firstName = project.name.trim().split(/\s+/)[0] || "there";

  return (
    <Container className="py-14 md:py-20">
      {/* Keeps the status, updates and checklist current while the page is open. */}
      <LiveRefresh />

      {preview ? (
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-plum/30 bg-plum-tint p-4">
          <p className="text-sm text-ink-soft">
            You&apos;re previewing this as <span className="text-ink">{project.name}</span> sees it.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/admin/clients/${project.id}`}
              className="text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              Edit this dashboard
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              All clients
            </Link>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            <Radio className="h-3.5 w-3.5 text-warm" />
            {preview ? "Client dashboard" : `Hi ${firstName}`}
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-balance md:text-4xl">
            {project.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`chip3d inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wide uppercase ${statusStyles[project.status]}`}
            >
              {STATUS_LABELS[project.status]}
            </span>
            <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
              Started {shortDate(project.createdAt)}
            </span>
          </div>
          {project.statusNote ? (
            <p className="mt-5 text-base leading-relaxed text-ink-soft text-pretty">
              {project.statusNote}
            </p>
          ) : null}
        </div>

        <DashboardSignOut />
      </div>

      {/* Current stats */}
      {project.stats.length > 0 ? (
        <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {project.stats.map((stat) => (
            <div key={stat.id} className="surface p-5">
              <dt className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                {stat.label}
              </dt>
              <dd className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* What I'm working on */}
        <div className="surface p-6 md:p-7">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            What I&apos;m working on
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft text-pretty">
            {project.workingOn ||
              "Nothing on the bench right now. I'll write here the moment I start."}
          </p>

          <div className="mt-7 border-t border-line pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                Progress
              </p>
              <p className="font-mono text-xs text-muted">
                {progress.done}/{progress.total} done · {progress.percent}%
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-ink transition-all duration-700"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>

        {project.deadline ? (
          <DeadlineCountdown deadline={project.deadline} label={project.deadlineLabel} />
        ) : (
          <div className="surface flex flex-col justify-center p-6">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              {project.deadlineLabel || "Target launch"}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted text-pretty">
              No date set yet. Once I&apos;ve seen your content I&apos;ll put a realistic launch
              date here and count down to it.
            </p>
          </div>
        )}
      </div>

      {/* Updates */}
      <section className="mt-14">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Updates {project.updates.length > 0 ? `— ${project.updates.length}` : ""}
        </h2>

        {project.updates.length === 0 ? (
          <p className="mt-5 text-sm text-muted">
            Nothing posted yet. You&apos;ll see each step here as it happens.
          </p>
        ) : (
          <ol className="mt-6 space-y-0">
            {project.updates.map((update, index) => (
              <li key={update.id} className="relative flex gap-5 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      index === 0 ? "bg-warm" : "bg-line-strong"
                    }`}
                  />
                  {index < project.updates.length - 1 ? (
                    <span aria-hidden="true" className="mt-1 w-px flex-1 bg-line" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-base font-medium tracking-[-0.02em]">
                      {update.title || "Update"}
                    </h3>
                    <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
                      {shortDate(update.at)}
                    </span>
                  </div>
                  {update.body ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                      {update.body}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Live chat */}
      <ProjectChat
        endpoint="/api/dashboard/chat"
        role="client"
        otherName={site.shortName}
        initialMessages={project.messages}
        readOnly={preview}
      />


      {/* Brand Media & Assets */}
      <section className="mt-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              Brand media & assets
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Upload your logos, high-res pictures, and brand documents for Sawyer to use in your build.
            </p>
          </div>
          <span className="chip3d self-start sm:self-auto rounded-full border border-line bg-mist px-3 py-1 font-mono text-[11px] text-muted">
            {(project.media || []).length} uploaded
          </span>
        </div>

        <div className="surface rounded-2xl border border-line bg-paper p-6 sm:p-8 shadow-xs">
          <DashboardMedia initialMedia={project.media || []} />
        </div>
      </section>

      {/* Checklist */}
      <section className="mt-14">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          The checklist
        </h2>

        {project.checklist.length === 0 ? (
          <p className="mt-5 text-sm text-muted">No checklist yet.</p>
        ) : (
          <ul className="surface mt-6 divide-y divide-line">
            {project.checklist.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    item.done ? "border-ink bg-ink text-paper" : "border-line-strong text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </span>
                <span
                  className={`text-sm ${item.done ? "text-muted line-through" : "text-ink"}`}
                >
                  {item.label}
                </span>
                <span className="sr-only">{item.done ? "Done" : "Not done yet"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Links */}
      {project.links.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Project links
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="surface-lift surface flex items-center justify-between gap-4 p-5"
                >
                  <span className="text-sm font-medium">{link.label}</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-warm" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Talking to me */}
      <section className="mt-14 border-t border-line pt-8">
        <p className="text-sm leading-relaxed text-muted text-pretty">
          This page keeps itself up to date while you have it open. Use the chat above for
          anything quick — if something looks wrong, or you want to change something, tell me
          there rather than waiting.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(`Your site — ${project.title}`)}`}
            className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <Mail className="h-4 w-4 text-warm" />
            {site.email}
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
          >
            <Phone className="h-4 w-4 text-warm" />
            {site.phone}
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            The main site
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </Container>
  );
}
