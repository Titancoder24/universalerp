import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Edit3,
  ExternalLink,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Send,
  Sparkles,
  StickyNote,
  Twitter,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatRelativeTime, initials } from '@/lib/utils';

const contact = {
  id: 'C-001',
  name: 'Margaret Liu',
  title: 'Chief Procurement Officer',
  company: 'Acme Industries',
  companyId: 'A-104',
  email: 'margaret.liu@acme-ind.com',
  phone: '+1 216 555 0101',
  mobile: '+1 216 555 0188',
  linkedin: 'linkedin.com/in/margaretliu',
  twitter: '@mliu_procurement',
  website: 'acme-ind.com',
  location: 'Cleveland, OH',
  timezone: 'America/New_York',
  role: 'Champion',
  owner: 'Priya Patel',
  reportsTo: 'Lillian Foster (CEO)',
  birthday: 'October 12',
  tags: ['exec', 'manufacturing', 'procurement'],
  bio: 'Margaret leads global procurement strategy at Acme Industries with a focus on supplier diversification and digital transformation initiatives. She joined Acme in 2019 from Honeywell where she ran direct materials sourcing.',
};

const communications = [
  { type: 'meeting' as const, channel: 'video', icon: Video, color: 'text-primary bg-primary/10', title: 'QBR - Q2 review and Plant 7 planning', body: 'Reviewed adoption metrics, NPS scores, and outlined Plant 7 rollout scope. Strong engagement throughout.', at: new Date(Date.now() - 1000 * 60 * 60 * 8), duration: '52 min', direction: 'inbound' as const },
  { type: 'email' as const, channel: 'email', icon: Mail, color: 'text-info bg-info/10', title: 'Sent: Plant 7 ROI analysis attached', body: 'Forwarded the 3-year ROI projection for the Plant 7 expansion based on similar rollouts at peer manufacturers.', at: new Date(Date.now() - 1000 * 60 * 60 * 24), duration: '', direction: 'outbound' as const },
  { type: 'email' as const, channel: 'email', icon: Mail, color: 'text-info bg-info/10', title: 'Inbound: Re: Sustainability module discussion', body: 'Thanks for the detailed walkthrough. The carbon tracking features are exactly what our CSO is looking for. Can we set up a 30-min for next Tuesday?', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), duration: '', direction: 'inbound' as const },
  { type: 'call' as const, channel: 'phone', icon: Phone, color: 'text-success bg-success/10', title: 'Phone call - Procurement workflow review', body: 'Discussed three pain points in current approval workflow. Margaret asked us to scope a custom integration with their SAP Ariba instance.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), duration: '34 min', direction: 'outbound' as const },
  { type: 'note' as const, channel: 'internal', icon: StickyNote, color: 'text-warning bg-warning/10', title: 'Internal note: Buying signals', body: 'Margaret mentioned the board approved a $2M digital transformation budget for FY2027. Position our expansion plan to align with that timeline.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), duration: '', direction: 'internal' as const },
  { type: 'meeting' as const, channel: 'video', icon: Video, color: 'text-primary bg-primary/10', title: 'Coffee chat - Industry trends', body: 'Casual conversation about manufacturing PMI trends and how Acme is approaching supplier risk. Strong rapport built.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), duration: '38 min', direction: 'inbound' as const },
  { type: 'email' as const, channel: 'email', icon: Mail, color: 'text-info bg-info/10', title: 'Sent: Sustainability module deep-dive', body: 'Sent product brief covering carbon scope 1/2/3 tracking, supplier emissions data, and compliance reporting workflows.', at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18), duration: '', direction: 'outbound' as const },
];

const relatedDeals = [
  { id: 'O-3110', name: 'Plant 7 Rollout', value: 245000, stage: 'Proposal' },
  { id: 'O-3111', name: 'Sustainability Module', value: 92000, stage: 'Qualification' },
];

export default function ContactDetailPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        breadcrumbs={[
          { label: 'CRM', href: '/app/crm' },
          { label: 'Contacts', href: '/app/crm/contacts' },
          { label: contact.name },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/crm/contacts">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
        title={
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback name={contact.name}>{initials(contact.name)}</AvatarFallback>
            </Avatar>
            <div>
              <span>{contact.name}</span>
              <p className="mt-0.5 text-sm font-normal text-muted-foreground">
                {contact.title} at{' '}
                <Link href={`/app/crm/accounts/${contact.companyId}`} className="hover:text-primary">
                  {contact.company}
                </Link>
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
            <Button variant="outline" size="sm">
              <Calendar className="size-4" /> Schedule
            </Button>
            <Button size="sm">
              <Edit3 className="size-4" /> Edit
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{contact.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{contact.email}</span>
              </a>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <span>{contact.phone}</span>
                <Badge variant="outline" size="sm">work</Badge>
              </a>
              <a href={`tel:${contact.mobile}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                <span>{contact.mobile}</span>
                <Badge variant="outline" size="sm">mobile</Badge>
              </a>
              <a href={`https://${contact.linkedin}`} className="flex items-center gap-2 hover:text-primary">
                <Linkedin className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{contact.linkedin}</span>
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-primary">
                <Twitter className="size-4 shrink-0 text-muted-foreground" />
                <span>{contact.twitter}</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span>{contact.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Role</span>
                <Badge variant="outline" size="sm" className="border-success/30 bg-success/10 text-success">
                  {contact.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Owner</span>
                <div className="flex items-center gap-1.5">
                  <Avatar size="xs">
                    <AvatarFallback name={contact.owner}>{initials(contact.owner)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{contact.owner}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reports to</span>
                <span>{contact.reportsTo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Timezone</span>
                <span>{contact.timezone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Birthday</span>
                <span>{contact.birthday}</span>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tags</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {contact.tags.map((t) => (
                    <Badge key={t} variant="outline" size="sm">{t}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Related deals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {relatedDeals.map((d) => (
                <Link key={d.id} href={`/app/crm/opportunities/${d.id}`} className="flex items-center justify-between rounded-md border border-border p-2.5 hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.stage} · {d.id}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold tabular-nums">
                    ${(d.value / 1000).toFixed(0)}K
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Tabs defaultValue="timeline">
            <TabsList variant="pills">
              <TabsTrigger variant="pills" value="timeline">Communications</TabsTrigger>
              <TabsTrigger variant="pills" value="emails">Emails</TabsTrigger>
              <TabsTrigger variant="pills" value="calls">Calls</TabsTrigger>
              <TabsTrigger variant="pills" value="meetings">Meetings</TabsTrigger>
              <TabsTrigger variant="pills" value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Communications history</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Mail className="size-4" /> Email
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="size-4" /> Call
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="size-4" /> Meet
                      </Button>
                      <Button variant="ghost" size="sm">
                        <StickyNote className="size-4" /> Note
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 mb-4">
                    <textarea
                      className="min-h-[60px] w-full resize-none border-0 bg-transparent text-sm focus:outline-none"
                      placeholder="Log a communication..."
                    />
                    <div className="flex justify-end">
                      <Button size="sm"><Send className="size-4" /> Post</Button>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[15px] top-0 h-full w-px bg-border" />
                    <div className="space-y-5">
                      {communications.map((c, i) => (
                        <div key={i} className="relative flex items-start gap-4">
                          <div className={cn('relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-4 ring-background', c.color)}>
                            <c.icon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <p className="text-sm font-semibold">{c.title}</p>
                              <span className="text-xs text-muted-foreground">· {formatRelativeTime(c.at)}</span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <Badge variant="outline" size="sm" className={cn(
                                c.direction === 'inbound' && 'border-success/30 bg-success/10 text-success',
                                c.direction === 'outbound' && 'border-info/30 bg-info/10 text-info',
                                c.direction === 'internal' && 'border-warning/30 bg-warning/10 text-warning',
                              )}>
                                {c.direction}
                              </Badge>
                              {c.duration && <Badge variant="outline" size="sm">{c.duration}</Badge>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emails">
              <Card>
                <CardContent className="space-y-3 pt-6">
                  {communications.filter((c) => c.type === 'email').map((e, i) => (
                    <div key={i} className="rounded-lg border border-border p-3 hover:bg-muted/30">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{e.title}</p>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(e.at)}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calls">
              <Card>
                <CardContent className="space-y-3 pt-6">
                  {communications.filter((c) => c.type === 'call').map((e, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <p className="font-medium">{e.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatRelativeTime(e.at)}</span>
                        <span>·</span>
                        <span>{e.duration}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="meetings">
              <Card>
                <CardContent className="space-y-3 pt-6">
                  {communications.filter((c) => c.type === 'meeting').map((e, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <p className="font-medium">{e.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3" />
                        <span>{formatRelativeTime(e.at)}</span>
                        <span>·</span>
                        <span>{e.duration}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardContent className="space-y-3 pt-6">
                  {communications.filter((c) => c.type === 'note').map((e, i) => (
                    <div key={i} className="rounded-lg border border-border bg-warning/5 p-3">
                      <p className="font-medium">{e.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{e.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{formatRelativeTime(e.at)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
