'use client';

import * as React from 'react';
import {
  Building2,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatCurrency, initials, colorFromString, formatRelativeTime } from '@/lib/utils';

const tenants = [
  { id: 1, name: 'Acme Industries Inc.', slug: 'acme', plan: 'Enterprise', users: 142, mrr: 3500, since: '2024-09-12', status: 'active', industry: 'Manufacturing', country: 'US', storage: 12.4 },
  { id: 2, name: 'TechCorp Solutions', slug: 'techcorp', plan: 'Pro', users: 38, mrr: 950, since: '2025-01-15', status: 'active', industry: 'Software', country: 'US', storage: 5.8 },
  { id: 3, name: 'Global Manufacturing', slug: 'global-mfg', plan: 'Enterprise', users: 89, mrr: 2400, since: '2025-03-04', status: 'active', industry: 'Manufacturing', country: 'DE', storage: 24.1 },
  { id: 4, name: 'StartupCo', slug: 'startupco', plan: 'Starter', users: 8, mrr: 99, since: '2026-04-22', status: 'trial', industry: 'SaaS', country: 'US', storage: 0.4 },
  { id: 5, name: 'Pacific Retail Group', slug: 'pacific-retail', plan: 'Pro', users: 24, mrr: 760, since: '2026-05-01', status: 'active', industry: 'Retail', country: 'AU', storage: 8.2 },
  { id: 6, name: 'Innovate Labs', slug: 'innovate', plan: 'Pro', users: 31, mrr: 825, since: '2026-02-18', status: 'active', industry: 'R&D', country: 'UK', storage: 14.5 },
  { id: 7, name: 'Sigma Logistics', slug: 'sigma', plan: 'Enterprise', users: 64, mrr: 1800, since: '2025-11-08', status: 'active', industry: 'Logistics', country: 'IN', storage: 18.7 },
  { id: 8, name: 'Beacon Health', slug: 'beacon', plan: 'Enterprise', users: 124, mrr: 3100, since: '2025-07-22', status: 'active', industry: 'Healthcare', country: 'CA', storage: 32.4 },
  { id: 9, name: 'NorthStar Construction', slug: 'northstar', plan: 'Pro', users: 19, mrr: 580, since: '2026-01-12', status: 'active', industry: 'Construction', country: 'NO', storage: 6.1 },
  { id: 10, name: 'GreenLeaf Co-op', slug: 'greenleaf', plan: 'Starter', users: 6, mrr: 75, since: '2026-05-10', status: 'trial', industry: 'Non-profit', country: 'BR', storage: 0.2 },
  { id: 11, name: 'Quantum Dynamics', slug: 'quantum', plan: 'Pro', users: 42, mrr: 1080, since: '2025-09-30', status: 'suspended', industry: 'Engineering', country: 'JP', storage: 9.8 },
  { id: 12, name: 'Sunset Hospitality', slug: 'sunset', plan: 'Starter', users: 12, mrr: 149, since: '2026-03-15', status: 'active', industry: 'Hospitality', country: 'ES', storage: 2.3 },
];

export default function TenantsPage() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = tenants.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || t.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Tenants"
        description="Every workspace on this platform installation."
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" /> New tenant</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Provision new tenant</DialogTitle>
                <DialogDescription>
                  We'll create the tenant, seed sample data, and generate a magic link for the admin user.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Company name</Label>
                  <Input placeholder="Acme Corp" />
                </div>
                <div className="space-y-1.5">
                  <Label>Admin email</Label>
                  <Input type="email" placeholder="admin@acme.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Plan</Label>
                    <Select defaultValue="starter">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Data residency</Label>
                    <Select defaultValue="us">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="eu">Europe</SelectItem>
                        <SelectItem value="apac">Asia-Pacific</SelectItem>
                        <SelectItem value="mena">Middle East / Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => setCreateOpen(false)}>Create tenant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search tenants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="size-3.5" /> More filters
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Plan</th>
                <th>Industry</th>
                <th>Country</th>
                <th className="text-center">Users</th>
                <th className="text-right">MRR</th>
                <th className="text-right">Storage</th>
                <th>Created</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="cursor-pointer">
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback style={{ backgroundColor: colorFromString(t.name) }} className="text-white text-xs">
                          {initials(t.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-2xs text-muted-foreground font-mono">{t.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={t.plan === 'Enterprise' ? 'default' : t.plan === 'Pro' ? 'soft' : 'outline'}>
                      {t.plan}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground">{t.industry}</td>
                  <td>
                    <span className="font-mono text-xs">{t.country}</span>
                  </td>
                  <td className="text-center">{t.users}</td>
                  <td className="text-right font-mono">{formatCurrency(t.mrr)}</td>
                  <td className="text-right font-mono">{t.storage} GB</td>
                  <td className="text-xs text-muted-foreground">{t.since}</td>
                  <td>
                    <Badge variant={
                      t.status === 'active' ? 'success' :
                      t.status === 'trial' ? 'warning' : 'destructive'
                    }>{t.status}</Badge>
                  </td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open workspace</DropdownMenuItem>
                        <DropdownMenuItem>Edit details</DropdownMenuItem>
                        <DropdownMenuItem>Change plan</DropdownMenuItem>
                        <DropdownMenuItem>Impersonate admin</DropdownMenuItem>
                        <DropdownMenuItem>Export data (GDPR)</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Suspend tenant</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
