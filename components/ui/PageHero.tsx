'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Eyebrow } from './Eyebrow';

type Props = {
  eyebrow?: ReactNode;
  /** Headline content. Accepts ReactNode so inline italic/colored emphasis works. */
  headline: ReactNode;
  description?: ReactNode;
  /** Button row rendered under the description. */
  ctas?: ReactNode;
  /** Extra content rendered after CTAs (stats grid, hero widget, etc.). */
  children?: ReactNode;
  className?: string;
};

/**
 * Standard top-of-page hero. Fixed responsive size ramp (44 → 56 → 80px) keeps
 * every landing page header in lock-step. Pass ReactNode in `headline` to allow
 * inline italic / colored emphasis where needed.
 */
export function PageHero({
  eyebrow,
  headline,
  description,
  ctas,
  children,
  className = '',
}: Props) {
  return (
    <section className={['container py-20 md:py-28', className].filter(Boolean).join(' ')}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

        <h1 className="font-sans font-semibold text-display sm:text-display-lg md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[920px]">
          {headline}
        </h1>

        {description && (
          <p className="text-ink-muted text-body-lg leading-[1.6] max-w-[680px] mt-7">
            {description}
          </p>
        )}

        {ctas && <div className="mt-10 flex flex-wrap gap-3">{ctas}</div>}

        {children}
      </motion.div>
    </section>
  );
}
