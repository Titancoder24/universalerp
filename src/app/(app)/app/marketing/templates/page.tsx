import {
  ArrowDown,
  Copy,
  Eye,
  Filter,
  Heart,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatNumber, formatRelativeTime, initials } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  subject: string;
  category: string;
  preview: string;
  thumbnail: string;
  uses: number;
  openRate: number;
  ctr: number;
  owner: string;
  updated: Date;
  starred?: boolean;
  isAI?: boolean;
}

const templates: Template[] = [
  { id: 'T-001', name: 'Welcome to the trial', subject: 'Welcome to UniversalERP — let\'s get you set up', category: 'Onboarding', preview: 'Hi {{first_name}}, welcome aboard! We\'re thrilled to have {{company}} starting their UniversalERP journey...', thumbnail: 'from-primary/30 to-primary/5', uses: 1248, openRate: 68, ctr: 24, owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 8), starred: true },
  { id: 'T-002', name: 'Demo follow-up', subject: 'Thanks for the demo, {{first_name}} - next steps inside', category: 'Sales', preview: 'It was great walking through the platform with you today. As discussed, here are the resources I promised...', thumbnail: 'from-success/30 to-success/5', uses: 982, openRate: 72, ctr: 32, owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24), starred: true },
  { id: 'T-003', name: 'Cold outbound v3', subject: 'Quick question about {{company}}\'s procurement workflow', category: 'Outbound', preview: 'I noticed {{company}} recently announced expansion into 3 new markets. Most operations leaders we work with...', thumbnail: 'from-info/30 to-info/5', uses: 720, openRate: 28, ctr: 8, owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), isAI: true },
  { id: 'T-004', name: 'Webinar invitation', subject: '[Live webinar] How healthcare orgs are cutting procurement time by 60%', category: 'Events', preview: 'Join us live on Thursday for a 30-minute deep-dive with two healthcare procurement leaders...', thumbnail: 'from-warning/30 to-warning/5', uses: 612, openRate: 42, ctr: 18, owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
  { id: 'T-005', name: 'Case study share', subject: '{{company}} could see similar results - here\'s how {{customer}} did it', category: 'Nurture', preview: 'You mentioned challenges around supplier diversification. {{customer}} solved this exact problem...', thumbnail: 'from-purple-500/30 to-purple-500/5', uses: 540, openRate: 58, ctr: 22, owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), starred: true },
  { id: 'T-006', name: 'Pricing follow-up', subject: 'Pricing details for {{company}} - enterprise tier', category: 'Sales', preview: 'Hi {{first_name}}, attached is the pricing breakdown we discussed including the enterprise SSO add-on...', thumbnail: 'from-pink-500/30 to-pink-500/5', uses: 482, openRate: 64, ctr: 38, owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
  { id: 'T-007', name: 'Re-engagement', subject: 'We miss you, {{first_name}}', category: 'Nurture', preview: 'It\'s been a few months and we wanted to check in. The platform has evolved a lot since you last...', thumbnail: 'from-cyan-500/30 to-cyan-500/5', uses: 420, openRate: 18, ctr: 4, owner: 'Jamal Khan', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6) },
  { id: 'T-008', name: 'Renewal reminder - 60d', subject: 'Your {{company}} renewal is coming up - let\'s chat', category: 'Renewals', preview: 'Hi {{first_name}}, with your subscription renewing on {{renewal_date}}, I wanted to schedule...', thumbnail: 'from-orange-500/30 to-orange-500/5', uses: 384, openRate: 76, ctr: 42, owner: 'Aisha Robinson', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
  { id: 'T-009', name: 'Product update digest', subject: '{{month}} product update: 12 new features you asked for', category: 'Newsletters', preview: 'Here\'s everything new this month. The team has been shipping fast based on your feedback...', thumbnail: 'from-emerald-500/30 to-emerald-500/5', uses: 348, openRate: 52, ctr: 28, owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9) },
  { id: 'T-010', name: 'Trial expiring soon', subject: 'Your trial ends in 3 days - convert or extend?', category: 'Conversion', preview: 'Your free trial wraps up on {{trial_end}}. You\'ve done {{usage_count}} key actions which puts you...', thumbnail: 'from-red-500/30 to-red-500/5', uses: 320, openRate: 81, ctr: 48, owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11), isAI: true },
  { id: 'T-011', name: 'Customer story request', subject: 'Would you be open to sharing your {{company}} story?', category: 'Customer Marketing', preview: 'Your results with the platform have been incredible. We\'d love to feature {{company}} as...', thumbnail: 'from-blue-500/30 to-blue-500/5', uses: 245, openRate: 64, ctr: 18, owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
  { id: 'T-012', name: 'Event recap', subject: 'Thanks for joining us at Manufacturing Tech Summit', category: 'Events', preview: 'It was great connecting with so many manufacturing leaders this week. Here are the slides...', thumbnail: 'from-teal-500/30 to-teal-500/5', uses: 218, openRate: 48, ctr: 14, owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18) },
];

