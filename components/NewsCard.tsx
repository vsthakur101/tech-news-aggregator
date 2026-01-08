'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { NewsArticle } from '@/types/news';
import { formatDate, truncateText } from '@/lib/utils';
import { BookmarkButton } from './BookmarkButton';
import { ExternalLink } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

const SOURCE_LABELS: Record<string, string> = {
  devto: 'Dev.to',
  hackernews: 'Hacker News',
  newsapi: 'Tech News',
  github: 'GitHub',
  vercel: 'Vercel',
  react: 'React',
  meta: 'Meta',
  google: 'Google',
  cloudflare: 'Cloudflare',
  reddit: 'Reddit',
  medium: 'Medium',
  bleepingcomputer: 'Bleeping Computer',
  securityweek: 'SecurityWeek',
  thehackernews: 'The Hacker News',
  cisa: 'CISA Alerts',
  githubadvisory: 'GitHub Security',
  nvd: 'NVD/CVE',
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
    >
      {article.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              {SOURCE_LABELS[article.source] || article.source}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {article.category}
            </Badge>
          </div>
          <BookmarkButton articleId={article.id} />
        </div>
        <CardTitle className="line-clamp-2 text-lg leading-tight">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="line-clamp-3">
          {truncateText(article.description, 150)}
        </CardDescription>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {article.author && `By ${article.author} • `}
            {formatDate(article.publishedAt)}
          </span>
          <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </CardContent>
    </Card>
  );
}
