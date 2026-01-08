import { NewsArticle, RedditPost } from "@/types/news";
import { categorizeArticle } from "@/lib/utils";

export async function fetchRedditPosts(): Promise<NewsArticle[]> {
  try {
    // Fetch from multiple tech subreddits
    const subreddits = ['javascript', 'reactjs', 'programming', 'webdev', 'typescript'];

    const allPosts: NewsArticle[] = [];

    for (const subreddit of subreddits) {
      try {
        const response = await fetch(
          `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`,
          {
            headers: {
              'User-Agent': 'TechNewsAggregator/1.0',
            },
            next: { revalidate: 600 },
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        const posts: RedditPost[] = data.data.children || [];

        const articles = posts
          .filter((post) => !post.data.stickied) // Skip stickied posts
          .map((post) => {
            const category = categorizeArticle(
              [subreddit],
              post.data.title,
              post.data.selftext || ''
            );

            return {
              id: `reddit-${post.data.id}`,
              title: post.data.title,
              description:
                post.data.selftext.slice(0, 200) || `Discussion in r/${post.data.subreddit}`,
              url: post.data.url.startsWith('http')
                ? post.data.url
                : `https://reddit.com${post.data.permalink}`,
              source: 'reddit' as const,
              category,
              publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
              author: post.data.author,
              imageUrl: undefined,
              tags: [subreddit],
            };
          });

        allPosts.push(...articles);
      } catch (error) {
        console.error(`Error fetching r/${subreddit}:`, error);
        continue;
      }
    }

    return allPosts.slice(0, 30); // Limit to 30 total posts
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
}
