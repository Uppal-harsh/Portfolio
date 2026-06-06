import { ActivityItem, GitHubPayload, GitHubRepo, GitHubUser, LanguageStat } from "./types";

const USERNAME = "uppal-harsh";
const showcaseOrder = [
  "driver-wellness",
  "fusion",
  "invage-main",
  "SpecMatch-main",
  "Portfolio",
  "Luka"
];

const languageColors: Record<string, string> = {
  JavaScript: "#f5c842",
  TypeScript: "#6eb6ff",
  HTML: "#e56b3f",
  CSS: "#c8a96e",
  Python: "#4cc9f0",
  Java: "#ff8a4c",
  C: "#9aa2ff",
  "C++": "#f472b6",
  PHP: "#a78bfa",
  Shell: "#9fd3ac",
  Dart: "#38bdf8",
  Go: "#22d3ee",
  Rust: "#f97316"
};

function githubHeaders() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "uppal-harsh-portfolio"
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchGitHub<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");
    const reset = response.headers.get("x-ratelimit-reset");
    const resetText = reset ? new Date(Number(reset) * 1000).toLocaleTimeString("en-US") : "later";
    const rateHint = remaining === "0" ? ` GitHub rate limit reached. Try again after ${resetText}.` : "";
    throw new Error(`GitHub request failed (${response.status}).${rateHint}`);
  }

  return response.json() as Promise<T>;
}

type RawUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type RawRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  pushed_at: string | null;
  updated_at: string;
  created_at: string;
  fork: boolean;
  languages_url: string;
};

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: {
    name: string;
  };
};

function normalizeUser(user: RawUser): GitHubUser {
  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    location: user.location,
    blog: user.blog,
    htmlUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    createdAt: user.created_at
  };
}

function normalizeRepo(repo: RawRepo): GitHubRepo {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    topics: repo.topics ?? [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    createdAt: repo.created_at,
    isFork: repo.fork
  };
}

function activityLabel(type: string) {
  const map: Record<string, string> = {
    PushEvent: "Pushed code",
    CreateEvent: "Created reference",
    PullRequestEvent: "Opened pull request",
    IssuesEvent: "Updated issue",
    ForkEvent: "Forked repository",
    WatchEvent: "Starred repository",
    ReleaseEvent: "Published release"
  };

  return map[type] ?? type.replace(/Event$/, "");
}

function normalizeEvents(events: RawEvent[]): ActivityItem[] {
  return events
    .filter((event) => event.repo?.name)
    .slice(0, 8)
    .map((event) => ({
      id: event.id,
      type: event.type,
      repo: event.repo?.name ?? USERNAME,
      date: event.created_at,
      label: activityLabel(event.type)
    }));
}

function rankedShowcaseRepos(repos: GitHubRepo[]) {
  const order = new Map(showcaseOrder.map((name, index) => [name.toLowerCase(), index]));
  const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
  const curated = showcaseOrder
    .map((name) => byName.get(name.toLowerCase()))
    .filter((repo): repo is GitHubRepo => Boolean(repo));

  const fillers = repos
    .filter((repo) => !order.has(repo.name.toLowerCase()))
    .filter((repo) => repo.name.toLowerCase() !== USERNAME.toLowerCase())
    .sort((a, b) => b.stars - a.stars || Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  return [...curated, ...fillers].slice(0, 6);
}

async function buildLanguages(repos: RawRepo[]) {
  const targetRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .slice(0, 18);

  const entries = await Promise.allSettled(
    targetRepos.map(async (repo) => fetchGitHub<Record<string, number>>(repo.languages_url))
  );

  const totals = new Map<string, number>();

  entries.forEach((entry, index) => {
    if (entry.status === "fulfilled") {
      Object.entries(entry.value).forEach(([language, bytes]) => {
        totals.set(language, (totals.get(language) ?? 0) + bytes);
      });
      return;
    }

    const fallback = targetRepos[index]?.language;
    if (fallback) totals.set(fallback, (totals.get(fallback) ?? 0) + 1);
  });

  const totalBytes = Array.from(totals.values()).reduce((sum, value) => sum + value, 0) || 1;

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, bytes]): LanguageStat => ({
      name,
      bytes,
      percent: Number(((bytes / totalBytes) * 100).toFixed(1)),
      color: languageColors[name] ?? "#ffffff"
    }));
}

export async function getGitHubPayload(): Promise<GitHubPayload> {
  const [rawUser, rawRepos, rawEvents] = await Promise.all([
    fetchGitHub<RawUser>(`https://api.github.com/users/${USERNAME}`),
    fetchGitHub<RawRepo[]>(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated&type=owner`),
    fetchGitHub<RawEvent[]>(`https://api.github.com/users/${USERNAME}/events/public?per_page=30`)
  ]);

  const repos = rawRepos.map(normalizeRepo);
  const sourceRepos = repos.filter((repo) => !repo.isFork);
  const showcaseRepos = rankedShowcaseRepos(repos);
  const totals = {
    stars: sourceRepos.reduce((sum, repo) => sum + repo.stars, 0),
    forks: sourceRepos.reduce((sum, repo) => sum + repo.forks, 0),
    repos: rawUser.public_repos,
    followers: rawUser.followers,
    following: rawUser.following
  };

  const activeRepos = [...sourceRepos]
    .filter((repo) => repo.name.toLowerCase() !== USERNAME.toLowerCase())
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || b.stars - a.stars)
    .slice(0, 6);

  return {
    user: normalizeUser(rawUser),
    repos,
    topRepos: showcaseRepos,
    activeRepos: showcaseRepos.length >= 6 ? showcaseRepos : activeRepos,
    totals,
    languages: await buildLanguages(rawRepos),
    activity: normalizeEvents(rawEvents),
    generatedAt: new Date().toISOString()
  };
}
