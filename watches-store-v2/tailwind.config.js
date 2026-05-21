
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
        'brand-bg': '#000000',
        'brand-elevated': '#0A0A0A',
        'brand-card': '#141414',
        'brand-surface': '#1C1C1C',
        'brand-purple': '#CBA860',
        'brand-purple-dim': '#7B5527',
        'brand-accent': '#B8B7B7',
        'brand-text': '#FFFFFF',
        'brand-muted': '#8A8A88',
        'brand-border': 'rgba(255, 255, 255, 0.1)',
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
        'glow-purple': '0 8px 32px rgba(203, 168, 96, 0.32)',
        'glow-accent': '0 8px 28px rgba(184, 183, 183, 0.22)',
      },
      backgroundImage: {
        'brand-mesh':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(203, 168, 96, 0.16), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(184, 183, 183, 0.08), transparent)',
      },
    }
  }
}

