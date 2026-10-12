import Link from "next/link";
import { ArrowUpRight, CalendarClock, ListChecks, MessagesSquare, Radio } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchHighlight, SketchSparkle } from "@/components/doodles";
import { PricingCard } from "@/components/pricing-card";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { Reviews } from "@/components/reviews";
import {
  ButtonLink,
  Container,
  MetaRow,
  Scribbled,
  Section,
  SectionHeading,
  Tag,
} from "@/components/ui";
import { about, dashboard, pillars, pricing, projects, site, stack, stats } from "@/content/site";

/** The two projects worth leading with, picked by name from the content file. */
const SHOWCASE = ["Ben Launches — Boring Internet", "base31.org"];

/** One icon per dashboard feature, in the same order as content/site.ts. */
const dashboardIcons = [Radio, ListChecks, MessagesSquare, CalendarClock];

export default function HomePage() {
  const selected = SHOWCASE.flatMap((name) =>
    projects.items.filter((project) => project.name === name),
  );

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="scroll-dim absolute inset-0">
          {/* Bottom aurora: electric blue through the center, blooming into violet and pink at the corners. */}
          <div className="anim-blob absolute -bottom-72 left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(57,125,255,0.48),rgba(93,102,255,0.30)_42%,rgba(143,75,255,0.16)_65%,transparent_78%)] blur-2xl md:-bottom-96 md:h-[760px] md:w-[1240px]" />
          <div className="anim-blob-slow absolute -bottom-64 -left-48 h-[480px] w-[620px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(93,141,255,0.32),rgba(121,92,255,0.18)_52%,transparent_76%)] blur-2xl md:-bottom-80 md:-left-64 md:h-[620px] md:w-[760px]" />
          <div className="anim-blob-slow absolute -right-48 -bottom-64 h-[500px] w-[660px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,76,209,0.38),rgba(190,79,255,0.20)_48%,transparent_76%)] blur-2xl md:-right-64 md:-bottom-80 md:h-[640px] md:w-[820px]" />

          <div className="absolute inset-0 bg-grid bg-grid-fade anim-grid-pan" />
          <div className="anim-blob-slow absolute top-40 left-1/2 h-72 w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(109,85,255,0.07),transparent)]" />
          <span className="anim-float absolute top-28 left-[9%] hidden md:block">
            <SketchSparkle className="h-4 w-4 text-warm/60" />
          </span>
          <span className="anim-drift absolute top-1/2 right-[10%] hidden md:block">
            <SketchSparkle className="h-3 w-3 text-plum/50" delay={300} />
          </span>
          <span className="anim-float absolute bottom-24 left-[18%] hidden lg:block">
            <SketchSparkle className="h-5 w-5 text-line-strong" delay={600} />
          </span>
        </div>

        <Container className="relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip3d animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              {site.availability}
              <span className="hidden text-line-strong sm:inline">/</span>
              <span className="hidden normal-case sm:inline">{site.availabilityDetail}</span>
            </span>

            <h1
              className="animate-rise mt-8 text-4xl leading-[1.05] font-semibold tracking-[-0.045em] text-balance sm:text-6xl md:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              Websites that <Scribbled>load fast</Scribbled> and look right.
            </h1>

            {/* ink-soft, not muted: this paragraph sits on the aurora glow */}
            <p
              className="animate-rise mx-auto mt-8 max-w-xl text-base leading-relaxed text-ink-soft text-pretty md:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              I&apos;m {site.name}. I design the site, write the code and get it live on your domain
              — fixed price, one person to talk to.
            </p>

            <div
              className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <ButtonLink href="/projects" className="px-6 py-3">
                See my work
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary" className="px-6 py-3">
                One site, $299
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------------- Toolbox */}
      <div className="border-y border-line bg-mist">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
          <span className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            Toolbox
          </span>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {stack.map((item, index) => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-sm text-ink-soft">{item}</span>
                {index < stack.length - 1 ? (
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line-strong" />
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      {/* ------------------------------------------------------------ Selected */}
      <Section>
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow="Selected work"
                title={
                  <>
                    Projects with real users and{" "}
                    <span className="relative inline-block">
                      real deadlines
                      <SketchHighlight
                        delay={400}
                        className="absolute inset-x-0 top-[0.1em] h-[0.82em] w-full text-warm"
                      />
                    </span>
                    .
                  </>
                }
                description="Ben Launches and base31.org — two of the four. Both live right now, both designed, built and maintained by me."
              />
              <ButtonLink href="/projects" variant="secondary" className="shrink-0">
                All projects
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {selected.map((project, index) => (
              <Reveal key={project.name} delay={index * 90} className="h-full">
                <ProjectCard project={project} index={index} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Pillars */}
      <Section className="bg-mist">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What I do"
              title="Design, backend, frontend."
              description="The whole site, not a slice of it. You get one person for the design, the code and the launch."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 90} className="h-full">
                <div className="surface surface-lift flex h-full flex-col p-7">
                  <h3 className="text-base font-medium tracking-[-0.02em]">{pillar.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted text-pretty">
                    {pillar.body}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {pillar.tags.map((tag, tagIndex) => (
                      <Tag key={tag} tone={tagIndex === 0 ? "warm" : "neutral"}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- Your dashboard */}
      <Section className="relative overflow-hidden bg-mist">
        <div aria-hidden="true" className="absolute inset-0 tint-plum" />
        <Container className="relative">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                eyebrow={dashboard.eyebrow}
                title={
                  <>
                    You watch it happen, <Scribbled delay={300}>live</Scribbled>.
                  </>
                }
                description={dashboard.intro}
              />
              <ButtonLink href="/start" variant="secondary" className="shrink-0">
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.features.map((feature, index) => {
              const Icon = dashboardIcons[index] ?? Radio;
              return (
                <Reveal key={feature.title} delay={index * 80} className="h-full">
                  <div className="surface surface-lift flex h-full flex-col p-6">
                    <span className="flex items-center justify-between gap-3">
                      <span className="chip3d inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-paper">
                        <Icon className="h-4 w-4 text-warm" />
                      </span>
                      {feature.badge ? (
                        <span className="chip3d inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          </span>
                          {feature.badge}
                        </span>
                      ) : null}
                    </span>
                    <h3 className="mt-5 text-base font-medium tracking-[-0.02em]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted text-pretty">
                      {feature.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={140}>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
              {dashboard.note}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- Offer */}
      <Section>
        <Container className="grid gap-14 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-16">
          <Reveal variant="left">
            <SectionHeading
              eyebrow="The offer"
              title={
                <>
                  One site,{" "}
                  <span className="relative inline-block px-1">
                    <SketchHighlight
                      delay={600}
                      className="absolute inset-x-[-0.15em] top-[0.06em] h-[0.88em] w-[calc(100%+0.3em)] text-warm"
                    />
                    <span className="relative">$299</span>
                  </span>
                  , done.
                </>
              }
              description="A complete site for $299. Design, build, domain and launch, with the source code handed over at the end."
            />
            <dl className="mt-10 max-w-md">
              {about.currently.map((item) => (
                <MetaRow key={item.label} label={item.label} value={item.value} />
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/start" className="px-6 py-3">
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/experience" variant="secondary" className="px-6 py-3">
                More about me
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal variant="right" delay={90}>
            <dl className="grid grid-cols-2 gap-5">
              {stats.map((stat) => (
                <div key={stat.label} className="surface surface-lift p-6">
                  <dd className="relative inline-block px-2 py-1 text-3xl font-semibold tracking-[-0.04em]">
                    <SketchHighlight
                      className="absolute inset-0 h-full w-full text-warm"
                      delay={400}
                    />
                    <span className="relative">{stat.value}</span>
                  </dd>
                  <dt className="mt-4 text-xs leading-relaxed text-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Reviews */}
      <Reviews />

      {/* -------------------------------------------------------------- Pricing */}
      <Section className="relative overflow-hidden bg-mist">
        <div aria-hidden="true" className="absolute inset-0 tint-plum" />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Pricing"
              title="One price. Nothing to add."
              description="No upfront cost. You see the finished site first, then pay — and if your project does not fit the package I say so before we start."
            />
          </Reveal>
          <Reveal delay={100} className="mx-auto mt-14 max-w-md">
            <PricingCard option={pricing.options[0]} />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
              >
                What&apos;s included
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
