'use client';

import { NewsArticle } from '@/types/news';

export interface TopicCount {
  topic: string;
  count: number;
  category?: string;
}

// Common tech keywords to extract
const TECH_KEYWORDS = [
  // Languages & Frameworks
  'react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'remix',
  'typescript', 'javascript', 'python', 'rust', 'go', 'java', 'kotlin', 'swift',
  'node', 'nodejs', 'deno', 'bun',

  // Technologies
  'docker', 'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'vercel', 'netlify',
  'ai', 'ml', 'chatgpt', 'gpt', 'llm', 'openai', 'anthropic',
  'blockchain', 'web3', 'crypto',
  'graphql', 'rest', 'api', 'grpc',
  'postgresql', 'mysql', 'mongodb', 'redis',

  // Security
  'security', 'vulnerability', 'cve', 'exploit', 'breach', 'hack',
  'malware', 'ransomware', 'phishing', 'zero-day', '0-day',

  // Concepts
  'performance', 'optimization', 'scalability', 'serverless',
  'microservices', 'monolith', 'architecture',
  'testing', 'ci/cd', 'devops', 'deployment',
  'opensource', 'open source', 'github',
];

export function extractTrendingTopics(articles: NewsArticle[], limit: number = 20): TopicCount[] {
  const topicCounts = new Map<string, TopicCount>();

  articles.forEach((article) => {
    // Combine title + description + tags
    const text = `${article.title} ${article.description} ${article.tags.join(' ')}`.toLowerCase();

    // Extract keywords
    TECH_KEYWORDS.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);

      if (matches) {
        const normalized = keyword.toLowerCase();
        const existing = topicCounts.get(normalized);

        if (existing) {
          existing.count += matches.length;
        } else {
          topicCounts.set(normalized, {
            topic: keyword,
            count: matches.length,
            category: article.category,
          });
        }
      }
    });

    // Also extract hashtags from tags
    article.tags.forEach((tag) => {
      const normalized = tag.toLowerCase();
      const existing = topicCounts.get(normalized);

      if (existing) {
        existing.count += 1;
      } else {
        topicCounts.set(normalized, {
          topic: tag,
          count: 1,
          category: article.category,
        });
      }
    });
  });

  // Convert to array and sort by count
  return Array.from(topicCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Calculate font size based on count (for tag cloud visualization)
export function getTopicFontSize(count: number, min: number, max: number): number {
  const minSize = 0.75; // rem
  const maxSize = 2; // rem

  if (max === min) return (minSize + maxSize) / 2;

  const range = max - min;
  const normalized = (count - min) / range;
  return minSize + (normalized * (maxSize - minSize));
}

// Get color intensity based on recency
export function getTopicColor(count: number, maxCount: number): string {
  const intensity = Math.min(count / maxCount, 1);

  // Return color classes based on intensity
  if (intensity > 0.7) return 'bg-primary text-primary-foreground';
  if (intensity > 0.4) return 'bg-primary/70 text-primary-foreground';
  if (intensity > 0.2) return 'bg-primary/50 text-foreground';
  return 'bg-muted text-muted-foreground';
}

export interface SourceMetric {
  source: string;
  totalArticles: number;
  avgPerDay: number;
  lastPosted: string;
  categories: Set<string>;
}

export function calculateSourceMetrics(articles: NewsArticle[]): Record<string, SourceMetric> {
  const sourceStats: Record<string, SourceMetric> = {};

  articles.forEach((article) => {
    if (!sourceStats[article.source]) {
      sourceStats[article.source] = {
        source: article.source,
        totalArticles: 0,
        avgPerDay: 0,
        lastPosted: article.publishedAt,
        categories: new Set(),
      };
    }

    sourceStats[article.source].totalArticles++;
    sourceStats[article.source].categories.add(article.category);

    // Update last posted if more recent
    if (new Date(article.publishedAt) > new Date(sourceStats[article.source].lastPosted)) {
      sourceStats[article.source].lastPosted = article.publishedAt;
    }
  });

  // Calculate average per day for each source
  Object.values(sourceStats).forEach((stat) => {
    // Find oldest article from this source
    const sourceArticles = articles.filter((a) => a.source === stat.source);
    const dates = sourceArticles.map((a) => new Date(a.publishedAt).getTime());
    const oldestDate = Math.min(...dates);
    const newestDate = Math.max(...dates);
    const daysDiff = (newestDate - oldestDate) / (1000 * 60 * 60 * 24);

    stat.avgPerDay = daysDiff > 0 ? stat.totalArticles / daysDiff : stat.totalArticles;
  });

  return sourceStats;
}

// Smart Recommendations Engine
export interface ArticleScore {
  article: NewsArticle;
  score: number;
  reasons: string[];
}

export function getRecommendations(
  currentArticle: NewsArticle,
  allArticles: NewsArticle[],
  readArticleIds: string[],
  bookmarkedIds: string[],
  limit: number = 5
): ArticleScore[] {
  const scores: ArticleScore[] = [];

  allArticles.forEach((article) => {
    // Skip current article and already read articles
    if (article.id === currentArticle.id || readArticleIds.includes(article.id)) {
      return;
    }

    let score = 0;
    const reasons: string[] = [];

    // Same source: +5 points
    if (article.source === currentArticle.source) {
      score += 5;
      reasons.push('Same source');
    }

    // Same category: +4 points
    if (article.category === currentArticle.category) {
      score += 4;
      reasons.push('Same category');
    }

    // Matching tags: +2 per tag
    const matchingTags = article.tags.filter((t) =>
      currentArticle.tags.some((ct) => ct.toLowerCase() === t.toLowerCase())
    );
    if (matchingTags.length > 0) {
      score += matchingTags.length * 2;
      reasons.push(`${matchingTags.length} matching tag${matchingTags.length > 1 ? 's' : ''}`);
    }

    // Title similarity (simple keyword matching)
    const currentKeywords = extractKeywords(currentArticle.title);
    const articleKeywords = extractKeywords(article.title);
    const commonKeywords = currentKeywords.filter((k) => articleKeywords.includes(k));
    if (commonKeywords.length > 0) {
      score += commonKeywords.length * 3;
      reasons.push('Similar topic');
    }

    // Bookmarked by user before: +3 points (user interest)
    if (bookmarkedIds.includes(article.id)) {
      score += 3;
      reasons.push('Previously bookmarked');
    }

    // Recent articles (within last 7 days): +2 points
    const daysOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld <= 7) {
      score += 2;
      reasons.push('Recent');
    }

    if (score > 0) {
      scores.push({ article, score, reasons });
    }
  });

  // Sort by score and return top N
  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}

