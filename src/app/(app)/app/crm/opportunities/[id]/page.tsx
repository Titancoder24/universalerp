import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Flag,
  Mail,
  Maximize2,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Send,
  Shield,
  StickyNote,
  Sword,
  Target,
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
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatDate, formatRelativeTime, initials } from '@/lib/utils';

const opp = {
  id: 'O-3094',
  name: 'Lumen Health Network Suite',
  customer: 'Lumen Health',
  value: 220000,
  probability: 60,
  expectedValue: 132000,
  stage: 'Proposal',
  closeDate: new Date('2026-08-25'),
  daysInStage: 8,
  ageInPipeline: 47,
  owner: 'Priya Patel',
  created: new Date('2026-04-01'),
  source: 'Webinar',
};

const stages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
const currentStageIdx = 2;

const team = [
  { name: 'Priya Patel', role: 'Account Exec' },
  { name: 'Jordan Wells', role: 'Solutions Engineer' },
  { name: 'Aisha Robinson', role: 'Customer Success' },
];

const stakeholders = [
  { name: 'Rachel Goldberg', title: 'Chief Medical Officer', role: 'Champion', sentiment: 'positive' },
  { name: 'David Mendez', title: 'CFO', role: 'Decision Maker', sentiment: 'neutral' },
  { name: 'Yuki Tanaka', title: 'Head of IT', role: 'Influencer', sentiment: 'positive' },
  { name: 'Frank Holloway', title: 'CEO', role: 'Decision Maker', sentiment: 'unknown' },
];

const products = [
  { id: 'P-101', name: 'Lumen Core Platform - Enterprise', sku: 'LUMEN-ENT-001', qty: 1, price: 120000, discount: 0 },
  { id: 'P-102', name: 'Advanced Analytics Module', sku: 'LUMEN-ANL-002', qty: 1, price: 45000, discount: 10 },
  { id: 'P-103', name: 'SSO + Audit Logs', sku: 'LUMEN-SEC-003', qty: 1, price: 18000, discount: 0 },
  { id: 'P-104', name: 'Implementation Services', sku: 'PROF-SVC-001', qty: 80, price: 250, discount: 0 },
  { id: 'P-105', name: 'Premium Support - Year 1', sku: 'SUP-PREM-001', qty: 1, price: 24000, discount: 5 },
];

