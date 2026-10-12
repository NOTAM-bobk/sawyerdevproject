/**
 * Plain-English privacy policy and terms for the site and the $299 package.
 * Edit the copy here; the pages only handle layout.
 */

export const privacy = {
  title: "Privacy",
  updated: "Last updated 12 October 2026",
  intro:
    "Short version: you send me your details through the form, I use them to reply and to build your site, and I don't sell them to anyone.",
  sections: [
    {
      heading: "What I collect",
      body: [
        "Whatever you type into the enquiry form: your name, email, phone number if you give it, and the answers about your project.",
        "Basic, anonymous page analytics — which pages get visited and roughly where from. No advertising trackers and no profiles built across other sites.",
      ],
    },
    {
      heading: "Why I collect it",
      body: [
        "To reply to your enquiry, quote the work, and build and launch your site.",
        "To see which pages are useful, so I can improve them.",
      ],
    },
    {
      heading: "Who else sees it",
      body: [
        "The email service that delivers the form to my inbox, and the hosting provider that serves this site. Both process it on my behalf.",
        "Nobody else. I don't sell, rent or trade your details, and I don't send marketing email.",
      ],
    },
    {
      heading: "How long I keep it",
      body: [
        "Enquiries are kept while the project is live, and for a reasonable period afterwards in case you come back. Ask and I'll delete them sooner.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        "Email hello@sawyerschulz.dev and I'll send you a copy of what I hold, correct it, or delete it.",
      ],
    },
  ],
} as const;

export const terms = {
  title: "Terms",
  updated: "Last updated 12 October 2026",
  intro:
    "These are the terms for the $299 website package and for using this site. Plain English on purpose — if anything is unclear, ask before you pay.",
  sections: [
    {
      heading: "The service",
      body: [
        "One complete website: custom design, built and launched, for a fixed $299. That covers up to five pages, a contact form, basic SEO, and getting the site live on a domain you control.",
        "Anything outside that — more pages, a shop, a booking system, ongoing work — is quoted separately and agreed in writing before it starts.",
      ],
    },
    {
      heading: "Payment",
      body: [
        "Nothing up front. The $299 is due once the site is built and you have seen it — so you can look before you pay. Prices are in US dollars.",
        "If you change your mind before paying, that is fine: you owe nothing, and the code and design files stay with me.",
      ],
    },
    {
      heading: "Revisions and fixes",
      body: [
        "One round of revisions after you review the finished build, plus 30 days of bug fixes after launch. Bugs are things that don't work as agreed; new features are new work.",
      ],
    },
    {
      heading: "Your content",
      body: [
        "You keep ownership of the text, photos and logos you send me, and you confirm you have the right to use them.",
        "I can show the finished site in my own portfolio unless you ask me not to.",
      ],
    },
    {
      heading: "Ownership of the build",
      body: [
        "On final payment, the code and design files for your site are yours. Third-party services you use — your domain, your hosting, any paid tools — are billed to you and governed by their own terms.",
      ],
    },
    {
      heading: "Timelines",
      body: [
        "Estimates assume you can send content and feedback reasonably quickly. I'll tell you if a date is at risk rather than quietly missing it.",
      ],
    },
    {
      heading: "Limits",
      body: [
        "The site is provided as built. I can't promise a specific ranking, traffic or revenue, and I'm not liable for indirect losses. Nothing here removes rights you have under Minnesota law.",
      ],
    },
  ],
} as const;
