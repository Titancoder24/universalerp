'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import {
  applyThemeToDocument,
  presetToResolvedTheme,
  type ResolvedTheme,
} from '@/lib/theme/runtime';
import { defaultPresetId } from '@/lib/theme/presets';

interface ThemeContextValue {
  resolved: ResolvedTheme;
  setPreset: (presetId: string) => void;
  setIconFamily: (family: string) => void;
  setDensity: (density: ResolvedTheme['density']) => void;
  setSidebarLayout: (layout: ResolvedTheme['sidebarLayout']) => void;
  setFonts: (fonts: ResolvedTheme['font']) => void;
  setButtonShape: (shape: ResolvedTheme['buttonShape']) => void;
  setShadowScale: (scale: ResolvedTheme['shadowScale']) => void;
  setMotion: (motion: ResolvedTheme['motion']) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  initialPresetId?: string;
  initialIconFamily?: string;
  initialDensity?: ResolvedTheme['density'];
  initialSidebarLayout?: ResolvedTheme['sidebarLayout'];
  initialFonts?: ResolvedTheme['font'];
  children: React.ReactNode;
}

export function ThemeProvider({
  initialPresetId = defaultPresetId,
  initialIconFamily,
  initialDensity,
  initialSidebarLayout = 'left-fixed',
  initialFonts,
  children,
}: ThemeProviderProps) {
  const [resolved, setResolved] = React.useState<ResolvedTheme>(() => {
    const base = presetToResolvedTheme(initialPresetId);
    return {
      ...base,
      iconFamily: initialIconFamily ?? base.iconFamily,
      density: initialDensity ?? base.density,
      sidebarLayout: initialSidebarLayout,
      font: initialFonts ?? base.font,
    };
  });

  React.useEffect(() => {
    applyThemeToDocument(resolved);
  }, [resolved]);

  const setPreset = React.useCallback((presetId: string) => {
    setResolved((prev) => {
      const next = presetToResolvedTheme(presetId);
      // Preserve user-customized non-palette tokens
      return { ...next, iconFamily: prev.iconFamily, density: prev.density, sidebarLayout: prev.sidebarLayout };
    });
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      resolved,
      setPreset,
      setIconFamily: (iconFamily) => setResolved((p) => ({ ...p, iconFamily })),
      setDensity: (density) => setResolved((p) => ({ ...p, density })),
      setSidebarLayout: (sidebarLayout) => setResolved((p) => ({ ...p, sidebarLayout })),
      setFonts: (font) => setResolved((p) => ({ ...p, font })),
      setButtonShape: (buttonShape) => setResolved((p) => ({ ...p, buttonShape })),
      setShadowScale: (shadowScale) => setResolved((p) => ({ ...p, shadowScale })),
      setMotion: (motion) => setResolved((p) => ({ ...p, motion })),
    }),
    [resolved, setPreset],
  );

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export function useERPTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useERPTheme must be used within ThemeProvider');
  return ctx;
}
