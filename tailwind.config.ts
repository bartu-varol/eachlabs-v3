import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', md: '2.5rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        surface2: 'rgb(var(--c-surface2) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        ink2: 'rgb(var(--c-ink2) / <alpha-value>)',
        ink3: 'rgb(var(--c-ink3) / <alpha-value>)',
        rule: 'rgb(var(--c-rule) / <alpha-value>)',
        rule2: 'rgb(var(--c-rule2) / <alpha-value>)',
        spark: 'rgb(var(--c-spark) / <alpha-value>)',
        ember: 'rgb(var(--c-ember) / <alpha-value>)',
        sun: 'rgb(var(--c-sun) / <alpha-value>)',
        highlight: 'rgb(var(--c-highlight) / <alpha-value>)',
        yellow: 'rgb(var(--c-yellow) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
        fail: 'rgb(var(--c-fail) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        eyebrow: '0.18em',
      },
      maxWidth: {
        site: '1440px',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'panel-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        'panel-in': 'panel-in 220ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
