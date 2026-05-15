import { Check, Palette, Pin } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { themePresets } from '@/lib/theme/presets';

export default function AdminThemesPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Theme Library"
        description="Curate the 25 presets available to tenants. Pin recommendations, hide internal-only options."
      />

      <Card>
        <CardHeader>
          <CardTitle>Available Presets ({themePresets.length})</CardTitle>
          <CardDescription>Every theme is a complete bundle of colors, radii, shadows, motion, and button shape.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themePresets.map((preset) => (
              <Card key={preset.id} className="overflow-hidden">
                <div
                  className="relative h-32"
                  style={{ background: `hsl(${preset.light.background})` }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-10 border-b"
                    style={{ background: `hsl(${preset.light.sidebarBg})`, borderColor: `hsl(${preset.light.sidebarBorder})` }}
                  />
                  <div className="absolute right-3 top-3 h-3 w-3 rounded-full" style={{ background: `hsl(${preset.light.primary})` }} />
                  <div className="absolute right-8 top-3 h-3 w-3 rounded-full" style={{ background: `hsl(${preset.light.success})` }} />
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <div className="h-2 w-3/4 rounded" style={{ background: `hsl(${preset.light.foreground} / 0.7)` }} />
                    <div className="h-2 w-1/2 rounded" style={{ background: `hsl(${preset.light.foreground} / 0.3)` }} />
                  </div>
                  <div
                    className="absolute bottom-3 right-3 px-2 py-1 text-2xs font-medium text-white rounded"
                    style={{ background: `hsl(${preset.light.primary})` }}
                  >
                    Button
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{preset.name}</div>
                      <Badge variant="outline" className="text-2xs mt-0.5">{preset.family}</Badge>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{preset.description}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Button variant="ghost" size="xs"><Pin className="size-3" /> Pin</Button>
                    <Button variant="ghost" size="xs">Preview</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
