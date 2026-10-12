/**
 * Single source of truth for every piece of copy on the site.
 * Edit this file to update the site — no component changes required.
 */

export const site = {
  name: "Sawyer Schulz",
  shortName: "Sawyer",
  initials: "SS",
  /** DiceBear avatar used as the logo mark in the header. */
  avatar: {
    style: "notionists",
    seed: "Sawyer Schulz",
  },
  role: "Web designer, backend engineer, frontend master",
  tagline: "Websites that load fast and look right.",
  location: "Minneapolis, Minnesota",
  timezone: "CT (UTC−6)",
  phone: "(612) 444-3853",
  phoneHref: "tel:+16124443853",
  availability: "Available for new projects",
  availabilityDetail: "2 slots open — Q1 2027",
  email: "hello@sawyerschulz.dev",
  /** Public GitHub account — the stats panel and social links read from here. */
  github: "NOTAM-bobk",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://sawyerschulz.dev"),
  description:
    "Sawyer Schulz designs and builds websites in Minneapolis, Minnesota. One complete site for $299, designed, built and launched.",
  socials: [
    { label: "GitHub", href: "https://github.com/NOTAM-bobk" },
    { label: "Email", href: "mailto:hello@sawyerschulz.dev" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

export const nav = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const stats = [
  { value: "5", label: "Pages in the package" },
  { value: "1–2 wks", label: "Typical build time" },
  { value: "30 days", label: "Of fixes after launch" },
  { value: "2", label: "Project slots this quarter" },
] as const;

export const stack = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Cloudflare",
  "Vercel",
] as const;

export const pillars = [
  {
    title: "Web design",
    body: "Layout, type and colour that fit what you actually do. Laid out for a phone first, because that is where the link gets opened.",
    tags: ["Layout", "Responsive", "Accessibility"],
  },
  {
    title: "Backend engineering",
    body: "Forms that land in your inbox, files that stay where they belong, and APIs that hold up on a busy day.",
    tags: ["Node.js", "APIs", "Databases"],
  },
  {
    title: "Frontend",
    body: "Pages that load quickly, buttons that do what they look like, and no layout jumping around as it loads.",
    tags: ["React", "Next.js", "Performance"],
  },
] as const;

export const about = {
  eyebrow: "About",
  title: "I build websites, start to finish.",
  intro:
    "I design and build sites for people and small businesses. One fixed price, one person to talk to, no handovers.",
  paragraphs: [
    "I'm Sawyer, a student in Minneapolis. I got into this by building pages for things I cared about — a site for an 800m runner, a place to keep my own race results, small tools when the app I wanted didn't exist. People started asking me to build theirs.",
    "Now I take on a few sites at a time. I write the design and the code myself, so nothing gets lost between a mockup and what actually ships. Everything I make is meant to be handed over: your domain, your content, your code.",
  ],
  currently: [
    { label: "Building", value: "base31.org" },
    { label: "Also doing", value: "Client sites, one at a time" },
    { label: "Based in", value: "Minneapolis, Minnesota (CT)" },
    { label: "Reply time", value: "Usually the same day" },
    { label: "Phone", value: "(612) 444-3853" },
  ],
  toolbox: [
    { group: "Languages", items: ["HTML", "CSS", "JavaScript", "TypeScript", "Python"] },
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
    { group: "Backend", items: ["Node.js", "REST APIs", "Supabase", "Postgres"] },
    { group: "Ship it", items: ["Vercel", "Cloudflare", "Git & GitHub", "Figma"] },
  ],
  beyondCode: [
    { title: "Running", body: "Middle distance, mostly 800m. The reason half my projects are training tools." },
    { title: "Music", body: "I build music players when I should be doing something else. Sproti.30 started that way." },
    { title: "Small tools", body: "If an app annoys me twice, I build a worse version of it that does exactly what I need." },
  ],
} as const;

export const experience = {
  eyebrow: "Experience",
  title: "What I've built, and where.",
  intro:
    "Client sites, my own projects, and the code behind them. All of it is live and can be checked.",
  roles: [
    {
      role: "Founder & developer",
      company: "Base31",
      location: "Remote",
      period: "2025 — Present",
      summary:
        "The name I build under. Two public sites so far, both designed, written and shipped by me.",
      highlights: [
        "nikoschultz.base31.org — a results-first site for an 800m runner, with every personal best linked to its source race.",
        "sawyerschulz.base31.org — my own portfolio, phone-first so it opens fast on a bad connection.",
        "I run the whole thing: design, code, deploy, and the content updates after launch.",
      ],
      tags: ["Next.js", "TypeScript", "Design", "Vercel"],
    },
    {
      role: "Web designer & developer",
      company: "Freelance",
      location: "Minneapolis, MN",
      period: "2025 — Present",
      summary:
        "Fixed-price sites for local people and small businesses, one at a time from first call to launch.",
      highlights: [
        "Agree a flat price before any work starts, so the invoice is never a surprise.",
        "Design, build, domain and launch, then hand over the source and a short doc.",
      ],
      tags: ["Design", "HTML", "CSS", "JavaScript"],
    },
    {
      role: "Independent projects",
      company: "GitHub",
      location: "github.com/NOTAM-bobk",
      period: "2025 — Present",
      summary:
        "71 public repositories, mostly web apps built to learn something or to fix an annoyance.",
      highlights: [
        "Nimbus. — a weather app with news and a multi-country API. 4 stars.",
        "Decibel.listenr — measures how loud a room is, live in the browser. 3 stars.",
        "JamJolt — a music app that stores files in Supabase buckets. 3 stars.",
        "URL-Save — saves links to Cloudflare so they open on any device. 3 stars.",
      ],
      tags: ["JavaScript", "TypeScript", "APIs", "Cloudflare"],
    },
  ],
} as const;

export type ProjectLink = { label: string; href: string };
export type ProjectFact = { label: string; value: string };

export type Project = {
  name: string;
  kind: string;
  year: string;
  href: string;
  summary: string;
  detail: string;
  highlights: readonly string[];
  tags: readonly string[];
  facts: readonly ProjectFact[];
  links: readonly ProjectLink[];
  featured?: boolean;
};

export const projects = {
  eyebrow: "Projects",
  title: "Two sites, both live.",
  intro:
    "Both of these are mine end to end — design, code, and the updates after launch.",
  items: [
    {
      name: "Niko Schultz — 800m",
      kind: "Athlete site",
      year: "2026",
      href: "https://nikoschultz.base31.org",
      featured: true,
      summary:
        "A results-first site for an 800m runner: personal bests, a race timeline and a video hub on one page.",
      detail:
        "Every personal best links to the official result or race report behind it, so nothing on the site has to be taken on trust. The timeline covers the NCAA and international seasons and gets updated as the year goes on.",
      highlights: [
        "Personal-best cards, each linked to its source race",
        "A rolling race timeline across the season",
        "Video and social hub built around his own channels",
      ],
      tags: ["Athlete site", "Results & stats", "Timeline"],
      facts: [
        { label: "Role", value: "Design & build" },
        { label: "Status", value: "Live" },
        { label: "Type", value: "Independent" },
      ],
      links: [{ label: "Visit site", href: "https://nikoschultz.base31.org" }],
    },
    {
      name: "Sawyer Schulz — Portfolio",
      kind: "Personal site",
      year: "2026",
      href: "https://sawyerschulz.base31.org",
      summary:
        "My own corner of the web: projects, skills, race results and how to reach me, all in one link.",
      detail:
        "Built phone-first, because the link gets shared at the track more often than at a desk. It is the page I send when someone asks what I build.",
      highlights: [
        "Projects, skills and race results in one place",
        "Loads fast on a phone on a bad connection",
        "One link to share instead of three",
      ],
      tags: ["Portfolio", "Race results", "Responsive"],
      facts: [
        { label: "Role", value: "Design & build" },
        { label: "Status", value: "Live" },
        { label: "Type", value: "Personal" },
      ],
      links: [{ label: "Visit site", href: "https://sawyerschulz.base31.org" }],
    },
  ],
} as const satisfies {
  eyebrow: string;
  title: string;
  intro: string;
  items: readonly Project[];
};

export const pricing = {
  eyebrow: "Pricing",
  title: "One site. $299.",
  intro:
    "A complete site, designed, built and launched. No hourly rate and no add-ons to work through.",
  note: "Fixed price in USD. Half to start, half at launch.",
  options: [
    {
      name: "Full site",
      price: "$299",
      priceNote: "one-time, fixed price",
      for: "A complete site for a person, a small business or a project, designed around your content and live on your own domain.",
      turnaround: "Usually 1–2 weeks",
      highlight: "Everything included",
      features: [
        "Custom design built around your content",
        "Up to 5 pages",
        "Works on phone, tablet and desktop",
        "Contact form wired to your inbox",
        "SEO basics, sitemap and analytics",
        "Live on your domain, with the source code",
      ],
      cta: "Start my site",
    },
  ],
  included: [
    "You talk to me, not an account manager",
    "Source code and design files handed over",
    "Performance and accessibility checked before launch",
    "A short handover doc so you can edit it later",
  ],
  faq: [
    {
      q: "What does $299 cover?",
      a: "One complete site: up to five pages, custom design, the build, SEO basics and getting it live on your domain. If something falls outside that, I quote it before starting.",
    },
    {
      q: "What do you need from me?",
      a: "Your text, photos and logo if you have one, plus a rough idea of the pages. If the writing isn't there yet, I can help shape it.",
    },
    {
      q: "How long does it take?",
      a: "Usually one to two weeks once I have your content. If you need it faster, ask and I'll tell you honestly whether that is possible.",
    },
    {
      q: "What if the scope changes?",
      a: "Tell me before I start the change. Small tweaks are free; extra pages or new features get quoted separately.",
    },
  ],
} as const;
