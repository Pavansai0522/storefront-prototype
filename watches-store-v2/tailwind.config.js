
export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
  '../packages/admin-ui/src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'selector',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        'brand-bg': '#F3ECE2',
        'brand-elevated': '#F3ECE2',
        'brand-card': '#F3ECE2',
        'brand-surface': '#F3ECE2',
        'brand-purple': '#BC2422',
        'brand-purple-dim': '#8B1A18',
        'brand-accent': '#CD3A34',
        'brand-text': '#1E1D1B',
        'brand-muted': 'rgba(30, 29, 27, 0.72)',
        'brand-border': 'rgba(30, 29, 27, 0.12)',
        /* Admin accent only — do not add bg/card/text here (collides with storefront brand-bg, brand-card, brand-text) */
        brand: {
          saffron: '#FF6B00',
          saffronHover: '#ff8533',
        },
        surface: {
          sidebar: '#111111',
          rowAlt: '#1A1A1A',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
        sidebar: 'var(--sidebar)',
        'sidebar-foreground': 'var(--sidebar-foreground)',
        'sidebar-primary': 'var(--sidebar-primary)',
        'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
        'sidebar-accent': 'var(--sidebar-accent)',
        'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
        'sidebar-border': 'var(--sidebar-border)',
        'sidebar-ring': 'var(--sidebar-ring)',
        'destructive-foreground': 'var(--destructive-foreground)'
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
        mono: ['Inter', 'monospace'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 8px 32px rgba(188, 36, 34, 0.22)',
        'glow-accent': '0 8px 28px rgba(205, 58, 52, 0.18)',
      },
      backgroundImage: {
        'brand-mesh':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(188, 36, 34, 0.08), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(30, 29, 27, 0.04), transparent)',
      },
    }
  }
}
