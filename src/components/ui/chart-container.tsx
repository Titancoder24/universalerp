'use client';

import * as React from 'react';
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import { cn } from '@/lib/utils';

export const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
] as const;

export const CHART_MARGINS = { top: 10, right: 12, left: 0, bottom: 0 } as const;

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, height = 280, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <ResponsiveContainer width="100%" height={height}>
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    );
  },
);
ChartContainer.displayName = 'ChartContainer';

const ChartGrid = (props: React.ComponentProps<typeof CartesianGrid>) => (
  <CartesianGrid
    strokeDasharray="3 3"
    stroke="hsl(var(--border))"
    strokeOpacity={0.6}
    vertical={false}
    {...props}
  />
);

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: TooltipProps<number, string>['payload'];
  label?: React.ReactNode;
  labelFormatter?: (label: React.ReactNode) => React.ReactNode;
  valueFormatter?: (value: number, name: string) => React.ReactNode;
  className?: string;
}

const ChartTooltipContent = ({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  className,
}: ChartTooltipContentProps) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md text-popover-foreground',
        className,
      )}
    >
      {label !== undefined && (
        <div className="mb-1 font-medium text-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((entry, i) => (
          <div key={`${entry.dataKey ?? i}-${i}`} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-medium tabular-nums text-foreground">
              {valueFormatter
                ? valueFormatter(entry.value as number, entry.name as string)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChartTooltip = (props: React.ComponentProps<typeof Tooltip>) => (
  <Tooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} {...props} />
);

export { ChartContainer, ChartGrid, ChartTooltip, ChartTooltipContent };
