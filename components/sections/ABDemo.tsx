'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   ABDemo — the 5-second story for /ab.

   Story: a live experiment running on production traffic. Calls accumulate,
   quality bars fill, p-value drops below 0.05, AUTO-PROMOTE fires, and the
   winner moves to 100% traffic — no redeploy.

   ~6.4s loop, six phases:
     idle      0.0 – 0.4   reset / both at 0
     start     0.4 – 0.9   experiment header appears
     accrual   0.9 – 3.4   counts tick up; quality bars fill
     pvalue    3.4 – 4.2   p-value drops below 0.05; "significant" badge
     promote   4.2 – 5.4   AUTO-PROMOTE fires; winner moves to 100%
     hold      5.4 – 6.4   brief still moment before loop
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'start' | 'accrual' | 'pvalue' | 'promote' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  start: 500,
  accrual: 2500,
  pvalue: 800,
  promote: 1200,
  hold: 1000,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

const VARIANTS = {
  winner: { name: 'kling-v3', endCalls: 5238, quality: 91 },
  loser:  { name: 'kling-v2', endCalls: 5219, quality: 82 },
};

export function ABDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0); // 0..1 across the accrual phase
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
      setProgress(0);
      const order: Phase[] = ['start', 'accrual', 'pvalue', 'promote', 'hold'];
      let acc = TIMINGS.idle;
      for (const p of order) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => {
          setPhase(p);
          if (p === 'accrual') {
            const startedAt = Date.now();
            intervalRef.current = setInterval(() => {
              const e = (Date.now() - startedAt) / TIMINGS.accrual;
              setProgress(Math.min(1, e));
              if (e >= 1 && intervalRef.current) clearInterval(intervalRef.current);
            }, 50);
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

  // Variant traffic split — 50/50 until promote; then 100/0 to the winner.
  const promoted = phase === 'promote' || phase === 'hold';
  const winnerSplit = promoted ? 100 : 50;
  const loserSplit  = promoted ? 0   : 50;

  // Animated counters & bars — derived from progress within the accrual phase,
  // pinned to final values once we move past accrual.
  const t = phase === 'accrual' ? progress : phase === 'idle' || phase === 'start' ? 0 : 1;
  const winnerCalls = Math.round(VARIANTS.winner.endCalls * t);
  const loserCalls  = Math.round(VARIANTS.loser.endCalls  * t);
  const winnerQ = Math.round(VARIANTS.winner.quality * t);
  const loserQ  = Math.round(VARIANTS.loser.quality  * t);

  const showSig = phase === 'pvalue' || phase === 'promote' || phase === 'hold';

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
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
              EXPERIMENT · LIVE
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-eyebrow text-spark border border-spark/40 rounded px-1.5 py-0.5 bg-spark/[0.04]">
            COMING Q1 2026
          </span>
        </div>

        {/* Experiment metadata */}
        <div className="px-4 md:px-5 pt-3 pb-2 border-b border-rule2 bg-bg/30">
          <div className="flex items-center justify-between font-mono text-[10.5px]">
            <span className="text-ink">kling-v3 vs kling-v2</span>
            <SignificancePill phase={phase} />
          </div>
        </div>

        {/* Two variant cards */}
        <div className="px-4 md:px-5 pt-3 pb-3 grid grid-cols-2 gap-3">
          <VariantCard
            label={VARIANTS.winner.name}
            calls={winnerCalls}
            quality={winnerQ}
            split={winnerSplit}
            isWinner
            promoted={promoted}
          />
          <VariantCard
            label={VARIANTS.loser.name}
            calls={loserCalls}
            quality={loserQ}
            split={loserSplit}
            isWinner={false}
            promoted={promoted}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={
                phase === 'promote' || phase === 'hold' ? 'promoted'
                : showSig                                 ? 'sig'
                : phase === 'accrual'                     ? 'accruing'
                : 'idle'
              }
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 font-mono text-[10px]"
            >
              {phase === 'promote' || phase === 'hold' ? (
                <>
                  <span className="text-success">✓</span>
                  <span className="text-spark uppercase tracking-eyebrow">auto-promoted</span>
                  <span className="text-ink2">{VARIANTS.winner.name} · 100% traffic</span>
                  <span className="ml-auto text-ink3">no redeploy · sticky cohort kept</span>
                </>
              ) : showSig ? (
                <>
                  <span className="text-success">✓</span>
                  <span className="text-success uppercase tracking-eyebrow">significant</span>
                  <span className="text-ink2">winner: kling-v3 · auto-promoting</span>
                </>
              ) : phase === 'accrual' ? (
                <>
                  <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
                  <span className="text-ink3 uppercase tracking-eyebrow">accruing · 50/50 sticky cohort</span>
                  <span className="ml-auto text-ink3 tabular-nums">
                    n = {(winnerCalls + loserCalls).toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
                  <span className="text-ink3 uppercase tracking-eyebrow">setting up · 50/50 split · auto-promote at 0.95</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        sticky cohorts · live significance · one-click promote
      </div>
    </div>
  );
}

/* ── Variant card — counts, quality bar, split percentage ───────────────── */

function VariantCard({
  label,
  calls,
  quality,
  split,
  isWinner,
  promoted,
}: {
  label: string;
  calls: number;
  quality: number;
  split: number;
  isWinner: boolean;
  promoted: boolean;
}) {
  const lit = isWinner;
  return (
    <motion.div
      animate={{
        borderColor: lit ? 'rgb(var(--c-spark) / 0.55)' : 'rgb(var(--c-rule2))',
        opacity: !isWinner && promoted ? 0.45 : 1,
      }}
      transition={{ duration: 0.3 }}
      className="bg-bg border rounded-md p-3 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-[11px] ${
            isWinner ? 'text-spark' : 'text-ink2'
          }`}
        >
          {label}
        </span>
        <AnimatePresence mode="wait">
          {isWinner && promoted && (
            <motion.span
              key="winner-check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="text-success text-[14px] leading-none"
              aria-hidden
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Calls counter */}
      <div className="flex items-baseline gap-1">
        <span
          className={`font-display text-[18px] font-semibold tabular-nums ${
            isWinner ? 'text-ink' : 'text-ink2'
          }`}
        >
          {calls.toLocaleString()}
        </span>
        <span className="text-ink3 text-[10px]">calls</span>
      </div>

      {/* Quality bar */}
      <div className="flex flex-col gap-1">
        <div className="h-2 bg-surface2 rounded-full overflow-hidden">
          <motion.span
            className={`block h-full rounded-full ${isWinner ? 'bg-spark' : 'bg-ink2/40'}`}
            initial={{ width: 0 }}
            animate={{ width: `${quality}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="flex items-baseline justify-between font-mono text-[9px]">
          <span className="text-ink3 uppercase tracking-eyebrow">quality</span>
          <span className={`tabular-nums ${isWinner ? 'text-spark' : 'text-ink2'}`}>
            {quality}%
          </span>
        </div>
      </div>

      {/* Traffic split */}
      <div className="flex items-baseline justify-between font-mono text-[9px] border-t border-rule2 pt-1.5 mt-0.5">
        <span className="text-ink3 uppercase tracking-eyebrow">traffic</span>
        <motion.span
          key={split}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.22 }}
          className={`tabular-nums ${isWinner ? 'text-spark' : 'text-ink2'}`}
        >
          {split}%
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ── Significance pill — p-value display that drops as accrual happens ──── */

function SignificancePill({ phase }: { phase: Phase }) {
  const text =
    phase === 'idle' || phase === 'start'
      ? 'p = —'
      : phase === 'accrual'
      ? 'p = 0.18'
      : 'p < 0.05';

  const tone =
    phase === 'pvalue' || phase === 'promote' || phase === 'hold'
      ? 'text-success border-success/55 bg-success/8'
      : 'text-ink3 border-rule2 bg-bg';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`inline-flex items-center font-mono text-[10px] uppercase tracking-eyebrow px-1.5 py-0.5 border rounded ${tone}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}
