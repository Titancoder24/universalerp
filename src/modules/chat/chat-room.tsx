'use client';

import * as React from 'react';
import {
  Bell,
  ChevronDown,
  Hash,
  Info,
  Lock,
  Megaphone,
  Phone,
  Pin,
  Search,
  Star,
  Users,
  Video,
} from 'lucide-react';
import type { ChatChannel } from './types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessageList } from './chat-message-list';
import { ChatComposer } from './chat-composer';
import { generateSampleMessages, sampleUsers } from './sample-data';
import { initials } from '@/lib/utils';

interface ChatRoomProps {
  channel: ChatChannel;
}

const HEADER_ICON = {
  public: Hash,
  private: Lock,
  announcement: Megaphone,
  dm: null,
  group_dm: Users,
} as const;

export function ChatRoom({ channel }: ChatRoomProps) {
  const messages = React.useMemo(() => generateSampleMessages(channel.id), [channel.id]);
  const Icon = HEADER_ICON[channel.type];

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Channel Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2">
          {channel.type === 'dm' ? (
            <Avatar size="sm">
              <AvatarFallback>{initials(channel.name)}</AvatarFallback>
            </Avatar>
          ) : (
            Icon && <Icon className="size-5 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-semibold">{channel.name}</h2>
              <Button variant="ghost" size="icon-xs" title="Pin to favorites">
                <Star className="size-3" />
              </Button>
            </div>
            {channel.description && (
              <p className="truncate text-xs text-muted-foreground">{channel.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Member avatars */}
          {channel.type !== 'dm' && (
            <div className="hidden items-center -space-x-2 px-2 md:flex">
              {sampleUsers.slice(0, 4).map((u) => (
                <Avatar key={u.id} size="sm" className="border-2 border-background">
                  <AvatarFallback className="text-xs">{initials(u.name)}</AvatarFallback>
                </Avatar>
              ))}
              {channel.memberCount > 4 && (
                <span className="ml-3 text-xs text-muted-foreground">+{channel.memberCount - 4}</span>
              )}
            </div>
          )}
          <Button variant="ghost" size="icon-sm" title="Start voice call">
            <Phone className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Start video call">
            <Video className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Pinned messages">
            <Pin className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Search">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Notifications">
            <Bell className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" title="Channel details">
            <Info className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1">
        <ChatMessageList messages={messages} />
      </div>

      {/* Composer */}
      <ChatComposer channelName={channel.name} channelType={channel.type} />
    </div>
  );
}
