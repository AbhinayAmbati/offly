// Export runtime functionality
export { offlyFetch, isOnline, onNetworkStatusChange } from './runtime/fetchWrapper.js';
export { CacheManager } from './runtime/cacheManager.js';
export { SyncManager } from './runtime/syncManager.js';

// React hooks are exported separately in react.ts to avoid React dependency

// Export types
export type {
  OfflyConfig,
  AssetConfig,
  ApiConfig,
  ApiEndpoint,
  SyncConfig,
  CacheEntry,
  QueuedRequest,
  OfflineDataOptions,
  UseOfflineDataResult,
  ProjectScanResults,
  ServiceWorkerMessage,
  CacheStrategy
} from './types/index.js';

export type {
  OfflyEvent,
  NetworkStatusEvent,
  SyncProgressEvent,
  CacheUpdateEvent,
  OfflyEventType
} from './types/events.js';

export type {
  OfflyStorageConfig,
  StoreName,
  StorageAdapter,
  IndexedDBSchema
} from './types/storage.js';

// Default configuration
export const defaultConfig = {
  assets: {
    patterns: ['**/*.js', '**/*.css', '**/*.png', '**/*.jpg', '**/*.svg'],
    strategy: 'cache-first' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  api: {
    baseUrl: '/api',
    endpoints: [],
    strategy: 'network-first' as const,
    maxAge: 5 * 60, // 5 minutes
  },
  sync: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000,
  },
  debug: false,
};

// Utility functions
export function createOfflyConfig(overrides: Partial<typeof defaultConfig> = {}) {
  return {
    version: '0.1.0',
    ...defaultConfig,
    ...overrides,
    assets: {
      ...defaultConfig.assets,
      ...(overrides.assets || {})
    },
    api: {
      ...defaultConfig.api,
      ...(overrides.api || {})
    },
    sync: {
      ...defaultConfig.sync,
      ...(overrides.sync || {})
    }
  };
}

// Version info
export const version = '0.1.0';