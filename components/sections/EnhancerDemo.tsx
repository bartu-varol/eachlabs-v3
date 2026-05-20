'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* ──────────────────────────────────────────────────────────────────────────
   EnhancerDemo, the 5-second story for /enhancer.

   The narrative: a user prompt would have been refused by the model's content
   checker. The enhancer catches the refusal, rewrites the risky bits, and the
   output ships. Customer keeps the paid session; we get billed for the call.

   ~7-phase loop (~6.4s):
     idle      0.0 - 0.4s   reset
     check     0.4 - 1.1s   policy check on the original prompt
     reject    1.1 - 2.0s   REJECTED stamp + strike-through
     prompt    2.0 - 2.5s   "enhancer activated" indicator
     rewrite   2.5 - 3.7s   rewritten prompt fades in with highlighted swap
     recheck   3.7 - 4.3s   re-check on the rewritten prompt
     approved  4.3 - 5.1s   APPROVED stamp + green check
     ship      5.1 - 6.4s   output shipped + value chain footer
────────────────────────────────────────────────────────────────────────── */

type Phase =
  | 'idle'
  | 'check'
  | 'reject'
  | 'prompt'
  | 'rewrite'
  | 'recheck'
  | 'approved'
  | 'ship';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  check: 700,
  reject: 900,
  prompt: 500,
  rewrite: 1200,
  recheck: 600,
  approved: 800,
  ship: 1300,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

/* ── Content, concrete prompt swap that reads in <2s ───────────────────── */

// Original prompt, the strike-through fragment is in `risky`.
const ORIGINAL = {
  prefix: 'ad creative for our energy drink, ',
  risky:  'looks like Red Bull',
  suffix: ', dramatic lighting',
};

// Rewritten, the spark-highlighted fragment is the safe swap.
const REWRITTEN = {
  prefix: 'ad creative for our energy drink, ',
  swap:   'vibrant blue and silver design',
  suffix: ', dramatic lighting',
};

const REJECT_REASON = 'brand_ip';
const PROMPT_MS = 156;

/* ── Main component ─────────────────────────────────────────────────────── */

export function EnhancerDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    function tick() {
      clearAll();
      setPhase('idle');
      const order: Phase[] = ['check', 'reject', 'prompt', 'rewrite', 'recheck', 'approved', 'ship'];
      let acc = TIMINGS.idle;
      for (const p of order) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => setPhase(p), at));
        acc += TIMINGS[p];
      }
    }

    tick();
    const id = setInterval(tick, TOTAL_LOOP);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-brand/[0.10] via-transparent to-brand/[0.05] blur-2xl"
      />

      <div className="bg-surface-raised border border-field rounded-md overflow-hidden">
        {/* Header, note the COMING SOON badge */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-field bg-surface/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden />
            <Eyebrow as="span" size="sm" tone="ink-muted">ENHANCER · PREVIEW</Eyebrow>
          </div>
          <Eyebrow as="span" size="sm" className="border border-brand/40 rounded px-1.5 py-0.5 bg-brand/[0.04]">COMING Q1 2026</Eyebrow>
        </div>

        {/* Original prompt */}
        <div className="px-4 md:px-5 pt-4 pb-2">
          <Label tone="ink3">user prompt · nano-banana-2</Label>
          <PromptBox phase={phase} variant="original" />
        </div>

        {/* First check verdict */}
        <CheckLine phase={phase} variant="first" />

        {/* Prompt-enhance indicator + rewritten prompt */}
        <AnimatePresence>
          {(phase === 'prompt' ||
            phase === 'rewrite' ||
            phase === 'recheck' ||
            phase === 'approved' ||
            phase === 'ship') && (
            <motion.div
              key="prompt-block"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 md:px-5 pt-1 pb-2">
                {/* "enhancer activated" indicator */}
                <PromptArrow phase={phase} />
                {/* Rewritten prompt */}
                <Label tone="spark">enhancer · rewritten</Label>
                <PromptBox phase={phase} variant="rewritten" />
              </div>
              {/* Second check verdict */}
              <CheckLine phase={phase} variant="second" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Value chain footer */}
        <ValueChain phase={phase} />
      </div>

      {/* Caption */}
      <div className="mt-3 font-mono text-micro uppercase tracking-eyebrow text-ink-faint text-center lg:text-left">
        the user never sees the refusal · you keep the paid session
      </div>
    </div>
  );
}

