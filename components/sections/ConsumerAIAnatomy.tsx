'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   ConsumerAIAnatomy — under-the-hood walkthrough of ONE consumer-app call.

   Visual: a left-to-right pipeline showing user → your app → each::labs →
   provider → user. The middle box expands to show what each::labs does
   internally — score router, maybe rescue, run, trace, cost — while the
   outside chain flows like the user never sees any of it.

   ~6.4s loop. The point: a developer reads this and realizes "all this
   stuff happens for free, every call."
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'tap' | 'call' | 'inside' | 'response' | 'seen';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  tap: 800,
  call: 800,
  inside: 2400,
  response: 800,
  seen: 1200,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

export function ConsumerAIAnatomy() {
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
      const order: Phase[] = ['tap', 'call', 'inside', 'response', 'seen'];
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
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● ANATOMY OF ONE CALL
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        What happens between &ldquo;tap&rdquo; and &ldquo;render&rdquo;.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Five outside-the-app steps, fifteen inside-the-platform decisions —
        all under 2 seconds, all already wired. Your code only writes the first
        and last lines.
      </p>

      <div className="mt-12 bg-surface border border-rule2 rounded-md p-5 md:p-7">
        {/* Top header strip */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              one consumer call · live
            </span>
          </div>
          <PhaseLabel phase={phase} />
        </div>

        {/* Outer pipeline — 5 boxes + 4 connectors. Use flex (not grid) so the
            connectors can be narrow and the boxes can be wide. On mobile (no
            md) we just stack vertically and hide connectors. */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch relative [&>*:nth-child(odd)]:flex-1">
          <OuterStep
            label="USER"
            sub="taps generate"
            active={phase === 'tap' || phase === 'call' || phase === 'inside' || phase === 'response' || phase === 'seen'}
            done={phase === 'seen' || phase === 'response' || phase === 'inside' || phase === 'call'}
          />
          <Connector active={phase === 'call' || phase === 'inside' || phase === 'response' || phase === 'seen'} />
          <OuterStep
            label="YOUR APP"
            sub="each.run({ ... })"
            active={phase === 'call' || phase === 'inside' || phase === 'response' || phase === 'seen'}
            done={phase === 'seen' || phase === 'response' || phase === 'inside'}
          />
          <Connector active={phase === 'inside' || phase === 'response' || phase === 'seen'} />
          <EachLabsStep active={phase === 'inside' || phase === 'response' || phase === 'seen'} done={phase === 'response' || phase === 'seen'} subPhase={phase} />
          <Connector active={phase === 'response' || phase === 'seen'} />
          <OuterStep
            label="PROVIDER"
            sub="kling-v3 / wan-2.7"
            active={phase === 'inside' || phase === 'response' || phase === 'seen'}
            done={phase === 'response' || phase === 'seen'}
          />
          <Connector active={phase === 'seen'} />
          <OuterStep
            label="USER"
            sub="sees output"
            active={phase === 'seen'}
            done={phase === 'seen'}
            highlight
          />
        </div>

        {/* Inside-the-platform breakdown */}
        <InsideStrip phase={phase} />

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-px bg-rule2 border border-rule2 rounded mt-6 overflow-hidden">
          <Stat label="round-trip" value="1.84s" tone="spark" />
          <Stat label="user delay" value="+0ms" tone="success" />
          <Stat label="lines you wrote" value="2" tone="highlight" />
        </div>
      </div>
    </section>
  );
}

/* ── Phase label ────────────────────────────────────────────────────────── */

function PhaseLabel({ phase }: { phase: Phase }) {
  const text =
    phase === 'idle'     ? 'queued'
    : phase === 'tap'      ? 'user taps'
    : phase === 'call'     ? 'each.run()'
    : phase === 'inside'   ? 'platform handles · 6 steps'
    : phase === 'response' ? 'provider responds'
    : 'render · 1.84s · trace_id wf_8f2a';

  const tone =
    phase === 'idle' ? 'text-ink3'
    : phase === 'seen'  ? 'text-success'
    : 'text-spark';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phase}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.16 }}
        className={`font-mono text-[10px] uppercase tracking-eyebrow ${tone}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

/* ── Outer-pipeline step ────────────────────────────────────────────────── */

function OuterStep({
  label,
  sub,
  active,
  done,
  highlight,
}: {
  label: string;
  sub: string;
  active: boolean;
  done: boolean;
  highlight?: boolean;
}) {
  return (
    <motion.div
      animate={{
        borderColor: active
          ? 'rgb(var(--c-spark) / 0.55)'
          : 'rgb(var(--c-rule2))',
        backgroundColor: highlight && active
          ? 'rgb(var(--c-spark) / 0.06)'
          : 'rgb(var(--c-bg))',
      }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center gap-1 px-3 py-3 border rounded-md text-center"
    >
      <div className="flex items-center gap-1.5">
        {done && <span className="text-success text-[10px]" aria-hidden>✓</span>}
        <span
          className={`font-mono text-[10px] uppercase tracking-eyebrow ${
            active ? 'text-spark' : 'text-ink3'
          }`}
        >
          {label}
        </span>
      </div>
      <span className={`font-mono text-[10px] ${active ? 'text-ink' : 'text-ink3'}`}>
        {sub}
      </span>
    </motion.div>
  );
}

/* ── each::labs step — visually distinct, contains the inside breakdown ───── */

function EachLabsStep({
  active,
  done,
  subPhase,
}: {
  active: boolean;
  done: boolean;
  subPhase: Phase;
}) {
  return (
    <motion.div
      animate={{
        borderColor: active
          ? 'rgb(var(--c-spark) / 0.7)'
          : 'rgb(var(--c-rule2))',
        boxShadow: active ? '0 0 0 1px rgb(var(--c-spark) / 0.2)' : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 border rounded-md text-center bg-bg"
    >
      <div className="flex items-center gap-1.5">
        {done && <span className="text-success text-[10px]" aria-hidden>✓</span>}
        <span className={`font-mono text-[10px] ${active ? 'text-spark' : 'text-ink3'}`}>
          <EachLabel name="each::labs" />
        </span>
      </div>
      <motion.span
        className="font-mono text-[10px] text-ink3"
        animate={{ opacity: subPhase === 'inside' ? [0.5, 1, 0.5] : 1 }}
        transition={{ duration: 0.9, repeat: subPhase === 'inside' ? Infinity : 0 }}
      >
        ◐ orchestrates
      </motion.span>
    </motion.div>
  );
}

/* ── Connector — small arrow + line, lit when packet is past ────────────── */

function Connector({ active }: { active: boolean }) {
  return (
    <div className="hidden md:flex items-center justify-center relative w-6 shrink-0">
      <motion.span
        className="block h-px w-full"
        animate={{
          backgroundColor: active ? 'rgb(var(--c-spark))' : 'rgb(var(--c-rule2))',
        }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        className="absolute text-[14px]"
        animate={{
          color: active ? 'rgb(var(--c-spark))' : 'rgb(var(--c-rule2))',
          x: active ? [0, 3, 0] : 0,
        }}
        transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
        aria-hidden
      >
        →
      </motion.span>
    </div>
  );
}

/* ── Inside-the-platform sub-step strip ─────────────────────────────────── */

const INSIDE_STEPS: { id: string; label: string; ms: string; tone: 'spark' | 'highlight' }[] = [
  { id: 'auth',    label: 'auth + tier check',    ms: '4ms',  tone: 'highlight' },
  { id: 'router',  label: 'router · score 3 ',    ms: '38ms', tone: 'spark' },
  { id: 'rescue',  label: 'enhancer · pre-check', ms: '24ms', tone: 'spark' },
  { id: 'run',     label: 'kling-v3 · run',       ms: '1.7s', tone: 'spark' },
  { id: 'trace',   label: 'trace · stamp',        ms: '<3ms', tone: 'highlight' },
  { id: 'cost',    label: 'cost · meter',         ms: '<1ms', tone: 'highlight' },
];

function InsideStrip({ phase }: { phase: Phase }) {
  const visible = phase === 'inside' || phase === 'response' || phase === 'seen';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-5 pt-4 border-t border-rule2">
            <div className="flex items-center justify-between mb-3">
              <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                inside <EachLabel name="each::labs" />
              </div>
              <div className="font-mono text-[9.5px] text-spark">
                6 steps · &lt;120ms overhead
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {INSIDE_STEPS.map((s, i) => (
                <InsideChip key={s.id} step={s} delay={0.06 + i * 0.07} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InsideChip({
  step,
  delay,
}: {
  step: { id: string; label: string; ms: string; tone: 'spark' | 'highlight' };
  delay: number;
}) {
  const cls = step.tone === 'spark' ? 'text-spark border-spark/45' : 'text-highlight border-highlight/45';
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={`flex items-center justify-between gap-2 px-2.5 py-2 bg-bg border rounded font-mono text-[10px] ${cls}`}
    >
      <span className="truncate">{step.label}</span>
      <span className="text-ink3 tabular-nums whitespace-nowrap">{step.ms}</span>
    </motion.div>
  );
}

/* ── Stat cell ──────────────────────────────────────────────────────────── */

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'spark' | 'highlight' | 'success';
}) {
  const cls =
    tone === 'spark' ? 'text-spark'
    : tone === 'highlight' ? 'text-highlight'
    : 'text-success';
  return (
    <div className="bg-surface px-3 py-3 text-center">
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
        {label}
      </div>
      <div className={`font-display text-[16px] font-semibold tabular-nums mt-0.5 ${cls}`}>
        {value}
      </div>
    </div>
  );
}
