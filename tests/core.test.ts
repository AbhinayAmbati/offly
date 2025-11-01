import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isOnline } from '../src/runtime/fetchWrapper';

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    onLine: true
  },
  writable: true
});

// Mock window
Object.defineProperty(global, 'window', {
  value: {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    location: {
      origin: 'http://localhost:3000'
    }
  },
  writable: true
});

describe('Offly Core Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isOnline', () => {
    it('should return true when navigator.onLine is true', () => {
      (navigator as any).onLine = true;
      expect(isOnline()).toBe(true);
    });

    it('should return false when navigator.onLine is false', () => {
      (navigator as any).onLine = false;
      expect(isOnline()).toBe(false);
    });
  });

  describe('Configuration', () => {
    it('should create default config', async () => {
      const { createOfflyConfig } = await import('../src/index');
      
      const config = createOfflyConfig();
      expect(config.version).toBe('0.1.0');
      expect(config.assets.strategy).toBe('cache-first');
      expect(config.api.strategy).toBe('network-first');
      expect(config.sync.enabled).toBe(true);
    });

    it('should allow config overrides', async () => {
      const { createOfflyConfig } = await import('../src/index');
      
      const config = createOfflyConfig({
        debug: true,
        assets: {
          strategy: 'network-first' as const,
          patterns: ['custom/*.js'],
          maxAge: 3600
        }
      });

      expect(config.debug).toBe(true);
      expect(config.assets.strategy).toBe('network-first');
      expect(config.assets.patterns).toEqual(['custom/*.js']);
    });
  });
});
