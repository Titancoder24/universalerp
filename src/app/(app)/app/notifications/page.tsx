'use client';

import * as React from 'react';
import {
  Bell,
  CheckCircle2,
  Circle,
  Filter,
  Inbox,
  Mail,
  MessageSquare,
  Receipt,
  Settings,
  ShoppingBag,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime } from '@/lib/utils';

const notifications = [
  { id: 1, type: 'payment', icon: CheckCircle2, title: 'INV-2089 has been paid', body: 'Acme Industries paid $12,450 via bank transfer.', at: new Date(Date.now() - 1000 * 60 * 12), unread: true, link: '/app/sales/invoices/INV-2089', category: 'sales' },
  { id: 2, type: 'mention', icon: MessageSquare, title: 'Sarah Chen mentioned you', body: 'Need your input on the Acme expansion commission split.', at: new Date(Date.now() - 1000 * 60 * 45), unread: true, link: '/app/chat', category: 'communication' },
  { id: 3, type: 'order', icon: ShoppingBag, title: 'New order from TechCorp Solutions', body: 'SO-2151 confirmed for $8,900. Production starts Monday.', at: new Date(Date.now() - 1000 * 60 * 90), unread: true, link: '/app/sales/orders', category: 'sales' },
  { id: 4, type: 'low_stock', icon: TrendingUp, title: 'Low stock alert: SKU-A-12', body: 'Only 12 units remaining (reorder point: 25).', at: new Date(Date.now() - 1000 * 60 * 60 * 3), unread: false, link: '/app/inventory/items', category: 'inventory' },
  { id: 5, type: 'employee', icon: UserPlus, title: 'New hire onboarded', body: 'Yuki Tanaka has completed Day 1 onboarding checklist.', at: new Date(Date.now() - 1000 * 60 * 60 * 5), unread: false, link: '/app/hr/onboarding', category: 'hr' },
  { id: 6, type: 'invoice', icon: Receipt, title: 'INV-2087 viewed by customer', body: 'Global Manufacturing opened your invoice 14 minutes after sending.', at: new Date(Date.now() - 1000 * 60 * 60 * 6), unread: false, link: '/app/sales/invoices/INV-2087', category: 'sales' },
  { id: 7, type: 'announcement', icon: Bell, title: 'Q3 2026 product roadmap', body: 'Marcus posted the Q3 roadmap in #engineering.', at: new Date(Date.now() - 1000 * 60 * 60 * 8), unread: false, link: '/app/chat', category: 'communication' },
];

export default function NotificationsPage() {
  const [filter, setFilter] = React.useState<'all' | 'unread' | string>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    return n.category === filter;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread of ${notifications.length} total`}
        actions={
          <>
            <Button variant="outline" size="sm"><CheckCircle2 className="size-3.5" /> Mark all read</Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/settings/notifications"><Settings className="size-3.5" /> Preferences</Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All', count: notifications.length },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'sales', label: 'Sales', count: notifications.filter((n) => n.category === 'sales').length },
          { id: 'inventory', label: 'Inventory', count: notifications.filter((n) => n.category === 'inventory').length },
          { id: 'hr', label: 'HR', count: notifications.filter((n) => n.category === 'hr').length },
          { id: 'communication', label: 'Communication', count: notifications.filter((n) => n.category === 'communication').length },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              filter === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:bg-muted',
            )}
          >
            {f.label}
            <span className={cn(
              'rounded-full px-1.5 py-0 text-2xs',
              filter === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}>{f.count}</span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.map((n) => (
              <Link
                key={n.id}
                href={n.link as any}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30',
                  n.unread && 'bg-muted/20',
                )}
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <n.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className={cn('text-sm', n.unread && 'font-semibold')}>{n.title}</span>
                    {n.unread && <Circle className="size-2 fill-primary text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{n.body}</p>
                  <p className="mt-1 text-2xs text-muted-foreground">{formatRelativeTime(n.at)}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
