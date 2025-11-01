import Dexie, { Table } from 'dexie';
import { QueuedRequest } from '../types/index.js';
import { CacheManager } from './cacheManager.js';

export class SyncManager extends Dexie {
  sync_queue!: Table<QueuedRequest>;
  private isOnline = true;
  private syncInProgress = false;

  constructor(_cacheManager: CacheManager) {
    super('OfflySyncDB');
    
    this.version(1).stores({
      sync_queue: 'id, timestamp, retryCount, url, method'
    });

    // Listen for network status changes
    this.setupNetworkListeners();
  }

  async init(): Promise<void> {
    try {
      await this.open();
      console.log('Offly: Sync manager initialized');
      
      // Check for queued requests on init
      this.processQueue();
    } catch (error) {
      console.error('Offly: Failed to initialize sync manager:', error);
      throw error;
    }
  }

  // Queue a failed request for background sync
  async queueRequest(request: Omit<QueuedRequest, 'id'>): Promise<string> {
    const id = this.generateId();
    const queuedRequest: QueuedRequest = {
      ...request,
      id,
      timestamp: Date.now(),
      retryCount: 0
    };

    try {
      await this.sync_queue.add(queuedRequest);
      console.log('Offly: Request queued for sync:', id);
      
      // Try to process immediately if online
      if (this.isOnline && !this.syncInProgress) {
        this.processQueue();
      }
      
      return id;
    } catch (error) {
      console.error('Offly: Failed to queue request:', error);
      throw error;
    }
  }

  // Process the sync queue
  async processQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    console.log('Offly: Processing sync queue...');

    try {
      const queuedRequests = await this.sync_queue
        .orderBy('timestamp')
        .toArray();

      if (queuedRequests.length === 0) {
        this.syncInProgress = false;
        return;
      }

      console.log(`Offly: Found ${queuedRequests.length} requests to sync`);

      let processed = 0;
      let failed = 0;

      for (const request of queuedRequests) {
        try {
          const success = await this.syncRequest(request);
          if (success) {
            await this.sync_queue.delete(request.id);
            processed++;
            console.log(`Offly: Successfully synced request ${request.id}`);
          } else {
            // Increment retry count
            const updatedRequest = {
              ...request,
              retryCount: request.retryCount + 1
            };

            // Remove if max retries reached
            if (updatedRequest.retryCount >= 3) {
              await this.sync_queue.delete(request.id);
              failed++;
              console.log(`Offly: Request ${request.id} failed after max retries`);
            } else {
              await this.sync_queue.put(updatedRequest);
              console.log(`Offly: Request ${request.id} failed, retry ${updatedRequest.retryCount}/3`);
            }
          }
        } catch (error) {
          console.error(`Offly: Error syncing request ${request.id}:`, error);
          failed++;
        }

        // Add delay between requests to avoid overwhelming server
        await this.delay(100);
      }

      console.log(`Offly: Sync completed - ${processed} processed, ${failed} failed`);
      
      // Emit sync progress event
      this.emitSyncProgress({
        total: queuedRequests.length,
        completed: processed,
        failed,
        inProgress: false
      });

    } catch (error) {
      console.error('Offly: Error processing sync queue:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync individual request
  private async syncRequest(request: QueuedRequest): Promise<boolean> {
    try {
      const init: RequestInit = {
        method: request.method,
        headers: request.headers,
        body: request.body
      };

      const response = await fetch(request.url, init);
      
      // Consider 2xx responses as successful
      return response.ok;
      
    } catch (error) {
      console.error(`Offly: Failed to sync request ${request.id}:`, error);
      return false;
    }
  }

  // Get queue status
  async getQueueStatus(): Promise<{
    total: number;
    pending: number;
    failed: number;
    oldest?: number;
  }> {
    try {
      const requests = await this.sync_queue.toArray();
      const pending = requests.filter(r => r.retryCount < 3);
      const failed = requests.filter(r => r.retryCount >= 3);
      const oldest = requests.length > 0 ? Math.min(...requests.map(r => r.timestamp)) : undefined;

      return {
        total: requests.length,
        pending: pending.length,
        failed: failed.length,
        oldest
      };
    } catch (error) {
      console.error('Offly: Failed to get queue status:', error);
      return {
        total: 0,
        pending: 0,
        failed: 0
      };
    }
  }

  // Clear sync queue
  async clearQueue(): Promise<void> {
    try {
      await this.sync_queue.clear();
      console.log('Offly: Sync queue cleared');
    } catch (error) {
      console.error('Offly: Failed to clear sync queue:', error);
    }
  }

  // Remove specific request from queue
  async removeRequest(id: string): Promise<void> {
    try {
      await this.sync_queue.delete(id);
      console.log(`Offly: Removed request ${id} from queue`);
    } catch (error) {
      console.error(`Offly: Failed to remove request ${id}:`, error);
    }
  }

  // Setup network event listeners
  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;

      window.addEventListener('online', () => {
        console.log('Offly: Network came online');
        this.isOnline = true;
        // Process queue when network comes back
        setTimeout(() => this.processQueue(), 1000);
      });

      window.addEventListener('offline', () => {
        console.log('Offly: Network went offline');
        this.isOnline = false;
      });
    }
  }

  // Utility functions
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private emitSyncProgress(progress: {
    total: number;
    completed: number;
    failed: number;
    inProgress: boolean;
  }): void {
    // Emit custom event for progress tracking
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('Offly:sync-progress', {
        detail: progress
      });
      window.dispatchEvent(event);
    }
  }

  // Force sync - manually trigger queue processing
  public forcSync(): Promise<void> {
    return this.processQueue();
  }
}
