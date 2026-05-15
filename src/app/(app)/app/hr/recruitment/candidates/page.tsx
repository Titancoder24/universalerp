'use client';

import * as React from 'react';
import { Calendar, Download, Filter, Linkedin, Mail, MapPin, Phone, Plus, Search, Sparkles, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, initials } from '@/lib/utils';

type Stage = 'applied' | 'screened' | 'phone' | 'onsite' | 'offer' | 'hired' | 'rejected';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  job: string;
  stage: Stage;
  match: number;
  source: string;
  applied: string;
  recruiter: string;
  flag?: 'referral' | 'top' | 'returning';
}

const candidates: Candidate[] = [
  { id: 'CAND-3084', name: 'Alexander Petrov', email: 'a.petrov@example.com', phone: '+1 415 555 0301', location: 'San Francisco, CA', job: 'Sr Backend Engineer', stage: 'phone', match: 96, source: 'LinkedIn', applied: '2 days ago', recruiter: 'Naomi Park', flag: 'top' },
  { id: 'CAND-3083', name: 'Maya Krishnamurthy', email: 'maya.k@example.com', phone: '+1 408 555 0287', location: 'Cupertino, CA', job: 'Sr Backend Engineer', stage: 'onsite', match: 93, source: 'Referral · D. Kim', applied: '5 days ago', recruiter: 'Naomi Park', flag: 'referral' },
  { id: 'CAND-3082', name: 'Wei Zhang', email: 'wei.zhang@example.com', phone: '+1 415 555 0224', location: 'Oakland, CA', job: 'Sr Backend Engineer', stage: 'onsite', match: 91, source: 'Inbound', applied: '1 week ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3081', name: 'Sebastián López', email: 'seb.lopez@example.com', phone: '+34 91 555 0188', location: 'Madrid, ES', job: 'AE · AMER', stage: 'phone', match: 89, source: 'Greenhouse', applied: '4 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3080', name: 'Aleksandra Nowak', email: 'a.nowak@example.com', phone: '+48 22 555 0166', location: 'Warsaw, PL', job: 'Sr Backend Engineer', stage: 'screened', match: 88, source: 'LinkedIn', applied: '3 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3079', name: 'Bilal Ahmed', email: 'bilal.a@example.com', phone: '+1 312 555 0142', location: 'Chicago, IL', job: 'Marketing Designer', stage: 'screened', match: 86, source: 'Inbound', applied: '2 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3078', name: 'Chloe Davenport', email: 'chloe.d@example.com', phone: '+1 212 555 0193', location: 'Brooklyn, NY', job: 'Sr Backend Engineer', stage: 'offer', match: 95, source: 'Referral', applied: '3 weeks ago', recruiter: 'Naomi Park', flag: 'top' },
  { id: 'CAND-3077', name: 'Yara Hassan', email: 'yara.h@example.com', phone: '+971 4 555 0173', location: 'Dubai, UAE', job: 'PM Platform', stage: 'applied', match: 84, source: 'Careers page', applied: '1 day ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3076', name: 'Henrik Lindgren', email: 'henrik.l@example.com', phone: '+46 8 555 0117', location: 'Stockholm, SE', job: 'Sr Backend Engineer', stage: 'applied', match: 82, source: 'Stack Overflow', applied: '3 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3075', name: 'Lara Petersen', email: 'lara.p@example.com', phone: '+1 415 555 0162', location: 'San Francisco, CA', job: 'Sr Backend Engineer', stage: 'phone', match: 87, source: 'Referral', applied: '6 days ago', recruiter: 'Naomi Park', flag: 'referral' },
  { id: 'CAND-3074', name: 'Ophelia Hart', email: 'ophelia.h@example.com', phone: '+1 415 555 0148', location: 'Mountain View, CA', job: 'PM Platform', stage: 'phone', match: 85, source: 'LinkedIn', applied: '5 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3073', name: 'Marisol Vega', email: 'marisol.v@example.com', phone: '+1 212 555 0204', location: 'New York, NY', job: 'AE · AMER', stage: 'onsite', match: 90, source: 'LinkedIn', applied: '1 week ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3072', name: 'Aiyana Redhawk', email: 'aiyana.r@example.com', phone: '+1 505 555 0143', location: 'Santa Fe, NM', job: 'Sr Backend Engineer', stage: 'screened', match: 79, source: 'Greenhouse', applied: '4 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3071', name: 'Theodore Pierce', email: 'theo.p@example.com', phone: '+1 415 555 0188', location: 'Berkeley, CA', job: 'Sr Backend Engineer', stage: 'applied', match: 76, source: 'LinkedIn', applied: '2 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3070', name: 'Kai Saito', email: 'kai.s@example.com', phone: '+44 20 7946 0177', location: 'London, UK', job: 'CSM London', stage: 'phone', match: 88, source: 'Inbound', applied: '6 days ago', recruiter: 'Naomi Park' },
  { id: 'CAND-3069', name: 'Marco Bianchi', email: 'marco.b@example.com', phone: '+39 02 555 0124', location: 'Milan, IT', job: 'Sr Backend Engineer', stage: 'rejected', match: 64, source: 'Inbound', applied: '5 days ago', recruiter: 'Naomi Park' },
];

