import type { NextConfig } from "next";

/**
 * Extra origins allowed to reach the dev server (comma separated, scheme-less).
 * Used for hosted preview environments such as Cloud previews; unset in production.
 */
const allowedDevOrigins = (process.env.NEXT_DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins,
  images: {
    // The header avatar comes from the DiceBear HTTP API.
    remotePatterns: [{ protocol: "https", hostname: "api.dicebear.com", pathname: "/**" }],
  },
};

export default nextConfig;
