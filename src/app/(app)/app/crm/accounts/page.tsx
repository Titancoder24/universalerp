import {
  ArrowDown,
  ArrowUpDown,
  Building2,
  ExternalLink,
  Filter,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, colorFromString, formatCurrency, formatRelativeTime, initials } from '@/lib/utils';

interface Account {
  id: string;
  name: string;
  industry: string;
  employees: number;
  arr: number;
  health: 'excellent' | 'good' | 'at_risk' | 'churning';
  contacts: number;
  opportunities: number;
  lastActivity: Date;
  tier: 'Strategic' | 'Enterprise' | 'Mid-Market' | 'SMB';
  domain: string;
  owner: string;
}

const accounts: Account[] = [
  { id: 'A-101', name: 'Northwind Software', industry: 'Software', employees: 145, arr: 0, health: 'good', contacts: 4, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 18), tier: 'Enterprise', domain: 'northwind.io', owner: 'Sarah Chen' },
  { id: 'A-102', name: 'Lumen Health', industry: 'Healthcare', employees: 2400, arr: 0, health: 'good', contacts: 6, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), tier: 'Strategic', domain: 'lumenhealth.co', owner: 'Priya Patel' },
  { id: 'A-103', name: 'Helix Robotics', industry: 'Manufacturing', employees: 380, arr: 124000, health: 'excellent', contacts: 5, opportunities: 2, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5), tier: 'Enterprise', domain: 'helixrobotics.com', owner: 'Marcus Rivera' },
  { id: 'A-104', name: 'Acme Industries', industry: 'Manufacturing', employees: 5800, arr: 480000, health: 'excellent', contacts: 12, opportunities: 3, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 8), tier: 'Strategic', domain: 'acme-ind.com', owner: 'Priya Patel' },
  { id: 'A-105', name: 'Global Manufacturing', industry: 'Manufacturing', employees: 12500, arr: 720000, health: 'excellent', contacts: 18, opportunities: 5, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12), tier: 'Strategic', domain: 'globalmfg.com', owner: 'Sarah Chen' },
  { id: 'A-106', name: 'TechCorp Solutions', industry: 'Software', employees: 720, arr: 320000, health: 'good', contacts: 8, opportunities: 2, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24), tier: 'Enterprise', domain: 'techcorp.com', owner: 'Marcus Rivera' },
  { id: 'A-107', name: 'Sakura Retail Group', industry: 'Retail', employees: 3200, arr: 0, health: 'good', contacts: 3, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), tier: 'Enterprise', domain: 'sakura-retail.jp', owner: 'Priya Patel' },
  { id: 'A-108', name: 'Brightline AI', industry: 'AI/ML', employees: 95, arr: 88000, health: 'at_risk', contacts: 3, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), tier: 'Mid-Market', domain: 'brightline.ai', owner: 'James Okafor' },
  { id: 'A-109', name: 'Vertex Logistics', industry: 'Logistics', employees: 410, arr: 0, health: 'good', contacts: 4, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), tier: 'Enterprise', domain: 'vertexlog.de', owner: 'Sarah Chen' },
  { id: 'A-110', name: 'Enterprise Ltd', industry: 'Financial Services', employees: 8400, arr: 560000, health: 'excellent', contacts: 14, opportunities: 4, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 36), tier: 'Strategic', domain: 'enterprise.com', owner: 'Priya Patel' },
  { id: 'A-111', name: 'Crestwood Insurance', industry: 'Insurance', employees: 1850, arr: 0, health: 'good', contacts: 4, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 48), tier: 'Enterprise', domain: 'crestwoodins.com', owner: 'Emily Watson' },
  { id: 'A-112', name: 'Mesa Manufacturing', industry: 'Manufacturing', employees: 920, arr: 42000, health: 'good', contacts: 6, opportunities: 2, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), tier: 'Mid-Market', domain: 'mesa-mfg.com', owner: 'Marcus Rivera' },
  { id: 'A-113', name: 'StartupCo', industry: 'Software', employees: 32, arr: 14000, health: 'churning', contacts: 2, opportunities: 0, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), tier: 'SMB', domain: 'startupco.io', owner: 'James Okafor' },
  { id: 'A-114', name: 'Boreal Energy', industry: 'Energy', employees: 1200, arr: 0, health: 'good', contacts: 5, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), tier: 'Enterprise', domain: 'borealenergy.se', owner: 'Emily Watson' },
  { id: 'A-115', name: 'Shamrock Distilleries', industry: 'Food & Beverage', employees: 480, arr: 0, health: 'good', contacts: 3, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), tier: 'Mid-Market', domain: 'shamrockdist.ie', owner: 'Marcus Rivera' },
  { id: 'A-116', name: 'Sentinel Cybersecurity', industry: 'Cybersecurity', employees: 220, arr: 38000, health: 'good', contacts: 4, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), tier: 'Mid-Market', domain: 'sentinelsec.io', owner: 'James Okafor' },
  { id: 'A-117', name: 'Pacific Marine', industry: 'Shipping', employees: 680, arr: 0, health: 'at_risk', contacts: 2, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), tier: 'Enterprise', domain: 'pacmarine.jp', owner: 'Marcus Rivera' },
  { id: 'A-118', name: 'NordicTech Industries', industry: 'Manufacturing', employees: 1450, arr: 0, health: 'good', contacts: 5, opportunities: 1, lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), tier: 'Enterprise', domain: 'nordictech.no', owner: 'James Okafor' },
];

