'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  Building2,
  Clock,
  Eye,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  Paperclip,
  Pencil,
  Phone,
  Send,
  Sparkles,
  Star,
  StickyNote,
  Tag,
  User,
  Wand,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { cn, initials } from '@/lib/utils';

const ticket = {
  id: 'TKT-8421',
  subject: 'Pump PMP-310 vibration after install',
  status: 'open' as const,
  priority: 'urgent' as const,
  category: 'Technical · Warranty',
  customer: {
    name: 'Acme Industries',
    contact: 'Sarah Mitchell',
    role: 'Maintenance Manager',
    email: 'sarah.mitchell@acme.example',
    phone: '+1 (312) 555-0142',
    tier: 'Premium',
    accountValue: 245320,
  },
  agent: 'Sofia Lee',
  channel: 'Phone',
  created: '2026-05-15 13:22',
  sla: { responseDue: '14:22 (60min)', resolveDue: '16:22 (240min)', status: 'on_track' as const },
};

type Msg = {
  id: string;
  author: string;
  role: 'agent' | 'customer' | 'system' | 'note';
  time: string;
  body: string;
  attachments?: string[];
};

const conversation: Msg[] = [
  { id: 'm1', author: 'System', role: 'system', time: '13:22', body: 'Ticket created from inbound call · Auto-assigned to Sofia Lee · SLA Premium (60min response, 4h resolve)' },
  { id: 'm2', author: 'Sarah Mitchell', role: 'customer', time: '13:24', body: 'Hi Sofia, calling about the PMP-310-X we received last Wednesday. We installed it Friday and after about 8 hours of running we are seeing vibration well above your spec - over 4.5mm/s at full load. Production manager wants this resolved ASAP, we have a critical line down for inspection now.', attachments: ['vibration_reading_2026-05-15.csv'] },
  { id: 'm3', author: 'Sofia Lee', role: 'agent', time: '13:31', body: 'Hi Sarah, thank you for the quick report and for sending the vibration data. I am opening NCR-1135 right now to track this as a critical warranty issue. A few quick questions: 1) Did the unit ship with our balancing certificate, and was the foundation prepared per our install guide? 2) Can you confirm the alignment was checked after first run? I am pulling the unit history and engineering will be looped in within 30 minutes.' },
  { id: 'm4', author: 'Sofia Lee', role: 'note', time: '13:33', body: 'Internal note: Customer is Acme Industries (Premium tier, $245k YTD). PMP-310 SN 7821-A shipped 2026-05-08 against SO-44128. Balance cert G2.5 attached. Loop in @Adrian.Reyes for engineering response.' },
  { id: 'm5', author: 'Sarah Mitchell', role: 'customer', time: '13:42', body: 'Yes, we received G2.5 cert and our team followed the install procedure. Alignment was within 0.05mm per the guide. We have not had this issue with any prior PMP units from you.' },
  { id: 'm6', author: 'Adrian Reyes', role: 'agent', time: '13:48', body: 'Sarah, Adrian here from Engineering. The vibration profile in the CSV shows a clear 2x rotational frequency component which often indicates imbalance or misalignment. Given your alignment check, I suspect impeller imbalance. We have an open CAPA on tightening G2.5 → G1.0 spec. Can we schedule a field tech to visit tomorrow morning? We will bring a portable balancer and a backup pump unit.' },
  { id: 'm7', author: 'Sarah Mitchell', role: 'customer', time: '13:55', body: 'Yes, please. Tomorrow 8 AM works. Bring the backup. We have a production deadline Thursday.' },
  { id: 'm8', author: 'Sofia Lee', role: 'agent', time: '14:02', body: 'Perfect. I have scheduled Field Tech Marcus to be onsite tomorrow at 8 AM with PMP-310-X SN 7891-B as backup. RMA-1018 created for the failing unit. You will receive the dispatch confirmation by email within 5 minutes. Anything else I can help with?' },
];

