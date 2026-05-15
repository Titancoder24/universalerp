'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Save, Shield, Trash2, UserCog } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label as ShadLabel } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { modules, pillarLabels, type ModulePillar } from '@/lib/modules/registry';
import { initials, colorFromString, cn } from '@/lib/utils';

const PERMISSION_LEVELS = ['none', 'read', 'write', 'approve', 'admin'] as const;

export default function UserDetailPage() {
  const [moduleAccess, setModuleAccess] = React.useState<Record<string, string>>({
    sales: 'write',
    'sales.customers': 'write',
    'sales.invoices': 'write',
    crm: 'write',
    'crm.leads': 'admin',
    'crm.opportunities': 'write',
    inventory: 'read',
    chat: 'read',
  });

  const tenantModules = modules.filter((m) => m.pillar !== 'platform');
  const byPillar = tenantModules.reduce(
    (acc, m) => {
      (acc[m.pillar] ||= []).push(m);
      return acc;
    },
    {} as Record<ModulePillar, typeof modules>,
  );

  const setLevel = (code: string, level: string) => {
    setModuleAccess((prev) => ({ ...prev, [code]: level }));
  };

  const summary = {
    admin: Object.values(moduleAccess).filter((v) => v === 'admin').length,
    approve: Object.values(moduleAccess).filter((v) => v === 'approve').length,
    write: Object.values(moduleAccess).filter((v) => v === 'write').length,
    read: Object.values(moduleAccess).filter((v) => v === 'read').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href="/app/settings/users"><ArrowLeft className="size-4" /> Back to users</Link>
        </Button>
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback style={{ backgroundColor: colorFromString('Sarah Chen') }} className="text-white">
                  {initials('Sarah Chen')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>Sarah Chen</div>
                <div className="text-sm text-muted-foreground font-normal">sarah.chen@acme.com</div>
              </div>
            </div>
          }
          actions={
            <>
              <Button variant="outline"><Lock className="size-4" /> Reset password</Button>
              <Button><Save className="size-4" /> Save changes</Button>
            </>
          }
        />
      </div>

      <Tabs defaultValue="permissions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="permissions">Module Access</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Personal info</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>First name</Label><Input defaultValue="Sarah" /></div>
              <div className="space-y-1.5"><Label>Last name</Label><Input defaultValue="Chen" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input defaultValue="sarah.chen@acme.com" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+1-415-555-0142" /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Job details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Title</Label><Input defaultValue="Sales Manager" /></div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select defaultValue="sales"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Manager</Label>
                <Select defaultValue="marcus"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marcus">Marcus Rodriguez (CTO)</SelectItem>
                    <SelectItem value="aisha">Aisha Patel (CFO)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Branch</Label><Input defaultValue="San Francisco HQ" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick assignment</CardTitle>
              <CardDescription>Apply a role template to bulk-set permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Tenant Admin', 'Salesperson', 'Sales Manager', 'Accountant', 'HR Admin', 'Warehouse Worker'].map((r) => (
                  <Button key={r} variant="outline" size="sm">{r}</Button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Badge variant="default">Admin: {summary.admin}</Badge>
                <Badge variant="soft">Approve: {summary.approve}</Badge>
                <Badge variant="info">Write: {summary.write}</Badge>
                <Badge variant="outline">Read: {summary.read}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Module access</CardTitle>
              <CardDescription>Fine-tune per-module permissions. Levels stack: Admin includes Approve, Write, and Read.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(byPillar).map(([pillar, items]) => (
                <div key={pillar}>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {pillarLabels[pillar as ModulePillar]}
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="erp-table">
                      <thead>
                        <tr>
                          <th>Module</th>
                          <th className="text-center w-16">None</th>
                          <th className="text-center w-16">Read</th>
                          <th className="text-center w-16">Write</th>
                          <th className="text-center w-16">Approve</th>
                          <th className="text-center w-16">Admin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((m) => (
                          <tr key={m.code}>
                            <td>
                              <div className="flex items-center gap-2">
                                <m.icon className="size-3.5 text-primary" />
                                <span>{m.name}</span>
                              </div>
                            </td>
                            {PERMISSION_LEVELS.map((level) => (
                              <td key={level} className="text-center">
                                <input
                                  type="radio"
                                  name={m.code}
                                  value={level}
                                  checked={(moduleAccess[m.code] ?? 'none') === level}
                                  onChange={() => setLevel(m.code, level)}
                                  className="accent-primary"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Authentication</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Two-factor authentication</div>
                  <div className="text-xs text-muted-foreground">User enabled TOTP on May 8, 2025</div>
                </div>
                <Badge variant="success" className="gap-1"><Shield className="size-3" /> Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Force password reset on next login</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Force MFA setup</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Disable user</div>
                  <div className="text-xs text-muted-foreground">User cannot sign in but data is preserved</div>
                </div>
                <Button variant="outline" className="text-destructive">Disable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Force sign out all sessions</div>
                  <div className="text-xs text-muted-foreground">Revoke all active tokens</div>
                </div>
                <Button variant="outline" className="text-destructive">Force logout</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Activity timeline for this user — coming soon. Audit log already captures everything.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
