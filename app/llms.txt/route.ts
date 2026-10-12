import { about, dashboard, pricing, projects, site } from "@/content/site";

export const dynamic = "force-static";

/**
 * A concise, agent-readable index of the site (the /llms.txt proposal).
 * Optional documentation for AI tools that choose to read it — it does not
 * replace normal crawlability, which is what search surfaces actually rely on.
 */
export function GET() {
  const [option] = pricing.options;

  const body = `# ${site.name}

> ${site.role}, based in ${site.location}. Designs and builds websites for people and small businesses at one fixed price of ${option.price}.

${site.name} is a web designer and developer in ${site.location}, reachable by email or text message at ${site.email} or ${site.phone} (Sawyer does not take phone calls).

## Pages

- [Home](${site.url}/): What ${site.name} does, selected work, and pricing.
- [About](${site.url}/about): Background, how ${site.name} works, tools and interests.
- [Experience](${site.url}/experience): Work history and skills.
- [Projects](${site.url}/projects): Live projects, with what each one does.
- [Pricing](${site.url}/pricing): The ${option.name} package — ${option.price}, ${option.priceNote}.
- [Dashboard](${site.url}/dashboard): The private client dashboard, sign-in only.

## Services

- ${option.name}: ${option.price} ${option.priceNote}. ${option.for}
- Typical turnaround: ${option.turnaround}
- Payment: no upfront cost. The ${option.price} is due once the site is built and the client has seen it.
- Service area: ${site.location}, plus remote work.

## The client dashboard

Every project includes a private dashboard the client signs in to with a code issued
automatically when they send an enquiry. There is no account to create. It shows:

${dashboard.features.map((feature) => `- ${feature.title}: ${feature.body}`).join("\n")}

## Projects

${projects.items.map((project) => `- [${project.name}](${project.href}): ${project.summary}`).join("\n")}

## Skills

${about.toolbox.map((group) => `- ${group.group}: ${group.items.join(", ")}`).join("\n")}

## Contact

- Email: ${site.email}
- Phone (text messages only — no calls): ${site.phone}
- Based in: ${site.location}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
