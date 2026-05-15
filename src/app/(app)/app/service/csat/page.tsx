'use client';

import * as React from 'react';
import { Download, MessageCircle, Star, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatPercent, initials } from '@/lib/utils';

const trend = [
  { week: 'Wk 14', csat: 88, nps: 32, ces: 76 },
  { week: 'Wk 15', csat: 89, nps: 35, ces: 78 },
  { week: 'Wk 16', csat: 91, nps: 38, ces: 80 },
  { week: 'Wk 17', csat: 90, nps: 36, ces: 79 },
  { week: 'Wk 18', csat: 92, nps: 41, ces: 82 },
  { week: 'Wk 19', csat: 93, nps: 44, ces: 84 },
  { week: 'Wk 20', csat: 93, nps: 46, ces: 85 },
];

const distribution = [
  { stars: 5, count: 284, pct: 68.3, color: 'hsl(var(--chart-2))' },
  { stars: 4, count: 92, pct: 22.1, color: 'hsl(var(--chart-1))' },
  { stars: 3, count: 24, pct: 5.8, color: 'hsl(var(--chart-3))' },
  { stars: 2, count: 10, pct: 2.4, color: 'hsl(var(--warning))' },
  { stars: 1, count: 6, pct: 1.4, color: 'hsl(var(--destructive))' },
];

const agentScores = [
  { name: 'Priya Krishnan', responses: 84, avg: 4.85, csat: 0.97, deflections: 18 },
  { name: 'Sofia Lee', responses: 72, avg: 4.82, csat: 0.96, deflections: 14 },
  { name: 'Marcus Jensen', responses: 88, avg: 4.74, csat: 0.94, deflections: 22 },
  { name: 'Devon Thompson', responses: 68, avg: 4.68, csat: 0.93, deflections: 11 },
  { name: 'Aisha Nasser', responses: 56, avg: 4.55, csat: 0.91, deflections: 9 },
  { name: 'Liam Rodriguez', responses: 48, avg: 4.41, csat: 0.88, deflections: 7 },
];

const lowRatings = [
  { id: 'TKT-8411', customer: 'Enterprise Ltd', rating: 1, agent: 'Devon Thompson', date: '2026-05-14', subject: 'PCBA failure rate high in field', comment: 'Took too long to escalate. Engineering response was slow and lacked actionable detail.' },
  { id: 'TKT-8395', customer: 'NorthCo Industries', rating: 2, agent: 'Liam Rodriguez', date: '2026-05-12', subject: 'Order shipped with wrong qty', comment: 'Resolution was correct but communication during the wait was minimal.' },
  { id: 'TKT-8381', customer: 'Pacific Mfg', rating: 2, agent: 'Aisha Nasser', date: '2026-05-10', subject: 'Spec inquiry', comment: 'Got transferred 3 times before someone could answer my question.' },
  { id: 'TKT-8362', customer: 'Continental Auto Parts', rating: 1, agent: 'Liam Rodriguez', date: '2026-05-08', subject: 'Repeated billing question', comment: 'Same issue as last month. Feels like nothing changes.' },
  { id: 'TKT-8344', customer: 'Western Logistics', rating: 2, agent: 'Marcus Jensen', date: '2026-05-05', subject: 'Tracking number broken', comment: 'Took 3 days to get a working tracking number.' },
];

const topPraise = [
  { id: 'TKT-8419', customer: 'Continental Auto Parts', rating: 5, agent: 'Aisha Nasser', comment: 'Aisha walked me through the warranty process in detail, identified the failed encoder right away, and arranged shipping same-day. Outstanding.' },
  { id: 'TKT-8421', customer: 'Acme Industries', rating: 5, agent: 'Sofia Lee', comment: 'Sofia + Adrian had a field tech on-site next morning. Fastest warranty resolution I have ever experienced in 15 years.' },
  { id: 'TKT-8403', customer: 'TechCorp Solutions', rating: 5, agent: 'Priya Krishnan', comment: 'Priya not only resolved my issue but also flagged a related risk we did not see. Saved us a future outage.' },
];

const overallCsat = 0.928;
const overallNps = 46;
const totalResponses = distribution.reduce((s, d) => s + d.count, 0);

