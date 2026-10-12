import { experience, pricing, projects, site } from "@/content/site";

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

${site.name} is a student developer and distance runner in ${site.location}, reachable at ${site.email} or ${site.phone}.

## Pages

- [Home](${site.url}/): What ${site.name} does, selected work, and pricing.
- [About](${site.url}/about): Background, how ${site.name} works, tools and interests.
- [Experience](${site.url}/experience): Work history and skills.
- [Projects](${site.url}/projects): Live projects, with what each one does.
- [Pricing](${site.url}/pricing): The ${option.name} package — ${option.price}, ${option.priceNote}.

## Services

- ${option.name}: ${option.price} ${option.priceNote}. ${option.for}
- Typical turnaround: ${option.turnaround}
- Service area: ${site.location}, plus remote work.

## Projects

${projects.items.map((project) => `- [${project.name}](${project.href}): ${project.summary}`).join("\n")}

## Experience

${experience.roles.map((role) => `- ${role.role}, ${role.company} (${role.period}): ${role.summary}`).join("\n")}

## Contact

- Email: ${site.email}
- Phone: ${site.phone}
- Based in: ${site.location}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
