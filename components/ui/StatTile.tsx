import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Size = 'sm' | 'md' | 'lg';
type ValueTone = 'brand' | 'ink';
type LabelStyle = 'plain' | 'eyebrow';

type StatTileProps = {
  /** Big numeric / display value (e.g. "600+", "$0", "<120ms"). */
  value: ReactNode;
  /** Label below the value. */
  label: string;
  /** Optional secondary caption shown below the label. */
  sub?: string;
  /** Density: sm = compact (signup), md = default 4-col grid, lg = pricing card. */
  size?: Size;
  /** Value color. Default brand orange. */
  valueTone?: ValueTone;
  /** Label treatment. `plain` = body weight, `eyebrow` = mono uppercase. */
  labelStyle?: LabelStyle;
  className?: string;
};

const PAD: Record<Size, string> = {
  sm: 'px-3 py-3',
  md: 'px-4 py-4',
  lg: 'px-6 py-7',
};

const VALUE_SIZE: Record<Size, string> = {
  sm: 'text-h4',
  md: 'text-h3',
  lg: 'text-h2',
};

const VALUE_TONE: Record<ValueTone, string> = {
  brand: 'text-brand',
  ink:   'text-ink',
};

export function StatTile({
  value,
  label,
  sub,
  size = 'md',
  valueTone = 'brand',
  labelStyle = 'plain',
  className = '',
}: StatTileProps) {
  return (
    <div className={['bg-surface-raised', PAD[size], className].filter(Boolean).join(' ')}>
      <div className={['font-sans font-semibold tabular-nums leading-none', VALUE_SIZE[size], VALUE_TONE[valueTone]].join(' ')}>
        {value}
      </div>

      {labelStyle === 'eyebrow' ? (
        <Eyebrow size="sm" tone="ink-faint" className="mt-2">{label}</Eyebrow>
      ) : (
        <div className="text-ink text-micro mt-1.5 font-medium">{label}</div>
      )}

      {sub && (
        <div className="text-ink-faint text-micro mt-0.5">{sub}</div>
      )}
    </div>
  );
}

type StatGridProps = {
  columns?: 2 | 3 | 4;
  className?: string;
  children: ReactNode;
};

const COLUMNS: Record<NonNullable<StatGridProps['columns']>, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
};

/**
 * Standard hairline-divider grid that wraps a row of StatTile children.
 */
export function StatGrid({ columns = 4, className = '', children }: StatGridProps) {
  return (
    <div
      className={[
        'grid gap-px bg-divider border border-divider rounded-md overflow-hidden',
        COLUMNS[columns],
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
