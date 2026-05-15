'use client';

import * as React from 'react';
import { Activity, Award, Clock, Download, Filter, Headphones, MessageSquare, Star, Trophy, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn, initials } from '@/lib/utils';

const agents = [
  { id: 'a1', name: 'Maria Santos', tickets: 142, resolved: 134, csat: 4.8, fcr: 88, ahr: 12.4, online: true },
  { id: 'a2', name: 'James Wright', tickets: 128, resolved: 124, csat: 4.7, fcr: 91, ahr: 10.8, online: true },
  { id: 'a3', name: 'Priya Khanna', tickets: 118, resolved: 110, csat: 4.6, fcr: 84, ahr: 14.2, online: true },
  { id: 'a4', name: 'Dmitri Volkov', tickets: 134, resolved: 122, csat: 4.5, fcr: 82, ahr: 16.8, online: false },
  { id: 'a5', name: 'Lena Park', tickets: 98, resolved: 96, csat: 4.9, fcr: 94, ahr: 9.4, online: true },
  { id: 'a6', name: 'Akira Tanaka', tickets: 156, resolved: 142, csat: 4.4, fcr: 79, ahr: 18.2, online: false },
  { id: 'a7', name: 'Hannah Klein', tickets: 102, resolved: 99, csat: 4.7, fcr: 88, ahr: 11.6, online: true },
  { id: 'a8', name: 'Jamal Reed', tickets: 91, resolved: 84, csat: 4.3, fcr: 76, ahr: 19.4, online: true },
];

const hourlyVolume = [
  { hour: '8a', volume: 18, target: 15 },
  { hour: '9a', volume: 42, target: 35 },
  { hour: '10a', volume: 58, target: 45 },
  { hour: '11a', volume: 64, target: 50 },
  { hour: '12p', volume: 38, target: 35 },
  { hour: '1p', volume: 52, target: 45 },
  { hour: '2p', volume: 71, target: 55 },
  { hour: '3p', volume: 68, target: 55 },
  { hour: '4p', volume: 54, target: 45 },
  { hour: '5p', volume: 32, target: 30 },
];

const csatTrend = [
  { day: 'Mon', csat: 4.6 },
  { day: 'Tue', csat: 4.7 },
  { day: 'Wed', csat: 4.5 },
  { day: 'Thu', csat: 4.8 },
  { day: 'Fri', csat: 4.7 },
];

export default function AgentsDashboardPage() {
  const sorted = [...agents].sort((a, b) => b.csat * 100 + b.fcr - (a.csat * 100 + a.fcr));
  const totalTickets = agents.reduce((s, a) => s + a.tickets, 0);
  const totalResolved = agents.reduce((s, a) => s + a.resolved, 0);
  const avgCsat = agents.reduce((s, a) => s + a.csat, 0) / agents.length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Agent performance"
        description="Real-time leaderboard and performance metrics for support team"
        breadcrumbs={[{ label: 'Customer Service', href: '/app/customer-service' }, { label: 'Agents' }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="size-4" /> Filter</Button>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button size="sm">This week</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tickets handled" value={totalTickets} format="number" delta={8.4} icon={MessageSquare} />
        <StatCard label="Resolution rate" value={(totalResolved / totalTickets) * 100} format="percent" delta={2.1} icon={Activity} />
        <StatCard label="Average CSAT" value={avgCsat} format="number" delta={1.8} icon={Star} />
        <StatCard label="Online agents" value={agents.filter((a) => a.online).length} format="number" deltaLabel={`of ${agents.length}`} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Hourly ticket volume</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hourlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="target" fill="hsl(var(--muted))" />
                <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">CSAT trend (5d)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={csatTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[4, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="csat" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Trophy className="size-4 text-warning" /> Leaderboard</CardTitle>
          <Badge variant="outline">Sorted by composite score</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/20">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Rank</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Agent</th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Tickets</th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Resolved</th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">CSAT</th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">FCR</th>
                <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">AHR (min)</th>
                <th className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((a, idx) => (
                <tr key={a.id} className="border-b">
                  <td className="px-3 py-2">
                    <div className={cn('flex size-7 items-center justify-center rounded-full text-xs font-bold', idx === 0 && 'bg-warning/15 text-warning', idx === 1 && 'bg-muted/60 text-foreground', idx === 2 && 'bg-warning/10 text-warning', idx > 2 && 'bg-muted/30 text-muted-foreground')}>
                      {idx === 0 ? <Trophy className="size-3.5" /> : idx + 1}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm"><AvatarFallback>{initials(a.name)}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">Support agent</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums">{a.tickets}</td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-mono tabular-nums">{a.resolved}</span>
                      <Progress value={(a.resolved / a.tickets) * 100} className="h-1 w-16" />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right"><div className="flex items-center justify-end gap-1"><Star className="size-3.5 text-warning fill-warning" /><span className="font-mono tabular-nums font-medium">{a.csat}</span></div></td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums">{a.fcr}%</td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums">{a.ahr}</td>
                  <td className="px-3 py-2 text-center">
                    <Badge variant={a.online ? 'success' : 'outline'}>{a.online ? 'Online' : 'Offline'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Award className="size-4 text-warning" /> Top performer</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-3"><Avatar><AvatarFallback>{initials(sorted[0].name)}</AvatarFallback></Avatar><div><p className="font-semibold">{sorted[0].name}</p><p className="text-xs text-muted-foreground">CSAT {sorted[0].csat} - {sorted[0].fcr}% FCR</p></div></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Clock className="size-4 text-info" /> Fastest resolution</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-3"><Avatar><AvatarFallback>LP</AvatarFallback></Avatar><div><p className="font-semibold">Lena Park</p><p className="text-xs text-muted-foreground">9.4 min average handle time</p></div></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Headphones className="size-4 text-success" /> Most tickets</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-3"><Avatar><AvatarFallback>AT</AvatarFallback></Avatar><div><p className="font-semibold">Akira Tanaka</p><p className="text-xs text-muted-foreground">156 tickets handled this week</p></div></div></CardContent>
        </Card>
      </div>
    </div>
  );
}
