'use client';

import * as React from 'react';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatRelativeTime } from '@/lib/utils';

const tickets = [
  { id: 'TKT-1024', subject: 'How do I export invoices in bulk?', priority: 'normal', status: 'in_progress' as const, lastReply: new Date(Date.now() - 1000 * 60 * 60 * 4), agent: 'Diego S.', replies: 3 },
  { id: 'TKT-1019', subject: 'Configure custom workflow for approvals', priority: 'normal', status: 'open' as const, lastReply: new Date(Date.now() - 1000 * 60 * 60 * 24), agent: null, replies: 0 },
  { id: 'TKT-0998', subject: 'Question about Q1 invoice INV-2078', priority: 'high', status: 'resolved' as const, lastReply: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), agent: 'Sarah C.', replies: 8 },
  { id: 'TKT-0987', subject: 'Add SSO integration with Okta', priority: 'normal', status: 'closed' as const, lastReply: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), agent: 'Marcus R.', replies: 5 },
];

export default function PortalSupportPage() {
  const [search, setSearch] = React.useState('');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Support</h1>
          <p className="text-muted-foreground">Get help from our team</p>
        </div>
        <Button><Plus className="size-4" /> New ticket</Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search tickets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <MessageSquare className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-medium text-primary">{t.id}</span>
                      <StatusBadge status={t.status} />
                      {t.priority === 'high' && <Badge variant="destructive" className="text-2xs">High</Badge>}
                    </div>
                    <div className="mt-0.5 font-medium">{t.subject}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {t.replies} replies · last activity {formatRelativeTime(t.lastReply)}
                      {t.agent && ` · ${t.agent}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
