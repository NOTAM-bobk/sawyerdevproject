/**
 * Single source of truth for every piece of copy on the site.
 * Edit this file to update the site — no component changes required.
 */

/**
 * Canonical site origin, resolved once at build time.
 *
 * Order: an explicit NEXT_PUBLIC_SITE_URL, then the production domain Vercel
 * reports for this project (the shortest custom domain, or the vercel.app one),
 * then the fallback below.
 */
function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return trimSlash(configured);

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelDomain) return trimSlash(`https://${vercelDomain}`);

  return "https://sawyerschulz.dev";
}

function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}

export const site = {
  name: "Sawyer Schulz",
  shortName: "Sawyer",
  initials: "SS",
  /** Trading name shown in the header. */
  company: "Elephants Foot development team",
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
  email: "035665@mtka.org",
  /**
   * Canonical origin, no trailing slash. An env var set to an empty string
   * counts as unset — Vercel will happily store `NEXT_PUBLIC_SITE_URL=` and a
   * blank origin would poison every canonical URL and the sitemap.
   */
  url: resolveSiteUrl(),
  description:
    "Sawyer Schulz designs and builds websites in Minneapolis, Minnesota. One complete site for $299, designed, built and launched.",
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
  { value: "4", label: "Projects, all live" },
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
    { group: "Ship it", items: ["Vercel", "Cloudflare", "Git", "Figma"] },
  ],
  beyondCode: [
    { title: "Small tools", body: "If an app annoys me twice, I build a worse version of it that does exactly what I need." },
    { title: "Music", body: "I build music players when I should be doing something else. Sproti.30 started that way." },
    { title: "Backend tinkering", body: "Most of my side projects are half an idea and an API. The good half usually ends up on a client site later." },
  ],
} as const;

export const experience = {
  eyebrow: "Experience",
  title: "What I work with, and what I'm building now.",
  intro:
    "Five years of client sites and my own products. Everything I make is live and can be checked.",
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
  title: "Four projects, all live.",
  intro:
    "Four sites I designed and built — two directories, a site for an 800m runner and my own portfolio. Every one of them is running right now.",
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
} as const satisfies {
  eyebrow: string;
  title: string;
  intro: string;
  items: readonly Project[];
};

export const dashboard = {
  eyebrow: "Your dashboard",
  title: "You watch it happen, live.",
  intro:
    "Every project comes with a private dashboard you sign in to. Nothing happens behind a closed door: you can see the work move, step by step, and talk to me inside it.",
  features: [
    {
      title: "Live updates",
      badge: "",
      body: "A dated timeline of the build that keeps itself current. Open the page and you are reading where things stand right now, not where they stood last week.",
    },
    {
      title: "Progress checks",
      badge: "",
      body: "The checklist I am working through, ticked off as I go, with a progress bar worked out from those same steps — so the number and the list can never disagree.",
    },
    {
      title: "Live chat",
      badge: "Live now",
      body: "Message me from inside the dashboard and my reply lands there, usually while you are still on the page. No lost email threads and nothing to screenshot.",
    },
    {
      title: "Launch countdown",
      badge: "",
      body: "Your current stats, every project link in one place, and a live countdown to the launch date — ticking down in seconds.",
    },
  ],
  note:
    "Sign in with the code you are given the moment you send your enquiry. There is no account to create and nothing to install.",
} as const;

/**
 * The case for having a site at all, aimed at a small business rather than a
 * developer. Deliberately free of invented statistics — every claim here is
 * something the buyer already knows from their own week.
 */
export const whyASite = {
  eyebrow: "Why it pays off",
  title: "What a site actually does for a business.",
  intro:
    "A website isn't decoration. For a small business it does four jobs every day, whether or not anyone is watching — and none of them need a big site.",
  reasons: [
    {
      title: "People check you out before they call",
      body: "Almost every first contact starts with a search or with a link somebody forwarded. If all that turns up is an old social page, the decision gets made without you in the room.",
      payoff: "One link that says what you do, where you work and how to reach you.",
    },
    {
      title: "It answers the questions you keep repeating",
      body: "Hours, prices, service area, whether you take that kind of job, how far you travel. Written down once, in the place people actually look for it.",
      payoff: "Fewer quick-question calls, and more of the calls that are ready to book.",
    },
    {
      title: "It makes a one-person operation look established",
      body: "A clean site that loads quickly reads the same whether you're one person or ten. A half-finished page reads like a hobby — and customers price accordingly.",
      payoff: "You get compared on your work instead of on your web presence.",
    },
    {
      title: "It works when you're not",
      body: "The enquiry form takes the details at 11pm on a Sunday, while you're on a job or asleep. You read them in the morning with everything you need to reply.",
      payoff: "Every enquiry gets written down — nothing lost in a DM or a missed call.",
    },
  ],
  note:
    "That's the whole case for a small site: be findable, look established, stop repeating yourself, and catch the enquiries that arrive while you're busy. One page that loads fast does most of it — which is why the build is $299 once, not a monthly retainer.",
} as const;

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
        "A private dashboard: live updates, progress and live chat",
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
