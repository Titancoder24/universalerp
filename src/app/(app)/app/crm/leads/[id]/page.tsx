import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Edit3,
  FileText,
  Flame,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Phone,
  Send,
  Sparkles,
  StickyNote,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
  Video,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn, formatCurrency, formatDateTime, formatRelativeTime, initials } from '@/lib/utils';

const lead = {
  id: 'L-1024',
  name: 'Alicia Park',
  title: 'VP Engineering',
  company: 'Northwind Software',
  email: 'alicia@northwind.io',
  phone: '+1 415 555 0142',
  linkedin: 'linkedin.com/in/aliciapark',
  website: 'northwind.io',
  location: 'San Francisco, CA',
  source: 'Inbound form',
  status: 'qualified',
  score: 94,
  value: 145000,
  owner: 'Sarah Chen',
  industry: 'B2B SaaS',
  employees: '120-150',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
};

const scoreFactors = [
  { label: 'Engaged with 4+ emails', weight: '+18', positive: true },
  { label: 'Viewed pricing page twice', weight: '+15', positive: true },
  { label: 'Company size matches ICP', weight: '+12', positive: true },
  { label: 'Title is decision-maker', weight: '+10', positive: true },
  { label: 'Downloaded enterprise whitepaper', weight: '+9', positive: true },
  { label: 'Industry: B2B SaaS', weight: '+8', positive: true },
  { label: 'No recent activity for 3 days', weight: '-4', positive: false },
];

const timeline = [
  {
    type: 'call' as const,
    icon: Phone,
    color: 'text-success bg-success/10',
    actor: 'Sarah Chen',
    title: 'Discovery call - 24 minutes',
    body: 'Discussed current procurement workflow, pain points around manual reconciliation, and integration requirements with their NetSuite instance. Alicia confirmed budget is approved for Q3 implementation.',
    at: new Date(Date.now() - 1000 * 60 * 18),
    meta: ['Outbound', '24 min', 'Recording available'],
  },
  {
    type: 'email' as const,
    icon: Mail,
    color: 'text-info bg-info/10',
    actor: 'Sarah Chen',
    title: 'Sent: Case study on Synapse Health rollout',
    body: 'Forwarded the Synapse Health case study showing 4-week implementation and $1.2M annual savings. Asked if Tuesday or Thursday works better for the next call with their CFO.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 4),
    meta: ['Opened 3x', 'Clicked link'],
  },
  {
    type: 'note' as const,
    icon: StickyNote,
    color: 'text-warning bg-warning/10',
    actor: 'Sarah Chen',
    title: 'Internal note',
    body: 'Alicia mentioned their current vendor contract renews October 15. We have a 6-week window to land this. Need to loop in solutions engineering on the NetSuite integration.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 6),
    meta: ['Pinned'],
  },
  {
    type: 'email' as const,
    icon: Mail,
    color: 'text-info bg-info/10',
    actor: 'Alicia Park',
    title: 'Inbound: Re: Demo follow-up',
    body: 'Thanks for the demo — really impressive how the AI-assisted matching engine handles our edge cases. Could you share pricing for the enterprise tier with SSO + audit logs? CFO wants to see numbers before our next conversation.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    meta: ['Inbound reply'],
  },
  {
    type: 'meeting' as const,
    icon: Video,
    color: 'text-primary bg-primary/10',
    actor: 'Sarah Chen',
    title: 'Product demo - 45 minutes',
    body: 'Full demo of the platform with Alicia, her head of operations, and one senior engineer. Walked through the procurement workflow, approval rules, and AI matching. Strong engagement throughout.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    meta: ['3 attendees', 'Recording shared'],
  },
  {
    type: 'note' as const,
    icon: StickyNote,
    color: 'text-warning bg-warning/10',
    actor: 'Marcus Rivera',
    title: 'Reassigned to Sarah Chen',
    body: 'Sarah has deep experience with the NetSuite integration that this account needs. Transferring ownership to maximize win probability.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    meta: ['Ownership change'],
  },
  {
    type: 'email' as const,
    icon: Mail,
    color: 'text-info bg-info/10',
    actor: 'Marcus Rivera',
    title: 'Sent: Welcome & next steps',
    body: 'Hi Alicia, thanks for filling out the demo request form. Based on your note about needing to replace your current procurement tool by Q4, I think we can move fast. I have time Tuesday or Wednesday for a 30-min discovery call.',
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    meta: ['Opened', 'Replied'],
  },
  {
    type: 'lead' as const,
    icon: Sparkles,
    color: 'text-muted-foreground bg-muted',
    actor: 'System',
    title: 'Lead created from inbound form',
    body: 'Form: "Request a demo" • Page: /pricing-enterprise • Referrer: Google search "ai procurement platform"',
    at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    meta: ['Auto-scored 87'],
  },
];

