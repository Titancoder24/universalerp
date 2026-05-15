'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Flag,
  Link2,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Play,
  Plus,
  Send,
  Trash2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatRelativeTime, initials, formatDate, cn } from '@/lib/utils';

const task = {
  id: 'TASK-4421',
  title: 'Implement OAuth 2.0 flow for vendor API integration',
  status: 'in_progress',
  priority: 'high',
  project: 'Vendor Portal v2',
  assignee: { name: 'Dmitri Volkov', role: 'Senior Engineer' },
  reporter: { name: 'Sarah Chen' },
  dueDate: '2026-05-22',
  estimate: 16,
  logged: 9.5,
  description: 'Integrate OAuth 2.0 with the vendor portal API. Support refresh tokens, scoped permissions, and provide fallback to API key auth for legacy integrations.\n\nSee technical spec in Confluence. Coordinate with infra team for callback URL whitelisting.',
};

const subtasks = [
  { id: 's1', title: 'Set up OAuth provider client credentials', done: true },
  { id: 's2', title: 'Implement authorization code flow', done: true },
  { id: 's3', title: 'Add refresh token rotation', done: false },
  { id: 's4', title: 'Write integration tests for OAuth flow', done: false },
  { id: 's5', title: 'Document migration path for API key users', done: false },
];

const comments = [
  { id: 'c1', user: 'Sarah Chen', text: 'Need to make sure this complies with the new SOC2 requirements. Loop in @security if needed.', time: '2026-05-12T14:00:00Z' },
  { id: 'c2', user: 'Dmitri Volkov', text: 'Started on auth flow. Should have a working POC by EOD tomorrow. Worth noting we may want to also support PKCE for SPA clients.', time: '2026-05-13T09:30:00Z' },
  { id: 'c3', user: 'Lena Park', text: 'PKCE is a must for SPA. Also can we revisit the scope granularity? `read:all` is too broad for our threat model.', time: '2026-05-13T11:14:00Z' },
];

const attachments = [
  { id: 'a1', name: 'oauth-spec-v2.pdf', size: '1.2 MB' },
  { id: 'a2', name: 'vendor-api-flow.fig', size: '480 KB' },
  { id: 'a3', name: 'security-review.docx', size: '240 KB' },
];

const timelog = [
  { id: 't1', user: 'Dmitri Volkov', hours: 3.5, date: '2026-05-13', note: 'Initial client setup and auth code flow' },
  { id: 't2', user: 'Dmitri Volkov', hours: 4, date: '2026-05-14', note: 'Refresh token rotation implementation' },
  { id: 't3', user: 'Dmitri Volkov', hours: 2, date: '2026-05-15', note: 'PKCE support, scope review' },
];

export default function TaskDetailPage() {
  const [title, setTitle] = React.useState(task.title);
  const [items, setItems] = React.useState(subtasks);
  const completed = items.filter((s) => s.done).length;

  const toggle = (id: string) => setItems((p) => p.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));

  return (
    <div className="flex flex-col">
      <PageHeader
        title={<span className="font-mono text-sm">{task.id}</span>}
        breadcrumbs={[{ label: 'Projects', href: '/app/projects' }, { label: task.project, href: '/app/projects' }, { label: 'Tasks', href: '/app/projects/tasks' }, { label: task.id }]}
        back={<Button variant="ghost" size="icon-sm" asChild><Link href="/app/projects/tasks"><ChevronLeft className="size-4" /></Link></Button>}
        actions={
          <>
            <Button variant="outline" size="sm"><Play className="size-4" /> Start timer</Button>
            <Button size="sm"><Check className="size-4" /> Mark complete</Button>
            <Button variant="outline" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="border-0 px-0 text-2xl font-semibold focus-visible:ring-0" />
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={task.status} />
                <Badge variant="outline" className="gap-1"><Flag className="size-3 text-destructive" /> {task.priority}</Badge>
                <Badge variant="outline">{task.project}</Badge>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
                <Textarea defaultValue={task.description} minRows={5} className="mt-1.5" autoGrow />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Subtasks <span className="ml-2 text-sm font-normal text-muted-foreground">{completed}/{items.length}</span></CardTitle>
              <Button variant="outline" size="sm"><Plus className="size-4" /> Add subtask</Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {items.map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-accent/30">
                  <Checkbox checked={s.done} onCheckedChange={() => toggle(s.id)} />
                  <span className={cn('flex-1 text-sm', s.done && 'text-muted-foreground line-through')}>{s.title}</span>
                  <Button variant="ghost" size="icon-sm"><Trash2 className="size-3.5" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="size-4" /> Comments ({comments.length})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar size="sm"><AvatarFallback>{initials(c.user)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2"><p className="text-sm font-medium">{c.user}</p><p className="text-xs text-muted-foreground">{formatRelativeTime(c.time)}</p></div>
                    <p className="mt-1 text-sm text-foreground">{c.text}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex gap-2">
                <Avatar size="sm"><AvatarFallback>YO</AvatarFallback></Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea placeholder="Write a comment… use @ to mention" minRows={2} />
                  <Button size="sm"><Send className="size-4" /> Comment</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Clock className="size-4" /> Time logs</CardTitle><Button variant="outline" size="sm"><Plus className="size-4" /> Log time</Button></CardHeader>
            <CardContent className="space-y-2">
              {timelog.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div><p className="font-medium">{t.user} - {t.hours}h</p><p className="text-xs text-muted-foreground">{t.note}</p></div>
                  <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                </div>
              ))}
              <div className="flex justify-between rounded-md bg-muted/30 px-3 py-2 text-sm">
                <span className="font-medium">Total logged</span>
                <span className="font-mono tabular-nums font-medium">{task.logged}h / {task.estimate}h</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Properties</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-muted-foreground"><User className="size-3.5" />Assignee</span><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>{initials(task.assignee.name)}</AvatarFallback></Avatar><span className="font-medium">{task.assignee.name}</span></div></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-muted-foreground"><User className="size-3.5" />Reporter</span><div className="flex items-center gap-1.5"><Avatar size="xs"><AvatarFallback>{initials(task.reporter.name)}</AvatarFallback></Avatar><span className="font-medium">{task.reporter.name}</span></div></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="size-3.5" />Due date</span><span className="font-medium">{formatDate(task.dueDate)}</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="size-3.5" />Estimate</span><span className="font-mono">{task.estimate}h</span></div>
              <Separator />
              <div className="space-y-1.5"><Label className="text-xs">Status</Label><Select defaultValue={task.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="review">In review</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Priority</Label><Select defaultValue="high"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Paperclip className="size-4" /> Attachments</CardTitle><Button variant="ghost" size="icon-sm"><Plus className="size-4" /></Button></CardHeader>
            <CardContent className="space-y-1.5">
              {attachments.map((a) => (<div key={a.id} className="flex items-center justify-between rounded-md p-2 text-xs hover:bg-accent/30"><div><p className="font-medium truncate">{a.name}</p><p className="text-muted-foreground">{a.size}</p></div></div>))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Link2 className="size-4" /> Related</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <Link href="#" className="block rounded-md p-2 hover:bg-accent/30"><p className="font-mono text-xs text-primary">EPIC-12</p><p className="text-xs">Vendor portal redesign</p></Link>
              <Link href="#" className="block rounded-md p-2 hover:bg-accent/30"><p className="font-mono text-xs text-primary">TASK-4385</p><p className="text-xs">Refresh token strategy spec</p></Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

