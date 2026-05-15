'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'input-base',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const InputAddon = React.forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, prefix, suffix, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex items-stretch w-full rounded-lg border border-input bg-background shadow-xs',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 ring-offset-background',
          'transition-colors',
          className,
        )}
        {...props}
      >
        {prefix && (
          <span className="flex items-center pl-3 pr-2 text-sm text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            {prefix}
          </span>
        )}
        <div
          className={cn(
            'flex-1 [&>input]:border-0 [&>input]:bg-transparent [&>input]:shadow-none [&>input]:focus-visible:ring-0 [&>input]:focus-visible:ring-offset-0',
            prefix && '[&>input]:pl-0',
            suffix && '[&>input]:pr-0',
          )}
        >
          {children}
        </div>
        {suffix && (
          <span className="flex items-center pr-3 pl-2 text-sm text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
            {suffix}
          </span>
        )}
      </div>
    );
  },
);
InputAddon.displayName = 'InputAddon';

export { Input, InputAddon };
