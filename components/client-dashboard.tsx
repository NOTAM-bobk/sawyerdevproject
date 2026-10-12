import type { ReactNode } from "react";
import { Check, ExternalLink, Mail, Phone, Radio } from "lucide-react";
import { DashboardBar } from "@/components/dashboard-bar";
import { DashboardNav, type DashboardSection } from "@/components/dashboard-nav";
import { DashboardMedia } from "@/components/dashboard-media";
import { DeadlineCountdown } from "@/components/deadline-countdown";
import { LiveRefresh } from "@/components/live-refresh";
import { ProjectChat } from "@/components/project-chat";
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

function Count({ children }: { children: ReactNode }) {
  return (
    <span className="chip3d rounded-full border border-line bg-paper px-3 py-1 font-mono text-[11px] tracking-wide whitespace-nowrap text-muted uppercase">
      {children}
    </span>
  );
}

/**
 * One labelled block of the dashboard.
 *
 * Every section has a real heading and a line saying what it is for, so the page
 * reads as a set of named parts rather than a run of panels.
 */
function Panel({
  id,
  title,
  hint,
  aside,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-line pt-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
          {hint ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted text-pretty">{hint}</p>
          ) : null}
        </div>
        {aside}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * What a client sees after signing in.
 *
 * Rendered on the server from the stored project, so there is one source of
 * truth for both this page and the admin editor. The site's own header and
 * footer are out of the way here: the dashboard brings its own bar and an
 * in-page nav.
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

  const sections: DashboardSection[] = [
    { id: "overview", label: "Overview" },
    { id: "updates", label: "Updates" },
    { id: "chat", label: "Chat" },
    { id: "assets", label: "Assets" },
    { id: "checklist", label: "Checklist" },
    ...(project.links.length > 0 ? [{ id: "links", label: "Links" }] : []),
  ];

  return (
    <>
      <DashboardBar
        label={preview ? "Client dashboard preview" : "Client dashboard"}
        links={
          preview
            ? [
                { href: "/dashboard", label: "All clients" },
                { href: `/admin/clients/${project.id}`, label: "Edit" },
              ]
            : []
        }
      />

      {/* Keeps the status, updates and checklist current while the page is open. */}
      <LiveRefresh />

      <Container className="pt-10 md:pt-14">
        {preview ? (
          <p className="mb-8 rounded-xl border border-plum/30 bg-plum-tint px-4 py-3 text-sm text-ink-soft">
            Previewing this page as <span className="text-ink">{project.name}</span> sees it.
          </p>
        ) : null}

        <div id="overview" className="scroll-mt-32">
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
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft text-pretty">
              {project.statusNote}
            </p>
          ) : null}
        </div>
      </Container>

      <div className="mt-10">
        <DashboardNav sections={sections} />

        <Container className="pt-10 pb-16 md:pb-20">
          {/* Current stats */}
          {project.stats.length > 0 ? (
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            {/* What I'm working on */}
            <div className="surface p-6 md:p-7">
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                What I&apos;m working on
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-soft text-pretty">
                {project.workingOn || "Nothing on the bench yet — I'll write here when I start."}
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
                  No date set yet — I&apos;ll put a realistic one here once I&apos;ve seen your
                  content.
                </p>
              </div>
            )}
          </div>

          <div className="mt-14 flex flex-col gap-14">
            {/* Updates */}
            <Panel
              id="updates"
              title="Updates"
              hint="Everything I post, newest first. This page refreshes itself while it's open, so you are never reading last week."
              aside={
                <Count>
                  {project.updates.length === 0
                    ? "None yet"
                    : `${project.updates.length} posted`}
                </Count>
              }
            >
              {project.updates.length === 0 ? (
                <p className="text-sm text-muted">Nothing posted yet.</p>
              ) : (
                <ol className="space-y-0">
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
            </Panel>

            {/* Live chat */}
            <Panel
              id="chat"
              title="Chat"
              hint="Anything quick — a question, a change, a correction. My reply lands in this thread."
            >
              <ProjectChat
                endpoint="/api/dashboard/chat"
                role="client"
                otherName={site.shortName}
                initialMessages={project.messages}
                readOnly={preview}
                showTitle={false}
              />
            </Panel>

            {/* Brand media & assets — the client's own uploads */}
            <Panel
              id="assets"
              title="Brand media & assets"
              hint="Logos, high-resolution pictures and brand documents for me to use in the build. Upload whatever you have — I'll ask if something is missing."
              aside={<Count>{project.media.length} uploaded</Count>}
            >
              <div className="surface p-6 md:p-8">
                <DashboardMedia initialMedia={project.media} />
              </div>
            </Panel>

            {/* Checklist */}
            <Panel
              id="checklist"
              title="Checklist"
              hint="The steps I work through, ticked off as I go. The progress bar above is counted from this list, so the two can never disagree."
              aside={
                <Count>
                  {progress.done}/{progress.total} done
                </Count>
              }
            >
              {project.checklist.length === 0 ? (
                <p className="text-sm text-muted">No checklist yet.</p>
              ) : (
                <ul className="surface divide-y divide-line">
                  {project.checklist.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          item.done
                            ? "border-ink bg-ink text-paper"
                            : "border-line-strong text-transparent"
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
            </Panel>

            {/* Links */}
            {project.links.length > 0 ? (
              <Panel
                id="links"
                title="Project links"
                hint="Staging previews and files, as they go live."
              >
                <ul className="grid gap-4 sm:grid-cols-2">
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
              </Panel>
            ) : null}
          </div>

          {/* Messages only */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-8">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(`Your site — ${project.title}`)}`}
                className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
              >
                <Mail className="h-4 w-4 text-warm" />
                {site.email}
              </a>
              <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                <Phone className="h-4 w-4 text-warm" />
                {site.phone}
              </span>
            </div>
            <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
              Messages only — I never call
            </p>
          </div>
        </Container>
      </div>
    </>
  );
}
