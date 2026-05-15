import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Brain,
  Calendar,
  Download,
  Filter,
  LineChart,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

interface Forecast {
  sku: string;
  name: string;
  forecast: number;
  actual: number;
  variance: number;
  trend: 'up' | 'down' | 'flat';
  confidence: number;
  category: string;
  next30: number;
  next90: number;
}

const forecasts: Forecast[] = [
  { sku: 'BOLT-M8-40', name: 'Industrial Bolts M8 x 40mm', forecast: 4200, actual: 4480, variance: 6.7, trend: 'up', confidence: 92, category: 'Fasteners', next30: 4600, next90: 13800 },
  { sku: 'CHIP-FPGA-32', name: 'FPGA Dev Chip 32K Logic', forecast: 24, actual: 18, variance: -25, trend: 'down', confidence: 78, category: 'Electronics', next30: 22, next90: 64 },
  { sku: 'OIL-HYD-46', name: 'Hydraulic Oil ISO 46', forecast: 48, actual: 52, variance: 8.3, trend: 'up', confidence: 88, category: 'Lubricants', next30: 52, next90: 168 },
  { sku: 'BEAR-6204', name: 'Ball Bearing 6204 ZZ', forecast: 1200, actual: 1180, variance: -1.7, trend: 'flat', confidence: 94, category: 'Bearings', next30: 1240, next90: 3720 },
  { sku: 'FILTER-AC-18', name: 'Cabin Air Filter 18mm', forecast: 240, actual: 286, variance: 19.2, trend: 'up', confidence: 84, category: 'Filtration', next30: 320, next90: 980 },
  { sku: 'CART-HP-58A', name: 'HP Toner Cartridge 58A', forecast: 86, actual: 72, variance: -16.3, trend: 'down', confidence: 81, category: 'Office', next30: 78, next90: 220 },
  { sku: 'CABLE-CAT6-305', name: 'CAT6 UTP Cable 305m Reel', forecast: 18, actual: 22, variance: 22.2, trend: 'up', confidence: 86, category: 'Cabling', next30: 24, next90: 70 },
  { sku: 'GASKET-12', name: 'Rubber Gasket 12mm', forecast: 420, actual: 384, variance: -8.6, trend: 'down', confidence: 89, category: 'Seals', next30: 410, next90: 1240 },
  { sku: 'PAINT-EPX-RAL5012', name: 'Epoxy Paint RAL5012 Blue', forecast: 120, actual: 142, variance: 18.3, trend: 'up', confidence: 82, category: 'Coatings', next30: 158, next90: 480 },
  { sku: 'WELD-ROD-6013', name: 'Welding Rod 6013', forecast: 240, actual: 224, variance: -6.7, trend: 'flat', confidence: 91, category: 'Welding', next30: 248, next90: 740 },
];

export default function DemandPlanningPage() {
  const avgAccuracy = 100 - Math.abs(forecasts.reduce((a, f) => a + f.variance, 0) / forecasts.length);
  const overforecast = forecasts.filter((f) => f.variance < -10).length;
  const underforecast = forecasts.filter((f) => f.variance > 10).length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Demand planning"
        description="Forecast vs actual analysis with AI-powered predictions"
        breadcrumbs={[
          { label: 'Operations', href: '/app' },
          { label: 'Demand' },
        ]}
        actions={
          <>
            <Button variant="outline"><Download className="size-4" /> Export</Button>
            <Button><Brain className="size-4" /> Re-run forecast</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Forecast accuracy" value={avgAccuracy} format="percent" delta={2.4} />
        <StatCard label="Under-forecasted" value={underforecast} format="number" invertTrend />
        <StatCard label="Over-forecasted" value={overforecast} format="number" invertTrend />
        <StatCard label="Avg confidence" value={87} format="percent" delta={1.8} />
      </div>

      <Card className="border-info/30 bg-info/5">
        <CardContent className="flex items-start gap-3 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-info/15 text-info">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">AI insight</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Detected 22.2% spike in CAT6 cable demand correlating with new data center customers. Recommend increasing safety stock by 30% and extending RFQ-2026-017 contract early. Forecast confidence elevated for FILTER-AC-18 series in Q3 due to seasonal HVAC service patterns.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="info" size="sm">3 stock increases suggested</Badge>
              <Badge variant="warning" size="sm">2 procurement actions</Badge>
              <Badge variant="soft" size="sm">Confidence trend: +1.8%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Trend chart</CardTitle>
            <CardDescription>Last 12 months · forecast (dashed) vs actual</CardDescription>
          </div>
          <Select defaultValue="12m">
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="relative h-64">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fc" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" />
              ))}
              <path
                d="M 0,140 L 50,128 L 100,112 L 150,98 L 200,86 L 250,78 L 300,72 L 350,66 L 400,58 L 450,52 L 500,46 L 550,42 L 600,38 L 600,200 L 0,200 Z"
                fill="url(#fc)"
              />
              <path
                d="M 0,140 L 50,128 L 100,112 L 150,98 L 200,86 L 250,78 L 300,72 L 350,66 L 400,58 L 450,52 L 500,46 L 550,42 L 600,38"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              <path
                d="M 0,150 L 50,138 L 100,118 L 150,96 L 200,82 L 250,72 L 300,68 L 350,60 L 400,52"
                fill="none"
                stroke="hsl(var(--info))"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </svg>
            <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs text-muted-foreground">
              <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-3 text-xs">
            <div className="flex items-center gap-1.5"><div className="h-0.5 w-4 bg-primary" /> Actual demand</div>
            <div className="flex items-center gap-1.5"><div className="h-0.5 w-4 bg-info border-dashed" style={{borderTop: '2px dashed hsl(var(--info))', background:'transparent'}} /> Forecast</div>
            <div className="ml-auto text-muted-foreground">Updated 2h ago</div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0">
        <table className="erp-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item</th>
              <th>Category</th>
              <th className="text-right">Forecast (30d)</th>
              <th className="text-right">Actual (30d)</th>
              <th className="text-right">Variance</th>
              <th>Trend</th>
              <th className="text-right">Confidence</th>
              <th className="text-right">Next 30d</th>
              <th className="text-right">Next 90d</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => (
              <tr key={f.sku}>
                <td className="font-mono text-xs text-primary">{f.sku}</td>
                <td className="font-medium">{f.name}</td>
                <td><Badge variant="outline" size="sm">{f.category}</Badge></td>
                <td className="text-right font-mono">{formatNumber(f.forecast)}</td>
                <td className="text-right font-mono">{formatNumber(f.actual)}</td>
                <td className={cn('text-right font-mono font-medium', f.variance > 5 ? 'text-success' : f.variance < -5 ? 'text-destructive' : 'text-muted-foreground')}>
                  {f.variance > 0 ? '+' : ''}{f.variance.toFixed(1)}%
                </td>
                <td>
                  {f.trend === 'up' && <Badge variant="success" size="sm"><TrendingUp className="size-3" /> Rising</Badge>}
                  {f.trend === 'down' && <Badge variant="destructive" size="sm"><TrendingDown className="size-3" /> Falling</Badge>}
                  {f.trend === 'flat' && <Badge variant="outline" size="sm">Stable</Badge>}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div className={cn('h-full', f.confidence >= 90 ? 'bg-success' : f.confidence >= 80 ? 'bg-info' : 'bg-warning')} style={{ width: `${f.confidence}%` }} />
                    </div>
                    <span className="font-mono text-xs">{f.confidence}%</span>
                  </div>
                </td>
                <td className="text-right font-mono">{formatNumber(f.next30)}</td>
                <td className="text-right font-mono">{formatNumber(f.next90)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
