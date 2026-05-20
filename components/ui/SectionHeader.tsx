import type { ReactNode } from 'react';

type Size = 'lg' | 'md';
type Align = 'left' | 'center';

type Props = {
  /** Primary headline. */
  headline: ReactNode;
  /** Optional muted continuation rendered on a new line under the headline. */
  headlineSub?: ReactNode;
  /** Body description below the headline. */
  description?: ReactNode;
  align?: Align;
  /** Headline scale. lg = 40/64, md = 34/48. */
  size?: Size;
  /** Semantic heading element for the headline. */
  as?: 'h1' | 'h2' | 'h3';
  /** Max width applied to the description block. */
  descriptionMaxWidth?: string;
  className?: string;
};

const HEAD_SIZE: Record<Size, string> = {
  lg: 'text-display md:text-hero leading-[0.95]',
  md: 'text-h2 md:text-display leading-[1.02]',
};

const ALIGN: Record<Align, { wrap: string; max: string }> = {
  left:   { wrap: '',           max: 'max-w-[640px]' },
  center: { wrap: 'text-center mx-auto', max: 'max-w-[640px] mx-auto' },
};

export function SectionHeader({
  headline,
  headlineSub,
  description,
  align = 'left',
  size = 'lg',
  as = 'h2',
  descriptionMaxWidth,
  className = '',
}: Props) {
  const HeadingTag = as;
  const a = ALIGN[align];

  return (
    <div className={[a.wrap, className].filter(Boolean).join(' ')}>
      <HeadingTag
        className={[
          'font-sans font-semibold tracking-tightest',
          HEAD_SIZE[size],
        ].join(' ')}
      >
        <span className="block text-ink">{headline}</span>
        {headlineSub && (
          <span className="block text-ink-faint">{headlineSub}</span>
        )}
      </HeadingTag>

      {description && (
        <p
          className={[
            'text-ink-muted text-body-lg leading-relaxed mt-6',
            descriptionMaxWidth ?? a.max,
          ].join(' ')}
        >
          {description}
        </p>
      )}
    </div>
  );
}
