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
  { value: "5 yrs", label: "Building websites" },
  { value: "12", label: "Projects shipped" },
  { value: "$299", label: "Flat price, whole site" },
  { value: "1–2 wks", label: "Typical build time" },
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
    "Five years of designing and building sites for people and small businesses. One fixed price, one person to talk to, no handovers.",
  paragraphs: [
    "I'm Sawyer, and I've been building websites for five years. I started by making pages for things I cared about and small tools for problems no app seemed to solve. People started asking me to build theirs.",
    "Now I take on a few sites at a time. I write the design and the code myself, so nothing gets lost between a mockup and what actually ships. Everything I make is meant to be handed over: your domain, your content, your code.",
  ],
  currently: [
    { label: "Experience", value: "5 years building websites" },
    { label: "Building", value: "base31.org" },
    { label: "Also doing", value: "Client sites, one at a time" },
    { label: "Based in", value: "Minneapolis, Minnesota (CT)" },
    { label: "Phone", value: "(612) 444-3853" },
  ],
  toolbox: [
    { group: "Languages", items: ["HTML", "CSS", "JavaScript", "TypeScript", "Python"] },
    { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
    { group: "Backend", items: ["Node.js", "REST APIs", "Supabase", "Postgres"] },
    { group: "Ship it", items: ["Vercel", "Cloudflare", "Git & GitHub", "Figma"] },
  ],
  beyondCode: [
    { title: "Small tools", body: "If an app annoys me twice, I build a worse version of it that does exactly what I need." },
    { title: "Music", body: "I build music players when I should be doing something else. Sproti.30 started that way." },
    { title: "Backend tinkering", body: "Most of my repos are half an idea and an API. The good half usually ends up on a client site later." },
  ],
} as const;

