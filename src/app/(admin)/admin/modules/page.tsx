'use client';

import * as React from 'react';
import { Filter, Search, Settings } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { modules, pillarLabels, type ModulePillar } from '@/lib/modules/registry';

export default function AdminModulesPage() {
  const [search, setSearch] = React.useState('');

  const filtered = modules.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()),
  );

  const byPillar = filtered.reduce(
    (acc, m) => {
      (acc[m.pillar] ||= []).push(m);
      return acc;
    },
    {} as Record<ModulePillar, typeof modules>,
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Modules Registry"
        description={`Every module available in the platform. ${modules.length} total modules across ${Object.keys(pillarLabels).length} pillars.`}
      />

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Search modules…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(byPillar).map(([pillar, items]) => (
            <div key={pillar}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {pillarLabels[pillar as ModulePillar]} · {items.length}
              </h3>
              <div className="space-y-1">
                {items.map((m) => (
                  <div
                    key={m.code}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <m.icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{m.name}</span>
                          <span className="font-mono text-2xs text-muted-foreground">{m.code}</span>
                          {m.status !== 'stable' && (
                            <Badge variant={m.status === 'beta' ? 'warning' : 'info'} className="text-2xs">
                              {m.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