/* ── Section label ──────────────────────────────────────────────────────── */

function Label({
  tone,
  children,
}: {
  tone: 'ink3' | 'spark';
  children: React.ReactNode;
}) {
  return (
    <div
      className={`font-mono text-micro uppercase tracking-eyebrow mb-1.5 ${
        tone === 'spark' ? 'text-brand' : 'text-ink-faint'
      }`}
    >
      {children}
    </div>
  );
}

/* ── Prompt box, original (with strike) or rewritten (with highlight) ──── */

function PromptBox({ phase, variant }: { phase: Phase; variant: 'original' | 'rewritten' }) {
  if (variant === 'original') {
    // Strike-through kicks in once the policy reject lands.
    const struck = phase === 'reject' || phase === 'prompt' || phase === 'rewrite' || phase === 'recheck' || phase === 'approved' || phase === 'ship';
    const dimmed = struck;

    return (
      <div
        className={`bg-surface border border-field rounded-md px-3 py-2.5 font-mono text-caption leading-[1.55] transition-colors duration-300 ${
          dimmed ? 'text-ink-faint' : 'text-ink'
        }`}
      >
        <span>{ORIGINAL.prefix}</span>
        <motion.span
          animate={{
            color: struck
              ? 'rgb(var(--danger))'
              : 'rgb(var(--ink))',
            textDecorationColor: struck
              ? 'rgb(var(--danger))'
              : 'transparent',
          }}
          transition={{ duration: 0.25 }}
          className="font-semibold"
          style={{
            textDecorationLine: struck ? 'line-through' : 'none',
            textDecorationThickness: '1.5px',
          }}
        >
          {ORIGINAL.risky}
        </motion.span>
        <span>{ORIGINAL.suffix}</span>
      </div>
    );
  }

  // Rewritten: tokens fade in left to right; the swap is highlighted.
  const visible = phase === 'rewrite' || phase === 'recheck' || phase === 'approved' || phase === 'ship';

  return (
    <div className="bg-surface border border-brand/40 rounded-md px-3 py-2.5 font-mono text-caption leading-[1.55] text-ink">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        {REWRITTEN.prefix}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, backgroundColor: 'rgb(var(--brand) / 0)' }}
        animate={{
          opacity: visible ? 1 : 0,
          backgroundColor: visible ? 'rgb(var(--brand) / 0.16)' : 'rgb(var(--brand) / 0)',
        }}
        transition={{
          opacity: { duration: 0.25, delay: visible ? 0.25 : 0 },
          backgroundColor: { duration: 0.25, delay: visible ? 0.45 : 0 },
        }}
        className="px-1 rounded font-semibold text-brand"
      >
        {REWRITTEN.swap}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25, delay: visible ? 0.6 : 0 }}
      >
        {REWRITTEN.suffix}
      </motion.span>
    </div>
  );
}

/* ── Check line, content-policy verdict status row ─────────────────────── */

