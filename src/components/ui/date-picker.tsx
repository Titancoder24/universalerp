'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatDate } from '@/lib/utils';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  align?: 'start' | 'center' | 'end';
  fromDate?: Date;
  toDate?: Date;
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    { value, onChange, placeholder = 'Pick a date', disabled, className, align = 'start', fromDate, toDate },
    ref,
  ) => {
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
              !value && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? formatDate(value) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            startMonth={fromDate}
            endMonth={toDate}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = 'DatePicker';

export { DatePicker };
