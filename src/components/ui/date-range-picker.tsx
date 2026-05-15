'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatDate } from '@/lib/utils';

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
  numberOfMonths?: number;
  fromDate?: Date;
  toDate?: Date;
}

const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Pick a date range',
      disabled,
      className,
      align = 'start',
      numberOfMonths = 2,
      fromDate,
      toDate,
    },
    ref,
  ) => {
    const label = React.useMemo(() => {
      if (!value?.from) return placeholder;
      if (value.to) return `${formatDate(value.from)} – ${formatDate(value.to)}`;
      return formatDate(value.from);
    }, [value, placeholder]);

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value?.from && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={numberOfMonths}
            startMonth={fromDate}
            endMonth={toDate}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
