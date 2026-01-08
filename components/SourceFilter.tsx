'use client';

import { Badge } from './ui/badge';
import { NEWS_SOURCES, NewsSource } from '@/types/news';
import { cn } from '@/lib/utils';

interface SourceFilterProps {
  selectedSources: NewsSource[];
  onSourceToggle: (source: NewsSource) => void;
}

export function SourceFilter({ selectedSources, onSourceToggle }: SourceFilterProps) {
  const handleSelectAll = () => {
    NEWS_SOURCES.forEach(({ value }) => {
      if (!selectedSources.includes(value)) {
        onSourceToggle(value);
      }
    });
  };

  const handleClearAll = () => {
    selectedSources.forEach((source) => {
      onSourceToggle(source);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Filter by Source ({selectedSources.length}/{NEWS_SOURCES.length} selected):</p>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-xs px-2 py-1 text-primary hover:underline"
          >
            Select All
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs px-2 py-1 text-muted-foreground hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {NEWS_SOURCES.map(({ value, label }) => {
          const isSelected = selectedSources.includes(value);
          return (
            <Badge
              key={value}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all hover:scale-105 select-none',
                isSelected
                  ? 'shadow-md bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'opacity-50 hover:opacity-100 bg-transparent'
              )}
              onClick={() => onSourceToggle(value)}
            >
              {isSelected ? '✓ ' : ''}{label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
