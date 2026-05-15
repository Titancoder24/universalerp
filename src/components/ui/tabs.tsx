'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      underline: 'gap-1 border-b border-border w-full',
      pills: 'gap-1 p-1 bg-muted rounded-lg',
      ghost: 'gap-1',
    },
  },
  defaultVariants: { variant: 'underline' },
});

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant }), className)} {...props} />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background',
    'transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        underline: cn(
          'relative px-3 py-2 text-muted-foreground hover:text-foreground',
          'data-[state=active]:text-foreground',
          'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-transparent',
          'data-[state=active]:after:bg-primary after:transition-colors',
          '-mb-px',
        ),
        pills: cn(
          'rounded-md px-3 py-1.5 text-muted-foreground hover:text-foreground',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs',
        ),
        ghost: cn(
          'rounded-md px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          'data-[state=active]:bg-accent data-[state=active]:text-accent-foreground',
        ),
      },
    },
    defaultVariants: { variant: 'underline' },
  },
);

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
