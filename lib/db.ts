'use client';

const DB_NAME = 'NewsAggregatorDB';
const DB_VERSION = 1;

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  articleIds: string[];
}

export interface CollectionItem {
  id?: number;
  collectionId: string;
  articleId: string;
  addedAt: string;
}

let dbInstance: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Collections store
      if (!db.objectStoreNames.contains('collections')) {
        const collectionsStore = db.createObjectStore('collections', { keyPath: 'id' });
        collectionsStore.createIndex('name', 'name', { unique: false });
      }

      // Collection items store (many-to-many relationship)
      if (!db.objectStoreNames.contains('collectionItems')) {
        const itemsStore = db.createObjectStore('collectionItems', {
          keyPath: 'id',
          autoIncrement: true,
        });
        itemsStore.createIndex('collectionId', 'collectionId', { unique: false });
        itemsStore.createIndex('articleId', 'articleId', { unique: false });
      }
    };
  });
}

// Generic CRUD operations for collections
export async function getAllCollections(): Promise<Collection[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collections'], 'readonly');
    const store = transaction.objectStore('collections');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCollection(id: string): Promise<Collection | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collections'], 'readonly');
    const store = transaction.objectStore('collections');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCollection(collection: Collection): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collections'], 'readwrite');
    const store = transaction.objectStore('collections');
    const request = store.put(collection);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteCollection(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collections', 'collectionItems'], 'readwrite');

    // Delete collection
    const collectionsStore = transaction.objectStore('collections');
    collectionsStore.delete(id);

    // Delete all items in this collection
    const itemsStore = transaction.objectStore('collectionItems');
    const index = itemsStore.index('collectionId');
    const request = index.openCursor(IDBKeyRange.only(id));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Collection items operations
export async function addArticleToCollection(
  collectionId: string,
  articleId: string
): Promise<void> {
  const db = await initDB();

  // Check if already exists
  const exists = await isArticleInCollection(collectionId, articleId);
  if (exists) {
    return;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collectionItems', 'collections'], 'readwrite');

    // Add to collectionItems
    const itemsStore = transaction.objectStore('collectionItems');
    const item: CollectionItem = {
      collectionId,
      articleId,
      addedAt: new Date().toISOString(),
    };
    itemsStore.add(item);

    // Update collection's articleIds array
    const collectionsStore = transaction.objectStore('collections');
    const getRequest = collectionsStore.get(collectionId);

    getRequest.onsuccess = () => {
      const collection: Collection = getRequest.result;
      if (collection && !collection.articleIds.includes(articleId)) {
        collection.articleIds.push(articleId);
        collectionsStore.put(collection);
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function removeArticleFromCollection(
  collectionId: string,
  articleId: string
): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collectionItems', 'collections'], 'readwrite');

    // Remove from collectionItems
    const itemsStore = transaction.objectStore('collectionItems');
    const index = itemsStore.index('collectionId');
    const request = index.openCursor(IDBKeyRange.only(collectionId));

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const item: CollectionItem = cursor.value;
        if (item.articleId === articleId) {
          cursor.delete();
        } else {
          cursor.continue();
        }
      }
    };

    // Update collection's articleIds array
    const collectionsStore = transaction.objectStore('collections');
    const getRequest = collectionsStore.get(collectionId);

    getRequest.onsuccess = () => {
      const collection: Collection = getRequest.result;
      if (collection) {
        collection.articleIds = collection.articleIds.filter(id => id !== articleId);
        collectionsStore.put(collection);
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getArticlesInCollection(collectionId: string): Promise<string[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collectionItems'], 'readonly');
    const store = transaction.objectStore('collectionItems');
    const index = store.index('collectionId');
    const request = index.getAll(IDBKeyRange.only(collectionId));

    request.onsuccess = () => {
      const items: CollectionItem[] = request.result;
      const articleIds = items.map(item => item.articleId);
      resolve(articleIds);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function isArticleInCollection(
  collectionId: string,
  articleId: string
): Promise<boolean> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collectionItems'], 'readonly');
    const store = transaction.objectStore('collectionItems');
    const index = store.index('collectionId');
    const request = index.openCursor(IDBKeyRange.only(collectionId));

    let found = false;
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const item: CollectionItem = cursor.value;
        if (item.articleId === articleId) {
          found = true;
        } else {
          cursor.continue();
        }
      }
    };

    transaction.oncomplete = () => resolve(found);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getCollectionsForArticle(articleId: string): Promise<Collection[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collectionItems', 'collections'], 'readonly');
    const itemsStore = transaction.objectStore('collectionItems');
    const index = itemsStore.index('articleId');
    const request = index.getAll(IDBKeyRange.only(articleId));

    request.onsuccess = async () => {
      const items: CollectionItem[] = request.result;
      const collectionIds = [...new Set(items.map(item => item.collectionId))];

      const collectionsStore = transaction.objectStore('collections');
      const collections: Collection[] = [];

      for (const id of collectionIds) {
        const collectionRequest = collectionsStore.get(id);
        collectionRequest.onsuccess = () => {
          if (collectionRequest.result) {
            collections.push(collectionRequest.result);
          }
        };
      }

      transaction.oncomplete = () => resolve(collections);
    };
    request.onerror = () => reject(request.error);
  });
}
