import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export function Pill({ children, active = false, className = '' }: Props) {
  const base =
    'inline-flex items-center font-mono text-eyebrow uppercase tracking-eyebrow rounded-full px-3 py-1 border transition-colors';
  const styles = active
    ? 'bg-brand text-on-brand border-brand'
    : 'bg-surface border-field text-ink-muted hover:border-ink hover:text-ink';

  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
}
