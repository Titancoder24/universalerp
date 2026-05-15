/**
 * Theme runtime - applies a ThemePreset (or custom token bag) onto the
 * <html> element by writing CSS variables.
 *
 * Used by both server (initial paint) and client (live updates via realtime).
 */

import { getPreset, type ThemePreset, type ThemePalette } from './presets';

export interface ResolvedTheme {
  presetId: string;
  iconFamily: string;
  density: 'compact' | 'standard' | 'cozy';
  font: { sans: string; serif: string; mono: string; display?: string };
  sidebarLayout: 'left-fixed' | 'compact-icon' | 'two-level' | 'top-left' | 'top-only';
  buttonShape: 'sharp' | 'rounded' | 'pill' | 'soft';
  shadowScale: 'subtle' | 'standard' | 'pronounced' | 'flat';
  motion: 'instant' | 'fast' | 'normal' | 'lush';
  customTokens?: Record<string, string>;
}

const PALETTE_TO_CSS_VAR: Record<keyof ThemePalette, string> = {
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  primaryMuted: '--primary-muted',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  success: '--success',
  successForeground: '--success-foreground',
  warning: '--warning',
  warningForeground: '--warning-foreground',
  info: '--info',
  infoForeground: '--info-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
  sidebarBg: '--sidebar-bg',
  sidebarFg: '--sidebar-fg',
  sidebarAccent: '--sidebar-accent',
  sidebarAccentFg: '--sidebar-accent-fg',
  sidebarBorder: '--sidebar-border',
  sidebarRing: '--sidebar-ring',
  chart1: '--chart-1',
  chart2: '--chart-2',
  chart3: '--chart-3',
  chart4: '--chart-4',
  chart5: '--chart-5',
  chart6: '--chart-6',
  chart7: '--chart-7',
  chart8: '--chart-8',
};

export function paletteToCSSText(palette: ThemePalette, prefix = ''): string {
  return Object.entries(palette)
    .map(([key, value]) => {
      const cssVar = PALETTE_TO_CSS_VAR[key as keyof ThemePalette];
      return cssVar ? `${prefix}${cssVar}: ${value};` : '';
    })
    .filter(Boolean)
    .join('\n');
}

/**
 * Generate a complete <style> tag content for a resolved theme that supports
 * dark mode via the .dark class.
 */
export function themeToInlineStyles(resolved: ResolvedTheme): string {
  const preset = getPreset(resolved.presetId);
  const lines: string[] = [];

  lines.push(':root {');
  lines.push(paletteToCSSText(preset.light, '  '));
  lines.push(`  --radius: ${preset.radius};`);
  lines.push(`  --font-sans: '${resolved.font.sans}', system-ui, sans-serif;`);
  lines.push(`  --font-serif: '${resolved.font.serif}', Georgia, serif;`);
  lines.push(`  --font-mono: '${resolved.font.mono}', ui-monospace, monospace;`);
  if (resolved.font.display) {
    lines.push(`  --font-display: '${resolved.font.display}', var(--font-sans);`);
  }
  // Custom token overrides
  if (resolved.customTokens) {
    Object.entries(resolved.customTokens).forEach(([k, v]) => {
      lines.push(`  ${k}: ${v};`);
    });
  }
  lines.push('}');

  lines.push('.dark {');
  lines.push(paletteToCSSText(preset.dark, '  '));
  lines.push('}');

  return lines.join('\n');
}

/**
 * Get the CSS class chain to apply on <html>/<body> for non-color tokens.
 */
export function themeClassNames(resolved: ResolvedTheme): string {
  const classes: string[] = [];
  classes.push(`density-${resolved.density}`);
  classes.push(`shadow-scale-${resolved.shadowScale}`);
  classes.push(`motion-${resolved.motion}`);
  classes.push(`button-shape-${resolved.buttonShape}`);
  classes.push(`sidebar-layout-${resolved.sidebarLayout}`);
  classes.push(`theme-${resolved.presetId}`);
  classes.push(`icons-${resolved.iconFamily}`);
  return classes.join(' ');
}

export function presetToResolvedTheme(presetId: string): ResolvedTheme {
  const preset = getPreset(presetId);
  return {
    presetId,
    iconFamily: preset.recommendedIcons,
    density: preset.density,
    font: preset.defaultFont,
    sidebarLayout: 'left-fixed',
    buttonShape: preset.buttonShape,
    shadowScale: preset.shadowScale,
    motion: preset.motion,
  };
}

/**
 * Client-side hook to swap themes live.
 * Writes new CSS vars onto :root directly, no FOUC.
 */
export function applyThemeToDocument(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const preset = getPreset(resolved.presetId);
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  const palette = isDark ? preset.dark : preset.light;

  Object.entries(palette).forEach(([key, value]) => {
    const cssVar = PALETTE_TO_CSS_VAR[key as keyof ThemePalette];
    if (cssVar) root.style.setProperty(cssVar, value);
  });
  root.style.setProperty('--radius', preset.radius);
  root.style.setProperty('--font-sans', `'${resolved.font.sans}', system-ui, sans-serif`);
  root.style.setProperty('--font-serif', `'${resolved.font.serif}', Georgia, serif`);
  root.style.setProperty('--font-mono', `'${resolved.font.mono}', ui-monospace, monospace`);
  if (resolved.font.display) {
    root.style.setProperty('--font-display', `'${resolved.font.display}', var(--font-sans)`);
  }

  // Replace class-based tokens
  const classes = themeClassNames(resolved).split(' ');
  // Strip old theme/icons/density/motion/shape classes
  const existing = Array.from(root.classList);
  existing.forEach((c) => {
    if (
      c.startsWith('theme-') ||
      c.startsWith('icons-') ||
      c.startsWith('density-') ||
      c.startsWith('shadow-scale-') ||
      c.startsWith('motion-') ||
      c.startsWith('button-shape-') ||
      c.startsWith('sidebar-layout-')
    ) {
      root.classList.remove(c);
    }
  });
  classes.forEach((c) => root.classList.add(c));
}
