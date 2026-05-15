'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Clock,
  Download,
  Filter,
  Kanban,
  LayoutList,
  Plus,
  Search,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, initials } from '@/lib/utils';

type Priority = 'low' | 'med' | 'high' | 'urgent';
type Status = 'open' | 'in_progress' | 'pending' | 'closed';

const tickets: Array<{
  id: string;
  subject: string;
  customer: string;
  category: string;
  priority: Priority;
  status: Status;
  agent: string;
  age: string;
  slaStatus: 'on_track' | 'at_risk' | 'breached';
  preview: string;
  channel: 'email' | 'web' | 'phone' | 'chat';
}> = [
  { id: 'TKT-8421', subject: 'Pump PMP-310 vibration after install', customer: 'Acme Industries', category: 'Technical', priority: 'urgent', status: 'open', agent: 'Sofia Lee', age: '12m', slaStatus: 'on_track', preview: 'Customer reports vibration > 4.5mm/s on PMP-310-X delivered last week...', channel: 'phone' },
  { id: 'TKT-8420', subject: 'Invoice INV-2089 - shipping line item', customer: 'TechCorp Solutions', category: 'Billing', priority: 'low', status: 'in_progress', agent: 'Marcus Jensen', age: '24m', slaStatus: 'on_track', preview: 'Could you clarify the freight surcharge on our invoice?', channel: 'email' },
  { id: 'TKT-8419', subject: 'Need replacement encoder for ASSY-02', customer: 'Continental Auto Parts', category: 'Warranty', priority: 'high', status: 'pending', agent: 'Aisha Nasser', age: '1h', slaStatus: 'on_track', preview: 'Encoder cable on our KUKA K2 unit failed at 14 months. Per warranty...', channel: 'web' },
  { id: 'TKT-8418', subject: 'Warranty claim - GBX-450-A noise', customer: 'Global Manufacturing', category: 'Warranty', priority: 'med', status: 'open', agent: 'Devon Thompson', age: '2h', slaStatus: 'on_track', preview: 'Unit installed 3 months ago is generating excessive noise at 1800 RPM...', channel: 'email' },
  { id: 'TKT-8417', subject: 'Shipment delay - order SO-44128', customer: 'Western Logistics', category: 'Shipping', priority: 'med', status: 'in_progress', agent: 'Priya Krishnan', age: '3h', slaStatus: 'on_track', preview: 'When will my order ship? It was supposed to leave yesterday.', channel: 'chat' },
  { id: 'TKT-8416', subject: 'How to recalibrate Zeiss CMM', customer: 'Pacific Manufacturing', category: 'Technical', priority: 'low', status: 'pending', agent: 'Marcus Jensen', age: '4h', slaStatus: 'on_track', preview: 'Looking for documentation on the proper recalibration procedure...', channel: 'web' },
  { id: 'TKT-8415', subject: 'Bulk order pricing inquiry', customer: 'StartupCo', category: 'Sales', priority: 'med', status: 'open', agent: 'Sofia Lee', age: '5h', slaStatus: 'at_risk', preview: 'We are looking at 200 units of MTR-2.2KW. What is your volume pricing?', channel: 'email' },
  { id: 'TKT-8414', subject: 'Hydraulic valve VLV-104 leak', customer: 'Marine Systems Inc', category: 'Technical', priority: 'high', status: 'in_progress', agent: 'Liam Rodriguez', age: '6h', slaStatus: 'at_risk', preview: 'Two units installed last week are showing weeping at fitting...', channel: 'phone' },
  { id: 'TKT-8413', subject: 'Tax exempt certificate update', customer: 'Eastern Distribution', category: 'Billing', priority: 'low', status: 'pending', agent: 'Aisha Nasser', age: '8h', slaStatus: 'on_track', preview: 'Please update our tax exempt status. New certificate attached.', channel: 'email' },
  { id: 'TKT-8412', subject: 'Tracking number not working', customer: 'NorthCo Industries', category: 'Shipping', priority: 'low', status: 'in_progress', agent: 'Priya Krishnan', age: '10h', slaStatus: 'on_track', preview: 'The UPS tracking number you provided returns no results...', channel: 'web' },
  { id: 'TKT-8411', subject: 'PCBA failure rate high in field', customer: 'Enterprise Ltd', category: 'Technical', priority: 'urgent', status: 'open', agent: 'Devon Thompson', age: '14h', slaStatus: 'breached', preview: '6 out of 40 PCBAs have failed in the field within 60 days. Need URGENT root cause...', channel: 'phone' },
  { id: 'TKT-8410', subject: 'Return procedure for damaged shipment', customer: 'Acme Industries', category: 'Shipping', priority: 'med', status: 'in_progress', agent: 'Sofia Lee', age: '16h', slaStatus: 'on_track', preview: 'Pallet arrived damaged. What is the return / replacement procedure?', channel: 'email' },
  { id: 'TKT-8409', subject: 'Spec sheet for MTR-2.2KW', customer: 'TechCorp Solutions', category: 'General', priority: 'low', status: 'closed', agent: 'Marcus Jensen', age: '18h', slaStatus: 'on_track', preview: 'Can you send the latest data sheet for the 2.2kW motor?', channel: 'chat' },
  { id: 'TKT-8408', subject: 'Custom finish RAL color request', customer: 'Continental Auto Parts', category: 'Sales', priority: 'low', status: 'pending', agent: 'Liam Rodriguez', age: '20h', slaStatus: 'on_track', preview: 'Is it possible to order with RAL 5015 finish instead of standard grey?', channel: 'email' },
  { id: 'TKT-8407', subject: 'Service contract renewal Q2', customer: 'Global Manufacturing', category: 'Sales', priority: 'med', status: 'in_progress', agent: 'Sofia Lee', age: '22h', slaStatus: 'on_track', preview: 'Annual service contract is up for renewal in 30 days. Please send proposal.', channel: 'email' },
  { id: 'TKT-8406', subject: 'BOM document access issue', customer: 'Pacific Manufacturing', category: 'Technical', priority: 'low', status: 'closed', agent: 'Aisha Nasser', age: '1d', slaStatus: 'on_track', preview: 'Cannot access BOM-GBX-450-A on the customer portal...', channel: 'web' },
  { id: 'TKT-8405', subject: 'HVAC unit DOA from shipment', customer: 'Western Logistics', category: 'Warranty', priority: 'high', status: 'in_progress', agent: 'Devon Thompson', age: '1d', slaStatus: 'breached', preview: 'HVA-CMP-15 arrived dead on arrival. Need replacement urgently for project...', channel: 'phone' },
];

