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
  'inline-flex items-center justify-center px-5 py-3 rounded-md text-body font-medium transition-colors duration-150 whitespace-nowrap';

const styleMap: Record<Variant, string> = {
  primary:   'bg-brand text-on-brand hover:bg-brand-deep',
  secondary: 'border border-field text-ink bg-surface hover:bg-surface-raised',
  outline:   'border border-field text-ink bg-surface-raised hover:bg-surface',
  tertiary:  'text-ink-muted hover:text-ink underline-offset-4 hover:underline px-2 py-3 rounded-none',
  text:      'text-ink hover:text-brand underline-offset-4 hover:underline px-2 py-3 rounded-none',
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
