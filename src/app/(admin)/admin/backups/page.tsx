import { ArrowDown, Cloud, Database, Download, Plus, RotateCcw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatFileSize } from '@/lib/utils';

const backups = [
  { id: 'bkp-001', type: 'auto', when: new Date(Date.now() - 1000 * 60 * 60 * 2), size: 1240 * 1024 * 1024, status: 'complete' },
  { id: 'bkp-002', type: 'auto', when: new Date(Date.now() - 1000 * 60 * 60 * 26), size: 1235 * 1024 * 1024, status: 'complete' },
  { id: 'bkp-003', type: 'auto', when: new Date(Date.now() - 1000 * 60 * 60 * 50), size: 1228 * 1024 * 1024, status: 'complete' },
  { id: 'bkp-004', type: 'manual', when: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), size: 1218 * 1024 * 1024, status: 'complete' },
  { id: 'bkp-005', type: 'auto', when: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), size: 1205 * 1024 * 1024, status: 'complete' },
];

export default function AdminBackupsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Backups"
        description="Point-in-time recovery, daily snapshots, and cross-region replication for disaster recovery."
        actions={
          <>
            <Button variant="outline"><RotateCcw className="size-4" /> Restore</Button>
            <Button><Plus className="size-4" /> Backup now</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-success/15 text-success">
              <Database className="size-4" />
            </div>
            <div className="mt-3 text-2xl font-semibold">Healthy</div>
            <div className="text-xs text-muted-foreground">All backups complete · Last: 2h ago</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <Cloud className="size-4" />
            </div>
            <div className="mt-3 text-2xl font-semibold">42 GB</div>
            <div className="text-xs text-muted-foreground">Backup storage used</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-info/10 text-info">
              <ArrowDown className="size-4" />
            </div>
            <div className="mt-3 text-2xl font-semibold">14 days</div>
            <div className="text-xs text-muted-foreground">Point-in-time recovery window</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backup schedule</CardTitle>
          <CardDescription>Automatic backups run every 6 hours. Manual backups can be triggered anytime.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Backup ID</th>
                <th>Type</th>
                <th>Created</th>
                <th>Size</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono text-xs">{b.id}</td>
                  <td>
                    <Badge variant={b.type === 'auto' ? 'outline' : 'soft'}>{b.type}</Badge>
                  </td>
                  <td className="text-sm">{formatRelativeTime(b.when)}</td>
                  <td className="font-mono text-xs">{formatFileSize(b.size)}</td>
                  <td><Badge variant="success">{b.status}</Badge></td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="xs"><Download className="size-3" /> Download</Button>
                      <Button variant="ghost" size="xs"><RotateCcw className="size-3" /> Restore</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
