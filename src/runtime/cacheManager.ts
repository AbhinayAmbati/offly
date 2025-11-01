import Dexie, { Table } from 'dexie';
import { CacheEntry } from '../types/index.js';

export class CacheManager extends Dexie {
  cache_entries!: Table<CacheEntry>;
  config!: Table<{ key: string; value: any }>;
  metadata!: Table<{ key: string; value: any }>;

  constructor() {
    super('OfflyDB');
    
    this.version(1).stores({
      cache_entries: 'url, method, timestamp, expiresAt',
      config: 'key',
      metadata: 'key'
    });
  }

  async init(): Promise<void> {
    try {
      await this.open();
      console.log('Offly: Cache manager initialized');
    } catch (error) {
      console.error('Offly: Failed to initialize cache manager:', error);
      throw error;
    }
  }

  // Cache data with expiration
  async set(url: string, method: string, data: any, maxAge: number = 300): Promise<void> {
    const now = Date.now();
    const entry: CacheEntry = {
      url: this.normalizeUrl(url),
      method: method.toUpperCase(),
      data,
      timestamp: now,
      expiresAt: now + (maxAge * 1000)
    };

    try {
      await this.cache_entries.put(entry);
    } catch (error) {
      console.error('Offly: Failed to cache data:', error);
    }
  }

  // Retrieve cached data
  async get(url: string, method: string): Promise<CacheEntry | null> {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      const entry = await this.cache_entries
        .where(['url', 'method'])
        .equals([normalizedUrl, method.toUpperCase()])
        .first();

      if (!entry) {
        return null;
      }

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        await this.deleteEntry(url, method);
        return null;
      }

      return entry;
    } catch (error) {
      console.error('Offly: Failed to retrieve cached data:', error);
      return null;
    }
  }

  // Delete cached data
  async deleteEntry(url: string, method: string): Promise<void> {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      await this.cache_entries
        .where(['url', 'method'])
        .equals([normalizedUrl, method.toUpperCase()])
        .delete();
    } catch (error) {
      console.error('Offly: Failed to delete cached data:', error);
    }
  }

  // Clear all cached data
  async clear(): Promise<void> {
    try {
      await this.cache_entries.clear();
    } catch (error) {
      console.error('Offly: Failed to clear cache:', error);
    }
  }

  // Get cache statistics
  async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    oldestEntry: number;
    newestEntry: number;
  }> {
    try {
      const entries = await this.cache_entries.toArray();
      
      if (entries.length === 0) {
        return {
          totalEntries: 0,
          totalSize: 0,
          oldestEntry: 0,
          newestEntry: 0
        };
      }

      const timestamps = entries.map(e => e.timestamp);
      const totalSize = entries.reduce((acc, entry) => {
        return acc + JSON.stringify(entry.data).length;
      }, 0);

      return {
        totalEntries: entries.length,
        totalSize,
        oldestEntry: Math.min(...timestamps),
        newestEntry: Math.max(...timestamps)
      };
    } catch (error) {
      console.error('Offly: Failed to get cache stats:', error);
      return {
        totalEntries: 0,
        totalSize: 0,
        oldestEntry: 0,
        newestEntry: 0
      };
    }
  }

  // Cleanup expired entries
  async cleanup(): Promise<number> {
    try {
      const now = Date.now();
      const deletedCount = await this.cache_entries
        .where('expiresAt')
        .below(now)
        .delete();
      
      console.log(`Offly: Cleaned up ${deletedCount} expired entries`);
      return deletedCount;
    } catch (error) {
      console.error('Offly: Failed to cleanup expired entries:', error);
      return 0;
    }
  }

  // Set configuration
  async setConfig(key: string, value: any): Promise<void> {
    try {
      await this.config.put({ key, value });
    } catch (error) {
      console.error('Offly: Failed to set config:', error);
    }
  }

  // Get configuration
  async getConfig(key: string): Promise<any> {
    try {
      const config = await this.config.get(key);
      return config?.value;
    } catch (error) {
      console.error('Offly: Failed to get config:', error);
      return null;
    }
  }

  // Normalize URL for consistent caching
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin);
      // Remove hash and search params for caching consistency (optional)
      return urlObj.origin + urlObj.pathname;
    } catch {
      return url;
    }
  }

  // Export cache data
  async export(): Promise<{ entries: CacheEntry[]; config: any; metadata: any }> {
    try {
      const [entries, configData, metadataData] = await Promise.all([
        this.cache_entries.toArray(),
        this.config.toArray(),
        this.metadata.toArray()
      ]);

      return {
        entries,
        config: Object.fromEntries(configData.map(c => [c.key, c.value])),
        metadata: Object.fromEntries(metadataData.map(m => [m.key, m.value]))
      };
    } catch (error) {
      console.error('Offly: Failed to export cache:', error);
      throw error;
    }
  }
}