const aiSuggestions = [
  {
    icon: FileText,
    title: 'Share the FinFlow case study',
    body: 'FinFlow is a similar-sized B2B SaaS that closed in 38 days. The implementation timeline matches what Alicia mentioned.',
    cta: 'Send case study',
  },
  {
    icon: Users,
    title: 'Loop in Jordan from Solutions',
    body: 'Their NetSuite integration question came up twice. Jordan handled the same integration for Synapse Health.',
    cta: 'Add Jordan to next call',
  },
  {
    icon: Calendar,
    title: 'Book CFO conversation this week',
    body: 'Procurement renewal is October 15. Closing before then needs CFO buy-in in the next 2 weeks.',
    cta: 'Send meeting invite',
  },
  {
    icon: Zap,
    title: 'Mention SOC 2 Type II',
    body: 'Northwind is mid-market SaaS — security questions are likely. Pre-empt with SOC 2 docs in next email.',
    cta: 'Attach compliance pack',
  },
];

export default function LeadDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        breadcrumbs={[
          { label: 'CRM', href: '/app/crm' },
          { label: 'Leads', href: '/app/crm/leads' },
          { label: lead.id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/crm/leads">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        title={
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback name={lead.name}>{initials(lead.name)}</AvatarFallback>
            </Avatar>
            <div>
              <span>{lead.name}</span>
              <p className="mt-0.5 text-sm font-normal text-muted-foreground">
                {lead.title} at {lead.company}
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
              <Phone className="size-4" /> Call
            </Button>
            <Button size="sm">
              <UserCheck className="size-4" /> Convert to opportunity
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit3 className="size-4" /> Edit lead
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ChevronRight className="size-4" /> Reassign
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive>
                  <UserX className="size-4" /> Disqualify
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column - Lead info */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lead details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={lead.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">{lead.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Deal size</span>
                <span className="font-mono font-semibold">{formatCurrency(lead.value)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Owner</span>
                <div className="flex items-center gap-1.5">
                  <Avatar size="xs">
                    <AvatarFallback name={lead.owner}>{initials(lead.owner)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{lead.owner}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatRelativeTime(lead.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">AI score</CardTitle>
              <Flame className="size-4 text-destructive" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-success tabular-nums">{lead.score}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
                <Badge variant="success" size="sm" className="ml-auto">
                  Hot lead
                </Badge>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-warning to-success"
                  style={{ width: `${lead.score}%` }}
                />
              </div>
              <Separator />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Why this score
              </p>
              <ul className="space-y-1.5">
                {scoreFactors.map((f, i) => (
                  <li key={i} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{f.label}</span>
                    <span
                      className={cn(
                        'font-mono font-semibold',
                        f.positive ? 'text-success' : 'text-destructive',
                      )}
                    >
                      {f.weight}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="size-4 text-muted-foreground" />
                <span className="truncate">{lead.email}</span>
              </a>
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="size-4 text-muted-foreground" />
                <span>{lead.phone}</span>
              </a>
              <a href={`https://${lead.linkedin}`} className="flex items-center gap-2 hover:text-primary">
                <Linkedin className="size-4 text-muted-foreground" />
                <span className="truncate">{lead.linkedin}</span>
              </a>
              <a href={`https://${lead.website}`} className="flex items-center gap-2 hover:text-primary">
                <Globe className="size-4 text-muted-foreground" />
                <span>{lead.website}</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                <span>{lead.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                <span className="font-medium">{lead.company}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Industry</span>
                <span>{lead.industry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Employees</span>
                <span>{lead.employees}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center column - Activity timeline */}
        <div className="space-y-4 lg:col-span-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">Quick log</CardTitle>
                <div className="ml-auto flex flex-wrap items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Phone className="size-4" /> Call
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="size-4" /> Email
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="size-4" /> Meeting
                  </Button>
                  <Button variant="ghost" size="sm">
                    <StickyNote className="size-4" /> Note
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <textarea
                  className="min-h-[60px] w-full resize-none border-0 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-0"
                  placeholder="Add a note, log a call, or send an email..."
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Button variant="ghost" size="icon-sm">
                      <Paperclip className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Calendar className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <MessageCircle className="size-4" />
                    </Button>
                  </div>
                  <Button size="sm">
                    <Send className="size-4" /> Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Activity timeline</CardTitle>
              <Badge variant="outline" size="sm">
                {timeline.length} events
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[15px] top-0 h-full w-px bg-border" />
                <div className="space-y-5">
                  {timeline.map((t, i) => (
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
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {t.body}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {t.meta.map((m) => (
                            <Badge key={m} variant="outline" size="sm">
                              {m}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - AI suggestions */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-base">AI suggestions</CardTitle>
                  <CardDescription className="text-xs">Next best actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-start gap-2">
                    <s.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{s.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {s.body}
                      </p>
                      <Button variant="soft" size="xs" className="mt-2.5">
                        {s.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email opens</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Link clicks</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pages viewed</span>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last visit</span>
                <span className="font-semibold">{formatRelativeTime(new Date(Date.now() - 1000 * 60 * 90))}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-1.5 text-xs text-success">
                <TrendingUp className="size-3.5" />
                <span className="font-medium">Engagement trending up 22% this week</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
