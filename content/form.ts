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
    "Answer what you can — a rough idea is plenty. I'll read it, then reply with a plan, a fixed price and an honest timeline.",
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
      ],
    },
    {
      id: "timeline",
      title: "Timeline & contact",
      description: "When you need it, and the best way to reach you.",
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
          type: "textarea",
          name: "notes",
          label: "Anything else I should know?",
          placeholder: "Deadlines, constraints, things you've tried, questions…",
          rows: 4,
        },
      ],
    },
  ],
};
