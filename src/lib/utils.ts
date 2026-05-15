import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency = 'USD',
  locale = 'en-US',
): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(
  value: number | string | null | undefined,
  opts: Intl.NumberFormatOptions = {},
  locale = 'en-US',
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value ?? 0;
  return new Intl.NumberFormat(locale, opts).format(num);
}

export function formatCompactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(date: Date | string | null | undefined, locale = 'en-US'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(date: Date | string | null | undefined, locale = 'en-US'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return rtf.format(-years, 'year');
  if (months > 0) return rtf.format(-months, 'month');
  if (weeks > 0) return rtf.format(-weeks, 'week');
  if (days > 0) return rtf.format(-days, 'day');
  if (hours > 0) return rtf.format(-hours, 'hour');
  if (minutes > 0) return rtf.format(-minutes, 'minute');
  return 'just now';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function truncate(str: string, length = 50): string {
  if (!str) return '';
  return str.length > length ? `${str.slice(0, length)}…` : str;
}

export function initials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function slug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function colorFromString(str: string): string {
  const palette = [
    'hsl(0 70% 55%)',
    'hsl(25 80% 55%)',
    'hsl(45 80% 50%)',
    'hsl(100 50% 45%)',
    'hsl(160 60% 40%)',
    'hsl(195 75% 45%)',
    'hsl(220 70% 55%)',
    'hsl(260 60% 60%)',
    'hsl(290 60% 55%)',
    'hsl(330 70% 55%)',
  ];
  return palette[hashString(str) % palette.length];
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural ?? `${singular}s`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 200): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function throttle<T extends (...args: any[]) => any>(fn: T, delay = 200): T {
  let last = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      return fn(...args);
    }
  }) as T;
}

export function nextNumber(prefix: string, current: number, padding = 5): string {
  return `${prefix}-${String(current).padStart(padding, '0')}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function range(start: number, end?: number, step = 1): number[] {
  const lo = end === undefined ? 0 : start;
  const hi = end === undefined ? start : end;
  const result: number[] = [];
  for (let i = lo; i < hi; i += step) result.push(i);
  return result;
}

export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      (acc[key] ||= []).push(item);
      return acc;
    },
    {} as Record<K, T[]>,
  );
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function uniqBy<T, K>(arr: T[], keyFn: (x: T) => K): T[] {
  const seen = new Set<K>();
  return arr.filter((x) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const noop = () => undefined;

export type Maybe<T> = T | null | undefined;
