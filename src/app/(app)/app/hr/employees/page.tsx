'use client';

import * as React from 'react';
import Link from 'next/link';
import { Download, Filter, LayoutGrid, List, Mail, MapPin, Phone, Plus, Search, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, formatDate, initials } from '@/lib/utils';

type Status = 'active' | 'on_leave' | 'inactive' | 'probation';
type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';

interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  branch: string;
  designation: string;
  manager: string;
  status: Status;
  hireDate: string;
  type: EmploymentType;
  location: string;
}

const employees: Employee[] = [
  { id: 'e001', code: 'UNI-1001', name: 'Sarah Chen', email: 'sarah.chen@universal.co', phone: '+1 415 555 0142', department: 'Engineering', branch: 'San Francisco HQ', designation: 'Senior Product Designer', manager: 'Marcus Rodriguez', status: 'active', hireDate: '2026-05-12', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e002', code: 'UNI-1002', name: 'Marcus Rodriguez', email: 'marcus.r@universal.co', phone: '+1 212 555 0183', department: 'Sales', branch: 'New York', designation: 'VP of Sales', manager: 'Jonathan Wright', status: 'active', hireDate: '2021-03-08', type: 'Full-time', location: 'New York, NY' },
  { id: 'e003', code: 'UNI-1003', name: 'Priya Patel', email: 'priya.patel@universal.co', phone: '+44 20 7946 0958', department: 'Customer Success', branch: 'London', designation: 'Customer Success Manager', manager: 'Olivia Martinez', status: 'active', hireDate: '2023-09-04', type: 'Full-time', location: 'London, UK' },
  { id: 'e004', code: 'UNI-1004', name: 'David Kim', email: 'david.kim@universal.co', phone: '+1 408 555 0117', department: 'Engineering', branch: 'San Francisco HQ', designation: 'Backend Engineer', manager: 'Aisha Khan', status: 'active', hireDate: '2026-05-01', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e005', code: 'UNI-1005', name: 'Emma Thompson', email: 'emma.t@universal.co', phone: '+1 312 555 0192', department: 'Marketing', branch: 'Chicago', designation: 'Marketing Coordinator', manager: 'Sofia Rossi', status: 'probation', hireDate: '2026-04-28', type: 'Full-time', location: 'Chicago, IL' },
  { id: 'e006', code: 'UNI-1006', name: 'Jonathan Wright', email: 'jonathan.w@universal.co', phone: '+1 415 555 0166', department: 'Executive', branch: 'San Francisco HQ', designation: 'Chief Executive Officer', manager: '—', status: 'active', hireDate: '2019-01-15', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e007', code: 'UNI-1007', name: 'Olivia Martinez', email: 'olivia.m@universal.co', phone: '+1 415 555 0144', department: 'Customer Success', branch: 'San Francisco HQ', designation: 'VP of Customer Success', manager: 'Jonathan Wright', status: 'active', hireDate: '2020-06-22', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e008', code: 'UNI-1008', name: 'Aisha Khan', email: 'aisha.khan@universal.co', phone: '+1 415 555 0178', department: 'Engineering', branch: 'San Francisco HQ', designation: 'Engineering Director', manager: 'Hiroshi Tanaka', status: 'active', hireDate: '2020-11-09', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e009', code: 'UNI-1009', name: 'Hiroshi Tanaka', email: 'hiroshi.t@universal.co', phone: '+1 415 555 0199', department: 'Engineering', branch: 'San Francisco HQ', designation: 'Chief Technology Officer', manager: 'Jonathan Wright', status: 'active', hireDate: '2019-04-02', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e010', code: 'UNI-1010', name: 'Liam O\'Brien', email: 'liam.obrien@universal.co', phone: '+353 1 234 5678', department: 'Engineering', branch: 'Dublin', designation: 'Staff Engineer', manager: 'Aisha Khan', status: 'on_leave', hireDate: '2023-05-22', type: 'Full-time', location: 'Dublin, IE' },
  { id: 'e011', code: 'UNI-1011', name: 'Sofia Rossi', email: 'sofia.rossi@universal.co', phone: '+1 415 555 0123', department: 'Marketing', branch: 'San Francisco HQ', designation: 'Chief Marketing Officer', manager: 'Jonathan Wright', status: 'active', hireDate: '2019-05-25', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e012', code: 'UNI-1012', name: 'Ahmed Hassan', email: 'ahmed.h@universal.co', phone: '+971 4 555 0181', department: 'Sales', branch: 'Dubai', designation: 'Regional Sales Manager', manager: 'Marcus Rodriguez', status: 'active', hireDate: '2022-08-14', type: 'Full-time', location: 'Dubai, UAE' },
  { id: 'e013', code: 'UNI-1013', name: 'Yuki Nakamura', email: 'yuki.n@universal.co', phone: '+81 3 5555 0162', department: 'Operations', branch: 'Tokyo', designation: 'Operations Lead', manager: 'Rebecca Chen', status: 'active', hireDate: '2022-02-11', type: 'Full-time', location: 'Tokyo, JP' },
  { id: 'e014', code: 'UNI-1014', name: 'Rebecca Chen', email: 'rebecca.c@universal.co', phone: '+1 415 555 0157', department: 'Operations', branch: 'San Francisco HQ', designation: 'Chief Operating Officer', manager: 'Jonathan Wright', status: 'active', hireDate: '2019-07-08', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e015', code: 'UNI-1015', name: 'Carlos Mendes', email: 'carlos.m@universal.co', phone: '+55 11 5555 0145', department: 'Engineering', branch: 'São Paulo', designation: 'Frontend Engineer', manager: 'Aisha Khan', status: 'active', hireDate: '2024-01-15', type: 'Full-time', location: 'São Paulo, BR' },
  { id: 'e016', code: 'UNI-1016', name: 'Linnea Johansson', email: 'linnea.j@universal.co', phone: '+46 8 555 0172', department: 'Finance', branch: 'Stockholm', designation: 'Senior Accountant', manager: 'Rebecca Chen', status: 'active', hireDate: '2021-11-30', type: 'Full-time', location: 'Stockholm, SE' },
  { id: 'e017', code: 'UNI-1017', name: 'Ravi Sharma', email: 'ravi.sharma@universal.co', phone: '+91 80 5555 0163', department: 'Engineering', branch: 'Bangalore', designation: 'QA Lead', manager: 'Aisha Khan', status: 'active', hireDate: '2022-04-18', type: 'Full-time', location: 'Bangalore, IN' },
  { id: 'e018', code: 'UNI-1018', name: 'Naomi Park', email: 'naomi.park@universal.co', phone: '+1 212 555 0149', department: 'Human Resources', branch: 'New York', designation: 'HR Business Partner', manager: 'Jonathan Wright', status: 'active', hireDate: '2021-09-13', type: 'Full-time', location: 'New York, NY' },
  { id: 'e019', code: 'UNI-1019', name: 'Felix Müller', email: 'felix.m@universal.co', phone: '+49 30 555 0188', department: 'Sales', branch: 'Berlin', designation: 'Account Executive', manager: 'Marcus Rodriguez', status: 'active', hireDate: '2023-02-27', type: 'Full-time', location: 'Berlin, DE' },
  { id: 'e020', code: 'UNI-1020', name: 'Mei Lin', email: 'mei.lin@universal.co', phone: '+852 5555 0156', department: 'Customer Success', branch: 'Hong Kong', designation: 'Onboarding Specialist', manager: 'Priya Patel', status: 'active', hireDate: '2023-10-04', type: 'Full-time', location: 'Hong Kong' },
  { id: 'e021', code: 'UNI-1021', name: 'Gabriel Silva', email: 'gabriel.s@universal.co', phone: '+1 415 555 0190', department: 'Engineering', branch: 'San Francisco HQ', designation: 'Mobile Engineer', manager: 'Aisha Khan', status: 'active', hireDate: '2022-12-05', type: 'Full-time', location: 'San Francisco, CA' },
  { id: 'e022', code: 'UNI-1022', name: 'Hannah Bauer', email: 'hannah.b@universal.co', phone: '+1 312 555 0167', department: 'Marketing', branch: 'Chicago', designation: 'Content Strategist', manager: 'Sofia Rossi', status: 'on_leave', hireDate: '2022-07-19', type: 'Full-time', location: 'Chicago, IL' },
  { id: 'e023', code: 'UNI-1023', name: 'Diego Fernández', email: 'diego.f@universal.co', phone: '+34 91 555 0118', department: 'Sales', branch: 'Madrid', designation: 'Sales Development Rep', manager: 'Ahmed Hassan', status: 'active', hireDate: '2024-03-11', type: 'Full-time', location: 'Madrid, ES' },
  { id: 'e024', code: 'UNI-1024', name: 'Mira Patel', email: 'mira.patel@universal.co', phone: '+1 212 555 0136', department: 'Legal', branch: 'New York', designation: 'General Counsel', manager: 'Jonathan Wright', status: 'active', hireDate: '2020-08-31', type: 'Full-time', location: 'New York, NY' },
  { id: 'e025', code: 'UNI-1025', name: 'Tobias Klein', email: 'tobias.k@universal.co', phone: '+49 30 555 0177', department: 'Engineering', branch: 'Berlin', designation: 'DevOps Engineer', manager: 'Aisha Khan', status: 'inactive', hireDate: '2021-06-14', type: 'Contract', location: 'Berlin, DE' },
];

const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];
const branches = ['All', ...Array.from(new Set(employees.map((e) => e.branch)))];
const statuses = ['All', 'Active', 'On leave', 'Probation', 'Inactive'];
const types = ['All', 'Full-time', 'Part-time', 'Contract', 'Intern'];

const statusLabel: Record<Status, string> = {
  active: 'Active',
  on_leave: 'On leave',
  inactive: 'Inactive',
  probation: 'Probation',
};

export default function EmployeesPage() {
  const [view, setView] = React.useState<'list' | 'grid'>('list');
  const [search, setSearch] = React.useState('');
  const [department, setDepartment] = React.useState('All');
  const [branch, setBranch] = React.useState('All');
  const [status, setStatus] = React.useState('All');
  const [type, setType] = React.useState('All');

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchesQ =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q);
    const matchesD = department === 'All' || e.department === department;
    const matchesB = branch === 'All' || e.branch === branch;
    const matchesS = status === 'All' || statusLabel[e.status] === status;
    const matchesT = type === 'All' || e.type === type;
    return matchesQ && matchesD && matchesB && matchesS && matchesT;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Employees"
        description={`${employees.length} people, ${branches.length - 1} locations, one Universal team.`}
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Employees' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button>
              <UserPlus className="size-4" /> New employee
            </Button>
          </>
        }
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, role, ID..."
              className="pl-8"
            />
          </div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Employment" />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="size-4" />
          </Button>
          <div className="ml-auto inline-flex rounded-lg border border-border bg-background p-0.5">
            <Button
              variant={view === 'list' ? 'soft' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="rounded-md"
            >
              <List className="size-4" /> List
            </Button>
            <Button
              variant={view === 'grid' ? 'soft' : 'ghost'}
              size="sm"
              onClick={() => setView('grid')}
              className="rounded-md"
            >
              <LayoutGrid className="size-4" /> Grid
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{filtered.length} of {employees.length} employees</span>
          {(department !== 'All' || branch !== 'All' || status !== 'All' || type !== 'All' || search) && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setSearch('');
                setDepartment('All');
                setBranch('All');
                setStatus('All');
                setType('All');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </Card>

      {view === 'list' ? (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <Link href={`/app/hr/employees/${e.id}`} className="flex items-center gap-3">
                      <Avatar size="md">
                        <AvatarFallback name={e.name}>{initials(e.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium">{e.name}</div>
                        <div className="font-mono text-xs text-muted-foreground">{e.code}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{e.department}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.branch}</TableCell>
                  <TableCell className="text-sm">{e.designation}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.manager}</TableCell>
                  <TableCell>
                    <StatusBadge status={e.status} label={statusLabel[e.status]} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(e.hireDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((e) => (
            <Link key={e.id} href={`/app/hr/employees/${e.id}`}>
              <Card className={cn('group h-full overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:shadow-md')}>
                <div className="h-20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
                <div className="-mt-10 flex flex-col items-center px-5 pb-5 text-center">
                  <Avatar size="xl" className="ring-4 ring-background">
                    <AvatarFallback name={e.name}>{initials(e.name)}</AvatarFallback>
                  </Avatar>
                  <div className="mt-3 truncate font-medium">{e.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{e.designation}</div>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                    <Badge variant="outline" size="sm">
                      {e.department}
                    </Badge>
                    <StatusBadge status={e.status} label={statusLabel[e.status]} size="sm" />
                  </div>
                  <div className="mt-4 w-full space-y-1.5 border-t border-border pt-3 text-left text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="size-3.5 shrink-0" /> <span className="truncate">{e.email}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="size-3.5 shrink-0" /> {e.phone}
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="size-3.5 shrink-0" /> {e.location}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
