import type { Config } from 'tailwindcss';
import { clientConfig } from './src/config/client-config';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../packages/admin-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /** Storefront `:root` + admin `.admin-ui-root` CSS variables (see theme CSS files). */
        brand: {
          bg: 'rgb(var(--brand-bg-rgb) / <alpha-value>)',
          card: 'rgb(var(--brand-card-rgb) / <alpha-value>)',
          saffron: 'rgb(var(--brand-accent-rgb) / <alpha-value>)',
          saffronHover: 'rgb(var(--brand-accent-hover-rgb) / <alpha-value>)',
          blue: 'rgb(var(--brand-blue-rgb) / <alpha-value>)',
          blueHover: 'rgb(var(--brand-blue-hover-rgb) / <alpha-value>)',
          text: 'rgb(var(--brand-text-rgb) / <alpha-value>)',
          muted: 'rgb(var(--brand-muted-rgb) / <alpha-value>)',
          border: 'rgb(var(--brand-border-rgb) / <alpha-value>)',
          surface: 'rgb(var(--brand-surface-rgb) / <alpha-value>)',
        },
        surface: {
          sidebar: '#111111',
          rowAlt: '#1A1A1A',
        },
      },
      fontFamily: {
        display: clientConfig.theme.fonts.display,
        sans: clientConfig.theme.fonts.sans,
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
