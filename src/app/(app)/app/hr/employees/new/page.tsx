'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Copy,
  DollarSign,
  FileText,
  Key,
  Mail,
  Save,
  Send,
  Shield,
  Sparkles,
  Upload,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewEmployeePage() {
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);
  const [generatedLink, setGeneratedLink] = React.useState('');

  const generateLink = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setGeneratedLink(`https://app.universal.com/onboard/${token}`);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Hire new employee"
        description="Create a new employee record and optionally invite them to the platform."
        breadcrumbs={[{ label: 'HR', href: '/app/hr' }, { label: 'Employees', href: '/app/hr/employees' }, { label: 'New' }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/hr/employees"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm" asChild><Link href="/app/hr/employees"><X className="size-4" /> Cancel</Link></Button>
            <Button variant="outline" size="sm"><Save className="size-4" /> Save draft</Button>
            <Button size="sm"><Send className="size-4" /> Hire & invite</Button>
          </>
        }
      />

      <div className="p-6 space-y-6 pb-16">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList variant="pills">
            <TabsTrigger value="personal" variant="pills"><User className="size-4" /> Personal</TabsTrigger>
            <TabsTrigger value="job" variant="pills"><Briefcase className="size-4" /> Job</TabsTrigger>
            <TabsTrigger value="compensation" variant="pills"><DollarSign className="size-4" /> Compensation</TabsTrigger>
            <TabsTrigger value="documents" variant="pills"><FileText className="size-4" /> Documents</TabsTrigger>
            <TabsTrigger value="access" variant="pills"><Shield className="size-4" /> System access</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-3 flex items-center gap-4">
                  <Avatar size="lg"><AvatarFallback>?</AvatarFallback></Avatar>
                  <Button variant="outline" size="sm"><Upload className="size-4" /> Upload photo</Button>
                </div>
                <div className="space-y-1.5"><Label required>Legal first name</Label><Input defaultValue="Priya" /></div>
                <div className="space-y-1.5"><Label>Middle name</Label><Input /></div>
                <div className="space-y-1.5"><Label required>Legal last name</Label><Input defaultValue="Khanna" /></div>
                <div className="space-y-1.5"><Label>Preferred name</Label><Input defaultValue="Priya" /></div>
                <div className="space-y-1.5"><Label>Pronouns</Label><Select defaultValue="she"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="she">She/Her</SelectItem><SelectItem value="he">He/Him</SelectItem><SelectItem value="they">They/Them</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Date of birth</Label><Input type="date" defaultValue="1992-03-22" /></div>
                <div className="space-y-1.5"><Label required>Personal email</Label><Input type="email" defaultValue="priya.khanna@gmail.com" /></div>
                <div className="space-y-1.5"><Label>Personal phone</Label><Input defaultValue="+1 415 555 0181" /></div>
                <div className="space-y-1.5"><Label>Nationality</Label><Input defaultValue="United States" /></div>
                <div className="space-y-1.5 md:col-span-3"><Label>Home address</Label><Input defaultValue="2440 Folsom St, San Francisco, CA 94110" /></div>
                <div className="space-y-1.5"><Label>Emergency contact</Label><Input defaultValue="Anish Khanna" /></div>
                <div className="space-y-1.5"><Label>Emergency phone</Label><Input defaultValue="+1 415 555 0192" /></div>
                <div className="space-y-1.5"><Label>Relationship</Label><Input defaultValue="Spouse" /></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job">
            <Card>
              <CardHeader><CardTitle>Job details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><Label required>Job title</Label><Input defaultValue="Senior Product Designer" /></div>
                <div className="space-y-1.5"><Label required>Employee ID</Label><Input defaultValue="EMP-1840" className="font-mono" /></div>
                <div className="space-y-1.5"><Label required>Department</Label><Select defaultValue="design"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="eng">Engineering</SelectItem><SelectItem value="design">Design</SelectItem><SelectItem value="product">Product</SelectItem><SelectItem value="sales">Sales</SelectItem><SelectItem value="marketing">Marketing</SelectItem><SelectItem value="ops">Operations</SelectItem><SelectItem value="hr">People</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Reports to</Label><Input defaultValue="Lena Park - VP Design" /></div>
                <div className="space-y-1.5"><Label required>Employment type</Label><Select defaultValue="ft"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ft">Full-time</SelectItem><SelectItem value="pt">Part-time</SelectItem><SelectItem value="contract">Contractor</SelectItem><SelectItem value="intern">Intern</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Work location</Label><Select defaultValue="hybrid-sf"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remote">Remote</SelectItem><SelectItem value="hybrid-sf">Hybrid - SF HQ</SelectItem><SelectItem value="onsite-sf">On-site - SF HQ</SelectItem><SelectItem value="onsite-ny">On-site - NY office</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label required>Start date</Label><Input type="date" defaultValue="2026-06-01" /></div>
                <div className="space-y-1.5"><Label>Probation end date</Label><Input type="date" defaultValue="2026-09-01" /></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Job description / scope</Label><Textarea minRows={4} defaultValue="Lead design for Vendor Portal and Marketplace squads. Own design system contributions for procurement workflows." /></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation">
            <Card>
              <CardHeader><CardTitle>Compensation</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><Label required>Base salary</Label><Input type="number" defaultValue={148000} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Currency</Label><Select defaultValue="USD"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Pay schedule</Label><Select defaultValue="biweekly"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="biweekly">Bi-weekly</SelectItem><SelectItem value="semi">Semi-monthly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Bonus structure</Label><Select defaultValue="performance"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="performance">Performance (10%)</SelectItem><SelectItem value="commission">Commission</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label>Equity grant</Label><Input placeholder="# of shares" defaultValue={4500} className="font-mono" /></div>
                <div className="space-y-1.5"><Label>Vesting schedule</Label><Select defaultValue="4-1"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="4-1">4-year / 1-yr cliff</SelectItem><SelectItem value="2-0">2-year / no cliff</SelectItem><SelectItem value="none">Not applicable</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5 md:col-span-2"><Label>Benefits package</Label><Select defaultValue="standard"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="standard">Standard - Health, Dental, Vision, 401k 4%</SelectItem><SelectItem value="executive">Executive - +supplemental life</SelectItem><SelectItem value="contractor">Contractor - none</SelectItem></SelectContent></Select></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Onboarding documents</CardTitle><Button variant="outline" size="sm"><Upload className="size-4" /> Upload</Button></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'Signed offer letter', status: 'pending', required: true },
                  { name: 'I-9 Form (Section 1)', status: 'pending', required: true },
                  { name: 'W-4 Tax withholding', status: 'pending', required: true },
                  { name: 'Direct deposit authorization', status: 'pending', required: true },
                  { name: 'Confidentiality / IP agreement', status: 'pending', required: true },
                  { name: 'Employee handbook acknowledgment', status: 'pending', required: false },
                  { name: 'Background check consent', status: 'pending', required: true },
                ].map((d) => (
                  <div key={d.name} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.required ? 'Required' : 'Optional'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-warning">Pending</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-4" /> System roles</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5"><Label>Primary role</Label><Select defaultValue="employee"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="employee">Employee</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select></div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Additional permissions</p>
                    {[
                      { label: 'Approve expenses', desc: 'Can approve team expense reports' },
                      { label: 'Access design files', desc: 'Read/write to design module' },
                      { label: 'View payroll', desc: 'Access to payroll data for own team' },
                    ].map((p) => (
                      <div key={p.label} className="flex items-center justify-between rounded-md border p-3">
                        <div><p className="text-sm font-medium">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/30 bg-primary/[0.03]">
                <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Invite to platform</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5"><Label>Work email</Label><Input type="email" defaultValue="priya.khanna@universal.com" /></div>
                  {!generatedLink && <Button onClick={generateLink} className="w-full"><Key className="size-4" /> Generate magic link</Button>}
                  {generatedLink && (
                    <>
                      <div className="rounded-md border bg-background p-3"><div className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success shrink-0" /><p className="font-mono text-xs text-foreground break-all">{generatedLink}</p></div></div>
                      <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1"><Copy className="size-4" /> Copy</Button><Button size="sm" className="flex-1" onClick={() => setMagicLinkSent(true)}><Mail className="size-4" /> Email invite</Button></div>
                      {magicLinkSent && <p className="text-xs text-success">Invite emailed - expires in 72 hours.</p>}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
