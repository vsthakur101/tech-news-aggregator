'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReadArticle } from '@/types/news';

const STORAGE_KEY = 'reading-history';
const MAX_HISTORY_SIZE = 1000; // Limit history to last 1000 articles

export function useReadingHistory() {
  const [readArticles, setReadArticles] = useState<string[]>([]);

  // Load reading history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history: ReadArticle[] = JSON.parse(stored);
        const articleIds = history.map(item => item.id);
        setReadArticles(articleIds);
      }
    } catch (error) {
      console.error('Failed to load reading history:', error);
    }
  }, []);

  // Mark an article as read
  const markAsRead = useCallback((articleId: string, url: string) => {
    try {
      // Get existing history
      const stored = localStorage.getItem(STORAGE_KEY);
      let history: ReadArticle[] = stored ? JSON.parse(stored) : [];

      // Check if already marked as read
      if (history.some(item => item.id === articleId)) {
        return;
      }

      // Add new read article
      const newReadArticle: ReadArticle = {
        id: articleId,
        readAt: new Date().toISOString(),
        url,
      };

      history.unshift(newReadArticle); // Add to beginning

      // Limit history size
      if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(0, MAX_HISTORY_SIZE);
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

      // Update state
      setReadArticles(prev => [...prev, articleId]);
    } catch (error) {
      console.error('Failed to mark article as read:', error);
    }
  }, []); // No dependencies needed as we use functional state update

  // Check if an article is read
  const isRead = useCallback((articleId: string): boolean => {
    return readArticles.includes(articleId);
  }, [readArticles]);

  // Get all read articles
  const getReadArticles = useCallback((): ReadArticle[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get read articles:', error);
      return [];
    }
  }, []);

  // Clear reading history
  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setReadArticles([]);
    } catch (error) {
      console.error('Failed to clear reading history:', error);
    }
  }, []);

  // Get read count
  const readCount = readArticles.length;

  return {
    markAsRead,
    isRead,
    getReadArticles,
    clearHistory,
    readCount,
    readArticles,
  };
}
