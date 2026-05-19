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
        brand: {
          bg: clientConfig.theme.colors.bg,
          card: clientConfig.theme.colors.card,
          saffron: clientConfig.theme.colors.accent,
          text: clientConfig.theme.colors.text,
          saffronHover: clientConfig.theme.colors.accentHover,
        },
        surface: {
          sidebar: '#111111',
          rowAlt: '#1A1A1A',
        },
      },
      fontFamily: {
        display: clientConfig.theme.fonts.display,
        sans: clientConfig.theme.fonts.sans
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
