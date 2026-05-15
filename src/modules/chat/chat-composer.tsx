'use client';

import * as React from 'react';
import {
  AtSign,
  Bold,
  Code2,
  Italic,
  List,
  Mic,
  Paperclip,
  Send,
  Smile,
  Sparkles,
  Video,
  Wand2,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatComposerProps {
  channelName: string;
  channelType: string;
  threadParent?: boolean;
}

export function ChatComposer({ channelName, channelType, threadParent }: ChatComposerProps) {
  const [value, setValue] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    setValue('');
    // toast.success(`Sent to #${channelName}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const placeholder = channelType === 'dm' ? `Message ${channelName}…` : `Message #${channelName}…`;

  return (
    <div className="border-t border-border bg-background p-3">
      <div className="rounded-xl border border-input bg-card shadow-xs focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-border px-2 py-1">
          <Button variant="ghost" size="icon-xs" title="Bold (⌘B)">
            <Bold className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" title="Italic (⌘I)">
            <Italic className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" title="Code">
            <Code2 className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" title="Bulleted list">
            <List className="size-3.5" />
          </Button>
          <div className="mx-1 h-4 w-px bg-border" />
          <Button variant="ghost" size="icon-xs" title="Mention (@)">
            <AtSign className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" title="Emoji">
            <Smile className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" title="Attach file">
            <Paperclip className="size-3.5" />
          </Button>
          <div className="mx-1 h-4 w-px bg-border" />
          <Button variant="ghost" size="xs" title="AI assistant" className="px-2 text-xs">
            <Sparkles className="size-3.5" />
            Ask AI
          </Button>
        </div>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[60px] resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
          rows={2}
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-1.5">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" title="Record voice note">
              <Mic className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Record video">
              <Video className="size-3.5" />
            </Button>
            <span className="ml-2 text-2xs text-muted-foreground hidden sm:inline">
              <kbd className="rounded border border-border bg-card px-1 py-0.5 text-2xs">Enter</kbd> to send,{' '}
              <kbd className="rounded border border-border bg-card px-1 py-0.5 text-2xs">Shift+Enter</kbd> for newline
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-xs">
              <Zap className="size-3.5" />
              Schedule
            </Button>
            <Button onClick={handleSend} size="sm" disabled={!value.trim()}>
              <Send className="size-3.5" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
