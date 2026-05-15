'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  data: Array<{
    row: string;
    cells: Array<{
      label: string;
      value: number;
      tooltip?: string;
    }>;
  }>;
  scale?: 'green' | 'red' | 'blue';
  emptyValue?: number;
}

export function Heatmap({ data, scale = 'green', emptyValue = 0 }: HeatmapProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(
    ...data.flatMap((row) => row.cells.map((c) => c.value)),
  );

  const getColor = (value: number) => {
    if (value === emptyValue) return 'bg-muted/30';
    const intensity = Math.min(1, value / maxValue);
    if (scale === 'green') {
      if (intensity > 0.75) return 'bg-success/80';
      if (intensity > 0.5) return 'bg-success/60';
      if (intensity > 0.25) return 'bg-success/40';
      return 'bg-success/20';
    }
    if (scale === 'red') {
      if (intensity > 0.75) return 'bg-destructive/80';
      if (intensity > 0.5) return 'bg-destructive/60';
      if (intensity > 0.25) return 'bg-destructive/40';
      return 'bg-destructive/20';
    }
    if (intensity > 0.75) return 'bg-primary/80';
    if (intensity > 0.5) return 'bg-primary/60';
    if (intensity > 0.25) return 'bg-primary/40';
    return 'bg-primary/20';
  };

  const colLabels = data[0]?.cells.map((c) => c.label) ?? [];

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-0.5 pl-24">
        {colLabels.map((label) => (
          <div key={label} className="flex-1 text-center text-2xs text-muted-foreground">
            {label}
          </div>
        ))}
      </div>
      {data.map((row) => (
        <div key={row.row} className="flex items-center gap-0.5">
          <div className="w-24 truncate pr-2 text-xs text-muted-foreground">{row.row}</div>
          {row.cells.map((cell, i) => (
            <div
              key={i}
              title={cell.tooltip ?? `${row.row} · ${cell.label}: ${cell.value}`}
              className={cn(
                'flex-1 h-8 rounded transition-all cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary/40',
                getColor(cell.value),
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
