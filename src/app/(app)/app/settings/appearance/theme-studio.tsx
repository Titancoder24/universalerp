'use client';

import * as React from 'react';
import { Check, Eye, RotateCcw, Save, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { themePresets, defaultPresetId } from '@/lib/theme/presets';
import { iconFamilies } from '@/lib/theme/icon-families';
import { sansSerifFonts, serifFonts, monospaceFonts, displayFonts } from '@/lib/theme/google-fonts';
import { useERPTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { ThemePreview } from './theme-preview';

const SIDEBAR_LAYOUTS = [
  { id: 'left-fixed', name: 'Left Fixed', description: 'Full-width left rail, always visible' },
  { id: 'compact-icon', name: 'Compact Icon', description: 'Icon-only rail with hover-expand' },
  { id: 'two-level', name: 'Two-Level', description: 'Primary icons + secondary panel' },
  { id: 'top-left', name: 'Top + Left', description: 'Horizontal nav + left sub-rail' },
  { id: 'top-only', name: 'Top Only', description: 'Horizontal nav only, no sidebar' },
];

export function ThemeStudio() {
  const { resolved, setPreset, setIconFamily, setDensity, setSidebarLayout, setFonts, setButtonShape, setShadowScale, setMotion } = useERPTheme();
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Theme Studio"
        description="Pick a preset, then fine-tune every visual choice. Changes apply live across your workspace."
        actions={
          <>
            <Button variant="outline" onClick={() => setPreset(defaultPresetId)}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              {saved ? <Check className="size-4" /> : <Save className="size-4" />}
              {saved ? 'Saved' : 'Save changes'}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Customization tabs */}
        <Tabs defaultValue="presets" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="presets">Preset Library</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="layout">Sidebar Layout</TabsTrigger>
            <TabsTrigger value="density">Density</TabsTrigger>
            <TabsTrigger value="shape">Shape</TabsTrigger>
            <TabsTrigger value="motion">Motion</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>25 Visual Presets</CardTitle>
                <CardDescription>
                  Pick a starting personality, then customize from there. Each preset is a complete bundle of colors,
                  radii, shadows, and motion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {themePresets.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      active={resolved.presetId === preset.id}
                      onSelect={() => setPreset(preset.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="identity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity</CardTitle>
                <CardDescription>Your logo and app name appear throughout the workspace and customer portals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>App Name</Label>
                  <Input defaultValue="Acme Corp" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Logo (square, 256x256)</Label>
                    <div className="grid h-32 place-items-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:bg-muted/40 cursor-pointer">
                      Drop image or click to upload
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Favicon (32x32)</Label>
                    <div className="grid h-32 place-items-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground hover:bg-muted/40 cursor-pointer">
                      Drop image or click to upload
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Login background</Label>
                  <Select defaultValue="gradient">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Subtle gradient</SelectItem>
                      <SelectItem value="solid">Solid color</SelectItem>
                      <SelectItem value="image">Custom image</SelectItem>
                      <SelectItem value="pattern">Geometric pattern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  Pick fonts for sans-serif (UI), serif (formal documents), monospace (code/numbers), and display
                  (headlines). All fonts load via Google Fonts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FontPicker label="Sans-serif (primary)" value={resolved.font.sans} onChange={(v) => setFonts({ ...resolved.font, sans: v })} options={sansSerifFonts} />
                <FontPicker label="Serif (documents)" value={resolved.font.serif} onChange={(v) => setFonts({ ...resolved.font, serif: v })} options={serifFonts} />
                <FontPicker label="Monospace (code & numerics)" value={resolved.font.mono} onChange={(v) => setFonts({ ...resolved.font, mono: v })} options={monospaceFonts} />
                <FontPicker label="Display (headlines)" value={resolved.font.display ?? resolved.font.sans} onChange={(v) => setFonts({ ...resolved.font, display: v })} options={[...displayFonts, ...sansSerifFonts]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="icons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Icon Family</CardTitle>
                <CardDescription>Every icon across the app uses the family you pick here.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {iconFamilies.map((family) => (
                    <button
                      key={family.id}
                      onClick={() => setIconFamily(family.id)}
                      className={cn(
                        'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all',
                        resolved.iconFamily === family.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="font-medium">{family.name}</div>
                        {resolved.iconFamily === family.id && (
                          <Check className="size-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{family.description}</p>
                      {family.weights && (
                        <div className="flex flex-wrap gap-1">
                          {family.weights.slice(0, 3).map((w) => (
                            <Badge key={w} variant="outline" className="text-2xs">{w}</Badge>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sidebar Layout</CardTitle>
                <CardDescription>Pick the layout that fits your team's workflow.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={resolved.sidebarLayout}
                  onValueChange={(v) => setSidebarLayout(v as any)}
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {SIDEBAR_LAYOUTS.map((l) => (
                    <label
                      key={l.id}
                      className={cn(
                        'flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-all',
                        resolved.sidebarLayout === l.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <RadioGroupItem value={l.id} className="sr-only" />
                      <SidebarLayoutPreview id={l.id} />
                      <div>
                        <div className="font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">{l.description}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="density" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Density</CardTitle>
                <CardDescription>Spacing and row heights across the entire app.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={resolved.density}
                  onValueChange={(v) => setDensity(v as any)}
                  className="grid gap-3 sm:grid-cols-3"
                >
                  {[
                    { id: 'compact', name: 'Compact', desc: 'Maximize information density' },
                    { id: 'standard', name: 'Standard', desc: 'Balanced default' },
                    { id: 'cozy', name: 'Cozy', desc: 'Generous spacing for comfort' },
                  ].map((d) => (
                    <label
                      key={d.id}
                      className={cn(
                        'flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-4',
                        resolved.density === d.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <RadioGroupItem value={d.id} className="sr-only" />
                      <div className="w-full space-y-1">
                        <div className={cn('h-2 w-3/4 rounded bg-foreground/20', d.id === 'compact' && 'h-1.5', d.id === 'cozy' && 'h-2.5')} />
                        <div className={cn('h-2 w-1/2 rounded bg-foreground/20', d.id === 'compact' && 'h-1.5', d.id === 'cozy' && 'h-2.5')} />
                        <div className={cn('h-2 w-2/3 rounded bg-foreground/20', d.id === 'compact' && 'h-1.5', d.id === 'cozy' && 'h-2.5')} />
                      </div>
                      <div>
                        <div className="font-medium">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.desc}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shape" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Button Shape</CardTitle>
                <CardDescription>The corner radius of buttons and form fields.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={resolved.buttonShape} onValueChange={(v) => setButtonShape(v as any)} className="grid gap-3 sm:grid-cols-4">
                  {[
                    { id: 'sharp', name: 'Sharp' },
                    { id: 'rounded', name: 'Rounded' },
                    { id: 'soft', name: 'Soft' },
                    { id: 'pill', name: 'Pill' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={cn(
                        'flex cursor-pointer flex-col items-start gap-3 rounded-lg border p-4',
                        resolved.buttonShape === s.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <RadioGroupItem value={s.id} className="sr-only" />
                      <Button
                        size="sm"
                        className={cn(
                          'pointer-events-none',
                          s.id === 'sharp' && 'rounded-none',
                          s.id === 'rounded' && 'rounded-md',
                          s.id === 'soft' && 'rounded-xl',
                          s.id === 'pill' && 'rounded-full',
                        )}
                      >
                        Button
                      </Button>
                      <div className="font-medium text-sm">{s.name}</div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shadow Style</CardTitle>
                <CardDescription>Depth and elevation across cards, modals, and dropdowns.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={resolved.shadowScale} onValueChange={(v) => setShadowScale(v as any)} className="grid gap-3 sm:grid-cols-4">
                  {[
                    { id: 'flat', name: 'Flat' },
                    { id: 'subtle', name: 'Subtle' },
                    { id: 'standard', name: 'Standard' },
                    { id: 'pronounced', name: 'Pronounced' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={cn(
                        'flex cursor-pointer flex-col items-center gap-3 rounded-lg border p-4',
                        resolved.shadowScale === s.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <RadioGroupItem value={s.id} className="sr-only" />
                      <div
                        className={cn(
                          'h-12 w-20 rounded-md bg-card',
                          s.id === 'flat' && 'border border-border',
                          s.id === 'subtle' && 'shadow-sm',
                          s.id === 'standard' && 'shadow-md',
                          s.id === 'pronounced' && 'shadow-xl',
                        )}
                      />
                      <div className="font-medium text-sm">{s.name}</div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="motion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Motion</CardTitle>
                <CardDescription>How fast or expressive animations feel across the app.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={resolved.motion} onValueChange={(v) => setMotion(v as any)} className="grid gap-3 sm:grid-cols-4">
                  {[
                    { id: 'instant', name: 'Instant', desc: 'No animations' },
                    { id: 'fast', name: 'Fast', desc: '100-150ms' },
                    { id: 'normal', name: 'Normal', desc: '180-260ms' },
                    { id: 'lush', name: 'Lush', desc: '350-500ms' },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={cn(
                        'flex cursor-pointer flex-col gap-2 rounded-lg border p-4',
                        resolved.motion === m.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                    >
                      <RadioGroupItem value={m.id} className="sr-only" />
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Live preview */}
        <div className="xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Live Preview</CardTitle>
                <Badge variant="soft"><Eye className="size-3" /> Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ThemePreview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface PresetCardProps {
  preset: (typeof themePresets)[number];
  active: boolean;
  onSelect: () => void;
}

function PresetCard({ preset, active, onSelect }: PresetCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex flex-col gap-3 rounded-lg border p-3 text-left transition-all',
        active
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-foreground/30',
      )}
    >
      {/* Mini swatch */}
      <div className="relative overflow-hidden rounded-md border border-border h-24"
        style={{
          background: `hsl(${preset.light.background})`,
        }}
      >
        <div className="absolute inset-x-0 top-0 h-8 border-b border-border"
          style={{ background: `hsl(${preset.light.sidebarBg})` }}
        />
        <div className="absolute right-2 top-2 h-3 w-3 rounded-full" style={{ background: `hsl(${preset.light.primary})` }} />
        <div className="absolute right-7 top-2 h-3 w-3 rounded-full" style={{ background: `hsl(${preset.light.success})` }} />
        <div className="absolute bottom-2 left-2 right-2 space-y-1">
          <div className="h-2 w-3/4 rounded" style={{ background: `hsl(${preset.light.foreground} / 0.7)` }} />
          <div className="h-2 w-1/2 rounded" style={{ background: `hsl(${preset.light.foreground} / 0.3)` }} />
        </div>
        <div className="absolute bottom-2 right-2 h-5 w-12 rounded text-2xs font-medium grid place-items-center text-white"
          style={{ background: `hsl(${preset.light.primary})` }}
        >
          Button
        </div>
        {active && (
          <div className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{preset.name}</span>
          <Badge variant="outline" className="text-2xs">{preset.family}</Badge>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground">{preset.description}</p>
      </div>
    </button>
  );
}

function FontPicker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { family: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((f) => (
            <SelectItem key={f.family} value={f.family}>
              {f.family}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground" style={{ fontFamily: `'${value}', sans-serif` }}>
        The quick brown fox jumps over the lazy dog. 1234567890
      </p>
    </div>
  );
}

function SidebarLayoutPreview({ id }: { id: string }) {
  if (id === 'left-fixed') {
    return (
      <div className="grid h-20 grid-cols-4 gap-px overflow-hidden rounded border border-border bg-border">
        <div className="bg-sidebar p-1">
          <div className="space-y-1">
            {[1, 2, 3].map((i) => <div key={i} className="h-1.5 rounded bg-sidebar-foreground/30" />)}
          </div>
        </div>
        <div className="col-span-3 bg-card p-1">
          <div className="h-2 w-1/3 rounded bg-foreground/30" />
        </div>
      </div>
    );
  }
  if (id === 'compact-icon') {
    return (
      <div className="grid h-20 grid-cols-[24px_1fr] gap-px overflow-hidden rounded border border-border bg-border">
        <div className="bg-sidebar p-1 space-y-1.5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-sidebar-foreground/30 mx-auto" />)}
        </div>
        <div className="bg-card p-1">
          <div className="h-2 w-1/3 rounded bg-foreground/30" />
        </div>
      </div>
    );
  }
  if (id === 'two-level') {
    return (
      <div className="grid h-20 grid-cols-[24px_60px_1fr] gap-px overflow-hidden rounded border border-border bg-border">
        <div className="bg-sidebar p-1 space-y-1.5">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-sidebar-foreground/30 mx-auto" />)}
        </div>
        <div className="bg-sidebar/60 p-1 space-y-1">
          {[1, 2, 3].map((i) => <div key={i} className="h-1.5 rounded bg-sidebar-foreground/30" />)}
        </div>
        <div className="bg-card p-1">
          <div className="h-2 w-1/3 rounded bg-foreground/30" />
        </div>
      </div>
    );
  }
  if (id === 'top-left') {
    return (
      <div className="overflow-hidden rounded border border-border">
        <div className="flex gap-1 bg-sidebar p-1">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-1.5 w-6 rounded bg-sidebar-foreground/30" />)}
        </div>
        <div className="grid grid-cols-4 gap-px bg-border" style={{ height: '60px' }}>
          <div className="bg-sidebar/60 p-1 space-y-1">
            {[1, 2, 3].map((i) => <div key={i} className="h-1.5 rounded bg-sidebar-foreground/30" />)}
          </div>
          <div className="col-span-3 bg-card p-1">
            <div className="h-2 w-1/3 rounded bg-foreground/30" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded border border-border">
      <div className="flex gap-1 bg-sidebar p-1">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-1.5 w-6 rounded bg-sidebar-foreground/30" />)}
      </div>
      <div className="bg-card p-1" style={{ height: '60px' }}>
        <div className="h-2 w-1/3 rounded bg-foreground/30" />
      </div>
    </div>
  );
}
