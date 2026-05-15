'use client';

import { ArrowRight, CheckCircle2, Circle, FileText, Lock, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';

const periods = [
  { id: 'p3-2026', name: 'May 2026', start: '2026-05-01', end: '2026-05-31', status: 'open', progress: 67 },
  { id: 'p2-2026', name: 'April 2026', start: '2026-04-01', end: '2026-04-30', status: 'closing', progress: 92 },
  { id: 'p1-2026', name: 'March 2026', start: '2026-03-01', end: '2026-03-31', status: 'closed', progress: 100 },
  { id: 'p12-2025', name: 'December 2025', start: '2025-12-01', end: '2025-12-31', status: 'closed', progress: 100 },
  { id: 'fy-2025', name: 'FY 2025 Annual', start: '2025-01-01', end: '2025-12-31', status: 'locked', progress: 100 },
];

const closingChecklist = [
  { id: 1, task: 'Run all open recurring invoices', complete: true, owner: 'Aisha Patel', dueDate: '2026-05-28' },
  { id: 2, task: 'Receive all goods in transit', complete: true, owner: 'Jake Thompson', dueDate: '2026-05-29' },
  { id: 3, task: 'Process accrual journal entries', complete: true, owner: 'Aisha Patel', dueDate: '2026-05-30' },
  { id: 4, task: 'Bank reconciliation - all accounts', complete: true, owner: 'Aisha Patel', dueDate: '2026-05-31' },
  { id: 5, task: 'Depreciation entries auto-posted', complete: true, owner: 'System', dueDate: '2026-05-31' },
  { id: 6, task: 'Review AR aging > 90 days', complete: false, owner: 'Aisha Patel', dueDate: '2026-06-02' },
  { id: 7, task: 'Inventory variance review', complete: false, owner: 'Jake Thompson', dueDate: '2026-06-03' },
  { id: 8, task: 'Currency revaluation', complete: false, owner: 'System', dueDate: '2026-06-04' },
  { id: 9, task: 'Run trial balance', complete: false, owner: 'Aisha Patel', dueDate: '2026-06-05' },
  { id: 10, task: 'Management review meeting', complete: false, owner: 'CFO', dueDate: '2026-06-06' },
  { id: 11, task: 'Generate financial statements', complete: false, owner: 'Aisha Patel', dueDate: '2026-06-06' },
  { id: 12, task: 'Lock period', complete: false, owner: 'CFO', dueDate: '2026-06-07' },
];

const statusVariants: Record<string, any> = {
  open: 'success',
  closing: 'warning',
  closed: 'info',
  locked: 'default',
};

export default function PeriodClosePage() {
  const completedCount = closingChecklist.filter((c) => c.complete).length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Period Close" description="Track and execute the monthly accounting close process." />

      <Card>
        <CardHeader>
          <CardTitle>Period status</CardTitle>
          <CardDescription>Open, closing, and recently closed periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {periods.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-lg ${
                    p.status === 'open' ? 'bg-success/10 text-success' :
                    p.status === 'closing' ? 'bg-warning/10 text-warning' :
                    p.status === 'closed' ? 'bg-info/10 text-info' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {p.status === 'locked' ? <Lock className="size-5" /> :
                     p.status === 'closed' ? <CheckCircle2 className="size-5" /> :
                     <Circle className="size-5" />}
                  </div>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(p.start)} – {formatDate(p.end)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {p.status === 'closing' && (
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{p.progress}% complete</div>
                      <Progress value={p.progress} className="w-32 mt-1" />
                    </div>
                  )}
                  <Badge variant={statusVariants[p.status]}>{p.status}</Badge>
                  {p.status === 'closing' && (
                    <Button size="sm" variant="outline">Continue close <ArrowRight className="size-3" /></Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>April 2026 Close Checklist</CardTitle>
              <CardDescription>{completedCount} of {closingChecklist.length} tasks complete</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">{Math.round((completedCount / closingChecklist.length) * 100)}%</div>
              <div className="text-xs text-muted-foreground">complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {closingChecklist.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between gap-3 rounded-md p-3 ${
                  task.complete ? 'opacity-60' : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`grid h-6 w-6 place-items-center rounded-full ${
                    task.complete ? 'bg-success text-success-foreground' : 'border border-border'
                  }`}>
                    {task.complete && <CheckCircle2 className="size-3.5" />}
                  </div>
                  <span className={`text-sm ${task.complete ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                    {task.task}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground">{task.owner}</span>
                  <span className="text-muted-foreground">Due {formatDate(task.dueDate)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">
              <FileText className="size-4" /> Generate statements
            </Button>
            <Button>
              <Lock className="size-4" /> Lock period
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
