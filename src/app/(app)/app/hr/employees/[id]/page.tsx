import Link from 'next/link';
import {
  Award,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  Download,
  FileText,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Pin,
  Send,
  Star,
  Target,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

const employee = {
  code: 'UNI-1001',
  name: 'Sarah Chen',
  designation: 'Senior Product Designer',
  department: 'Engineering',
  manager: 'Aisha Khan',
  status: 'active' as const,
  email: 'sarah.chen@universal.co',
  phone: '+1 415 555 0142',
  address: '1421 Polk St, Apt 5C',
  city: 'San Francisco, CA 94109',
  country: 'United States',
  dob: '1993-08-21',
  gender: 'Female',
  maritalStatus: 'Married',
  nationality: 'American',
  joinedAt: '2026-05-12',
  branch: 'San Francisco HQ',
  type: 'Full-time',
  level: 'IC4',
  reports: 0,
  emergency: {
    name: 'Daniel Chen',
    relation: 'Spouse',
    phone: '+1 415 555 0188',
  },
  bank: {
    name: 'Chase Bank',
    account: '••••2842',
    routing: '••••0017',
  },
  salary: 142000,
  pay: 'Monthly',
};

const jobHistory = [
  { title: 'Senior Product Designer', from: '2026-05', to: 'Present', dept: 'Engineering', desc: 'Lead designer on the AI canvas team. Promoted from IC3.' },
  { title: 'Product Designer', from: '2023-08', to: '2026-05', dept: 'Design', desc: 'Owned the onboarding redesign that reduced TTV by 38%.' },
  { title: 'UX Designer (Contract)', from: '2022-04', to: '2023-08', dept: 'Design', desc: 'Started part-time, converted to full-time within 8 months.' },
];

const documents = [
  { name: 'Offer Letter.pdf', size: '284 KB', date: '2026-04-22' },
  { name: 'I-9 Verification.pdf', size: '512 KB', date: '2026-05-12' },
  { name: 'NDA – Mutual.pdf', size: '198 KB', date: '2026-04-22' },
  { name: 'Direct Deposit Auth.pdf', size: '94 KB', date: '2026-05-13' },
  { name: 'Benefits Election 2026.pdf', size: '418 KB', date: '2026-05-14' },
];

const attendance = [
  { date: '2026-05-14', in: '08:52', out: '17:21', hours: 8.48, status: 'present' as const },
  { date: '2026-05-13', in: '09:01', out: '18:15', hours: 9.23, status: 'present' as const },
  { date: '2026-05-12', in: '08:58', out: '17:42', hours: 8.73, status: 'present' as const },
  { date: '2026-05-11', in: '—', out: '—', hours: 0, status: 'on_hold' as const },
  { date: '2026-05-10', in: '—', out: '—', hours: 0, status: 'on_hold' as const },
  { date: '2026-05-09', in: '08:46', out: '17:33', hours: 8.78, status: 'present' as const },
  { date: '2026-05-08', in: '09:24', out: '17:50', hours: 8.43, status: 'in_progress' as const },
];

const leaveBalance = [
  { type: 'Vacation', used: 4, total: 20, color: 'bg-primary' },
  { type: 'Sick', used: 1, total: 10, color: 'bg-warning' },
  { type: 'Personal', used: 0, total: 5, color: 'bg-info' },
  { type: 'Volunteer', used: 0, total: 2, color: 'bg-success' },
];

const payslips = [
  { period: 'May 2026', gross: 11833, deductions: 1672, tax: 2240, net: 7921, status: 'pending' as const },
  { period: 'Apr 2026', gross: 11833, deductions: 1672, tax: 2240, net: 7921, status: 'paid' as const },
  { period: 'Mar 2026', gross: 11833, deductions: 1672, tax: 2240, net: 7921, status: 'paid' as const },
  { period: 'Feb 2026', gross: 11833, deductions: 1672, tax: 2240, net: 7921, status: 'paid' as const },
  { period: 'Jan 2026', gross: 11833, deductions: 1672, tax: 2240, net: 7921, status: 'paid' as const },
];

const goals = [
  { title: 'Ship AI canvas v2', progress: 75, status: 'on track', due: '2026-06-30' },
  { title: 'Mentor 2 junior designers', progress: 50, status: 'on track', due: '2026-12-31' },
  { title: 'Publish design system docs', progress: 92, status: 'at risk', due: '2026-05-30' },
  { title: 'User research – Enterprise tier', progress: 100, status: 'completed', due: '2026-04-30' },
];

const skills = [
  { name: 'Product Design', level: 5 },
  { name: 'Figma', level: 5 },
  { name: 'Design Systems', level: 4 },
  { name: 'User Research', level: 4 },
  { name: 'Prototyping', level: 5 },
  { name: 'Frontend Code', level: 3 },
  { name: 'Accessibility', level: 4 },
  { name: 'Motion Design', level: 3 },
];

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export default async function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={employee.name}
        description={`${employee.designation} · ${employee.code}`}
        breadcrumbs={[
          { label: 'People', href: '/app/hr' },
          { label: 'Employees', href: '/app/hr/employees' },
          { label: employee.name },
        ]}
        back={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/app/hr/employees" aria-label="Back to employees">
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline">
              <Send className="size-4" /> Message
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
            <Button>Edit profile</Button>
          </>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/10 to-info/10" />
        <div className="-mt-14 flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Avatar size="xl" className="h-24 w-24 ring-4 ring-background">
              <AvatarFallback name={employee.name} className="text-2xl">
                {initials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">{employee.name}</h2>
                <StatusBadge status={employee.status} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{employee.designation} · {employee.department}</div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Mail className="size-3" /> {employee.email}</span>
                <span className="inline-flex items-center gap-1"><Phone className="size-3" /> {employee.phone}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {employee.branch}</span>
                <span className="inline-flex items-center gap-1"><CalendarDays className="size-3" /> Joined {formatDate(employee.joinedAt)}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Tenure</div>
              <div className="mt-0.5 font-semibold tabular-nums">3 days</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Reports</div>
              <div className="mt-0.5 font-semibold tabular-nums">{employee.reports}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Level</div>
              <div className="mt-0.5 font-semibold">{employee.level}</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="personal">
        <TabsList variant="underline" className="overflow-x-auto">
          <TabsTrigger value="personal" variant="underline">Personal</TabsTrigger>
          <TabsTrigger value="job" variant="underline">Job</TabsTrigger>
          <TabsTrigger value="documents" variant="underline">Documents</TabsTrigger>
          <TabsTrigger value="attendance" variant="underline">Attendance</TabsTrigger>
          <TabsTrigger value="leave" variant="underline">Leave</TabsTrigger>
          <TabsTrigger value="payslips" variant="underline">Payslips</TabsTrigger>
          <TabsTrigger value="performance" variant="underline">Performance</TabsTrigger>
          <TabsTrigger value="skills" variant="underline">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserCheck className="size-4" /> Contact information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Field label="Work email" value={employee.email} />
                <Field label="Work phone" value={employee.phone} />
                <Field label="Personal email" value="sarah@personal.example" />
                <Field label="Mobile" value="+1 415 555 0123" />
                <Field label="Linkedin" value={<a className="text-primary hover:underline">linkedin.com/in/sarahchen</a>} />
                <Field label="Slack" value="@sarah" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="size-4" /> Address
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Field label="Street" value={employee.address} />
                <Field label="City/State" value={employee.city} />
                <Field label="Country" value={employee.country} />
                <Field label="Work location" value={employee.branch} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Pin className="size-4" /> Personal details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Field label="Date of birth" value={formatDate(employee.dob)} />
                <Field label="Gender" value={employee.gender} />
                <Field label="Marital status" value={employee.maritalStatus} />
                <Field label="Nationality" value={employee.nationality} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="size-4 text-destructive" /> Emergency contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Field label="Full name" value={employee.emergency.name} />
                <Field label="Relationship" value={employee.emergency.relation} />
                <Field label="Phone" value={employee.emergency.phone} />
                <Field label="Email" value="daniel@personal.example" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="job" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="size-4" /> Current role
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <Field label="Designation" value={employee.designation} />
                <Field label="Department" value={employee.department} />
                <Field label="Level" value={employee.level} />
                <Field label="Manager" value={<a className="text-primary hover:underline">{employee.manager}</a>} />
                <Field label="Branch" value={employee.branch} />
                <Field label="Employment type" value={employee.type} />
                <Field label="Hire date" value={formatDate(employee.joinedAt)} />
                <Field label="Probation ends" value="Aug 12, 2026" />
                <Field label="Working hours" value="9:00 – 18:00 PT" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="size-4" /> Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border bg-primary/5 p-4">
                  <div className="text-xs text-muted-foreground">Annual gross</div>
                  <div className="text-2xl font-semibold tabular-nums">{formatCurrency(employee.salary)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Paid {employee.pay.toLowerCase()}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Currency" value="USD" />
                  <Field label="Equity" value="2,500 RSUs" />
                  <Field label="Bonus target" value="15%" />
                  <Field label="Next review" value="Nov 12, 2026" />
                </div>
                <div className="border-t border-border pt-3">
                  <Field label="Bank" value={`${employee.bank.name} ${employee.bank.account}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job history</CardTitle>
              <CardDescription>Positions held at Universal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 border-l-2 border-border pl-6">
                {jobHistory.map((j, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-medium">{j.title}</div>
                      <div className="text-xs text-muted-foreground">{j.from} – {j.to}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{j.dept}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{j.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Documents</CardTitle>
                <CardDescription>Signed agreements and HR paperwork</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <FileText className="size-4" /> Upload
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {documents.map((d) => (
                <div key={d.name} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">Uploaded {formatDate(d.date)} · {d.size}</div>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <Download className="size-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent attendance</CardTitle>
              <CardDescription>Last 7 working days</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th className="text-right">Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a) => (
                    <tr key={a.date}>
                      <td className="font-medium">{formatDate(a.date)}</td>
                      <td className="font-mono">{a.in}</td>
                      <td className="font-mono">{a.out}</td>
                      <td className="text-right font-mono tabular-nums">{a.hours.toFixed(2)}</td>
                      <td>
                        {a.status === 'present' && <StatusBadge status="active" label="Present" />}
                        {a.status === 'in_progress' && <StatusBadge status="warning" label="Late" />}
                        {a.status === 'on_hold' && <StatusBadge status="closed" label="Weekend" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {leaveBalance.map((l) => {
              const pct = (l.used / l.total) * 100;
              return (
                <Card key={l.type}>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium">{l.type}</span>
                      <span className="text-xs text-muted-foreground">{l.used}/{l.total} used</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold tabular-nums">{l.total - l.used}</span>
                      <span className="text-xs text-muted-foreground">days available</span>
                    </div>
                    <Progress value={pct} indicatorClassName={l.color} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="payslips">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pay history</CardTitle>
              <CardDescription>Last 5 pay periods · USD</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th className="text-right">Gross</th>
                    <th className="text-right">Deductions</th>
                    <th className="text-right">Tax</th>
                    <th className="text-right">Net</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((p) => (
                    <tr key={p.period}>
                      <td className="font-medium">{p.period}</td>
                      <td className="text-right font-mono">{formatCurrency(p.gross)}</td>
                      <td className="text-right font-mono text-muted-foreground">{formatCurrency(p.deductions)}</td>
                      <td className="text-right font-mono text-muted-foreground">{formatCurrency(p.tax)}</td>
                      <td className="text-right font-mono font-medium">{formatCurrency(p.net)}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td>
                        <Button variant="ghost" size="icon-sm">
                          <Download className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="size-4 text-warning" /> Latest review rating
                </div>
                <div className="text-3xl font-semibold">4.6</div>
                <div className="text-xs text-muted-foreground">Q1 2026 · Exceeds expectations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="size-4 text-primary" /> Goal completion
                </div>
                <div className="text-3xl font-semibold">82%</div>
                <div className="text-xs text-muted-foreground">9 of 11 goals on track</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="size-4 text-success" /> Growth trend
                </div>
                <div className="text-3xl font-semibold">+0.4</div>
                <div className="text-xs text-muted-foreground">vs prior review cycle</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active goals</CardTitle>
              <CardDescription>OKR cycle Q2 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((g) => (
                <div key={g.title}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-sm font-medium">{g.title}</span>
                      <Badge variant={g.status === 'completed' ? 'success' : g.status === 'at risk' ? 'warning' : 'soft'} size="sm">
                        {g.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Due {formatDate(g.due)}</span>
                      <span className="tabular-nums font-medium text-foreground">{g.progress}%</span>
                    </div>
                  </div>
                  <Progress
                    value={g.progress}
                    indicatorClassName={g.status === 'at risk' ? 'bg-warning' : g.status === 'completed' ? 'bg-success' : 'bg-primary'}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Skills & proficiency</CardTitle>
                <CardDescription>Self-assessed and manager-validated</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {skills.map((s) => (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{s.name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`size-2 rounded-full ${i < s.level ? 'bg-primary' : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="size-4" /> Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="border-l-2 border-primary pl-3">
                  <div className="font-medium">M.S. in Human-Computer Interaction</div>
                  <div className="text-xs text-muted-foreground">Stanford University · 2015 – 2017</div>
                </div>
                <div className="border-l-2 border-border pl-3">
                  <div className="font-medium">B.A. in Visual Communication Design</div>
                  <div className="text-xs text-muted-foreground">UCLA · 2011 – 2015</div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                  <Award className="size-4 text-warning" /> Certifications
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Globe className="size-3.5" /> Google UX Design</div>
                  <div className="flex items-center gap-2"><Building2 className="size-3.5" /> Figma Certified Professional</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
