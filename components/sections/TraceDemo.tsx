'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   TraceDemo — the 5-second story for /trace.

   Story: every each.run() emits a complete trace — every step, fallback, and
   cost — tagged with attributes. We show one live trace forming in real time,
   then computing totals, then streaming to a warehouse.

   ~6.4s loop:
     idle    0.0 – 0.4   trace_id appears
     attrs   0.4 – 0.9   user/tier/region attrs slide in
     s1–s5   0.9 – 4.4   five steps populate with status colors (one fallback)
     totals  4.4 – 5.0   cost + latency + fallback counter compute
     export  5.0 – 6.0   "→ bigquery hourly" pill fires
     hold    6.0 – 6.4   brief still moment before loop
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'attrs' | 'streaming' | 'totals' | 'export' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  attrs: 500,
  streaming: 3500, // covers s1..s5
  totals: 600,
  export: 1000,
  hold: 400,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

type Step = {
  step: string;
  model: string;
  ms: number;
  cost: string;
  ok: boolean;
};

const STEPS: Step[] = [
  { step: 'enhance',   model: 'gpt-4o',     ms:  820, cost: '$0.001', ok: true  },
  { step: 'primary',   model: 'kling-v3',   ms: 4500, cost: '$0.000', ok: false },
  { step: 'fallback',  model: 'wan-2.7',    ms: 1180, cost: '$0.140', ok: true  },
  { step: 'audio',     model: 'eleven-v3',  ms: 1180, cost: '$0.014', ok: true  },
  { step: 'merge',     model: 'compose',    ms:  240, cost: '$0.000', ok: true  },
];

/* Cumulative reveal progress (0..1) for a step at a given elapsed-ms in
   the streaming phase. Each step appears at evenly-spaced intervals. */
function visibleStepCount(phase: Phase, msElapsed: number): number {
  if (phase === 'idle' || phase === 'attrs') return 0;
  if (phase !== 'streaming') return STEPS.length;
  const perStep = TIMINGS.streaming / STEPS.length;
  return Math.min(STEPS.length, Math.floor(msElapsed / perStep) + 1);
}

export function TraceDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [streamMs, setStreamMs] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    function tick() {
      clearAll();
      setPhase('idle');
      setStreamMs(0);
      const order: Phase[] = ['attrs', 'streaming', 'totals', 'export', 'hold'];
      let acc = TIMINGS.idle;
      for (const p of order) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => {
          setPhase(p);
          if (p === 'streaming') {
            // Drive a millisecond counter so each step appears in turn.
            const start = Date.now();
            intervalRef.current = setInterval(() => {
              const e = Date.now() - start;
              setStreamMs(e);
              if (e > TIMINGS.streaming) {
                if (intervalRef.current) clearInterval(intervalRef.current);
              }
            }, 80);
          }
        }, at));
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

  const visible = visibleStepCount(phase, streamMs);
  const showTotals = phase === 'totals' || phase === 'export' || phase === 'hold';
  const showExport = phase === 'export' || phase === 'hold';

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-spark/[0.10] via-transparent to-spark/[0.05] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              TRACE · LIVE
            </span>
          </div>
          <span className="font-mono text-[10px] text-ink3">trace_id · 8f2a · t-3ms</span>
        </div>

        {/* Attribute row */}
        <div className="px-4 md:px-5 pt-3 pb-2 border-b border-rule2 bg-bg/30">
          <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1.5">
            attrs
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px]">
            <Attr name="user_id" value='"u_241"' delay={0} visible={phase !== 'idle'} />
            <Attr name="tier"    value='"pro"'   delay={0.08} visible={phase !== 'idle'} />
            <Attr name="region"  value='"eu"'   delay={0.16} visible={phase !== 'idle'} />
            <Attr name="surface" value='"web"' delay={0.24} visible={phase !== 'idle'} />
          </div>
        </div>

        {/* Steps */}
        <div className="px-4 md:px-5 pt-3 pb-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1">
            <span>steps</span>
            <span className="normal-case tracking-normal">cost · latency · ok</span>
          </div>
          {STEPS.map((s, i) => (
            <StepRow key={s.step} s={s} visible={i < visible} />
          ))}
        </div>

        {/* Totals strip */}
        <AnimatePresence>
          {showTotals && (
            <motion.div
              key="totals"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-3 gap-px bg-rule2 border-t border-rule2 overflow-hidden"
            >
              <Totals label="Σ cost"      value="$0.155" tone="spark"     />
              <Totals label="latency"     value="7.92s"  tone="ink"       />
              <Totals label="fallbacks"   value="1"      tone="highlight" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export footer */}
        <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={showExport ? 'export' : 'idle'}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-2 font-mono text-[10px]"
            >
              {showExport ? (
                <>
                  <span className="text-success">✓</span>
                  <span className="text-ink3 uppercase tracking-eyebrow">export</span>
                  <span className="text-ink">→ bigquery://analytics.traces</span>
                  <span className="ml-auto text-spark uppercase tracking-eyebrow">hourly</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
                  <span className="text-ink3 uppercase tracking-eyebrow">capturing · &lt;3ms overhead</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        every step · every fallback · every dollar · in one trace
      </div>
    </div>
  );
}

/* ── Attribute pill ─────────────────────────────────────────────────────── */

function Attr({
  name,
  value,
  delay,
  visible,
}: {
  name: string;
  value: string;
  delay: number;
  visible: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -3 }}
      animate={{ opacity: visible ? 1 : 0, x: 0 }}
      transition={{ duration: 0.22, delay: visible ? delay : 0 }}
      className="inline-flex items-center gap-1 px-1.5 py-[2px] bg-bg border border-rule2 rounded"
    >
      <span className="text-ink2">{name}</span>
      <span className="text-ink3">:</span>
      <span className="text-spark">{value}</span>
    </motion.span>
  );
}

/* ── Step row — appears as the trace streams in ─────────────────────────── */

function StepRow({ s, visible }: { s: Step; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -4 }}
      transition={{ duration: 0.22 }}
      className={`flex items-center gap-2.5 px-2.5 py-1.5 bg-bg border rounded-md font-mono text-[10.5px] ${
        visible
          ? s.ok
            ? 'border-rule2'
            : 'border-fail/45'
          : 'border-rule2 opacity-0'
      }`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          s.ok ? 'bg-success' : 'bg-fail'
        }`}
        aria-hidden
      />
      <span className="text-ink3 w-[68px] uppercase tracking-eyebrow text-[9.5px]">
        {s.step}
      </span>
      <span className={`flex-1 truncate ${s.ok ? 'text-ink' : 'text-fail'}`}>
        {s.model}
      </span>
      <span className="text-ink2 tabular-nums w-12 text-right">{s.cost}</span>
      <span className="text-ink3 tabular-nums w-14 text-right">{s.ms}ms</span>
      <span
        className={`font-mono text-[9px] uppercase tracking-eyebrow w-8 text-center ${
          s.ok ? 'text-success' : 'text-fail'
        }`}
      >
        {s.ok ? 'ok' : 'fail'}
      </span>
    </motion.div>
  );
}

/* ── Totals strip cell ──────────────────────────────────────────────────── */

function Totals({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'spark' | 'highlight' | 'ink';
}) {
  const cls =
    tone === 'spark' ? 'text-spark'
    : tone === 'highlight' ? 'text-highlight'
    : 'text-ink';
  return (
    <div className="bg-surface px-3 py-2.5 text-center">
      <div className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">
        {label}
      </div>
      <div className={`font-display text-[15px] font-semibold tabular-nums mt-0.5 ${cls}`}>
        {value}
      </div>
    </div>
  );
}
