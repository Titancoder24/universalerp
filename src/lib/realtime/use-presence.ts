'use client';

import * as React from 'react';
import { getChannelManager } from './channel-manager';
import { useTenant } from '@/components/providers/tenant-provider';

export interface PresenceUser {
  userId: string;
  name: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  page?: string;
  lastSeen: string;
}

/**
 * Track which users are currently viewing a particular record/page.
 * Returns a list of users with their presence state.
 */
export function usePresence(channelName: string) {
  const { user } = useTenant();
  const [presence, setPresence] = React.useState<PresenceUser[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const manager = getChannelManager();

    const unsubscribe = manager.subscribe(
      channelName,
      'presence',
      {
        onPresenceSync: (state) => {
          const users: PresenceUser[] = [];
          for (const [key, presences] of Object.entries(state)) {
            const arr = presences as any[];
            if (arr[0]) users.push(arr[0] as PresenceUser);
          }
          setPresence(users);
        },
      },
    );

    manager.track(channelName, {
      userId: user.id,
      name: user.full_name ?? user.email,
      avatarUrl: user.avatar_url,
      status: 'online',
      lastSeen: new Date().toISOString(),
    });

    return unsubscribe;
  }, [channelName, user]);

  return presence;
}

/**
 * Show typing indicator for a chat channel.
 */
export function useTyping(channelName: string) {
  const { user } = useTenant();
  const [typingUsers, setTypingUsers] = React.useState<PresenceUser[]>([]);
  const typingTimeoutsRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  React.useEffect(() => {
    const manager = getChannelManager();
    const unsubscribe = manager.subscribe<{ userId: string; user: PresenceUser; typing: boolean }>(
      `typing:${channelName}`,
      'chat',
      {
        onMessage: ({ userId, user: typingUser, typing }) => {
          if (userId === user?.id) return;
          setTypingUsers((prev) => {
            const next = prev.filter((u) => u.userId !== userId);
            if (typing) next.push(typingUser);
            return next;
          });
          // Auto-clear after 5s of no updates
          const existing = typingTimeoutsRef.current.get(userId);
          if (existing) clearTimeout(existing);
          if (typing) {
            const t = setTimeout(() => {
              setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
            }, 5000);
            typingTimeoutsRef.current.set(userId, t);
          }
        },
      },
    );
    return () => {
      unsubscribe();
      typingTimeoutsRef.current.forEach(clearTimeout);
    };
  }, [channelName, user?.id]);

  const setTyping = React.useCallback(
    (typing: boolean) => {
      if (!user) return;
      const manager = getChannelManager();
      manager.broadcast(`typing:${channelName}`, {
        userId: user.id,
        user: {
          userId: user.id,
          name: user.full_name ?? user.email,
          avatarUrl: user.avatar_url,
          status: 'online',
          lastSeen: new Date().toISOString(),
        },
        typing,
      });
    },
    [channelName, user],
  );

  return { typingUsers, setTyping };
}
