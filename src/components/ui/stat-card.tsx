'use client';

import * as React from 'react';
import { ArrowDown, ArrowUp, Minus, type LucideIcon } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

export type StatCardFormat = 'currency' | 'number' | 'percent' | 'compact';
export type StatCardTrend = 'up' | 'down' | 'flat';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  format?: StatCardFormat;
  currency?: string;
  trend?: StatCardTrend;
  sparkline?: number[];
  invertTrend?: boolean;
}

function formatValue(value: string | number, format: StatCardFormat, currency: string): string {
  if (typeof value === 'string') return value;
  switch (format) {
    case 'currency':
      return formatCurrency(value, currency);
    case 'percent':
      return formatPercent(value);
    case 'compact':
      return formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 });
    default:
      return formatNumber(value);
  }
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      label,
      value,
      delta,
      deltaLabel,
      icon: Icon,
      format = 'number',
      currency = 'USD',
      trend,
      sparkline,
      invertTrend,
      className,
      ...props
    },
    ref,
  ) => {
    const resolvedTrend: StatCardTrend =
      trend ?? (delta === undefined || delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down');
    const positive = invertTrend ? resolvedTrend === 'down' : resolvedTrend === 'up';
    const negative = invertTrend ? resolvedTrend === 'up' : resolvedTrend === 'down';

    const deltaColor = cn(
      positive && 'text-success',
      negative && 'text-destructive',
      resolvedTrend === 'flat' && 'text-muted-foreground',
    );

    const sparklineData = sparkline?.map((v, i) => ({ i, v }));
    const sparklineStroke = positive
      ? 'hsl(var(--success))'
      : negative
        ? 'hsl(var(--destructive))'
        : 'hsl(var(--muted-foreground))';

    return (
      <div ref={ref} className={cn('surface-card p-5 flex flex-col gap-2', className)} {...props}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatValue(value, format, currency)}
            </div>
            {(delta !== undefined || deltaLabel) && (
              <div className={cn('flex items-center gap-1 text-xs font-medium', deltaColor)}>
                {resolvedTrend === 'up' && <ArrowUp className="h-3 w-3" />}
                {resolvedTrend === 'down' && <ArrowDown className="h-3 w-3" />}
                {resolvedTrend === 'flat' && <Minus className="h-3 w-3" />}
                {delta !== undefined && (
                  <span className="tabular-nums">
                    {delta > 0 ? '+' : ''}
                    {formatPercent(delta / 100)}
                  </span>
                )}
                {deltaLabel && (
                  <span className="text-muted-foreground font-normal">{deltaLabel}</span>
                )}
              </div>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <div className="h-10 w-24 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={sparklineStroke}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  },
);
StatCard.displayName = 'StatCard';

export { StatCard };
