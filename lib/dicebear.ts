import { site } from "@/content/site";

/** DiceBear HTTP API version — see https://www.dicebear.com/how-to-use/http-api/ */
const API_VERSION = "10.x";

type AvatarOptions = {
  size?: number;
  /** PNG keeps us on the standard Next.js image optimizer (no SVG opt-in needed). */
  format?: "png" | "svg";
  /** Background as a bare hex triplet, e.g. "fafafa". */
  background?: string;
};

/**
 * Builds a DiceBear avatar URL. The seed is deterministic, so the same avatar
 * renders on the server and on every visit.
 */
export function avatarUrl({ size = 128, format = "png", background = "fafafa" }: AvatarOptions = {}) {
  const params = new URLSearchParams({
    seed: site.avatar.seed,
    size: String(size),
    backgroundColor: background,
  });

  return `https://api.dicebear.com/${API_VERSION}/${site.avatar.style}/${format}?${params.toString()}`;
}
