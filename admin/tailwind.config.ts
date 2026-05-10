import type { Config } from 'tailwindcss';

/** Must match client `src/config/client-config.ts` theme (fonts + brand colors). */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0A0A0A',
          card: '#1A1A2E',
          saffron: '#FF6B00',
          saffronHover: '#ff8533',
          text: '#FFFFFF',
        },
        surface: {
          sidebar: '#111111',
          rowAlt: '#1A1A1A',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
