import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — student developer in Minneapolis`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card, generated at build time.
 * Every node is an explicit flex container — that is what the renderer requires.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 78% 12%, rgba(255,255,255,0.16), transparent 45%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 20,
              height: 20,
              borderRadius: 999,
              backgroundColor: "#3ddc84",
            }}
          />
          <div style={{ display: "flex", color: "#a1a1a1", fontSize: 24, letterSpacing: 2 }}>
            {site.availability.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 74,
              lineHeight: 1.12,
              fontWeight: 700,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            I design and build fast, clean web products.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              width: 420,
              height: 8,
              borderRadius: 999,
              backgroundColor: "#ffffff",
              opacity: 0.85,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", color: "#ffffff", fontSize: 34, fontWeight: 600 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", color: "#a1a1a1", fontSize: 26 }}>
            {`${site.location} · Full site $299`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
