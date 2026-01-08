'use client';

import { useState, useEffect, useCallback } from 'react';
import { SortOption, ViewMode, NewsSource } from '@/types/news';

const STORAGE_KEY = 'user-preferences';

export interface UserPreferences {
  sortBy: SortOption;
  viewMode: ViewMode;
  showUnreadOnly: boolean;
  selectedSources: NewsSource[];
}

const defaultPreferences: UserPreferences = {
  sortBy: 'date',
  viewMode: 'grid',
  showUnreadOnly: false,
  selectedSources: [],
};

export function useUserPreferences(initialSources: NewsSource[] = []) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...defaultPreferences,
    selectedSources: initialSources,
  });
  const [loaded, setLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedPreferences = JSON.parse(stored) as UserPreferences;
        setPreferences({
          ...loadedPreferences,
          // If no sources were saved, use initial sources
          selectedSources: loadedPreferences.selectedSources?.length > 0
            ? loadedPreferences.selectedSources
            : initialSources,
        });
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    } finally {
      setLoaded(true);
    }
  }, []); // Remove initialSources dependency to prevent infinite loop

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (!loaded) return; // Don't save on initial load

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [preferences, loaded]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences({ ...defaultPreferences, selectedSources: initialSources });
  }, [initialSources]);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    loaded,
  };
}
