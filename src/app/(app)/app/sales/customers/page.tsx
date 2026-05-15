'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowDownUp,
  ArrowUpDown,
  Download,
  Filter,
  Globe2,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { customers, type CustomerStatus } from '../_data';
import { formatCurrency, formatDate, initials } from '@/lib/utils';

type SortKey = 'name' | 'revenue' | 'outstanding' | 'lastOrder';
type SortDir = 'asc' | 'desc';

const statusOptions: { label: string; value: CustomerStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
];

const reps = Array.from(new Set(customers.map((c) => c.salesRep))).sort();
const industries = Array.from(new Set(customers.map((c) => c.industry))).sort();
const countries = Array.from(new Set(customers.map((c) => c.country))).sort();

export default function CustomersPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilters, setStatusFilters] = React.useState<Set<CustomerStatus>>(new Set());
  const [repFilters, setRepFilters] = React.useState<Set<string>>(new Set());
  const [industryFilters, setIndustryFilters] = React.useState<Set<string>>(new Set());
  const [countryFilters, setCountryFilters] = React.useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = React.useState<SortKey>('revenue');
  const [sortDir, setSortDir] = React.useState<SortDir>('desc');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggleSet = <T,>(set: Set<T>, val: T): Set<T> => {
    const n = new Set(set);
    if (n.has(val)) n.delete(val);
    else n.add(val);
    return n;
  };

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers
      .filter((c) => {
        if (q && !c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
        if (statusFilters.size > 0 && !statusFilters.has(c.status)) return false;
        if (repFilters.size > 0 && !repFilters.has(c.salesRep)) return false;
        if (industryFilters.size > 0 && !industryFilters.has(c.industry)) return false;
        if (countryFilters.size > 0 && !countryFilters.has(c.country)) return false;
        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        if (sortKey === 'name') return a.name.localeCompare(b.name) * dir;
        if (sortKey === 'revenue') return (a.revenue - b.revenue) * dir;
        if (sortKey === 'outstanding') return (a.outstanding - b.outstanding) * dir;
        if (sortKey === 'lastOrder') return (new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime()) * dir;
        return 0;
      });
  }, [search, statusFilters, repFilters, industryFilters, countryFilters, sortKey, sortDir]);

  const allOnPage = filtered.length > 0 && filtered.every((c) => selected.has(c.id));
  const someOnPage = filtered.some((c) => selected.has(c.id));

  const toggleAll = () => {
    if (allOnPage) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const activeFilterCount =
    statusFilters.size + repFilters.size + industryFilters.size + countryFilters.size;

  const clearFilters = () => {
    setStatusFilters(new Set());
    setRepFilters(new Set());
    setIndustryFilters(new Set());
    setCountryFilters(new Set());
  };

  const totalRevenue = filtered.reduce((acc, c) => acc + c.revenue, 0);
  const totalOutstanding = filtered.reduce((acc, c) => acc + c.outstanding, 0);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Customers"
        description={`${filtered.length} customers · ${formatCurrency(totalRevenue)} revenue · ${formatCurrency(totalOutstanding)} outstanding`}
        breadcrumbs={[
          { label: 'Home', href: '/app' },
          { label: 'Sales', href: '/app/sales' },
          { label: 'Customers' },
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New customer
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, code, email…"
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <>
                  <Badge variant="soft">{selected.size} selected</Badge>
                  <Button variant="outline" size="sm">
                    Send statement
                  </Button>
                  <Button variant="outline" size="sm">
                    Tag
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="size-4" />
                    Sort: {sortKey === 'revenue' ? 'Revenue' : sortKey === 'outstanding' ? 'Outstanding' : sortKey === 'lastOrder' ? 'Last order' : 'Name'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => handleSort('name')}>Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('revenue')}>Revenue</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('outstanding')}>Outstanding</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('lastOrder')}>Last order</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}>
                    Direction: {sortDir === 'asc' ? 'Ascending' : 'Descending'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon-sm">
                <SlidersHorizontal className="size-4" />
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="erp-table">
                <thead>
                  <tr>
                    <th className="w-9">
                      <Checkbox
                        checked={allOnPage}
                        indeterminate={!allOnPage && someOnPage}
                        onCheckedChange={toggleAll}
                      />
                    </th>
                    <th>
                      <button
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                        onClick={() => handleSort('name')}
                      >
                        Customer
                        <ArrowDownUp className="size-3" />
                      </button>
                    </th>
                    <th>Code</th>
                    <th>Industry</th>
                    <th>Country</th>
                    <th className="text-right">
                      <button
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                        onClick={() => handleSort('revenue')}
                      >
                        Revenue
                        <ArrowDownUp className="size-3" />
                      </button>
                    </th>
                    <th className="text-right">
                      <button
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                        onClick={() => handleSort('outstanding')}
                      >
                        Outstanding
                        <ArrowDownUp className="size-3" />
                      </button>
                    </th>
                    <th>Last order</th>
                    <th>Sales rep</th>
                    <th>Status</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="group">
                      <td>
                        <Checkbox
                          checked={selected.has(c.id)}
                          onCheckedChange={() => setSelected(toggleSet(selected, c.id))}
                        />
                      </td>
                      <td>
                        <Link
                          href={`/app/sales/customers/${c.id}`}
                          className="flex items-center gap-2.5 transition-colors hover:text-primary"
                        >
                          <Avatar size="sm">
                            <AvatarFallback name={c.name}>{initials(c.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate font-medium">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.email}</div>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <span className="font-mono text-xs">{c.code}</span>
                      </td>
                      <td className="text-sm text-muted-foreground">{c.industry}</td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-mono text-2xs uppercase text-muted-foreground">
                            {c.countryCode}
                          </span>
                          <span className="text-muted-foreground">{c.country}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono tabular-nums">
                        {formatCurrency(c.revenue)}
                      </td>
                      <td className="text-right font-mono tabular-nums">
                        {c.outstanding > 0 ? (
                          <span className="text-warning">{formatCurrency(c.outstanding)}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="text-xs text-muted-foreground">{formatDate(c.lastOrder)}</td>
                      <td>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Avatar size="xs">
                            <AvatarFallback name={c.salesRep}>{initials(c.salesRep)}</AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">{c.salesRep.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/app/sales/customers/${c.id}`}>View profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>New quote</DropdownMenuItem>
                            <DropdownMenuItem>New invoice</DropdownMenuItem>
                            <DropdownMenuItem>Send statement</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem destructive>Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm text-muted-foreground">No customers match your filters.</p>
              </div>
            )}
          </Card>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filtered.length} of {customers.length} customers
            </span>
            <div className="flex items-center gap-3">
              <span>
                Total revenue:{' '}
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(totalRevenue)}
                </span>
              </span>
              <span>
                Outstanding:{' '}
                <span className="font-mono font-medium text-warning">
                  {formatCurrency(totalOutstanding)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Filter className="size-4 text-muted-foreground" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="soft" size="sm">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="xs" onClick={clearFilters}>
                  <X className="size-3" /> Clear
                </Button>
              )}
            </div>

            <Separator className="my-3" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Status
                </Label>
                {statusOptions.map((opt) => (
                  <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={statusFilters.has(opt.value)}
                      onCheckedChange={() => setStatusFilters(toggleSet(statusFilters, opt.value))}
                    />
                    <span>{opt.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {customers.filter((c) => c.status === opt.value).length}
                    </span>
                  </label>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Sales rep
                </Label>
                {reps.map((rep) => (
                  <label key={rep} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={repFilters.has(rep)}
                      onCheckedChange={() => setRepFilters(toggleSet(repFilters, rep))}
                    />
                    <Avatar size="xs">
                      <AvatarFallback name={rep}>{initials(rep)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{rep}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {customers.filter((c) => c.salesRep === rep).length}
                    </span>
                  </label>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Industry
                </Label>
                {industries.map((ind) => (
                  <label key={ind} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={industryFilters.has(ind)}
                      onCheckedChange={() => setIndustryFilters(toggleSet(industryFilters, ind))}
                    />
                    <span className="truncate">{ind}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {customers.filter((c) => c.industry === ind).length}
                    </span>
                  </label>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Country
                </Label>
                {countries.map((co) => (
                  <label key={co} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={countryFilters.has(co)}
                      onCheckedChange={() => setCountryFilters(toggleSet(countryFilters, co))}
                    />
                    <Globe2 className="size-3.5 text-muted-foreground" />
                    <span className="truncate">{co}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {customers.filter((c) => c.country === co).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
