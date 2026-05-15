import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  HeadphonesIcon,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Receipt,
  Send,
  Share2,
  ShieldCheck,
  Star,
  Ticket,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, colorFromString, formatCurrency, formatDate, formatRelativeTime, initials } from '@/lib/utils';

const account = {
  id: 'A-104',
  name: 'Acme Industries',
  domain: 'acme-ind.com',
  industry: 'Manufacturing',
  founded: 1972,
  employees: 5800,
  hq: 'Cleveland, OH',
  description: 'Acme Industries is a multi-divisional manufacturer of industrial components, building materials, and specialty chemicals operating across 14 countries with a focus on automation and sustainability.',
  tier: 'Strategic',
  health: 'Excellent',
  csm: 'Aisha Robinson',
  ae: 'Priya Patel',
  customerSince: new Date('2022-03-14'),
  renewalDate: new Date('2026-03-14'),
  csat: 4.7,
  nps: 62,
};

const metrics = [
  { label: 'Lifetime revenue', value: 1840000, icon: CircleDollarSign, hint: '4 years as customer', accent: 'text-success' },
  { label: 'Open opportunities', value: '3', icon: TrendingUp, hint: '$420K combined', accent: 'text-primary' },
  { label: 'Support tickets', value: '8', icon: Ticket, hint: '2 open · 1 high', accent: 'text-warning' },
  { label: 'Active contracts', value: '4', icon: ShieldCheck, hint: 'Renews Mar 14', accent: 'text-info' },
];

const contacts = [
  { id: 'C-1', name: 'Margaret Liu', title: 'Chief Procurement Officer', email: 'margaret.liu@acme-ind.com', phone: '+1 216 555 0101', role: 'Champion', sentiment: 'positive', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 8) },
  { id: 'C-2', name: 'Robert Henderson', title: 'VP Operations', email: 'r.henderson@acme-ind.com', phone: '+1 216 555 0102', role: 'Decision Maker', sentiment: 'positive', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 'C-3', name: 'Yuki Nakamura', title: 'CIO', email: 'y.nakamura@acme-ind.com', phone: '+1 216 555 0103', role: 'Influencer', sentiment: 'neutral', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
  { id: 'C-4', name: 'David Park', title: 'Head of Supply Chain', email: 'david.park@acme-ind.com', phone: '+1 216 555 0104', role: 'User', sentiment: 'positive', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
  { id: 'C-5', name: 'Sandra Mitchell', title: 'IT Director', email: 's.mitchell@acme-ind.com', phone: '+1 216 555 0105', role: 'User', sentiment: 'positive', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
  { id: 'C-6', name: 'Joaquin Reyes', title: 'CFO', email: 'j.reyes@acme-ind.com', phone: '+1 216 555 0106', role: 'Decision Maker', sentiment: 'unknown', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21) },
];

const opportunities = [
  { id: 'O-3110', name: 'Acme Industries - Plant 7 Rollout', stage: 'Proposal', value: 245000, probability: 60, owner: 'Priya Patel', closeDate: new Date('2026-09-15') },
  { id: 'O-3111', name: 'Acme - Sustainability Module', stage: 'Qualification', value: 92000, probability: 35, owner: 'Priya Patel', closeDate: new Date('2026-10-30') },
  { id: 'O-3112', name: 'Acme - Annual Renewal 2027', stage: 'Discovery', value: 480000, probability: 25, owner: 'Aisha Robinson', closeDate: new Date('2027-03-14') },
];

const invoices = [
  { id: 'INV-2089', amount: 12450, status: 'paid' as const, issued: new Date(Date.now() - 1000 * 60 * 60 * 2), due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25) },
  { id: 'INV-2076', amount: 48000, status: 'paid' as const, issued: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), due: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
  { id: 'INV-2058', amount: 120000, status: 'paid' as const, issued: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), due: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15) },
  { id: 'INV-2031', amount: 4800, status: 'sent' as const, issued: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), due: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) },
];

