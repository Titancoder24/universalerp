'use client';

import * as React from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatVoiceNoteProps {
  note: {
    durationSeconds: number;
    transcript?: string;
    waveform?: number[];
  };
}

export function ChatVoiceNote({ note }: ChatVoiceNoteProps) {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setProgress((p) => {
          const next = p + 0.5 / note.durationSeconds;
          if (next >= 1) {
            setPlaying(false);
            return 0;
          }
          return next;
        });
      }, 500);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, note.durationSeconds]);

  const wf = note.waveform ?? new Array(40).fill(10);
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const current = Math.floor(note.durationSeconds * progress);

  return (
    <div className="mt-2 inline-block max-w-md rounded-lg border border-border bg-card p-2">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="default"
          className="rounded-full"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4 fill-current pl-0.5" />}
        </Button>
        <div className="flex h-9 flex-1 items-center gap-px">
          {wf.map((h, i) => {
            const reached = i / wf.length <= progress;
            return (
              <div
                key={i}
                className={cn(
                  'w-0.5 rounded-full transition-colors',
                  reached ? 'bg-primary' : 'bg-primary/30',
                )}
                style={{ height: `${Math.max(h * 1.2, 6)}px` }}
              />
            );
          })}
        </div>
        <div className="font-mono text-xs tabular-nums text-muted-foreground">
          {playing ? formatTime(current) : formatTime(note.durationSeconds)}
        </div>
      </div>
      {note.transcript && (
        <details className="mt-2 cursor-pointer text-xs text-muted-foreground">
          <summary className="hover:text-foreground">Show transcript</summary>
          <p className="mt-1.5 italic">{note.transcript}</p>
        </details>
      )}
    </div>
  );
}
