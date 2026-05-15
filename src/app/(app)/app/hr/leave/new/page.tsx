'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, Info, Paperclip, Sparkles, Upload, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/ui/page-header';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials } from '@/lib/utils';

const leaveTypes = [
  { value: 'vacation', label: 'Vacation', balance: 16, total: 20 },
  { value: 'sick', label: 'Sick', balance: 9, total: 10 },
  { value: 'personal', label: 'Personal', balance: 5, total: 5 },
  { value: 'volunteer', label: 'Volunteer', balance: 2, total: 2 },
  { value: 'unpaid', label: 'Unpaid leave', balance: null, total: null },
  { value: 'parental', label: 'Parental leave', balance: 65, total: 90 },
];

export default function NewLeavePage() {
  const [type, setType] = React.useState('vacation');
  const [from, setFrom] = React.useState('2026-05-22');
  const [to, setTo] = React.useState('2026-05-29');
  const [halfDay, setHalfDay] = React.useState(false);

  const days = React.useMemo(() => {
    const a = new Date(from);
    const b = new Date(to);
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
    const diff = Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000)) + 1;
    return halfDay ? 0.5 : diff;
  }, [from, to, halfDay]);

  const selected = leaveTypes.find((l) => l.value === type)!;
  const after = selected.balance !== null ? selected.balance - days : null;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Apply for leave"
        description="Submit a time-off request to your manager for approval"
        breadcrumbs={[
          { label: 'People', href: '/app/hr' },
          { label: 'Leave', href: '/app/hr/leave' },
          { label: 'New request' },
        ]}
        back={
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/app/hr/leave"><ChevronLeft className="size-4" /></Link>
          </Button>
        }
        actions={
          <>
            <Button variant="outline">Save draft</Button>
            <Button>Submit request</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request details</CardTitle>
              <CardDescription>Tell us about your time off</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="type">Leave type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{l.label}</span>
                          {l.balance !== null && (
                            <span className="text-xs text-muted-foreground">{l.balance}/{l.total} days left</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="from">From</Label>
                <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="to">To</Label>
                <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1.5" />
              </div>

              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={halfDay}
                    onChange={(e) => setHalfDay(e.target.checked)}
                    className="size-4 rounded border-input accent-primary"
                  />
                  Half day request
                </label>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  rows={4}
                  placeholder="Briefly describe the reason for your leave..."
                  className="mt-1.5"
                  defaultValue="Family trip to Hawaii. Will have intermittent email access for emergencies only."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="cover">Covering colleague</Label>
                <Select defaultValue="aisha">
                  <SelectTrigger id="cover" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aisha">Aisha Khan · Engineering Director</SelectItem>
                    <SelectItem value="david">David Kim · Backend Engineer</SelectItem>
                    <SelectItem value="carlos">Carlos Mendes · Frontend Engineer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1.5 text-xs text-muted-foreground">They will be notified to handle urgent items.</p>
              </div>

              <div className="md:col-span-2">
                <Label>Supporting document (optional)</Label>
                <div className="mt-1.5 flex items-center justify-center rounded-lg border-2 border-dashed border-input p-6 text-center transition-colors hover:bg-muted/30">
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload className="size-5 text-muted-foreground" />
                    <div className="text-sm font-medium">Drop a file or click to upload</div>
                    <div className="text-xs text-muted-foreground">e.g. doctor's note, conference ticket · PDF, JPG up to 10 MB</div>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Paperclip className="size-3.5" /> Choose file
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="size-4 text-primary" /> AI suggestions
              </CardTitle>
              <CardDescription>Smart hints based on your calendar and team coverage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-start gap-3 rounded-lg border border-info/30 bg-info/5 p-3 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-info" />
                <div>
                  <div className="font-medium">May 25 is a public holiday (Memorial Day)</div>
                  <div className="text-xs text-muted-foreground">Extending by 1 day gives you a 9-day break for only 4 vacation days used.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-success" />
                <div>
                  <div className="font-medium">Team coverage looks healthy</div>
                  <div className="text-xs text-muted-foreground">Only 1 other person in Engineering is out during this window.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-warning" />
                <div>
                  <div className="font-medium">Heads up — sprint demo scheduled</div>
                  <div className="text-xs text-muted-foreground">Sprint review is on May 24 (Sun). You'll miss it; consider reassigning your demo.</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border bg-primary/5 p-4">
                <div className="text-xs text-muted-foreground">Days requested</div>
                <div className="text-3xl font-semibold tabular-nums">{days}</div>
                <div className="text-xs text-muted-foreground">{selected.label} · {from} → {to}</div>
              </div>
              {selected.balance !== null && (
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Balance after this request</span>
                    <span className="font-medium tabular-nums">{after}/{selected.total}</span>
                  </div>
                  <Progress value={after !== null ? ((after) / (selected.total ?? 1)) * 100 : 0} />
                </div>
              )}
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Approver</span>
                  <div className="flex items-center gap-1.5">
                    <Avatar size="xs">
                      <AvatarFallback name="Aisha Khan">{initials('Aisha Khan')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">Aisha Khan</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="soft">Draft</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">SLA</span>
                  <span>2 business days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4" /> Who else is out
              </CardTitle>
              <CardDescription>During your selected dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: 'Carlos Mendes', range: 'May 22 – Jun 1' },
                { name: 'Emma Thompson', range: 'May 24' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-sm">
                  <Avatar size="xs">
                    <AvatarFallback name={p.name}>{initials(p.name)}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.range}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="size-4" /> Public holidays
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">May 25</span><span>Memorial Day</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Jun 19</span><span>Juneteenth</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
