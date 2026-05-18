

export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
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
        'brand-bg': '#07070D',
        'brand-elevated': '#0E0E16',
        'brand-card': '#13131F',
        'brand-surface': '#1A1A2A',
        'brand-purple': '#8B5CF6',
        'brand-purple-dim': '#6D4AE6',
        'brand-accent': '#38BDF8',
        'brand-text': '#F4F4FA',
        'brand-muted': '#9494B8',
        'brand-border': 'rgba(255, 255, 255, 0.1)',
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
        mono: ['Inter', 'monospace'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-purple': '0 8px 32px rgba(139, 92, 246, 0.28)',
        'glow-accent': '0 8px 28px rgba(56, 189, 248, 0.2)',
      },
      backgroundImage: {
        'brand-mesh':
          'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(56, 189, 248, 0.08), transparent)',
      },
    }
  }
}

