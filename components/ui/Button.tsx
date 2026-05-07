import Link from 'next/link';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'text';

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

const baseStyles =
  'inline-flex items-center justify-center px-5 py-3 rounded-md text-[14px] font-medium transition-colors duration-150 whitespace-nowrap';

const styleMap: Record<Variant, string> = {
  // Primary CTA: orange fill, black text (the brief: bg-spark text-bg)
  primary: 'bg-spark text-bg hover:bg-ember',

  // Secondary: outlined on dark surface
  secondary: 'border border-rule2 text-ink bg-bg hover:bg-surface',

  // Tertiary on hero: text-link with underline-on-hover
  tertiary:
    'text-ink2 hover:text-ink underline-offset-4 hover:underline px-2 py-3 rounded-none',

  // Outline (rabbit hole middle card) — same as secondary, just named
  outline: 'border border-rule2 text-ink bg-surface hover:bg-bg',

  // Text-link CTA (rabbit hole third card)
  text: 'text-ink hover:text-spark underline-offset-4 hover:underline px-2 py-3 rounded-none',
};

export function Button({ href, variant = 'primary', children, className = '', fullWidth = false }: Props) {
  return (
    <Link
      href={href}
      className={`${baseStyles} ${styleMap[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </Link>
  );
}
