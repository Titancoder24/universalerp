'use client';

import { Download, File, FileText, Image as ImageIcon, Video } from 'lucide-react';
import type { ChatAttachment } from './types';
import { formatFileSize } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatAttachmentRenderProps {
  attachment: ChatAttachment;
}

export function ChatAttachmentRender({ attachment }: ChatAttachmentRenderProps) {
  if (attachment.type === 'image') {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
        <div className="aspect-video bg-gradient-to-br from-primary/10 via-info/10 to-success/10 flex items-center justify-center text-muted-foreground">
          <ImageIcon className="size-10 opacity-30" />
        </div>
        <div className="flex items-center justify-between px-3 py-2 text-xs">
          <div className="min-w-0">
            <div className="truncate font-medium">{attachment.name}</div>
            <div className="text-muted-foreground">{formatFileSize(attachment.size ?? 0)}</div>
          </div>
          <Button variant="ghost" size="icon-sm">
            <Download className="size-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  const Icon = attachment.type === 'video' ? Video : attachment.mimeType?.includes('pdf') ? FileText : File;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 hover:bg-muted/40 transition-colors">
      <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium">{attachment.name}</div>
        <div className="text-2xs text-muted-foreground">{formatFileSize(attachment.size ?? 0)}</div>
      </div>
      <Button variant="ghost" size="icon-xs">
        <Download className="size-3" />
      </Button>
    </div>
  );
}
