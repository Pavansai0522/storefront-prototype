/**
 * Storefront palette (Bala Digital Xpress — navy/blue, red accents).
 * Tailwind `brand.*` uses CSS vars from `src/styles/storefront-theme.css` on `:root`.
 * Admin uses a separate fixed theme on `.admin-ui-root` (see admin-ui adminTheme.ts).
 */
export const brandColors = {
  bg: '#FFFFFF',
  card: '#F8FAFC',
  accent: '#E31E24',
  accentHover: '#C81A1F',
  accentBlue: '#1D4ED8',
  accentBlueHover: '#1E40AF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  surface: '#F1F5F9',
  accentGlowRgb: '227, 30, 36',
} as const;
