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
        /* Surfaces */
        surface:          'rgb(var(--surface)         / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised)  / <alpha-value>)',
        'surface-sunken': 'rgb(var(--surface-sunken)  / <alpha-value>)',

        /* Text */
        ink:         'rgb(var(--ink)        / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted)  / <alpha-value>)',
        'ink-faint': 'rgb(var(--ink-faint)  / <alpha-value>)',

        /* Lines & focus */
        divider:      'rgb(var(--divider)     / <alpha-value>)',
        field:        'rgb(var(--field)       / <alpha-value>)',
        'focus-ring': 'rgb(var(--focus-ring)  / <alpha-value>)',

        /* Brand */
        brand:        'rgb(var(--brand)       / <alpha-value>)',
        'on-brand':   'rgb(var(--on-brand)    / <alpha-value>)',
        'brand-deep': 'rgb(var(--brand-deep)  / <alpha-value>)',
        cobrand:      'rgb(var(--cobrand)     / <alpha-value>)',
        'on-cobrand': 'rgb(var(--on-cobrand)  / <alpha-value>)',
        glow:         'rgb(var(--glow)        / <alpha-value>)',
        'on-glow':    'rgb(var(--on-glow)     / <alpha-value>)',

        /* States */
        ok:           'rgb(var(--ok)          / <alpha-value>)',
        'on-ok':      'rgb(var(--on-ok)       / <alpha-value>)',
        caution:      'rgb(var(--caution)     / <alpha-value>)',
        'on-caution': 'rgb(var(--on-caution)  / <alpha-value>)',
        danger:       'rgb(var(--danger)      / <alpha-value>)',
        'on-danger':  'rgb(var(--on-danger)   / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        /* Body / small text */
        micro:        ['10px', { lineHeight: '1.4'  }],
        eyebrow:      ['11px', { lineHeight: '1.4'  }],
        caption:      ['12px', { lineHeight: '1.45' }],
        'body-sm':    ['13px', { lineHeight: '1.55' }],
        body:         ['14px', { lineHeight: '1.55' }],
        'body-lg':    ['16px', { lineHeight: '1.6'  }],
        /* Headings */
        h4:           ['18px', { lineHeight: '1.3'  }],
        h3:           ['24px', { lineHeight: '1.25' }],
        h2:           ['32px', { lineHeight: '1.15' }],
        /* Display */
        display:      ['44px', { lineHeight: '1.05' }],
        'display-lg': ['56px', { lineHeight: '1.02' }],
        hero:         ['72px', { lineHeight: '0.98' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        eyebrow:  '0.18em',
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
        marquee:    'marquee 60s linear infinite',
        'panel-in': 'panel-in 220ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
