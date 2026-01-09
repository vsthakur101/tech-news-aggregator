'use client';

import { useState, useEffect } from 'react';
import { FolderPlus, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useCollections } from '@/hooks/useCollections';
import { cn } from '@/lib/utils';

interface AddToCollectionButtonProps {
  articleId: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function AddToCollectionButton({
  articleId,
  variant = 'ghost',
  size = 'icon',
}: AddToCollectionButtonProps) {
  const { collections, loaded, addToCollection, removeFromCollection } = useCollections();
  const [articleCollections, setArticleCollections] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  // Load which collections contain this article
  useEffect(() => {
    if (loaded) {
      const checkCollections = async () => {
        const inCollections = new Set<string>();
        for (const collection of collections) {
          if (collection.articleIds.includes(articleId)) {
            inCollections.add(collection.id);
          }
        }
        setArticleCollections(inCollections);
      };
      checkCollections();
    }
  }, [collections, articleId, loaded]);

  const handleToggleCollection = async (collectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (articleCollections.has(collectionId)) {
        await removeFromCollection(collectionId, articleId);
        setArticleCollections((prev) => {
          const next = new Set(prev);
          next.delete(collectionId);
          return next;
        });
      } else {
        await addToCollection(collectionId, articleId);
        setArticleCollections((prev) => new Set(prev).add(collectionId));
      }
    } catch (error) {
      console.error('Failed to toggle collection:', error);
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant={variant} size={size} className="relative">
          <FolderPlus className="h-4 w-4" />
          {articleCollections.size > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {articleCollections.size}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>Add to Collection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {collections.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            No collections yet
          </div>
        ) : (
          collections.map((collection) => {
            const isInCollection = articleCollections.has(collection.id);
            return (
              <DropdownMenuItem
                key={collection.id}
                onClick={(e) => handleToggleCollection(collection.id, e)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: collection.color }}
                  />
                  <span className="truncate">{collection.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    ({collection.articleIds.length})
                  </span>
                </div>
                {isInCollection && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                )}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