function CheckLine({
  phase,
  variant,
}: {
  phase: Phase;
  variant: 'first' | 'second';
}) {
  const state =
    variant === 'first'
      ? phase === 'idle'
        ? 'idle'
        : phase === 'check'
        ? 'running'
        : 'rejected'
      : phase === 'rewrite' || phase === 'prompt'
        ? 'idle'
        : phase === 'recheck'
        ? 'running'
        : 'approved';

  const cfg =
    state === 'running'
      ? { text: 'running content-policy check…', tone: 'text-ink-muted', dot: 'bg-brand animate-pulse' }
      : state === 'rejected'
      ? { text: `✗ rejected · ${REJECT_REASON}`, tone: 'text-danger', dot: 'bg-danger' }
      : state === 'approved'
      ? { text: '✓ approved · output shipped', tone: 'text-ok', dot: 'bg-ok' }
      : { text: 'pending', tone: 'text-ink-faint', dot: 'bg-field' };

  return (
    <div className="px-4 md:px-5 py-2 border-t border-field bg-surface/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${variant}-${state}`}
          initial={{ opacity: 0, x: -3 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 3 }}
          transition={{ duration: 0.15 }}
          className={`flex items-center gap-2 font-mono text-micro ${cfg.tone}`}
        >
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden />
          <span>{cfg.text}</span>
          {state === 'rejected' && (
            <span className="ml-auto font-mono text-micro uppercase tracking-eyebrow text-danger border border-danger/55 bg-danger/10 rounded px-1.5 py-[1px]">
              REFUSAL
            </span>
          )}
          {state === 'approved' && (
            <span className="ml-auto font-mono text-micro uppercase tracking-eyebrow text-ok border border-ok/55 bg-ok/10 rounded px-1.5 py-[1px]">
              SHIPPED
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Prompt-enhance arrow, small "enhancer activated" indicator ────────── */

function PromptArrow({ phase }: { phase: Phase }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-1 font-mono text-micro uppercase tracking-eyebrow text-brand">
      <motion.span
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        aria-hidden
      >
        ↓
      </motion.span>
      <span>enhancer.prompt</span>
      <span className="text-ink-faint normal-case tracking-normal">·</span>
      <span className="text-ink-faint normal-case tracking-normal tabular-nums">{PROMPT_MS}ms</span>
    </div>
  );
}

/* ── Value chain, bottom strip showing user → app → each ──────────────── */

function ValueChain({ phase }: { phase: Phase }) {
  const shipped = phase === 'ship';

  return (
    <div className="border-t border-field bg-surface/40 px-4 md:px-5 py-3">
      <Eyebrow size="sm" tone="ink-faint" className="mb-2">value chain</Eyebrow>
      <div className="flex items-center gap-2 font-mono text-micro">
        <ChainNode label="user" sub="got output" lit={shipped} delay={0} />
        <Arrow lit={shipped} delay={0.15} />
        <ChainNode label="your app" sub="billed user" lit={shipped} delay={0.3} />
        <Arrow lit={shipped} delay={0.45} />
        <ChainNode label="each::labs" sub="billed you" lit={shipped} delay={0.6} />
      </div>
    </div>
  );
}

function ChainNode({
  label,
  sub,
  lit,
  delay,
}: {
  label: string;
  sub: string;
  lit: boolean;
  delay: number;
}) {
  return (
    <motion.div
      animate={{
        borderColor: lit ? 'rgb(var(--brand) / 0.55)' : 'rgb(var(--field))',
      }}
      transition={{ duration: 0.2, delay }}
      className="flex flex-col items-center gap-0.5 px-2 py-1 border rounded-md bg-surface flex-1 min-w-0"
    >
      <span className={`text-micro truncate ${lit ? 'text-brand' : 'text-ink-muted'}`}>
        {label}
      </span>
      <motion.span
        animate={{ opacity: lit ? 1 : 0.5, color: lit ? 'rgb(var(--ok))' : 'rgb(var(--ink-faint))' }}
        transition={{ duration: 0.2, delay }}
        className="text-micro flex items-center gap-1 whitespace-nowrap"
      >
        {lit && <span aria-hidden>✓</span>}
        <span>{sub}</span>
      </motion.span>
    </motion.div>
  );
}

function Arrow({ lit, delay }: { lit: boolean; delay: number }) {
  return (
    <motion.span
      className="text-body shrink-0"
      animate={{
        color: lit ? 'rgb(var(--brand))' : 'rgb(var(--field))',
        opacity: lit ? 1 : 0.4,
      }}
      transition={{ duration: 0.2, delay }}
      aria-hidden
    >
      →
    </motion.span>
  );
}
