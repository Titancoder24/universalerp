'use client';

import * as React from 'react';
import { ArrowLeft, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessage } from './types';
import { ChatComposer } from './chat-composer';
import { cn, formatDateTime, formatRelativeTime, initials, colorFromString } from '@/lib/utils';

interface ChatThreadPanelProps {
  parentMessage: ChatMessage;
  replies: ChatMessage[];
  onClose: () => void;
}

export function ChatThreadPanel({ parentMessage, replies, onClose }: ChatThreadPanelProps) {
  return (
    <aside className="flex h-full w-96 flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onClose} className="lg:hidden">
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <div className="font-semibold text-sm">Thread</div>
            <div className="text-2xs text-muted-foreground">{replies.length} replies</div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
          <Button variant="ghost" size="icon-sm" onClick={onClose}><X className="size-4" /></Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Parent message */}
        <div className="border-b border-border p-4">
          <div className="flex gap-3">
            <Avatar size="md">
              <AvatarFallback style={{ backgroundColor: colorFromString(parentMessage.author.name) }} className="text-white text-xs">
                {initials(parentMessage.author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">{parentMessage.author.name}</span>
                <span className="text-2xs text-muted-foreground">{formatDateTime(parentMessage.createdAt)}</span>
              </div>
              <div className="mt-1 text-sm">{parentMessage.body}</div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="space-y-3 p-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <Avatar size="sm">
                <AvatarFallback style={{ backgroundColor: colorFromString(reply.author.name) }} className="text-white text-2xs">
                  {initials(reply.author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-xs">{reply.author.name}</span>
                  <span className="text-2xs text-muted-foreground">{formatRelativeTime(reply.createdAt)}</span>
                </div>
                <div className="mt-0.5 text-sm">{reply.body}</div>
                {reply.reactions && reply.reactions.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {reply.reactions.map((r, i) => (
                      <button
                        key={i}
                        className={cn(
                          'flex items-center gap-1 rounded-full border px-1.5 py-0 text-2xs',
                          r.reactedByMe ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border bg-card',
                        )}
                      >
                        <span>{r.emoji}</span>
                        <span className="font-medium">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border p-3">
        <ChatComposer channelName="thread" channelType="thread" threadParent />
      </div>
    </aside>
  );
}
