'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { NewsArticle } from '@/types/news';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Bookmark,
  FolderPlus,
  Share2,
  Clock,
} from 'lucide-react';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { BookmarkButton } from './BookmarkButton';
import { AddToCollectionButton } from './AddToCollectionButton';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ArticlePreviewModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
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

export function ArticlePreviewModal({
  article,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: ArticlePreviewModalProps) {
  // Keyboard navigation
  useEffect(() => {
    if (!article) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [article, hasNext, hasPrevious, onNext, onPrevious, onClose]);

  if (!article) return null;

  const readingTime = calculateReadingTime(`${article.title} ${article.description}`);

  return (
    <Dialog open={!!article} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black text-white border-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl leading-tight pr-8 text-white">{article.title}</DialogTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                <Badge variant="secondary" className="text-xs">
                  {SOURCE_LABELS[article.source] || article.source}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min read
                </Badge>
                <span className="text-xs text-gray-400">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Article Content */}
        <div className="space-y-4 py-4">
          {/* Image */}
          {article.imageUrl && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-base leading-relaxed text-gray-300">{article.description}</p>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Author */}
          {article.author && (
            <p className="text-sm text-gray-400">
              By <span className="font-medium text-white">{article.author}</span>
            </p>
          )}

          {/* Full Article Link */}
          <div className="pt-4 border-t border-gray-800">
            <Button asChild className="w-full sm:w-auto" size="lg">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Full Article
              </a>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between py-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <AddToCollectionButton articleId={article.id} />
            <BookmarkButton articleId={article.id} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: article.url,
                  });
                } else {
                  navigator.clipboard.writeText(article.url);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="text-xs text-center text-gray-500 pb-2">
          Use arrow keys to navigate • Press Esc to close
        </div>
      </DialogContent>
    </Dialog>
  );
}
