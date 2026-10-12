import Script from "next/script";

/**
 * Google Analytics 4 measurement ID. Change this one constant to point the
 * tag at a different property; everything else follows from it.
 */
const GA_ID = "G-3XMPQZPZC3";

/**
 * Google Analytics (gtag.js), mounted once from the root layout.
 *
 * Uses next/script on `afterInteractive` so the tag loads after the page is
 * usable instead of blocking the first paint, and Next.js keeps it in place
 * across client-side route changes.
 */
export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
