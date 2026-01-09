'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Collection,
  getAllCollections,
  saveCollection,
  deleteCollection,
  addArticleToCollection,
  removeArticleFromCollection,
  getArticlesInCollection,
  isArticleInCollection,
  getCollectionsForArticle,
} from '@/lib/db';

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Predefined collection colors
export const COLLECTION_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#06b6d4', // cyan
  '#6366f1', // indigo
];

// Default collections
const DEFAULT_COLLECTIONS: Omit<Collection, 'id' | 'createdAt'>[] = [
  {
    name: 'Read Later',
    description: 'Articles to read when you have time',
    color: COLLECTION_COLORS[0],
    articleIds: [],
  },
  {
    name: 'Favorites',
    description: 'Your favorite articles',
    color: COLLECTION_COLORS[1],
    articleIds: [],
  },
  {
    name: 'Archive',
    description: 'Archived articles for reference',
    color: COLLECTION_COLORS[2],
    articleIds: [],
  },
];

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load collections from IndexedDB
  const loadCollections = useCallback(async () => {
    try {
      const allCollections = await getAllCollections();

      // If no collections exist, create defaults
      if (allCollections.length === 0) {
        const defaultCollections: Collection[] = DEFAULT_COLLECTIONS.map((col) => ({
          ...col,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }));

        for (const collection of defaultCollections) {
          await saveCollection(collection);
        }

        setCollections(defaultCollections);
      } else {
        setCollections(allCollections);
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  // Create new collection
  const createCollection = useCallback(
    async (name: string, description: string, color: string) => {
      try {
        const newCollection: Collection = {
          id: generateId(),
          name,
          description,
          color,
          createdAt: new Date().toISOString(),
          articleIds: [],
        };

        await saveCollection(newCollection);
        setCollections((prev) => [...prev, newCollection]);

        return newCollection;
      } catch (error) {
        console.error('Failed to create collection:', error);
        throw error;
      }
    },
    []
  );

  // Update collection
  const updateCollection = useCallback(
    async (id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>) => {
      try {
        const existing = collections.find((c) => c.id === id);
        if (!existing) {
          throw new Error('Collection not found');
        }

        const updated: Collection = {
          ...existing,
          ...updates,
        };

        await saveCollection(updated);
        setCollections((prev) => prev.map((c) => (c.id === id ? updated : c)));
      } catch (error) {
        console.error('Failed to update collection:', error);
        throw error;
      }
    },
    [collections]
  );

  // Delete collection
  const removeCollection = useCallback(async (id: string) => {
    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete collection:', error);
      throw error;
    }
  }, []);

  // Add article to collection
  const addToCollection = useCallback(
    async (collectionId: string, articleId: string) => {
      try {
        await addArticleToCollection(collectionId, articleId);

        // Update local state
        setCollections((prev) =>
          prev.map((c) => {
            if (c.id === collectionId && !c.articleIds.includes(articleId)) {
              return {
                ...c,
                articleIds: [...c.articleIds, articleId],
              };
            }
            return c;
          })
        );
      } catch (error) {
        console.error('Failed to add article to collection:', error);
        throw error;
      }
    },
    []
  );

  // Remove article from collection
  const removeFromCollection = useCallback(
    async (collectionId: string, articleId: string) => {
      try {
        await removeArticleFromCollection(collectionId, articleId);

        // Update local state
        setCollections((prev) =>
          prev.map((c) => {
            if (c.id === collectionId) {
              return {
                ...c,
                articleIds: c.articleIds.filter((id) => id !== articleId),
              };
            }
            return c;
          })
        );
      } catch (error) {
        console.error('Failed to remove article from collection:', error);
        throw error;
      }
    },
    []
  );

  // Check if article is in collection
  const isInCollection = useCallback(
    async (collectionId: string, articleId: string): Promise<boolean> => {
      try {
        return await isArticleInCollection(collectionId, articleId);
      } catch (error) {
        console.error('Failed to check if article is in collection:', error);
        return false;
      }
    },
    []
  );

  // Get all articles in a collection
  const getCollectionArticles = useCallback(async (collectionId: string): Promise<string[]> => {
    try {
      return await getArticlesInCollection(collectionId);
    } catch (error) {
      console.error('Failed to get collection articles:', error);
      return [];
    }
  }, []);

  // Get all collections containing an article
  const getArticleCollections = useCallback(async (articleId: string): Promise<Collection[]> => {
    try {
      return await getCollectionsForArticle(articleId);
    } catch (error) {
      console.error('Failed to get article collections:', error);
      return [];
    }
  }, []);

  return {
    collections,
    loaded,
    createCollection,
    updateCollection,
    removeCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
    getCollectionArticles,
    getArticleCollections,
    reloadCollections: loadCollections,
  };
}
