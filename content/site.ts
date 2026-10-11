/**
 * Single source of truth for every piece of copy on the site.
 * Edit this file to update the site — no component changes required.
 */

export const site = {
  name: "Sawyer Schulz",
  shortName: "Sawyer",
  initials: "SS",
  role: "Software Engineer",
  tagline: "I design and build fast, clean web products.",
  location: "Denver, Colorado",
  timezone: "MST (UTC−7)",
  availability: "Available for new projects",
  availabilityDetail: "2 slots open — Q1 2027",
  email: "hello@sawyerschulz.dev",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://sawyerschulz.dev"),
  description:
    "Sawyer Schulz is a software engineer specializing in crisp interfaces, dependable backends, and products that feel effortless to use.",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/in/" },
    { label: "X", href: "https://x.com/" },
    { label: "Email", href: "mailto:hello@sawyerschulz.dev" },
  ],
} as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const stats = [
  { value: "8+", label: "Years shipping software" },
  { value: "40+", label: "Projects delivered" },
  { value: "99.9%", label: "Uptime across my apps" },
  { value: "6", label: "Teams I've embedded with" },
] as const;

export const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Prisma",
  "AWS",
  "Vercel",
  "Playwright",
] as const;

export const pillars = [
  {
    title: "Product interfaces",
    body: "Interfaces that stay out of the way. Tight spacing, sensible states, real accessibility — designed in code, not handed off in a screenshot.",
    tags: ["Design systems", "Accessibility", "Motion"],
  },
  {
    title: "Backends & APIs",
    body: "Data models that hold up, APIs that are a pleasure to consume, and jobs that quietly do their work at 3am without waking anyone up.",
    tags: ["REST & tRPC", "Postgres", "Queues"],
  },
  {
    title: "Shipping & scale",
    body: "CI that fails fast, previews for every branch, observability you can actually read. I'd rather ship weekly than plan quarterly.",
    tags: ["CI/CD", "Performance", "Observability"],
  },
] as const;

export const about = {
  eyebrow: "About",
  title: "Engineer, tinkerer, relentless simplifier.",
  intro:
    "I'm Sawyer — a software engineer who cares about the last 10%: the loading state, the empty state, the keyboard shortcut nobody asked for but everybody uses.",
  paragraphs: [
    "I started building for the web in 2018, hacking together a scheduling tool for the bike shop where I worked. It broke constantly and I loved it. Ten years of side projects, contract work and full-time product teams later, I've learned that most of engineering is editing: fewer dependencies, fewer abstractions, fewer places for something to go wrong.",
    "Today I work with founders and small product teams who need someone who can own a slice of the stack end to end — talk to customers on Monday, sketch an interface on Tuesday, ship it behind a feature flag on Friday. I'm comfortable being the only engineer in the room and equally happy pairing inside a larger platform team.",
    "Outside of work you'll find me on a gravel bike somewhere west of Denver, over-engineering a coffee routine, or writing long-form notes about the tools I use. I answer email myself, usually within a day.",
  ],
  currently: [
    { label: "Currently", value: "Senior Software Engineer at Northlight" },
    { label: "Focus", value: "TypeScript, product, developer experience" },
    { label: "Open to", value: "Contract work & advisory" },
    { label: "Based in", value: "Denver, Colorado (MST)" },
  ],
  toolbox: [
    { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "Go"] },
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Radix", "Framer Motion"] },
    { group: "Backend", items: ["Node.js", "Postgres", "Prisma", "Redis", "tRPC"] },
    { group: "Platform", items: ["Vercel", "AWS", "Docker", "GitHub Actions", "Terraform"] },
  ],
  beyondCode: [
    { title: "Gravel cycling", body: "Long, dusty rides through the Front Range. No power meter, no plan." },
    { title: "Writing", body: "Notes on tooling, batteries-included setups and the small wins of shipping." },
    { title: "Coffee", body: "A slightly unreasonable pour-over habit. Ask me about water chemistry." },
  ],
} as const;

