/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        bmPrimary: 'var(--bm-primary)',
        bmSecondary: 'var(--bm-secondary)',
        bmAccent: 'var(--bm-accent)',
        bmWarning: 'var(--bm-warning)',
        bmSuccess: 'var(--bm-success)',
        bmDanger: 'var(--bm-danger)',
        bmBackground: 'var(--bm-background)',
        bmSurface: 'var(--bm-surface)',
        bmText: 'var(--bm-text)',
        bmTextSecondary: 'var(--bm-text-secondary)',
        bmBorder: 'var(--bm-border)',
      },
    },
  },
  plugins: [],
}
