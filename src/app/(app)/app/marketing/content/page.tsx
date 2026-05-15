import {
  ArrowDown,
  ArrowUpDown,
  BookOpen,
  Download,
  Eye,
  File,
  FileText,
  Filter,
  Folder,
  Image as ImageIcon,
  Mic,
  MoreHorizontal,
  Newspaper,
  PieChart,
  Plus,
  Presentation,
  Search,
  Share2,
  Sparkles,
  Star,
  Upload,
  Video,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input, InputAddon } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatCompactNumber, formatRelativeTime, initials } from '@/lib/utils';

type ContentType = 'whitepaper' | 'case-study' | 'ebook' | 'report' | 'video' | 'webinar' | 'infographic' | 'one-pager' | 'podcast' | 'datasheet';

interface ContentAsset {
  id: string;
  title: string;
  type: ContentType;
  description: string;
  thumbnail: string;
  fileType: string;
  size: string;
  views: number;
  downloads: number;
  shares: number;
  rating: number;
  tags: string[];
  industry?: string;
  funnel: 'awareness' | 'consideration' | 'decision';
  language: string;
  owner: string;
  updated: Date;
  starred?: boolean;
  featured?: boolean;
}

const assets: ContentAsset[] = [
  { id: 'CT-001', title: 'The AI Procurement Buyer\'s Guide 2026', type: 'ebook', description: 'A 48-page guide covering everything from RFI to vendor selection for AI procurement platforms.', thumbnail: 'from-primary/30 to-primary/5', fileType: 'PDF', size: '4.2 MB', views: 8240, downloads: 1248, shares: 184, rating: 4.8, tags: ['ai', 'procurement', 'enterprise'], funnel: 'consideration', language: 'EN', owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), starred: true, featured: true },
  { id: 'CT-002', title: 'Helix Robotics: 60% reduction in supplier onboarding time', type: 'case-study', description: 'How a 380-person robotics manufacturer rebuilt their procurement workflow with UniversalERP.', thumbnail: 'from-success/30 to-success/5', fileType: 'PDF', size: '2.1 MB', views: 5840, downloads: 720, shares: 142, rating: 4.9, tags: ['manufacturing', 'case-study'], industry: 'Manufacturing', funnel: 'decision', language: 'EN', owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), featured: true },
  { id: 'CT-003', title: 'State of Manufacturing Procurement 2026', type: 'report', description: 'Annual research report based on surveys with 1,200+ manufacturing procurement leaders.', thumbnail: 'from-warning/30 to-warning/5', fileType: 'PDF', size: '6.8 MB', views: 7240, downloads: 620, shares: 218, rating: 4.7, tags: ['research', 'manufacturing', 'trends'], industry: 'Manufacturing', funnel: 'awareness', language: 'EN', owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), starred: true },
  { id: 'CT-004', title: 'Healthcare Procurement Webinar Recording', type: 'webinar', description: 'Live session with procurement leaders from 3 healthcare systems on digital transformation.', thumbnail: 'from-pink-500/30 to-pink-500/5', fileType: 'MP4', size: '120 MB', views: 4840, downloads: 412, shares: 98, rating: 4.6, tags: ['healthcare', 'webinar'], industry: 'Healthcare', funnel: 'consideration', language: 'EN', owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) },
  { id: 'CT-005', title: 'TCO Calculator: ROI in 90 days', type: 'one-pager', description: 'Quick reference for sales conversations showing typical ROI timeline and cost savings model.', thumbnail: 'from-info/30 to-info/5', fileType: 'PDF', size: '380 KB', views: 12480, downloads: 982, shares: 312, rating: 4.5, tags: ['sales-enablement', 'roi'], funnel: 'decision', language: 'EN', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: 'CT-006', title: 'Sustainability Compliance Whitepaper', type: 'whitepaper', description: 'How CSRD, SEC climate disclosures, and supplier emissions reporting impact procurement.', thumbnail: 'from-emerald-500/30 to-emerald-500/5', fileType: 'PDF', size: '3.4 MB', views: 3240, downloads: 484, shares: 86, rating: 4.8, tags: ['sustainability', 'compliance', 'csrd'], funnel: 'awareness', language: 'EN', owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), starred: true },
  { id: 'CT-007', title: 'How AI Matching Works - Animated Explainer', type: 'video', description: '90-second animated explainer covering the AI matching engine in plain language.', thumbnail: 'from-purple-500/30 to-purple-500/5', fileType: 'MP4', size: '24 MB', views: 9840, downloads: 220, shares: 412, rating: 4.7, tags: ['product', 'explainer', 'ai'], funnel: 'awareness', language: 'EN', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6) },
  { id: 'CT-008', title: 'Procurement Stack 2026 - Infographic', type: 'infographic', description: 'Visual breakdown of the modern procurement tech stack with category leaders.', thumbnail: 'from-cyan-500/30 to-cyan-500/5', fileType: 'PNG', size: '1.8 MB', views: 6420, downloads: 384, shares: 268, rating: 4.4, tags: ['infographic', 'industry-map'], funnel: 'awareness', language: 'EN', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18) },
  { id: 'CT-009', title: 'Acme Industries: $1.2M annual savings', type: 'case-study', description: 'A multi-divisional manufacturer\'s 4-year journey from manual workflows to AI procurement.', thumbnail: 'from-orange-500/30 to-orange-500/5', fileType: 'PDF', size: '2.8 MB', views: 4280, downloads: 540, shares: 124, rating: 4.9, tags: ['manufacturing', 'case-study', 'enterprise'], industry: 'Manufacturing', funnel: 'decision', language: 'EN', owner: 'Maya Patel', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21) },
  { id: 'CT-010', title: 'Product Datasheet - Enterprise Tier', type: 'datasheet', description: 'Two-page technical datasheet covering features, integrations, security, and SLA.', thumbnail: 'from-blue-500/30 to-blue-500/5', fileType: 'PDF', size: '720 KB', views: 5840, downloads: 1840, shares: 142, rating: 4.6, tags: ['datasheet', 'sales-enablement'], funnel: 'decision', language: 'EN', owner: 'Sofia Almeida', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
  { id: 'CT-011', title: 'Procurement Talk - Episode 12: AI Ethics', type: 'podcast', description: 'Discussion with three CPOs on ethical AI in procurement decisions and supplier scoring.', thumbnail: 'from-red-500/30 to-red-500/5', fileType: 'MP3', size: '52 MB', views: 1840, downloads: 320, shares: 84, rating: 4.5, tags: ['podcast', 'ai', 'ethics'], funnel: 'awareness', language: 'EN', owner: 'David Kim', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11) },
  { id: 'CT-012', title: 'Q3 Product Launch Deck', type: 'one-pager', description: 'Internal sales deck for Q3 product releases including sustainability module and analytics v2.', thumbnail: 'from-teal-500/30 to-teal-500/5', fileType: 'PPTX', size: '8.4 MB', views: 982, downloads: 240, shares: 64, rating: 4.3, tags: ['sales-enablement', 'product-launch'], funnel: 'decision', language: 'EN', owner: 'Jamal Khan', updated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
];

