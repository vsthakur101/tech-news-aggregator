'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'search-history';
const MAX_HISTORY_SIZE = 10;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history: string[] = JSON.parse(stored);
        setSearchHistory(history);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }, []);

  // Add a search query to history
  const addToHistory = useCallback((query: string) => {
    if (!query.trim() || query.length < 2) return;

    setSearchHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());

      // Add to beginning and limit size
      const updated = [query, ...filtered].slice(0, MAX_HISTORY_SIZE);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save search history:', error);
      }

      return updated;
    });
  }, []);

  // Clear search history
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }, []);

  // Remove a single item from history
  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((q) => q !== query);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update search history:', error);
      }

      return updated;
    });
  }, []);

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
}
