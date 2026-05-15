'use client';

import * as React from 'react';
import { ChatSidebar } from './chat-sidebar';
import { ChatRoom } from './chat-room';
import { sampleChannels } from './sample-data';

export function ChatWorkspace() {
  const [activeChannelId, setActiveChannelId] = React.useState<string>('c3');
  const activeChannel = sampleChannels.find((c) => c.id === activeChannelId) ?? sampleChannels[0];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <ChatSidebar
        channels={sampleChannels}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
      />
      <div className="min-w-0 flex-1">
        <ChatRoom channel={activeChannel} />
      </div>
    </div>
  );
}
