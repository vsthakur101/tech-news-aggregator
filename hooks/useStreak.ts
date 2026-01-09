'use client';

import { useState, useEffect, useCallback } from 'react';

const STREAK_KEY = 'reading-streak';
const LAST_VISIT_KEY = 'last-visit-date';
const STREAK_HISTORY_KEY = 'streak-history';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string | null;
  streakHistory: Record<string, boolean>; // date -> visited (YYYY-MM-DD format)
}

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastVisitDate: null,
  streakHistory: {},
};

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(defaultStreak);
  const [loaded, setLoaded] = useState(false);

  // Load streak data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STREAK_KEY);
      const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
      const history = localStorage.getItem(STREAK_HISTORY_KEY);

      let loadedStreak = defaultStreak;

      if (stored) {
        const streakData = JSON.parse(stored) as StreakData;
        const historyData = history ? JSON.parse(history) : {};

        loadedStreak = {
          ...streakData,
          streakHistory: historyData,
        };

        setStreak(loadedStreak);
      }

      // Check and update streak on app load
      if (lastVisit) {
        checkAndUpdateStreakWithData(loadedStreak);
      } else {
        // First time user
        const today = new Date().toISOString().split('T')[0];
        const initialStreak: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastVisitDate: today,
          streakHistory: { [today]: true },
        };
        setStreak(initialStreak);
        localStorage.setItem(STREAK_KEY, JSON.stringify(initialStreak));
        localStorage.setItem(LAST_VISIT_KEY, today);
        localStorage.setItem(STREAK_HISTORY_KEY, JSON.stringify(initialStreak.streakHistory));
      }
    } catch (error) {
      console.error('Failed to load streak data:', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  const checkAndUpdateStreakWithData = useCallback((streakData: StreakData) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastVisit = streakData.lastVisitDate;

    if (lastVisit === today) {
      // Already visited today, no change needed
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = streakData.currentStreak;

    if (lastVisit === yesterdayStr) {
      // Consecutive day, increment streak
      newStreak = streakData.currentStreak + 1;
    } else if (lastVisit === null) {
      // First time user
      newStreak = 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    const newLongestStreak = Math.max(newStreak, streakData.longestStreak);

    const updatedHistory = {
      ...streakData.streakHistory,
      [today]: true,
    };

    const newStreakData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastVisitDate: today,
      streakHistory: updatedHistory,
    };

    setStreak(newStreakData);

    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(newStreakData));
      localStorage.setItem(LAST_VISIT_KEY, today);
      localStorage.setItem(STREAK_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save streak data:', error);
    }
  }, []);

  const checkAndUpdateStreak = useCallback(() => {
    checkAndUpdateStreakWithData(streak);
  }, [streak, checkAndUpdateStreakWithData]);

  const updateStreak = useCallback((visitToday: boolean, customStreak?: number) => {
    const today = new Date().toISOString().split('T')[0];

    // If already visited today, no need to update
    if (streak.lastVisitDate === today && streak.streakHistory[today]) {
      return;
    }

    let newStreak: number;

    if (customStreak !== undefined) {
      newStreak = customStreak;
    } else if (!visitToday) {
      newStreak = 0;
    } else {
      // Check if this is a consecutive day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streak.lastVisitDate === yesterdayStr) {
        // Consecutive day, increment
        newStreak = streak.currentStreak + 1;
      } else if (streak.lastVisitDate === today) {
        // Same day, keep current
        newStreak = streak.currentStreak;
      } else if (streak.lastVisitDate === null || streak.currentStreak === 0) {
        // First visit or after reset
        newStreak = 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }
    }

    const newLongestStreak = Math.max(newStreak, streak.longestStreak);

    const updatedHistory = {
      ...streak.streakHistory,
      [today]: visitToday,
    };

    const newStreakData: StreakData = {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastVisitDate: today,
      streakHistory: updatedHistory,
    };

    setStreak(newStreakData);

    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(newStreakData));
      localStorage.setItem(LAST_VISIT_KEY, today);
      localStorage.setItem(STREAK_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save streak data:', error);
    }
  }, [streak]);

  const getStreakDays = useCallback((days: number = 7) => {
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      result.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        visited: streak.streakHistory[dateStr] || false,
        isToday: i === 0,
      });
    }
    
    return result;
  }, [streak.streakHistory]);

  const resetStreak = useCallback(() => {
    setStreak(defaultStreak);
    try {
      localStorage.removeItem(STREAK_KEY);
      localStorage.removeItem(LAST_VISIT_KEY);
      localStorage.removeItem(STREAK_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to reset streak:', error);
    }
  }, []);

  const getStreakMessage = useCallback(() => {
    if (streak.currentStreak === 0) return 'Start your reading streak today!';
    if (streak.currentStreak === 1) return 'Great start! Keep it going!';
    if (streak.currentStreak === 3) return '3 days strong! You\'re on fire!';
    if (streak.currentStreak === 7) return 'A full week! Amazing consistency!';
    if (streak.currentStreak === 14) return 'Two weeks! You\'re a reading champion!';
    if (streak.currentStreak === 30) return '30 days! Legendary dedication!';
    if (streak.currentStreak === 50) return '50 days! Unbelievable streak!';
    if (streak.currentStreak === 100) return '100 days! You\'re in the hall of fame!';
    
    return `${streak.currentStreak} days! Keep the streak alive!`;
  }, [streak.currentStreak]);

  return {
    streak,
    loaded,
    updateStreak,
    getStreakDays,
    resetStreak,
    getStreakMessage,
  };
}