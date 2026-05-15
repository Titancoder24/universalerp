'use client';

import * as React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { cn } from '@/lib/utils';

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ className, position = 'bottom-right', richColors = true, ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      className={cn('toaster group', className)}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-md',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-md',
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
