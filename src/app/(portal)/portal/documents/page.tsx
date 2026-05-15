'use client';

import { Download, File, FileSignature, FileText, Folder, ImageIcon, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatFileSize, formatDate } from '@/lib/utils';

const documents = [
  { id: 1, name: 'Master Services Agreement.pdf', type: 'pdf', size: 1240000, date: '2026-04-22', shared: 'Sarah Chen', signed: true },
  { id: 2, name: 'Statement of Work - Phase 1.pdf', type: 'pdf', size: 890000, date: '2026-04-22', shared: 'Sarah Chen', signed: true },
  { id: 3, name: 'API Documentation v2.pdf', type: 'pdf', size: 3400000, date: '2026-05-01', shared: 'Marcus Rodriguez', signed: false },
  { id: 4, name: 'Brand assets package.zip', type: 'file', size: 24500000, date: '2026-04-30', shared: 'Emma Williams', signed: false },
  { id: 5, name: 'Q1 Performance Report.pdf', type: 'pdf', size: 1840000, date: '2026-04-15', shared: 'Sarah Chen', signed: false },
];

const fileIcons: Record<string, any> = {
  pdf: { icon: FileText, color: 'text-destructive' },
  image: { icon: ImageIcon, color: 'text-warning' },
  file: { icon: File, color: 'text-muted-foreground' },
};

export default function PortalDocumentsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Documents</h1>
        <p className="text-muted-foreground">Files shared with you by Acme Corp</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-4 relative max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input placeholder="Search documents…" className="pl-8" />
          </div>

          <table className="erp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Shared by</th>
                <th>Shared on</th>
                <th>Size</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => {
                const TypeIcon = fileIcons[d.type as keyof typeof fileIcons] ?? fileIcons.file;
                return (
                  <tr key={d.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <TypeIcon.icon className={`size-5 shrink-0 ${TypeIcon.color}`} />
                        <div>
                          <div className="font-medium">{d.name}</div>
                          {d.signed && (
                            <Badge variant="success" className="text-2xs mt-0.5 gap-0.5">
                              <FileSignature className="size-2.5" /> Signed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{d.shared}</td>
                    <td className="text-sm text-muted-foreground">{formatDate(d.date)}</td>
                    <td className="font-mono text-xs">{formatFileSize(d.size)}</td>
                    <td className="text-right">
                      <Button variant="ghost" size="xs"><Download className="size-3" /> Download</Button>
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
