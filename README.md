# 🚀 Offly

> A lightweight plugin that makes any web app offline-first automatically.

[![npm version](https://badge.fury.io/js/offly.svg)](https://www.npmjs.com/package/offly)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Offly is a developer tool that transforms any web application (React, Vue, Next.js, Astro, Svelte, or Vanilla JS) into an offline-first app automatically — without developers writing or managing service workers, caching logic, or sync systems manually.

## ✨ Features

- 🗂️ **Automatic Asset Caching** - Detects and caches static assets (.js, .css, .png, etc.)
- 💾 **Offline Data Persistence** - Wraps fetch() calls with IndexedDB storage
- 🔄 **Background Sync** - Queues failed requests and replays them when online
- ⚡ **Simple React/Vue Hooks** - Use `useOfflineData()` for effortless offline data
- 🧰 **CLI Tools** - `Offly init` and `Offly build` commands
- 🌐 **Service Worker Generation** - Pre-configured service worker with caching strategies
- 📦 **Zero Configuration** - Works out of the box with sensible defaults

## 🚀 Quick Start

### Installation

```bash
npm install Offly
```

### Initialize Offly

```bash
npx Offly init
```

This command:
- Scans your project for assets and API calls
- Generates `Offly-sw.js` (service worker)
- Creates `.Offlyrc.json` (configuration)
- Creates `Offly-register.js` (registration script)

### Include in your HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Offline App</title>
  </head>
  <body>
    <div id="root"></div>
    
    <!-- Add this script -->
    <script src="/Offly-register.js"></script>
  </body>
</html>
```

### Build for production

```bash
npx Offly build
```

This automatically injects service worker registration into your built HTML files.

## 📖 Usage

### Basic Fetch Wrapper

Replace your fetch calls with `OfflyFetch` for automatic offline support:

```typescript
import { OfflyFetch } from 'Offly';

// Network-first strategy (default for API calls)
const response = await OfflyFetch('/api/todos', {
  Offly: {
    strategy: 'network-first',
    maxAge: 300 // 5 minutes
  }
});

// Cache-first strategy (great for assets)
const response = await OfflyFetch('/api/user/profile', {
  Offly: {
    strategy: 'cache-first',
    fallbackData: { name: 'Unknown User' }
  }
});
```

### React Hooks

```typescript
import { useOfflineData, useOfflinePost } from 'Offly/react';

function TodoList() {
  // Automatically handles offline/online states
  const { data: todos, loading, error, isOffline } = useOfflineData('/api/todos', {
    fallbackData: [],
    strategy: 'network-first'
  });

  const { post: addTodo, loading: adding } = useOfflinePost('/api/todos');

  const handleAddTodo = async (title: string) => {
    try {
      const result = await addTodo({ title, completed: false });
      
      if (result.queued) {
        alert('Todo will be saved when you\'re back online!');
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {isOffline && <div className="offline-banner">🔴 Offline Mode</div>}
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Advanced Configuration

Create a custom configuration:

```typescript
import { createOfflyConfig } from 'Offly';

const config = createOfflyConfig({
  assets: {
    patterns: ['**/*.js', '**/*.css', '**/*.woff2'],
    strategy: 'cache-first',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  api: {
    baseUrl: '/api',
    strategy: 'network-first',
    maxAge: 10 * 60 // 10 minutes
  },
  sync: {
    enabled: true,
    maxRetries: 5,
    retryDelay: 2000
  },
  debug: true
});
```

## 🧰 CLI Commands

### `Offly init`

Initializes Offly in your project.

```bash
npx Offly init [options]
```

**Options:**
- `-d, --dir <directory>` - Target directory (default: current directory)
- `--skip-install` - Skip automatic dependency installation

**What it does:**
1. Scans your project for static assets and API endpoints
2. Generates `Offly-sw.js` service worker
3. Creates `.Offlyrc.json` configuration file
4. Creates `Offly-register.js` registration script

### `Offly build`

Builds your project with offline support.

```bash
npx Offly build [options]
```

**Options:**
- `-d, --dir <directory>` - Build directory (default: dist)
- `-c, --config <file>` - Config file path (default: .Offlyrc.json)

**What it does:**
1. Copies service worker to build directory
2. Injects service worker registration into HTML files
3. Generates cache manifest with asset list

## ⚙️ Configuration

Offly uses `.Offlyrc.json` for configuration:

```json
{
  "version": "0.1.0",
  "assets": {
    "patterns": ["**/*.js", "**/*.css", "**/*.png"],
    "strategy": "cache-first",
    "maxAge": 2592000
  },
  "api": {
    "baseUrl": "/api",
    "endpoints": [
      {
        "path": "/api/todos",
        "method": "GET",
        "cache": true,
        "syncOnFailure": false
      }
    ],
    "strategy": "network-first",
    "maxAge": 300
  },
  "sync": {
    "enabled": true,
    "maxRetries": 3,
    "retryDelay": 1000
  },
  "debug": false
}
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `assets.patterns` | `string[]` | Glob patterns for assets to cache |
| `assets.strategy` | `'cache-first' \| 'network-first'` | Caching strategy for assets |
| `assets.maxAge` | `number` | Cache duration in seconds |
| `api.baseUrl` | `string` | Base URL for API endpoints |
| `api.strategy` | `'cache-first' \| 'network-first'` | Caching strategy for API calls |
| `api.maxAge` | `number` | Cache duration for API responses |
| `sync.enabled` | `boolean` | Enable background sync |
| `sync.maxRetries` | `number` | Max retry attempts for failed requests |
| `sync.retryDelay` | `number` | Delay between retries (ms) |

## 🎯 Caching Strategies

### Cache-First
1. Check cache first
2. Return cached data if available and not expired
3. Fetch from network if cache miss
4. Update cache with fresh data

**Best for:** Static assets, user profiles, settings

### Network-First
1. Try network request first
2. Return network data and update cache
3. Fallback to cache if network fails
4. Return cached data if available

**Best for:** Dynamic data, API responses, real-time content

### Stale-While-Revalidate
1. Return cached data immediately if available
2. Fetch fresh data in background
3. Update cache with fresh data for next request

**Best for:** Content that changes occasionally but needs fast loading

## 🔄 Background Sync

Offly automatically queues failed POST/PUT/PATCH/DELETE requests and replays them when the network returns:

```typescript
import { useSyncStatus } from 'Offly/react';

function SyncStatus() {
  const { total, pending, failed, syncing } = useSyncStatus();
  
  return (
    <div>
      {syncing && <span>🔄 Syncing...</span>}
      {pending > 0 && <span>📤 {pending} pending</span>}
      {failed > 0 && <span>❌ {failed} failed</span>}
    </div>
  );
}
```

## 🛠️ API Reference

### Core Functions

#### `OfflyFetch(url, options)`

Enhanced fetch with offline support.

```typescript
OfflyFetch(url: string | URL | Request, options?: RequestInit & {
  Offly?: {
    strategy?: 'cache-first' | 'network-first';
    maxAge?: number;
    fallbackData?: any;
  }
}): Promise<Response>
```

#### `isOnline()`

Check network status.

```typescript
isOnline(): boolean
```

#### `onNetworkStatusChange(callback)`

Listen for network status changes.

```typescript
onNetworkStatusChange(callback: (isOnline: boolean) => void): () => void
```

### React Hooks

#### `useOfflineData(url, options)`

Fetch data with offline support.

```typescript
useOfflineData<T>(url: string, options?: {
  fallbackData?: T;
  maxAge?: number;
  strategy?: 'cache-first' | 'network-first';
}): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
  refetch: () => Promise<void>;
}
```

#### `useOfflinePost(url)`

Post data with offline queueing.

```typescript
useOfflinePost<T>(url: string): {
  post: (data: T) => Promise<any>;
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
}
```

### Cache Management

#### `CacheManager`

Direct cache manipulation.

```typescript
const cacheManager = new CacheManager();
await cacheManager.init();

// Store data
await cacheManager.set('/api/todos', 'GET', todos, 300);

// Retrieve data
const cached = await cacheManager.get('/api/todos', 'GET');

// Delete data
await cacheManager.deleteEntry('/api/todos', 'GET');

// Get statistics
const stats = await cacheManager.getStats();
```

## 🎨 Framework Integration

### React

```typescript
// Install React types
npm install --save-dev @types/react

// Use hooks
import { useOfflineData } from 'Offly/react';
```

### Vue 3 (Composition API)

```typescript
// Create a composable
import { ref, onMounted } from 'vue';
import { OfflyFetch, onNetworkStatusChange } from 'Offly';

export function useOfflineData(url: string) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const isOffline = ref(!navigator.onLine);

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await OfflyFetch(url);
      data.value = await response.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
    
    const cleanup = onNetworkStatusChange((online) => {
      isOffline.value = !online;
      if (online) fetchData();
    });

    return cleanup;
  });

  return { data, loading, error, isOffline, refetch: fetchData };
}
```

### Next.js

```typescript
// pages/_app.tsx
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/Offly-sw.js');
    }
  }, []);

  return <Component {...pageProps} />;
}
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <script type="module">
    import { OfflyFetch, isOnline } from './node_modules/Offly/dist/index.mjs';
    
    // Use OfflyFetch instead of fetch
    async function loadData() {
      try {
        const response = await OfflyFetch('/api/data');
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    }
    
    // Check online status
    console.log('Online:', isOnline());
  </script>
</body>
</html>
```

## 🚀 Examples

### Todo App with Offline Support

```typescript
import React, { useState } from 'react';
import { useOfflineData, useOfflinePost, useSyncStatus } from 'Offly/react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoApp() {
  const [newTodo, setNewTodo] = useState('');
  
  const { data: todos, loading, error, isOffline, refetch } = useOfflineData<Todo[]>('/api/todos', {
    fallbackData: []
  });
  
  const { post: addTodo, loading: adding } = useOfflinePost<Omit<Todo, 'id'>>('/api/todos');
  const syncStatus = useSyncStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const result = await addTodo({
        title: newTodo,
        completed: false
      });

      if (result.queued) {
        alert('Todo will be saved when back online!');
      }

      setNewTodo('');
      refetch();
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <div className="todo-app">
      <header>
        <h1>📝 Offline Todo App</h1>
        <div className="status">
          {isOffline ? '🔴 Offline' : '🌐 Online'}
          {syncStatus.pending > 0 && ` • ${syncStatus.pending} pending`}
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a todo..."
          disabled={adding}
        />
        <button type="submit" disabled={adding}>
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {loading && <p>Loading todos...</p>}
      {error && <p>Error: {error.message}</p>}

      <ul className="todo-list">
        {todos?.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🛠 Troubleshooting

### Service Worker Not Registering

Make sure the service worker file is served from the same origin:

```html
<!-- ✅ Correct -->
<script>
  navigator.serviceWorker.register('/Offly-sw.js');
</script>

<!-- ❌ Wrong -->
<script>
  navigator.serviceWorker.register('https://cdn.example.com/Offly-sw.js');
</script>
```

### Cache Not Working

1. Check if service worker is active in DevTools → Application → Service Workers
2. Verify cache entries in DevTools → Application → Cache Storage
3. Enable debug mode in `.Offlyrc.json`:

```json
{
  "debug": true
}
```

### TypeScript Errors

Install the necessary type packages:

```bash
# For React
npm install --save-dev @types/react

# For DOM types
npm install --save-dev @types/web
```

### Build Issues

Ensure your build tool serves the service worker file:

```javascript
// Vite
export default {
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        sw: 'Offly-sw.js'
      }
    }
  }
}

// Webpack
module.exports = {
  entry: {
    main: './src/index.js',
    sw: './Offly-sw.js'
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Workbox](https://developers.google.com/web/tools/workbox) for service worker utilities
- [Dexie.js](https://dexie.org/) for IndexedDB wrapper
- [Commander.js](https://github.com/tj/commander.js/) for CLI interface

## 📚 Learn More

- [Service Workers MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Cache API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Background Sync](https://developers.google.com/web/updates/2015/12/background-sync)
- [Progressive Web Apps](https://web.dev/progressive-web-apps/)

---

**Made with ❤️ by developers, for developers who want offline-first apps without the complexity.**
