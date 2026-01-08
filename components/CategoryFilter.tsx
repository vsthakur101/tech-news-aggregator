'use client';

import { Badge } from './ui/badge';
import { NEWS_CATEGORIES, NewsCategory } from '@/types/news';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {NEWS_CATEGORIES.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          className={cn(
            'cursor-pointer whitespace-nowrap transition-all hover:scale-105',
            selectedCategory === category && 'shadow-md'
          )}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
