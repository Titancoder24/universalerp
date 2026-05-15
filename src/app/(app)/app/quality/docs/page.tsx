'use client';

import * as React from 'react';
import { Download, FileText, Filter, Plus, Search, Shield } from 'lucide-react';
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
import { formatDate, initials } from '@/lib/utils';

const docs = [
  { id: 'QM-001', type: 'Manual', title: 'Quality Manual', rev: 'r12', effective: '2025-10-01', nextReview: '2026-10-01', owner: 'R. Chen', status: 'active' as const, classification: 'Controlled', circulation: 'All staff' },
  { id: 'QP-002', type: 'Procedure', title: 'Document & Record Control', rev: 'r7', effective: '2025-08-15', nextReview: '2026-08-15', owner: 'M. Stark', status: 'active' as const, classification: 'Controlled', circulation: 'All staff' },
  { id: 'QP-007', type: 'Procedure', title: 'Internal Audit Procedure', rev: 'r4', effective: '2026-01-10', nextReview: '2027-01-10', owner: 'R. Chen', status: 'active' as const, classification: 'Controlled', circulation: 'Mgmt + QA' },
  { id: 'QP-012', type: 'Procedure', title: 'Non-Conformance Control', rev: 'r9', effective: '2026-03-04', nextReview: '2027-03-04', owner: 'P. Krishnan', status: 'active' as const, classification: 'Controlled', circulation: 'All staff' },
  { id: 'QP-014', type: 'Procedure', title: 'CAPA Process', rev: 'r6', effective: '2025-12-22', nextReview: '2026-12-22', owner: 'P. Krishnan', status: 'active' as const, classification: 'Controlled', circulation: 'All staff' },
  { id: 'WI-204', type: 'Work Instruction', title: 'CNC Setup - VTC-300', rev: 'r3', effective: '2026-02-15', nextReview: '2027-02-15', owner: 'C. Mendez', status: 'active' as const, classification: 'Controlled', circulation: 'Mfg ops' },
  { id: 'WI-205', type: 'Work Instruction', title: 'CMM Operation - Zeiss Contura', rev: 'r2', effective: '2025-09-08', nextReview: '2026-09-08', owner: 'M. Jensen', status: 'active' as const, classification: 'Controlled', circulation: 'QA' },
  { id: 'WI-308', type: 'Work Instruction', title: 'Gearbox Final Assembly', rev: 'r5', effective: '2026-03-12', nextReview: '2027-03-12', owner: 'D. Thompson', status: 'active' as const, classification: 'Controlled', circulation: 'Assembly' },
  { id: 'FRM-014', type: 'Form', title: 'First Article Inspection (FAI)', rev: 'r3', effective: '2026-01-25', nextReview: '2027-01-25', owner: 'P. Krishnan', status: 'active' as const, classification: 'Controlled', circulation: 'QA' },
  { id: 'FRM-022', type: 'Form', title: 'Material Returns Authorization', rev: 'r2', effective: '2025-11-18', nextReview: '2026-11-18', owner: 'R. Chen', status: 'active' as const, classification: 'Controlled', circulation: 'CS + QA' },
  { id: 'SPC-CAST-HSG-001', type: 'Specification', title: 'Aluminum Casting Acceptance', rev: 'r4', effective: '2025-07-20', nextReview: '2026-07-20', owner: 'A. Reyes', status: 'active' as const, classification: 'Controlled', circulation: 'QA + Eng' },
  { id: 'SPC-PCBA-001', type: 'Specification', title: 'PCBA Assembly Standards (IPC-A-610)', rev: 'r2', effective: '2026-04-02', nextReview: '2027-04-02', owner: 'M. Jensen', status: 'active' as const, classification: 'Controlled', circulation: 'Electronics' },
  { id: 'QP-019', type: 'Procedure', title: 'Customer Complaint Handling', rev: 'r3', effective: '2026-05-01', nextReview: '2027-05-01', owner: 'S. Lee', status: 'draft' as const, classification: 'Draft', circulation: 'Pending' },
  { id: 'WI-412', type: 'Work Instruction', title: 'Brake Caliper Heat Treatment', rev: 'r1', effective: '2026-05-10', nextReview: '2027-05-10', owner: 'L. Rodriguez', status: 'pending' as const, classification: 'Pending approval', circulation: 'Pending' },
  { id: 'QP-001', type: 'Procedure', title: 'Quality Manual Control (superseded)', rev: 'r11', effective: '2023-09-12', nextReview: '—', owner: 'R. Chen', status: 'closed' as const, classification: 'Obsolete', circulation: 'Archived' },
];

const typeVariant: Record<string, 'info' | 'warning' | 'soft' | 'secondary' | 'default'> = {
  Manual: 'info', Procedure: 'warning', 'Work Instruction': 'soft', Form: 'secondary', Specification: 'default',
};

export default function DocsPage() {
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const filtered = docs.filter((d) => {
    const matchSearch = !search || d.id.toLowerCase().includes(search.toLowerCase()) || d.title.toLowerCase().includes(search.toLowerCase());
    const matchType = type === 'all' || d.type === type;
    const matchStatus = status === 'all' || d.status === status;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Controlled Documents"
        description="Quality manuals, procedures, work instructions, forms and specs with revision control."
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'Documents' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New document</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {[
          { label: 'Manual', count: docs.filter((d) => d.type === 'Manual').length, color: 'info' },
          { label: 'Procedure', count: docs.filter((d) => d.type === 'Procedure').length, color: 'warning' },
          { label: 'Work Instruction', count: docs.filter((d) => d.type === 'Work Instruction').length, color: 'soft' },
          { label: 'Form', count: docs.filter((d) => d.type === 'Form').length, color: 'secondary' },
          { label: 'Specification', count: docs.filter((d) => d.type === 'Specification').length, color: 'default' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums">{s.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..." className="pl-8" />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Procedure">Procedure</SelectItem>
                <SelectItem value="Work Instruction">Work instruction</SelectItem>
                <SelectItem value="Form">Form</SelectItem>
                <SelectItem value="Specification">Specification</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Obsolete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Doc ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Rev</th>
                <th>Effective</th>
                <th>Next review</th>
                <th>Owner</th>
                <th>Classification</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs font-medium text-primary">{d.id}</td>
                  <td className="font-medium">{d.title}</td>
                  <td><Badge variant={typeVariant[d.type]} size="sm">{d.type}</Badge></td>
                  <td><Badge variant="outline" size="sm" className="font-mono">{d.rev}</Badge></td>
                  <td className="text-xs text-muted-foreground">{formatDate(d.effective)}</td>
                  <td className="text-xs text-muted-foreground">{d.nextReview === '—' ? '—' : formatDate(d.nextReview)}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Avatar size="xs"><AvatarFallback>{initials(d.owner)}</AvatarFallback></Avatar>
                      <span className="text-xs">{d.owner}</span>
                    </div>
                  </td>
                  <td className="text-xs">
                    <div className="flex items-center gap-1">
                      <Shield className="size-3 text-muted-foreground" />
                      {d.classification}
                    </div>
                  </td>
                  <td><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
