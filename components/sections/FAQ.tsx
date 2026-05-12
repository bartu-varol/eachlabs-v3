'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type QA = {
  q: string;
  /** Short caption shown next to the active number, flavor text. */
  tag: string;
  a: ReactNode;
};

const InlineLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="text-spark hover:underline underline-offset-4">
    {children}
  </Link>
);

const ITEMS: QA[] = [
  {
    q: 'What does it cost?',
    tag: 'PRICING',
    a: (
      <>
        Pay-per-call. Free until you ship, 10K traces, no credit card. After that, you pay the
        model’s API price plus a thin platform fee. We never invoice “starting at.” Full pricing
        on the <InlineLink href="/pricing">pricing page</InlineLink>.
      </>
    ),
  },
  {
    q: 'Am I locked in?',
    tag: 'LOCK-IN',
    a: (
      <>
        No. Cancel by deleting your API key. We don’t hold your prompts, your workflows, your
        call history, or your contracts hostage. Export anything, anytime.
      </>
    ),
  },
  {
    q: 'Do you train on my data?',
    tag: 'PRIVACY',
    a: <>No. Never have. Never will. It’s the first item on the Promise list above for a reason.</>,
  },
  {
    q: 'How is this different from Replicate or fal.ai?',
    tag: 'COMPARE',
    a: (
      <>
        They give you model access. We give you model access plus the orchestration layer:
        quality-aware routing, automatic fallback, per-call tracing, A/B testing, workflows,
        version control. The boring parts. If all you need is one model occasionally, Replicate
        is fine. If you’re shipping AI in production, you’ll end up building what we already
        built.
      </>
    ),
  },
  {
    q: 'What’s the latency overhead?',
    tag: 'LATENCY',
    a: (
      <>
        ~120ms for the router. Faster than a cold start on most providers, faster than a tweet,
        faster than the time it takes to read this answer.
      </>
    ),
  },
  {
    q: 'Can I self-host?',
    tag: 'DEPLOY',
    a: (
      <>
        Not today. We’re a hosted service, the routing intelligence relies on our cross-tenant
        signal. If you have a regulatory reason that forces self-hosting, talk to an engineer;
        we have a path for enterprise.
      </>
    ),
  },
  {
    q: 'What SDKs do you have?',
    tag: 'SDKs',
    a: (
      <>
        TypeScript, Python, Go. Plus a typed REST API. Same <code>each.run()</code> signature
        across all of them. Docs at <InlineLink href="/docs">/docs</InlineLink>.
      </>
    ),
  },
  {
    q: 'How fast can I migrate from another provider?',
    tag: 'MIGRATE',
    a: (
      <>
        If you’re on Replicate, fal.ai, or calling provider APIs directly, about an hour. The{' '}
        <code>each.run()</code> signature is similar enough to most that it’s mostly a
        search-and-replace job. Bring your hardest workflow to the migration call, we’ll port
        it live.
      </>
    ),
  },
];

/* Question button, left list. Highlights with shared layoutId pill on active. */
function QuestionRow({
  item,
  index,
  isActive,
  onSelect,
}: {
  item: QA;
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
      {/* Shared active highlight, uses layoutId so it slides between items */}
      {isActive && (
        <motion.span
          layoutId="faq-active"
          className="absolute inset-0 bg-surface border border-spark/30 rounded-md"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <div className="relative flex items-center gap-4 px-4 py-3.5">
        <span
          className={`font-mono text-[11px] tabular-nums w-6 shrink-0 transition-colors ${
            isActive ? 'text-spark' : 'text-ink3 group-hover:text-ink2'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={`flex-1 text-[14.5px] leading-snug transition-colors ${
            isActive ? 'text-ink' : 'text-ink2 group-hover:text-ink'
          }`}
        >
          {item.q}
        </span>
        <motion.span
          className="shrink-0"
          animate={{
            opacity: isActive ? 1 : 0,
            x: isActive ? 0 : -4,
            color: isActive ? 'rgb(var(--c-spark))' : 'rgb(var(--c-ink3))',
          }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight size={14} />
        </motion.span>
      </div>
    </motion.button>
  );
}

/* Right panel, answer with stagger reveal of "lines". */
function AnswerPanel({ item, index }: { item: QA; index: number }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-surface border border-rule2 rounded-md p-7 md:p-9 overflow-hidden"
    >
      {/* Subtle ambient glow that pulses on entry */}
      <motion.div
        aria-hidden
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-spark/10 blur-3xl pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Header: counter + tag */}
      <div className="flex items-baseline justify-between mb-6 relative">
        <motion.div
          className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 tabular-nums"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
        >
          {String(index + 1).padStart(2, '0')}{' '}
          <span className="text-ink3/60">/</span>{' '}
          <span className="text-ink3/60">{String(ITEMS.length).padStart(2, '0')}</span>
        </motion.div>
        <motion.div
          className="font-mono text-[10px] uppercase tracking-eyebrow text-spark"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.14 }}
        >
          {item.tag}
        </motion.div>
      </div>

      {/* Question, display, big */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-semibold text-[24px] md:text-[30px] leading-[1.15] tracking-tightest text-ink"
      >
        {item.q}
      </motion.h3>

      {/* Answer body, fade in, then a thin spark divider grows */}
      <motion.div
        className="h-px bg-spark/40 my-5 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.34, delay: 0.42 }}
        className="text-ink2 text-[15px] leading-[1.7] max-w-[640px]"
      >
        {item.a}
      </motion.div>
    </motion.div>
  );
}

export function FAQ() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = ITEMS[activeIdx];

  return (
    <section className="relative border-t border-rule py-24 md:py-32 overflow-hidden">
      {/* Floating orbs, subtle "questions in the air" ambient */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {[
          { size: 280, x: '12%', y: '18%', delay: 0,   dur: 8,  tone: 'spark'  },
          { size: 220, x: '78%', y: '32%', delay: 1.2, dur: 9,  tone: 'highlight' },
          { size: 320, x: '42%', y: '70%', delay: 2.4, dur: 10, tone: 'spark' },
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
                  ? 'rgb(var(--c-spark) / 0.05)'
                  : 'rgb(var(--c-highlight) / 0.05)',
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

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
            * FAQ
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display font-semibold text-5xl md:text-7xl tracking-tightest text-ink leading-none">
              FAQ
            </h2>
            <p className="italic text-ink3 text-[15px] md:max-w-[280px]">
              is anyone still reading faq?
            </p>
          </div>
        </motion.div>

        {/* Split */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-8">
          {/* Left, question list */}
          <div className="flex flex-col gap-1 lg:sticky lg:top-32 self-start">
            {ITEMS.map((item, i) => (
              <QuestionRow
                key={i}
                item={item}
                index={i}
                isActive={i === activeIdx}
                onSelect={() => setActiveIdx(i)}
              />
            ))}
          </div>

          {/* Right, answer panel */}
          <div className="min-h-[260px]">
            <AnimatePresence mode="wait">
              <AnswerPanel key={activeIdx} item={active} index={activeIdx} />
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="italic text-ink3 text-[14px] text-center mt-14"
        >
          Still have a question?{' '}
          <a
            href="mailto:engineer@eachlabs.ai"
            className="text-spark hover:underline underline-offset-4"
          >
            Ask an engineer →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
