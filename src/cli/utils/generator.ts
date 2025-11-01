import { OfflyConfig } from '../../types/index.js';

export async function generateServiceWorker(config: OfflyConfig): Promise<string> {
  return `
// Offly Service Worker - Generated automatically
const CACHE_NAME = 'offly-v${config.version}';
const API_CACHE_NAME = 'offly-api-v${config.version}';
const SYNC_QUEUE_NAME = 'offly-sync-queue';

// Assets to cache
const STATIC_ASSETS = ${JSON.stringify(config.assets.patterns, null, 2)};

// API endpoints configuration
const API_CONFIG = ${JSON.stringify(config.api, null, 2)};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Offly SW: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Offly SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(pattern => 
          pattern.startsWith('/') ? pattern : '/' + pattern
        ));
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Offly SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('Offly SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - handle requests based on strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests for caching (but still handle for sync)
  if (request.method !== 'GET') {
    return handleNonGetRequest(event);
  }
  
  // Handle API requests
  if (url.pathname.startsWith(API_CONFIG.baseUrl)) {
    return handleApiRequest(event);
  }
  
  // Handle static assets
  return handleStaticAsset(event);
});

// Handle static assets with cache-first strategy
function handleStaticAsset(event) {
  const strategy = '${config.assets.strategy}';
  
  if (strategy === 'cache-first') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseClone));
              }
              return response;
            });
        })
    );
  } else if (strategy === 'network-first') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
}

// Handle API requests with configurable strategy
function handleApiRequest(event) {
  const strategy = '${config.api.strategy}';
  
  if (strategy === 'network-first') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else if (strategy === 'cache-first') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response and update in background
            fetch(event.request)
              .then((response) => {
                if (response.ok) {
                  const responseClone = response.clone();
                  caches.open(API_CACHE_NAME)
                    .then((cache) => cache.put(event.request, responseClone));
                }
              })
              .catch(() => {});
            return cachedResponse;
          }
          return fetch(event.request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(API_CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseClone));
              }
              return response;
            });
        })
    );
  }
}

// Handle non-GET requests - queue for background sync
function handleNonGetRequest(event) {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Queue request for background sync
        return queueRequestForSync(event.request)
          .then(() => {
            return new Response(
              JSON.stringify({ 
                success: false, 
                queued: true,
                message: 'Request queued for sync when online' 
              }),
              { 
                status: 202,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
      })
  );
}

// Queue failed requests for background sync
async function queueRequestForSync(request) {
  try {
    const body = await request.text();
    const queuedRequest = {
      id: Date.now() + '-' + Math.random(),
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    // Store in IndexedDB (simplified for SW context)
    console.log('Offly SW: Queuing request for sync:', queuedRequest);
    
    // Register background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      self.registration.sync.register('offly-background-sync');
    }
    
    return true;
  } catch (error) {
    console.error('Offly SW: Failed to queue request:', error);
    return false;
  }
}

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'offly-background-sync') {
    console.log('Offly SW: Background sync triggered');
    event.waitUntil(syncQueuedRequests());
  }
});

// Sync queued requests
async function syncQueuedRequests() {
  try {
    // This would normally retrieve from IndexedDB and replay requests
    console.log('Offly SW: Syncing queued requests...');
    
    // Notify main thread about sync progress
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_PROGRESS',
        payload: { inProgress: true }
      });
    });
    
    // TODO: Implement actual sync logic with IndexedDB
    
    return true;
  } catch (error) {
    console.error('Offly SW: Sync failed:', error);
    return false;
  }
}

console.log('Offly Service Worker loaded');
`.trim();
}
