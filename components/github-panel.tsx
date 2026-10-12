import { ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/ui";
import { getGithubOverview } from "@/lib/github";

const toneDot = {
  ink: "bg-ink",
  warm: "bg-warm",
  plum: "bg-plum",
  mint: "bg-mint",
} as const;

/** Live figures pulled from the public GitHub API — see lib/github.ts. */
export async function GithubPanel({
  eyebrow = "On GitHub",
  title = "What I'm building lately.",
  description = "Repositories, languages and the projects people have starred, pulled straight from my GitHub account.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const data = await getGithubOverview();

  return (
    <Section className="relative overflow-hidden bg-mist">
      <div aria-hidden="true" className="absolute inset-0 tint-warm" />
      <Container className="relative">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>

        <Reveal delay={80}>
          <div className="surface mt-12 overflow-hidden p-6 md:p-9">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
              {data.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="text-4xl font-semibold tracking-[-0.045em] tabular-nums">
                    {stat.value}
                  </dd>
                  <dt className="mt-3 flex items-center gap-2 text-xs text-muted">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[stat.tone]}`}
                    />
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="mt-10 grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_1.15fr] md:gap-14">
              {/* Languages */}
              <div className="min-w-0">
                <h3 className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                  Languages
                </h3>
                <div className="chip3d mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-line">
                  {data.languages.map((language) => (
                    <span
                      key={language.name}
                      className="h-full"
                      style={{ width: `${language.share}%`, backgroundColor: language.color }}
                    />
                  ))}
                </div>
                <ul className="mt-5 space-y-2.5">
                  {data.languages.map((language) => (
                    <li
                      key={language.name}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="flex items-center gap-2 text-ink-soft">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: language.color }}
                        />
                        {language.name}
                      </span>
                      <span className="font-mono text-xs text-muted tabular-nums">
                        {language.share}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Most-starred repositories */}
              <div className="min-w-0">
                <h3 className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                  Most starred
                </h3>
                <ul className="mt-4 divide-y divide-line">
                  {data.repos.map((repo) => (
                    <li key={repo.name}>
                      <a
                        href={repo.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex min-w-0 items-center justify-between gap-4 py-3"
                      >
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: repo.color }}
                            />
                            <span className="truncate text-sm font-medium tracking-[-0.01em] transition-colors group-hover:text-warm-deep">
                              {repo.name}
                            </span>
                          </span>
                          <span className="mt-1 block truncate text-xs text-muted">
                            {repo.description}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted tabular-nums">
                          <Star className="h-3 w-3" />
                          {repo.stars}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={data.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn3d btn3d-light mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] font-medium text-ink"
                >
                  All {data.stats[0].value} repositories
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
