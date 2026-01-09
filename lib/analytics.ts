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
