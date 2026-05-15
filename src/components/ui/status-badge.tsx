import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type DocumentStatus =
  | 'draft'
  | 'pending'
  | 'sent'
  | 'viewed'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'inactive'
  | 'open'
  | 'closed'
  | 'completed'
  | 'in_progress'
  | 'on_hold'
  | string;

const statusBadgeVariants = cva(
  cn(
    'pill transition-colors capitalize',
    '[&_svg]:size-2.5 [&_svg]:shrink-0',
  ),
  {
    variants: {
      tone: {
        neutral: 'bg-muted text-muted-foreground border-transparent',
        primary: 'bg-primary/10 text-primary border-transparent',
        success: 'bg-success/10 text-success border-transparent',
        warning: 'bg-warning/10 text-warning border-transparent',
        destructive: 'bg-destructive/10 text-destructive border-transparent',
        info: 'bg-info/10 text-info border-transparent',
      },
      size: {
        sm: 'px-1.5 py-0 text-2xs h-5',
        md: 'px-2 py-0.5 text-xs',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'md' },
  },
);

type StatusTone = NonNullable<VariantProps<typeof statusBadgeVariants>['tone']>;

const statusMap: Record<string, StatusTone> = {
  draft: 'neutral',
  pending: 'warning',
  sent: 'info',
  viewed: 'info',
  partial: 'warning',
  paid: 'success',
  overdue: 'destructive',
  cancelled: 'destructive',
  refunded: 'neutral',
  approved: 'success',
  rejected: 'destructive',
  active: 'success',
  inactive: 'neutral',
  open: 'info',
  closed: 'neutral',
  completed: 'success',
  in_progress: 'info',
  on_hold: 'warning',
};

function resolveStatusTone(status: string): StatusTone {
  const key = status.toLowerCase().replace(/[\s-]/g, '_');
  return statusMap[key] ?? 'neutral';
}

export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    Pick<VariantProps<typeof statusBadgeVariants>, 'size'> {
  status: DocumentStatus;
  label?: React.ReactNode;
  withDot?: boolean;
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, label, withDot = true, size, className, ...props }, ref) => {
    const tone = resolveStatusTone(String(status));
    const text = label ?? String(status).replace(/_/g, ' ');
    return (
      <span ref={ref} className={cn(statusBadgeVariants({ tone, size }), className)} {...props}>
        {withDot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              tone === 'neutral' && 'bg-muted-foreground',
              tone === 'primary' && 'bg-primary',
              tone === 'success' && 'bg-success',
              tone === 'warning' && 'bg-warning',
              tone === 'destructive' && 'bg-destructive',
              tone === 'info' && 'bg-info',
            )}
          />
        )}
        {text}
      </span>
    );
  },
);
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants, resolveStatusTone };
