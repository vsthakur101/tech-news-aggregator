'use client';

import { useState, useMemo, useCallback } from 'react';
import { NewsArticle, NewsCategory, NewsSource } from '@/types/news';
import { NewsCard } from './NewsCard';
import { CategoryFilter } from './CategoryFilter';
import { SourceFilter } from './SourceFilter';
import { SearchBar } from './SearchBar';
import { Skeleton } from './ui/skeleton';
import { NEWS_SOURCES } from '@/types/news';

interface NewsFeedProps {
  initialArticles: NewsArticle[];
}

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [selectedSources, setSelectedSources] = useState<NewsSource[]>(
    NEWS_SOURCES.map(s => s.value)
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleSourceToggle = useCallback((source: NewsSource) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = initialArticles;

    // Filter by selected sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter((article) => selectedSources.includes(article.source));
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [initialArticles, selectedCategory, selectedSources, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <SourceFilter
          selectedSources={selectedSources}
          onSourceToggle={handleSourceToggle}
        />

        <div className="text-sm text-muted-foreground">
          Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          {selectedSources.length < NEWS_SOURCES.length &&
            ` from ${selectedSources.length} source${selectedSources.length !== 1 ? 's' : ''}`
          }
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No articles found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export function NewsFeedSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-80 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
