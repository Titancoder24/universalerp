'use client';

import * as React from 'react';
import {
  Camera,
  Fingerprint,
  Globe,
  Key,
  Mail,
  Phone,
  Save,
  Shield,
  Smartphone,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenant } from '@/components/providers/tenant-provider';
import { initials, colorFromString, formatRelativeTime } from '@/lib/utils';

const sessions = [
  { id: 1, device: 'MacBook Pro · Chrome', location: 'San Francisco, US', ip: '203.45.123.10', current: true, lastActive: new Date() },
  { id: 2, device: 'iPhone 15 · Safari', location: 'San Francisco, US', ip: '198.21.4.5', current: false, lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 3, device: 'Windows · Edge', location: 'Austin, US', ip: '101.32.5.4', current: false, lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
];

export default function ProfilePage() {
  const { user } = useTenant();

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="My Profile" description="Manage your personal info, security, and preferences." />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile photo</CardTitle>
              <CardDescription>This appears in your avatar across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar size="xl">
                  <AvatarFallback style={{ backgroundColor: colorFromString(user?.full_name ?? 'User') }} className="text-white text-xl">
                    {initials(user?.full_name ?? user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Camera className="size-3.5" /> Upload</Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="size-3.5" /> Remove</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or GIF · Max 2MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>First name</Label>
                  <Input defaultValue={user?.first_name ?? 'Demo'} />
                </div>
                <div className="space-y-1.5">
                  <Label>Last name</Label>
                  <Input defaultValue={user?.last_name ?? 'User'} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Display name</Label>
                <Input defaultValue={user?.display_name ?? 'Demo'} />
                <p className="text-xs text-muted-foreground">Shown in chat and mentions.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="flex gap-2">
                  <Input defaultValue={user?.email ?? ''} disabled className="flex-1" />
                  <Badge variant="success">Verified</Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input defaultValue={user?.phone ?? ''} placeholder="+1 (555) 123-4567" />
              </div>

              <div className="flex justify-end">
                <Button><Save className="size-4" /> Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Last changed 3 months ago. Consider rotating it.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button><Key className="size-4" /> Change password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-factor authentication</CardTitle>
              <CardDescription>Add a second factor to your sign-in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Smartphone className="size-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Authenticator app (TOTP)</div>
                    <div className="text-xs text-muted-foreground">Google Authenticator, 1Password, Authy, etc.</div>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Fingerprint className="size-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Passkey (WebAuthn)</div>
                    <div className="text-xs text-muted-foreground">Face ID, Touch ID, Windows Hello, hardware keys</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Set up passkey</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (United States)</SelectItem>
                      <SelectItem value="en-GB">English (United Kingdom)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      <SelectItem value="Asia/Kolkata">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Date format</Label>
                  <Select defaultValue="YYYY-MM-DD">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">2026-05-15</SelectItem>
                      <SelectItem value="MM/DD/YYYY">05/15/2026</SelectItem>
                      <SelectItem value="DD/MM/YYYY">15/05/2026</SelectItem>
                      <SelectItem value="DD-MMM-YYYY">15-May-2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Time format</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (14:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active sessions</CardTitle>
              <CardDescription>Devices currently signed in to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Globe className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{s.device}</span>
                        {s.current && <Badge variant="success" className="text-2xs">This device</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.location} · {s.ip} · {formatRelativeTime(s.lastActive)}
                      </div>
                    </div>
                  </div>
                  {!s.current && <Button variant="outline" size="sm">Revoke</Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose how you want to be notified for each event type.</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th className="text-center">In-app</th>
                    <th className="text-center">Push</th>
                    <th className="text-center">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'Direct messages',
                    'Mentions in channels',
                    'Invoice paid',
                    'Quote accepted',
                    'Assigned tasks',
                    'Workflow approvals',
                    'Daily digest',
                    'System announcements',
                  ].map((event) => (
                    <tr key={event}>
                      <td className="font-medium">{event}</td>
                      <td className="text-center"><Switch defaultChecked /></td>
                      <td className="text-center"><Switch defaultChecked /></td>
                      <td className="text-center"><Switch /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
