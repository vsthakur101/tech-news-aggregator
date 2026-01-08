import { NewsArticle, GitHubRepository } from "@/types/news";
import { categorizeArticle } from "@/lib/utils";

export async function fetchGitHubTrending(): Promise<NewsArticle[]> {
  try {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateString = lastWeek.toISOString().split('T')[0];

    const response = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc&per_page=15`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        next: { revalidate: 600 },
      }
    );

    if (!response.ok) {
      console.error('GitHub API error:', response.statusText);
      return [];
    }

    const data = await response.json();
    const repositories: GitHubRepository[] = data.items || [];

    return repositories.map((repo) => {
      const tags = repo.topics || [];
      if (repo.language) tags.push(repo.language.toLowerCase());

      const category = categorizeArticle(
        tags,
        repo.name,
        repo.description || ''
      );

      return {
        id: `github-${repo.id}`,
        title: repo.full_name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        source: 'github' as const,
        category: category === 'Web Dev' ? 'Open Source' : category,
        publishedAt: repo.updated_at,
        author: repo.owner.login,
        imageUrl: undefined,
        tags: tags,
      };
    });
  } catch (error) {
    console.error('Error fetching GitHub trending:', error);
    return [];
  }
}
