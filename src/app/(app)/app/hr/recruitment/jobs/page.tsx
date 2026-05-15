'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  ChevronRight,
  Download,
  ExternalLink,
  Filter,
  Globe,
  MapPin,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatDate, initials } from '@/lib/utils';

type JobStatus = 'open' | 'closed' | 'on_hold';

interface Job {
  id: string;
  title: string;
  dept: string;
  location: string;
  type: string;
  applicants: number;
  inPipeline: number;
  status: JobStatus;
  posted: string;
  hiringManager: string;
  level: string;
}

const allJobs: Job[] = [
  { id: 'JOB-2102', title: 'Senior Backend Engineer', dept: 'Engineering', location: 'San Francisco · Remote', type: 'Full-time', applicants: 84, inPipeline: 22, status: 'open', posted: '2026-04-18', hiringManager: 'Aisha Khan', level: 'IC5' },
  { id: 'JOB-2101', title: 'Account Executive (AMER)', dept: 'Sales', location: 'New York', type: 'Full-time', applicants: 142, inPipeline: 31, status: 'open', posted: '2026-04-22', hiringManager: 'Marcus Rodriguez', level: 'IC4' },
  { id: 'JOB-2100', title: 'Product Manager · Platform', dept: 'Engineering', location: 'San Francisco', type: 'Full-time', applicants: 68, inPipeline: 14, status: 'open', posted: '2026-04-25', hiringManager: 'Hiroshi Tanaka', level: 'IC5' },
  { id: 'JOB-2099', title: 'Customer Success Manager', dept: 'Customer Success', location: 'London', type: 'Full-time', applicants: 52, inPipeline: 12, status: 'open', posted: '2026-05-02', hiringManager: 'Olivia Martinez', level: 'IC3' },
  { id: 'JOB-2098', title: 'Marketing Designer', dept: 'Marketing', location: 'Remote · AMER', type: 'Full-time', applicants: 96, inPipeline: 18, status: 'open', posted: '2026-04-30', hiringManager: 'Sofia Rossi', level: 'IC3' },
  { id: 'JOB-2097', title: 'Engineering Intern · Summer 2026', dept: 'Engineering', location: 'San Francisco', type: 'Intern', applicants: 312, inPipeline: 45, status: 'open', posted: '2026-03-15', hiringManager: 'Aisha Khan', level: 'Intern' },
  { id: 'JOB-2096', title: 'VP of Engineering', dept: 'Engineering', location: 'San Francisco', type: 'Full-time', applicants: 28, inPipeline: 8, status: 'on_hold', posted: '2026-04-10', hiringManager: 'Jonathan Wright', level: 'M5' },
  { id: 'JOB-2095', title: 'Site Reliability Engineer', dept: 'Engineering', location: 'Berlin', type: 'Full-time', applicants: 41, inPipeline: 9, status: 'open', posted: '2026-05-04', hiringManager: 'Ravi Sharma', level: 'IC4' },
  { id: 'JOB-2094', title: 'Data Engineer', dept: 'Engineering', location: 'Remote · Global', type: 'Full-time', applicants: 56, inPipeline: 13, status: 'open', posted: '2026-05-06', hiringManager: 'Aisha Khan', level: 'IC4' },
  { id: 'JOB-2090', title: 'Sr Recruiter · Engineering', dept: 'Human Resources', location: 'San Francisco', type: 'Full-time', applicants: 38, inPipeline: 0, status: 'closed', posted: '2026-02-15', hiringManager: 'Naomi Park', level: 'IC4' },
  { id: 'JOB-2088', title: 'Office Manager · NYC', dept: 'Operations', location: 'New York', type: 'Full-time', applicants: 64, inPipeline: 0, status: 'closed', posted: '2026-01-08', hiringManager: 'Rebecca Chen', level: 'IC3' },
];

export default function JobsPage() {
  const [status, setStatus] = React.useState<JobStatus | 'all'>('open');
  const [search, setSearch] = React.useState('');
  const [dept, setDept] = React.useState('all');

  const filtered = allJobs.filter((j) => {
    if (status !== 'all' && j.status !== status) return false;
    if (dept !== 'all' && j.dept !== dept) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!j.title.toLowerCase().includes(q) && !j.id.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    all: allJobs.length,
    open: allJobs.filter((j) => j.status === 'open').length,
    on_hold: allJobs.filter((j) => j.status === 'on_hold').length,
    closed: allJobs.filter((j) => j.status === 'closed').length,
  };

  const departments = Array.from(new Set(allJobs.map((j) => j.dept)));

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Jobs"
        description="Post and manage open roles across the company"
        breadcrumbs={[
          { label: 'People', href: '/app/hr' },
          { label: 'Recruitment', href: '/app/hr/recruitment' },
          { label: 'Jobs' },
        ]}
        actions={
          <>
            <Button variant="outline">
              <Globe className="size-4" /> Careers page
            </Button>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button>
              <Plus className="size-4" /> New job
            </Button>
          </>
        }
      />

      <Tabs value={status} onValueChange={(v) => setStatus(v as JobStatus | 'all')}>
        <div className="flex flex-wrap items-center gap-3">
          <TabsList variant="pills">
            <TabsTrigger value="all" variant="pills">All <Badge variant="outline" size="sm" className="ml-1.5">{counts.all}</Badge></TabsTrigger>
            <TabsTrigger value="open" variant="pills">Open <Badge variant="success" size="sm" className="ml-1.5">{counts.open}</Badge></TabsTrigger>
            <TabsTrigger value="on_hold" variant="pills">Paused <Badge variant="warning" size="sm" className="ml-1.5">{counts.on_hold}</Badge></TabsTrigger>
            <TabsTrigger value="closed" variant="pills">Closed <Badge variant="outline" size="sm" className="ml-1.5">{counts.closed}</Badge></TabsTrigger>
          </TabsList>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="w-56 pl-8"
              />
            </div>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger className="w-[170px]"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((j) => (
          <Link key={j.id} href={`/app/hr/recruitment/jobs/${j.id}`}>
            <Card className="group h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-xs text-primary">{j.id}</div>
                    <div className="text-base font-semibold leading-tight">{j.title}</div>
                  </div>
                  <StatusBadge status={j.status === 'on_hold' ? 'on_hold' : j.status} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" size="sm"><Briefcase className="size-3" /> {j.dept}</Badge>
                  <Badge variant="outline" size="sm">{j.level}</Badge>
                  <Badge variant="outline" size="sm">{j.type}</Badge>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {j.location}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Avatar size="xs"><AvatarFallback name={j.hiringManager}>{initials(j.hiringManager)}</AvatarFallback></Avatar>
                    <span className="text-xs text-muted-foreground">{j.hiringManager}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Posted {formatDate(j.posted)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                  <div>
                    <div className="text-2xs uppercase tracking-wide text-muted-foreground">Applicants</div>
                    <div className="text-lg font-semibold tabular-nums">{j.applicants}</div>
                  </div>
                  <div>
                    <div className="text-2xs uppercase tracking-wide text-muted-foreground">In pipeline</div>
                    <div className="text-lg font-semibold tabular-nums text-primary">{j.inPipeline}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>View pipeline</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <Briefcase className="mx-auto size-10 text-muted-foreground/50" />
          <h3 className="mt-3 font-semibold">No jobs match your filters</h3>
          <p className="mt-1 text-sm text-muted-foreground">Adjust filters or create a new requisition.</p>
        </Card>
      )}
    </div>
  );
}
