'use client';

import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { NewsArticle } from '@/types/news';
import { extractTrendingTopics, getTopicFontSize, getTopicColor } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface TrendingTopicsProps {
  articles: NewsArticle[];
  onTopicClick?: (topic: string) => void;
  limit?: number;
  className?: string;
}

export function TrendingTopics({
  articles,
  onTopicClick,
  limit = 20,
  className,
}: TrendingTopicsProps) {
  const topics = useMemo(() => {
    return extractTrendingTopics(articles, limit);
  }, [articles, limit]);

  if (topics.length === 0) {
    return null;
  }

  const maxCount = topics[0]?.count || 1;
  const minCount = topics[topics.length - 1]?.count || 1;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Trending Topics</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map(({ topic, count }) => {
          const fontSize = getTopicFontSize(count, minCount, maxCount);
          const colorClass = getTopicColor(count, maxCount);

          return (
            <Badge
              key={topic}
              variant="secondary"
              className={cn(
                'cursor-pointer transition-all hover:scale-110 hover:shadow-md',
                colorClass
              )}
              style={{ fontSize: `${fontSize}rem` }}
              onClick={() => onTopicClick?.(topic)}
              title={`${count} mention${count !== 1 ? 's' : ''}`}
            >
              {topic}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </Badge>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Click any topic to filter articles
      </p>
    </div>
  );
}
