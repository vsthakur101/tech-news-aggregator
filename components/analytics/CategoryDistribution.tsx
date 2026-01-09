'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { PieChart } from 'lucide-react';
import { ReadArticle } from '@/types/news';
import { Badge } from '../ui/badge';

interface CategoryDistributionProps {
  readArticles: ReadArticle[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Security: '#ef4444',
  'Web Dev': '#3b82f6',
  'AI/ML': '#8b5cf6',
  DevOps: '#10b981',
  Mobile: '#f59e0b',
  'Open Source': '#06b6d4',
  All: '#6b7280',
};

export function CategoryDistribution({ readArticles }: CategoryDistributionProps) {
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};

    readArticles.forEach((article) => {
      // Try to infer category from URL or use "General"
      const category = inferCategoryFromUrl(article.url);
      stats[category] = (stats[category] || 0) + 1;
    });

    const total = readArticles.length;

    // Convert to array with percentages
    return Object.entries(stats)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / total) * 100,
        color: CATEGORY_COLORS[category] || CATEGORY_COLORS.All,
      }))
      .sort((a, b) => b.count - a.count);
  }, [readArticles]);

  if (readArticles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Category Distribution
          </CardTitle>
          <CardDescription>Articles by category</CardDescription>
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
          <PieChart className="h-5 w-5" />
          Category Distribution
        </CardTitle>
        <CardDescription>
          {categoryStats.length} categories from {readArticles.length} articles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart */}
          <div className="space-y-3">
            {categoryStats.map(({ category, count, percentage, color }) => (
              <div key={category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium">{category}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Category badges summary */}
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-2">Quick view</div>
            <div className="flex flex-wrap gap-2">
              {categoryStats.map(({ category, count, color }) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="border-2"
                  style={{ borderColor: color }}
                >
                  {category}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function inferCategoryFromUrl(url: string): string {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('security') || urlLower.includes('cve') || urlLower.includes('nvd')) {
    return 'Security';
  }
  if (urlLower.includes('react') || urlLower.includes('vue') || urlLower.includes('javascript')) {
    return 'Web Dev';
  }
  if (urlLower.includes('ai') || urlLower.includes('ml') || urlLower.includes('openai')) {
    return 'AI/ML';
  }
  if (urlLower.includes('docker') || urlLower.includes('kubernetes') || urlLower.includes('devops')) {
    return 'DevOps';
  }
  if (urlLower.includes('ios') || urlLower.includes('android') || urlLower.includes('mobile')) {
    return 'Mobile';
  }
  if (urlLower.includes('github') || urlLower.includes('opensource')) {
    return 'Open Source';
  }

  return 'General';
}
