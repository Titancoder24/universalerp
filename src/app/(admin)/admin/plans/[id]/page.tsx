'use client';

import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { modules, pillarLabels, type ModulePillar } from '@/lib/modules/registry';

export default function PlanDetailPage() {
  const tenantModules = modules.filter((m) => m.pillar !== 'platform');
  const byPillar = tenantModules.reduce(
    (acc, m) => {
      (acc[m.pillar] ||= []).push(m);
      return acc;
    },
    {} as Record<ModulePillar, typeof modules>,
  );

  return (
    <div className="space-y-6 p-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/plans"><ArrowLeft className="size-4" /> Back to plans</Link>
      </Button>

      <PageHeader
        title="Pro Plan"
        description="Edit pricing, limits, and module access for this plan."
        actions={
          <>
            <Button variant="outline" className="text-destructive">
              <Trash2 className="size-4" /> Delete plan
            </Button>
            <Button><Save className="size-4" /> Save changes</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Plan code</Label>
                  <Input defaultValue="pro" />
                </div>
                <div className="space-y-1.5">
                  <Label>Display name</Label>
                  <Input defaultValue="Pro Plan" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea defaultValue="For growing businesses. All 100+ modules unlocked." rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Monthly price (USD)</Label>
                  <Input type="number" defaultValue="399" />
                </div>
                <div className="space-y-1.5">
                  <Label>Annual price (USD)</Label>
                  <Input type="number" defaultValue="3990" />
                </div>
                <div className="space-y-1.5">
                  <Label>One-time price (USD, optional)</Label>
                  <Input type="number" placeholder="0 for subscription-only" />
                </div>
                <div className="space-y-1.5">
                  <Label>Trial period (days)</Label>
                  <Input type="number" defaultValue="14" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Max users</Label>
                  <Input type="number" defaultValue="50" />
                </div>
                <div className="space-y-1.5">
                  <Label>Storage (GB)</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div className="space-y-1.5">
                  <Label>AI budget ($/month)</Label>
                  <Input type="number" defaultValue="100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modules included</CardTitle>
              <CardDescription>Toggle individual modules or pillars</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(byPillar).map(([pillar, items]) => (
                <div key={pillar}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {pillarLabels[pillar as ModulePillar]} ({items.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">All</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {items.map((m) => (
                      <label key={m.code} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/40">
                        <div className="flex items-center gap-2">
                          <m.icon className="size-3.5 text-primary" />
                          <span className="text-sm">{m.name}</span>
                        </div>
                        <Switch defaultChecked />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-3xl font-semibold">612</div>
                <div className="text-xs text-muted-foreground">tenants on this plan</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">$244K</div>
                <div className="text-xs text-muted-foreground">MRR from this plan</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">23%</div>
                <div className="text-xs text-muted-foreground">churn rate (last 90d)</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feature flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Customer portal',
                'Vendor portal',
                'AI assistant',
                'White-label / reseller',
                'SSO / SAML',
                'API access',
                'Webhooks',
                'Custom domain',
                'Priority support',
                'Dedicated success manager',
              ].map((feat) => (
                <div key={feat} className="flex items-center justify-between">
                  <span className="text-sm">{feat}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Public (shown on pricing page)</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Most popular</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