// Extract keywords from text for similarity matching
function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful keywords
  const commonWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'up',
    'about',
    'into',
    'through',
    'during',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'may',
    'might',
    'must',
    'can',
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word));
}

// Get personalized recommendations based on reading history
export function getPersonalizedRecommendations(
  allArticles: NewsArticle[],
  readArticleIds: string[],
  bookmarkedIds: string[],
  limit: number = 10
): ArticleScore[] {
  if (readArticleIds.length === 0) {
    // No reading history, return most recent articles
    return allArticles
      .filter((a) => !readArticleIds.includes(a.id))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
      .map((article) => ({
        article,
        score: 0,
        reasons: ['Latest article'],
      }));
  }

  const scores: ArticleScore[] = [];

  // Find most common sources and categories from reading history
  const sourceCount: Record<string, number> = {};
  const categoryCount: Record<string, number> = {};

  allArticles.forEach((article) => {
    if (readArticleIds.includes(article.id)) {
      sourceCount[article.source] = (sourceCount[article.source] || 0) + 1;
      categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    }
  });

  // Get top sources and categories
  const topSources = Object.keys(sourceCount).sort(
    (a, b) => sourceCount[b] - sourceCount[a]
  );
  const topCategories = Object.keys(categoryCount).sort(
    (a, b) => categoryCount[b] - categoryCount[a]
  );

  allArticles.forEach((article) => {
    if (readArticleIds.includes(article.id)) {
      return;
    }

    let score = 0;
    const reasons: string[] = [];

    // Favorite source
    const sourceRank = topSources.indexOf(article.source);
    if (sourceRank !== -1) {
      score += 10 - sourceRank;
      reasons.push('From favorite source');
    }

    // Favorite category
    const categoryRank = topCategories.indexOf(article.category);
    if (categoryRank !== -1) {
      score += 8 - categoryRank;
      reasons.push('Favorite category');
    }

    // Bookmarked: high interest
    if (bookmarkedIds.includes(article.id)) {
      score += 5;
      reasons.push('Bookmarked');
    }

    // Recent (last 7 days)
    const daysOld = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysOld <= 7) {
      score += 3;
      reasons.push('Recent');
    }

    if (score > 0) {
      scores.push({ article, score, reasons });
    }
  });

  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}
