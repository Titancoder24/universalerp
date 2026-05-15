'use client';

import { MoreHorizontal, User } from 'lucide-react';
import { formatCompactNumber } from '@/lib/utils';

const stages = [
  {
    name: 'Discovery',
    color: 'bg-info/15 text-info',
    total: 285000,
    count: 8,
    deals: [
      { name: 'TechCorp - Phase 2', value: 45000, owner: 'JD', days: 3 },
      { name: 'Acme Renewal', value: 89000, owner: 'SS', days: 7 },
      { name: 'StartupCo Expansion', value: 24000, owner: 'JD', days: 1 },
    ],
  },
  {
    name: 'Qualification',
    color: 'bg-warning/15 text-warning',
    total: 412000,
    count: 6,
    deals: [
      { name: 'Enterprise Deal', value: 245000, owner: 'MR', days: 14 },
      { name: 'Global Mfg', value: 89000, owner: 'SS', days: 5 },
      { name: 'Regional Bank', value: 78000, owner: 'JD', days: 9 },
    ],
  },
  {
    name: 'Proposal',
    color: 'bg-primary/15 text-primary',
    total: 312000,
    count: 5,
    deals: [
      { name: 'Hospital Group', value: 180000, owner: 'MR', days: 21 },
      { name: 'Retail Chain', value: 132000, owner: 'SS', days: 11 },
    ],
  },
  {
    name: 'Negotiation',
    color: 'bg-success/15 text-success',
    total: 198000,
    count: 3,
    deals: [
      { name: 'Manufacturer X', value: 145000, owner: 'JD', days: 30 },
      { name: 'Logistics Co', value: 53000, owner: 'MR', days: 17 },
    ],
  },
];

export function PipelineKanban() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage) => (
        <div key={stage.name} className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${stage.color}`}>{stage.name}</span>
              <span className="text-xs text-muted-foreground">{stage.count}</span>
            </div>
            <span className="font-mono text-xs font-medium">${formatCompactNumber(stage.total)}</span>
          </div>
          <div className="space-y-2">
            {stage.deals.map((d, i) => (
              <div key={i} className="cursor-pointer rounded-md border border-border bg-card p-2.5 shadow-xs transition-all hover:shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-xs font-medium leading-snug">{d.name}</p>
                  <button className="rounded p-0.5 text-muted-foreground hover:bg-muted">
                    <MoreHorizontal className="size-3" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-2xs font-medium text-primary">
                    {d.owner}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold">${formatCompactNumber(d.value)}</p>
                    <p className="text-2xs text-muted-foreground">{d.days}d</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