const categoryCounts = templates.reduce((acc, t) => {
  acc[t.category] = (acc[t.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export default function TemplatesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Email templates"
        description="A library of proven templates with performance metrics. Built for reuse, optimized with AI."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="size-4" /> Generate with AI
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New template
            </Button>
          </>
        }
      />

      <Tabs defaultValue="all">
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="all">All templates ({templates.length})</TabsTrigger>
          <TabsTrigger variant="pills" value="starred">
            <Star className="size-3.5 fill-warning text-warning" /> Starred
          </TabsTrigger>
          <TabsTrigger variant="pills" value="mine">My templates</TabsTrigger>
          <TabsTrigger variant="pills" value="ai">AI-generated</TabsTrigger>
          <TabsTrigger variant="pills" value="archive">Archive</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[240px] flex-1">
          <InputAddon prefix={<Search className="size-4" />}>
            <Input placeholder="Search templates..." />
          </InputAddon>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.keys(categoryCounts).map((cat) => (
              <SelectItem key={cat} value={cat.toLowerCase()}>
                {cat} ({categoryCounts[cat]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="recent">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="popular">Most used</SelectItem>
            <SelectItem value="open">Highest open rate</SelectItem>
            <SelectItem value="ctr">Highest CTR</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm">
          <Filter className="size-4" /> More
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((t) => (
          <Card key={t.id} className="group overflow-hidden transition-all hover:shadow-md">
            <div className={cn('relative h-32 bg-gradient-to-br', t.thumbnail)}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Mail className="size-10 text-foreground/30" />
              </div>
              {t.starred && (
                <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 shadow-sm">
                  <Star className="size-3.5 fill-warning text-warning" />
                </div>
              )}
              {t.isAI && (
                <div className="absolute left-2 top-2">
                  <Badge variant="outline" size="sm" className="border-primary/30 bg-background/90 text-primary backdrop-blur">
                    <Sparkles className="size-3" /> AI
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-1 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="outline" size="xs">
                  <Eye className="size-3" /> Preview
                </Button>
                <Button variant="default" size="xs">
                  Use
                </Button>
              </div>
            </div>
            <CardContent className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold leading-tight">{t.name}</h3>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.subject}</p>
                </div>
                <Button variant="ghost" size="icon-sm" className="-mr-1 -mt-1">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <Badge variant="outline" size="sm">{t.category}</Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Uses</p>
                  <p className="font-mono font-semibold tabular-nums">{formatNumber(t.uses)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Open</p>
                  <p className={cn(
                    'font-mono font-semibold tabular-nums',
                    t.openRate >= 60 && 'text-success',
                    t.openRate < 30 && 'text-warning',
                  )}>
                    {t.openRate}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">CTR</p>
                  <p className={cn(
                    'font-mono font-semibold tabular-nums',
                    t.ctr >= 25 && 'text-success',
                  )}>
                    {t.ctr}%
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <Avatar size="xs">
                    <AvatarFallback name={t.owner}>{initials(t.owner)}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{t.owner.split(' ')[0]}</span>
                </div>
                <span className="text-muted-foreground">{formatRelativeTime(t.updated)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
