import {
  ArrowDown,
  ArrowRight,
  ArrowUpDown,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Upload,
  UserCheck,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn, formatRelativeTime, initials } from '@/lib/utils';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'nurturing';

interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  score: number;
  owner: string;
  lastTouch: Date;
  value: number;
}

const leads: Lead[] = [
  { id: 'L-1024', name: 'Alicia Park', company: 'Northwind Software', title: 'VP Engineering', email: 'alicia@northwind.io', phone: '+1 415 555 0142', source: 'Inbound form', status: 'qualified', score: 94, owner: 'Sarah Chen', lastTouch: new Date(Date.now() - 1000 * 60 * 18), value: 145000 },
  { id: 'L-1023', name: 'Daniel Kim', company: 'Helix Robotics', title: 'CTO', email: 'd.kim@helixrobotics.com', phone: '+1 408 555 0193', source: 'Referral', status: 'qualified', score: 91, owner: 'Marcus Rivera', lastTouch: new Date(Date.now() - 1000 * 60 * 95), value: 87000 },
  { id: 'L-1022', name: 'Rachel Goldberg', company: 'Lumen Health', title: 'Chief Medical Officer', email: 'rachel.g@lumenhealth.co', phone: '+1 617 555 0177', source: 'Webinar', status: 'qualified', score: 89, owner: 'Priya Patel', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 3), value: 220000 },
  { id: 'L-1021', name: 'Tomas Becker', company: 'Vertex Logistics', title: 'Head of Operations', email: 'tomas@vertexlog.de', phone: '+49 30 555 4419', source: 'Cold outbound', status: 'contacted', score: 87, owner: 'Sarah Chen', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 5), value: 64000 },
  { id: 'L-1020', name: 'Ana Souza', company: 'Brightline AI', title: 'Founder', email: 'ana@brightline.ai', phone: '+55 11 555 8821', source: 'LinkedIn', status: 'contacted', score: 84, owner: 'James Okafor', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 8), value: 112000 },
  { id: 'L-1019', name: 'Jorge Hernández', company: 'Mesa Manufacturing', title: 'COO', email: 'jorge@mesa-mfg.com', phone: '+52 55 555 6643', source: 'Trade show', status: 'qualified', score: 81, owner: 'Marcus Rivera', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 12), value: 98000 },
  { id: 'L-1018', name: 'Sofia Andersson', company: 'Boreal Energy', title: 'Director of IT', email: 's.andersson@borealenergy.se', phone: '+46 8 555 2017', source: 'Inbound form', status: 'new', score: 76, owner: 'Emily Watson', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 18), value: 145000 },
  { id: 'L-1017', name: 'Kenji Tanaka', company: 'Sakura Retail Group', title: 'CIO', email: 'kenji@sakura-retail.jp', phone: '+81 3 5555 8810', source: 'Partner', status: 'nurturing', score: 72, owner: 'Priya Patel', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), value: 250000 },
  { id: 'L-1016', name: 'Olivia Bennett', company: 'Riverside Properties', title: 'VP Finance', email: 'olivia@riversideprop.com', phone: '+1 312 555 9028', source: 'Webinar', status: 'contacted', score: 68, owner: 'Sarah Chen', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), value: 52000 },
  { id: 'L-1015', name: 'Mehdi Rahimi', company: 'Sentinel Cybersecurity', title: 'Head of Sales', email: 'm.rahimi@sentinelsec.io', phone: '+1 206 555 4470', source: 'Cold outbound', status: 'new', score: 65, owner: 'James Okafor', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), value: 76000 },
  { id: 'L-1014', name: 'Chloe Dupont', company: 'Artisan Bakery Chain', title: 'Operations Director', email: 'chloe@artisanbakery.fr', phone: '+33 1 5555 1188', source: 'Inbound form', status: 'qualified', score: 63, owner: 'Marcus Rivera', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), value: 34000 },
  { id: 'L-1013', name: 'Ahmed Farouk', company: 'Nile Trading Co', title: 'Managing Director', email: 'ahmed@niletrading.com', phone: '+20 2 5555 7732', source: 'Referral', status: 'nurturing', score: 58, owner: 'Priya Patel', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), value: 88000 },
  { id: 'L-1012', name: 'Margaret Liu', company: 'Crestwood Insurance', title: 'CTO', email: 'm.liu@crestwoodins.com', phone: '+1 646 555 3349', source: 'LinkedIn', status: 'contacted', score: 54, owner: 'Emily Watson', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), value: 132000 },
  { id: 'L-1011', name: 'Pavel Novak', company: 'Bohemia Telecom', title: 'Head of Procurement', email: 'pavel.n@bohemiatel.cz', phone: '+420 222 555 884', source: 'Trade show', status: 'unqualified', score: 42, owner: 'Sarah Chen', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), value: 21000 },
  { id: 'L-1010', name: 'Fatima Al-Rashid', company: 'Gulf Hospitality Group', title: 'CFO', email: 'f.alrashid@gulfhg.ae', phone: '+971 4 555 0922', source: 'Inbound form', status: 'new', score: 79, owner: 'James Okafor', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), value: 165000 },
  { id: 'L-1009', name: 'Liam O\'Connor', company: 'Shamrock Distilleries', title: 'CEO', email: 'liam@shamrockdist.ie', phone: '+353 1 555 6611', source: 'Partner', status: 'qualified', score: 77, owner: 'Marcus Rivera', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), value: 92000 },
  { id: 'L-1008', name: 'Nina Petrov', company: 'Aurora Materials', title: 'VP Procurement', email: 'n.petrov@auroramat.com', phone: '+1 720 555 8847', source: 'Webinar', status: 'nurturing', score: 61, owner: 'Priya Patel', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11), value: 47000 },
  { id: 'L-1007', name: 'Hiroshi Yamamoto', company: 'Pacific Marine', title: 'Director of Engineering', email: 'h.yamamoto@pacmarine.jp', phone: '+81 6 5555 2204', source: 'Cold outbound', status: 'unqualified', score: 38, owner: 'Emily Watson', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), value: 28000 },
  { id: 'L-1006', name: 'Camila Vargas', company: 'Terra Verde Agro', title: 'Operations Manager', email: 'c.vargas@terraverde.cl', phone: '+56 2 5555 1199', source: 'Referral', status: 'contacted', score: 71, owner: 'Sarah Chen', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), value: 58000 },
  { id: 'L-1005', name: 'Erik Lindqvist', company: 'NordicTech Industries', title: 'Head of Digital', email: 'erik@nordictech.no', phone: '+47 22 555 4031', source: 'LinkedIn', status: 'new', score: 67, owner: 'James Okafor', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), value: 108000 },
];

