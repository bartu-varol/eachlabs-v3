import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  active?: boolean;
  className?: string;
};

export function Pill({ children, active = false, className = '' }: Props) {
  const base =
    'inline-flex items-center font-mono text-[11px] uppercase tracking-eyebrow rounded-full px-3 py-1 border transition-colors';
  const styles = active
    ? 'bg-spark text-bg border-spark'
    : 'bg-bg border-rule2 text-ink2 hover:border-ink hover:text-ink';

  return <span className={`${base} ${styles} ${className}`}>{children}</span>;
}
