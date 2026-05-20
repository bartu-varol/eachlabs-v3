import type { ReactNode } from 'react';

type Tone = 'brand' | 'ink-faint' | 'ink' | 'ink-muted';
type Size = 'sm' | 'md';
type As = 'div' | 'span' | 'p' | 'label';

type Props = {
  children: ReactNode;
  tone?: Tone;
  /** sm = 10px, md = 11px. */
  size?: Size;
  /** Rendered element. Default `div`. */
  as?: As;
  className?: string;
  /** Forwarded for `as="label"` association. */
  htmlFor?: string;
};

const TONE: Record<Tone, string> = {
  brand:        'text-brand',
  ink:          'text-ink',
  'ink-muted':  'text-ink-muted',
  'ink-faint':  'text-ink-faint',
};

const SIZE: Record<Size, string> = {
  sm: 'text-micro',
  md: 'text-eyebrow',
};

/**
 * Mono uppercase eyebrow used above headings, in active-state labels, and as
 * meta captions. Single source of truth for the `font-mono · uppercase ·
 * tracking-eyebrow` text style. Pass `as="span" | "p" | "label"` to render
 * something other than a `div` for inline / semantic use.
 */
export function Eyebrow({
  children,
  tone = 'brand',
  size = 'md',
  as: As = 'div',
  className = '',
  htmlFor,
}: Props) {
  const classes = ['font-mono uppercase tracking-eyebrow', SIZE[size], TONE[tone], className]
    .filter(Boolean)
    .join(' ');

  if (As === 'label') {
    return <label className={classes} htmlFor={htmlFor}>{children}</label>;
  }

  return <As className={classes}>{children}</As>;
}
