import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon, title, description, action, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('empty-state', className)} {...props}>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">{title}</h3>
          {description && (
            <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  },
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
