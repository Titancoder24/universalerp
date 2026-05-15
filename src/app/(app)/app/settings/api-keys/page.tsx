'use client';

import * as React from 'react';
import { Copy, Eye, EyeOff, Key, Plus, Trash2, Webhook } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, formatRelativeTime } from '@/lib/utils';

const apiKeys = [
  { id: 1, name: 'Production API', key: 'erp_live_pk_abc123...xyz789', created: '2025-09-15', lastUsed: new Date(Date.now() - 1000 * 60 * 5), scopes: ['read', 'write'] },
  { id: 2, name: 'Webhook receiver', key: 'erp_live_pk_def456...uvw012', created: '2025-11-20', lastUsed: new Date(Date.now() - 1000 * 60 * 30), scopes: ['webhooks'] },
  { id: 3, name: 'Mobile app integration', key: 'erp_live_pk_ghi789...rst345', created: '2026-02-10', lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 4), scopes: ['read'] },
];

const webhooks = [
  { id: 1, url: 'https://acme.com/webhooks/erp', events: ['invoice.paid', 'invoice.overdue'], status: 'active', deliveries: 1247 },
  { id: 2, url: 'https://acme.com/webhooks/inventory', events: ['stock.low'], status: 'active', deliveries: 234 },
];

export default function ApiKeysPage() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [showKey, setShowKey] = React.useState<number | null>(null);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="API Keys & Webhooks"
        description="Personal access tokens for the REST API and outbound webhook subscriptions."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> New API key
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Use these tokens to authenticate API calls. Keep them secret — anyone with the key can access your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Scopes</th>
                <th>Created</th>
                <th>Last used</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((k) => (
                <tr key={k.id}>
                  <td className="font-medium">{k.name}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <code className="font-mono text-xs">
                        {showKey === k.id ? k.key : k.key.replace(/(?<=.{12}).+(?=.{6})/, '••••••••')}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setShowKey(showKey === k.id ? null : k.id)}
                      >
                        {showKey === k.id ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                      </Button>
                      <Button variant="ghost" size="icon-xs"><Copy className="size-3" /></Button>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <Badge key={s} variant="outline" className="text-2xs">{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">{formatDate(k.created)}</td>
                  <td className="text-xs text-muted-foreground">{formatRelativeTime(k.lastUsed)}</td>
                  <td className="text-right">
                    <Button variant="ghost" size="icon-sm" className="text-destructive">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>HTTP endpoints we'll call when events happen in your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {webhooks.map((w) => (
            <div key={w.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Webhook className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <code className="font-mono text-sm">{w.url}</code>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {w.events.map((e) => (
                        <Badge key={e} variant="outline" className="text-2xs">{e}</Badge>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {w.deliveries} deliveries · 99.4% success rate
                    </div>
                  </div>
                </div>
                <Badge variant="success">{w.status}</Badge>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            <Plus className="size-4" /> Add webhook
          </Button>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new API key</DialogTitle>
            <DialogDescription>
              You'll see the full key only once. Copy and save it somewhere safe.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="e.g., Production API" />
            </div>
            <div className="space-y-1.5">
              <Label>Scopes</Label>
              <Select defaultValue="read">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read only</SelectItem>
                  <SelectItem value="write">Read + write</SelectItem>
                  <SelectItem value="admin">Full admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Expiry</Label>
              <Select defaultValue="never">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never (recommended for production)</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="365d">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button><Key className="size-4" /> Generate key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