export const experience = {
  eyebrow: "Experience",
  title: "What I've built, and where.",
  intro:
    "Five years of client sites, my own projects, and the code behind them. All of it is live and can be checked.",
  roles: [
    {
      role: "Founder & developer",
      company: "base31.org",
      location: "Remote",
      period: "2025 — Present",
      summary:
        "My own products, designed, built and shipped by me: a web directory and a launch directory, plus the client sites that live under the same name.",
      highlights: [
        "base31.org — a hand-checked directory of 195 sites, with voting, tags and a live map of every pick.",
        "benlaunches.icu — a directory of newly launched sites, screened for speed and dodgy patterns.",
        "nikoschultz.base31.org — a results-first site for an 800m runner, with every personal best linked to its source race.",
        "I run the whole thing: design, code, deploy, and the content updates after launch.",
      ],
      tags: ["Next.js", "TypeScript", "Design", "Vercel"],
    },
    {
      role: "Web designer & developer",
      company: "Freelance",
      location: "Minneapolis, MN",
      period: "2021 — Present",
      summary:
        "Five years of fixed-price sites for local people and small businesses, one at a time from first call to launch.",
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
      period: "2021 — Present",
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
  title: "Twelve projects, all live.",
  intro:
    "Four sites I designed and built — two directories, a portfolio and an athlete site — then eight smaller apps from my GitHub. Every one of them is running right now.",
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
        "My own corner of the web: projects, skills and how to reach me, all in one link.",
      detail:
        "Built phone-first, because most people open a link on a phone. It is the page I send when someone asks what I build.",
      highlights: [
        "Projects and skills in one place",
        "Loads fast on a phone on a bad connection",
        "One link to share instead of three",
      ],
      tags: ["Portfolio", "Personal site", "Responsive"],
      facts: [
        { label: "Role", value: "Design & build" },
        { label: "Status", value: "Live" },
        { label: "Type", value: "Personal" },
      ],
      links: [{ label: "Visit site", href: "https://sawyerschulz.base31.org" }],
    },
    {
      name: "base31.org",
      kind: "Web directory",
      year: "2026",
      href: "https://base31.org",
      featured: true,
      summary:
        "An independent directory of the interesting web: 195 hand-checked sites across six collections, with voting, tags and a live map of every pick.",
      detail:
        "Nothing goes in unchecked — no dead links and no auto-scraped filler. Visitors vote a pick up or down, the editor's picks rotate, and a website of the week is chosen by hand. The map is drawn from the directory itself, so a new pick appears on it by itself the next time the site publishes.",
      highlights: [
        "195 picks across six collections, each with its own page",
        "Up and down votes that rank a trending top ten",
        "A live map that redraws itself from the directory",
        "Search, tags and a form for submitting a link",
      ],
      tags: ["Directory", "Design & build", "Search & filtering"],
      facts: [
        { label: "Role", value: "Design & build" },
        { label: "Status", value: "Live" },
        { label: "Type", value: "Own product" },
      ],
      links: [{ label: "Visit site", href: "https://base31.org" }],
    },
    {
      name: "Ben Launches — Boring Internet",
      kind: "Launch directory",
      year: "2026",
      href: "https://benlaunches.icu",
      featured: true,
      summary:
        "A directory of newly launched sites — hand-checked pages that load fast and skip the growth tactics — plus a bored button that drops you at a random one.",
      detail:
        "Built around one rule: a site only goes in if it loads quickly and respects your attention. Visitors can submit their own launch, and the bored button turns the directory into something to browse on a slow afternoon.",
      highlights: [
        "Hand-checked launches, screened for speed and dark patterns",
        "A bored button that jumps to a random site",
        "A submit-your-own-launch flow",
        "Built to load quickly itself, not just to judge it",
      ],
      tags: ["Directory", "Design & build", "Discovery"],
      facts: [
        { label: "Role", value: "Design & build" },
        { label: "Status", value: "Live" },
        { label: "Type", value: "Own product" },
      ],
      links: [{ label: "Visit site", href: "https://benlaunches.icu" }],
    },
  ],
  /**
   * The rest of the ten: smaller apps, all public on GitHub, all live.
   * Star counts are a snapshot — lib/github.ts keeps the live panel current.
   */
  more: [
    {
      name: "Shinobi.genjustu",
      description: "Pulls the latest posts from a feed into a single page.",
      href: "https://github.com/NOTAM-bobk/Shinobi.genjustu",
      language: "TypeScript",
      stars: 5,
    },
    {
      name: "Nimbus.",
      description: "Weather app with news and a multi-country API.",
      href: "https://github.com/NOTAM-bobk/Nimbus.",
      language: "HTML",
      stars: 4,
    },
    {
      name: "Decibel.listenr",
      description: "Reads the microphone and shows how loud a room is, live.",
      href: "https://github.com/NOTAM-bobk/Decibel.listenr",
      language: "JavaScript",
      stars: 3,
    },
    {
      name: "JamJolt",
      description: "Music app that stores its files in Supabase buckets.",
      href: "https://github.com/NOTAM-bobk/JamJolt",
      language: "JavaScript",
      stars: 3,
    },
    {
      name: "Sproti.30",
      description: "A 30-second music player built on the iTunes and Deezer APIs.",
      href: "https://github.com/NOTAM-bobk/Sproti.30",
      language: "HTML",
      stars: 3,
    },
    {
      name: "URL-Save",
      description: "Saves links to Cloudflare so they open on any device.",
      href: "https://github.com/NOTAM-bobk/URL-Save",
      language: "HTML",
      stars: 3,
    },
    {
      name: "ally",
      description: "A hydration tracker: log what you drink, watch the day add up.",
      href: "https://github.com/NOTAM-bobk/ally",
      language: "JavaScript",
      stars: 2,
    },
    {
      name: "focus-canvas",
      description: "Focus timer, stopwatch, pomodoro, notes and draggable widgets.",
      href: "https://github.com/NOTAM-bobk/focus-canvas",
      language: "JavaScript",
      stars: 0,
    },
  ],
} as const satisfies {
  eyebrow: string;
  title: string;
  intro: string;
  items: readonly Project[];
  more: readonly {
    name: string;
    description: string;
    href: string;
    language: string;
    stars: number;
  }[];
};

export const pricing = {
  eyebrow: "Pricing",
  title: "One site. $299.",
  intro:
    "A complete site, designed, built and launched. No hourly rate and no add-ons to work through.",
  note: "Fixed price in USD. No upfront cost — you pay once the site is built and you've seen it.",
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
        "No upfront cost — you pay after the build",
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
      q: "When do I pay?",
      a: "After the build, not before. You see the finished site first, then pay the $299 when it's ready to go live. No deposit, no invoice up front.",
    },
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