const activities = [
  { type: 'meeting', icon: Video, color: 'text-primary bg-primary/10', actor: 'Priya Patel', title: 'QBR with Margaret and Robert', body: 'Reviewed Q2 platform usage, expansion ROI numbers, and Plant 7 rollout timeline. Strong sentiment on the new sustainability module.', at: new Date(Date.now() - 1000 * 60 * 60 * 8) },
  { type: 'call', icon: Phone, color: 'text-success bg-success/10', actor: 'Aisha Robinson', title: 'Check-in with David Park', body: 'David flagged a workflow friction with the procurement approval routing. Filed enhancement request.', at: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { type: 'support', icon: HeadphonesIcon, color: 'text-warning bg-warning/10', actor: 'Support Team', title: 'Ticket #4421 resolved - SSO config issue', body: 'Resolved misconfiguration in SAML claims for the new IT users. Knowledge base article updated.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { type: 'email', icon: Mail, color: 'text-info bg-info/10', actor: 'Priya Patel', title: 'Sent: Plant 7 ROI analysis', body: 'Shared 3-year ROI projection for Plant 7 expansion. Highlighted comparable rollouts at peer manufacturers.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) },
  { type: 'invoice', icon: Receipt, color: 'text-info bg-info/10', actor: 'System', title: 'Invoice INV-2089 paid', body: 'Quarterly platform fee + premium support add-on. Total $12,450 paid via ACH.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
  { type: 'meeting', icon: Video, color: 'text-primary bg-primary/10', actor: 'Aisha Robinson', title: 'Customer training session', body: 'Onboarded 12 new IT users from the recent reorg. Covered admin panel, audit logs, integrations.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9) },
];

const tickets = [
  { id: '#4438', subject: 'API rate limit increase request', priority: 'medium' as const, status: 'open' as const, agent: 'Tech Support', updated: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: '#4421', subject: 'SSO config issue after AD change', priority: 'high' as const, status: 'closed' as const, agent: 'Tech Support', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: '#4398', subject: 'Custom report template request', priority: 'low' as const, status: 'open' as const, agent: 'CS Team', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
];

const documents = [
  { name: 'MSA Acme 2024.pdf', size: '1.4 MB', type: 'contract', uploaded: new Date('2024-03-14') },
  { name: 'Plant 7 Expansion Scope.docx', size: '320 KB', type: 'proposal', uploaded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12) },
  { name: 'Sustainability ROI v2.xlsx', size: '88 KB', type: 'analysis', uploaded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18) },
  { name: 'Q2 QBR Deck.pdf', size: '4.2 MB', type: 'presentation', uploaded: new Date(Date.now() - 1000 * 60 * 60 * 8) },
];

const priorityColor = (p: string) =>
  p === 'high'
    ? 'border-destructive/30 bg-destructive/10 text-destructive'
    : p === 'medium'
      ? 'border-warning/30 bg-warning/10 text-warning'
      : 'border-info/30 bg-info/10 text-info';

export default function AccountDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        breadcrumbs={[
          { label: 'CRM', href: '/app/crm' },
          { label: 'Accounts', href: '/app/crm/accounts' },
          { label: account.name },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/crm/accounts">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        title={
          <div className="flex items-center gap-3">
            <div
              className="grid h-12 w-12 place-items-center rounded-lg text-base font-semibold text-white"
              style={{ backgroundColor: colorFromString(account.name) }}
            >
              {initials(account.name)}
            </div>
            <div>
              <span>{account.name}</span>
              <p className="mt-0.5 flex items-center gap-2 text-sm font-normal text-muted-foreground">
                <Globe className="size-3.5" />
                {account.domain}
                <span>·</span>
                <Building2 className="size-3.5" />
                {account.industry}
                <span>·</span>
                <Users className="size-3.5" />
                {account.employees.toLocaleString()} employees
              </p>
            </div>
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="sm">
              <Mail className="size-4" /> Email
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="size-4" /> Schedule
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New opportunity
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </>
        }
      />

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn('grid h-10 w-10 place-items-center rounded-md bg-muted', m.accent)}>
                <m.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{m.label}</p>
                <p className="text-xl font-semibold tabular-nums">
                  {typeof m.value === 'number' ? formatCurrency(m.value) : m.value}
                </p>
                <p className="text-xs text-muted-foreground">{m.hint}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <Tabs defaultValue="overview">
            <TabsList variant="pills">
              <TabsTrigger variant="pills" value="overview">Overview</TabsTrigger>
              <TabsTrigger variant="pills" value="contacts">Contacts ({contacts.length})</TabsTrigger>
              <TabsTrigger variant="pills" value="opportunities">Opportunities ({opportunities.length})</TabsTrigger>
              <TabsTrigger variant="pills" value="activities">Activities</TabsTrigger>
              <TabsTrigger variant="pills" value="invoices">Invoices</TabsTrigger>
              <TabsTrigger variant="pills" value="documents">Documents</TabsTrigger>
              <TabsTrigger variant="pills" value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{account.description}</p>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Founded</p>
                      <p className="font-semibold">{account.founded}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">HQ</p>
                      <p className="font-semibold">{account.hq}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Customer since</p>
                      <p className="font-semibold">{formatDate(account.customerSince)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Renews</p>
                      <p className="font-semibold">{formatDate(account.renewalDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Recent activity</CardTitle>
                  <Button variant="ghost" size="sm">View all</Button>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-[15px] top-0 h-full w-px bg-border" />
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((t, i) => (
                        <div key={i} className="relative flex items-start gap-4">
                          <div className={cn('relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-background', t.color)}>
                            <t.icon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <p className="text-sm font-semibold">{t.title}</p>
                              <span className="text-xs text-muted-foreground">· {t.actor} · {formatRelativeTime(t.at)}</span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Contacts</CardTitle>
                  <Button variant="outline" size="sm"><Plus className="size-4" /> Add contact</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Last touch</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <Link href={`/app/crm/contacts/${c.id}`} className="flex items-center gap-2.5">
                              <Avatar size="sm">
                                <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{c.name}</p>
                                <p className="text-xs text-muted-foreground">{c.title}</p>
                              </div>
                            </Link>
                          </td>
                          <td>
                            <Badge
                              variant="outline"
                              size="sm"
                              className={cn(
                                c.role === 'Champion' && 'border-success/30 bg-success/10 text-success',
                                c.role === 'Decision Maker' && 'border-primary/30 bg-primary/10 text-primary',
                                c.role === 'Influencer' && 'border-warning/30 bg-warning/10 text-warning',
                              )}
                            >
                              {c.role}
                            </Badge>
                          </td>
                          <td className="text-sm">{c.email}</td>
                          <td className="font-mono text-xs text-muted-foreground">{c.phone}</td>
                          <td className="text-xs text-muted-foreground">{formatRelativeTime(c.lastTouch)}</td>
                          <td>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="opportunities">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Opportunities</CardTitle>
                  <Button variant="outline" size="sm"><Plus className="size-4" /> New opportunity</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Deal</th>
                        <th>Stage</th>
                        <th className="text-right">Value</th>
                        <th>Probability</th>
                        <th>Close date</th>
                        <th>Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {opportunities.map((o) => (
                        <tr key={o.id}>
                          <td>
                            <Link href={`/app/crm/opportunities/${o.id}`} className="font-medium hover:text-primary">
                              {o.name}
                            </Link>
                            <p className="font-mono text-xs text-muted-foreground">{o.id}</p>
                          </td>
                          <td>
                            <Badge variant="outline" size="sm">{o.stage}</Badge>
                          </td>
                          <td className="text-right font-mono font-semibold tabular-nums">{formatCurrency(o.value)}</td>
                          <td className="w-40">
                            <div className="flex items-center gap-2">
                              <Progress value={o.probability} className="h-1.5" />
                              <span className="w-9 text-right font-mono text-xs tabular-nums">{o.probability}%</span>
                            </div>
                          </td>
                          <td className="text-sm">{formatDate(o.closeDate)}</td>
                          <td>
                            <div className="flex items-center gap-1.5">
                              <Avatar size="xs">
                                <AvatarFallback name={o.owner}>{initials(o.owner)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{o.owner.split(' ')[0]}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">All activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-[15px] top-0 h-full w-px bg-border" />
                    <div className="space-y-5">
                      {activities.map((t, i) => (
                        <div key={i} className="relative flex items-start gap-4">
                          <div className={cn('relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-background', t.color)}>
                            <t.icon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <p className="text-sm font-semibold">{t.title}</p>
                              <span className="text-xs text-muted-foreground">· {t.actor} · {formatRelativeTime(t.at)}</span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Invoices</CardTitle>
                  <Button variant="outline" size="sm">Issue invoice</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th className="text-right">Amount</th>
                        <th>Status</th>
                        <th>Issued</th>
                        <th>Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="font-mono text-xs font-semibold text-primary">{inv.id}</td>
                          <td className="text-right font-mono tabular-nums">{formatCurrency(inv.amount)}</td>
                          <td><StatusBadge status={inv.status} /></td>
                          <td className="text-sm text-muted-foreground">{formatDate(inv.issued)}</td>
                          <td className="text-sm">{formatDate(inv.due)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Documents</CardTitle>
                  <Button variant="outline" size="sm">Upload</Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {documents.map((d) => (
                    <div key={d.name} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50">
                      <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                        <FileText className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.size} · {formatRelativeTime(d.uploaded)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Support tickets</CardTitle>
                  <Button variant="outline" size="sm">New ticket</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Ticket</th>
                        <th>Subject</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Agent</th>
                        <th>Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((t) => (
                        <tr key={t.id}>
                          <td className="font-mono text-xs text-primary">{t.id}</td>
                          <td className="font-medium">{t.subject}</td>
                          <td>
                            <Badge variant="outline" size="sm" className={priorityColor(t.priority)}>
                              {t.priority}
                            </Badge>
                          </td>
                          <td><StatusBadge status={t.status} /></td>
                          <td className="text-sm text-muted-foreground">{t.agent}</td>
                          <td className="text-xs text-muted-foreground">{formatRelativeTime(t.updated)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Avatar size="sm">
                  <AvatarFallback name={account.ae}>{initials(account.ae)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{account.ae}</p>
                  <p className="text-xs text-muted-foreground">Account Executive</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Avatar size="sm">
                  <AvatarFallback name={account.csm}>{initials(account.csm)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{account.csm}</p>
                  <p className="text-xs text-muted-foreground">Customer Success</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Health</CardTitle>
                <Badge variant="success" size="sm" className="ml-auto">{account.health}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Platform adoption</span>
                  <span className="font-medium">86%</span>
                </div>
                <Progress value={86} className="h-1.5" indicatorClassName="bg-success" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Engagement score</span>
                  <span className="font-medium">92</span>
                </div>
                <Progress value={92} className="h-1.5" indicatorClassName="bg-success" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Support volume</span>
                  <span className="font-medium">Normal</span>
                </div>
                <Progress value={28} className="h-1.5" indicatorClassName="bg-warning" />
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">CSAT</span>
                <span className="font-semibold">{account.csat} <Star className="inline size-3 fill-warning text-warning" /></span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">NPS</span>
                <span className="font-semibold text-success">+{account.nps}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="size-4" /> Schedule QBR
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Share2 className="size-4" /> Generate org chart
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="size-4" /> Create proposal
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Activity className="size-4" /> View usage report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
