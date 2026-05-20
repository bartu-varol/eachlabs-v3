'use client';

import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';

export type FaqItem = {
  q: string;
  a: ReactNode;
  /** Optional eyebrow tag rendered above the active answer, e.g. "PRICING". */
  tag?: string;
};

type Props = {
  items: FaqItem[];
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
  footer?: ReactNode;
  /** Floating ambient orbs in the background; default on for the brand feel. */
  ambient?: boolean;
};

function QuestionRow({
  item,
  index,
  isActive,
  onSelect,
}: {
  item: FaqItem;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      aria-current={isActive}
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.32, delay: index * 0.04, ease: 'easeOut' }}
      className="relative w-full text-left rounded-md group"
    >
      {isActive && (
        <motion.span
          layoutId="faq-active"
          className="absolute inset-0 bg-surface-raised border border-brand/30 rounded-md"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <div className="relative flex items-center gap-4 px-4 py-3.5">
        <span
          className={`font-mono text-eyebrow tabular-nums w-6 shrink-0 transition-colors ${
            isActive ? 'text-brand' : 'text-ink-faint group-hover:text-ink-muted'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={`flex-1 text-body leading-snug transition-colors ${
            isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
          }`}
        >
          {item.q}
        </span>
        <motion.span
          className="shrink-0"
          animate={{
            opacity: isActive ? 1 : 0,
            x: isActive ? 0 : -4,
            color: isActive ? 'rgb(var(--brand))' : 'rgb(var(--ink-faint))',
          }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight size={14} />
        </motion.span>
      </div>
    </motion.button>
  );
}

function AnswerPanel({
  item,
  index,
  total,
}: {
  item: FaqItem;
  index: number;
  total: number;
}) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-surface-raised border border-field rounded-md p-7 md:p-9 overflow-hidden"
    >
      <motion.div
        aria-hidden
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand/10 blur-3xl pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      <div className="flex items-baseline justify-between mb-6 relative">
        <motion.div
          className="font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint tabular-nums"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          {String(index + 1).padStart(2, '0')}{' '}
          <span className="text-ink-faint/60">/</span>{' '}
          <span className="text-ink-faint/60">{String(total).padStart(2, '0')}</span>
        </motion.div>
        {item.tag && (
          <motion.div
            className="font-mono text-micro uppercase tracking-eyebrow text-brand"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.14 }}
          >
            {item.tag}
          </motion.div>
        )}
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans font-semibold text-h3 md:text-h2 leading-[1.15] tracking-tightest text-ink"
      >
        {item.q}
      </motion.h3>

      <motion.div
        className="h-px bg-brand/40 my-5 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, delay: 0.42 }}
        className="text-ink-muted text-body-lg leading-[1.7] max-w-[640px]"
      >
        {item.a}
      </motion.div>
    </motion.div>
  );
}

export function FaqShowcase({
  items,
  eyebrow = '* FAQ',
  heading = 'FAQ',
  subtitle,
  footer,
  ambient = true,
}: Props) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (items.length === 0) return null;

  const active = items[activeIdx] ?? items[0];

  return (
    <section className="relative border-t border-divider py-20 md:py-28 overflow-hidden">
      {ambient && (
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {[
            { size: 280, x: '12%', y: '18%', delay: 0,   dur: 8,  tone: 'spark'     as const },
            { size: 220, x: '78%', y: '32%', delay: 1.2, dur: 9,  tone: 'highlight' as const },
            { size: 320, x: '42%', y: '70%', delay: 2.4, dur: 10, tone: 'spark'     as const },
          ].map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                width: orb.size,
                height: orb.size,
                left: orb.x,
                top: orb.y,
                transform: 'translate(-50%, -50%)',
                background:
                  orb.tone === 'spark'
                    ? 'rgb(var(--brand) / 0.05)'
                    : 'rgb(var(--cobrand) / 0.05)',
              }}
              animate={{ y: [0, -16, 0], opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: orb.dur,
                delay: orb.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-sans font-semibold text-[clamp(36px,5.5vw,72px)] tracking-tightest text-ink leading-[1.02]">
              {heading}
            </h2>
            {subtitle && (
              <p className="text-ink-faint text-body-lg md:max-w-[280px]">
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-8">
          <div className="flex flex-col gap-1 lg:sticky lg:top-32 self-start">
            {items.map((item, i) => (
              <QuestionRow
                key={i}
                item={item}
                index={i}
                isActive={i === activeIdx}
                onSelect={() => setActiveIdx(i)}
              />
            ))}
          </div>

          <div className="min-h-[260px]">
            <AnimatePresence mode="wait">
              <AnswerPanel
                key={activeIdx}
                item={active}
                index={activeIdx}
                total={items.length}
              />
            </AnimatePresence>
          </div>
        </div>

        {footer && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-ink-faint text-body text-center mt-14"
          >
            {footer}
          </motion.div>
        )}
      </div>
    </section>
  );
}
