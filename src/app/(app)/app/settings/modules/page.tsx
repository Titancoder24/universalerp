'use client';

import * as React from 'react';
import { Save, Search } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { modules, pillarLabels, type ModulePillar } from '@/lib/modules/registry';
import { useTenant } from '@/components/providers/tenant-provider';

export default function SettingsModulesPage() {
  const { tenant } = useTenant();
  const [search, setSearch] = React.useState('');
  const [enabledModules, setEnabledModules] = React.useState<Set<string>>(
    () => new Set(tenant?.enabled_modules ?? []),
  );

  const filtered = modules.filter(
    (m) =>
      m.pillar !== 'platform' && (
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase())
      ),
  );

  const byPillar = filtered.reduce(
    (acc, m) => {
      (acc[m.pillar] ||= []).push(m);
      return acc;
    },
    {} as Record<ModulePillar, typeof modules>,
  );

  const toggle = (code: string) => {
    setEnabledModules((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Modules"
        description={`Enable or disable modules for your workspace. ${enabledModules.size} of ${modules.filter(m => m.pillar !== 'platform').length} modules enabled.`}
        actions={<Button><Save className="size-4" /> Save changes</Button>}
      />

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input placeholder="Search modules…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(byPillar).map(([pillar, items]) => (
            <div key={pillar}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {pillarLabels[pillar as ModulePillar]} · {items.filter((m) => enabledModules.has(m.code)).length} / {items.length}
              </h3>
              <div className="space-y-1">
                {items.map((m) => (
                  <label
                    key={m.code}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <m.icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{m.name}</span>
                          {m.status !== 'stable' && (
                            <Badge variant={m.status === 'beta' ? 'warning' : 'info'} className="text-2xs">
                              {m.status}
                            </Badge>
                          )}
                          {m.defaultEnabled && (
                            <Badge variant="outline" className="text-2xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{m.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={enabledModules.has(m.code)}
                      onCheckedChange={() => toggle(m.code)}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