export const experience = {
  eyebrow: "Experience",
  title: "A decade of building things that stay built.",
  intro:
    "From a bike shop spreadsheet to platform teams — here's where I've spent my working hours. Full history available on request.",
  roles: [
    {
      role: "Senior Software Engineer",
      company: "Northlight",
      location: "Denver, CO",
      period: "2023 — Present",
      summary:
        "Product engineering on a B2B analytics platform serving 40k weekly active users.",
      highlights: [
        "Led the rebuild of the reporting surface in Next.js, cutting p75 time-to-interactive from 4.1s to 1.2s.",
        "Introduced a typed API layer (tRPC + Zod) that removed an entire class of client/server drift bugs.",
        "Mentored three engineers and started the internal design-system guild.",
      ],
      tags: ["Next.js", "TypeScript", "tRPC", "Postgres"],
    },
    {
      role: "Software Engineer",
      company: "Cedar & Pine",
      location: "Remote",
      period: "2021 — 2023",
      summary: "Full-stack work on commerce tooling for independent retailers.",
      highlights: [
        "Shipped an inventory sync service handling 2M+ SKU updates a day with zero data-loss incidents.",
        "Designed the checkout rewrite that lifted mobile conversion by 18%.",
        "Owned the migration from REST to a typed GraphQL gateway across two teams.",
      ],
      tags: ["Node.js", "GraphQL", "Redis", "AWS"],
    },
    {
      role: "Product Engineer",
      company: "Fieldnote",
      location: "Boulder, CO",
      period: "2019 — 2021",
      summary: "Early engineer at a research-notes startup (seed → Series A).",
      highlights: [
        "Built the real-time collaborative editor used by every account on the platform.",
        "Set up the first CI/CD pipeline, taking releases from monthly to daily.",
        "Wrote the onboarding flow that doubled week-one activation.",
      ],
      tags: ["React", "WebSockets", "Postgres", "Docker"],
    },
    {
      role: "Frontend Developer",
      company: "Freelance",
      location: "Self-employed",
      period: "2018 — 2019",
      summary: "Websites and small web apps for local businesses and studios.",
      highlights: [
        "Delivered 20+ marketing sites and internal tools across retail, hospitality and design.",
        "Learned to scope, quote and say no — the most useful skills I own.",
      ],
      tags: ["JavaScript", "CSS", "WordPress", "Figma"],
    },
  ],
  education: [
    {
      title: "B.S. Computer Science",
      org: "University of Colorado Boulder",
      period: "2015 — 2019",
      detail: "Focus on distributed systems and human–computer interaction.",
    },
    {
      title: "AWS Certified Developer — Associate",
      org: "Amazon Web Services",
      period: "2022",
      detail: "Serverless architecture, IAM, observability.",
    },
  ],
} as const;

export const projects = {
  eyebrow: "Projects",
  title: "Things I've built and still stand behind.",
  intro:
    "A mix of client work, products and open source. Source and live links included wherever they're public.",
  featured: {
    name: "Tempo",
    kind: "Product",
    year: "2026",
    summary:
      "A calm time-tracking app for freelancers. One keystroke to start, one to stop, and reports that actually make sense at invoicing time.",
    detail:
      "Built solo: a Next.js app with local-first storage, an offline-friendly sync layer, and a Postgres backend on top of Drizzle. Currently in private beta with 120 users.",
    tags: ["Next.js", "TypeScript", "Drizzle", "Postgres", "Stripe"],
    metrics: [
      { value: "120", label: "Private beta users" },
      { value: "1.2s", label: "p75 load time" },
      { value: "0", label: "Paid ads run" },
    ],
    links: [
      { label: "Live site", href: "https://example.com" },
      { label: "Source", href: "https://github.com/" },
    ],
  },
  items: [
    {
      name: "Northlight Reporting",
      kind: "Client work",
      year: "2025",
      summary:
        "A rebuilt analytics surface for a B2B platform — streaming tables, saved views and a query builder non-technical users can drive.",
      tags: ["Next.js", "tRPC", "Postgres"],
      href: "https://example.com",
    },
    {
      name: "Sundial",
      kind: "Open source",
      year: "2025",
      summary:
        "A tiny cron and background-job runner for Next.js apps. Zero infrastructure, 4kb, works in any serverless runtime.",
      tags: ["TypeScript", "Serverless"],
      href: "https://github.com/",
    },
    {
      name: "Cedar Inventory Sync",
      kind: "Client work",
      year: "2023",
      summary:
        "An inventory sync service moving 2M+ SKU updates a day between warehouses, POS systems and a storefront.",
      tags: ["Node.js", "Redis", "AWS"],
      href: "https://example.com",
    },
    {
      name: "Inkwell",
      kind: "Side project",
      year: "2024",
      summary:
        "A markdown notes app with a hand-drawn feel: sketch annotations, offline vaults and end-to-end encrypted sync.",
      tags: ["React", "IndexedDB", "CRDT"],
      href: "https://github.com/",
    },
    {
      name: "Atlas Design System",
      kind: "Open source",
      year: "2022",
      summary:
        "A headless component library and token pipeline powering four products from a single theme file.",
      tags: ["React", "Radix", "Style Dictionary"],
      href: "https://github.com/",
    },
    {
      name: "Ridgeline",
      kind: "Client work",
      year: "2022",
      summary:
        "Booking and route-planning tooling for a regional outdoor guide company, including an offline-first field app.",
      tags: ["React", "PWA", "Mapbox"],
      href: "https://example.com",
    },
  ],
} as const;

