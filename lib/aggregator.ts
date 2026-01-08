import { NewsArticle } from "@/types/news";
import { fetchDevToArticles } from "./api/devto";
import { fetchHackerNewsArticles } from "./api/hackernews";
import { fetchNewsAPIArticles } from "./api/newsapi";
import { fetchGitHubTrending } from "./api/github";
import {
  fetchVercelBlog,
  fetchReactBlog,
  fetchMetaBlog,
  fetchGoogleBlog,
  fetchCloudflareBlog,
  fetchMediumTech,
} from "./api/blogs";
import { fetchRedditPosts } from "./api/reddit";

export async function fetchAllNews(): Promise<NewsArticle[]> {
  try {
    // Fetch from ALL 11 sources in parallel
    const results = await Promise.allSettled([
      fetchDevToArticles(),
      fetchHackerNewsArticles(),
      fetchNewsAPIArticles(),
      fetchGitHubTrending(),
      fetchVercelBlog(),
      fetchReactBlog(),
      fetchMetaBlog(),
      fetchGoogleBlog(),
      fetchCloudflareBlog(),
      fetchRedditPosts(),
      fetchMediumTech(),
    ]);

    // Combine all successful results
    const allArticles: NewsArticle[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
        console.log(`Source ${index + 1} returned ${result.value.length} articles`);
      } else {
        console.error(`Source ${index + 1} failed:`, result.reason);
      }
    });

    console.log(`Total articles before deduplication: ${allArticles.length}`);

    // Sort by published date (newest first)
    allArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Deduplicate based on similar titles
    const uniqueArticles = deduplicateArticles(allArticles);

    console.log(`Total articles after deduplication: ${uniqueArticles.length}`);

    return uniqueArticles;
  } catch (error) {
    console.error('Error aggregating news:', error);
    return [];
  }
}

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Map<string, NewsArticle>();

  for (const article of articles) {
    const normalizedTitle = article.title.toLowerCase().trim();

    // Check if we've seen a similar title
    let isDuplicate = false;

    for (const [seenTitle, seenArticle] of seen.entries()) {
      if (
        normalizedTitle === seenTitle ||
        normalizedTitle.includes(seenTitle) ||
        seenTitle.includes(normalizedTitle)
      ) {
        // Keep the one with better description/image
        if (
          (!seenArticle.imageUrl && article.imageUrl) ||
          (article.description.length > seenArticle.description.length)
        ) {
          seen.delete(seenTitle);
          seen.set(normalizedTitle, article);
        }
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.set(normalizedTitle, article);
    }
  }

  return Array.from(seen.values());
}
