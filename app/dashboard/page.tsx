'use client';

import { useEffect, useState } from 'react';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useStreak } from '@/hooks/useStreak';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCollections } from '@/hooks/useCollections';
import { ReadingStatsCard } from '@/components/analytics/ReadingStatsCard';
import { StreakCalendar } from '@/components/analytics/StreakCalendar';
import { SourceBreakdown } from '@/components/analytics/SourceBreakdown';
import { CategoryDistribution } from '@/components/analytics/CategoryDistribution';
import { BarChart3, TrendingUp, Bookmark, Folder } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPage() {
  const { readCount, getReadArticles } = useReadingHistory();
  const { streak } = useStreak();
  const { getBookmarkIds } = useBookmarks();
  const { collections } = useCollections();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const readArticles = getReadArticles();
  const bookmarkIds = getBookmarkIds();
  const totalCollectionArticles = collections.reduce((sum, c) => sum + c.articleIds.length, 0);

  // Calculate this week's reading
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekCount = readArticles.filter(
    (a) => new Date(a.readAt) >= weekAgo
  ).length;

  // Calculate today's reading
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = readArticles.filter(
    (a) => new Date(a.readAt) >= today
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Personal Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your reading habits and progress
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReadingStatsCard
            title="Total Read"
            value={readCount}
            icon={<BarChart3 className="h-4 w-4" />}
            description="All-time articles read"
          />
          <ReadingStatsCard
            title="This Week"
            value={thisWeekCount}
            icon={<TrendingUp className="h-4 w-4" />}
            description="Articles read this week"
            trend={thisWeekCount > 0 ? '+' + thisWeekCount : undefined}
          />
          <ReadingStatsCard
            title="Bookmarks"
            value={bookmarkIds.length}
            icon={<Bookmark className="h-4 w-4" />}
            description="Saved for later"
          />
          <ReadingStatsCard
            title="Collections"
            value={totalCollectionArticles}
            icon={<Folder className="h-4 w-4" />}
            description={`In ${collections.length} collection${collections.length !== 1 ? 's' : ''}`}
          />
        </div>

        {/* Streak Calendar */}
        <StreakCalendar
          currentStreak={streak.currentStreak}
          longestStreak={streak.longestStreak}
          streakHistory={streak.streakHistory}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SourceBreakdown readArticles={readArticles} />
          <CategoryDistribution readArticles={readArticles} />
        </div>

        {/* Reading Goals */}
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Today's Progress
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Daily Goal (5 articles)</span>
                <span className="text-sm font-medium">{todayCount}/5</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min((todayCount / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
            {todayCount >= 5 && (
              <p className="text-sm text-green-600 dark:text-green-400">
                🎉 Great job! You've hit your daily goal!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
