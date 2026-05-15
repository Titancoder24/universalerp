'use client';

import { Calendar, ChevronRight, Clock, Target, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDate, initials, colorFromString } from '@/lib/utils';

const projects = [
  {
    id: 'proj-1',
    name: 'ERP Implementation Phase 1',
    description: 'Rollout to North America operations',
    status: 'on_track',
    progress: 68,
    startDate: '2026-02-15',
    endDate: '2026-08-30',
    nextMilestone: 'Phase 1 UAT Sign-off',
    nextMilestoneDate: '2026-05-25',
    team: ['Sarah Chen', 'Marcus Rodriguez', 'Liu Wei', 'Tom Becker'],
  },
  {
    id: 'proj-2',
    name: 'Custom Integration with SAP',
    description: 'Data sync from legacy systems',
    status: 'at_risk',
    progress: 35,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    nextMilestone: 'API contract review',
    nextMilestoneDate: '2026-05-20',
    team: ['Marcus Rodriguez', 'Liu Wei'],
  },
  {
    id: 'proj-3',
    name: 'Q3 Hardware Refresh',
    description: 'Replacing 50 workstations + servers',
    status: 'planning',
    progress: 12,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    nextMilestone: 'Final hardware specs',
    nextMilestoneDate: '2026-06-10',
    team: ['Tom Becker'],
  },
];

const statusColors: Record<string, string> = {
  on_track: 'bg-success/10 text-success border-success/30',
  at_risk: 'bg-warning/10 text-warning border-warning/30',
  off_track: 'bg-destructive/10 text-destructive border-destructive/30',
  planning: 'bg-info/10 text-info border-info/30',
  completed: 'bg-muted text-muted-foreground border-border',
};

export default function PortalProjectsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Projects</h1>
        <p className="text-muted-foreground">Active engagements with Acme Corp</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id} className="group cursor-pointer transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold group-hover:text-primary">{p.name}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{p.description}</p>
                </div>
                <Badge className={statusColors[p.status]}>{p.status.replace('_', ' ')}</Badge>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{p.progress}%</span>
                </div>
                <Progress value={p.progress} />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Start:</span>
                  <span>{formatDate(p.startDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Target className="size-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">End:</span>
                  <span>{formatDate(p.endDate)}</span>
                </div>
              </div>

              {/* Next milestone */}
              <div className="mt-4 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                <div className="text-muted-foreground">Next milestone</div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="font-medium">{p.nextMilestone}</span>
                  <span className="font-mono text-muted-foreground">{formatDate(p.nextMilestoneDate)}</span>
                </div>
              </div>

              {/* Team */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {p.team.slice(0, 4).map((name) => (
                      <Avatar key={name} size="xs" className="border-2 border-card">
                        <AvatarFallback style={{ backgroundColor: colorFromString(name) }} className="text-2xs text-white">
                          {initials(name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
