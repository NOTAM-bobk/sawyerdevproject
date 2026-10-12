import { pricing, projects, site } from "@/content/site";
import { avatarUrl } from "@/lib/dicebear";

/** Site-relative social profiles that are real, usable URLs (placeholders are skipped). */
function profileLinks() {
  return site.socials
    .map((social) => social.href)
    .filter((href) => /^https?:\/\/[^/]+\/.+/.test(href));
}

/**
 * Primary entity for the site. `Person` is the right type for a one-person
 * portfolio — `ProfessionalService` is deprecated in schema.org in favour of
 * `Service`, and `LocalBusiness` would imply a real-world storefront we don't have.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}#person`,
    name: site.name,
    givenName: "Sawyer",
    familyName: "Schulz",
    jobTitle: site.role,
    description: site.description,
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: "+16124443853",
    image: avatarUrl({ size: 512, format: "png" }),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Minneapolis",
      addressRegion: "MN",
      addressCountry: "US",
    },
    knowsAbout: [
      "Web development",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Web performance",
      "Technical SEO",
      "Accessibility",
    ],
    sameAs: [site.url, ...profileLinks()],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: `${site.name} — ${site.role}`,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": `${site.url}#person` },
    about: { "@id": `${site.url}#person` },
  };
}

/** The published service and its one fixed-price offer. */
export function serviceSchema() {
  const [option] = pricing.options;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}#service`,
    name: "Website design and development",
    serviceType: "Website design and development",
    description: `Custom website design and development for people and small businesses. One fixed price of ${option.price} for a complete site of up to five pages, with no upfront cost — payment is due once the site is built.`,
    provider: { "@id": `${site.url}#person` },
    areaServed: [
      { "@type": "City", name: "Minneapolis" },
      { "@type": "AdministrativeArea", name: "Minnesota" },
    ],
    offers: {
      "@type": "Offer",
      name: option.name,
      url: `${site.url}/pricing`,
      price: "299",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description: `${option.for} No upfront cost; payment is due once the site is built.`,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: "299",
        priceCurrency: "USD",
        valueAddedTaxIncluded: false,
      },
    },
  };
}

/** Visible project list, described for crawlers and answer engines. */
export function projectsSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${site.url}/projects#list`,
    name: "Projects",
    itemListElement: [
      ...projects.items.map((project) => ({
        name: project.name,
        href: project.href,
        description: project.summary,
      })),
      ...projects.more.map((project) => ({
        name: project.name,
        href: project.href,
        description: project.description,
      })),
    ].map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: project.href,
      description: project.description,
    })),
  };
}

/**
 * FAQ markup for the visible questions on the pricing page. Google retired the
 * FAQ rich result in May 2026, so this is here so machines can parse the answers,
 * not to chase a snippet.
 */
export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${site.url}/pricing#faq`,
    mainEntity: pricing.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** The enquiry page, with the person who answers it. */
export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${site.url}/start#contact`,
    url: `${site.url}/start`,
    name: "Start a project",
    description:
      "Project enquiry form: what you need built, your preferred design style, pages, integrations and timeline.",
    about: { "@id": `${site.url}#person` },
    isPartOf: { "@id": `${site.url}#website` },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path}`,
    })),
  };
}
