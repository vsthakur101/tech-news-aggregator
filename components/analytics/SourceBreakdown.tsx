'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Newspaper } from 'lucide-react';
import { ReadArticle } from '@/types/news';

interface SourceBreakdownProps {
  readArticles: ReadArticle[];
}

export function SourceBreakdown({ readArticles }: SourceBreakdownProps) {
  const sourceStats = useMemo(() => {
    const stats: Record<string, number> = {};

    readArticles.forEach((article) => {
      // Extract source from URL
      const source = extractSourceFromUrl(article.url);
      stats[source] = (stats[source] || 0) + 1;
    });

    // Convert to array and sort by count
    return Object.entries(stats)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 sources
  }, [readArticles]);

  const maxCount = sourceStats[0]?.count || 1;

  if (readArticles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Most Read Sources
          </CardTitle>
          <CardDescription>Your top news sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No reading history yet</p>
            <p className="text-sm mt-1">Start reading articles to see your stats</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Most Read Sources
        </CardTitle>
        <CardDescription>Your top {sourceStats.length} news sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sourceStats.map(({ source, count }) => {
            const percentage = (count / maxCount) * 100;

            return (
              <div key={source} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate">{source}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function extractSourceFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Remove www. and get domain name
    const domain = hostname.replace(/^www\./, '');

    // Extract main domain (e.g., "github.com" from "api.github.com")
    const parts = domain.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }

    return domain;
  } catch {
    return 'Unknown';
  }
}
