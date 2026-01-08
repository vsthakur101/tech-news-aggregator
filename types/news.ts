export type NewsSource =
  | 'devto'
  | 'hackernews'
  | 'newsapi'
  | 'github'
  | 'vercel'
  | 'react'
  | 'meta'
  | 'google'
  | 'cloudflare'
  | 'reddit'
  | 'medium';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: NewsSource;
  category: string;
  publishedAt: string;
  author?: string;
  imageUrl?: string;
  tags: string[];
}

export type NewsCategory =
  | 'All'
  | 'Security'
  | 'Web Dev'
  | 'AI/ML'
  | 'DevOps'
  | 'Mobile'
  | 'Open Source';

export const NEWS_CATEGORIES: NewsCategory[] = [
  'All',
  'Security',
  'Web Dev',
  'AI/ML',
  'DevOps',
  'Mobile',
  'Open Source',
];

export const NEWS_SOURCES: { value: NewsSource; label: string }[] = [
  { value: 'devto', label: 'Dev.to' },
  { value: 'hackernews', label: 'Hacker News' },
  { value: 'newsapi', label: 'Tech News' },
  { value: 'github', label: 'GitHub' },
  { value: 'vercel', label: 'Vercel Blog' },
  { value: 'react', label: 'React Blog' },
  { value: 'meta', label: 'Meta Engineering' },
  { value: 'google', label: 'Google Developers' },
  { value: 'cloudflare', label: 'Cloudflare Blog' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'medium', label: 'Medium' },
];

// API Response Types
export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  user: {
    name: string;
  };
  cover_image?: string;
  tag_list: string[];
}

export interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
}

export interface NewsAPIArticle {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  stargazers_count: number;
  language?: string;
  updated_at: string;
  owner: {
    login: string;
  };
  topics: string[];
}

export interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    url: string;
    author: string;
    created_utc: number;
    score: number;
    subreddit: string;
    permalink: string;
    stickied?: boolean;
  };
}

export interface RSSItem {
  title: string;
  link: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
  pubDate?: string;
  isoDate?: string;
  categories?: string[];
}
