'use client';

import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
  Pause,
  Play,
  Plus,
  Send,
  Square,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn, initials, colorFromString } from '@/lib/utils';

type ClockState = 'idle' | 'running' | 'paused';

export default function OperatorTerminalPage() {
  const [clockState, setClockState] = React.useState<ClockState>('idle');
  const [selectedWO, setSelectedWO] = React.useState<string | null>(null);
  const [seconds, setSeconds] = React.useState(0);
  const [andonOpen, setAndonOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);

  React.useEffect(() => {
    if (clockState === 'running') {
      const t = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(t);
    }
  }, [clockState]);

  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const myQueue = [
    { id: 'WO-2089', item: 'Widget Pro 500x', qty: 500, station: 'Line 1', priority: 1 },
    { id: 'WO-2091', item: 'Sprocket Assembly', qty: 100, station: 'Line 1', priority: 2 },
    { id: 'WO-2095', item: 'Custom Mounting Brackets', qty: 240, station: 'Line 1', priority: 3 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 select-none">
      {/* Operator header */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="xl">
                <AvatarFallback style={{ backgroundColor: colorFromString('Jake Thompson') }} className="text-2xl text-white">
                  {initials('Jake Thompson')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-2xl font-bold">Jake Thompson</div>
                <div className="text-muted-foreground">Operator · Line 1 · Shift 1 (06:00-14:00)</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-mono font-bold tabular-nums">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-sm text-muted-foreground">May 15, 2026</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main clock display */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Currently working on</div>
              {selectedWO ? (
                <>
                  <div className="text-3xl font-bold font-mono text-primary">{selectedWO}</div>
                  <div className="text-lg mt-1">
                    {myQueue.find((w) => w.id === selectedWO)?.item}
                  </div>
                </>
              ) : (
                <div className="text-2xl text-muted-foreground">No active work order</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Time on job</div>
              <div className={cn(
                'text-6xl font-mono font-bold tabular-nums',
                clockState === 'running' && 'text-success',
                clockState === 'paused' && 'text-warning',
              )}>
                {formatDuration(seconds)}
              </div>
            </div>
          </div>

          {/* Main action buttons */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {clockState === 'idle' && selectedWO && (
              <Button
                size="xl"
                className="h-24 text-xl"
                onClick={() => setClockState('running')}
              >
                <Play className="size-8 mr-2" />
                Clock On
              </Button>
            )}
            {clockState === 'running' && (
              <>
                <Button
                  size="xl"
                  variant="outline"
                  className="h-24 text-xl"
                  onClick={() => setClockState('paused')}
                >
                  <Pause className="size-8 mr-2" />
                  Pause
                </Button>
                <Button
                  size="xl"
                  className="h-24 text-xl"
                  onClick={() => setReportOpen(true)}
                >
                  <CheckCircle2 className="size-8 mr-2" />
                  Report Production
                </Button>
                <Button
                  size="xl"
                  variant="destructive"
                  className="h-24 text-xl"
                  onClick={() => setAndonOpen(true)}
                >
                  <AlertTriangle className="size-8 mr-2" />
                  Andon
                </Button>
                <Button
                  size="xl"
                  variant="secondary"
                  className="h-24 text-xl"
                  onClick={() => setClockState('idle')}
                >
                  <Square className="size-8 mr-2" />
                  Clock Off
                </Button>
              </>
            )}
            {clockState === 'paused' && (
              <Button
                size="xl"
                className="h-24 text-xl"
                onClick={() => setClockState('running')}
              >
                <Play className="size-8 mr-2" />
                Resume
              </Button>
            )}
            {!selectedWO && (
              <div className="col-span-4 text-center text-muted-foreground py-4">
                Select a work order below to start
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Work order queue */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Queue</h2>
            <Badge variant="outline">{myQueue.length} work orders</Badge>
          </div>
          <div className="space-y-3">
            {myQueue.map((wo) => (
              <Card
                key={wo.id}
                className={cn(
                  'cursor-pointer transition-all',
                  selectedWO === wo.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:shadow-md',
                )}
                onClick={() => setSelectedWO(wo.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary text-lg font-bold">
                        {wo.priority}
                      </div>
                      <div>
                        <div className="font-mono text-lg font-semibold text-primary">{wo.id}</div>
                        <div className="text-base">{wo.item}</div>
                        <div className="text-sm text-muted-foreground">
                          {wo.qty} units · {wo.station}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-6 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Andon Dialog */}
      <Dialog open={andonOpen} onOpenChange={setAndonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" /> Raise Andon
            </DialogTitle>
            <DialogDescription>Notify your supervisor and stop production.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Material shortage', 'Quality issue', 'Machine breakdown', 'Safety concern', 'Tooling issue', 'Other'].map((r) => (
                  <Button key={r} variant="outline" className="h-12">{r}</Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAndonOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setAndonOpen(false)}>
              <Send className="size-4" /> Send Andon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Production Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report production</DialogTitle>
            <DialogDescription>For {selectedWO}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-base">Good units</Label>
              <Input type="number" className="h-14 text-2xl text-center font-mono" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-base">Scrap units</Label>
              <Input type="number" className="h-14 text-2xl text-center font-mono" defaultValue="0" />
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Input placeholder="Any observations..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button onClick={() => setReportOpen(false)}>
              <CheckCircle2 className="size-4" /> Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
