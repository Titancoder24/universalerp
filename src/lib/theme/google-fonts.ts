/**
 * Curated Google Fonts catalog.
 *
 * Full Google Fonts catalog is huge, so we ship a curated list of high-quality
 * fonts that read well in dense UI surfaces. The tenant can opt to fetch
 * any other Google Font by name through Theme Studio - it will load via the
 * standard Google Fonts CSS link.
 */

export type GoogleFont = {
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
  weights: number[];
  variable?: boolean;
  popularity: number; // 1-100 informal
};

export const sansSerifFonts: GoogleFont[] = [
  { family: 'Inter', category: 'sans-serif', weights: [400, 500, 600, 700, 800], variable: true, popularity: 100 },
  { family: 'Geist', category: 'sans-serif', weights: [400, 500, 600, 700, 800], variable: true, popularity: 92 },
  { family: 'Roboto', category: 'sans-serif', weights: [400, 500, 700, 900], popularity: 98 },
  { family: 'Open Sans', category: 'sans-serif', weights: [400, 500, 600, 700, 800], variable: true, popularity: 95 },
  { family: 'Lato', category: 'sans-serif', weights: [400, 700, 900], popularity: 90 },
  { family: 'Montserrat', category: 'sans-serif', weights: [400, 500, 600, 700, 800], variable: true, popularity: 96 },
  { family: 'Poppins', category: 'sans-serif', weights: [400, 500, 600, 700, 800], popularity: 92 },
  { family: 'Manrope', category: 'sans-serif', weights: [400, 500, 600, 700, 800], variable: true, popularity: 85 },
  { family: 'DM Sans', category: 'sans-serif', weights: [400, 500, 700], popularity: 88 },
  { family: 'Plus Jakarta Sans', category: 'sans-serif', weights: [400, 500, 600, 700, 800], variable: true, popularity: 80 },
  { family: 'Nunito', category: 'sans-serif', weights: [400, 600, 700, 800], popularity: 86 },
  { family: 'Nunito Sans', category: 'sans-serif', weights: [400, 600, 700, 800], popularity: 84 },
  { family: 'Work Sans', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 82 },
  { family: 'Lexend', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 78 },
  { family: 'Outfit', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 76 },
  { family: 'IBM Plex Sans', category: 'sans-serif', weights: [400, 500, 600, 700], popularity: 80 },
  { family: 'Public Sans', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 75 },
  { family: 'Source Sans 3', category: 'sans-serif', weights: [400, 600, 700], variable: true, popularity: 82 },
  { family: 'Fira Sans', category: 'sans-serif', weights: [400, 500, 700], popularity: 70 },
  { family: 'Rubik', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 78 },
  { family: 'Karla', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 65 },
  { family: 'Mulish', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 68 },
  { family: 'Heebo', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 70 },
  { family: 'Hanken Grotesk', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 72 },
  { family: 'Onest', category: 'sans-serif', weights: [400, 500, 600, 700], variable: true, popularity: 60 },
];

export const serifFonts: GoogleFont[] = [
  { family: 'Lora', category: 'serif', weights: [400, 500, 600, 700], variable: true, popularity: 85 },
  { family: 'Merriweather', category: 'serif', weights: [400, 700, 900], popularity: 80 },
  { family: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800], variable: true, popularity: 88 },
  { family: 'Source Serif 4', category: 'serif', weights: [400, 600, 700], variable: true, popularity: 78 },
  { family: 'IBM Plex Serif', category: 'serif', weights: [400, 500, 600, 700], popularity: 70 },
  { family: 'EB Garamond', category: 'serif', weights: [400, 500, 600, 700], variable: true, popularity: 65 },
  { family: 'Crimson Pro', category: 'serif', weights: [400, 500, 600, 700], variable: true, popularity: 68 },
  { family: 'Cormorant', category: 'serif', weights: [400, 500, 600, 700], variable: true, popularity: 60 },
  { family: 'PT Serif', category: 'serif', weights: [400, 700], popularity: 70 },
  { family: 'Roboto Slab', category: 'serif', weights: [400, 500, 600, 700], variable: true, popularity: 78 },
  { family: 'Libre Baskerville', category: 'serif', weights: [400, 700], popularity: 62 },
  { family: 'DM Serif Display', category: 'serif', weights: [400], popularity: 70 },
  { family: 'Bitter', category: 'serif', weights: [400, 500, 600, 700], variable: true, popularity: 60 },
  { family: 'Vollkorn', category: 'serif', weights: [400, 500, 600, 700], variable: true, popularity: 55 },
];

export const monospaceFonts: GoogleFont[] = [
  { family: 'JetBrains Mono', category: 'monospace', weights: [400, 500, 700], variable: true, popularity: 95 },
  { family: 'Fira Code', category: 'monospace', weights: [400, 500, 600, 700], variable: true, popularity: 90 },
  { family: 'IBM Plex Mono', category: 'monospace', weights: [400, 500, 600, 700], popularity: 80 },
  { family: 'Source Code Pro', category: 'monospace', weights: [400, 500, 600, 700], variable: true, popularity: 78 },
  { family: 'Roboto Mono', category: 'monospace', weights: [400, 500, 700], variable: true, popularity: 85 },
  { family: 'Space Mono', category: 'monospace', weights: [400, 700], popularity: 65 },
  { family: 'Inconsolata', category: 'monospace', weights: [400, 500, 700], variable: true, popularity: 70 },
  { family: 'DM Mono', category: 'monospace', weights: [400, 500], popularity: 60 },
  { family: 'Geist Mono', category: 'monospace', weights: [400, 500, 600, 700], variable: true, popularity: 82 },
  { family: 'Ubuntu Mono', category: 'monospace', weights: [400, 700], popularity: 55 },
  { family: 'Cascadia Code', category: 'monospace', weights: [400, 500, 700], variable: true, popularity: 75 },
];

export const displayFonts: GoogleFont[] = [
  { family: 'Bebas Neue', category: 'display', weights: [400], popularity: 80 },
  { family: 'Oswald', category: 'display', weights: [400, 500, 600, 700], variable: true, popularity: 85 },
  { family: 'Archivo', category: 'display', weights: [400, 500, 600, 700, 800], variable: true, popularity: 70 },
  { family: 'Anton', category: 'display', weights: [400], popularity: 75 },
  { family: 'Abril Fatface', category: 'display', weights: [400], popularity: 65 },
  { family: 'Righteous', category: 'display', weights: [400], popularity: 55 },
  { family: 'Major Mono Display', category: 'display', weights: [400], popularity: 50 },
];

export const allFonts: GoogleFont[] = [
  ...sansSerifFonts,
  ...serifFonts,
  ...monospaceFonts,
  ...displayFonts,
];

export function getFont(family: string): GoogleFont | undefined {
  return allFonts.find((f) => f.family === family);
}

export function googleFontLinkHref(families: string[]): string {
  const params = families
    .filter(Boolean)
    .map((family) => {
      const font = getFont(family);
      const weights = font?.weights ?? [400, 500, 600, 700];
      const weightSpec = font?.variable
        ? `wght@${weights[0]}..${weights[weights.length - 1]}`
        : `wght@${weights.join(';')}`;
      return `family=${encodeURIComponent(family)}:${weightSpec}`;
    })
    .join('&');
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}
