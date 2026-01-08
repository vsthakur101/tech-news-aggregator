'use client';

import { Badge } from './ui/badge';
import { NEWS_SOURCES, NewsSource } from '@/types/news';
import { cn } from '@/lib/utils';

interface SourceFilterProps {
  selectedSources: NewsSource[];
  onSourceToggle: (source: NewsSource) => void;
}

export function SourceFilter({ selectedSources, onSourceToggle }: SourceFilterProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Filter by Source:</p>
      <div className="flex flex-wrap gap-2">
        {NEWS_SOURCES.map(({ value, label }) => {
          const isSelected = selectedSources.includes(value);
          return (
            <Badge
              key={value}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:scale-105',
                isSelected && 'shadow-md'
              )}
              onClick={() => onSourceToggle(value)}
            >
              {label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
