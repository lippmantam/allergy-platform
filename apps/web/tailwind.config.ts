import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green:        '#2BAE82',
          'green-dark': '#229E74',
          'green-deep': '#1A8A60',
          'green-light': '#E8FAF3',
          'green-mid':  '#A8EDD6',
          orange:       '#E85D26',
          'orange-dark': '#D04D1A',
          amber:        '#F5A623',
          blue:         '#3B82F6',
          pink:         '#E879A0',
          teal:         '#0EA5E9',
        },
        safe: {
          bg:   '#E8FAF3',
          text: '#1A8A60',
        },
        warn: {
          bg:   '#FFF4E0',
          text: '#B87A10',
        },
        surface: {
          bg:     '#FFFDF7',
          card:   '#ffffff',
          border: '#EDE6D8',
          nav:    '#F0EAD6',
        },
        ink: {
          primary: '#2A2520',
          heading: '#1A1714',
          muted:   '#7A7060',
          subtle:  '#B0A898',
          faint:   '#C0B8A8',
        },
      },
      fontFamily: {
        nunito:      ['var(--font-nunito)', 'sans-serif'],
        'nunito-sans': ['var(--font-nunito-sans)', 'sans-serif'],
      },
      borderRadius: {
        chip: '20px',
        card: '20px',
        tag:  '10px',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
      },
      animation: {
        blink: 'blink 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
