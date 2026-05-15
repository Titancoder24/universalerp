'use client';

import * as React from 'react';
import {
  Check,
  Filter,
  Github,
  Plug,
  Plus,
  Search,
  Settings,
  Slash,
  Slack,
  Webhook,
  Workflow,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = ['All', 'Communication', 'Email', 'Payments', 'Shipping', 'Analytics', 'Productivity', 'Developer'];

const integrations = [
  { name: 'Slack', category: 'Communication', icon: '💬', description: 'Send notifications and updates to Slack channels', connected: true },
  { name: 'Microsoft Teams', category: 'Communication', icon: '👥', description: 'Push events into Teams channels', connected: false },
  { name: 'Discord', category: 'Communication', icon: '🎮', description: 'Webhook-based Discord notifications', connected: false },
  { name: 'Gmail', category: 'Email', icon: '📧', description: 'Send invoices and reminders via Gmail', connected: true },
  { name: 'Outlook', category: 'Email', icon: '📨', description: 'Microsoft 365 mail integration', connected: false },
  { name: 'Mailchimp', category: 'Email', icon: '🐵', description: 'Sync segments and campaigns', connected: false },
  { name: 'SendGrid', category: 'Email', icon: '✉️', description: 'Transactional email via SendGrid', connected: false },
  { name: 'Stripe', category: 'Payments', icon: '💳', description: 'Sync customers and accept card payments', connected: true },
  { name: 'PayPal', category: 'Payments', icon: '🅿️', description: 'Accept PayPal payments and reconcile', connected: false },
  { name: 'Razorpay', category: 'Payments', icon: '💰', description: 'India and APAC payment gateway', connected: false },
  { name: 'FedEx', category: 'Shipping', icon: '📦', description: 'Print labels and track shipments', connected: false },
  { name: 'UPS', category: 'Shipping', icon: '📮', description: 'UPS shipping integration', connected: false },
  { name: 'ShipStation', category: 'Shipping', icon: '🚚', description: 'Multi-carrier shipping platform', connected: false },
  { name: 'Google Analytics', category: 'Analytics', icon: '📊', description: 'Push events to GA4', connected: false },
  { name: 'Mixpanel', category: 'Analytics', icon: '📈', description: 'Product analytics', connected: false },
  { name: 'Zapier', category: 'Productivity', icon: '⚡', description: 'Connect to 5000+ apps via Zapier', connected: true },
  { name: 'Make.com', category: 'Productivity', icon: '🔧', description: 'Visual automation builder', connected: false },
  { name: 'n8n', category: 'Productivity', icon: '🔄', description: 'Open-source automation', connected: false },
  { name: 'Google Drive', category: 'Productivity', icon: '📁', description: 'Sync documents to Drive', connected: false },
  { name: 'Dropbox', category: 'Productivity', icon: '📂', description: 'Dropbox file sync', connected: false },
  { name: 'GitHub', category: 'Developer', icon: '🐙', description: 'Sync issues and PRs', connected: true },
  { name: 'GitLab', category: 'Developer', icon: '🦊', description: 'GitLab repo and CI integration', connected: false },
  { name: 'Webhooks', category: 'Developer', icon: '🔌', description: 'Custom HTTP webhooks for any event', connected: true },
  { name: 'REST API', category: 'Developer', icon: '🔑', description: 'Personal access tokens for the API', connected: true },
];

export default function IntegrationsPage() {
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState('All');

  const filtered = integrations.filter((i) => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = tab === 'All' || i.category === tab;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Integrations"
        description="Connect your favorite tools — chat, email, payments, shipping, analytics, and more."
        actions={
          <Button variant="outline">
            <Plus className="size-4" /> Custom integration
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">{integrations.filter((i) => i.connected).length}</div>
            <div className="text-xs text-muted-foreground">Connected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">{integrations.length}</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">2,431</div>
            <div className="text-xs text-muted-foreground">Events sent today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime (30d)</div>
          </CardContent>
        </Card>
      </div>

      {/* Browse */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Search integrations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList className="flex-wrap h-auto">
              {categories.map((c) => (
                <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={tab} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((i) => (
                  <Card key={i.name} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">
                          {i.icon}
                        </div>
                        {i.connected ? (
                          <Badge variant="success" className="gap-1">
                            <Check className="size-3" /> Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline">Available</Badge>
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="font-semibold">{i.name}</div>
                        <div className="text-2xs uppercase tracking-wider text-muted-foreground mt-0.5">{i.category}</div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{i.description}</p>
                      <div className="mt-3">
                        {i.connected ? (
                          <Button variant="outline" size="sm" className="w-full">
                            <Settings className="size-3.5" /> Configure
                          </Button>
                        ) : (
                          <Button size="sm" className="w-full">
                            <Plug className="size-3.5" /> Connect
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
