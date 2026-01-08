'use client';

import { Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  articleId: string;
}

export function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks();

  if (!isLoaded) {
    return null;
  }

  const bookmarked = isBookmarked(articleId);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(articleId);
      }}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      className="shrink-0"
    >
      <Bookmark className={cn('h-5 w-5 transition-all', bookmarked && 'fill-current text-primary')} />
    </Button>
  );
}
