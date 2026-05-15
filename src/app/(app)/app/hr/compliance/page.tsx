import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Filter,
  Globe,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatCard } from '@/components/ui/stat-card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn, initials } from '@/lib/utils';

const stats = [
  { label: 'Overall compliance', value: '94.4%', delta: 2.1, icon: ShieldCheck },
  { label: 'Trainings overdue', value: 14, deltaLabel: '6% of staff', icon: AlertTriangle, invertTrend: true },
  { label: 'Certifications expiring', value: 8, deltaLabel: 'in next 30 days', icon: FileText, invertTrend: true },
  { label: 'Policies acknowledged', value: '98.4%', delta: 0.4, icon: CheckCircle2 },
];

interface Training {
  id: string;
  name: string;
  category: string;
  jurisdiction: string;
  frequency: string;
  assigned: number;
  completed: number;
  overdue: number;
  due: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const trainings: Training[] = [
  { id: 'TRN-001', name: 'GDPR & Data Privacy', category: 'Data Protection', jurisdiction: 'EU + Global', frequency: 'Annual', assigned: 248, completed: 234, overdue: 14, due: 'May 31, 2026', severity: 'critical' },
  { id: 'TRN-002', name: 'Preventing Workplace Harassment', category: 'HR / People', jurisdiction: 'Global', frequency: 'Annual', assigned: 248, completed: 244, overdue: 4, due: 'Jun 14, 2026', severity: 'critical' },
  { id: 'TRN-003', name: 'Information Security Awareness', category: 'Security', jurisdiction: 'Global', frequency: 'Annual', assigned: 248, completed: 246, overdue: 2, due: 'Jun 30, 2026', severity: 'critical' },
  { id: 'TRN-004', name: 'Anti-Bribery & Corruption', category: 'Legal / Ethics', jurisdiction: 'Global', frequency: 'Annual', assigned: 248, completed: 240, overdue: 8, due: 'Jul 15, 2026', severity: 'high' },
  { id: 'TRN-005', name: 'OSHA Workplace Safety', category: 'Safety', jurisdiction: 'United States', frequency: 'Biennial', assigned: 142, completed: 140, overdue: 2, due: 'Aug 30, 2026', severity: 'high' },
  { id: 'TRN-006', name: 'CCPA Consumer Privacy', category: 'Data Protection', jurisdiction: 'California, US', frequency: 'Annual', assigned: 78, completed: 78, overdue: 0, due: 'Sep 12, 2026', severity: 'high' },
  { id: 'TRN-007', name: 'SOC 2 Awareness', category: 'Security', jurisdiction: 'Global', frequency: 'Annual', assigned: 248, completed: 232, overdue: 16, due: 'Sep 30, 2026', severity: 'high' },
  { id: 'TRN-008', name: 'PCI DSS Basics', category: 'Security', jurisdiction: 'Global', frequency: 'Annual', assigned: 56, completed: 54, overdue: 2, due: 'Oct 14, 2026', severity: 'medium' },
  { id: 'TRN-009', name: 'Diversity, Equity, Inclusion', category: 'HR / People', jurisdiction: 'Global', frequency: 'Biennial', assigned: 248, completed: 220, overdue: 28, due: 'Nov 1, 2026', severity: 'medium' },
  { id: 'TRN-010', name: 'Code of Conduct', category: 'Legal / Ethics', jurisdiction: 'Global', frequency: 'Annual', assigned: 248, completed: 248, overdue: 0, due: 'Dec 31, 2026', severity: 'medium' },
];

const overdueLearners = [
  { name: 'David Kim', dept: 'Engineering', overdue: 3, oldest: '4 days' },
  { name: 'Diego Fernández', dept: 'Sales', overdue: 2, oldest: '12 days' },
  { name: 'Yuki Nakamura', dept: 'Operations', overdue: 2, oldest: '7 days' },
  { name: 'Emma Thompson', dept: 'Marketing', overdue: 2, oldest: '3 days' },
  { name: 'Hannah Bauer', dept: 'Marketing', overdue: 1, oldest: '8 days' },
  { name: 'Carlos Mendes', dept: 'Engineering', overdue: 1, oldest: '2 days' },
];

const certifications = [
  { name: 'Aisha Khan', cert: 'AWS Solutions Architect Pro', issued: '2024-06-12', expires: '2027-06-12', daysLeft: 760, status: 'active' as const },
  { name: 'Mira Patel', cert: 'CIPP/US Privacy Cert', issued: '2024-08-04', expires: '2027-08-04', daysLeft: 812, status: 'active' as const },
  { name: 'Tobias Klein', cert: 'AWS Solutions Architect', issued: '2022-11-15', expires: '2025-11-15', daysLeft: -181, status: 'expired' as const },
  { name: 'Ravi Sharma', cert: 'ISTQB Certified Tester', issued: '2023-05-20', expires: '2026-05-20', daysLeft: 5, status: 'expiring' as const },
  { name: 'Naomi Park', cert: 'PHR Certification', issued: '2023-06-30', expires: '2026-06-30', daysLeft: 46, status: 'expiring' as const },
  { name: 'Hiroshi Tanaka', cert: 'CISSP', issued: '2021-09-04', expires: '2027-09-04', daysLeft: 843, status: 'active' as const },
];

const policies = [
  { name: 'Code of Conduct', version: 'v3.2', date: 'Apr 1, 2026', signed: 248, total: 248 },
  { name: 'Acceptable Use Policy', version: 'v2.8', date: 'Mar 15, 2026', signed: 248, total: 248 },
  { name: 'Information Security Policy', version: 'v4.1', date: 'Feb 28, 2026', signed: 244, total: 248 },
  { name: 'Whistleblower Policy', version: 'v1.4', date: 'Jan 20, 2026', signed: 248, total: 248 },
  { name: 'Remote Work Policy', version: 'v2.0', date: 'Jan 1, 2026', signed: 232, total: 248 },
];

const severityBadge = {
  critical: <Badge variant="destructive" size="sm">Critical</Badge>,
  high: <Badge variant="warning" size="sm">High</Badge>,
  medium: <Badge variant="soft" size="sm">Medium</Badge>,
  low: <Badge variant="outline" size="sm">Low</Badge>,
};

const certBadge = {
  active: <Badge variant="success" size="sm">Active</Badge>,
  expiring: <Badge variant="warning" size="sm">Expiring soon</Badge>,
  expired: <Badge variant="destructive" size="sm">Expired</Badge>,
};

export default function CompliancePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Compliance"
        description="Track mandatory training, certifications, and policy attestation across the org"
        breadcrumbs={[{ label: 'People', href: '/app/hr' }, { label: 'Compliance' }]}
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" /> Audit report
            </Button>
            <Button>
              <Plus className="size-4" /> Assign training
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="relative bg-gradient-to-br from-success/15 via-success/5 to-transparent p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-success" />
                <span className="text-sm font-medium text-success">Audit-ready</span>
              </div>
              <h2 className="mt-1 text-xl font-semibold">Universal is in good standing</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                94.4% overall compliance · 14 pending items across 6 employees · Next audit on Jul 12, 2026
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">SOC 2 Type II</div>
                <Badge variant="success" size="sm">Certified</Badge>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">ISO 27001</div>
                <Badge variant="success" size="sm">Certified</Badge>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">GDPR</div>
                <Badge variant="success" size="sm">Compliant</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Mandatory training</CardTitle>
              <CardDescription>{trainings.length} required programs across all jurisdictions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input placeholder="Search..." className="w-40 pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All jurisdictions</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="eu">European Union</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon"><Filter className="size-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Training</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Cadence</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead className="text-right">Overdue</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((t) => {
                  const pct = (t.completed / t.assigned) * 100;
                  return (
                    <TableRow key={t.id} className="cursor-pointer hover:bg-muted/40">
                      <TableCell>
                        <div className="font-mono text-xs text-primary">{t.id}</div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.category} · Due {t.due}</div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Globe className="size-3" /> {t.jurisdiction}</span>
                      </TableCell>
                      <TableCell><Badge variant="outline" size="sm">{t.frequency}</Badge></TableCell>
                      <TableCell>
                        <div className="flex w-40 items-center gap-2">
                          <Progress
                            value={pct}
                            className="h-1.5"
                            indicatorClassName={pct >= 95 ? 'bg-success' : pct >= 85 ? 'bg-primary' : 'bg-warning'}
                          />
                          <span className="text-xs font-medium tabular-nums">{Math.round(pct)}%</span>
                        </div>
                        <div className="mt-0.5 text-2xs text-muted-foreground tabular-nums">
                          {t.completed}/{t.assigned}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {t.overdue > 0 ? <span className="font-semibold text-destructive">{t.overdue}</span> : <span className="text-muted-foreground">0</span>}
                      </TableCell>
                      <TableCell>{severityBadge[t.severity]}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm"><ChevronRight className="size-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="size-4 text-warning" /> Overdue learners
              </CardTitle>
              <CardDescription>Top employees with outstanding items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueLearners.map((l) => (
                <div key={l.name} className="flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 p-3">
                  <Avatar size="sm"><AvatarFallback name={l.name}>{initials(l.name)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.dept}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-destructive">{l.overdue}</div>
                    <div className="text-2xs text-muted-foreground">{l.oldest}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                Send bulk reminders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="size-4 text-success" /> By region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { name: 'North America', rate: 96 },
                { name: 'Europe', rate: 92 },
                { name: 'APAC', rate: 89 },
                { name: 'LATAM', rate: 94 },
                { name: 'MENA', rate: 88 },
              ].map((r) => (
                <div key={r.name}>
                  <div className="mb-0.5 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{r.name}</span>
                    <span className="font-medium tabular-nums">{r.rate}%</span>
                  </div>
                  <Progress value={r.rate} indicatorClassName={r.rate >= 95 ? 'bg-success' : r.rate >= 90 ? 'bg-primary' : 'bg-warning'} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Certifications</CardTitle>
            <CardDescription>Employee credentials and expirations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Holder</th>
                  <th>Certification</th>
                  <th>Expires</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar size="xs"><AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback></Avatar>
                        <span className="font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="text-sm">{c.cert}</td>
                    <td className="text-xs">
                      <div className={cn(c.status === 'expired' && 'text-destructive', c.status === 'expiring' && 'text-warning')}>
                        {c.expires}
                      </div>
                      <div className="text-muted-foreground tabular-nums">
                        {c.daysLeft >= 0 ? `${c.daysLeft} days left` : `${Math.abs(c.daysLeft)} days ago`}
                      </div>
                    </td>
                    <td>{certBadge[c.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Policy attestation</CardTitle>
            <CardDescription>Active policies and acknowledgement rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {policies.map((p) => {
              const pct = (p.signed / p.total) * 100;
              return (
                <div key={p.name} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        {p.name} <Badge variant="outline" size="sm">{p.version}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Effective {p.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">{Math.round(pct)}%</div>
                      <div className="text-2xs text-muted-foreground tabular-nums">{p.signed}/{p.total}</div>
                    </div>
                  </div>
                  <Progress
                    value={pct}
                    className="mt-2 h-1.5"
                    indicatorClassName={pct === 100 ? 'bg-success' : 'bg-primary'}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
