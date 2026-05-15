'use client';

import * as React from 'react';
import {
  CircleDollarSign,
  Download,
  Filter,
  History,
  LogIn,
  Pencil,
  Plus,
  Search,
  Settings,
  Shield,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateTime, initials, colorFromString } from '@/lib/utils';
import { cn } from '@/lib/utils';

const events = [
  { id: 1, action: 'invoice.created', user: 'Sarah Chen', resource: 'INV-2089', details: 'Created invoice for $12,450', at: new Date(Date.now() - 1000 * 60 * 8), ip: '203.45.123.10', category: 'sales' },
  { id: 2, action: 'user.login', user: 'Aisha Patel', resource: 'session_abc123', details: 'Successful login via password', at: new Date(Date.now() - 1000 * 60 * 15), ip: '198.21.4.5', category: 'auth' },
  { id: 3, action: 'permission.changed', user: 'You', resource: 'Jake Thompson', details: 'Granted "approve" access to hrms.payroll', at: new Date(Date.now() - 1000 * 60 * 25), ip: '203.45.123.1', category: 'security' },
  { id: 4, action: 'invoice.updated', user: 'Sarah Chen', resource: 'INV-2087', details: 'Updated status: partial → paid', at: new Date(Date.now() - 1000 * 60 * 45), ip: '203.45.123.10', category: 'sales' },
  { id: 5, action: 'employee.created', user: 'Priya Sharma', resource: 'EMP-0142', details: 'Hired Yuki Tanaka as Designer', at: new Date(Date.now() - 1000 * 60 * 60 * 2), ip: '188.32.5.4', category: 'hr' },
  { id: 6, action: 'po.approved', user: 'Marcus Rodriguez', resource: 'PO-3014', details: 'Approved PO for $24,500', at: new Date(Date.now() - 1000 * 60 * 60 * 3), ip: '198.21.4.5', category: 'procurement' },
  { id: 7, action: 'tenant.updated', user: 'You', resource: 'theme', details: 'Changed theme preset from Stripe Clean to Tailwind Pro', at: new Date(Date.now() - 1000 * 60 * 60 * 5), ip: '203.45.123.1', category: 'settings' },
  { id: 8, action: 'user.invited', user: 'You', resource: 'tom.b@acme.com', details: 'Invited Tom Becker as Account Executive', at: new Date(Date.now() - 1000 * 60 * 60 * 8), ip: '203.45.123.1', category: 'security' },
  { id: 9, action: 'stock.adjusted', user: 'Jake Thompson', resource: 'SKU-A-12', details: 'Adjusted stock: 24 → 12 (variance investigation)', at: new Date(Date.now() - 1000 * 60 * 60 * 12), ip: '188.32.5.4', category: 'inventory' },
  { id: 10, action: 'journal.posted', user: 'Aisha Patel', resource: 'JE-0451', details: 'Posted accrual journal for May closing', at: new Date(Date.now() - 1000 * 60 * 60 * 18), ip: '198.21.4.5', category: 'finance' },
  { id: 11, action: 'document.signed', user: 'External: john@bigcorp.com', resource: 'QT-2089', details: 'Customer accepted quote with e-signature', at: new Date(Date.now() - 1000 * 60 * 60 * 24), ip: '102.39.21.4', category: 'sales' },
  { id: 12, action: 'integration.connected', user: 'Marcus Rodriguez', resource: 'GitHub', details: 'Connected GitHub workspace acme-org', at: new Date(Date.now() - 1000 * 60 * 60 * 48), ip: '198.21.4.5', category: 'integrations' },
];

const actionIcons: Record<string, any> = {
  'invoice.created': Plus,
  'invoice.updated': Pencil,
  'user.login': LogIn,
  'user.invited': UserPlus,
  'permission.changed': Shield,
  'employee.created': UserPlus,
  'po.approved': CircleDollarSign,
  'tenant.updated': Settings,
  'stock.adjusted': Pencil,
  'journal.posted': CircleDollarSign,
  'document.signed': Plus,
  'integration.connected': Settings,
};

const categoryColors: Record<string, string> = {
  sales: 'bg-primary/10 text-primary',
  auth: 'bg-info/10 text-info',
  security: 'bg-destructive/10 text-destructive',
  hr: 'bg-purple-500/10 text-purple-500',
  procurement: 'bg-warning/10 text-warning',
  settings: 'bg-muted-foreground/10 text-muted-foreground',
  inventory: 'bg-success/10 text-success',
  finance: 'bg-info/10 text-info',
  integrations: 'bg-muted-foreground/10 text-muted-foreground',
};

export default function AuditLogPage() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<string>('all');

  const filtered = events.filter((e) => {
    const matchSearch = !search ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || e.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Audit Log"
        description="Immutable record of every significant action in your workspace. Tamper-proof and searchable."
        actions={
          <Button variant="outline">
            <Download className="size-4" /> Export
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search by action, user, resource…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" /> Date range
            </Button>
          </div>

          <div className="space-y-2">
            {filtered.map((event) => {
              const Icon = actionIcons[event.action] ?? History;
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', categoryColors[event.category])}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-medium text-primary">{event.action}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{event.resource}</span>
                    </div>
                    <div className="mt-1 text-sm">{event.details}</div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-2xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar size="xs">
                          <AvatarFallback style={{ backgroundColor: colorFromString(event.user) }} className="text-white text-[8px]">
                            {initials(event.user)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{event.user}</span>
                      </div>
                      <span>·</span>
                      <span>{formatDateTime(event.at)}</span>
                      <span>·</span>
                      <span className="font-mono">{event.ip}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-2xs uppercase tracking-wider shrink-0">
                    {event.category}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
