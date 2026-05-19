import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../packages/admin-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#0A0A0A',
        foreground: '#FFFFFF',
        card: '#1A1A1A',
        'card-foreground': '#FFFFFF',
        gold: {
          DEFAULT: '#C9A84C',
          hover: '#D4B568',
          border: 'rgba(201,168,76,0.2)',
        },
        muted: {
          DEFAULT: 'rgba(255,255,255,0.6)',
          foreground: 'rgba(255,255,255,0.6)',
        },
        footer: '#111111',
        border: 'rgba(201,168,76,0.2)',
        input: 'rgba(201,168,76,0.2)',
        ring: '#C9A84C',
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
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
