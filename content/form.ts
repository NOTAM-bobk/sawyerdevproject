/** Questions for the "Start a project" form. Edit the copy and options here. */

export type FieldOption = { value: string; label: string; hint?: string };

type FieldBase = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
};

/**
 * Each variant carries a single literal `type` so TypeScript can narrow them.
 */
export type Field =
  | ({ type: "text" | "email" | "tel" | "date"; placeholder?: string; half?: boolean } & FieldBase)
  | ({ type: "textarea"; placeholder?: string; rows?: number } & FieldBase)
  | ({ type: "radio"; options: readonly FieldOption[] } & FieldBase)
  | ({ type: "checks"; options: readonly FieldOption[] } & FieldBase);

export type FormStep = {
  id: string;
  title: string;
  description: string;
  fields: readonly Field[];
};

export const projectForm: {
  eyebrow: string;
  title: string;
  intro: string;
  steps: readonly FormStep[];
} = {
  eyebrow: "Start a project",
  title: "Let's build your site.",
  intro:
    "Answer what you can — rough notes are plenty. Four short steps, then I review every detail myself and reply with a plan, a fixed price, and an honest timeline.",
  steps: [
    {
      id: "project",
      title: "The Project & Goals",
      description: "What are we building, and what should it accomplish for you?",
      fields: [
        {
          type: "radio",
          name: "projectType",
          label: "What kind of site is this?",
          required: true,
          options: [
            { value: "business", label: "Small business site", hint: "A service, local trade, studio, or shop" },
            { value: "portfolio", label: "Portfolio & creative", hint: "Showcase past projects, photography, or work" },
            { value: "personal", label: "Personal site", hint: "About you, your career, resume, or athletic profile" },
            { value: "booking", label: "Booking & appointments", hint: "Client scheduling, consultations, or calendar" },
            { value: "ecommerce", label: "E-commerce & shop", hint: "Selling physical or digital goods online" },
            { value: "event", label: "Event or one-off", hint: "A wedding, conference, team, or fundraiser" },
            { value: "other", label: "Something else", hint: "Describe your custom project below" },
          ],
        },
        {
          type: "text",
          name: "projectName",
          label: "What's the business or project called?",
          placeholder: "e.g. Acme Craft Studio, Sawyer Schulz, North Shore Labs",
          half: true,
        },
        {
          type: "text",
          name: "existingUrl",
          label: "Is there an existing site or social profile?",
          placeholder: "https://yourcurrentsite.com or @instagram",
          hint: "Helps me see where you're starting from today.",
          half: true,
        },
        {
          type: "textarea",
          name: "goal",
          label: "What is the primary goal of the site?",
          placeholder:
            "e.g. Get discovered by local customers on Google, look professional when sending proposals, allow clients to book appointments, sell products directly…",
          required: true,
          rows: 3,
        },
        {
          type: "radio",
          name: "primaryCta",
          label: "What is the single most important action for visitors?",
          options: [
            { value: "contact-form", label: "Submit an enquiry or request a quote" },
            { value: "call-text", label: "Call or text me directly" },
            { value: "booking", label: "Book a consultation or appointment" },
            { value: "buy", label: "Purchase a product or pay online" },
            { value: "portfolio", label: "View portfolio, case studies, or pricing" },
            { value: "social", label: "Follow on Instagram or social channels" },
          ],
        },
      ],
    },
    {
      id: "business",
      title: "Your Business & Audience",
      description: "Who you serve, what makes you stand out, and where you're going.",
      fields: [
        {
          type: "textarea",
          name: "audience",
          label: "Who is your ideal customer or visitor?",
          placeholder:
            "e.g. Homeowners in the Twin Cities looking for kitchen remodels, creative directors hiring freelance designers, local athletes seeking training…",
          hint: "Even one sentence gives me the context to write good copy and choose the right hierarchy.",
          required: true,
          rows: 3,
        },
        {
          type: "textarea",
          name: "servicesList",
          label: "What are your core services, packages, or products?",
          placeholder: "List your main offerings, popular packages, or things you want to highlight most…",
          rows: 3,
        },
        {
          type: "text",
          name: "differentiator",
          label: "What sets you apart from competitors?",
          placeholder: "e.g. 24h response time, 15 years in business, transparent pricing, handcrafted quality",
          half: true,
        },
        {
          type: "text",
          name: "startedYear",
          label: "How long have you been in business?",
          placeholder: "e.g. Since 2018, just launching this month, 5+ years",
          half: true,
        },
        {
          type: "textarea",
          name: "competitorSites",
          label: "Inspiration or competitor sites you like (or want to avoid)?",
          placeholder: "Drop links or names of sites whose layout, vibe, typography, or simplicity you admire…",
          rows: 2,
        },
        {
          type: "checks",
          name: "channels",
          label: "What online presence do you currently have?",
          hint: "Pick what applies — the new site connects directly with these.",
          options: [
            { value: "google-business", label: "Google Business / Maps profile" },
            { value: "instagram", label: "Instagram or Facebook page" },
            { value: "linkedin", label: "LinkedIn or X / Twitter" },
            { value: "reviews", label: "Google, Yelp, or Houzz reviews" },
            { value: "email-list", label: "Email newsletter / subscriber list" },
            { value: "nothing", label: "Starting fresh with no online presence" },
          ],
        },
        {
          type: "radio",
          name: "successMetric",
          label: "What would make this project a clear win for you?",
          options: [
            { value: "enquiries", label: "Consistent incoming enquiries and qualified leads" },
            { value: "credibility", label: "Looking polished and credible when clients search for me" },
            { value: "google-ranking", label: "Ranking higher on local Google search results" },
            { value: "online-sales", label: "Taking bookings or making sales without manual back-and-forth" },
            { value: "one-link", label: "Having one beautiful home link to put on business cards and social" },
          ],
        },
      ],
    },
    {
      id: "design",
      title: "Design, Branding & Pages",
      description: "The visual style, layout structure, and connections your site needs.",
      fields: [
        {
          type: "radio",
          name: "brandAssets",
          label: "Do you have existing brand assets or a logo?",
          options: [
            { value: "ready", label: "Yes — high-res logo & brand colors ready", hint: "You can upload them to your dashboard right after submitting" },
            { value: "basic", label: "Basic logo only — need color palette & typography chosen", hint: "I'll curate modern matching fonts and colors" },
            { value: "need-logo", label: "No logo — need a clean modern wordmark designed", hint: "Included in the build" },
            { value: "scratch", label: "Starting completely from scratch", hint: "I will propose complete styling" },
          ],
        },
        {
          type: "checks",
          name: "designStyles",
          label: "What visual style resonates with you?",
          hint: "Select anything that fits your taste — there are no wrong answers.",
          required: true,
          options: [
            { value: "minimal", label: "Minimal & Clean", hint: "Generous whitespace, refined typography, quiet confidence" },
            { value: "bold", label: "Bold & High-Contrast", hint: "Punchy headlines, crisp lines, modern aesthetic" },
            { value: "warm", label: "Warm & Approachable", hint: "Soft tones, rounded corners, welcoming and human" },
            { value: "dark", label: "Dark & Technical", hint: "Sleek dark theme, high-tech and modern vibe" },
            { value: "editorial", label: "Editorial & Refined", hint: "Typography-driven, magazine-like elegance" },
            { value: "handcrafted", label: "Hand-Drawn & Characterful", hint: "Custom doodle accents, authentic personality" },
            { value: "you-decide", label: "You decide", hint: "I'll create the style that best fits your niche" },
          ],
        },
        {
          type: "radio",
          name: "colorVibe",
          label: "What color palette feels right?",
          options: [
            { value: "monochrome", label: "Monochrome Modern", hint: "Pure black, crisp white, subtle neutral grays" },
            { value: "warm-earth", label: "Warm & Earthy", hint: "Terracotta, sand, olive green, warm stone" },
            { value: "deep-navy", label: "Cool Navy & Slate", hint: "Deep blues, steel, crisp clean accents" },
            { value: "vibrant", label: "Vibrant & Punchy", hint: "Electric blue, bright orange, high energy" },
            { value: "soft", label: "Soft & Airy", hint: "Pastels, muted creams, calming tones" },
            { value: "trust-sawyer", label: "Trust your eye", hint: "I'll choose a palette tailored to your field" },
          ],
        },
        {
          type: "checks",
          name: "pages",
          label: "Which pages or sections do you need?",
          required: true,
          options: [
            { value: "home", label: "Home / Hero" },
            { value: "about", label: "About / Our Story" },
            { value: "services", label: "Services & Offerings" },
            { value: "portfolio", label: "Portfolio / Work Gallery" },
            { value: "pricing", label: "Pricing & Packages" },
            { value: "reviews", label: "Testimonials & Social Proof" },
            { value: "faq", label: "Frequently Asked Questions (FAQ)" },
            { value: "contact", label: "Contact & Location" },
            { value: "booking", label: "Online Booking / Calendar" },
            { value: "blog", label: "Blog or Articles" },
            { value: "client-portal", label: "Private Client Portal" },
            { value: "other", label: "Something custom" },
          ],
        },
        {
          type: "checks",
          name: "connections",
          label: "What integrations do you need?",
          hint: "Everything is configured seamlessly during the build.",
          options: [
            { value: "contact-form", label: "Contact & Lead Form (direct to your email)" },
            { value: "booking", label: "Calendly / Cal.com Appointment Scheduler" },
            { value: "stripe", label: "Stripe / Online Payments & Invoices" },
            { value: "newsletter", label: "Email Newsletter (Substack / Mailchimp)" },
            { value: "maps", label: "Google Maps & Local Directions" },
            { value: "client-dashboard", label: "Private Client Dashboard" },
            { value: "social", label: "Instagram Feed / Social Embeds" },
            { value: "analytics", label: "Google Analytics & Search Console Setup" },
            { value: "none", label: "None for now — keep it simple" },
          ],
        },
        {
          type: "radio",
          name: "contentWriter",
          label: "Who is handling the text & copy?",
          options: [
            { value: "client-ready", label: "I have the copy ready to paste" },
            { value: "rough-notes", label: "I have rough notes — help me polish them" },
            { value: "sawyer-writes", label: "Write it for me based on my answers" },
            { value: "reuse-old", label: "Pull it from my existing website or profiles" },
          ],
        },
        {
          type: "radio",
          name: "domainStatus",
          label: "Do you have a custom domain name?",
          options: [
            { value: "own", label: "I own one already (e.g. myname.com)" },
            { value: "need-help", label: "I know what name I want, but haven't purchased it yet" },
            { value: "advice", label: "Need help finding an available domain" },
            { value: "none", label: "Haven't thought about it yet" },
          ],
        },
        {
          type: "text",
          name: "domainName",
          label: "What domain name (if known)?",
          placeholder: "e.g. yourbusiness.com (optional)",
          half: true,
        },
      ],
    },
    {
      id: "timeline",
      title: "Timeline, Budget & Contact",
      description: "When you need it launched and how I should reach you.",
      fields: [
        {
          type: "radio",
          name: "timeframe",
          label: "What is your desired launch timeline?",
          required: true,
          options: [
            { value: "asap", label: "As soon as possible (Ready to start now)" },
            { value: "2-3-weeks", label: "In the next 2 to 3 weeks" },
            { value: "month", label: "Within the next month or two" },
            { value: "planning", label: "Just gathering information for now" },
          ],
        },
        {
          type: "radio",
          name: "scope",
          label: "What is your budget expectation?",
          hint: "The $299 flat fee covers standard full builds with no upfront deposit.",
          options: [
            { value: "standard", label: "Standard Flat Package — $299", hint: "Pay only after reviewing the completed build" },
            { value: "expanded", label: "Expanded Build — $299 to $450", hint: "If extra custom features, multiple pages, or shop setup are needed" },
            { value: "custom", label: "Larger Custom Build — $500+", hint: "Full custom web application or extensive database" },
            { value: "advice", label: "Not sure — help me assess what makes sense" },
          ],
        },
        {
          type: "radio",
          name: "hostingPreference",
          label: "How would you prefer to handle hosting & upkeep?",
          options: [
            { value: "managed", label: "I'd like you to handle hosting, updates, and maintenance" },
            { value: "self-hosted", label: "I'd like to host it myself on Vercel or Cloudflare" },
            { value: "undecided", label: "Help me decide what's most cost-effective" },
          ],
        },
        {
          type: "date",
          name: "deadline",
          label: "Hard deadline date (if any)",
          hint: "Event launch, seasonal rush, or lease date — optional.",
          half: true,
        },
        {
          type: "text",
          name: "name",
          label: "Your Full Name",
          placeholder: "e.g. Jane Doe",
          required: true,
          half: true,
        },
        {
          type: "email",
          name: "email",
          label: "Your Email Address",
          placeholder: "you@example.com",
          required: true,
          half: true,
        },
        {
          type: "tel",
          name: "phone",
          label: "Phone Number",
          placeholder: "(555) 000-0000",
          hint: "Optional — handy for quick SMS or call updates.",
          half: true,
        },
        {
          type: "radio",
          name: "contactPreference",
          label: "How do you prefer I send your project quote & plan?",
          options: [
            { value: "email", label: "Email (detailed breakdown with links)" },
            { value: "text", label: "Text message (quick heads-up with link)" },
            { value: "phone", label: "Phone call (brief 10-minute walk-through)" },
          ],
        },
        {
          type: "text",
          name: "heardAbout",
          label: "How did you hear about me?",
          placeholder: "e.g. Friend recommendation, Google search, Twitter/X, local business…",
        },
        {
          type: "textarea",
          name: "notes",
          label: "Anything else you want me to know?",
          placeholder: "Any special features, specific design preferences, questions, or ideas you have in mind…",
          rows: 3,
        },
      ],
    },
  ],
};
