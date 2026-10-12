import { site } from "@/content/site";

/**
 * Live GitHub figures for the stats panel.
 *
 * The public API is unauthenticated (60 requests an hour per IP, which is
 * plenty behind a 6-hour cache) and needs no token, so nothing has to be
 * configured on Vercel. If the request fails — offline build, rate limit,
 * renamed account — we fall back to a snapshot so the section never renders
 * empty.
 */

export type GithubStat = {
  /** Big number. */
  value: string;
  label: string;
  /** Accent used for the small dot beside the label. */
  tone: "ink" | "warm" | "plum" | "mint";
};

export type GithubLanguage = {
  name: string;
  count: number;
  /** Percentage of repositories, already rounded for display. */
  share: number;
  color: string;
};

export type GithubRepo = {
  name: string;
  description: string;
  stars: number;
  href: string;
  color: string;
};

export type GithubOverview = {
  stats: GithubStat[];
  languages: GithubLanguage[];
  repos: GithubRepo[];
  href: string;
  /** True when the numbers came from the API rather than the snapshot. */
  live: boolean;
};

/** GitHub's own language colours, so the bar matches what people already know. */
const LANGUAGE_COLORS: Record<string, string> = {
  HTML: "#e34c26",
  CSS: "#563d7c",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5a03",
  Go: "#00ADD8",
  Rust: "#dea584",
};

const UNKNOWN_LANGUAGE_COLOR = "#8b8b8b";

export function languageColor(language: string) {
  return LANGUAGE_COLORS[language] ?? UNKNOWN_LANGUAGE_COLOR;
}

/** Snapshot of the account, used when the API cannot be reached. */
const SNAPSHOT = {
  publicRepos: 71,
  followers: 334,
  totalStars: 89,
  languages: [
    { name: "HTML", count: 26 },
    { name: "JavaScript", count: 24 },
    { name: "TypeScript", count: 5 },
    { name: "Python", count: 2 },
    { name: "CSS", count: 1 },
  ],
  repos: [
    { name: "Shinobi.genjustu", description: "Pulls the latest posts from a feed and renders them in one page.", stars: 5, language: "TypeScript" },
    { name: "notam--bio", description: "My dev bio page.", stars: 4, language: "HTML" },
    { name: "Nimbus.", description: "Weather app with news and a multi-country API.", stars: 4, language: "HTML" },
    { name: "Decibel.listenr", description: "Live microphone readings of how loud a room is.", stars: 3, language: "JavaScript" },
  ],
};

type ApiUser = { public_repos?: number; followers?: number };
type ApiRepo = {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  fork: boolean;
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "sawyerschulz.dev",
      },
      // Refresh every six hours, and never let a failure break a build.
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function languageBreakdown(repos: ApiRepo[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function build(
  publicRepos: number,
  followers: number,
  totalStars: number,
  languages: { name: string; count: number }[],
  repos: { name: string; description: string; stars: number; language: string | null }[],
  live: boolean,
): GithubOverview {
  const languageTotal = languages.reduce((sum, item) => sum + item.count, 0) || 1;

  return {
    live,
    href: `https://github.com/${site.github}`,
    stats: [
      { value: String(publicRepos), label: "Public repositories", tone: "ink" },
      { value: String(totalStars), label: "Stars on my own work", tone: "warm" },
      { value: String(followers), label: "Followers", tone: "plum" },
      { value: String(languages.length), label: "Languages used", tone: "mint" },
    ],
    languages: languages.map((item) => ({
      ...item,
      share: Math.round((item.count / languageTotal) * 100),
      color: languageColor(item.name),
    })),
    repos: repos.map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stars,
      href: `https://github.com/${site.github}/${repo.name}`,
      color: repo.language ? languageColor(repo.language) : UNKNOWN_LANGUAGE_COLOR,
    })),
  };
}

export async function getGithubOverview(): Promise<GithubOverview> {
  const [user, repos] = await Promise.all([
    getJson<ApiUser>(`https://api.github.com/users/${site.github}`),
    getJson<ApiRepo[]>(`https://api.github.com/users/${site.github}/repos?per_page=100&sort=pushed`),
  ]);

  if (!user || !Array.isArray(repos) || repos.length === 0) {
    return build(
      SNAPSHOT.publicRepos,
      SNAPSHOT.followers,
      SNAPSHOT.totalStars,
      SNAPSHOT.languages,
      SNAPSHOT.repos,
      false,
    );
  }

  // Stars, languages and the project list only cover repositories he wrote —
  // never forks, and never the profile README (which sits in a repo named after
  // the account and is not a project).
  const own = repos.filter((repo) => !repo.fork && repo.name.toLowerCase() !== site.github.toLowerCase());
  const byStars = [...own].sort(
    (a, b) => b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name),
  );

  return build(
    user.public_repos ?? repos.length,
    user.followers ?? 0,
    own.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    languageBreakdown(own),
    byStars.slice(0, 4).map((repo) => ({
      name: repo.name,
      description: repo.description ?? "",
      stars: repo.stargazers_count,
      language: repo.language,
    })),
    true,
  );
}
