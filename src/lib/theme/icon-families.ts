/**
 * 18 Icon Families
 *
 * Every icon across the application resolves through a family resolver.
 * For build size, we ship Lucide as the default and lazy-load others on
 * demand via the `IconRenderer` component.
 */

export type IconFamily = {
  id: string;
  name: string;
  description: string;
  weights?: string[];
  // Display style of stock icons
  style: 'outline' | 'solid' | 'duotone' | 'mixed';
};

export const iconFamilies: IconFamily[] = [
  {
    id: 'lucide',
    name: 'Lucide',
    description: 'Modern, clean, the open-source standard. Default family.',
    style: 'outline',
  },
  {
    id: 'heroicons',
    name: 'Heroicons',
    description: 'Tailwind’s family, available in outline and solid weights.',
    weights: ['outline', 'solid', 'mini'],
    style: 'mixed',
  },
  {
    id: 'phosphor',
    name: 'Phosphor',
    description: 'Six weights for tunable visual density.',
    weights: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    style: 'mixed',
  },
  {
    id: 'tabler',
    name: 'Tabler Icons',
    description: 'Thousands of consistent line icons. Excellent ERP coverage.',
    style: 'outline',
  },
  {
    id: 'feather',
    name: 'Feather',
    description: 'Ultra-minimal thin line icons.',
    style: 'outline',
  },
  {
    id: 'remix',
    name: 'Remix Icon',
    description: 'Huge business-oriented library with line and filled variants.',
    weights: ['line', 'fill'],
    style: 'mixed',
  },
  {
    id: 'iconoir',
    name: 'Iconoir',
    description: 'Modern with character. Friendly and approachable.',
    style: 'outline',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap Icons',
    description: 'Classic Bootstrap. Familiar to admin-template buyers.',
    weights: ['regular', 'fill'],
    style: 'mixed',
  },
  {
    id: 'material',
    name: 'Material Symbols',
    description: 'Google’s variable-axis font. Weight, fill, optical size all tunable.',
    weights: ['outlined', 'rounded', 'sharp'],
    style: 'mixed',
  },
  {
    id: 'fontawesome',
    name: 'Font Awesome',
    description: 'Decades-old classic with the largest brand coverage.',
    weights: ['solid', 'regular', 'light', 'thin', 'duotone'],
    style: 'mixed',
  },
  {
    id: 'carbon',
    name: 'Carbon',
    description: 'IBM enterprise. Strict pixel grid alignment.',
    style: 'outline',
  },
  {
    id: 'fluent',
    name: 'Fluent UI',
    description: 'Microsoft Fluent. Outline and filled variants.',
    weights: ['regular', 'filled'],
    style: 'mixed',
  },
  {
    id: 'iconsax',
    name: 'Iconsax',
    description: 'Six styles per icon for flexible visual treatment.',
    weights: ['linear', 'outline', 'broken', 'bold', 'bulk', 'twotone'],
    style: 'mixed',
  },
  {
    id: 'ionicons',
    name: 'Ionicons',
    description: 'Mobile-feel icons. Outline, filled, and sharp variants.',
    weights: ['outline', 'sharp', 'fill'],
    style: 'mixed',
  },
  {
    id: 'mingcute',
    name: 'Mingcute',
    description: 'Modern playful. Great for consumer-facing tenants.',
    weights: ['line', 'fill'],
    style: 'mixed',
  },
  {
    id: 'octicons',
    name: 'Octicons',
    description: 'GitHub’s icon set. Pairs perfectly with GitHub Primer theme.',
    style: 'outline',
  },
  {
    id: 'boxicons',
    name: 'Boxicons',
    description: 'Multi-style classic. Solid, regular, and logo coverage.',
    weights: ['regular', 'solid', 'logos'],
    style: 'mixed',
  },
  {
    id: 'solar',
    name: 'Solar',
    description: 'Linear-quality icons with five styles. Modern indie favorite.',
    weights: ['linear', 'outline', 'broken', 'bold', 'bold-duotone'],
    style: 'mixed',
  },
];

export const defaultIconFamily = 'lucide';

export const iconFamiliesById = Object.fromEntries(iconFamilies.map((f) => [f.id, f]));

export function getIconFamily(id: string): IconFamily {
  return iconFamiliesById[id] ?? iconFamilies[0];
}
