'use client';

import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Package,
  Receipt,
  ShoppingBag,
  UserPlus,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

const activities = [
  { type: 'payment', icon: CheckCircle2, color: 'text-success', text: 'Acme Industries paid INV-2089', amount: '$12,450', at: new Date(Date.now() - 1000 * 60 * 12) },
  { type: 'quote', icon: FileText, color: 'text-primary', text: 'New quote QT-456 sent to TechCorp', at: new Date(Date.now() - 1000 * 60 * 45) },
  { type: 'order', icon: ShoppingBag, color: 'text-info', text: 'Sales order SO-2143 confirmed', amount: '$8,900', at: new Date(Date.now() - 1000 * 60 * 90) },
  { type: 'inventory', icon: Package, color: 'text-warning', text: 'Low stock alert: SKU-A-12 (12 units)', at: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { type: 'message', icon: MessageSquare, color: 'text-primary', text: 'Sarah commented on PROJ-89', at: new Date(Date.now() - 1000 * 60 * 60 * 4) },
  { type: 'customer', icon: UserPlus, color: 'text-success', text: 'New customer: Global Manufacturing', at: new Date(Date.now() - 1000 * 60 * 60 * 6) },
  { type: 'invoice', icon: Receipt, color: 'text-info', text: 'INV-2087 viewed by customer', at: new Date(Date.now() - 1000 * 60 * 60 * 8) },
];

export function ActivityFeed() {
  return (
    <div className="space-y-1">
      {activities.map((a, i) => (
        <div key={i} className="group flex items-start gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted/50">
          <div className={cn('mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted', a.color)}>
            <a.icon className="size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-foreground truncate">
              {a.text}
              {a.amount && <span className="ml-1 font-mono text-xs text-muted-foreground">({a.amount})</span>}
            </p>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(a.at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
