'use client';

import {
  CheckCircle2,
  Clock,
  Filter,
  Mail,
  Pause,
  Play,
  Plus,
  Power,
  Settings,
  Sparkles,
  UserCheck,
  Webhook,
  Workflow as WorkflowIcon,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { formatRelativeTime, initials } from '@/lib/utils';

const workflows = [
  {
    id: 1,
    name: 'New lead → Slack alert + assign SDR',
    description: 'When a form submission creates a lead, post to #sales and round-robin assign.',
    enabled: true,
    runs: 1247,
    lastRun: new Date(Date.now() - 1000 * 60 * 5),
    successRate: 99.2,
    triggers: ['Lead created'],
    actions: ['Slack notification', 'Assign SDR', 'Schedule first touch'],
  },
  {
    id: 2,
    name: 'Quote viewed → Sales rep notification',
    description: 'When a customer views a quote in the portal, alert the rep instantly.',
    enabled: true,
    runs: 892,
    lastRun: new Date(Date.now() - 1000 * 60 * 30),
    successRate: 100,
    triggers: ['Quote viewed in portal'],
    actions: ['Send push notification', 'Log activity'],
  },
  {
    id: 3,
    name: 'Invoice overdue → Reminder draft',
    description: 'Draft a polite reminder for AP review when invoice goes 7 days overdue.',
    enabled: true,
    runs: 156,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 3),
    successRate: 98.7,
    triggers: ['Invoice age > 7 days', 'Status = sent'],
    actions: ['AI draft reminder', 'Notify accountant'],
  },
  {
    id: 4,
    name: 'Low stock → Auto-create PO',
    description: 'Below reorder point + preferred vendor set → draft a PO for approval.',
    enabled: true,
    runs: 78,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 8),
    successRate: 96.2,
    triggers: ['Stock level < reorder point'],
    actions: ['Create draft PO', 'Route for approval'],
  },
  {
    id: 5,
    name: 'New hire → Onboarding checklist',
    description: 'When an employee is created, kick off the onboarding flow with day-1 tasks.',
    enabled: true,
    runs: 23,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24),
    successRate: 100,
    triggers: ['Employee created'],
    actions: ['Create onboarding checklist', 'Assign buddy', 'Provision accounts'],
  },
  {
    id: 6,
    name: 'Customer churn signal → Account team alert',
    description: 'AI detects churn risk based on usage drop and ticket sentiment.',
    enabled: false,
    runs: 47,
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    successRate: 91.5,
    triggers: ['AI: high churn score'],
    actions: ['Slack #at-risk', 'Create task for CSM'],
  },
];

const triggers = [
  { icon: WorkflowIcon, label: 'Record created/updated/deleted' },
  { icon: Clock, label: 'Schedule (daily/weekly/monthly)' },
  { icon: Webhook, label: 'Webhook from external system' },
  { icon: Mail, label: 'Email received' },
  { icon: UserCheck, label: 'Manual approval' },
  { icon: Sparkles, label: 'AI prediction threshold' },
];

const actions = [
  { icon: Mail, label: 'Send email' },
  { icon: WorkflowIcon, label: 'Create/update record' },
  { icon: UserCheck, label: 'Route for approval' },
  { icon: Sparkles, label: 'AI: draft / score / extract' },
  { icon: Webhook, label: 'Call webhook' },
  { icon: Power, label: 'Conditional branch' },
];

export default function WorkflowPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Workflows"
        description="Approval chains and automations that route work, notify stakeholders, and act on data."
        actions={
          <>
            <Button variant="outline">
              <Filter className="size-4" /> Filter
            </Button>
            <Button>
              <Plus className="size-4" /> New workflow
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Active workflows', value: workflows.filter((w) => w.enabled).length, icon: Zap },
          { label: 'Runs this month', value: '12,490', icon: Play },
          { label: 'Success rate', value: '98.4%', icon: CheckCircle2 },
          { label: 'Time saved', value: '142h', icon: Clock },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary mb-3">
                <s.icon className="size-4" />
              </div>
              <div className="text-2xl font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow list */}
      <div className="space-y-2">
        {workflows.map((w) => (
          <Card key={w.id} className={!w.enabled ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <WorkflowIcon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{w.name}</h3>
                      {!w.enabled && <Badge variant="outline" className="text-2xs">Disabled</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{w.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {w.triggers.map((t) => (
                        <Badge key={t} variant="soft" className="text-2xs gap-1">
                          <Clock className="size-2.5" /> {t}
                        </Badge>
                      ))}
                      {w.actions.map((a) => (
                        <Badge key={a} variant="outline" className="text-2xs gap-1">
                          <Zap className="size-2.5" /> {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Last run</div>
                    <div className="text-sm font-medium">{formatRelativeTime(w.lastRun)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Success rate</div>
                    <div className={`text-sm font-medium ${w.successRate > 98 ? 'text-success' : 'text-warning'}`}>
                      {w.successRate}%
                    </div>
                  </div>
                  <Switch defaultChecked={w.enabled} />
                  <Button variant="ghost" size="icon-sm"><Settings className="size-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Library */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Triggers</CardTitle>
            <CardDescription>What kicks off a workflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {triggers.map((t) => (
              <div key={t.label} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/40 transition-colors">
                <t.icon className="size-4 text-primary" />
                <span className="text-sm">{t.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>What workflows can do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {actions.map((a) => (
              <div key={a.label} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/40 transition-colors">
                <a.icon className="size-4 text-primary" />
                <span className="text-sm">{a.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
