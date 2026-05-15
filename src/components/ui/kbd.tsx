import * as React from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, children, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn(
        'inline-flex h-5 min-w-[1.25rem] items-center justify-center gap-0.5 rounded border border-border bg-muted px-1.5',
        'font-mono text-2xs font-medium text-muted-foreground shadow-xs',
        'select-none',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
});
Kbd.displayName = 'Kbd';

export { Kbd };
