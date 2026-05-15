'use client';

import * as React from 'react';
import { MessageSquare, Paperclip, Send, Smile, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn, formatRelativeTime, initials, colorFromString } from '@/lib/utils';

interface RecordThreadProps {
  recordType: string;
  recordId: string;
  recordName?: string;
  /**
   * When true, customers in the customer portal see the same thread.
   * Internal-only messages will be hidden from them automatically.
   */
  customerVisible?: boolean;
}

interface ThreadMessage {
  id: string;
  author: { id: string; name: string; role: 'employee' | 'customer' | 'system' };
  body: string;
  createdAt: Date;
  isInternal: boolean;
}

const sampleMessages: ThreadMessage[] = [
  {
    id: '1',
    author: { id: 'u1', name: 'Sarah Chen', role: 'employee' },
    body: "Acme requested net 60 instead of net 30. Should we make an exception given their volume?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isInternal: true,
  },
  {
    id: '2',
    author: { id: 'u2', name: 'Aisha Patel', role: 'employee' },
    body: "Looking at their payment history — they've been on time every quarter. Yes, approved for net 60 going forward.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3.5),
    isInternal: true,
  },
  {
    id: '3',
    author: { id: 'c1', name: 'John Buyer', role: 'customer' },
    body: "Hi team — small request. Could we get the invoice item descriptions in metric units? Our procurement system requires it.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isInternal: false,
  },
  {
    id: '4',
    author: { id: 'u1', name: 'Sarah Chen', role: 'employee' },
    body: "Hi John — sure, I'll regenerate with metric. Will resend within the hour.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
    isInternal: false,
  },
];

export function ChatRecordThread({ recordType, recordId, recordName, customerVisible }: RecordThreadProps) {
  const [composerMode, setComposerMode] = React.useState<'internal' | 'customer'>('internal');
  const [text, setText] = React.useState('');

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <h3 className="font-semibold text-sm">Discussion</h3>
          {customerVisible && (
            <Badge variant="info" className="gap-1">
              <Users className="size-3" /> Customer-visible
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {sampleMessages.length} messages · {recordName ?? `${recordType} ${recordId}`}
        </div>
      </div>

      <div className="space-y-3 px-4 py-3 max-h-96 overflow-y-auto">
        {sampleMessages.map((msg) => (
          <div key={msg.id} className="flex gap-2.5">
            <Avatar size="sm">
              <AvatarFallback style={{ backgroundColor: colorFromString(msg.author.name) }} className="text-white text-xs">
                {initials(msg.author.name)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                'min-w-0 flex-1 rounded-lg px-3 py-2',
                msg.isInternal ? 'bg-warning/5 border-l-2 border-warning' : 'bg-muted/30',
              )}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-xs">{msg.author.name}</span>
                {msg.author.role === 'customer' && <Badge variant="outline" className="text-2xs">Customer</Badge>}
                {msg.isInternal && <Badge variant="warning" className="text-2xs">Internal</Badge>}
                <span className="text-2xs text-muted-foreground">{formatRelativeTime(msg.createdAt)}</span>
              </div>
              <div className="mt-0.5 text-sm">{msg.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        {customerVisible && (
          <div className="mb-2 flex gap-1 rounded-md bg-muted/40 p-0.5">
            <button
              onClick={() => setComposerMode('customer')}
              className={cn(
                'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                composerMode === 'customer' ? 'bg-card shadow' : 'text-muted-foreground',
              )}
            >
              Reply to customer
            </button>
            <button
              onClick={() => setComposerMode('internal')}
              className={cn(
                'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                composerMode === 'internal' ? 'bg-warning/15 text-warning shadow' : 'text-muted-foreground',
              )}
            >
              Internal note
            </button>
          </div>
        )}
        <div
          className={cn(
            'rounded-lg border bg-background',
            composerMode === 'internal' && customerVisible && 'border-warning/30',
          )}
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={composerMode === 'internal' ? 'Internal note — only your team sees this' : 'Reply visible to the customer…'}
            className="min-h-[60px] resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            rows={2}
          />
          <div className="flex items-center justify-between border-t border-border px-2 py-1.5">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm"><Paperclip className="size-3.5" /></Button>
              <Button variant="ghost" size="icon-sm"><Smile className="size-3.5" /></Button>
            </div>
            <Button size="sm" disabled={!text.trim()}>
              <Send className="size-3.5" /> Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
