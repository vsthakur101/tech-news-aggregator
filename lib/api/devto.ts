import { NewsArticle, DevToArticle } from "@/types/news";
import { categorizeArticle } from "@/lib/utils";

export async function fetchDevToArticles(): Promise<NewsArticle[]> {
  try {
    // Fetch top articles from the past week
    const response = await fetch(
      `https://dev.to/api/articles?per_page=20&top=7`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      console.error('Dev.to API error:', response.statusText);
      return [];
    }

    const articles: DevToArticle[] = await response.json();

    return articles.map((article) => {
      const category = categorizeArticle(
        article.tag_list,
        article.title,
        article.description || ''
      );

      return {
        id: `devto-${article.id}`,
        title: article.title,
        description: article.description || 'No description available',
        url: article.url,
        source: 'devto' as const,
        category,
        publishedAt: article.published_at,
        author: article.user.name,
        imageUrl: article.cover_image,
        tags: article.tag_list,
      };
    });
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    return [];
  }
}
