'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { NewsArticle, ViewMode } from '@/types/news';
import { formatDate, truncateText, calculateReadingTime } from '@/lib/utils';
import { BookmarkButton } from './BookmarkButton';
import { AddToCollectionButton } from './AddToCollectionButton';
import { ExternalLink, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useStreak } from '@/hooks/useStreak';

interface NewsCardProps {
  article: NewsArticle;
  viewMode?: ViewMode;
  isActive?: boolean;
  onClick?: () => void;
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

export function NewsCard({ article, viewMode = 'grid', isActive = false, onClick }: NewsCardProps) {
  const readingTime = calculateReadingTime(`${article.title} ${article.description}`);
  const { isRead } = useReadingHistory();
  const read = isRead(article.id);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Compact view - text only, no images, dense
  if (viewMode === 'compact') {
    return (
      <Card
        data-article-id={article.id}
        className={cn(
          'group cursor-pointer transition-colors hover:bg-accent',
          read && 'opacity-60',
          isActive && 'ring-2 ring-primary ring-offset-2'
        )}
        onClick={handleClick}
      >
        <CardHeader className="p-4 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {SOURCE_LABELS[article.source] || article.source}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {article.category}
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <AddToCollectionButton articleId={article.id} />
              <BookmarkButton articleId={article.id} />
            </div>
          </div>
          <CardTitle className="line-clamp-1 text-base leading-tight">
            {article.title}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // List view - horizontal layout
  if (viewMode === 'list') {
    return (
      <Card
        data-article-id={article.id}
        className={cn(
          'group cursor-pointer transition-all hover:shadow-lg',
          read && 'opacity-60',
          isActive && 'ring-2 ring-primary ring-offset-2'
        )}
        onClick={handleClick}
      >
        <div className="flex flex-row gap-4 p-4">
          {article.imageUrl && (
            <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="192px"
              />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {SOURCE_LABELS[article.source] || article.source}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <AddToCollectionButton articleId={article.id} />
                <BookmarkButton articleId={article.id} />
              </div>
            </div>
            <CardTitle className="line-clamp-2 text-lg leading-tight">
              {article.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {truncateText(article.description, 150)}
            </CardDescription>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {article.author && `By ${article.author} • `}
                {formatDate(article.publishedAt)}
              </span>
              <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view - default vertical card
  return (
    <Card
      data-article-id={article.id}
      className={cn(
        'group cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]',
        read && 'opacity-60',
        isActive && 'ring-2 ring-primary ring-offset-2'
      )}
      onClick={handleClick}
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
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <AddToCollectionButton articleId={article.id} />
            <BookmarkButton articleId={article.id} />
          </div>
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
