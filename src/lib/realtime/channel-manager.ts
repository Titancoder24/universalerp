/**
 * Realtime channel manager.
 *
 * Two-tier subscription model:
 *   - One always-on lightweight channel per user (presence + notifications)
 *   - One heavy channel per active record (chat thread, kanban board, etc.)
 *
 * This keeps connection counts manageable in large tenants.
 */

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

type ChannelKind = 'presence' | 'notifications' | 'chat' | 'record';

interface ChannelHandle {
  channel: RealtimeChannel;
  refs: number;
  kind: ChannelKind;
}

class ChannelManager {
  private channels = new Map<string, ChannelHandle>();
  private supabase = getSupabaseBrowserClient();

  /**
   * Subscribe to a channel. Returns an unsubscribe function.
   * Multiple subscribers to the same channel share the underlying connection.
   */
  subscribe<T = any>(
    name: string,
    kind: ChannelKind,
    handlers: {
      onMessage?: (payload: T) => void;
      onInsert?: (row: T) => void;
      onUpdate?: (row: T) => void;
      onDelete?: (row: T) => void;
      onPresenceSync?: (presence: Record<string, any>) => void;
      onPresenceJoin?: (key: string, payload: any) => void;
      onPresenceLeave?: (key: string, payload: any) => void;
    } = {},
    config?: {
      table?: string;
      filter?: string;
      schema?: string;
    },
  ): () => void {
    let handle = this.channels.get(name);

    if (!handle) {
      const channel = this.supabase.channel(name);

      if (config?.table) {
        channel.on(
          'postgres_changes' as any,
          {
            event: 'INSERT',
            schema: config.schema ?? 'public',
            table: config.table,
            filter: config.filter,
          },
          (payload: any) => handlers.onInsert?.(payload.new as T),
        );
        channel.on(
          'postgres_changes' as any,
          {
            event: 'UPDATE',
            schema: config.schema ?? 'public',
            table: config.table,
            filter: config.filter,
          },
          (payload: any) => handlers.onUpdate?.(payload.new as T),
        );
        channel.on(
          'postgres_changes' as any,
          {
            event: 'DELETE',
            schema: config.schema ?? 'public',
            table: config.table,
            filter: config.filter,
          },
          (payload: any) => handlers.onDelete?.(payload.old as T),
        );
      }

      if (handlers.onPresenceSync) {
        channel.on('presence', { event: 'sync' }, () => {
          handlers.onPresenceSync?.(channel.presenceState());
        });
      }
      if (handlers.onPresenceJoin) {
        channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
          handlers.onPresenceJoin?.(key, newPresences);
        });
      }
      if (handlers.onPresenceLeave) {
        channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          handlers.onPresenceLeave?.(key, leftPresences);
        });
      }

      if (handlers.onMessage) {
        channel.on('broadcast', { event: 'message' }, (payload: any) => {
          handlers.onMessage?.(payload.payload as T);
        });
      }

      channel.subscribe();
      handle = { channel, refs: 0, kind };
      this.channels.set(name, handle);
    }

    handle.refs++;

    return () => {
      const current = this.channels.get(name);
      if (!current) return;
      current.refs--;
      if (current.refs <= 0) {
        this.supabase.removeChannel(current.channel);
        this.channels.delete(name);
      }
    };
  }

  /**
   * Broadcast a message to a channel.
   */
  broadcast<T>(channelName: string, payload: T) {
    const handle = this.channels.get(channelName);
    if (!handle) return;
    handle.channel.send({ type: 'broadcast', event: 'message', payload });
  }

  /**
   * Track presence on a channel.
   */
  async track(channelName: string, state: Record<string, any>) {
    const handle = this.channels.get(channelName);
    if (!handle) return;
    await handle.channel.track(state);
  }

  /**
   * Get all active channels (debug helper).
   */
  getActiveChannels(): Array<{ name: string; kind: ChannelKind; refs: number }> {
    return Array.from(this.channels.entries()).map(([name, h]) => ({
      name,
      kind: h.kind,
      refs: h.refs,
    }));
  }

  /**
   * Tear down everything (sign out).
   */
  reset() {
    for (const [name, handle] of this.channels.entries()) {
      this.supabase.removeChannel(handle.channel);
    }
    this.channels.clear();
  }
}

let manager: ChannelManager | null = null;

export function getChannelManager(): ChannelManager {
  if (!manager) manager = new ChannelManager();
  return manager;
}
