'use client';

import { useState, useMemo, useCallback } from 'react';
import { NewsArticle, NewsCategory, NewsSource, SortOption, ViewMode } from '@/types/news';
import { NewsCard } from './NewsCard';
import { CategoryFilter } from './CategoryFilter';
import { SourceFilter } from './SourceFilter';
import { SearchBar } from './SearchBar';
import { SortControls } from './SortControls';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { NEWS_SOURCES } from '@/types/news';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface NewsFeedProps {
  initialArticles: NewsArticle[];
}

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const { preferences, updatePreferences, loaded } = useUserPreferences([NEWS_SOURCES[0].value]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { isRead, readCount } = useReadingHistory();

  // Extract preferences for easier access
  const sortBy = preferences.sortBy;
  const viewMode = preferences.viewMode;
  const showUnreadOnly = preferences.showUnreadOnly;
  const selectedSources = preferences.selectedSources;

  const handleSortChange = useCallback((newSortBy: SortOption) => {
    updatePreferences({ sortBy: newSortBy });
  }, [updatePreferences]);

  const handleViewModeChange = useCallback((newViewMode: ViewMode) => {
    updatePreferences({ viewMode: newViewMode });
  }, [updatePreferences]);

  const handleUnreadToggle = useCallback(() => {
    updatePreferences({ showUnreadOnly: !showUnreadOnly });
  }, [showUnreadOnly, updatePreferences]);

  const handleSourceToggle = useCallback((source: NewsSource) => {
    const newSources = selectedSources.includes(source)
      ? selectedSources.filter((s) => s !== source)
      : [...selectedSources, source];
    updatePreferences({ selectedSources: newSources });
  }, [selectedSources, updatePreferences]);

  const handleSelectAllSources = useCallback(() => {
    const allSources = NEWS_SOURCES.map(({ value }) => value);
    updatePreferences({ selectedSources: allSources });
  }, [updatePreferences]);

  const handleClearAllSources = useCallback(() => {
    updatePreferences({ selectedSources: [] });
  }, [updatePreferences]);

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

    // Filter unread articles
    if (showUnreadOnly) {
      filtered = filtered.filter((article) => !isRead(article.id));
    }

    // Sort articles
    const sorted = [...filtered];
    if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === 'source') {
      sorted.sort((a, b) => a.source.localeCompare(b.source));
    } else if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }

    return sorted;
  }, [initialArticles, selectedCategory, selectedSources, searchQuery, sortBy, showUnreadOnly, isRead]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} />

        <SortControls
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <SourceFilter
          selectedSources={selectedSources}
          onSourceToggle={handleSourceToggle}
          onSelectAll={handleSelectAllSources}
          onClearAll={handleClearAllSources}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
            {selectedSources.length < NEWS_SOURCES.length &&
              ` from ${selectedSources.length} source${selectedSources.length !== 1 ? 's' : ''}`
            }
            {readCount > 0 && ` • ${readCount} read`}
          </div>
          <Button
            variant={showUnreadOnly ? 'default' : 'outline'}
            size="sm"
            onClick={handleUnreadToggle}
            className="flex items-center gap-2"
          >
            {showUnreadOnly ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {showUnreadOnly ? 'Show All' : 'Unread Only'}
          </Button>
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
        <div
          className={
            viewMode === 'grid'
              ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
              : viewMode === 'list'
              ? 'flex flex-col gap-4'
              : 'flex flex-col gap-2'
          }
        >
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} viewMode={viewMode} />
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
