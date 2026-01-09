'use client';

import { Search, X, Clock, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useEffect, useState, useRef } from 'react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search articles...' }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
      // Add to history when user searches (and there's a value)
      if (value.trim()) {
        addToHistory(value.trim());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch, addToHistory]);

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHistoryItemClick = (query: string) => {
    setValue(query);
    setShowHistory(false);
    inputRef.current?.blur();
  };

  const handleRemoveHistoryItem = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(query);
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setShowHistory(true)}
        className="pl-9 pr-9"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={() => setValue('')}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div
          ref={historyRef}
          className={cn(
            "absolute top-full left-0 right-0 mt-2 z-50",
            "bg-card border border-border rounded-lg shadow-lg",
            "max-h-64 overflow-y-auto"
          )}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              Recent Searches
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                clearHistory();
                setShowHistory(false);
              }}
            >
              Clear All
            </Button>
          </div>
          <div className="py-1">
            {searchHistory.map((query, index) => (
              <div
                key={`${query}-${index}`}
                className={cn(
                  "flex items-center justify-between px-3 py-2",
                  "hover:bg-accent cursor-pointer group"
                )}
                onClick={() => handleHistoryItemClick(query)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">{query}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0"
                  onClick={(e) => handleRemoveHistoryItem(query, e)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
