'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Pin,
  Search,
  Settings,
  X,
  Boxes,
} from 'lucide-react';
import {
  modules,
  modulesInPillar,
  pillarLabels,
  type AppModule,
  type ModulePillar,
} from '@/lib/modules/registry';
import { useTenant } from '@/components/providers/tenant-provider';
import { cn, initials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const SIDEBAR_GROUPS: { pillar: ModulePillar; label: string }[] = [
  { pillar: 'sales', label: 'Sales & Customers' },
  { pillar: 'crm', label: 'CRM' },
  { pillar: 'marketing', label: 'Marketing' },
  { pillar: 'hrms', label: 'People' },
  { pillar: 'inventory', label: 'Inventory' },
  { pillar: 'procurement', label: 'Procurement' },
  { pillar: 'manufacturing', label: 'Manufacturing' },
  { pillar: 'operations', label: 'Operations' },
  { pillar: 'projects', label: 'Projects' },
  { pillar: 'quality', label: 'Quality' },
  { pillar: 'assets', label: 'Assets' },
  { pillar: 'accounting', label: 'Finance' },
  { pillar: 'customer_service', label: 'Service' },
  { pillar: 'communication', label: 'Communication' },
  { pillar: 'reports', label: 'Reports' },
  { pillar: 'tools', label: 'Tools' },
];

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ collapsed = false, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { tenant, user, isSuperAdmin } = useTenant();
  const [search, setSearch] = React.useState('');
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(() => new Set(['home', 'sales', 'crm']));

  const enabledModuleCodes = React.useMemo(() => {
    if (!tenant) return new Set<string>();
    return new Set(tenant.enabled_modules);
  }, [tenant]);

  // Top-level entries that don't fit in a pillar
  const topLevel: AppModule[] = modules.filter((m) => m.pillar === 'home');

  const filteredModules = React.useCallback(
    (pillar: ModulePillar): AppModule[] => {
      const inPillar = modulesInPillar(pillar);
      const filtered = inPillar.filter((m) => enabledModuleCodes.has(m.code) || m.defaultEnabled);
      if (!search) return filtered;
      const q = search.toLowerCase();
      return filtered.filter(
        (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q),
      );
    },
    [enabledModuleCodes, search],
  );

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isActive = React.useCallback(
    (path: string) => {
      if (path === '/app') return pathname === '/app';
      return pathname === path || pathname.startsWith(`${path}/`);
    },
    [pathname],
  );

  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground',
        collapsed && 'w-16',
        className,
      )}
    >
      {/* Logo + Tenant */}
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <Link href="/app" className="flex min-w-0 items-center gap-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.name} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <Boxes className="size-5" />
            )}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{tenant?.name ?? 'Universal ERP'}</div>
              <div className="truncate text-2xs text-sidebar-foreground/60">{tenant?.industry ?? 'Workspace'}</div>
            </div>
          )}
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close sidebar" className="lg:hidden">
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-sidebar-foreground/50" />
            <Input
              placeholder="Search modules…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <nav className="flex flex-col gap-px py-2">
          {/* Top-level (Home / Inbox / Calendar) */}
          {topLevel
            .filter((m) => enabledModuleCodes.has(m.code) || m.defaultEnabled)
            .map((m) => (
              <Link
                key={m.code}
                href={m.path}
                data-active={isActive(m.path)}
                className="sidebar-item"
                title={collapsed ? m.name : undefined}
              >
                <m.icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{m.name}</span>}
              </Link>
            ))}

          {/* Pillar groups */}
          {SIDEBAR_GROUPS.map(({ pillar, label }) => {
            const groupModules = filteredModules(pillar);
            if (groupModules.length === 0) return null;
            const expanded = expandedGroups.has(pillar) || !!search;
            return (
              <div key={pillar} className="mt-2">
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(pillar)}
                    className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/80"
                  >
                    {expanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                    <span>{label}</span>
                  </button>
                )}
                {expanded &&
                  groupModules.map((m) => (
                    <Link
                      key={m.code}
                      href={m.path}
                      data-active={isActive(m.path)}
                      className="sidebar-item"
                      title={collapsed ? m.name : undefined}
                    >
                      <m.icon className="size-4 shrink-0" />
                      {!collapsed && <span className="truncate">{m.name}</span>}
                      {!collapsed && m.status !== 'stable' && (
                        <span className="ml-auto rounded bg-warning/10 px-1 py-0.5 text-2xs text-warning">
                          {m.status}
                        </span>
                      )}
                    </Link>
                  ))}
              </div>
            );
          })}

          {/* Platform (super admin only) */}
          {isSuperAdmin && (
            <div className="mt-4">
              {!collapsed && (
                <div className="px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  Platform
                </div>
              )}
              {modulesInPillar('platform').map((m) => (
                <Link
                  key={m.code}
                  href={m.path}
                  data-active={isActive(m.path)}
                  className="sidebar-item"
                  title={collapsed ? m.name : undefined}
                >
                  <m.icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{m.name}</span>}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <Link
          href="/app/settings"
          className="sidebar-item"
          data-active={isActive('/app/settings')}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="size-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        {!collapsed && user && (
          <div className="mt-2 flex items-center gap-2 rounded-md p-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {initials(user.full_name ?? user.email)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">{user.full_name ?? user.email}</div>
              <div className="truncate text-2xs text-sidebar-foreground/60">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
