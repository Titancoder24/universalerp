'use client';

import * as React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Hash,
  Lock,
  Megaphone,
  Pin,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import type { ChatChannel } from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ChatSidebarProps {
  channels: ChatChannel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
}

const SECTIONS: { key: 'pinned' | 'channels' | 'dms' | 'group_dms'; label: string }[] = [
  { key: 'pinned', label: 'Pinned' },
  { key: 'channels', label: 'Channels' },
  { key: 'dms', label: 'Direct Messages' },
  { key: 'group_dms', label: 'Group DMs' },
];

const CHANNEL_ICON = {
  public: Hash,
  private: Lock,
  announcement: Megaphone,
  dm: Circle,
  group_dm: Users,
} as const;

export function ChatSidebar({ channels, activeChannelId, onSelectChannel }: ChatSidebarProps) {
  const [search, setSearch] = React.useState('');
  const [openSections, setOpenSections] = React.useState<Set<string>>(
    () => new Set(['pinned', 'channels', 'dms', 'group_dms']),
  );

  const filtered = React.useMemo(() => {
    if (!search) return channels;
    const q = search.toLowerCase();
    return channels.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q),
    );
  }, [channels, search]);

  const grouped: Record<string, ChatChannel[]> = {
    pinned: filtered.filter((c) => c.isPinned),
    channels: filtered.filter((c) => !c.isPinned && (c.type === 'public' || c.type === 'private' || c.type === 'announcement')),
    dms: filtered.filter((c) => !c.isPinned && c.type === 'dm'),
    group_dms: filtered.filter((c) => !c.isPinned && c.type === 'group_dm'),
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-base font-semibold">Chat</h2>
        <Button variant="ghost" size="icon-sm" title="New channel">
          <Plus className="size-4" />
        </Button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input
            placeholder="Search channels & DMs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-1 pb-4">
          {SECTIONS.map(({ key, label }) => {
            const items = grouped[key];
            if (items.length === 0) return null;
            const isOpen = openSections.has(key);
            return (
              <div key={key} className="mt-1">
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className="flex w-full items-center gap-1 rounded px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {isOpen ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                  <span>{label}</span>
                  <span className="ml-auto text-[10px] font-normal text-muted-foreground/70">
                    {items.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="space-y-px py-1">
                    {items.map((channel) => (
                      <ChannelRow
                        key={channel.id}
                        channel={channel}
                        active={channel.id === activeChannelId}
                        onClick={() => onSelectChannel(channel.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}

interface ChannelRowProps {
  channel: ChatChannel;
  active: boolean;
  onClick: () => void;
}

function ChannelRow({ channel, active, onClick }: ChannelRowProps) {
  const Icon = CHANNEL_ICON[channel.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
        active ? 'bg-accent text-accent-foreground' : 'text-foreground/80 hover:bg-muted/60',
        channel.unread > 0 && !active && 'font-semibold text-foreground',
      )}
    >
      {channel.type === 'dm' ? (
        <Avatar size="xs">
          <AvatarFallback className="text-[10px]">{channel.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <Icon className="size-3.5 shrink-0 opacity-70" />
      )}
      <span className="min-w-0 flex-1 truncate">{channel.name}</span>
      {channel.hasMention ? (
        <span className="rounded bg-destructive px-1.5 py-0 text-2xs font-medium text-destructive-foreground">
          @
        </span>
      ) : channel.unread > 0 ? (
        <span className="rounded-full bg-primary/15 px-1.5 py-0 text-2xs font-medium text-primary">
          {channel.unread}
        </span>
      ) : null}
    </button>
  );
}
