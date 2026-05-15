import {
  ArrowDown,
  ArrowUpDown,
  Building2,
  Filter,
  Linkedin,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, formatRelativeTime, initials } from '@/lib/utils';

type DecisionRole = 'Champion' | 'Decision Maker' | 'Influencer' | 'User' | 'Blocker';

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  companyId: string;
  email: string;
  phone: string;
  role: DecisionRole;
  status: 'active' | 'cold' | 'new';
  lastTouch: Date;
  owner: string;
  linkedin: boolean;
  tags: string[];
}

const contacts: Contact[] = [
  { id: 'C-001', name: 'Margaret Liu', title: 'Chief Procurement Officer', company: 'Acme Industries', companyId: 'A-104', email: 'margaret.liu@acme-ind.com', phone: '+1 216 555 0101', role: 'Champion', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 8), owner: 'Priya Patel', linkedin: true, tags: ['exec', 'manufacturing'] },
  { id: 'C-002', name: 'Robert Henderson', title: 'VP Operations', company: 'Acme Industries', companyId: 'A-104', email: 'r.henderson@acme-ind.com', phone: '+1 216 555 0102', role: 'Decision Maker', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24), owner: 'Priya Patel', linkedin: true, tags: ['operations'] },
  { id: 'C-003', name: 'Rachel Goldberg', title: 'Chief Medical Officer', company: 'Lumen Health', companyId: 'A-102', email: 'rachel.g@lumenhealth.co', phone: '+1 617 555 0177', role: 'Champion', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 3), owner: 'Priya Patel', linkedin: true, tags: ['healthcare', 'exec'] },
  { id: 'C-004', name: 'Alicia Park', title: 'VP Engineering', company: 'Northwind Software', companyId: 'A-101', email: 'alicia@northwind.io', phone: '+1 415 555 0142', role: 'Champion', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60), owner: 'Sarah Chen', linkedin: true, tags: ['engineering'] },
  { id: 'C-005', name: 'Daniel Kim', title: 'CTO', company: 'Helix Robotics', companyId: 'A-103', email: 'd.kim@helixrobotics.com', phone: '+1 408 555 0193', role: 'Decision Maker', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 5), owner: 'Marcus Rivera', linkedin: true, tags: ['exec', 'robotics'] },
  { id: 'C-006', name: 'David Mendez', title: 'CFO', company: 'Lumen Health', companyId: 'A-102', email: 'david.m@lumenhealth.co', phone: '+1 617 555 0178', role: 'Decision Maker', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), owner: 'Priya Patel', linkedin: true, tags: ['finance', 'exec'] },
  { id: 'C-007', name: 'Yuki Nakamura', title: 'CIO', company: 'Acme Industries', companyId: 'A-104', email: 'y.nakamura@acme-ind.com', phone: '+1 216 555 0103', role: 'Influencer', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), owner: 'Priya Patel', linkedin: true, tags: ['IT'] },
  { id: 'C-008', name: 'Tomas Becker', title: 'Head of Operations', company: 'Vertex Logistics', companyId: 'A-109', email: 'tomas@vertexlog.de', phone: '+49 30 555 4419', role: 'Decision Maker', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 12), owner: 'Sarah Chen', linkedin: false, tags: ['operations'] },
  { id: 'C-009', name: 'Ana Souza', title: 'Founder & CEO', company: 'Brightline AI', companyId: 'A-108', email: 'ana@brightline.ai', phone: '+55 11 555 8821', role: 'Decision Maker', status: 'cold', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), owner: 'James Okafor', linkedin: true, tags: ['ai', 'founder'] },
  { id: 'C-010', name: 'Jorge Hernández', title: 'COO', company: 'Mesa Manufacturing', companyId: 'A-112', email: 'jorge@mesa-mfg.com', phone: '+52 55 555 6643', role: 'Decision Maker', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), owner: 'Marcus Rivera', linkedin: true, tags: ['manufacturing'] },
  { id: 'C-011', name: 'Sofia Andersson', title: 'Director of IT', company: 'Boreal Energy', companyId: 'A-114', email: 's.andersson@borealenergy.se', phone: '+46 8 555 2017', role: 'Influencer', status: 'new', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24), owner: 'Emily Watson', linkedin: true, tags: ['IT', 'energy'] },
  { id: 'C-012', name: 'Kenji Tanaka', title: 'CIO', company: 'Sakura Retail Group', companyId: 'A-107', email: 'kenji@sakura-retail.jp', phone: '+81 3 5555 8810', role: 'Decision Maker', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), owner: 'Priya Patel', linkedin: true, tags: ['retail', 'IT'] },
  { id: 'C-013', name: 'Olivia Bennett', title: 'VP Finance', company: 'Riverside Properties', companyId: 'A-115', email: 'olivia@riversideprop.com', phone: '+1 312 555 9028', role: 'Influencer', status: 'cold', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), owner: 'Sarah Chen', linkedin: false, tags: ['finance', 'real estate'] },
  { id: 'C-014', name: 'David Park', title: 'Head of Supply Chain', company: 'Acme Industries', companyId: 'A-104', email: 'david.park@acme-ind.com', phone: '+1 216 555 0104', role: 'User', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), owner: 'Priya Patel', linkedin: true, tags: ['supply chain'] },
  { id: 'C-015', name: 'Pavel Novak', title: 'Head of Procurement', company: 'Bohemia Telecom', companyId: 'A-116', email: 'pavel.n@bohemiatel.cz', phone: '+420 222 555 884', role: 'Blocker', status: 'cold', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), owner: 'Sarah Chen', linkedin: false, tags: ['telecom'] },
  { id: 'C-016', name: 'Fatima Al-Rashid', title: 'CFO', company: 'Gulf Hospitality Group', companyId: 'A-117', email: 'f.alrashid@gulfhg.ae', phone: '+971 4 555 0922', role: 'Decision Maker', status: 'new', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), owner: 'James Okafor', linkedin: true, tags: ['finance', 'hospitality'] },
  { id: 'C-017', name: 'Erik Lindqvist', title: 'Head of Digital', company: 'NordicTech Industries', companyId: 'A-118', email: 'erik@nordictech.no', phone: '+47 22 555 4031', role: 'Champion', status: 'new', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), owner: 'James Okafor', linkedin: true, tags: ['digital'] },
  { id: 'C-018', name: 'Aisha Mohammed', title: 'Head of Sales', company: 'Northwind Software', companyId: 'A-101', email: 'aisha@northwind.io', phone: '+1 415 555 0144', role: 'User', status: 'active', lastTouch: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), owner: 'Sarah Chen', linkedin: true, tags: ['sales'] },
];

