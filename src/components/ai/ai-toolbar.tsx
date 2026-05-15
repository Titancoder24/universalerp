'use client';

import * as React from 'react';
import {
  ArrowRight,
  Bot,
  Languages,
  Lightbulb,
  Loader2,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface AIToolbarProps {
  recordType: string;
  recordId: string;
  recordName?: string;
}

const actions = [
  { key: 'summarize', icon: Wand2, label: 'Summarize', description: 'Concise summary of this record and recent activity' },
  { key: 'draft_reply', icon: Bot, label: 'Draft reply', description: 'Compose a professional reply' },
  { key: 'translate', icon: Languages, label: 'Translate', description: 'Translate to another language' },
  { key: 'explain', icon: Lightbulb, label: 'Explain', description: 'Plain-language explanation of this record' },
  { key: 'find_similar', icon: Search, label: 'Find similar', description: 'Surface related records' },
  { key: 'next_action', icon: ArrowRight, label: 'Suggest next action', description: 'AI recommendation for what to do next' },
];

export function AIToolbar({ recordType, recordId, recordName }: AIToolbarProps) {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    setTimeout(() => setLoading(null), 1200);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="size-3.5 text-primary" />
          AI
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary" />
          AI actions for {recordName ?? recordType}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((a) => (
          <DropdownMenuItem
            key={a.key}
            onSelect={() => handleAction(a.key)}
            className="flex flex-col items-start gap-0.5"
          >
            <div className="flex items-center gap-2">
              {loading === a.key ? <Loader2 className="size-3.5 animate-spin" /> : <a.icon className="size-3.5" />}
              <span className="font-medium">{a.label}</span>
            </div>
            <span className="ml-5 text-2xs text-muted-foreground">{a.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
