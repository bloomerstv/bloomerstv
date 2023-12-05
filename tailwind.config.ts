import type { Config } from 'tailwindcss'

const config: Config = {
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
        brand: 'var(--brand)'
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
    }
  ]
}
export default config
