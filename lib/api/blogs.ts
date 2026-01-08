import { NewsArticle } from "@/types/news";
import { parseRSSFeed } from "@/lib/rss-parser";

export async function fetchVercelBlog(): Promise<NewsArticle[]> {
  // Vercel blog RSS feed
  return parseRSSFeed(
    'https://vercel.com/blog/rss',
    'vercel',
    'Vercel Blog'
  );
}

export async function fetchReactBlog(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://react.dev/rss.xml',
    'react',
    'React Blog'
  );
}

export async function fetchMetaBlog(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://engineering.fb.com/feed/',
    'meta',
    'Meta Engineering'
  );
}

export async function fetchGoogleBlog(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://developers.googleblog.com/feeds/posts/default',
    'google',
    'Google Developers'
  );
}

export async function fetchCloudflareBlog(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://blog.cloudflare.com/rss/',
    'cloudflare',
    'Cloudflare Blog'
  );
}

export async function fetchMediumTech(): Promise<NewsArticle[]> {
  // Using JavaScript in Plain English publication
  return parseRSSFeed(
    'https://medium.com/feed/javascript-in-plain-english',
    'medium',
    'Medium - Tech'
  );
}
