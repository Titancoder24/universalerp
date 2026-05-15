'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AtSign,
  Bookmark,
  CheckCircle2,
  Filter,
  Inbox as InboxIcon,
  MessageSquare,
  Pin,
  Receipt,
  ShoppingBag,
  Star,
  UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, formatRelativeTime, initials, colorFromString } from '@/lib/utils';

interface InboxItem {
  id: string;
  type: 'mention' | 'dm' | 'thread' | 'channel' | 'record' | 'task' | 'announcement';
  title: string;
  body: string;
  from?: string;
  at: Date;
  unread: boolean;
  starred?: boolean;
  link: string;
  source?: string;
  amount?: string;
}

const items: InboxItem[] = [
  {
    id: '1',
    type: 'mention',
    title: 'Sarah Chen mentioned you in #sales',
    body: '@you the Acme expansion is signed! Need approval on the new commission split — looped you in.',
    from: 'Sarah Chen',
    at: new Date(Date.now() - 1000 * 60 * 8),
    unread: true,
    link: '/app/chat',
    source: '#sales',
  },
  {
    id: '2',
    type: 'record',
    title: 'INV-2089 paid in full',
    body: 'Acme Industries paid $12,450 via bank transfer. Payment recorded.',
    at: new Date(Date.now() - 1000 * 60 * 25),
    unread: true,
    link: '/app/sales/invoices/INV-2089',
    source: 'Invoice',
    amount: '$12,450',
  },
  {
    id: '3',
    type: 'thread',
    title: 'Marcus replied to your message in #engineering',
    body: 'Yeah, the gateway pattern makes sense. Let\'s ship the first cut by EOW.',
    from: 'Marcus Rodriguez',
    at: new Date(Date.now() - 1000 * 60 * 45),
    unread: true,
    link: '/app/chat',
    source: 'Thread',
  },
  {
    id: '4',
    type: 'task',
    title: 'Quote QT-456 expires in 3 days',
    body: 'Tech Solutions Inc. has not responded to the proposal. Consider a follow-up.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: true,
    link: '/app/sales/quotations/QT-456',
    source: 'Task',
  },
  {
    id: '5',
    type: 'dm',
    title: 'Aisha Patel sent you a message',
    body: 'Got 5 mins to review the Q3 forecast model? I made some changes after the Acme update.',
    from: 'Aisha Patel',
    at: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unread: false,
    starred: true,
    link: '/app/chat',
  },
  {
    id: '6',
    type: 'record',
    title: 'New customer signed up',
    body: 'Global Manufacturing completed their account setup and selected the Enterprise plan.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 4),
    unread: false,
    link: '/app/sales/customers',
    source: 'Customer',
  },
  {
    id: '7',
    type: 'announcement',
    title: '📣 New office opening in Austin',
    body: 'We\'re excited to announce our second US office in Austin, opening Q4 2026.',
    from: 'Leadership',
    at: new Date(Date.now() - 1000 * 60 * 60 * 6),
    unread: false,
    link: '/app/chat',
    source: '#announcements',
  },
  {
    id: '8',
    type: 'channel',
    title: '12 new messages in #production',
    body: 'Jake, Liu and 3 others discussed the OEE numbers and new schedule for Line 4.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 8),
    unread: false,
    link: '/app/chat',
    source: '#production',
  },
];

const filters = [
  { id: 'all', label: 'All', count: items.length },
  { id: 'unread', label: 'Unread', count: items.filter((i) => i.unread).length },
  { id: 'mentions', label: 'Mentions', count: items.filter((i) => i.type === 'mention').length },
  { id: 'dms', label: 'DMs', count: items.filter((i) => i.type === 'dm').length },
  { id: 'records', label: 'Records', count: items.filter((i) => i.type === 'record').length },
  { id: 'starred', label: 'Starred', count: items.filter((i) => i.starred).length },
];

const typeIcons = {
  mention: AtSign,
  dm: MessageSquare,
  thread: MessageSquare,
  channel: MessageSquare,
  record: Receipt,
  task: CheckCircle2,
  announcement: Pin,
};

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [selected, setSelected] = React.useState<string | null>(items[0].id);

  const filtered = items.filter((i) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return i.unread;
    if (activeFilter === 'starred') return i.starred;
    if (activeFilter === 'mentions') return i.type === 'mention';
    if (activeFilter === 'dms') return i.type === 'dm';
    if (activeFilter === 'records') return i.type === 'record';
    return true;
  });

  const selectedItem = items.find((i) => i.id === selected);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Inbox"
        description="Every message, mention, task, and record activity that needs your attention."
        actions={
          <>
            <Button variant="outline" size="sm">
              <CheckCircle2 className="size-3.5" /> Mark all read
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" /> Filters
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              activeFilter === f.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card hover:bg-muted',
            )}
          >
            {f.label}
            <span className={cn(
              'rounded-full px-1.5 py-0 text-2xs',
              activeFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
            )}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
        {/* List */}
        <Card className="p-0">
          <div className="divide-y divide-border">
            {filtered.map((item) => {
              const Icon = typeIcons[item.type];
              const isSelected = selected === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                    isSelected ? 'bg-primary/5' : item.unread ? 'bg-muted/30' : 'hover:bg-muted/30',
                  )}
                >
                  <div className="relative shrink-0 mt-0.5">
                    {item.from ? (
                      <Avatar size="sm">
                        <AvatarFallback style={{ backgroundColor: colorFromString(item.from) }} className="text-white text-xs">
                          {initials(item.from)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                    )}
                    {item.unread && (
                      <div className="absolute -right-1 top-0 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className={cn('truncate text-sm', item.unread && 'font-semibold')}>
                        {item.title}
                      </p>
                      {item.starred && <Star className="size-3 fill-current text-warning" />}
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground mt-0.5">{item.body}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {item.source && <Badge variant="outline" className="text-2xs">{item.source}</Badge>}
                      <span className="text-2xs text-muted-foreground">{formatRelativeTime(item.at)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Detail */}
        {selectedItem && (
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedItem.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {selectedItem.from && `From ${selectedItem.from} · `}
                    {formatRelativeTime(selectedItem.at)}
                    {selectedItem.source && ` · in ${selectedItem.source}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm"><Star className="size-4" /></Button>
                  <Button variant="ghost" size="icon-sm"><Bookmark className="size-4" /></Button>
                  <Button variant="ghost" size="icon-sm"><CheckCircle2 className="size-4" /></Button>
                </div>
              </div>
              <div className="prose prose-sm text-sm leading-relaxed">
                <p>{selectedItem.body}</p>
              </div>

              {selectedItem.amount && (
                <div className="mt-4 inline-block rounded-md bg-success/10 px-3 py-1.5 text-sm font-mono text-success">
                  {selectedItem.amount}
                </div>
              )}

              <div className="mt-6 flex items-center gap-2">
                <Button asChild>
                  <Link href={selectedItem.link as any}>Open in app</Link>
                </Button>
                <Button variant="outline">Reply</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
