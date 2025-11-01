import { useState, useEffect, useCallback } from 'react';
import { offlyFetch, isOnline, onNetworkStatusChange } from './fetchWrapper.js';
import { UseOfflineDataResult, OfflineDataOptions } from '../types/index.js';

export function useOfflineData<T = any>(
  url: string,
  options: OfflineDataOptions = {}
): UseOfflineDataResult<T> {
  const [data, setData] = useState<T | null>(options.fallbackData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline());

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (loading) return; // Prevent concurrent requests

    setLoading(true);
    setError(null);

    try {
      const response = await offlyFetch(url, {
        method: 'GET',
        offly: options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // If we have fallback data and no cached data, use it
      if (options.fallbackData && !data) {
        setData(options.fallbackData);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, loading, data]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for network status changes
  useEffect(() => {
    const cleanup = onNetworkStatusChange((online) => {
      setIsOfflineMode(!online);
      
      // Refetch when coming back online
      if (online && !loading) {
        fetchData();
      }
    });

    return cleanup;
  }, [fetchData, loading]);

  // Listen for cache update events
  useEffect(() => {
    const handleCacheUpdate = (event: CustomEvent) => {
      const { url: updatedUrl, method } = event.detail;
      if (updatedUrl === url && method === 'GET') {
        // Data was updated, refetch
        fetchData();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('offly:cache-updated', handleCacheUpdate as EventListener);
      
      return () => {
        window.removeEventListener('offly:cache-updated', handleCacheUpdate as EventListener);
      };
    }
  }, [url, fetchData]);

  return {
    data,
    loading,
    error,
    isOffline: isOfflineMode,
    refetch: fetchData
  };
}

// Hook for posting data with offline support
export function useOfflinePost<T = any>(url: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(!isOnline());

  // Listen for network status changes
  useEffect(() => {
    const cleanup = onNetworkStatusChange((online) => {
      setIsOfflineMode(!online);
    });
    return cleanup;
  }, []);

  const post = useCallback(async (data: T, options?: OfflineDataOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await offlyFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        offly: options
      });

      const result = await response.json();
      
      if (response.status === 202) {
        // Request was queued for sync
        return {
          ...result,
          queued: true
        };
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [url]);

  return {
    post,
    loading,
    error,
    isOffline: isOfflineMode
  };
}

// Hook for sync queue status
export function useSyncStatus() {
  const [queueStatus, setQueueStatus] = useState({
    total: 0,
    pending: 0,
    failed: 0,
    syncing: false
  });

  useEffect(() => {
    const handleSyncProgress = (event: CustomEvent) => {
      const progress = event.detail;
      setQueueStatus({
        total: progress.total,
        pending: progress.total - progress.completed - progress.failed,
        failed: progress.failed,
        syncing: progress.inProgress
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('offly:sync-progress', handleSyncProgress as EventListener);
      
      return () => {
        window.removeEventListener('offly:sync-progress', handleSyncProgress as EventListener);
      };
    }
  }, []);

  return queueStatus;
}

// Hook for cache statistics
export function useCacheStats() {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalSize: 0,
    oldestEntry: 0,
    newestEntry: 0
  });

  const refreshStats = useCallback(async () => {
    try {
      // This would require importing cacheManager, but we'll keep it simple for now
      // In a real implementation, you'd expose a method to get stats
      const response = await offlyFetch('/offly/stats', { method: 'GET' });
      if (response.ok) {
        const cacheStats = await response.json();
        setStats(cacheStats);
      }
    } catch (error) {
      console.warn('Failed to fetch cache stats:', error);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return { stats, refreshStats };
}
