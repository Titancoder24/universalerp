'use client';

import * as React from 'react';
import { getChannelManager } from './channel-manager';

/**
 * Subscribe to changes on a Postgres table and keep a local list in sync.
 *
 * Usage:
 *   const { rows, isLoading } = useRealtimeTable<Invoice>('invoices', {
 *     filter: `tenant_id=eq.${tenantId}`,
 *     initialQuery: (supabase) => supabase.from('invoices').select('*').limit(50),
 *   });
 */
export function useRealtimeTable<T extends { id: string }>(
  table: string,
  options: {
    filter?: string;
    initialQuery?: () => Promise<{ data: T[] | null; error: any }>;
    onChange?: (row: T, type: 'INSERT' | 'UPDATE' | 'DELETE') => void;
  } = {},
) {
  const [rows, setRows] = React.useState<T[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      if (!options.initialQuery) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await options.initialQuery();
        if (cancelled) return;
        if (error) setError(error.message ?? 'Failed to load');
        if (data) setRows(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadInitial();
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    const channelName = `table:${table}${options.filter ? `:${options.filter}` : ''}`;
    const manager = getChannelManager();

    const unsubscribe = manager.subscribe<T>(
      channelName,
      'record',
      {
        onInsert: (row) => {
          setRows((prev) => [row, ...prev]);
          options.onChange?.(row, 'INSERT');
        },
        onUpdate: (row) => {
          setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)));
          options.onChange?.(row, 'UPDATE');
        },
        onDelete: (row) => {
          setRows((prev) => prev.filter((r) => r.id !== row.id));
          options.onChange?.(row, 'DELETE');
        },
      },
      { table, filter: options.filter },
    );

    return unsubscribe;
  }, [table, options.filter]);

  return { rows, isLoading, error, setRows };
}
