'use client';

import { SortOption, ViewMode } from '@/types/news';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { Grid3X3, List, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SortControls({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: SortControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (Newest)</SelectItem>
            <SelectItem value="source">Source</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View:</span>
        <div className="flex gap-1 rounded-lg border p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 transition-colors',
              viewMode === 'grid' && 'bg-accent'
            )}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 transition-colors',
              viewMode === 'list' && 'bg-accent'
            )}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 transition-colors',
              viewMode === 'compact' && 'bg-accent'
            )}
            onClick={() => onViewModeChange('compact')}
            aria-label="Compact view"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