const healthMap = {
  excellent: { label: 'Excellent', tone: 'success' as const, dot: 'bg-success' },
  good: { label: 'Good', tone: 'info' as const, dot: 'bg-info' },
  at_risk: { label: 'At risk', tone: 'warning' as const, dot: 'bg-warning' },
  churning: { label: 'Churning', tone: 'destructive' as const, dot: 'bg-destructive' },
};

const totalARR = accounts.reduce((sum, a) => sum + a.arr, 0);
const customersWithRevenue = accounts.filter((a) => a.arr > 0).length;

export default function AccountsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Accounts"
        description="The companies you sell to. Track health, expansion, and engagement at the org level."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Import
            </Button>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New account
            </Button>
          </>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total accounts</p>
            <p className="mt-1 text-2xl font-semibold">{accounts.length}</p>
            <p className="mt-1 text-xs text-success">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Paying customers</p>
            <p className="mt-1 text-2xl font-semibold">{customersWithRevenue}</p>
            <p className="mt-1 text-xs text-muted-foreground">{Math.round((customersWithRevenue / accounts.length) * 100)}% conversion</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total ARR</p>
            <p className="mt-1 text-2xl font-semibold">{formatCurrency(totalARR)}</p>
            <p className="mt-1 text-xs text-success">+14% YoY</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">At-risk accounts</p>
            <p className="mt-1 text-2xl font-semibold text-warning">
              {accounts.filter((a) => a.health === 'at_risk' || a.health === 'churning').length}
            </p>
            <p className="mt-1 text-xs text-destructive">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="min-w-[240px] flex-1">
            <InputAddon prefix={<Search className="size-4" />}>
              <Input placeholder="Search accounts..." />
            </InputAddon>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              <SelectItem value="strategic">Strategic</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="mid">Mid-Market</SelectItem>
              <SelectItem value="smb">SMB</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any industry</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Financial Services</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any health</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="at_risk">At risk</SelectItem>
              <SelectItem value="churning">Churning</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm">
            <Filter className="size-4" /> More
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th className="w-8 pl-4">
                  <Checkbox />
                </th>
                <th>
                  <button className="inline-flex items-center gap-1 hover:text-foreground">
                    Account <ArrowUpDown className="size-3" />
                  </button>
                </th>
                <th>Industry</th>
                <th className="text-right">Employees</th>
                <th className="text-right">ARR</th>
                <th>Health</th>
                <th>Tier</th>
                <th className="text-center">Contacts</th>
                <th className="text-center">Opps</th>
                <th>Owner</th>
                <th>Last activity</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => {
                const h = healthMap[a.health];
                return (
                  <tr key={a.id} className="group">
                    <td className="pl-4">
                      <Checkbox />
                    </td>
                    <td>
                      <Link href={`/app/crm/accounts/${a.id}`} className="flex items-center gap-2.5">
                        <div
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-xs font-semibold text-white"
                          style={{ backgroundColor: colorFromString(a.name) }}
                        >
                          {initials(a.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground group-hover:text-primary">
                            {a.name}
                          </p>
                          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <Globe className="size-3" />
                            {a.domain}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="text-sm text-muted-foreground">{a.industry}</td>
                    <td className="text-right font-mono tabular-nums">{a.employees.toLocaleString()}</td>
                    <td className="text-right font-mono font-semibold tabular-nums">
                      {a.arr > 0 ? formatCurrency(a.arr) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td>
                      <Badge variant="outline" size="sm" className={cn(
                        h.tone === 'success' && 'border-success/30 bg-success/10 text-success',
                        h.tone === 'info' && 'border-info/30 bg-info/10 text-info',
                        h.tone === 'warning' && 'border-warning/30 bg-warning/10 text-warning',
                        h.tone === 'destructive' && 'border-destructive/30 bg-destructive/10 text-destructive',
                      )}>
                        <span className={cn('mr-1 h-1.5 w-1.5 rounded-full', h.dot)} />
                        {h.label}
                      </Badge>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 text-xs">
                        {a.tier === 'Strategic' && <Star className="size-3 fill-warning text-warning" />}
                        {a.tier}
                      </span>
                    </td>
                    <td className="text-center text-sm">{a.contacts}</td>
                    <td className="text-center text-sm">
                      {a.opportunities > 0 ? (
                        <Badge variant="soft" size="sm">{a.opportunities}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Avatar size="xs">
                          <AvatarFallback name={a.owner}>{initials(a.owner)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{a.owner.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {formatRelativeTime(a.lastActivity)}
                    </td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ExternalLink className="size-4" /> Open account
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plus className="size-4" /> New opportunity
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Building2 className="size-4" /> Add contact
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
    </div>
  );
}
