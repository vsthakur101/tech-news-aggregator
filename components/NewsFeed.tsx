'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { NewsArticle, NewsCategory, NewsSource, SortOption, ViewMode } from '@/types/news';
import { NewsCard } from './NewsCard';
import { CategoryFilter } from './CategoryFilter';
import { SourceFilter } from './SourceFilter';
import { SearchBar } from './SearchBar';
import { SortControls } from './SortControls';
import { Pagination } from './Pagination';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { NEWS_SOURCES } from '@/types/news';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useStreak } from '@/hooks/useStreak';

interface NewsFeedProps {
  initialArticles: NewsArticle[];
}

export function NewsFeed({ initialArticles }: NewsFeedProps) {
  const { preferences, updatePreferences, loaded } = useUserPreferences([NEWS_SOURCES[0].value]);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { isRead, readCount } = useReadingHistory();
  const { updateStreak } = useStreak();
  
  const ITEMS_PER_PAGE = 12;

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSources, searchQuery, sortBy, showUnreadOnly]);

  // Paginate articles
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, endIndex);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of news feed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
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
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : viewMode === 'list'
                ? 'flex flex-col gap-4'
                : 'flex flex-col gap-2'
            }
          >
            {paginatedArticles.map((article) => (
              <NewsCard key={article.id} article={article} viewMode={viewMode} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredArticles.length}
            />
          )}
        </>
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