const typeMap: Record<ContentType, { icon: any; color: string; label: string }> = {
  whitepaper: { icon: FileText, color: 'text-primary bg-primary/10', label: 'Whitepaper' },
  'case-study': { icon: Star, color: 'text-success bg-success/10', label: 'Case study' },
  ebook: { icon: BookOpen, color: 'text-info bg-info/10', label: 'E-book' },
  report: { icon: PieChart, color: 'text-warning bg-warning/10', label: 'Report' },
  video: { icon: Video, color: 'text-purple-500 bg-purple-500/10', label: 'Video' },
  webinar: { icon: Video, color: 'text-pink-500 bg-pink-500/10', label: 'Webinar' },
  infographic: { icon: ImageIcon, color: 'text-cyan-500 bg-cyan-500/10', label: 'Infographic' },
  'one-pager': { icon: File, color: 'text-orange-500 bg-orange-500/10', label: 'One-pager' },
  podcast: { icon: Mic, color: 'text-red-500 bg-red-500/10', label: 'Podcast' },
  datasheet: { icon: Newspaper, color: 'text-blue-500 bg-blue-500/10', label: 'Datasheet' },
};

const featured = assets.filter((a) => a.featured);

export default function ContentLibraryPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Content library"
        description="Whitepapers, case studies, brochures, and assets — the connective tissue of demand gen."
        actions={
          <>
            <Button variant="outline" size="sm">
              <ArrowDown className="size-4" /> Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="size-4" /> Upload
            </Button>
            <Button size="sm">
              <Plus className="size-4" /> New asset
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total assets</p>
            <p className="mt-1 text-2xl font-semibold">{assets.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total downloads</p>
            <p className="mt-1 text-2xl font-semibold">{formatCompactNumber(assets.reduce((s, a) => s + a.downloads, 0))}</p>
            <p className="mt-1 text-xs text-success">+24% MoM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg rating</p>
            <p className="mt-1 text-2xl font-semibold">{(assets.reduce((s, a) => s + a.rating, 0) / assets.length).toFixed(1)}</p>
            <p className="mt-1 text-xs text-muted-foreground">across all assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Featured</p>
            <p className="mt-1 text-2xl font-semibold">{featured.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Hero pieces</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured strip */}
      {featured.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-warning" /> Featured assets
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {featured.map((a) => {
              const tm = typeMap[a.type];
              return (
                <Card key={a.id} className="group overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="flex p-0">
                    <div className={cn('relative w-32 shrink-0 bg-gradient-to-br', a.thumbnail)}>
                      <div className="absolute inset-0 grid place-items-center">
                        <tm.icon className="size-8 text-foreground/30" />
                      </div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="outline" size="sm" className={tm.color}>
                          <tm.icon className="size-3" />
                          {tm.label}
                        </Badge>
                        <Badge variant="warning" size="sm">
                          <Sparkles className="size-3" /> Featured
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-semibold leading-snug">{a.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="size-3" /> {formatCompactNumber(a.views)}</span>
                        <span className="flex items-center gap-1"><Download className="size-3" /> {formatCompactNumber(a.downloads)}</span>
                        <span className="flex items-center gap-1">
                          <Star className="size-3 fill-warning text-warning" /> {a.rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList variant="pills">
          <TabsTrigger variant="pills" value="all">All ({assets.length})</TabsTrigger>
          <TabsTrigger variant="pills" value="awareness">Awareness</TabsTrigger>
          <TabsTrigger variant="pills" value="consideration">Consideration</TabsTrigger>
          <TabsTrigger variant="pills" value="decision">Decision</TabsTrigger>
          <TabsTrigger variant="pills" value="starred">
            <Star className="size-3.5 fill-warning text-warning" /> Starred
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[240px] flex-1">
          <InputAddon prefix={<Search className="size-4" />}>
            <Input placeholder="Search content library..." />
          </InputAddon>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="whitepaper">Whitepapers</SelectItem>
            <SelectItem value="case-study">Case studies</SelectItem>
            <SelectItem value="ebook">E-books</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="report">Reports</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All industries</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="finance">Financial Services</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="recent">
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="downloads">Most downloaded</SelectItem>
            <SelectItem value="rating">Top rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((a) => {
          const tm = typeMap[a.type];
          return (
            <Card key={a.id} className="group overflow-hidden transition-all hover:shadow-md">
              <div className={cn('relative h-36 bg-gradient-to-br', a.thumbnail)}>
                <div className="absolute inset-0 grid place-items-center">
                  <tm.icon className="size-10 text-foreground/30" />
                </div>
                <div className="absolute left-2 top-2 flex items-center gap-1">
                  <Badge variant="outline" size="sm" className={cn(tm.color, 'border-current/30 backdrop-blur')}>
                    <tm.icon className="size-3" />
                    {tm.label}
                  </Badge>
                </div>
                {a.starred && (
                  <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-background/90 shadow-sm">
                    <Star className="size-3.5 fill-warning text-warning" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end gap-1 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="outline" size="xs">
                    <Eye className="size-3" /> Preview
                  </Button>
                  <Button variant="default" size="xs">
                    <Share2 className="size-3" /> Share
                  </Button>
                </div>
              </div>
              <CardContent className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 flex-1 font-semibold leading-snug">{a.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="-mr-1 -mt-1">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="size-4" /> Preview</DropdownMenuItem>
                      <DropdownMenuItem><Download className="size-4" /> Download</DropdownMenuItem>
                      <DropdownMenuItem><Share2 className="size-4" /> Share</DropdownMenuItem>
                      <DropdownMenuItem><Star className="size-4" /> Star</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" size="sm" className="capitalize">
                    {a.funnel}
                  </Badge>
                  {a.industry && <Badge variant="outline" size="sm">{a.industry}</Badge>}
                  <span className="text-xs text-muted-foreground">{a.fileType} · {a.size}</span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="size-3" />
                    <span className="font-mono tabular-nums">{formatCompactNumber(a.views)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="size-3" />
                    <span className="font-mono tabular-nums">{formatCompactNumber(a.downloads)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="size-3 fill-warning text-warning" />
                    <span className="font-mono tabular-nums">{a.rating}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Avatar size="xs">
                      <AvatarFallback name={a.owner}>{initials(a.owner)}</AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground">{a.owner.split(' ')[0]}</span>
                  </div>
                  <span className="text-muted-foreground">{formatRelativeTime(a.updated)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
