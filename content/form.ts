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
 * (A member whose discriminant is a union of literals cannot be excluded by
 * `if (a || b) return`, which is exactly what the form renderer needs.)
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
    "Answer what you can — a rough idea is plenty. Four short steps, then I read every answer myself and reply with a plan, a fixed price and an honest timeline.",
  steps: [
    {
      id: "project",
      title: "The project",
      description: "What are we building, and what should it do for you?",
      fields: [
        {
          type: "radio",
          name: "projectType",
          label: "What kind of site is this?",
          required: true,
          options: [
            { value: "personal", label: "Personal site", hint: "About you, your work or your sport" },
            { value: "business", label: "Small business site", hint: "A shop, a studio, a service" },
            { value: "portfolio", label: "Portfolio", hint: "Projects, photos, case studies" },
            { value: "event", label: "Event or team site", hint: "A race, a club, a one-off" },
            { value: "other", label: "Something else", hint: "Tell me below" },
          ],
        },
        {
          type: "text",
          name: "projectName",
          label: "What's it called?",
          placeholder: "Business name, your name, or a working title",
          half: true,
        },
        {
          type: "text",
          name: "existingUrl",
          label: "Is there an existing site?",
          placeholder: "https://example.com (optional)",
          hint: "Even a link to a social page helps me see where you're starting from.",
          half: true,
        },
        {
          type: "textarea",
          name: "goal",
          label: "What should the site do for you?",
          placeholder:
            "Get me found locally, show off my work, take bookings, give people one link to share…",
          required: true,
          rows: 4,
        },
      ],
    },
    {
      id: "business",
      title: "Your business",
      description: "Who you're trying to reach, and what a site should change for you.",
      fields: [
        {
          type: "textarea",
          name: "audience",
          label: "Who is this site for?",
          placeholder:
            "Homeowners nearby, parents looking for lessons, other businesses, people who already follow me…",
          hint: "One sentence is plenty — it shapes the wording, the photos and the pages.",
          required: true,
          rows: 3,
        },
        {
          type: "text",
          name: "differentiator",
          label: "What makes you different from the other options?",
          placeholder: "Faster turnaround, fair rates, family-run since 1998, we actually answer the phone…",
          hint: "Whatever people say after they've worked with you.",
          half: true,
        },
        {
          type: "text",
          name: "startedYear",
          label: "How long have you been doing this?",
          placeholder: "Two years, since 2019, just starting out…",
          half: true,
        },
        {
          type: "textarea",
          name: "findToday",
          label: "How do people find you today?",
          placeholder: "Word of mouth, a Facebook page, a Google listing, repeat clients, a market stall…",
          rows: 3,
        },
        {
          type: "checks",
          name: "channels",
          label: "Anything online already?",
          hint: "Pick what applies — the site links to these rather than replacing them.",
          options: [
            { value: "google-business", label: "Google Business profile" },
            { value: "facebook", label: "Facebook or Instagram" },
            { value: "marketplace", label: "Etsy, Thumbtack, Yelp or similar" },
            { value: "reviews", label: "Google or Yelp reviews" },
            { value: "email-list", label: "An email list" },
            { value: "links", label: "Other sites linking to me" },
            { value: "nothing", label: "Nothing online yet" },
          ],
        },
        {
          type: "radio",
          name: "successMetric",
          label: "What would make the site worth it in six months?",
          hint: "This is the thing I'll judge the build against — you can pick more in the notes below.",
          options: [
            { value: "found", label: "People find me on Google" },
            { value: "enquiries", label: "More enquiries or calls" },
            { value: "credible", label: "Customers take me seriously" },
            { value: "bookings", label: "Bookings or orders online" },
            { value: "one-link", label: "One link to share everywhere" },
            { value: "unsure", label: "Not sure yet" },
          ],
        },
      ],
    },
    {
      id: "design",
      title: "Design, pages & connections",
      description: "How should it look, what goes on it, and what does it need to talk to?",
      fields: [
        {
          type: "checks",
          name: "designStyles",
          label: "What style are you drawn to?",
          hint: "Pick anything that feels right — there's no wrong answer.",
          required: true,
          options: [
            { value: "minimal", label: "Minimal & clean", hint: "Lots of space, quiet type" },
            { value: "bold", label: "Bold & colourful", hint: "Big type, strong colour" },
            { value: "warm", label: "Warm & friendly", hint: "Rounded, approachable" },
            { value: "dark", label: "Dark & technical", hint: "Dark surfaces, sharp edges" },
            { value: "editorial", label: "Editorial", hint: "Text-led, magazine feel" },
            { value: "handmade", label: "Hand-drawn", hint: "Sketchy, personal, less corporate" },
            { value: "unsure", label: "Not sure — you decide", hint: "I'll propose two directions" },
          ],
        },
        {
          type: "textarea",
          name: "references",
          label: "Any sites or designs you like?",
          placeholder: "Links welcome — anything you've seen and thought “I want that”",
          rows: 3,
        },
        {
          type: "checks",
          name: "pages",
          label: "Which pages do you need?",
          required: true,
          options: [
            { value: "home", label: "Home" },
            { value: "about", label: "About" },
            { value: "services", label: "Services or what you offer" },
            { value: "portfolio", label: "Portfolio or gallery" },
            { value: "pricing", label: "Pricing" },
            { value: "blog", label: "Blog or news" },
            { value: "booking", label: "Booking or schedule" },
            { value: "reviews", label: "Reviews or testimonials" },
            { value: "faq", label: "FAQ" },
            { value: "contact", label: "Contact" },
            { value: "other", label: "Something else" },
          ],
        },
        {
          type: "checks",
          name: "connections",
          label: "Anything it needs to connect to?",
          hint: "Pick what applies — I'll confirm what's included before we start.",
          options: [
            { value: "contact-form", label: "Contact form" },
            { value: "booking", label: "Booking or calendar" },
            { value: "payments", label: "Payments" },
            { value: "newsletter", label: "Newsletter or mailing list" },
            { value: "cms", label: "Blog or CMS you can edit yourself" },
            { value: "social", label: "Social feeds" },
            { value: "maps", label: "Map & directions" },
            { value: "analytics", label: "Analytics" },
            { value: "client-portal", label: "A private area for clients" },
            { value: "none", label: "Nothing yet" },
            { value: "other", label: "Something else" },
          ],
        },
        {
          type: "radio",
          name: "assets",
          label: "What do you already have?",
          options: [
            { value: "ready", label: "Text and photos ready" },
            { value: "some", label: "Some of it — need help with the rest" },
            { value: "none", label: "Nothing yet" },
          ],
        },
        {
          type: "radio",
          name: "contentWriter",
          label: "Who's writing the words?",
          hint: "Plenty of people send notes rather than finished copy — that's normal.",
          options: [
            { value: "me", label: "I'll write the text" },
            { value: "shape", label: "I have notes — help me shape them" },
            { value: "you", label: "You write it for me" },
            { value: "reuse", label: "It's already on an old site" },
          ],
        },
        {
          type: "radio",
          name: "domainStatus",
          label: "Do you have a domain name?",
          hint: "The address people type in, like yourname.com.",
          options: [
            { value: "own", label: "I own one already" },
            { value: "idea", label: "I have a name in mind" },
            { value: "help", label: "Help me choose one" },
            { value: "none", label: "Haven't thought about it" },
          ],
        },
        {
          type: "text",
          name: "domainName",
          label: "Which domain?",
          placeholder: "yourname.com (optional)",
          half: true,
        },
      ],
    },
    {
      id: "timeline",
      title: "Timeline & contact",
      description: "When you need it, what it's worth to you, and the best way to reach you.",
      fields: [
        {
          type: "radio",
          name: "timeframe",
          label: "What's your time frame?",
          required: true,
          options: [
            { value: "asap", label: "As soon as possible" },
            { value: "weeks", label: "In the next few weeks" },
            { value: "month", label: "Within a month or two" },
            { value: "exploring", label: "Just exploring for now" },
          ],
        },
        {
          type: "radio",
          name: "scope",
          label: "Is the $299 package about right?",
          hint: "Straight answer keeps the reply honest — the site is one price, whatever we agree.",
          options: [
            { value: "yes", label: "Yes — one site, $299" },
            { value: "smaller", label: "I need less than that" },
            { value: "bigger", label: "More than that — extra pages or features" },
            { value: "advice", label: "Not sure — tell me what I need" },
          ],
        },
        {
          type: "radio",
          name: "decisionMaker",
          label: "Who else is involved in saying yes?",
          options: [
            { value: "me", label: "Just me" },
            { value: "partner", label: "A partner, family member or co-owner" },
            { value: "team", label: "A team or committee" },
            { value: "unsure", label: "Not sure yet" },
          ],
        },
        {
          type: "date",
          name: "deadline",
          label: "Is there a date it has to be live by?",
          hint: "An event, a launch, a season start — optional.",
          half: true,
        },
        {
          type: "text",
          name: "name",
          label: "Your name",
          placeholder: "First and last",
          required: true,
          half: true,
        },
        {
          type: "email",
          name: "email",
          label: "Email",
          placeholder: "you@example.com",
          required: true,
          half: true,
        },
        {
          type: "tel",
          name: "phone",
          label: "Phone",
          placeholder: "(555) 555-5555",
          hint: "Optional — handy if it's easier to talk it through.",
          half: true,
        },
        {
          type: "radio",
          name: "contactPreference",
          label: "How should I reply?",
          options: [
            { value: "email", label: "Email" },
            { value: "text", label: "Text message" },
            { value: "call", label: "Phone call" },
          ],
        },
        {
          type: "text",
          name: "heardAbout",
          label: "How did you hear about me?",
          placeholder: "A friend, a search, my site, Instagram… (optional)",
        },
        {
          type: "textarea",
          name: "notes",
          label: "Anything else I should know?",
          placeholder:
            "Budget, deadlines, constraints, competitors you're measured against, things you've tried, questions…",
          rows: 4,
        },
      ],
    },
  ],
};
