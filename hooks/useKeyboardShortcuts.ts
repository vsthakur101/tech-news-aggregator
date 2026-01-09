'use client';

import { useEffect, useCallback, useState } from 'react';
import { NewsArticle } from '@/types/news';

export interface KeyboardShortcutsConfig {
  articles: NewsArticle[];
  onBookmark?: (articleId: string) => void;
  onOpen?: (article: NewsArticle) => void;
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts({
  articles,
  onBookmark,
  onOpen,
  onFocusSearch,
}: KeyboardShortcutsConfig) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Navigate to next article
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = Math.min(prev + 1, articles.length - 1);
      scrollToArticle(next);
      return next;
    });
  }, [articles.length]);

  // Navigate to previous article
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      scrollToArticle(next);
      return next;
    });
  }, []);

  // Scroll to article by index
  const scrollToArticle = useCallback((index: number) => {
    const articleElements = document.querySelectorAll('[data-article-id]');
    const element = articleElements[index];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Open current article
  const openCurrent = useCallback(() => {
    if (articles[currentIndex] && onOpen) {
      onOpen(articles[currentIndex]);
    }
  }, [articles, currentIndex, onOpen]);

  // Bookmark current article
  const bookmarkCurrent = useCallback(() => {
    if (articles[currentIndex] && onBookmark) {
      onBookmark(articles[currentIndex].id);
    }
  }, [articles, currentIndex, onBookmark]);

  // Focus search bar
  const focusSearch = useCallback(() => {
    if (onFocusSearch) {
      onFocusSearch();
    }
  }, [onFocusSearch]);

  // Toggle help modal
  const toggleHelp = useCallback(() => {
    setShowHelp((prev) => !prev);
  }, []);

  // Main keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow '?' even in input fields
        if (e.key === '?' && !e.shiftKey) {
          return;
        }
        // Allow Escape to blur
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      // Prevent default for handled keys
      const handledKeys = ['j', 'k', '/', 'b', 'o', '?'];
      if (handledKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case 'j':
          goToNext();
          break;
        case 'k':
          goToPrevious();
          break;
        case '/':
          focusSearch();
          break;
        case 'b':
          bookmarkCurrent();
          break;
        case 'o':
          openCurrent();
          break;
        case '?':
          toggleHelp();
          break;
        case 'escape':
          setShowHelp(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, focusSearch, bookmarkCurrent, openCurrent, toggleHelp]);

  // Reset index when articles change
  useEffect(() => {
    setCurrentIndex(0);
  }, [articles]);

  return {
    currentIndex,
    showHelp,
    setShowHelp,
    goToNext,
    goToPrevious,
    openCurrent,
    bookmarkCurrent,
  };
}
