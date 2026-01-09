'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

export interface DateRangeFilter {
  dateFrom?: Date;
  dateTo?: Date;
}

interface AdvancedSearchPanelProps {
  onFilterChange: (filters: DateRangeFilter) => void;
  className?: string;
}

export function AdvancedSearchPanel({ onFilterChange, className }: AdvancedSearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleApplyFilters = () => {
    const filters: DateRangeFilter = {};

    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom);
    }
    if (dateTo) {
      // Set to end of day
      const date = new Date(dateTo);
      date.setHours(23, 59, 59, 999);
      filters.dateTo = date;
    }

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    onFilterChange({});
  };

  const hasActiveFilters = dateFrom || dateTo;

  return (
    <div className={cn("border border-border rounded-lg", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Advanced Search</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              Active
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="date-from" className="text-sm font-medium">
                From Date
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                max={dateTo || new Date().toISOString().split('T')[0]}
                className="w-full"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="date-to" className="text-sm font-medium">
                To Date
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                min={dateFrom || undefined}
                max={new Date().toISOString().split('T')[0]}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  setDateFrom(today.toISOString().split('T')[0]);
                  setDateTo(today.toISOString().split('T')[0]);
                }}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                  setDateFrom(yesterday.toISOString().split('T')[0]);
                  setDateTo(today.toISOString().split('T')[0]);
                }}
              >
                Yesterday
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const weekAgo = new Date(today);
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  setDateFrom(weekAgo.toISOString().split('T')[0]);
                  setDateTo(today.toISOString().split('T')[0]);
                }}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  const monthAgo = new Date(today);
                  monthAgo.setDate(monthAgo.getDate() - 30);
                  setDateFrom(monthAgo.toISOString().split('T')[0]);
                  setDateTo(today.toISOString().split('T')[0]);
                }}
              >
                Last 30 Days
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button onClick={handleApplyFilters} size="sm" className="flex-1">
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
