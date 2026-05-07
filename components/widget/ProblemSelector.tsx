'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PROBLEMS } from '@/lib/problems';
import { widget } from '@/lib/content';
import { CodeBlock } from './CodeBlock';

export function ProblemSelector() {
  const [activeId, setActiveId] = useState<number>(PROBLEMS[0].id);
  const active = PROBLEMS.find((p) => p.id === activeId) ?? PROBLEMS[0];
  const fix = active.fix;

  return (
    <section className="container py-24 md:py-32">
      {/* Eyebrow */}
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        {widget.eyebrow}
      </div>

      {/* Headline */}
      <h2 className="font-display font-semibold text-[40px] md:text-[64px] leading-[0.95] tracking-tightest text-ink mt-4">
        <span className="block">{widget.headline.line1}</span>
        <span className="block italic text-ink3">{widget.headline.line2}</span>
      </h2>

      {/* Widget container */}
      <div className="bg-surface border border-rule2 rounded-md overflow-hidden mt-12">
        {/* Top — chips */}
        <div className="flex flex-wrap gap-2 p-6 border-b border-rule2">
          {PROBLEMS.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                aria-pressed={isActive}
                className={[
                  'px-4 py-2.5 rounded-md text-[13px] transition-all duration-150 border',
                  isActive
                    ? 'bg-spark text-bg border-spark'
                    : 'bg-bg border-rule2 text-ink2 hover:border-spark/40 hover:text-ink',
                ].join(' ')}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Bottom — solution panel */}
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 p-8"
            >
              {/* Left — the fix */}
              <div className="flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
                  * THE FIX
                </div>
                <h3 className="font-display font-semibold text-[28px] sm:text-[34px] leading-[1.05] mt-3 text-ink">
                  {fix.feature.prefix && (
                    <span className="text-ink3">{fix.feature.prefix}</span>
                  )}
                  {fix.feature.name}
                  {fix.feature.tail && (
                    <span className="text-ink3 italic font-normal text-[20px] sm:text-[22px] ml-2">
                      ({fix.feature.tail})
                    </span>
                  )}
                </h3>
                <div className="text-ink2 italic text-[14px] mt-2">{fix.tagline}</div>
                <p className="text-ink2 text-[14px] leading-relaxed mt-3 max-w-[440px]">
                  {fix.body}
                </p>
                <Link
                  href={fix.docsHref}
                  className="text-spark text-[13px] font-medium hover:underline underline-offset-4 mt-6"
                >
                  See the docs →
                </Link>
              </div>

              {/* Right — code + visual */}
              <div className="flex flex-col gap-4">
                <CodeBlock code={fix.code} />
                <fix.Visual />
                <div className="font-mono text-[11px] text-ink3">
                  ↳ {fix.caption}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Below the widget */}
      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center mt-8">
        {widget.belowCount}
      </div>
      <div className="text-center text-[14px] text-ink2 mt-2">
        <em className="text-ink3">{widget.belowEscape.prefix}</em>{' '}
        <Link
          href={widget.belowEscape.href}
          className="hover:text-ink underline-offset-4 hover:underline transition-colors"
        >
          {widget.belowEscape.linkLabel}
        </Link>
      </div>
    </section>
  );
}
