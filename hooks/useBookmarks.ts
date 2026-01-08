'use client';

import { useState, useEffect } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('tech-news-bookmarks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookmarks(new Set(parsed));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      localStorage.setItem('tech-news-bookmarks', JSON.stringify(Array.from(newBookmarks)));
      return newBookmarks;
    });
  };

  const isBookmarked = (id: string) => bookmarks.has(id);
  const getBookmarkIds = () => Array.from(bookmarks);

  return { toggleBookmark, isBookmarked, getBookmarkIds, isLoaded };
}
