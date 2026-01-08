'use client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { useStreak } from '@/hooks/useStreak';
import { cn } from '@/lib/utils';

export function StreakCard() {
  const { streak, loaded, getStreakDays, getStreakMessage } = useStreak();
  
  if (!loaded) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Reading Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const streakDays = getStreakDays(7);
  const streakColor = streak.currentStreak >= 30 ? 'text-purple-600' : 
                     streak.currentStreak >= 14 ? 'text-orange-600' : 
                     streak.currentStreak >= 7 ? 'text-yellow-600' : 
                     streak.currentStreak >= 3 ? 'text-green-600' : 
                     'text-blue-600';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className={cn("h-5 w-5", streakColor)} />
            Reading Streak
          </div>
          <Badge variant="outline" className={cn("font-bold", streakColor)}>
            {streak.currentStreak} days 🔥
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak message */}
        <p className="text-sm text-muted-foreground font-medium">
          {getStreakMessage()}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">Best:</span>
            <span className="font-semibold">{streak.longestStreak} days</span>
          </div>
          {streak.currentStreak === streak.longestStreak && streak.currentStreak > 0 && (
            <Badge variant="secondary" className="text-xs">
              Personal Best!
            </Badge>
          )}
        </div>

        {/* Weekly calendar */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            This week
          </div>
          <div className="grid grid-cols-7 gap-1">
            {streakDays.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "flex flex-col items-center justify-center p-1 rounded-md border",
                  day.visited 
                    ? day.isToday 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                    : "bg-muted/30 text-muted-foreground border-muted"
                )}
                title={`${day.dayName}, ${day.dayNumber}${day.visited ? ' ✓' : ' ✗'}`}
              >
                <div className="text-xs font-medium">
                  {day.dayName.charAt(0)}
                </div>
                <div className="text-xs">
                  {day.dayNumber}
                </div>
                {day.visited && (
                  <div className="text-xs">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        {streak.currentStreak === 0 && (
          <div className="text-center p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">
              Read an article to start your streak!
            </p>
          </div>
        )}

        {/* Milestone notifications */}
        {streak.currentStreak > 0 && (
          <div className="space-y-1">
            {streak.currentStreak >= 3 && (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Habit forming! 🎯
              </div>
            )}
            {streak.currentStreak >= 7 && (
              <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                Weekly warrior! ⚔️
              </div>
            )}
            {streak.currentStreak >= 30 && (
              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Monthly master! 👑
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}