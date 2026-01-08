import { NewsArticle } from "@/types/news";
import { parseRSSFeed } from "@/lib/rss-parser";

export async function fetchBleepingComputer(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://www.bleepingcomputer.com/feed/',
    'bleepingcomputer',
    'Bleeping Computer'
  );
}

export async function fetchSecurityWeek(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://www.securityweek.com/feed/',
    'securityweek',
    'SecurityWeek'
  );
}

export async function fetchTheHackerNews(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://feeds.feedburner.com/TheHackersNews',
    'thehackernews',
    'The Hacker News'
  );
}

export async function fetchCISAAlerts(): Promise<NewsArticle[]> {
  return parseRSSFeed(
    'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    'cisa',
    'CISA Alerts'
  );
}

export async function fetchGitHubAdvisories(): Promise<NewsArticle[]> {
  try {
    // Use GitHub's REST API for advisories instead of Atom feed
    const response = await fetch(
      'https://api.github.com/advisories?per_page=15&sort=published&direction=desc',
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Tech-News-Aggregator',
        },
        next: { revalidate: 600 }, // Cache for 10 minutes
      }
    );

    if (!response.ok) {
      console.error('GitHub Advisories API error:', response.statusText);
      return [];
    }

    const advisories = await response.json();

    return advisories.map((advisory: any) => {
      const severity = advisory.severity?.toUpperCase() || 'UNKNOWN';
      const description = advisory.summary || 'No description available';

      return {
        id: `githubadvisory-${advisory.ghsa_id}`,
        title: `${advisory.ghsa_id} - ${advisory.summary?.slice(0, 80) || 'Security Advisory'}`,
        description: `[${severity}] ${description.slice(0, 150)}`,
        url: advisory.html_url || `https://github.com/advisories/${advisory.ghsa_id}`,
        source: 'githubadvisory' as const,
        category: 'Security',
        publishedAt: advisory.published_at || new Date().toISOString(),
        author: 'GitHub Security',
        imageUrl: undefined,
        tags: ['security', 'advisory', severity.toLowerCase()],
      };
    });
  } catch (error) {
    console.error('Error fetching GitHub Security Advisories:', error);
    return [];
  }
}
