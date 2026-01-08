import { Suspense } from 'react';
import { NewsFeed, NewsFeedSkeleton } from '@/components/NewsFeed';
import { fetchAllNews } from '@/lib/aggregator';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
  const articles = await fetchAllNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Latest Tech News from 11 Sources</h2>
        <p className="text-muted-foreground">
          Curated from Dev.to, Hacker News, GitHub, Vercel Blog, React Blog, Meta Engineering,
          Google Developers, Cloudflare Blog, Reddit, Medium, and NewsAPI
        </p>
      </div>

      <Suspense fallback={<NewsFeedSkeleton />}>
        <NewsFeed initialArticles={articles} />
      </Suspense>
    </div>
  );
}
