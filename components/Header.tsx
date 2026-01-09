'use client';

import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { CollectionsManager } from './CollectionsManager';
import { Newspaper, Folder, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export function Header() {
  const [showCollections, setShowCollections] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Tech News Aggregator</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCollections(true)}
              className="flex items-center gap-2"
            >
              <Folder className="h-4 w-4" />
              <span className="hidden sm:inline">Collections</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <CollectionsManager open={showCollections} onOpenChange={setShowCollections} />
    </>
  );
}
