// Core configuration types
export interface OfflyConfig {
  version: string;
  assets: AssetConfig;
  api: ApiConfig;
  sync: SyncConfig;
  debug: boolean;
}

export interface AssetConfig {
  patterns: string[];
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  maxAge: number; // in seconds
}

export interface ApiConfig {
  baseUrl: string;
  endpoints: ApiEndpoint[];
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  maxAge: number; // in seconds
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  cache: boolean;
  syncOnFailure: boolean;
}

export interface SyncConfig {
  enabled: boolean;
  maxRetries: number;
  retryDelay: number; // in milliseconds
}

// Runtime types
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

export interface OfflineDataOptions {
  fallbackData?: any;
  maxAge?: number;
  strategy?: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

// Hook types for React/Vue
export interface UseOfflineDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
  refetch: () => Promise<void>;
}

// Scan results
export interface ProjectScanResults {
  assets: string[];
  endpoints: ApiEndpoint[];
  apiBaseUrl: string | null;
  framework: 'react' | 'vue' | 'vanilla' | 'unknown';
}

// Service Worker types
export interface ServiceWorkerMessage {
  type: 'SYNC_REQUEST' | 'CACHE_UPDATE' | 'OFFLINE_STATUS';
  payload?: any;
}

export interface CacheStrategy {
  name: string;
  handler: (request: Request, event?: FetchEvent) => Promise<Response>;
}

// Export all types
export * from './events.js';
export * from './storage.js';