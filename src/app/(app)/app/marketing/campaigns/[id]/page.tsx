'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronLeft,
  Copy,
  Download,
  Edit,
  Eye,
  Megaphone,
  Mail,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, formatNumber } from '@/lib/utils';

const campaign = {
  id: 'CMP-228',
  name: 'Spring Product Launch - Manufacturing Industry',
  status: 'active',
  channel: 'Email + LinkedIn',
  start: '2026-04-15',
  end: '2026-05-30',
  budget: 45000,
  spent: 28400,
};

const series = [
  { day: 'Apr 15', sent: 12400, opens: 4960, clicks: 1240, replies: 248 },
  { day: 'Apr 22', sent: 18200, opens: 7280, clicks: 1820, replies: 412 },
  { day: 'Apr 29', sent: 14800, opens: 5920, clicks: 1480, replies: 360 },
  { day: 'May 6', sent: 21300, opens: 9152, clicks: 2130, replies: 580 },
  { day: 'May 13', sent: 16900, opens: 7943, clicks: 1859, replies: 510 },
];

const variants = [
  { id: 'A', name: 'Original - "Boost manufacturing efficiency"', sent: 41800, opens: 16720, clicks: 4180, conv: 8.2, winner: false },
  { id: 'B', name: 'Variant - "Cut downtime by 40%"', sent: 41800, opens: 22580, clicks: 5848, conv: 12.4, winner: true },
];

const segments = [
  { name: 'Manufacturing 200+ employees', size: 24500, sent: 18200 },
  { name: 'Aerospace & defense', size: 8200, sent: 7100 },
  { name: 'Automotive Tier 1/2', size: 12400, sent: 11200 },
  { name: 'Industrial machinery', size: 15600, sent: 14800 },
];

export default function CampaignDetailPage() {
  const totalSent = series.reduce((s, d) => s + d.sent, 0);
  const totalOpens = series.reduce((s, d) => s + d.opens, 0);
  const totalClicks = series.reduce((s, d) => s + d.clicks, 0);
  const totalReplies = series.reduce((s, d) => s + d.replies, 0);

  return (
    <div className="flex flex-col">
      <PageHeader
        title={<div className="flex items-center gap-2"><span>{campaign.name}</span><StatusBadge status={campaign.status} /></div>}
        description={`${campaign.id} - ${campaign.channel}`}
        breadcrumbs={[{ label: 'Marketing', href: '/app/marketing' }, { label: 'Campaigns', href: '/app/marketing/campaigns' }, { label: campaign.id }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/marketing/campaigns"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm"><Pause className="size-4" /> Pause</Button>
            <Button variant="outline" size="sm"><Copy className="size-4" /> Duplicate</Button>
            <Button variant="outline" size="sm"><Edit className="size-4" /> Edit</Button>
            <Button variant="outline" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total sent" value={totalSent} format="compact" delta={12.4} icon={Mail} />
          <StatCard label="Open rate" value={(totalOpens / totalSent) * 100} format="percent" delta={3.8} icon={Eye} />
          <StatCard label="Click rate" value={(totalClicks / totalSent) * 100} format="percent" delta={5.1} icon={Target} />
          <StatCard label="Replies" value={totalReplies} format="number" delta={18.2} icon={Megaphone} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Performance trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="sent" stackId="a" fill="hsl(var(--muted))" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="opens" fill="hsl(var(--info))" />
                  <Bar dataKey="clicks" fill="hsl(var(--primary))" />
                  <Bar dataKey="replies" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="size-4" /> Schedule & budget</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5"><p className="text-xs text-muted-foreground">Campaign window</p><p className="text-sm font-medium">{campaign.start} → {campaign.end}</p><Progress value={62} /><p className="text-xs text-muted-foreground">28 of 45 days elapsed</p></div>
              <div className="space-y-1.5 pt-3 border-t"><p className="text-xs text-muted-foreground">Budget</p><div className="flex justify-between text-sm"><span>{formatCurrency(campaign.spent)}</span><span className="text-muted-foreground">of {formatCurrency(campaign.budget)}</span></div><Progress value={(campaign.spent / campaign.budget) * 100} /></div>
              <div className="space-y-1 pt-3 border-t text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">CPL</span><span className="font-mono">{formatCurrency(54)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pipeline created</span><span className="font-mono">{formatCurrency(1240000)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Closed-won</span><span className="font-mono">{formatCurrency(184000)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ROAS</span><span className="font-mono text-success">6.5x</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="variants">
          <TabsList variant="pills">
            <TabsTrigger value="variants" variant="pills"><Trophy className="size-4" /> A/B variants</TabsTrigger>
            <TabsTrigger value="audience" variant="pills"><Users className="size-4" /> Audience</TabsTrigger>
            <TabsTrigger value="content" variant="pills"><Mail className="size-4" /> Content preview</TabsTrigger>
          </TabsList>

          <TabsContent value="variants">
            <Card>
              <CardContent className="p-0">
                <table className="erp-table">
                  <thead><tr><th>Variant</th><th>Subject / Hook</th><th className="text-right">Sent</th><th className="text-right">Opens</th><th className="text-right">Clicks</th><th className="text-right">Conv</th><th></th></tr></thead>
                  <tbody>{variants.map((v) => (
                    <tr key={v.id} className={v.winner ? 'bg-success/5' : ''}>
                      <td><div className="flex size-7 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{v.id}</div></td>
                      <td><p className="font-medium">{v.name}</p>{v.winner && <Badge variant="success" className="mt-1"><Trophy className="size-3" /> Winner</Badge>}</td>
                      <td className="text-right font-mono tabular-nums">{formatNumber(v.sent)}</td>
                      <td className="text-right font-mono tabular-nums">{((v.opens / v.sent) * 100).toFixed(1)}%</td>
                      <td className="text-right font-mono tabular-nums">{((v.clicks / v.sent) * 100).toFixed(1)}%</td>
                      <td className="text-right font-mono tabular-nums font-medium">{v.conv}%</td>
                      <td><Button variant="ghost" size="icon-sm"><Eye className="size-3.5" /></Button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience">
            <Card>
              <CardHeader><CardTitle className="text-base">Segmented audience</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {segments.map((s) => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm"><span className="font-medium">{s.name}</span><span className="font-mono text-xs text-muted-foreground">{formatNumber(s.sent)} / {formatNumber(s.size)}</span></div>
                    <Progress value={(s.sent / s.size) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader><CardTitle className="text-base">Email preview - Variant B</CardTitle></CardHeader>
              <CardContent>
                <div className="mx-auto max-w-2xl rounded-lg border bg-muted/10 p-6">
                  <div className="space-y-3 text-sm">
                    <p className="text-xs text-muted-foreground">From: marketing@universal.com</p>
                    <p className="text-xs text-muted-foreground">To: {`{{first_name}} {{last_name}}`}</p>
                    <p className="font-medium">Subject: Cut downtime by 40% with predictive maintenance, {`{{first_name}}`}</p>
                    <div className="border-t pt-3 space-y-2 text-sm">
                      <p>Hi {`{{first_name}}`},</p>
                      <p>Unplanned downtime costs manufacturers an average of $260,000/hour. With Universal Manufacturing Suite&apos;s predictive maintenance module, customers like {`{{competitor_company}}`} have reduced downtime by 40%.</p>
                      <div className="rounded-md bg-primary/10 p-4 my-3"><p className="font-semibold text-primary">See a 12-min demo</p><Button size="sm" className="mt-2">Book demo</Button></div>
                      <p>Best,<br />Sarah Chen<br />Universal Manufacturing Suite</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
