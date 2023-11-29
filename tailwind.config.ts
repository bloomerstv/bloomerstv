import type { Config } from 'tailwindcss'

const config: Config = {
  corePlugins: {
    preflight: false
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'p-bg': 'var(--primary-background)',
        's-bg': 'var(--secondary-background)',
        's-text': 'var(--secondary-text)',
        'p-text': 'var(--primary-text)',
        brand: 'var(--brand)'
      }
    }
  },
  plugins: []
}
export default config
