import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  back?: React.ReactNode;
  sticky?: boolean;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, breadcrumbs, actions, back, sticky, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-3 border-b border-border bg-background/95 px-6 py-4 backdrop-blur',
          sticky && 'sticky top-0 z-20',
          className,
        )}
        {...props}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((b, i) => {
              const last = i === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${b.label}-${i}`}>
                  {b.href && !last ? (
                    <a
                      href={b.href}
                      className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
                    >
                      {b.label}
                    </a>
                  ) : (
                    <span
                      className={cn(last && 'font-medium text-foreground')}
                      aria-current={last ? 'page' : undefined}
                    >
                      {b.label}
                    </span>
                  )}
                  {!last && <ChevronRight className="h-3 w-3 text-muted-foreground/60" />}
                </React.Fragment>
              );
            })}
          </nav>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            {back && <div className="flex-shrink-0 pt-0.5">{back}</div>}
            <div className="min-w-0 flex flex-col gap-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>
    );
  },
);
PageHeader.displayName = 'PageHeader';

export { PageHeader };
