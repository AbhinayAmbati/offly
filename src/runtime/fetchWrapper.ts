import { CacheManager } from './cacheManager.js';
import { SyncManager } from './syncManager.js';
import { OfflineDataOptions } from '../types/index.js';

// Global instances
let cacheManager: CacheManager;
let syncManager: SyncManager;

// Initialize managers
async function initializeOffly() {
  if (!cacheManager) {
    cacheManager = new CacheManager();
    await cacheManager.init();
  }
  
  if (!syncManager) {
    syncManager = new SyncManager(cacheManager);
    await syncManager.init();
  }
}

// Enhanced fetch wrapper with caching and sync
export async function offlyFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { offly?: OfflineDataOptions }
): Promise<Response> {
  await initializeOffly();

  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const method = init?.method || 'GET';
  const options = init?.offly || {};

  // For GET requests, try cache first or network first based on strategy
  if (method.toUpperCase() === 'GET') {
    return handleGetRequest(url, init, options);
  }

  // For non-GET requests, try network first, then queue for sync if failed
  return handleNonGetRequest(url, init, options);
}

async function handleGetRequest(
  url: string, 
  init?: RequestInit, 
  options?: OfflineDataOptions
): Promise<Response> {
  const strategy = options?.strategy || 'network-first';
  const maxAge = options?.maxAge || 300; // 5 minutes default

  try {
    if (strategy === 'cache-first') {
      // Try cache first
      const cached = await cacheManager.get(url, 'GET');
      if (cached && !isExpired(cached, maxAge)) {
        return createResponse(cached.data);
      }
    }

    // Try network
    const response = await fetch(url, init);
    
    if (response.ok) {
      const data = await response.clone().json();
      await cacheManager.set(url, 'GET', data, maxAge);
      return response;
    }
    
    // Network failed, try cache as fallback
    const cached = await cacheManager.get(url, 'GET');
    if (cached) {
      return createResponse(cached.data);
    }
    
    return response;

  } catch (error) {
    // Network error, try cache
    const cached = await cacheManager.get(url, 'GET');
    if (cached) {
      return createResponse(cached.data);
    }
    
    // Return fallback data if provided
    if (options?.fallbackData) {
      return createResponse(options.fallbackData);
    }
    
    throw error;
  }
}

async function handleNonGetRequest(
  url: string,
  init?: RequestInit,
  _options?: OfflineDataOptions
): Promise<Response> {
  const method = init?.method || 'POST';

  try {
    // Try network first
    const response = await fetch(url, init);
    return response;
  } catch (error) {
    // Network failed, queue for background sync
    const requestId = await syncManager.queueRequest({
      url,
      method,
      headers: init?.headers ? Object.fromEntries(
        new Headers(init.headers).entries()
      ) : {},
      body: init?.body,
      timestamp: Date.now(),
      retryCount: 0
    });

    // Return a response indicating the request was queued
    return createResponse({
      success: false,
      queued: true,
      requestId,
      message: 'Request queued for sync when online'
    }, 202);
  }
}

// Utility functions
function isExpired(cached: any, maxAge: number): boolean {
  return Date.now() - cached.timestamp > maxAge * 1000;
}

function createResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}



// Network status detection
export function isOnline(): boolean {
  return navigator.onLine;
}

// Event listeners for network status
export function onNetworkStatusChange(callback: (isOnline: boolean) => void): () => void {
  const handler = () => callback(navigator.onLine);
  
  window.addEventListener('online', handler);
  window.addEventListener('offline', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handler);
    window.removeEventListener('offline', handler);
  };
}

// Export managers for advanced usage
export { cacheManager, syncManager };