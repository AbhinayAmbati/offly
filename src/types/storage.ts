// Storage-related types for IndexedDB and Cache API
export interface OfflyStorageConfig {
  dbName: string;
  dbVersion: number;
  stores: StoreName[];
}

export type StoreName = 'cache_entries' | 'sync_queue' | 'config' | 'metadata';

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export interface IndexedDBSchema {
  cache_entries: CacheEntry;
  sync_queue: QueuedRequest;
  config: { key: string; value: any };
  metadata: { key: string; value: any };
}

// Re-export from main types to avoid circular dependencies
export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  url: string;
  method: string;
}

export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
  retryCount: number;
}