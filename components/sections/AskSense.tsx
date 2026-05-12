'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { askSense, type SenseAnswer } from '@/lib/content';

export function AskSense() {
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState<SenseAnswer | null>(null);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked entrance: content "falls" down from above as the section
  // approaches the viewport — feels like it slides out from under the section
  // above it, prompting the user to ask if they didn't find their chaos.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const contentY       = useTransform(scrollYProgress, [0, 1], [-140, 0]);
  const contentScale   = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.55, 1]);
  const bridgeScaleY   = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const bridgeOpacity  = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0]);
  const glowOpacity    = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.3, 0]);

  useEffect(() => {
    if (value || answer) return;
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % askSense.inputPlaceholders.length);
    }, 3500);
    return () => clearInterval(id);
  }, [value, answer]);

  const placeholder = askSense.inputPlaceholders[placeholderIdx];
  const lookup = useMemo(() => askSense.answers as Record<string, SenseAnswer>, []);

  function submit(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    setActiveChip(null);
    setAnswer(lookup[trimmed] ?? askSense.fallback);
  }

  function handleChip(label: string) {
    setActiveChip(label);
    setValue(label);
    setAnswer(lookup[label] ?? askSense.fallback);
    inputRef.current?.focus();
  }

  function reset() {
    setAnswer(null);
    setActiveChip(null);
    setValue('');
    inputRef.current?.focus();
  }

  return (
    <section
      ref={sectionRef}
      id="ask-sense"
      className="relative border-t border-rule overflow-hidden"
    >
      {/* Soft spark glow that bleeds down from the top edge as you scroll in */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-48 pointer-events-none z-0"
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(ellipse 60% 100% at 50% 0%, rgb(var(--c-spark) / 0.18), transparent 70%)',
        }}
      />

      {/* Bridge from the section above — thin spark line that draws down,
          plus a "still chaos?" hint that ties this to ProofSection. */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center pointer-events-none z-10"
        style={{ opacity: bridgeOpacity }}
      >
        <motion.span
          className="block w-[2px] h-24 bg-gradient-to-b from-transparent via-spark/60 to-spark origin-top rounded-full"
          style={{
            scaleY: bridgeScaleY,
            boxShadow: '0 0 8px 1px rgb(var(--c-spark) / 0.5)',
          }}
        />
        <motion.span
          className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mt-3 whitespace-nowrap font-semibold"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓ still chaos? · ask each::sense
        </motion.span>
      </motion.div>

      <motion.div
        className="container py-32 md:py-40 relative z-[5]"
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
      >
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        {askSense.eyebrow}
      </div>

      <h3 className="font-display font-semibold text-[34px] md:text-[52px] leading-[0.98] tracking-tightest mt-3">
        <span className="block text-ink">
          {askSense.headline.line1}{' '}
          <em className="text-spark italic font-display">{askSense.headline.italic}</em>
        </span>
        <span className="block text-ink3 italic">{askSense.headline.line2}</span>
      </h3>

      <p className="text-ink2 text-[15px] leading-relaxed mt-5 max-w-[560px]">
        {askSense.body.split('each::sense').map((part, i, arr) =>
          i < arr.length - 1 ? (
            <span key={i}>
              {part}
              <code className="!bg-transparent !border-0 !p-0 text-spark">each::sense</code>
            </span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="mt-8 bg-surface border border-rule2 rounded-md flex items-stretch overflow-hidden focus-within:border-spark/60 transition-colors"
      >
        <span className="pl-5 pr-3 self-center text-spark font-mono text-[16px]" aria-hidden>
          ›
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Ask each::sense"
          className="flex-1 bg-transparent py-4 pr-4 text-ink placeholder:text-ink3 text-[15px] outline-none"
        />
        <button
          type="submit"
          className="px-5 md:px-7 bg-spark/15 text-spark hover:bg-spark hover:text-bg transition-colors font-medium text-[14px] flex items-center gap-2 border-l border-rule2"
        >
          Ask <ArrowRight size={14} />
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {askSense.chips.map((c) => {
          const isActive = activeChip === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => handleChip(c)}
              className={[
                'px-4 py-2 rounded-full text-[13px] border transition-colors',
                isActive
                  ? 'bg-spark text-bg border-spark'
                  : 'bg-surface border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
              ].join(' ')}
            >
              {c}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mt-5 bg-surface border border-rule2 rounded-md p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
                * EACH::SENSE → ANSWER
              </span>
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[11px] text-ink3 hover:text-ink"
              >
                clear ↻
              </button>
            </div>
            <p className="text-ink text-[15px] leading-relaxed">{answer.text}</p>
            <a
              href={answer.docHref}
              className="inline-flex items-center gap-2 mt-4 text-spark text-[13px] font-medium hover:underline underline-offset-4"
            >
              {answer.docLabel} <ArrowRight size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="font-mono text-[11px] text-ink3 mt-6">{askSense.footnote}</p>
      </motion.div>
    </section>
  );
}
