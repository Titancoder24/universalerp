'use client';

import * as React from 'react';
import {
  Bookmark,
  Edit3,
  MessageSquare,
  MoreHorizontal,
  Pin,
  Reply,
  Share2,
  SmilePlus,
  Trash2,
} from 'lucide-react';
import type { ChatMessage } from './types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, formatDateTime, formatRelativeTime, initials, colorFromString } from '@/lib/utils';
import { ChatVoiceNote } from './chat-voice-note';
import { ChatAttachmentRender } from './chat-attachment';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Group messages by sender + time proximity
  const grouped = React.useMemo(() => groupMessages(messages), [messages]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <ScrollArea className="h-full" viewportRef={scrollRef as any}>
      <div className="flex flex-col gap-1 px-4 py-4">
        <div className="pb-6 text-center">
          <p className="text-xs text-muted-foreground">— Beginning of conversation —</p>
        </div>

        {grouped.map((group, gi) => (
          <div key={gi} className="mt-2">
            {/* Date separator */}
            {gi === 0 && (
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-2xs font-medium text-muted-foreground">
                  Today
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
            )}

            {/* Sender info on first message of group */}
            <MessageGroup group={group} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function MessageGroup({ group }: { group: ChatMessage[] }) {
  const first = group[0];
  return (
    <div className="flex gap-3 hover:bg-muted/20 rounded-md -mx-2 px-2 py-1 transition-colors group/group">
      <Avatar size="md" className="mt-0.5 shrink-0">
        <AvatarFallback style={{ backgroundColor: colorFromString(first.author.name) }} className="text-white text-xs">
          {initials(first.author.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{first.author.name}</span>
          {first.author.title && (
            <span className="text-2xs text-muted-foreground">{first.author.title}</span>
          )}
          <span className="text-2xs text-muted-foreground" title={formatDateTime(first.createdAt)}>
            {formatRelativeTime(first.createdAt)}
          </span>
        </div>
        <div className="space-y-1">
          {group.map((msg) => (
            <MessageRow key={msg.id} message={msg} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: ChatMessage }) {
  return (
    <div className="group relative">
      {/* Related record badge */}
      {message.relatedRecord && (
        <Badge variant="outline" className="mb-1">
          <span className="font-mono text-xs">{message.relatedRecord.id}</span>
          <span className="text-muted-foreground">·</span>
          <span>{message.relatedRecord.name}</span>
        </Badge>
      )}

      {/* Body */}
      <div className="text-sm leading-snug">
        {message.body.split(/(@\w+)/g).map((part, i) => {
          if (part.startsWith('@')) {
            return (
              <span key={i} className="rounded bg-primary/10 px-1 font-medium text-primary">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
        {message.editedAt && <span className="ml-1 text-2xs text-muted-foreground">(edited)</span>}
      </div>

      {/* Voice note */}
      {message.type === 'voice' && message.voiceNote && <ChatVoiceNote note={message.voiceNote} />}

      {/* Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2 max-w-md">
          {message.attachments.map((att) => (
            <ChatAttachmentRender key={att.id} attachment={att} />
          ))}
        </div>
      )}

      {/* Reactions */}
      {message.reactions && message.reactions.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {message.reactions.map((r, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                'flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors',
                r.reactedByMe
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border bg-card hover:bg-muted',
              )}
            >
              <span>{r.emoji}</span>
              <span className="font-medium">{r.count}</span>
            </button>
          ))}
          <button
            type="button"
            className="rounded-full border border-dashed border-border px-2 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <SmilePlus className="size-3.5" />
          </button>
        </div>
      )}

      {/* Thread preview */}
      {message.threadReplyCount && message.threadReplyCount > 0 && (
        <button
          type="button"
          className="mt-1.5 flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1 text-xs hover:bg-muted"
        >
          <div className="flex -space-x-1.5">
            {message.threadParticipants?.slice(0, 3).map((p) => (
              <Avatar key={p.id} size="xs" className="border-2 border-card">
                <AvatarFallback style={{ backgroundColor: colorFromString(p.name) }} className="text-2xs text-white">
                  {initials(p.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="font-medium text-primary">{message.threadReplyCount} replies</span>
          <span className="text-muted-foreground">
            Last reply {formatRelativeTime(message.threadLastReplyAt ?? message.createdAt)}
          </span>
        </button>
      )}

      {/* Hover actions */}
      <div className="absolute -top-3 right-2 hidden gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-md group-hover:flex">
        <Button variant="ghost" size="icon-xs" title="React">
          <SmilePlus className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" title="Reply in thread">
          <Reply className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" title="Share">
          <Share2 className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" title="Bookmark">
          <Bookmark className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" title="More">
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

function groupMessages(messages: ChatMessage[]): ChatMessage[][] {
  const groups: ChatMessage[][] = [];
  for (const msg of messages) {
    const last = groups[groups.length - 1];
    if (
      last &&
      last[0].author.id === msg.author.id &&
      new Date(msg.createdAt).getTime() - new Date(last[last.length - 1].createdAt).getTime() <
        5 * 60 * 1000
    ) {
      last.push(msg);
    } else {
      groups.push([msg]);
    }
  }
  return groups;
}