const activities = [
  { type: 'meeting' as const, icon: Video, color: 'text-primary bg-primary/10', actor: 'Priya Patel', title: 'Proposal review with Rachel Goldberg', body: 'Walked through the line-item pricing and the 12-month rollout plan. Rachel raised concerns about the audit log retention requirements — agreed to add 7-year retention as a custom term.', at: new Date(Date.now() - 1000 * 60 * 60 * 2), meta: ['Recording', '48 min'] },
  { type: 'email' as const, icon: Mail, color: 'text-info bg-info/10', actor: 'Priya Patel', title: 'Sent: Updated proposal v3 with implementation timeline', body: 'Attached revised proposal including the 7-year audit log retention, updated discount structure, and reference customer in healthcare vertical.', at: new Date(Date.now() - 1000 * 60 * 60 * 5), meta: ['Opened 4x'] },
  { type: 'note' as const, icon: StickyNote, color: 'text-warning bg-warning/10', actor: 'Jordan Wells', title: 'Technical validation complete', body: 'Confirmed integration with their Epic EMR via FHIR. All technical blockers cleared. Ready to move to security review.', at: new Date(Date.now() - 1000 * 60 * 60 * 24), meta: ['Pinned'] },
  { type: 'call' as const, icon: Phone, color: 'text-success bg-success/10', actor: 'Priya Patel', title: 'Pricing negotiation call with David Mendez (CFO)', body: 'CFO pushed back on the implementation services line. Settled on payment terms of 50% upfront, 50% at go-live instead of full upfront.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), meta: ['28 min'] },
  { type: 'meeting' as const, icon: Video, color: 'text-primary bg-primary/10', actor: 'Jordan Wells', title: 'Technical demo with IT team', body: 'Deep technical demo with Yuki and her team. Covered single sign-on, audit log structure, data residency, disaster recovery.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), meta: ['Recording', '74 min'] },
  { type: 'email' as const, icon: Mail, color: 'text-info bg-info/10', actor: 'Rachel Goldberg', title: 'Inbound: Proposal feedback', body: 'Thanks for the detailed proposal. Two questions from our security team about SOC 2 Type II evidence and the data deletion workflow.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), meta: ['Inbound'] },
];

const competitors = [
  { name: 'Salesforce Health Cloud', position: 'Incumbent', strength: 'Existing relationship, deep Salesforce skills in-house', weakness: 'Custom build effort would be ~6-9 months, expensive professional services', threat: 'high' as const },
  { name: 'Epic + custom build', position: 'Build vs buy', strength: 'Tight integration with existing EMR', weakness: 'No external network capability, 18+ month timeline', threat: 'medium' as const },
  { name: 'Innovaccer', position: 'Direct competitor', strength: 'Healthcare-specific, similar feature set', weakness: 'Less mature analytics, no FHIR-native architecture', threat: 'medium' as const },
];

const files = [
  { name: 'Proposal_v3.pdf', size: '2.4 MB', uploadedBy: 'Priya Patel', at: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { name: 'Technical Architecture.pdf', size: '5.1 MB', uploadedBy: 'Jordan Wells', at: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { name: 'SOC2_TypeII_Report.pdf', size: '8.2 MB', uploadedBy: 'Priya Patel', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
  { name: 'Lumen_Pricing_Worksheet.xlsx', size: '124 KB', uploadedBy: 'Priya Patel', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) },
  { name: 'Discovery_Notes_v2.docx', size: '64 KB', uploadedBy: 'Priya Patel', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) },
];

const productTotal = products.reduce((sum, p) => sum + p.qty * p.price * (1 - p.discount / 100), 0);

export default function OpportunityDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        breadcrumbs={[
          { label: 'CRM', href: '/app/crm' },
          { label: 'Opportunities', href: '/app/crm/opportunities' },
          { label: opp.id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/crm/opportunities">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        title={opp.name}
        description={`${opp.customer} · Created ${formatRelativeTime(opp.created)} · ${opp.ageInPipeline} days in pipeline`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Mail className="size-4" /> Email
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="size-4" /> Call
            </Button>
            <Button variant="outline" size="sm">
              <Edit3 className="size-4" /> Edit
            </Button>
            <Button size="sm">
              <CheckCircle2 className="size-4" /> Mark won
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </>
        }
      />

      {/* Deal header card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Value</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(opp.value)}</p>
              <p className="text-xs text-muted-foreground">ARR</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Probability</p>
              <p className="mt-1 text-2xl font-bold text-warning tabular-nums">{opp.probability}%</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(opp.expectedValue)} weighted</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Stage</p>
              <p className="mt-1 text-lg font-semibold">{opp.stage}</p>
              <p className="text-xs text-muted-foreground">{opp.daysInStage}d in stage</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Close date</p>
              <p className="mt-1 text-lg font-semibold">{formatDate(opp.closeDate)}</p>
              <p className="text-xs text-warning">10 days away</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Owner</p>
              <div className="mt-1 flex items-center gap-1.5">
                <Avatar size="sm">
                  <AvatarFallback name={opp.owner}>{initials(opp.owner)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{opp.owner}</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Source</p>
              <p className="mt-1 text-lg font-semibold">{opp.source}</p>
              <p className="text-xs text-muted-foreground">Inbound · Q1 2026</p>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Stage progress */}
          <div className="flex items-center gap-1">
            {stages.map((s, i) => {
              const isPast = i < currentStageIdx;
              const isCurrent = i === currentStageIdx;
              const isFuture = i > currentStageIdx;
              return (
                <div key={s} className="flex flex-1 items-center gap-1">
                  <div className="flex flex-1 flex-col items-center">
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                        isPast && 'bg-success text-success-foreground',
                        isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                        isFuture && 'bg-muted text-muted-foreground',
                      )}
                    >
                      {isPast ? <CheckCircle2 className="size-3.5" /> : i + 1}
                    </div>
                    <p
                      className={cn(
                        'mt-1.5 text-xs font-medium',
                        isCurrent && 'text-foreground',
                        !isCurrent && 'text-muted-foreground',
                      )}
                    >
                      {s}
                    </p>
                  </div>
                  {i < stages.length - 1 && (
                    <div
                      className={cn(
                        '-mt-5 h-0.5 flex-1 rounded',
                        isPast ? 'bg-success' : 'bg-muted',
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main content with tabs */}
        <div className="lg:col-span-9">
          <Tabs defaultValue="overview">
            <TabsList variant="pills">
              <TabsTrigger variant="pills" value="overview">Overview</TabsTrigger>
              <TabsTrigger variant="pills" value="products">Products</TabsTrigger>
              <TabsTrigger variant="pills" value="activities">Activities</TabsTrigger>
              <TabsTrigger variant="pills" value="notes">Notes</TabsTrigger>
              <TabsTrigger variant="pills" value="files">Files</TabsTrigger>
              <TabsTrigger variant="pills" value="competitors">Competitors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Activity feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-[15px] top-0 h-full w-px bg-border" />
                    <div className="space-y-5">
                      {activities.slice(0, 4).map((t, i) => (
                        <div key={i} className="relative flex items-start gap-4">
                          <div
                            className={cn(
                              'relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-background',
                              t.color,
                            )}
                          >
                            <t.icon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <p className="text-sm font-semibold">{t.title}</p>
                              <span className="text-xs text-muted-foreground">
                                · {t.actor} · {formatRelativeTime(t.at)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {t.meta.map((m) => (
                                <Badge key={m} variant="outline" size="sm">{m}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Product line items</CardTitle>
                    <CardDescription>5 items · Total {formatCurrency(productTotal)}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="size-4" /> Add product
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th className="text-right">Qty</th>
                        <th className="text-right">Unit price</th>
                        <th className="text-right">Discount</th>
                        <th className="text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td className="font-medium">{p.name}</td>
                          <td className="font-mono text-xs text-muted-foreground">{p.sku}</td>
                          <td className="text-right tabular-nums">{p.qty}</td>
                          <td className="text-right font-mono tabular-nums">{formatCurrency(p.price)}</td>
                          <td className="text-right tabular-nums">{p.discount > 0 ? `${p.discount}%` : '—'}</td>
                          <td className="text-right font-mono font-semibold tabular-nums">
                            {formatCurrency(p.qty * p.price * (1 - p.discount / 100))}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-semibold">
                        <td colSpan={5} className="text-right">Total</td>
                        <td className="text-right font-mono tabular-nums">{formatCurrency(productTotal)}</td>
                      </tr>
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
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              {t.meta.map((m) => (
                                <Badge key={m} variant="outline" size="sm">{m}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <textarea
                      className="min-h-[80px] w-full resize-none border-0 bg-transparent text-sm focus:outline-none"
                      placeholder="Capture a note about this opportunity..."
                    />
                    <div className="flex justify-end">
                      <Button size="sm">
                        <Send className="size-4" /> Post note
                      </Button>
                    </div>
                  </div>
                  {activities.filter((a) => a.type === 'note').map((n, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm">
                            <AvatarFallback name={n.actor}>{initials(n.actor)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{n.actor}</p>
                            <p className="text-xs text-muted-foreground">{formatRelativeTime(n.at)}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </div>
                      <p className="mt-2 text-sm">{n.body}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Files & attachments</CardTitle>
                  <Button variant="outline" size="sm">
                    <Paperclip className="size-4" /> Upload
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>File</th>
                        <th>Uploaded by</th>
                        <th>Date</th>
                        <th className="text-right">Size</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((f) => (
                        <tr key={f.name} className="group">
                          <td>
                            <div className="flex items-center gap-2">
                              <FileText className="size-4 text-muted-foreground" />
                              <span className="font-medium">{f.name}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5">
                              <Avatar size="xs">
                                <AvatarFallback name={f.uploadedBy}>{initials(f.uploadedBy)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{f.uploadedBy}</span>
                            </div>
                          </td>
                          <td className="text-sm text-muted-foreground">{formatRelativeTime(f.at)}</td>
                          <td className="text-right font-mono text-sm tabular-nums">{f.size}</td>
                          <td>
                            <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                              <Download className="size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitors">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-base">Competitive landscape</CardTitle>
                    <CardDescription>Who else they're considering</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="size-4" /> Add competitor
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {competitors.map((c) => (
                    <div key={c.name} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Sword className="size-4 text-muted-foreground" />
                            <p className="font-semibold">{c.name}</p>
                            <Badge variant="outline" size="sm">{c.position}</Badge>
                          </div>
                        </div>
                        <Badge
                          variant={c.threat === 'high' ? 'destructive' : c.threat === 'medium' ? 'warning' : 'soft'}
                          size="sm"
                        >
                          {c.threat} threat
                        </Badge>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-md bg-success/5 p-2.5 text-xs">
                          <p className="font-semibold text-success">Their strength</p>
                          <p className="mt-0.5 text-muted-foreground">{c.strength}</p>
                        </div>
                        <div className="rounded-md bg-destructive/5 p-2.5 text-xs">
                          <p className="font-semibold text-destructive">Their weakness</p>
                          <p className="mt-0.5 text-muted-foreground">{c.weakness}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/app/crm/accounts/lumen-health" className="flex items-center gap-2 hover:text-primary">
                <Building2 className="size-4 text-muted-foreground" />
                <span className="font-semibold">{opp.customer}</span>
                <ExternalLink className="size-3" />
              </Link>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span>Healthcare</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Employees</span>
                  <span>2,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ARR</span>
                  <span className="font-semibold">$0 (new)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Stakeholders</CardTitle>
              <Button variant="ghost" size="icon-sm">
                <Plus className="size-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {stakeholders.map((s) => (
                <div key={s.name} className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback name={s.name}>{initials(s.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.title}</p>
                  </div>
                  <Badge
                    variant="outline"
                    size="sm"
                    className={cn(
                      s.role === 'Champion' && 'border-success/30 bg-success/10 text-success',
                      s.role === 'Decision Maker' && 'border-primary/30 bg-primary/10 text-primary',
                      s.role === 'Influencer' && 'border-warning/30 bg-warning/10 text-warning',
                    )}
                  >
                    {s.role}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Deal team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {team.map((t) => (
                <div key={t.name} className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback name={t.name}>{initials(t.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-primary" />
                <CardTitle className="text-base">Deal health</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span>Champion identified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span>Technical validation complete</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" />
                <span>Pricing approved</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-warning" />
                <span>Security review pending</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flag className="size-4" />
                <span>Procurement signoff</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
