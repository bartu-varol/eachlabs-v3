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
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        bg: '#000000',
        surface: '#0A0A0A',
        surface2: '#141414',
        ink: '#F5F0E6',
        ink2: '#A8A39A',
        ink3: '#6E6A63',
        rule: '#1F1F1F',
        rule2: '#2A2A2A',
        spark: '#FF3C15',
        ember: '#D63310',
        sun: '#FB9000',
        highlight: '#5046E6',
        yellow: '#FFC534',
        success: '#22C55E',
        fail: '#EF4444',
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
        site: '1280px',
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
