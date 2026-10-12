import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Everything here is public and meant to be found — including by AI answer
 * engines, so the assistants that cite sources can read and quote the site.
 * `Google-Extended` and `Applebot-Extended` are robots.txt controls for model
 * training/grounding rather than separate page crawlers.
 */
const assistants = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Amazonbot",
  "Amzn-SearchBot",
  "Amzn-User",
  "Applebot",
  "Applebot-Extended",
  "meta-externalagent",
  "meta-webindexer",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // The admin panel and the client dashboards are private: no crawling
      // them, and no indexing them.
      { userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin", "/dashboard"] },
      { userAgent: "bingbot", allow: "/", disallow: ["/admin", "/dashboard"] },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: assistants, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
