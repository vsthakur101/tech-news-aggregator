import { NewsArticle, NewsAPIArticle } from "@/types/news";
import { categorizeArticle } from "@/lib/utils";

export async function fetchNewsAPIArticles(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    console.warn('NewsAPI key not found. Skipping NewsAPI articles.');
    return [];
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=20&apiKey=${apiKey}`,
      { next: { revalidate: 600 } }
    );

    if (!response.ok) {
      console.error('NewsAPI error:', response.statusText);
      return [];
    }

    const data = await response.json();

    if (data.status !== 'ok' || !data.articles) {
      console.error('NewsAPI returned error:', data.message);
      return [];
    }

    const articles: NewsAPIArticle[] = data.articles;

    return articles.map((article, index) => {
      const category = categorizeArticle(
        [],
        article.title,
        article.description || ''
      );

      return {
        id: `newsapi-${index}-${Date.now()}`,
        title: article.title,
        description: article.description || 'No description available',
        url: article.url,
        source: 'newsapi' as const,
        category,
        publishedAt: article.publishedAt,
        author: article.author || article.source.name,
        imageUrl: article.urlToImage,
        tags: [],
      };
    });
  } catch (error) {
    console.error('Error fetching NewsAPI articles:', error);
    return [];
  }
}