export const pricing = {
  eyebrow: "Pricing",
  title: "Simple pricing, no surprises.",
  intro:
    "Fixed scope, fixed price, weekly demos. Every engagement includes design and engineering — you talk to the person writing the code.",
  note: "All prices in USD. Payment plans available, 50% up front.",
  tiers: [
    {
      name: "Landing Page",
      price: "$1,800",
      priceNote: "fixed, from",
      for: "A single, sharp page that converts.",
      turnaround: "1–2 weeks",
      popular: false,
      features: [
        "Custom design + build",
        "Up to 6 sections",
        "Copy polish and structure review",
        "Responsive and accessible",
        "Basic SEO and analytics",
        "Deployed to your domain",
      ],
      cta: "Start a landing page",
    },
    {
      name: "Full Site",
      price: "$4,500",
      priceNote: "fixed, from",
      for: "A complete marketing site or small product.",
      turnaround: "3–5 weeks",
      popular: true,
      features: [
        "Everything in Landing Page",
        "Up to 8 unique pages",
        "Design system and component library",
        "CMS or content layer of your choice",
        "Contact forms, auth or payments wiring",
        "Performance budget: 95+ Lighthouse",
        "45 days of post-launch support",
      ],
      cta: "Book a project slot",
    },
    {
      name: "Retainer",
      price: "$2,400",
      priceNote: "per month",
      for: "Ongoing engineering for a product team.",
      turnaround: "Rolling, min. 2 months",
      popular: false,
      features: [
        "40 hours per month",
        "Roadmap and technical planning",
        "Feature work, bugs and reviews",
        "Weekly demos and a shared board",
        "Pause or cancel with 30 days notice",
      ],
      cta: "Talk about a retainer",
    },
  ],
  included: [
    "Direct access to me — no account managers",
    "Figma files and full source code handed over",
    "Weekly progress demos, async written updates",
    "Performance and accessibility checks before launch",
    "Documented handover so your team can take over",
  ],
  addons: [
    { name: "Extra page", price: "$450 / page" },
    { name: "Design system deep-dive", price: "$1,200" },
    { name: "E-commerce wiring", price: "$1,500" },
    { name: "Performance rescue audit", price: "$900" },
    { name: "Content migration", price: "$600" },
    { name: "Team workshop (2h)", price: "$400" },
  ],
  faq: [
    {
      q: "What does the process look like?",
      a: "A short call to align on scope, then a written proposal with a fixed price. Once we start you get a weekly demo every Friday and a shared board you can check any time. Launch, then a handover doc and support window.",
    },
    {
      q: "Do you work with existing codebases?",
      a: "Yes. A large share of my work is joining an existing repo — auditing what's there, then shipping improvements in small, reviewable pull requests rather than a risky rewrite.",
    },
    {
      q: "What if the scope changes halfway through?",
      a: "We estimate change requests together before I start them, in writing. Small tweaks are usually free; anything structural becomes a separate quoted line item you can approve or decline.",
    },
    {
      q: "Who owns the work?",
      a: "You do — code, design files and documentation transfer to you on final payment. Retainers include everything produced during billed hours.",
    },
    {
      q: "Do you offer support after launch?",
      a: "Every project includes a support window (45 days on Full Site builds). After that you can move to a retainer or pay hourly for ad-hoc work.",
    },
  ],
} as const;