function scoreColor(score: number) {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-warning';
  if (score >= 40) return 'bg-info';
  return 'bg-muted-foreground';
}

function scoreLabel(score: number) {
  if (score >= 80) return 'Hot';
  if (score >= 60) return 'Warm';
  if (score >= 40) return 'Cool';
  return 'Cold';
}

const summary = {
  total: leads.length,
  qualified: leads.filter((l) => l.status === 'qualified').length,
  contacted: leads.filter((l) => l.status === 'contacted').length,
  new: leads.filter((l) => l.status === 'new').length,
};

export default function LeadsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Leads"
        description="Inbound, outbound, partner — every prospect at the top of the funnel."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New lead
            </Button>
          </>
        }
      />

      {/* Summary tabs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Total leads</p>
              <p className="text-2xl font-semibold">{summary.total}</p>
            </div>
            <Badge variant="soft">+12% MoM</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualified</p>
              <p className="text-2xl font-semibold text-success">{summary.qualified}</p>
            </div>
            <Badge variant="success" size="sm">SQL</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Contacted</p>
              <p className="text-2xl font-semibold">{summary.contacted}</p>
            </div>
            <Badge variant="info" size="sm">In progress</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">New today</p>
              <p className="text-2xl font-semibold">{summary.new}</p>
            </div>
            <Badge variant="outline" size="sm">Untouched</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="min-w-[240px] flex-1">
            <InputAddon prefix={<Search className="size-4" />}>
              <Input placeholder="Search by name, company, or email..." />
            </InputAddon>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="nurturing">Nurturing</SelectItem>
              <SelectItem value="unqualified">Unqualified</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              <SelectItem value="inbound">Inbound form</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
              <SelectItem value="cold">Cold outbound</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tradeshow">Trade show</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any score</SelectItem>
              <SelectItem value="hot">Hot (80+)</SelectItem>
              <SelectItem value="warm">Warm (60-79)</SelectItem>
              <SelectItem value="cool">Cool (40-59)</SelectItem>
              <SelectItem value="cold">Cold (&lt;40)</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any owner</SelectItem>
              <SelectItem value="sc">Sarah Chen</SelectItem>
              <SelectItem value="mr">Marcus Rivera</SelectItem>
              <SelectItem value="pp">Priya Patel</SelectItem>
              <SelectItem value="jo">James Okafor</SelectItem>
              <SelectItem value="ew">Emily Watson</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm">
            <Filter className="size-4" /> More
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-8 pl-4">
                  <Checkbox />
                </th>
                <th>
                  <button className="inline-flex items-center gap-1 hover:text-foreground">
                    Lead <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th>Company</th>
                <th className="w-44">AI score</th>
                <th>Source</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Last touch</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="group">
                  <td className="pl-4">
                    <Checkbox />
                  </td>
                  <td>
                    <Link href={`/app/crm/leads/${l.id}`} className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback name={l.name}>{initials(l.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground group-hover:text-primary">
                          {l.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{l.title}</p>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <p className="font-medium">{l.company}</p>
                    <p className="text-xs text-muted-foreground">{l.email}</p>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn('h-full rounded-full', scoreColor(l.score))}
                          style={{ width: `${l.score}%` }}
                        />
                      </div>
                      <span className="w-7 text-right font-mono text-xs font-semibold tabular-nums">
                        {l.score}
                      </span>
                      <Badge
                        variant="outline"
                        size="sm"
                        className={cn(
                          l.score >= 80 && 'border-success/30 bg-success/10 text-success',
                          l.score >= 60 && l.score < 80 && 'border-warning/30 bg-warning/10 text-warning',
                          l.score >= 40 && l.score < 60 && 'border-info/30 bg-info/10 text-info',
                          l.score < 40 && 'text-muted-foreground',
                        )}
                      >
                        {scoreLabel(l.score)}
                      </Badge>
                    </div>
                  </td>
                  <td className="text-sm text-muted-foreground">{l.source}</td>
                  <td>
                    <StatusBadge status={l.status} />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar size="xs">
                        <AvatarFallback name={l.owner}>{initials(l.owner)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{l.owner.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">
                    {formatRelativeTime(l.lastTouch)}
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <UserCheck className="size-4" /> Convert to opportunity
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="size-4" /> Send email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="size-4" /> Log call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowRight className="size-4" /> Reassign
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive>
                          <UserX className="size-4" /> Disqualify
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing 1-{leads.length} of {leads.length} leads</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
