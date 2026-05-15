'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconInput = LucideIcon | React.ComponentType<{ className?: string }> | string;

export interface IconRendererProps extends Omit<React.SVGAttributes<SVGElement>, 'name'> {
  icon?: IconInput | null;
  name?: string;
  fallback?: LucideIcon | React.ComponentType<{ className?: string }>;
  size?: number;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join('');
}

function resolveIconComponent(
  icon: IconInput | null | undefined,
  name: string | undefined,
): React.ComponentType<{ className?: string }> | null {
  if (icon && typeof icon !== 'string') return icon;
  const key = typeof icon === 'string' ? icon : name;
  if (!key) return null;
  const registry = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  return registry[key] || registry[toPascalCase(key)] || null;
}

const IconRenderer = React.forwardRef<SVGSVGElement, IconRendererProps>(
  ({ icon, name, fallback, size, className, ...props }, ref) => {
    const Resolved = resolveIconComponent(icon, name) ?? fallback ?? null;
    if (!Resolved) return null;
    const style = size ? { width: size, height: size } : undefined;
    return (
      <Resolved
        // @ts-expect-error - lucide components forward ref and accept svg props
        ref={ref}
        className={cn('shrink-0', className)}
        style={style}
        {...props}
      />
    );
  },
);
IconRenderer.displayName = 'IconRenderer';

export { IconRenderer };