export default function CsatPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="CSAT"
        description="Customer satisfaction scores, NPS, agent ratings and low-rating ticket review."
        breadcrumbs={[
          { label: 'Service', href: '/app/service' },
          { label: 'CSAT' },
        ]}
        actions={<Button variant="outline"><Download className="size-4" /> Export</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="text-6xl font-bold tabular-nums text-success">{formatPercent(overallCsat)}</div>
            <div className="text-sm text-muted-foreground">CSAT score</div>
            <div className="flex items-center gap-1 text-xs font-medium text-success"><TrendingUp className="size-3" /> +2.4% vs last month</div>
            <div className="mt-1 flex">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className={`size-5 ${i <= 4.6 ? 'fill-warning text-warning' : 'text-muted'}`} />
              ))}
            </div>
            <div className="text-xs text-muted-foreground">4.6 / 5 · {totalResponses} responses</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="text-6xl font-bold tabular-nums">+{overallNps}</div>
            <div className="text-sm text-muted-foreground">NPS</div>
            <div className="text-xs text-muted-foreground">Promoters 64% · Passives 24% · Detractors 12%</div>
            <Badge variant="success" size="sm" className="mt-2">Excellent (≥ 40)</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="text-6xl font-bold tabular-nums">85</div>
            <div className="text-sm text-muted-foreground">CES (Customer Effort)</div>
            <div className="text-xs text-muted-foreground">Lower = easier to do business</div>
            <Badge variant="info" size="sm" className="mt-2">Low effort</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="text-6xl font-bold tabular-nums">{totalResponses}</div>
            <div className="text-sm text-muted-foreground">Total responses (30d)</div>
            <div className="text-xs text-muted-foreground">42% response rate</div>
            <Badge variant="soft" size="sm" className="mt-2">+12% YoY</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Satisfaction Trend</CardTitle>
            <CardDescription>CSAT, NPS and CES over last 7 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="csat" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} name="CSAT" />
                  <Line type="monotone" dataKey="nps" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} name="NPS" />
                  <Line type="monotone" dataKey="ces" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} name="CES" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>{totalResponses} responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {distribution.map((d) => (
              <div key={d.stars} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: d.stars }).map((_, i) => (
                      <Star key={i} className="size-3 fill-warning text-warning" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                    <span>{d.count}</span>
                    <span>·</span>
                    <span>{d.pct}%</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Per-Agent CSAT</CardTitle>
            <CardDescription>Last 30 days · ranked</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th className="text-right">Responses</th>
                  <th className="text-right">Avg ★</th>
                  <th className="text-right">CSAT</th>
                  <th className="text-right">Self-served</th>
                </tr>
              </thead>
              <tbody>
                {agentScores.map((a) => (
                  <tr key={a.name}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback>{initials(a.name)}</AvatarFallback></Avatar>
                        <span className="text-sm">{a.name}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{a.responses}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Star className="size-3 fill-warning text-warning" />
                        <span className="font-mono tabular-nums">{a.avg.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono tabular-nums">{formatPercent(a.csat)}</td>
                    <td className="text-right font-mono text-muted-foreground tabular-nums">{a.deflections}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ThumbsUp className="size-4 text-success" /> Top Praise</CardTitle>
            <CardDescription>5-star comments worth celebrating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPraise.map((p) => (
              <div key={p.id} className="rounded-lg border border-success/30 bg-success/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs text-primary">{p.id}</span>
                    <span className="text-xs font-medium">{p.customer}</span>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (<Star key={i} className="size-3 fill-warning text-warning" />))}
                  </div>
                </div>
                <p className="mt-1 text-xs italic text-muted-foreground">"{p.comment}"</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Avatar size="xs"><AvatarFallback>{initials(p.agent)}</AvatarFallback></Avatar>
                  <span className="text-2xs">{p.agent}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ThumbsDown className="size-4 text-destructive" /> Low Rating Tickets</CardTitle>
          <CardDescription>1-2 star feedback requiring follow-up</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Agent</th>
                <th>Date</th>
                <th>Comment</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {lowRatings.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-primary">{r.id}</td>
                  <td className="text-sm">{r.customer}</td>
                  <td className="text-sm">{r.subject}</td>
                  <td className="text-xs">{r.agent}</td>
                  <td className="text-xs text-muted-foreground">{r.date}</td>
                  <td className="max-w-md text-xs italic text-muted-foreground">"{r.comment}"</td>
                  <td>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3 ${i < r.rating ? 'fill-destructive text-destructive' : 'text-muted'}`} />
                      ))}
                    </div>
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
