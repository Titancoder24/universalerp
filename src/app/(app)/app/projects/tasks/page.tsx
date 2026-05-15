'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  CheckCircle2,
  CircleDot,
  Filter,
  KanbanSquare,
  LayoutList,
  ListChecks,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate, initials, cn } from '@/lib/utils';

type Priority = 'low' | 'medium' | 'high' | 'urgent';
type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

interface Task {
  id: string;
  code: string;
  title: string;
  project: string;
  assignee: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  tags: string[];
}

const tasks: Task[] = [
  { id: 't1', code: 'T-1024', title: 'Design new dashboard layout', project: 'ERP Migration', assignee: 'Sarah Chen', status: 'in_progress', priority: 'high', dueDate: '2026-05-20', tags: ['design', 'frontend'] },
  { id: 't2', code: 'T-1025', title: 'API rate limiting middleware', project: 'ERP Migration', assignee: 'David Kumar', status: 'in_progress', priority: 'medium', dueDate: '2026-05-22', tags: ['backend'] },
  { id: 't3', code: 'T-1026', title: 'User acceptance testing — Phase 2', project: 'Acme Custom Integration', assignee: 'James Liu', status: 'review', priority: 'urgent', dueDate: '2026-05-18', tags: ['qa'] },
  { id: 't4', code: 'T-1027', title: 'Q3 brand refresh moodboard', project: 'Q3 Marketing', assignee: 'Emily Rodriguez', status: 'todo', priority: 'low', dueDate: '2026-06-02', tags: ['design'] },
  { id: 't5', code: 'T-1028', title: 'Update vendor catalog', project: 'Plant Capacity Upgrade', assignee: 'Marcus Reid', status: 'done', priority: 'medium', dueDate: '2026-05-12', tags: ['ops'] },
  { id: 't6', code: 'T-1029', title: 'Prototype safety mechanism', project: 'New Product Launch', assignee: 'James Liu', status: 'in_progress', priority: 'high', dueDate: '2026-05-25', tags: ['r&d'] },
  { id: 't7', code: 'T-1030', title: 'Migrate legacy customer records', project: 'ERP Migration', assignee: 'Sarah Chen', status: 'backlog', priority: 'medium', dueDate: '2026-06-15', tags: ['data'] },
  { id: 't8', code: 'T-1031', title: 'Onboard 3 new contractors', project: 'Global Mfg Implementation', assignee: 'Marcus Reid', status: 'todo', priority: 'medium', dueDate: '2026-05-28', tags: ['hr'] },
  { id: 't9', code: 'T-1032', title: 'Configure SSO for client portal', project: 'Hospital Network', assignee: 'David Kumar', status: 'backlog', priority: 'high', dueDate: '2026-06-10', tags: ['security'] },
  { id: 't10', code: 'T-1033', title: 'Final design review', project: 'New Product Launch', assignee: 'Emily Rodriguez', status: 'review', priority: 'high', dueDate: '2026-05-19', tags: ['design', 'r&d'] },
  { id: 't11', code: 'T-1034', title: 'Weekly status report', project: 'ERP Migration', assignee: 'James Liu', status: 'done', priority: 'low', dueDate: '2026-05-14', tags: ['reporting'] },
  { id: 't12', code: 'T-1035', title: 'Inventory count reconciliation', project: 'Plant Capacity Upgrade', assignee: 'Marcus Reid', status: 'todo', priority: 'medium', dueDate: '2026-05-30', tags: ['ops'] },
];

const columns: { id: TaskStatus; label: string; tone: string; icon: typeof CircleDot }[] = [
  { id: 'backlog', label: 'Backlog', tone: 'bg-muted text-muted-foreground', icon: CircleDot },
  { id: 'todo', label: 'To Do', tone: 'bg-info/10 text-info', icon: CircleDot },
  { id: 'in_progress', label: 'In Progress', tone: 'bg-primary/10 text-primary', icon: Loader2 },
  { id: 'review', label: 'In Review', tone: 'bg-warning/10 text-warning', icon: ListChecks },
  { id: 'done', label: 'Done', tone: 'bg-success/10 text-success', icon: CheckCircle2 },
];

const priorityIcons: Record<Priority, { icon: typeof ArrowUp; color: string }> = {
  urgent: { icon: AlertCircle, color: 'text-destructive' },
  high: { icon: ArrowUp, color: 'text-warning' },
  medium: { icon: ArrowRight, color: 'text-muted-foreground' },
  low: { icon: ArrowDown, color: 'text-muted-foreground/60' },
};

export default function TasksPage() {
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [search, setSearch] = useState('');

  const filtered = tasks.filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Tasks"
        description="Cross-project task list and kanban board."
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Projects', href: '/app/projects' },
          { label: 'Tasks' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="size-4" /> Filter
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New task
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" className="pl-8" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted-foreground">{tasks.filter(t => t.status === 'in_progress').length} in progress</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{tasks.filter(t => t.status === 'done').length} done</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{tasks.length} total</span>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'kanban')}>
            <TabsList variant="pills">
              <TabsTrigger variant="pills" value="list"><LayoutList className="size-4" /></TabsTrigger>
              <TabsTrigger variant="pills" value="kanban"><KanbanSquare className="size-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-5 gap-3 overflow-x-auto pb-2">
          {columns.map((col) => {
            const items = filtered.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="min-w-[260px]">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <col.icon className={cn('size-4', col.tone)} />
                    <span className="font-medium text-sm">{col.label}</span>
                    <Badge variant="outline" size="sm">{items.length}</Badge>
                  </div>
                  <Button variant="ghost" size="icon-xs">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {items.map((t) => {
                    const Priority = priorityIcons[t.priority];
                    return (
                      <Card key={t.id} className="cursor-pointer p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{t.title}</p>
                          <Priority.icon className={cn('size-3.5 shrink-0', Priority.color)} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{t.project}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {t.tags.map((tag) => (
                            <Badge key={tag} variant="soft" size="sm" className="text-2xs">{tag}</Badge>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                          <div className="flex items-center gap-1.5">
                            <Avatar size="xs">
                              <AvatarFallback name={t.assignee}>{initials(t.assignee)}</AvatarFallback>
                            </Avatar>
                            <span className="font-mono text-2xs text-muted-foreground">{t.code}</span>
                          </div>
                          <span className="text-2xs text-muted-foreground">{formatDate(t.dueDate)}</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="erp-table">
              <thead>
                <tr>
                  <th className="w-8"><Checkbox /></th>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due date</th>
                  <th>Tags</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const Priority = priorityIcons[t.priority];
                  return (
                    <tr key={t.id}>
                      <td><Checkbox /></td>
                      <td>
                        <p className="font-medium">{t.title}</p>
                        <p className="text-xs font-mono text-muted-foreground">{t.code}</p>
                      </td>
                      <td className="text-xs text-muted-foreground">{t.project}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Avatar size="xs">
                            <AvatarFallback name={t.assignee}>{initials(t.assignee)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{t.assignee}</span>
                        </div>
                      </td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>
                        <span className={cn('inline-flex items-center gap-1 capitalize text-xs', Priority.color)}>
                          <Priority.icon className="size-3.5" />
                          {t.priority}
                        </span>
                      </td>
                      <td className="text-xs text-muted-foreground">{formatDate(t.dueDate)}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {t.tags.map((tag) => (
                            <Badge key={tag} variant="outline" size="sm" className="text-2xs">{tag}</Badge>
                          ))}
                        </div>
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Log time</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="size-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
