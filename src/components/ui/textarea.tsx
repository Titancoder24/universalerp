'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoGrow?: boolean;
  minRows?: number;
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoGrow, minRows = 3, maxRows, onChange, value, defaultValue, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoGrow) return;
      el.style.height = 'auto';
      const lineHeight = parseInt(getComputedStyle(el).lineHeight || '20', 10) || 20;
      const maxHeight = maxRows ? lineHeight * maxRows : Infinity;
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [autoGrow, maxRows]);

    React.useEffect(() => {
      resize();
    }, [resize, value, defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (autoGrow) resize();
    };

    return (
      <textarea
        ref={innerRef}
        rows={minRows}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={cn(
          'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs',
          'ring-offset-background transition-colors',
          'placeholder:text-muted-foreground/70',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'min-h-[80px] resize-y',
          autoGrow && 'resize-none overflow-hidden',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
