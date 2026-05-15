'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'flex flex-col gap-3',
        month_caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          'absolute left-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground',
          'hover:bg-accent hover:text-accent-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        ),
        button_next: cn(
          'absolute right-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground',
          'hover:bg-accent hover:text-accent-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-9 font-normal text-xs',
        week: 'flex w-full mt-1',
        day: cn(
          'relative h-9 w-9 p-0 text-center text-sm',
          '[&:has([aria-selected].range_end)]:rounded-r-md',
          '[&:has([aria-selected].outside)]:bg-accent/50',
          '[&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
          'focus-within:relative focus-within:z-20',
        ),
        day_button: cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-normal',
          'hover:bg-accent hover:text-accent-foreground transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'aria-selected:opacity-100',
        ),
        range_start: 'range_start day-range-start rounded-l-md bg-primary text-primary-foreground',
        range_end: 'range_end day-range-end rounded-r-md bg-primary text-primary-foreground',
        selected:
          '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:focus:bg-primary [&>button]:focus:text-primary-foreground',
        today: '[&>button]:bg-accent [&>button]:text-accent-foreground font-medium',
        outside: 'outside text-muted-foreground/50 aria-selected:bg-accent/40 aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-40',
        range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
