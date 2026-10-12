/**
 * Reviews — everything the reviews section reads lives in this file.
 *
 * ---------------------------------------------------------------------------
 * PLACEHOLDER COPY — REPLACE BEFORE SHARING THE SITE
 * ---------------------------------------------------------------------------
 * These six are written to show the layout, not to claim anything. Swap each
 * one for a real review you can point to, and delete any you don't have.
 * Publishing reviews you can't back up is dishonest, and in most places it is
 * against the law (in the US, the FTC's rule on fake reviews). If you only
 * have two real ones, cut the array down to two — the section sizes itself.
 *
 * Until you confirm them, the section is still useful: it shows what a review
 * looks like and where it will sit.
 */

export type Review = {
  /** Display name, e.g. "Dana R." — use whatever the customer agreed to. */
  name: string;
  /** Their role or business, shown under the name. */
  role: string;
  /** 1–5. The summary average is worked out from these. */
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /** Where the review came from, e.g. "Email", "Google", "Text". */
  source: string;
  /** Month and year you received it. */
  date: string;
  /** Optional: link to the review if it lives somewhere public. */
  href?: string;
};

export const reviewsConfig = {
  eyebrow: "Reviews",
  title: "What people say after launch.",
  description: "A few words from the people whose sites I've built.",
  /**
   * How long each review stays on screen before the next one, in
   * milliseconds. Longer reads better; nothing under 5000 feels calm.
   */
  rotateMs: 7000,
  /** Show the "5.0 from N reviews" line above the carousel. */
  showSummary: true,
  /** Label under the average. Set to "" to hide it. */
  summaryLabel: "average from every project I've delivered",
} as const;

export const reviews: readonly Review[] = [
  {
    name: "Niko S.",
    role: "800m runner",
    rating: 5,
    quote:
      "I sent over a pile of results and photos and got a site I actually want to send people. Every best links to the real race.",
    source: "Text",
    date: "August 2026",
  },
  {
    name: "Dana R.",
    role: "Salon owner",
    rating: 5,
    quote:
      "The price he quoted was the price I paid. It went live on my own domain and the booking form drops into my inbox.",
    source: "Email",
    date: "July 2026",
  },
  {
    name: "Marcus T.",
    role: "Club coach",
    rating: 5,
    quote:
      "Parents open it on their phones, so it had to work on a phone. It does. I updated the schedule myself, no call needed.",
    source: "Email",
    date: "June 2026",
  },
  {
    name: "Priya N.",
    role: "Photographer",
    rating: 5,
    quote:
      "I asked for something that kept the photographs loudest on the page. He got that on the first pass and cut the rest.",
    source: "Email",
    date: "May 2026",
  },
  {
    name: "Ben L.",
    role: "Founder",
    rating: 5,
    quote:
      "Fast, no fuss, and I could read the updates without a translator. The one page plan saved a round of arguing about scope.",
    source: "Text",
    date: "April 2026",
  },
  {
    name: "Tomas K.",
    role: "Cafe owner",
    rating: 5,
    quote:
      "Two weeks from sending my photos to being live. The map and hours are right, which sounds small until they've been wrong for a year.",
    source: "Email",
    date: "March 2026",
  },
];
