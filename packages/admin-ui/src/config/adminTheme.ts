/**
 * Fixed agency admin palette — same for every client storefront.
 * Scoped via CSS variables in `styles/admin-theme-vars.css` on `.admin-ui-root`.
 * Do not tie admin colors to a client's `client-config` / storefront theme.
 */
export const adminTheme = {
  bg: '#0A0A0A',
  card: '#1A1A2E',
  accent: '#FF6B00',
  accentHover: '#ff8533',
  text: '#FFFFFF',
  muted: '#9CA3AF',
  border: 'rgba(255, 255, 255, 0.1)',
  surface: '#111111',
} as const;