const roleStyle = (r: DecisionRole) => ({
  Champion: 'border-success/30 bg-success/10 text-success',
  'Decision Maker': 'border-primary/30 bg-primary/10 text-primary',
  Influencer: 'border-warning/30 bg-warning/10 text-warning',
  User: 'border-info/30 bg-info/10 text-info',
  Blocker: 'border-destructive/30 bg-destructive/10 text-destructive',
}[r]);

export default function ContactsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Contacts"
        description="People you work with across every account. Map decision-makers and track relationships."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New contact
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-semibold">{contacts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Champions</p>
            <p className="mt-1 text-2xl font-semibold text-success">{contacts.filter((c) => c.role === 'Champion').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Decision makers</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{contacts.filter((c) => c.role === 'Decision Maker').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Cold contacts</p>
            <p className="mt-1 text-2xl font-semibold text-muted-foreground">{contacts.filter((c) => c.status === 'cold').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">New (7 days)</p>
            <p className="mt-1 text-2xl font-semibold text-warning">{contacts.filter((c) => c.status === 'new').length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="min-w-[240px] flex-1">
            <InputAddon prefix={<Search className="size-4" />}>
              <Input placeholder="Search by name, email, or company..." />
            </InputAddon>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="champion">Champion</SelectItem>
              <SelectItem value="dm">Decision Maker</SelectItem>
              <SelectItem value="influencer">Influencer</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              <SelectItem value="acme">Acme Industries</SelectItem>
              <SelectItem value="lumen">Lumen Health</SelectItem>
              <SelectItem value="northwind">Northwind Software</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
              <SelectItem value="new">New</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm">
            <Filter className="size-4" /> More
          </Button>
        </CardContent>
      </Card>

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
                    Name <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th>Role</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Owner</th>
                <th>Last touch</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="group">
                  <td className="pl-4">
                    <Checkbox />
                  </td>
                  <td>
                    <Link href={`/app/crm/contacts/${c.id}`} className="flex items-center gap-2.5">
                      <Avatar size="sm">
                        <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate font-medium text-foreground group-hover:text-primary">
                            {c.name}
                          </p>
                          {c.linkedin && <Linkedin className="size-3 shrink-0 text-info" />}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{c.title}</p>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <Badge variant="outline" size="sm" className={roleStyle(c.role)}>
                      {c.role}
                    </Badge>
                  </td>
                  <td>
                    <Link href={`/app/crm/accounts/${c.companyId}`} className="flex items-center gap-1.5 text-sm hover:text-primary">
                      <Building2 className="size-3.5 text-muted-foreground" />
                      <span>{c.company}</span>
                    </Link>
                  </td>
                  <td className="text-sm text-muted-foreground">{c.email}</td>
                  <td className="font-mono text-xs text-muted-foreground">{c.phone}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs">
                        <AvatarFallback name={c.owner}>{initials(c.owner)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{c.owner.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">{formatRelativeTime(c.lastTouch)}</td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="size-4" /> Send email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="size-4" /> Log call
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="size-4" /> Add to sequence
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
    </div>
  );
}
