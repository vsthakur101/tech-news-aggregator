import Parser from 'rss-parser';
import { NewsArticle, NewsSource, RSSItem } from '@/types/news';
import { categorizeArticle } from './utils';

const parser = new Parser();

export async function parseRSSFeed(
  feedUrl: string,
  source: NewsSource,
  sourceName: string
): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL(feedUrl);

    const articles: NewsArticle[] = feed.items.slice(0, 15).map((item, index) => {
      const title = item.title || 'No title';
      const description =
        item.contentSnippet || item.content || item.description || 'No description';
      const url = item.link || feedUrl;
      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
      const author = item.creator || feed.title || sourceName;
      const tags = item.categories || [];

      const category = categorizeArticle(tags, title, description);

      return {
        id: `${source}-${item.guid || index}-${Date.now()}`,
        title,
        description,
        url,
        source,
        category,
        publishedAt,
        author,
        imageUrl: undefined, // RSS feeds typically don't include images in a standard way
        tags,
      };
    });

    return articles;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${sourceName}:`, error);
    return [];
  }
}
