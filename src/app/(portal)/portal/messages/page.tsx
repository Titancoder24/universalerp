'use client';

import * as React from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, formatRelativeTime, initials, colorFromString } from '@/lib/utils';

interface Msg {
  id: number;
  from: string;
  fromMe: boolean;
  body: string;
  at: Date;
}

const messages: Msg[] = [
  { id: 1, from: 'Sarah Chen', fromMe: false, body: 'Hi John! Wanted to check in on the Phase 1 timeline. Are we still on track for UAT next week?', at: new Date(Date.now() - 1000 * 60 * 60 * 26) },
  { id: 2, from: 'You', fromMe: true, body: "Hi Sarah, yes we're tracking well. Just got the final test scripts approved this morning. Will share the UAT plan tomorrow.", at: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 3, from: 'Sarah Chen', fromMe: false, body: 'Perfect. Also wanted to flag — our solutions engineer Liu would like to do a quick walkthrough on the SAP integration. When works for you?', at: new Date(Date.now() - 1000 * 60 * 60 * 22) },
  { id: 4, from: 'You', fromMe: true, body: "Thursday afternoon works. I'll send a calendar invite.", at: new Date(Date.now() - 1000 * 60 * 60 * 20) },
  { id: 5, from: 'Sarah Chen', fromMe: false, body: 'Great, talk Thursday!', at: new Date(Date.now() - 1000 * 60 * 60 * 19) },
];

export default function PortalMessagesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="font-display text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">Direct chat with the Acme Corp account team</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={cn('flex gap-3', m.fromMe && 'flex-row-reverse')}>
              <Avatar size="sm">
                <AvatarFallback
                  style={{ backgroundColor: colorFromString(m.from) }}
                  className="text-white text-xs"
                >
                  {initials(m.from)}
                </AvatarFallback>
              </Avatar>
              <div className={cn('max-w-[70%]', m.fromMe && 'text-right')}>
                <div className={cn('flex items-baseline gap-2', m.fromMe && 'justify-end')}>
                  <span className="text-xs font-medium">{m.from}</span>
                  <span className="text-2xs text-muted-foreground">{formatRelativeTime(m.at)}</span>
                </div>
                <div
                  className={cn(
                    'mt-1 rounded-2xl px-4 py-2.5 text-sm',
                    m.fromMe ? 'bg-primary text-primary-foreground' : 'bg-card border border-border',
                  )}
                >
                  {m.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-input bg-card focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition">
            <Textarea
              placeholder="Type a message…"
              className="min-h-[60px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              rows={2}
            />
            <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5">
              <Button variant="ghost" size="icon-sm"><Paperclip className="size-3.5" /></Button>
              <Button size="sm"><Send className="size-3.5" /> Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
