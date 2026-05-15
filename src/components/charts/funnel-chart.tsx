'use client';

import * as React from 'react';
import { cn, formatCompactNumber } from '@/lib/utils';

export interface FunnelStep {
  label: string;
  value: number;
  count: number;
}

interface FunnelChartProps {
  steps: FunnelStep[];
  currency?: string;
  showConversion?: boolean;
}

export function FunnelChart({ steps, currency = 'USD', showConversion = true }: FunnelChartProps) {
  if (steps.length === 0) return null;
  const max = Math.max(...steps.map((s) => s.value));

  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const width = (step.value / max) * 100;
        const conversion = i > 0 ? (step.count / steps[i - 1].count) * 100 : 100;
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{step.label}</span>
                <span className="text-muted-foreground">{step.count} deals</span>
              </div>
              <div className="flex items-center gap-2">
                {showConversion && i > 0 && (
                  <span className={cn(
                    'text-2xs px-1.5 py-0.5 rounded',
                    conversion >= 50 ? 'bg-success/10 text-success' :
                    conversion >= 25 ? 'bg-warning/10 text-warning' :
                    'bg-destructive/10 text-destructive',
                  )}>
                    {conversion.toFixed(0)}%
                  </span>
                )}
                <span className="font-mono font-semibold">${formatCompactNumber(step.value)}</span>
              </div>
            </div>
            <div className="relative h-9 rounded bg-muted/30 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded transition-all duration-500 bg-gradient-to-r from-primary/30 to-primary/80"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
