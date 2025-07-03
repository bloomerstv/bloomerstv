import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  corePlugins: {
    preflight: false
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      borderWidth: {
        DEFAULT: '1px'
      },
      borderStyle: {
        DEFAULT: 'solid'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'p-bg': 'var(--primary-background)',
        's-bg': 'var(--secondary-background)',
        'p-hover': 'var(--primary-hover)',
        's-text': 'var(--secondary-text)',
        'p-text': 'var(--primary-text)',
        'p-border': 'var(--primary-border)',
        brand: 'var(--brand)',
        'zora-purple': '#5A5A8E',
        'zora-blue': '#3F5FF8',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.border': {
          borderWidth: '1px',
          borderStyle: 'solid'
        },
        '.border-t': {
          borderTopWidth: '1px',
          borderTopStyle: 'solid'
        },
        '.border-r': {
          borderRightWidth: '1px',
          borderRightStyle: 'solid'
        },
        '.border-b': {
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid'
        },
        '.border-l': {
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid'
        }
      }
      addUtilities(newUtilities)
    },
    require('tailwindcss-animate')
  ]
}
export default config
