'use client';

import * as React from 'react';
import {
  ChevronRight,
  Cloud,
  Download,
  File,
  FileSignature,
  FileText,
  Filter,
  Folder,
  FolderPlus,
  Grid3x3,
  Image as ImageIcon,
  List,
  Lock,
  MoreHorizontal,
  Search,
  Share2,
  Star,
  Upload,
  Video,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn, formatFileSize, formatRelativeTime, initials, colorFromString } from '@/lib/utils';

const folders = [
  { id: 'f1', name: 'Contracts', files: 47, size: 142000000 },
  { id: 'f2', name: 'Invoices', files: 1242, size: 320000000 },
  { id: 'f3', name: 'HR & Onboarding', files: 89, size: 56000000 },
  { id: 'f4', name: 'Marketing Assets', files: 234, size: 1200000000 },
  { id: 'f5', name: 'Quality Records', files: 156, size: 78000000 },
  { id: 'f6', name: 'Engineering Drawings', files: 89, size: 245000000 },
];

const files = [
  { id: '1', name: 'Acme Master Services Agreement.pdf', type: 'pdf', size: 1240000, modified: new Date(Date.now() - 1000 * 60 * 60 * 2), owner: 'Sarah Chen', shared: true, signed: true, locked: false },
  { id: '2', name: 'Q3 2026 Financial Report.xlsx', type: 'spreadsheet', size: 568000, modified: new Date(Date.now() - 1000 * 60 * 60 * 5), owner: 'Aisha Patel', shared: true, signed: false, locked: false },
  { id: '3', name: 'Product roadmap 2026-2027.pdf', type: 'pdf', size: 3400000, modified: new Date(Date.now() - 1000 * 60 * 60 * 24), owner: 'Marcus Rodriguez', shared: false, signed: false, locked: false },
  { id: '4', name: 'Employee handbook.docx', type: 'document', size: 890000, modified: new Date(Date.now() - 1000 * 60 * 60 * 48), owner: 'Priya Sharma', shared: true, signed: false, locked: true },
  { id: '5', name: 'Brand guidelines.pdf', type: 'pdf', size: 12400000, modified: new Date(Date.now() - 1000 * 60 * 60 * 72), owner: 'Emma Williams', shared: true, signed: false, locked: false },
  { id: '6', name: 'Factory tour video.mp4', type: 'video', size: 245000000, modified: new Date(Date.now() - 1000 * 60 * 60 * 96), owner: 'Jake Thompson', shared: false, signed: false, locked: false },
  { id: '7', name: 'Product photo - Widget A.png', type: 'image', size: 3200000, modified: new Date(Date.now() - 1000 * 60 * 60 * 120), owner: 'Emma Williams', shared: true, signed: false, locked: false },
  { id: '8', name: 'Acme expansion proposal.pdf', type: 'pdf', size: 2100000, modified: new Date(Date.now() - 1000 * 60 * 60 * 168), owner: 'Sarah Chen', shared: true, signed: true, locked: false },
];

const fileTypeIcons = {
  pdf: { icon: FileText, color: 'text-destructive' },
  document: { icon: FileText, color: 'text-info' },
  spreadsheet: { icon: FileText, color: 'text-success' },
  image: { icon: ImageIcon, color: 'text-warning' },
  video: { icon: Video, color: 'text-purple-500' },
  other: { icon: File, color: 'text-muted-foreground' },
};

export default function DocumentsPage() {
  const [view, setView] = React.useState<'grid' | 'list'>('list');
  const [search, setSearch] = React.useState('');

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Documents"
        description="Files, e-signatures, version history, and shared portals — all in one place."
        actions={
          <>
            <Button variant="outline">
              <FolderPlus className="size-4" /> New folder
            </Button>
            <Button>
              <Upload className="size-4" /> Upload
            </Button>
          </>
        }
      />

      {/* Storage usage */}
      <Card className="bg-gradient-to-r from-primary/5 via-card to-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Cloud className="size-5" />
              </div>
              <div>
                <div className="text-sm font-medium">Storage used</div>
                <div className="text-xs text-muted-foreground">2.4 GB of 50 GB on the Pro plan</div>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: '4.8%' }} />
              </div>
            </div>
            <Button variant="outline" size="sm">Upgrade</Button>
          </div>
        </CardContent>
      </Card>

      {/* Folders */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Folders</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {folders.map((f) => (
            <Card key={f.id} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <Folder className="size-8 text-primary" />
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-3" />
                  </Button>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium truncate">{f.name}</div>
                  <div className="text-2xs text-muted-foreground">
                    {f.files} files · {formatFileSize(f.size)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Files */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-3 border-b border-border p-3">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  placeholder="Search files…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="size-3.5" /> Filter
              </Button>
            </div>
            <div className="flex rounded-md border border-border p-0.5">
              <button
                onClick={() => setView('list')}
                className={cn(
                  'rounded p-1.5 transition-colors',
                  view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                )}
              >
                <List className="size-3.5" />
              </button>
              <button
                onClick={() => setView('grid')}
                className={cn(
                  'rounded p-1.5 transition-colors',
                  view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                )}
              >
                <Grid3x3 className="size-3.5" />
              </button>
            </div>
          </div>

          {view === 'list' ? (
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Modified</th>
                  <th>Size</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => {
                  const TypeIcon = fileTypeIcons[f.type as keyof typeof fileTypeIcons] ?? fileTypeIcons.other;
                  return (
                    <tr key={f.id} className="cursor-pointer">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <TypeIcon.icon className={cn('size-5 shrink-0', TypeIcon.color)} />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{f.name}</div>
                            <div className="mt-0.5 flex items-center gap-1">
                              {f.signed && <Badge variant="success" className="text-2xs gap-0.5"><FileSignature className="size-2.5" /> Signed</Badge>}
                              {f.locked && <Badge variant="warning" className="text-2xs gap-0.5"><Lock className="size-2.5" /> Locked</Badge>}
                              {f.shared && <Badge variant="info" className="text-2xs gap-0.5"><Share2 className="size-2.5" /> Shared</Badge>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar size="xs">
                            <AvatarFallback style={{ backgroundColor: colorFromString(f.owner) }} className="text-2xs text-white">
                              {initials(f.owner)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{f.owner}</span>
                        </div>
                      </td>
                      <td className="text-xs text-muted-foreground">{formatRelativeTime(f.modified)}</td>
                      <td className="font-mono text-xs">{formatFileSize(f.size)}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-xs"><Download className="size-3" /></Button>
                          <Button variant="ghost" size="icon-xs"><Share2 className="size-3" /></Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-xs">
                                <MoreHorizontal className="size-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Preview</DropdownMenuItem>
                              <DropdownMenuItem>Download</DropdownMenuItem>
                              <DropdownMenuItem>Share link</DropdownMenuItem>
                              <DropdownMenuItem>Request signature</DropdownMenuItem>
                              <DropdownMenuItem>Version history</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {files.map((f) => {
                const TypeIcon = fileTypeIcons[f.type as keyof typeof fileTypeIcons] ?? fileTypeIcons.other;
                return (
                  <div key={f.id} className="rounded-lg border border-border bg-card p-3 cursor-pointer hover:shadow-md">
                    <div className="aspect-square grid place-items-center rounded bg-muted/40 mb-2">
                      <TypeIcon.icon className={cn('size-12', TypeIcon.color)} />
                    </div>
                    <div className="text-xs font-medium truncate">{f.name}</div>
                    <div className="text-2xs text-muted-foreground mt-0.5">{formatFileSize(f.size)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
