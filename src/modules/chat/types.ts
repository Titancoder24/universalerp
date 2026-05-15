export type ChatChannelType = 'public' | 'private' | 'announcement' | 'dm' | 'group_dm';

export interface ChatChannel {
  id: string;
  name: string;
  slug: string;
  type: ChatChannelType;
  description?: string;
  memberCount: number;
  unread: number;
  hasMention: boolean;
  isMuted: boolean;
  isPinned: boolean;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  emoji?: string;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  title?: string;
}

export interface ChatReaction {
  emoji: string;
  count: number;
  reactedByMe?: boolean;
  users?: string[];
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
  duration?: number; // for audio/video
  width?: number;
  height?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  threadId?: string;
  parentMessageId?: string;
  author: ChatUser;
  body: string;
  blocks?: any[];
  attachments?: ChatAttachment[];
  reactions?: ChatReaction[];
  mentions?: string[];
  createdAt: string;
  editedAt?: string;
  pinned?: boolean;
  threadReplyCount?: number;
  threadParticipants?: ChatUser[];
  threadLastReplyAt?: string;
  type: 'text' | 'system' | 'call' | 'file' | 'voice';
  voiceNote?: {
    durationSeconds: number;
    transcript?: string;
    waveform?: number[];
  };
  callInfo?: {
    duration: number;
    participants: number;
    isVideo: boolean;
  };
  relatedRecord?: {
    type: string;
    id: string;
    name: string;
  };
}
