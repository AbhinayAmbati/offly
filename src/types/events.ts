// Event types for custom events and messaging
export interface OfflyEvent<T = any> {
  type: string;
  data?: T;
  timestamp: number;
}

export interface NetworkStatusEvent extends OfflyEvent {
  type: 'NETWORK_STATUS_CHANGED';
  data: {
    isOnline: boolean;
    effectiveType?: string;
  };
}

export interface SyncProgressEvent extends OfflyEvent {
  type: 'SYNC_PROGRESS';
  data: {
    total: number;
    completed: number;
    failed: number;
    inProgress: boolean;
  };
}

export interface CacheUpdateEvent extends OfflyEvent {
  type: 'CACHE_UPDATED';
  data: {
    url: string;
    method: string;
    cached: boolean;
  };
}

export type OfflyEventType = 
  | NetworkStatusEvent
  | SyncProgressEvent
  | CacheUpdateEvent;