const priorityMeta: Record<Priority, { variant: 'destructive' | 'warning' | 'default' | 'secondary'; tone: string }> = {
  urgent: { variant: 'destructive', tone: 'border-l-destructive' },
  high: { variant: 'warning', tone: 'border-l-warning' },
  med: { variant: 'default', tone: 'border-l-primary' },
  low: { variant: 'secondary', tone: 'border-l-muted-foreground' },
};

const slaMeta: Record<string, { variant: 'success' | 'warning' | 'destructive'; label: string }> = {
  on_track: { variant: 'success', label: 'On track' },
  at_risk: { variant: 'warning', label: 'At risk' },
  breached: { variant: 'destructive', label: 'Breached' },
};

const channelIcon = { email: '✉', web: '⌘', phone: '☏', chat: '◌' };

const kanbanCols: { status: Status; label: string }[] = [
  { status: 'open', label: 'Open' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'pending', label: 'Pending customer' },
  { status: 'closed', label: 'Closed' },
];

export default function TicketsPage() {
  const [view, setView] = React.useState<'queue' | 'kanban'>('queue');
  const [search, setSearch] = React.useState('');
  const [priority, setPriority] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [slaFilter, setSlaFilter] = React.useState('all');

  const filtered = tickets.filter((t) => {
    const matchSearch = !search || t.id.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase());
    const matchPrio = priority === 'all' || t.priority === priority;
    const matchStatus = status === 'all' || t.status === status;
    const matchCat = category === 'all' || t.category === category;
    const matchSla = slaFilter === 'all' || t.slaStatus === slaFilter;
    return matchSearch && matchPrio && matchStatus && matchCat && matchSla;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Tickets"
        description="Customer service queue with priority, SLA tracking and multi-channel intake."
        breadcrumbs={[
          { label: 'Service', href: '/app/service' },
          { label: 'Tickets' },
        ]}
        actions={
          <>
            <div className="inline-flex h-9 items-center rounded-lg border border-input bg-background p-0.5 text-xs">
              <button
                onClick={() => setView('queue')}
                className={cn('flex items-center gap-1.5 rounded-md px-3 py-1', view === 'queue' && 'bg-accent text-accent-foreground')}
              >
                <LayoutList className="size-3.5" /> Queue
              </button>
              <button
                onClick={() => setView('kanban')}
                className={cn('flex items-center gap-1.5 rounded-md px-3 py-1', view === 'kanban' && 'bg-accent text-accent-foreground')}
              >
                <Kanban className="size-3.5" /> Kanban
              </button>
            </div>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New ticket</Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets..." className="pl-8" />
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="med">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {['Technical','Billing','Shipping','Warranty','Sales','General'].map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={slaFilter} onValueChange={setSlaFilter}>
              <SelectTrigger className="w-36"><SelectValue placeholder="SLA" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All SLA</SelectItem>
                <SelectItem value="on_track">On track</SelectItem>
                <SelectItem value="at_risk">At risk</SelectItem>
                <SelectItem value="breached">Breached</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {view === 'queue' ? (
        <Card>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Subject</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Agent</th>
                  <th>Age</th>
                  <th>SLA</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const prio = priorityMeta[t.priority];
                  const sla = slaMeta[t.slaStatus];
                  return (
                    <tr key={t.id} className={`border-l-2 ${prio.tone}`}>
                      <td>
                        <Link href={`/app/service/tickets/${t.id}`} className="font-mono text-xs font-medium text-primary hover:underline">
                          {t.id}
                        </Link>
                        <div className="text-2xs text-muted-foreground">{channelIcon[t.channel]} {t.channel}</div>
                      </td>
                      <td className="max-w-sm">
                        <div className="text-sm font-medium">{t.subject}</div>
                        <div className="truncate text-xs text-muted-foreground">{t.preview}</div>
                      </td>
                      <td className="text-sm">{t.customer}</td>
                      <td><Badge variant="outline" size="sm">{t.category}</Badge></td>
                      <td><Badge variant={prio.variant} size="sm" className="capitalize">{t.priority}</Badge></td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Avatar size="xs"><AvatarFallback>{initials(t.agent)}</AvatarFallback></Avatar>
                          <span className="text-xs">{t.agent}</span>
                        </div>
                      </td>
                      <td className="text-xs text-muted-foreground">{t.age}</td>
                      <td><Badge variant={sla.variant} size="sm">{sla.label}</Badge></td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {kanbanCols.map((col) => {
            const colTickets = filtered.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold">{col.label}</h3>
                  <Badge variant="outline" size="sm">{colTickets.length}</Badge>
                </div>
                <div className="space-y-2">
                  {colTickets.map((t) => {
                    const prio = priorityMeta[t.priority];
                    const sla = slaMeta[t.slaStatus];
                    return (
                      <Link key={t.id} href={`/app/service/tickets/${t.id}`}>
                        <Card className={cn('border-l-2 transition-shadow hover:shadow-md', prio.tone)}>
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-2xs text-primary">{t.id}</span>
                              <Badge variant={prio.variant} size="sm" className="capitalize">{t.priority}</Badge>
                            </div>
                            <div className="text-sm font-medium">{t.subject}</div>
                            <div className="text-xs text-muted-foreground">{t.customer}</div>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5">
                                <Avatar size="xs"><AvatarFallback>{initials(t.agent)}</AvatarFallback></Avatar>
                                <span className="text-2xs">{t.agent}</span>
                              </div>
                              <Badge variant={sla.variant} size="sm">{t.age}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
