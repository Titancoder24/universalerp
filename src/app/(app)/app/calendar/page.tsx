'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Plus, CalendarDays, List, Grid3x3 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  date: number; // day of month
  type: 'meeting' | 'task' | 'leave' | 'maintenance' | 'deadline' | 'interview';
  time?: string;
  attendees?: number;
}

const eventTypeStyles = {
  meeting: 'bg-primary/15 text-primary border-primary/30',
  task: 'bg-info/15 text-info border-info/30',
  leave: 'bg-warning/15 text-warning border-warning/30',
  maintenance: 'bg-destructive/15 text-destructive border-destructive/30',
  deadline: 'bg-success/15 text-success border-success/30',
  interview: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
};

const events: CalendarEvent[] = [
  { id: '1', title: 'Sales standup', date: 13, type: 'meeting', time: '9:00 AM', attendees: 8 },
  { id: '2', title: 'Q3 board review', date: 14, type: 'meeting', time: '2:00 PM', attendees: 6 },
  { id: '3', title: 'Marcus on PTO', date: 15, type: 'leave' },
  { id: '4', title: 'Line 3 PM', date: 15, type: 'maintenance', time: '6:00 AM' },
  { id: '5', title: 'Senior Engineer interview', date: 16, type: 'interview', time: '11:00 AM' },
  { id: '6', title: 'Invoice deadline INV-2089', date: 18, type: 'deadline' },
  { id: '7', title: 'All-hands meeting', date: 20, type: 'meeting', time: '4:00 PM', attendees: 142 },
  { id: '8', title: 'Aisha on PTO', date: 22, type: 'leave' },
  { id: '9', title: 'Aisha on PTO', date: 23, type: 'leave' },
  { id: '10', title: 'Aisha on PTO', date: 24, type: 'leave' },
  { id: '11', title: 'Contract renewal TechCorp', date: 25, type: 'deadline' },
  { id: '12', title: 'Monthly close', date: 28, type: 'task' },
  { id: '13', title: 'Customer review call', date: 29, type: 'meeting', time: '3:00 PM', attendees: 4 },
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [view, setView] = React.useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Calendar"
        description="Unified view of meetings, tasks, leave, deadlines, and more across every module."
        actions={
          <>
            <Button variant="outline">
              <CalendarDays className="size-4" /> Today
            </Button>
            <Button>
              <Plus className="size-4" /> New event
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={() => setCurrentMonth((m) => m - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <CardTitle className="min-w-48 text-center">{monthName}</CardTitle>
            <Button variant="outline" size="icon-sm" onClick={() => setCurrentMonth((m) => m + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden gap-1 lg:flex flex-wrap">
              {Object.entries(eventTypeStyles).map(([type, style]) => (
                <span key={type} className={`text-2xs px-1.5 py-0.5 rounded border ${style}`}>
                  {type}
                </span>
              ))}
            </div>
            <div className="flex rounded-md border border-border p-0.5">
              {(['month', 'week', 'day', 'agenda'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn(
                    'rounded px-2.5 py-1 text-xs font-medium capitalize',
                    view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Calendar grid */}
          <div className="grid grid-cols-7 border-t border-border">
            {DAY_LABELS.map((day) => (
              <div key={day} className="border-b border-r border-border bg-muted/30 px-3 py-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="border-b border-r border-border bg-muted/10" style={{ minHeight: '110px' }} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const dayEvents = events.filter((e) => e.date === day);
              return (
                <div
                  key={day}
                  className={cn(
                    'border-b border-r border-border bg-card p-1.5 hover:bg-muted/30 transition-colors cursor-pointer',
                    'flex flex-col gap-1',
                  )}
                  style={{ minHeight: '110px' }}
                >
                  <div
                    className={cn(
                      'text-xs font-medium',
                      isToday ? 'grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          'truncate rounded px-1.5 py-0.5 text-2xs border',
                          eventTypeStyles[event.type],
                        )}
                      >
                        {event.time && <span className="mr-1 opacity-70">{event.time}</span>}
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-2xs text-muted-foreground pl-1.5">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
