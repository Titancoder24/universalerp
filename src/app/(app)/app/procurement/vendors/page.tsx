import Link from 'next/link';
import { Download, Filter, Plus, Search, Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCurrency, formatNumber, initials } from '@/lib/utils';

interface Vendor {
  id: string;
  name: string;
  code: string;
  category: string;
  country: string;
  spend: number;
  performance: number;
  onTime: number;
  status: 'active' | 'pending' | 'approved' | 'rejected' | 'inactive';
  payment: string;
}

const vendors: Vendor[] = [
  { id: 'V001', name: 'Apex Industrial Supply', code: 'APX-001', category: 'Raw materials', country: 'USA', spend: 842000, performance: 4.7, onTime: 96, status: 'active', payment: 'Net 30' },
  { id: 'V002', name: 'Shenzhen Tek Hardware', code: 'SZT-014', category: 'Electronics', country: 'CN', spend: 624000, performance: 4.4, onTime: 88, status: 'active', payment: 'Net 45' },
  { id: 'V003', name: 'EuroFasteners GmbH', code: 'EUF-022', category: 'Fasteners', country: 'DE', spend: 412000, performance: 4.6, onTime: 92, status: 'active', payment: 'Net 30' },
  { id: 'V004', name: 'AirGuard Co Ltd', code: 'AGD-008', category: 'Filtration', country: 'USA', spend: 338000, performance: 4.7, onTime: 94, status: 'active', payment: 'Net 30' },
  { id: 'V005', name: 'Petrolab Inc', code: 'PTL-019', category: 'Lubricants', country: 'USA', spend: 286000, performance: 4.3, onTime: 86, status: 'active', payment: 'Net 60' },
  { id: 'V006', name: 'ColorMax AG', code: 'CMX-002', category: 'Coatings', country: 'CH', spend: 242000, performance: 4.5, onTime: 91, status: 'active', payment: 'Net 30' },
  { id: 'V007', name: 'SealCo GmbH', code: 'SLC-011', category: 'Seals', country: 'DE', spend: 188000, performance: 4.2, onTime: 84, status: 'active', payment: 'Net 30' },
  { id: 'V008', name: 'ElectroMag Industries', code: 'EMI-005', category: 'Electronics', country: 'JP', spend: 164000, performance: 4.8, onTime: 98, status: 'active', payment: 'Net 30' },
  { id: 'V009', name: 'CableNet Solutions', code: 'CBN-029', category: 'Cabling', country: 'MX', spend: 142000, performance: 4.1, onTime: 82, status: 'active', payment: 'Net 45' },
  { id: 'V010', name: 'PowerCells Ltd', code: 'PWC-017', category: 'Power', country: 'KR', spend: 128000, performance: 4.5, onTime: 90, status: 'active', payment: 'Net 30' },
  { id: 'V011', name: 'StickIt Labs', code: 'SIL-031', category: 'Adhesives', country: 'NL', spend: 84000, performance: 4.0, onTime: 79, status: 'active', payment: 'Net 30' },
  { id: 'V012', name: 'Bossard Industrial AG', code: 'BSI-007', category: 'Fasteners', country: 'CH', spend: 62000, performance: 4.6, onTime: 93, status: 'active', payment: 'Net 30' },
  { id: 'V013', name: 'Acme Office Supply', code: 'AOS-042', category: 'Office', country: 'USA', spend: 48000, performance: 4.2, onTime: 87, status: 'active', payment: 'Net 15' },
  { id: 'V014', name: 'Northwind Tools Co', code: 'NWT-033', category: 'Tools', country: 'CA', spend: 32000, performance: 4.4, onTime: 89, status: 'pending', payment: 'Net 30' },
  { id: 'V015', name: 'Pacific Pallets', code: 'PCP-051', category: 'Packaging', country: 'USA', spend: 18000, performance: 3.8, onTime: 72, status: 'inactive', payment: 'Net 30' },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn('size-3', i < Math.round(rating) ? 'fill-warning text-warning' : 'text-muted-foreground/30')} />
      ))}
      <span className="ml-1 text-xs text-muted-foreground tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function VendorsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Vendors"
        description={`${vendors.length} suppliers · ${formatCurrency(vendors.reduce((a, v) => a + v.spend, 0))} YTD spend`}
        breadcrumbs={[
          { label: 'Procurement', href: '/app/procurement' },
          { label: 'Vendors' },
        ]}
        actions={
          <>
            <Button variant="outline"><Upload className="size-4" /> Import</Button>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Plus className="size-4" /> New vendor</Button>
          </>
        }
      />

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative max-w-sm flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input className="pl-8" placeholder="Search vendors by name, code, category…" />
            </div>
            <Select>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="raw">Raw materials</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fasteners">Fasteners</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40"><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                <SelectItem value="usa">USA</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="cn">China</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-36"><SelectValue placeholder="KYC Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="ml-auto"><Filter className="size-4" /> More filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <table className="erp-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Code</th>
              <th>Category</th>
              <th>Country</th>
              <th className="text-right">YTD Spend</th>
              <th>Performance</th>
              <th className="text-right">On-Time</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>
                  <Link href={`/app/procurement/vendors/${v.id}`} className="flex items-center gap-2 hover:text-primary">
                    <Avatar size="sm"><AvatarFallback name={v.name}>{initials(v.name)}</AvatarFallback></Avatar>
                    <span className="font-medium">{v.name}</span>
                  </Link>
                </td>
                <td className="font-mono text-xs text-muted-foreground">{v.code}</td>
                <td><Badge variant="outline" size="sm">{v.category}</Badge></td>
                <td className="text-xs">{v.country}</td>
                <td className="text-right font-mono tabular-nums font-medium">{formatCurrency(v.spend)}</td>
                <td><Stars rating={v.performance} /></td>
                <td className="text-right">
                  <span className={cn('font-mono font-medium', v.onTime >= 90 ? 'text-success' : v.onTime >= 80 ? 'text-warning' : 'text-destructive')}>
                    {v.onTime}%
                  </span>
                </td>
                <td className="text-xs">{v.payment}</td>
                <td><StatusBadge status={v.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
