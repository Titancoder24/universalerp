'use client';

import { formatCurrency } from '@/lib/utils';

const buckets = [
  { label: 'Current', value: 184250, count: 47, tone: 'bg-success' },
  { label: '1-30 days', value: 92480, count: 28, tone: 'bg-info' },
  { label: '31-60 days', value: 41320, count: 14, tone: 'bg-warning' },
  { label: '61-90 days', value: 18950, count: 6, tone: 'bg-warning/80' },
  { label: '90+ days', value: 12440, count: 4, tone: 'bg-destructive' },
];

export function ArAging() {
  const total = buckets.reduce((acc, b) => acc + b.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-semibold tabular-nums">{formatCurrency(total, 'USD')}</span>
        <span className="text-xs text-muted-foreground">Total outstanding</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {buckets.map((b) => (
          <div key={b.label} className={b.tone} style={{ width: `${(b.value / total) * 100}%` }} />
        ))}
      </div>
      <div className="space-y-2">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${b.tone}`} />
              <span className="font-medium">{b.label}</span>
              <span className="text-muted-foreground">({b.count})</span>
            </div>
            <span className="font-mono tabular-nums">{formatCurrency(b.value, 'USD')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
