'use client';

import { useMemo, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { getPersonalizedRecommendations } from '@/lib/analytics';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useBookmarks } from '@/hooks/useBookmarks';
import { NewsCard } from './NewsCard';
import { ViewMode } from '@/types/news';

interface RecommendationsPanelProps {
  allArticles: NewsArticle[];
  viewMode?: ViewMode;
  limit?: number;
  className?: string;
}

export function RecommendationsPanel({
  allArticles,
  viewMode = 'grid',
  limit = 6,
  className,
}: RecommendationsPanelProps) {
  const [mounted, setMounted] = useState(false);
  const { getReadArticles } = useReadingHistory();
  const { getBookmarkIds } = useBookmarks();

  // Wait for client-side hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  const recommendations = useMemo(() => {
    if (!mounted) {
      return [];
    }

    const readIds = getReadArticles().map((a) => a.id);
    const bookmarkIds = getBookmarkIds();

    const results = getPersonalizedRecommendations(allArticles, readIds, bookmarkIds, limit);

    return results.map((r) => r.article);
  }, [mounted, allArticles, getReadArticles, getBookmarkIds, limit]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommended for You
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Based on your reading history and preferences
        </p>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
            : viewMode === 'list'
            ? 'flex flex-col gap-4'
            : 'flex flex-col gap-2'
        }
      >
        {recommendations.map((article) => (
          <NewsCard key={article.id} article={article} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}
