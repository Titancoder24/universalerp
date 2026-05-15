'use client';

import * as React from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  Filter,
  Link as LinkIcon,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Upload,
  UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { toast } from '@/components/ui/toast';
import { initials, colorFromString, formatRelativeTime } from '@/lib/utils';

const users = [
  { id: 1, name: 'Sarah Chen', email: 'sarah.chen@acme.com', role: 'Sales Manager', department: 'Sales', status: 'active', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 2, name: 'Marcus Rodriguez', email: 'marcus.r@acme.com', role: 'CTO', department: 'Engineering', status: 'active', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 3, name: 'Aisha Patel', email: 'aisha.p@acme.com', role: 'CFO', department: 'Finance', status: 'active', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4) },
  { id: 4, name: 'Jake Thompson', email: 'jake.t@acme.com', role: 'Plant Manager', department: 'Operations', status: 'active', mfa: false, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 5, name: 'Emma Williams', email: 'emma.w@acme.com', role: 'Marketing Manager', department: 'Marketing', status: 'active', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6) },
  { id: 6, name: 'Liu Wei', email: 'liu.w@acme.com', role: 'Senior Engineer', department: 'Engineering', status: 'active', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12) },
  { id: 7, name: 'Diego Santos', email: 'diego.s@acme.com', role: 'Support Lead', department: 'Customer Service', status: 'active', mfa: false, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 8) },
  { id: 8, name: 'Priya Sharma', email: 'priya.s@acme.com', role: 'HR Director', department: 'HR', status: 'active', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: 9, name: 'Tom Becker', email: 'tom.b@acme.com', role: 'Account Executive', department: 'Sales', status: 'active', mfa: false, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 18) },
  { id: 10, name: 'Yuki Tanaka', email: 'yuki.t@acme.com', role: 'Designer', department: 'Marketing', status: 'pending', mfa: false, lastLogin: null },
  { id: 11, name: 'Carlos Mendez', email: 'carlos.m@acme.com', role: 'Logistics Coord.', department: 'Operations', status: 'active', mfa: false, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 36) },
  { id: 12, name: 'Anna Kowalski', email: 'anna.k@acme.com', role: 'Accountant', department: 'Finance', status: 'disabled', mfa: false, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
];

export default function UsersPage() {
  const [search, setSearch] = React.useState('');
  const [inviteOpen, setInviteOpen] = React.useState(false);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  const counts = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    pending: users.filter((u) => u.status === 'pending').length,
    disabled: users.filter((u) => u.status === 'disabled').length,
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Users & Permissions"
        description="Manage who has access to your workspace and what they can do."
        actions={
          <>
            <Button variant="outline">
              <Upload className="size-4" />
              Import CSV
            </Button>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="size-4" />
                  Invite user
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a new user</DialogTitle>
                  <DialogDescription>
                    We'll generate a magic link you can share through your preferred channel. The user sets their password on first sign-in.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>First name</Label>
                      <Input placeholder="Jane" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Last name</Label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" placeholder="jane@acme.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Role template</Label>
                      <Select defaultValue="employee">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="salesperson">Salesperson</SelectItem>
                          <SelectItem value="accountant">Accountant</SelectItem>
                          <SelectItem value="custom">Custom…</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                  <Button onClick={() => { toast.success('Magic link generated', { description: 'Copy and share with the new user.' }); setInviteOpen(false); }}>
                    <LinkIcon className="size-4" /> Generate magic link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total users', value: counts.total, color: 'text-foreground' },
          { label: 'Active', value: counts.active, color: 'text-success' },
          { label: 'Pending invite', value: counts.pending, color: 'text-warning' },
          { label: 'Disabled', value: counts.disabled, color: 'text-muted-foreground' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className={`mt-1 text-2xl font-semibold ${s.color}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search users by name, email, or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" />
              Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Download className="size-3.5" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>MFA</th>
                <th>Last activity</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback style={{ backgroundColor: colorFromString(u.name) }} className="text-white text-xs">
                          {initials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.role}</td>
                  <td className="text-muted-foreground">{u.department}</td>
                  <td>
                    <Badge variant={u.status === 'active' ? 'success' : u.status === 'pending' ? 'warning' : 'secondary'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td>
                    {u.mfa ? (
                      <Badge variant="soft" className="gap-1"><Shield className="size-3" /> On</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Off</Badge>
                    )}
                  </td>
                  <td className="text-xs text-muted-foreground">
                    {u.lastLogin ? formatRelativeTime(u.lastLogin) : 'Never'}
                  </td>
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit profile</DropdownMenuItem>
                        <DropdownMenuItem>Module access</DropdownMenuItem>
                        <DropdownMenuItem>Reset password</DropdownMenuItem>
                        <DropdownMenuItem>Force logout</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Disable user</DropdownMenuItem>
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
