import { Suspense } from 'react';
import { NewsFeed, NewsFeedSkeleton } from '@/components/NewsFeed';
import { StreakCardClient } from '@/components/StreakCardClient';
import { DailyQuoteClient } from '@/components/DailyQuoteClient';
import { fetchAllNews } from '@/lib/aggregator';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  const articles = await fetchAllNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Latest Tech & Cybersecurity News from 17 Sources</h2>
        <p className="text-muted-foreground">
          <strong>Tech:</strong> Dev.to, Hacker News, GitHub, React, Meta, Google, Cloudflare, Reddit, Medium, NewsAPI<br />
          <strong>Security:</strong> Bleeping Computer, SecurityWeek, The Hacker News, CISA Alerts, GitHub Security, NVD/CVE
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Suspense fallback={<NewsFeedSkeleton />}>
            <NewsFeed initialArticles={articles} />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <StreakCardClient />
            <DailyQuoteClient />
          </div>
        </div>
      </div>
    </div>
  );
}
