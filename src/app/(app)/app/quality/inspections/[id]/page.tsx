'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Printer,
  Save,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials } from '@/lib/utils';

const inspection = {
  id: 'INS-8821',
  type: 'Incoming',
  item: 'HSG-CAST-450',
  itemName: 'Cast Aluminum Housing',
  lot: 'L-24881',
  source: 'Acme Castings PO-19821',
  qty: 200,
  sampleSize: 20,
  date: '2026-05-15 13:45',
  inspector: 'Priya Krishnan',
  approver: '—',
  drawing: 'DWG-HSG-450-A r4',
  specification: 'SPC-CAST-HSG-001',
};

type CharResult = 'pass' | 'fail' | 'pending';

const characteristics: Array<{
  id: string;
  no: number;
  desc: string;
  type: 'Var' | 'Att';
  target: string;
  utl: number | null;
  ltl: number | null;
  uom: string;
  measured: (number | string)[];
  result: CharResult;
  notes?: string;
}> = [
  { id: 'C01', no: 1, desc: 'Bore Φ22 H7', type: 'Var', target: '22.000', utl: 22.021, ltl: 22.000, uom: 'mm', measured: [22.012, 22.008, 22.015, 22.010, 22.014], result: 'pass' },
  { id: 'C02', no: 2, desc: 'Face concentricity', type: 'Var', target: '≤ 0.020', utl: 0.020, ltl: 0, uom: 'mm', measured: [0.014, 0.012, 0.015, 0.011, 0.018], result: 'pass' },
  { id: 'C03', no: 3, desc: 'Surface finish Ra', type: 'Var', target: '≤ 1.6', utl: 1.6, ltl: 0, uom: 'µm', measured: [1.2, 1.4, 1.5, 1.3, 1.6], result: 'pass' },
  { id: 'C04', no: 4, desc: 'Weight', type: 'Var', target: '4.2 ±0.1', utl: 4.3, ltl: 4.1, uom: 'kg', measured: [4.18, 4.21, 4.19, 4.22, 4.20], result: 'pass' },
  { id: 'C05', no: 5, desc: 'Thread M8x1.25 (5 holes)', type: 'Att', target: 'Go/No-Go', utl: null, ltl: null, uom: '', measured: ['Pass', 'Pass', 'Pass', 'Pass', 'Pass'], result: 'pass' },
  { id: 'C06', no: 6, desc: 'Visual - external defects', type: 'Att', target: 'No major defects', utl: null, ltl: null, uom: '', measured: ['OK', 'OK', 'Minor', 'OK', 'OK'], result: 'pass', notes: 'One unit minor scuff, accepted' },
  { id: 'C07', no: 7, desc: 'Material certification', type: 'Att', target: 'AL 6061-T6 cert', utl: null, ltl: null, uom: '', measured: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'], result: 'pass' },
  { id: 'C08', no: 8, desc: 'Powder coat thickness', type: 'Var', target: '60-100', utl: 100, ltl: 60, uom: 'µm', measured: [78, 82, 75, 88, 92], result: 'pass' },
  { id: 'C09', no: 9, desc: 'Coating adhesion (Cross-cut)', type: 'Att', target: 'Class ≤ 1', utl: null, ltl: null, uom: '', measured: ['0', '1', '0', '1', '0'], result: 'pass' },
];

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const passCount = characteristics.filter((c) => c.result === 'pass').length;
  const failCount = characteristics.filter((c) => c.result === 'fail').length;
  const overallStatus: 'passed' | 'failed' | 'pending' = failCount > 0 ? 'failed' : passCount === characteristics.length ? 'passed' : 'pending';

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Inspection ${id}`}
        description={`${inspection.type} · ${inspection.item} · ${inspection.itemName}`}
        breadcrumbs={[
          { label: 'Quality', href: '/app/quality' },
          { label: 'Inspections', href: '/app/quality/inspections' },
          { label: id },
        ]}
        back={
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/app/quality/inspections"><ArrowLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline" size="sm"><Printer className="size-4" /> Print</Button>
            <Button variant="outline" size="sm"><FileText className="size-4" /> Generate cert</Button>
            <Button size="sm"><Save className="size-4" /> Save</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Header</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm md:grid-cols-3">
            {[
              ['Inspection ID', inspection.id],
              ['Type', inspection.type],
              ['Item', inspection.item],
              ['Description', inspection.itemName],
              ['Lot / WO', inspection.lot],
              ['Source', inspection.source],
              ['Receipt qty', inspection.qty.toString()],
              ['Sample size', inspection.sampleSize.toString()],
              ['Date / time', inspection.date],
              ['Drawing', inspection.drawing],
              ['Specification', inspection.specification],
              ['Approver', inspection.approver],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              {overallStatus === 'passed' ? (
                <CheckCircle2 className="mx-auto size-12 text-success" />
              ) : overallStatus === 'failed' ? (
                <XCircle className="mx-auto size-12 text-destructive" />
              ) : (
                <div className="mx-auto size-12 rounded-full bg-warning/20" />
              )}
              <div className="mt-2"><StatusBadge status={overallStatus} /></div>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Inspector</span><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>{initials(inspection.inspector)}</AvatarFallback></Avatar><span className="font-medium">{inspection.inspector}</span></div></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Characteristics</span><span className="font-mono font-semibold">{characteristics.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Passed</span><span className="font-mono font-semibold text-success">{passCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Failed</span><span className="font-mono font-semibold text-destructive">{failCount}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Measurement Record</CardTitle>
          <CardDescription>{characteristics.length} characteristics, {inspection.sampleSize}-piece sample (showing first 5 readings)</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Characteristic</th>
                  <th>Type</th>
                  <th>Target</th>
                  <th className="text-right">LTL</th>
                  <th className="text-right">UTL</th>
                  <th className="text-center">Sample 1</th>
                  <th className="text-center">Sample 2</th>
                  <th className="text-center">Sample 3</th>
                  <th className="text-center">Sample 4</th>
                  <th className="text-center">Sample 5</th>
                  <th>Notes</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {characteristics.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs">{c.no}</td>
                    <td className="text-sm font-medium">{c.desc}</td>
                    <td><Badge variant="outline" size="sm">{c.type}</Badge></td>
                    <td className="font-mono text-xs">{c.target} {c.uom}</td>
                    <td className="text-right font-mono text-xs text-muted-foreground">{c.ltl ?? '—'}</td>
                    <td className="text-right font-mono text-xs text-muted-foreground">{c.utl ?? '—'}</td>
                    {c.measured.map((m, i) => (
                      <td key={i} className="text-center">
                        <Input className="h-7 w-16 text-center font-mono text-xs" defaultValue={String(m)} />
                      </td>
                    ))}
                    <td className="text-xs text-muted-foreground">{c.notes || ''}</td>
                    <td>
                      {c.result === 'pass' && <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 className="size-3" /> Pass</span>}
                      {c.result === 'fail' && <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive"><XCircle className="size-3" /> Fail</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border p-4">
            <div className="text-sm text-muted-foreground">
              Sampling plan: <span className="font-medium text-foreground">AQL 1.0 normal</span> · {inspection.sampleSize} of {inspection.qty} units
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Reject lot</Button>
              <Button variant="success" size="sm"><CheckCircle2 className="size-4" /> Accept lot</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
