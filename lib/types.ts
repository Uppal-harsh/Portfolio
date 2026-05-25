export type GitHubUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  pushedAt: string | null;
  updatedAt: string;
  createdAt: string;
  isFork: boolean;
};

export type LanguageStat = {
  name: string;
  bytes: number;
  percent: number;
  color: string;
};

export type ActivityItem = {
  id: string;
  type: string;
  repo: string;
  date: string;
  label: string;
};

export type GitHubPayload = {
  user: GitHubUser;
  repos: GitHubRepo[];
  topRepos: GitHubRepo[];
  activeRepos: GitHubRepo[];
  totals: {
    stars: number;
    forks: number;
    repos: number;
    followers: number;
    following: number;
  };
  languages: LanguageStat[];
  activity: ActivityItem[];
  generatedAt: string;
  error?: string;
};

export type CodolioPayload = {
  profileUrl: string;
  available: boolean;
  source: string;
  stats: {
    cScore?: number;
    totalQuestions?: number;
    activeDays?: number;
    streak?: number;
    contests?: number;
    rank?: number;
  };
  message?: string;
};
