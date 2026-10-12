import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { JsonLd } from "@/components/json-ld";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import { personSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  alternates: { canonical: "/" },
  formatDetection: { email: false, address: false, telephone: false },
  keywords: [
    "Sawyer Schulz",
    "Sawyer Schultz",
    "student developer",
    "web developer Minneapolis",
    "website design Minneapolis",
    "freelance web developer Minnesota",
    "Next.js developer",
    "React developer",
    "TypeScript",
    "$299 website",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_US",
  },
  // Title and description intentionally omitted: Twitter/X cards fall back to the
  // page's Open Graph values, so each page keeps its own wording.
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} overflow-x-hidden`}>
      <body className="font-sans antialiased overflow-x-hidden min-h-screen">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
          <SiteHeader />
          <main id="content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
        <JsonLd data={[personSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