const relatedKB = [
  { id: 'KB-0214', title: 'PMP-310 Series Installation Guide', views: 1240, rating: 4.8 },
  { id: 'KB-0312', title: 'Centrifugal Pump Vibration Troubleshooting', views: 892, rating: 4.9 },
  { id: 'KB-0418', title: 'Foundation Preparation for Heavy Pumps', views: 612, rating: 4.7 },
  { id: 'KB-0156', title: 'Warranty Claim Process - Field Service', views: 2104, rating: 4.6 },
];

const similarTickets = [
  { id: 'TKT-8208', subject: 'PMP-310 vibration at startup', customer: 'Marine Systems Inc', status: 'closed' as const, age: '3w ago' },
  { id: 'TKT-7984', subject: 'Centrifugal pump alignment issue', customer: 'Continental Auto', status: 'closed' as const, age: '6w ago' },
  { id: 'TKT-7821', subject: 'PMP series imbalance complaint', customer: 'Pacific Mfg', status: 'closed' as const, age: '2mo ago' },
];

const aiSuggestions = [
  'Cite NCR-1135 in field service report and reference CAPA-0418 (balancing upgrade) for context.',
  'Offer customer credit toward next service contract as goodwill gesture given Premium tier status.',
  'Schedule proactive vibration check for other Acme units (4 PMP-310 in service since Jan 2026).',
];

