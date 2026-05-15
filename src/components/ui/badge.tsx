import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  cn(
    'pill transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    '[&_svg]:size-3 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border-border bg-transparent text-foreground',
        success: 'border-transparent bg-success text-success-foreground hover:bg-success/90',
        warning: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/90',
        info: 'border-transparent bg-info text-info-foreground hover:bg-info/90',
        soft: 'border-transparent bg-primary/10 text-primary hover:bg-primary/15',
      },
      size: {
        sm: 'px-1.5 py-0 text-2xs h-5',
        md: 'px-2 py-0.5 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