const stageColors: Record<Stage, string> = {
  applied: 'bg-muted/50',
  screened: 'bg-info/10 text-info',
  phone: 'bg-primary/10 text-primary',
  onsite: 'bg-warning/10 text-warning',
  offer: 'bg-success/10 text-success',
  hired: 'bg-success/20 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

const stageLabel: Record<Stage, string> = {
  applied: 'Applied',
  screened: 'Screened',
  phone: 'Phone screen',
  onsite: 'Onsite',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export default function CandidatesPage() {
  const [search, setSearch] = React.useState('');
  const [stage, setStage] = React.useState<Stage | 'all'>('all');
  const [job, setJob] = React.useState('all');

  const filtered = candidates.filter((c) => {
    if (stage !== 'all' && c.stage !== stage) return false;
    if (job !== 'all' && c.job !== job) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    }
    return true;
  });

  const jobs = Array.from(new Set(candidates.map((c) => c.job)));

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Candidates"
        description={`${candidates.length} candidates across all open requisitions`}
        breadcrumbs={[
          { label: 'People', href: '/app/hr' },
          { label: 'Recruitment', href: '/app/hr/recruitment' },
          { label: 'Candidates' },
        ]}
        actions={
          <>
            <Button variant="outline">
              <Sparkles className="size-4" /> AI source
            </Button>
            <Button variant="outline">
              <Download className="size-4" /> Export
            </Button>
            <Button>
              <Plus className="size-4" /> New candidate
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {(['all', 'applied', 'screened', 'phone', 'onsite', 'offer', 'hired'] as const).map((s) => {
          const count = s === 'all' ? candidates.length : candidates.filter((c) => c.stage === s).length;
          const active = stage === s;
          return (
            <button
              key={s}
              onClick={() => setStage(s as Stage | 'all')}
              className={cn(
                'rounded-lg border p-3 text-left transition-all',
                active ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40',
              )}
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {s === 'all' ? 'All' : stageLabel[s as Stage]}
              </div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{count}</div>
            </button>
          );
        })}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="pl-8"
            />
          </div>
          <Select value={job} onValueChange={setJob}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Job" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {jobs.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select defaultValue="match-desc">
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="match-desc">Highest match</SelectItem>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon"><Filter className="size-4" /></Button>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>AI score</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="md">
                        <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5 font-medium">
                          {c.name}
                          {c.flag === 'top' && <Star className="size-3 fill-warning text-warning" />}
                          {c.flag === 'referral' && <Badge variant="info" size="sm">Ref</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{c.job}</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs', stageColors[c.stage])}>
                      {stageLabel[c.stage]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex w-32 items-center gap-2">
                      <Progress
                        value={c.match}
                        className="h-1.5"
                        indicatorClassName={c.match >= 90 ? 'bg-success' : c.match >= 75 ? 'bg-primary' : 'bg-warning'}
                      />
                      <span className="text-xs font-medium tabular-nums">{c.match}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.source}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {c.location}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.applied}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Email"><Mail className="size-4" /></Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Schedule"><Calendar className="size-4" /></Button>
                      <Button variant="ghost" size="icon-sm" aria-label="LinkedIn"><Linkedin className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
