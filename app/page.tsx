import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchArrow, SketchCircle, SketchHighlight } from "@/components/doodles";
import { PricingCard } from "@/components/pricing-card";
import { ProjectCard } from "@/components/project-card";
import {
  ButtonLink,
  Circled,
  Container,
  MetaRow,
  Scribbled,
  Section,
  SectionHeading,
  Tag,
} from "@/components/ui";
import { about, experience, pillars, pricing, projects, site, stack, stats } from "@/content/site";

export default function HomePage() {
  const selected = projects.items.slice(0, 3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-grid bg-grid-fade" />
        <Container className="relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase backdrop-blur">
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
              I design and build <Scribbled>fast, clean</Scribbled> web products.
            </h1>

            <p
              className="animate-rise mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted text-pretty md:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              I&apos;m {site.name} — a {site.role.toLowerCase()} in {site.location} who ships crisp
              interfaces, dependable backends, and the small details that make software feel
              effortless.
            </p>

            <div
              className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-3"
              style={{ animationDelay: "240ms" }}
            >
              <ButtonLink href="/projects">
                See selected work
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                View pricing
              </ButtonLink>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <SketchArrow
                  className="h-9 w-9 -scale-x-100 rotate-12 text-muted"
                  delay={900}
                />
                <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
                  fixed prices
                </span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------------------------------------------- Stack */}
      <div className="border-y border-line bg-mist">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8">
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Daily toolbox
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

      {/* ----------------------------------------------------------- Selected */}
      <Section>
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Selected work"
              title={
                <>
                  Projects with real users and{" "}
                  <span className="relative inline-block">
                    real constraints
                    <SketchHighlight
                      delay={400}
                      className="absolute -inset-x-[0.03em] top-[0.16em] h-[0.75em] text-ink"
                    />
                  </span>
                  .
                </>
              }
              description="A few things I've shipped recently — products, client platforms and open source."
            />
            <ButtonLink href="/projects" variant="secondary" className="shrink-0">
              All projects
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- Stats */}
      <Section className="bg-mist">
        <Container>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dd className="relative inline-block px-6 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                  <SketchCircle className="absolute -inset-x-1 -inset-y-3 text-line-strong" delay={400} />
                  <span className="relative">{stat.value}</span>
                </dd>
                <dt className="mt-5 text-xs leading-relaxed text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- Pillars */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="What I do"
            title="One person, the whole slice."
            description="I'd rather own a feature from sketch to production than hand it across three desks. Here's what I'm hired for most."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex flex-col bg-paper p-7">
                <h3 className="text-base font-medium tracking-[-0.02em]">{pillar.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted text-pretty">
                  {pillar.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {pillar.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- Experience strip */}
      <Section className="bg-mist">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-start">
          <div>
            <SectionHeading
              eyebrow="Experience"
              title={
                <>
                  A <Circled delay={600}>decade</Circled> of shipping.
                </>
              }
              description="From a bike-shop spreadsheet to platform teams — the short version is below, the long version lives on the experience page."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/experience">Full experience</ButtonLink>
              <ButtonLink href="/about" variant="secondary">
                More about me
              </ButtonLink>
            </div>
            <dl className="mt-12 max-w-md">
              {about.currently.map((item) => (
                <MetaRow key={item.label} label={item.label} value={item.value} />
              ))}
            </dl>
          </div>

          <ol className="space-y-6">
            {experience.roles.slice(0, 3).map((role) => (
              <li
                key={`${role.company}-${role.period}`}
                className="rounded-xl border border-line bg-paper p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-base font-medium tracking-[-0.02em]">
                    {role.role} <span className="text-muted">· {role.company}</span>
                  </h3>
                  <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
                    {role.period}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{role.summary}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- Pricing */}
      <Section>
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Transparent pricing, no discovery-call gatekeeping."
            description="Fixed scope and fixed price, agreed before anything is built. Every engagement includes design and engineering."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-stretch">
            {pricing.tiers.map((tier, index) => (
              <PricingCard key={tier.name} tier={tier} delay={index * 100} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              See what&apos;s included, add-ons and FAQs
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
