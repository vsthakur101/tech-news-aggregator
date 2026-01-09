'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Flame, Trophy, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  streakHistory: Record<string, boolean>;
}

export function StreakCalendar({
  currentStreak,
  longestStreak,
  streakHistory,
}: StreakCalendarProps) {
  // Get last 35 days (5 weeks)
  const getDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        visited: streakHistory[dateStr] || false,
        isToday: i === 0,
      });
    }

    return days;
  };

  const days = getDays();

  // Get streak message
  const getStreakMessage = () => {
    if (currentStreak === 0) return { message: 'Start your reading streak today!', emoji: '🌱' };
    if (currentStreak === 1) return { message: 'Great start! Keep it going!', emoji: '🔥' };
    if (currentStreak >= 3 && currentStreak < 7) return { message: `${currentStreak} days strong!`, emoji: '💪' };
    if (currentStreak >= 7 && currentStreak < 14) return { message: 'A full week! Amazing!', emoji: '⚡' };
    if (currentStreak >= 14 && currentStreak < 30) return { message: 'Two weeks! You\'re unstoppable!', emoji: '🚀' };
    if (currentStreak >= 30 && currentStreak < 50) return { message: '30+ days! Legendary!', emoji: '🏆' };
    if (currentStreak >= 50 && currentStreak < 100) return { message: '50+ days! Hall of Fame!', emoji: '👑' };
    if (currentStreak >= 100) return { message: '100+ days! Ultimate Champion!', emoji: '💎' };
    return { message: `${currentStreak} day streak!`, emoji: '🔥' };
  };

  const streakInfo = getStreakMessage();

  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className="pb-4 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
              Reading Streak
            </CardTitle>
            <CardDescription className="mt-1">
              {streakInfo.message}
            </CardDescription>
          </div>
          <div className="text-5xl">{streakInfo.emoji}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Main Streak Display */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Streak */}
          <div className="relative overflow-hidden rounded-xl border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-6 hover:scale-105 transition-transform">
            <div className="absolute top-2 right-2">
              <Flame className="h-8 w-8 text-orange-500/20" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Current Streak
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-orange-500">{currentStreak}</span>
                <span className="text-lg text-muted-foreground">day{currentStreak !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="relative overflow-hidden rounded-xl border-2 border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-6 hover:scale-105 transition-transform">
            <div className="absolute top-2 right-2">
              <Trophy className="h-8 w-8 text-amber-500/20" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Best Streak
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-amber-500">{longestStreak}</span>
                <span className="text-lg text-muted-foreground">day{longestStreak !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Activity Calendar - Last 35 Days
            </div>
            <div className="text-xs text-muted-foreground">
              {days.filter(d => d.visited).length} active days
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div key={day.date} className="flex flex-col items-center gap-1">
                  {index < 7 && (
                    <div className="text-[10px] font-medium text-muted-foreground h-3">
                      {day.dayName.slice(0, 1)}
                    </div>
                  )}
                  {index >= 7 && <div className="h-3"></div>}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-medium transition-all cursor-pointer relative',
                      day.visited
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20 hover:scale-110'
                        : 'bg-muted hover:bg-muted/60 text-muted-foreground',
                      day.isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
                    )}
                    title={`${day.month} ${day.dayNumber} - ${day.visited ? 'Read articles ✓' : 'No activity'}`}
                  >
                    {day.visited ? (
                      <Flame className="h-4 w-4" />
                    ) : (
                      <span className="opacity-50">{day.dayNumber}</span>
                    )}
                    {day.isToday && (
                      <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend & Motivational Message */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-muted"></div>
              <span className="text-muted-foreground">No activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-500 to-red-500"></div>
              <span className="text-muted-foreground">Active day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded ring-2 ring-primary ring-offset-1 ring-offset-background"></div>
              <span className="text-muted-foreground">Today</span>
            </div>
          </div>
          {currentStreak > 0 && (
            <div className="text-xs font-medium text-orange-500">
              Keep going! 🎯
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