const roleStyle: Record<Msg['role'], { wrap: string; bubble: string; icon: typeof MessageSquare }> = {
  agent: { wrap: 'flex-row-reverse', bubble: 'bg-primary/5 border-primary/30', icon: User },
  customer: { wrap: '', bubble: 'bg-card', icon: MessageSquare },
  note: { wrap: '', bubble: 'bg-warning/10 border-warning/40 border-dashed', icon: StickyNote },
  system: { wrap: 'justify-center', bubble: 'bg-muted text-muted-foreground border-dashed', icon: Sparkles },
};

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [reply, setReply] = React.useState('');
  const [isNote, setIsNote] = React.useState(false);

  return (
    <div className="space-y-4 p-6">
      <PageHeader
        title={`${id} · ${ticket.subject}`}
        description={`${ticket.customer.name} · ${ticket.category} · ${ticket.channel}`}
        breadcrumbs={[
          { label: 'Service', href: '/app/service' },
          { label: 'Tickets', href: '/app/service/tickets' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/service/tickets"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm"><Eye className="size-4" /> Watch</Button>
            <Button variant="outline" size="sm"><Pencil className="size-4" /> Edit</Button>
            <Button variant="success" size="sm">Resolve</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[20rem_1fr_22rem]">
        {/* Left column - ticket info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={ticket.status} />
                <Badge variant="destructive" size="sm" className="capitalize">{ticket.priority}</Badge>
              </div>
              <div>
                <div className="text-2xs uppercase tracking-wide text-muted-foreground">Customer</div>
                <div className="mt-1 flex items-center gap-2">
                  <Avatar size="sm"><AvatarFallback>{initials(ticket.customer.name)}</AvatarFallback></Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{ticket.customer.name}</div>
                    <Badge variant="soft" size="sm">{ticket.customer.tier}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-border pt-3 text-sm">
                <div className="font-medium">{ticket.customer.contact}</div>
                <div className="text-xs text-muted-foreground">{ticket.customer.role}</div>
                <div className="flex items-center gap-1.5 text-xs"><MessageSquare className="size-3" /> {ticket.customer.email}</div>
                <div className="flex items-center gap-1.5 text-xs"><Phone className="size-3" /> {ticket.customer.phone}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">SLA Timer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">First response</span>
                  <Badge variant="success" size="sm">On track</Badge>
                </div>
                <div className="mt-1 font-mono text-sm font-semibold tabular-nums">{ticket.sla.responseDue}</div>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Resolution</span>
                  <Badge variant="success" size="sm">On track</Badge>
                </div>
                <div className="mt-1 font-mono text-sm font-semibold tabular-nums">{ticket.sla.resolveDue}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              {[
                ['Created', ticket.created],
                ['Channel', ticket.channel],
                ['Category', ticket.category],
                ['Agent', ticket.agent],
                ['Account value', '$245,320'],
                ['Linked NCR', 'NCR-1135'],
                ['Linked RMA', 'RMA-1018'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className="text-xs font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center column - conversation */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="size-4" /> Conversation</CardTitle>
                <span className="text-xs text-muted-foreground">{conversation.length} messages</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-4 max-h-[600px] overflow-y-auto">
              {conversation.map((m) => {
                const style = roleStyle[m.role];
                const Icon = style.icon;
                if (m.role === 'system') {
                  return (
                    <div key={m.id} className="flex justify-center">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border bg-muted/40 px-3 py-1 text-2xs text-muted-foreground">
                        <Sparkles className="size-3" /> {m.body} · <span className="font-mono">{m.time}</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className={cn('flex gap-2', style.wrap)}>
                    <Avatar size="sm" className="mt-0.5 shrink-0">
                      <AvatarFallback>{initials(m.author)}</AvatarFallback>
                    </Avatar>
                    <div className={cn('flex max-w-[80%] flex-col gap-1', m.role === 'agent' && 'items-end')}>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium">{m.author}</span>
                        {m.role === 'agent' && <Badge variant="outline" size="sm">Agent</Badge>}
                        {m.role === 'note' && <Badge variant="warning" size="sm">Internal</Badge>}
                        <span className="text-muted-foreground">{m.time}</span>
                      </div>
                      <div className={cn('rounded-lg border px-3 py-2 text-sm', style.bubble)}>
                        {m.body}
                        {m.attachments && (
                          <div className="mt-2 space-y-1 border-t border-border/50 pt-2">
                            {m.attachments.map((a) => (
                              <div key={a} className="flex items-center gap-1.5 text-xs">
                                <Paperclip className="size-3" /> <span className="text-primary underline-offset-2 hover:underline cursor-pointer">{a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <div className="border-t border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isNote ? 'outline' : 'default'}
                  onClick={() => setIsNote(false)}
                  className="gap-1.5"
                >
                  <MessageSquare className="size-3.5" /> Reply
                </Button>
                <Button
                  size="sm"
                  variant={isNote ? 'warning' : 'outline'}
                  onClick={() => setIsNote(true)}
                  className="gap-1.5"
                >
                  <StickyNote className="size-3.5" /> Internal note
                </Button>
                <div className="ml-auto flex items-center gap-1">
                  <Button variant="outline" size="sm"><Wand className="size-3.5" /> Macros</Button>
                  <Button variant="outline" size="sm"><Paperclip className="size-3.5" /></Button>
                </div>
              </div>
              <Textarea
                placeholder={isNote ? 'Internal note (visible only to your team)...' : 'Type your reply to the customer...'}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className={cn('min-h-[100px]', isNote && 'border-warning/40 bg-warning/5')}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag className="size-3" /> Tags · <Badge variant="outline" size="sm">vibration</Badge>
                  <Badge variant="outline" size="sm">field-service</Badge>
                </div>
                <Button size="sm">
                  <Send className="size-4" /> {isNote ? 'Save note' : 'Send reply'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - related */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Sparkles className="size-4 text-primary" /> AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Bot className="size-3.5 shrink-0 text-primary" />
                    <div>{s}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><FileText className="size-4" /> Related KB Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {relatedKB.map((kb) => (
                <div key={kb.id} className="cursor-pointer rounded-lg border border-border p-3 transition-colors hover:bg-muted/40">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs text-primary">{kb.id}</span>
                    <span className="ml-auto text-2xs text-muted-foreground flex items-center gap-0.5"><Star className="size-3 fill-warning text-warning" /> {kb.rating}</span>
                  </div>
                  <div className="mt-1 text-sm font-medium">{kb.title}</div>
                  <div className="mt-0.5 text-2xs text-muted-foreground">{kb.views} views</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><LinkIcon className="size-4" /> Similar Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {similarTickets.map((t) => (
                <div key={t.id} className="cursor-pointer rounded-lg border border-border p-2.5 transition-colors hover:bg-muted/40">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs text-primary">{t.id}</span>
                    <StatusBadge status={t.status} size="sm" />
                  </div>
                  <div className="mt-1 text-xs font-medium">{t.subject}</div>
                  <div className="mt-0.5 flex items-center justify-between text-2xs text-muted-foreground">
                    <span>{t.customer}</span>
                    <span>{t.age}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
