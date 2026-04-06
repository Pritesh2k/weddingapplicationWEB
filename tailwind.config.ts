// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark mode surfaces ──────────────────────────
        'vow-dark-bg':       '#1E1C1A',
        'vow-dark-surface':  '#272320',
        'vow-dark-surface2': '#2F2B28',
        // ── Light mode surfaces ─────────────────────────
        'vow-light-bg':       '#F7F3ED',
        'vow-light-surface':  '#EDE8E0',
        'vow-light-surface2': '#E4DDD3',
        // ── Brand / accent ──────────────────────────────
        'vow-brown':        '#8B6B47',
        'vow-brown-dark':   '#6E5438',
        'vow-brown-light':  '#A07E5A',
        'vow-brown-pale':   '#C4A882',
        // ── Text ────────────────────────────────────────
        'vow-text-dark':    '#F2EDE6',
        'vow-text-muted-dark': '#8A7E74',
        'vow-text-light':   '#1C1510',
        'vow-text-muted-light': '#7A6A58',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'vow': '14px',
      },
      boxShadow: {
        'vow-dark': '0 24px 64px rgba(0,0,0,0.45)',
        'vow-light': '0 12px 40px rgba(139,107,71,0.10)',
        'vow-btn': '0 4px 20px rgba(139,107,71,0.28)',
      },
    },
  },
  plugins: [],
}

export default config