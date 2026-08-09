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
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: '#2c0a0d',
        foreground: '#f6efdd',
        card: '#4a0f14',
        'card-foreground': '#f6efdd',
        gold: {
          DEFAULT: '#cc9f3f',
          hover: '#e9cd80',
          border: 'rgba(204, 159, 63, 0.25)',
        },
        muted: {
          DEFAULT: '#d9c9a3',
          foreground: '#d9c9a3',
        },
        footer: '#200507',
        border: 'rgba(204, 159, 63, 0.22)',
        input: 'rgba(204, 159, 63, 0.22)',
        ring: '#cc9f3f',
        maroon: {
          DEFAULT: '#4a0f14',
          bright: '#6e1a22',
          deep: '#2c0a0d',
        },
        ivory: {
          DEFAULT: '#f6efdd',
          dim: '#d9c9a3',
        },
        brand: {
          bg: '#2c0a0d',
          card: '#4a0f14',
          saffron: '#FF6B00',
          saffronHover: '#ff8533',
          text: '#f6efdd',
        },
        surface: {
          sidebar: '#200507',
          rowAlt: '#4a0f14',
        },
      },
      fontFamily: {
        display: ['Marcellus', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Karla', 'sans-serif'],
      },
      spacing: {
        nav: '5rem',
      },
      minHeight: {
        nav: '5rem',
      },
      padding: {
        nav: '5rem',
        safe: 'env(safe-area-inset-bottom, 0px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
