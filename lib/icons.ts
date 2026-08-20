import companyIcons from '@/data/companyIcons.json';

export type BrandIcon = { title: string; hex: string; path: string };

const icons = companyIcons as Record<string, BrandIcon>;

export function brandIcon(companyKey: string): BrandIcon | undefined {
  return icons[companyKey];
}

/** WCAG relative luminance of a #rrggbb colour. */
function luminance(hex: string) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Plenty of brand marks are black or near-black, which disappears against the
 * dark canvas. Those fall back to white; everything else keeps its own colour.
 */
export function onDarkSurface(hex: string) {
  return luminance(hex) < 0.06 ? '#ffffff' : hex;
}
