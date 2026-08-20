import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        chip: 'var(--chip)',
        hairline: 'var(--hairline)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted-2)',
        positive: 'var(--positive)',
        brand: 'var(--brand)',
        easy: '#4fe9b0',
        medium: '#fbbf3c',
        hard: '#f9736a',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [forms],
} satisfies Config;
