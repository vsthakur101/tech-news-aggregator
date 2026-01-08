import { NewsArticle, HackerNewsItem } from "@/types/news";
import { categorizeArticle } from "@/lib/utils";

export async function fetchHackerNewsArticles(): Promise<NewsArticle[]> {
  try {
    const topStoriesResponse = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { next: { revalidate: 300 } }
    );

    if (!topStoriesResponse.ok) {
      console.error('Hacker News API error:', topStoriesResponse.statusText);
      return [];
    }

    const storyIds: number[] = await topStoriesResponse.json();

    const storyPromises = storyIds.slice(0, 20).map(async (id) => {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        { next: { revalidate: 300 } }
      );

      if (!response.ok) return null;
      return response.json();
    });

    const stories: (HackerNewsItem | null)[] = await Promise.all(storyPromises);

    return stories
      .filter((story): story is HackerNewsItem =>
        story !== null && story.url !== undefined
      )
      .map((story) => {
        const category = categorizeArticle([], story.title, '');

        return {
          id: `hn-${story.id}`,
          title: story.title,
          description: `${story.score} points by ${story.by} | ${story.descendants || 0} comments`,
          url: story.url!,
          source: 'hackernews' as const,
          category,
          publishedAt: new Date(story.time * 1000).toISOString(),
          author: story.by,
          imageUrl: undefined,
          tags: [],
        };
      });
  } catch (error) {
    console.error('Error fetching Hacker News articles:', error);
    return [];
  }
}
