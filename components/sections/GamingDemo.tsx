'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   GamingDemo — the 5-second story for /usecases/gaming.

   "Winter event drops in T-7 days." Countdown-style aesthetic with four
   asset categories (NPCs, dialogue, textures, music) filling up as we
   tick toward T-0 LIVE. Different from any other demo — this is a
   COUNTDOWN, not a process pipeline.

   ~7.6s loop:
     idle    400    queued
     ramp    4800   countdown ticks T-7 → T-0 with assets streaming in
     live    1500   T-0 LIVE state · all categories filled
     hold    900    held on LIVE
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'ramp' | 'live' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  ramp: 4800,
  live: 1500,
  hold: 900,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

// Days from now, animated through ramp phase
const DAYS_AT = (progress: number) => Math.max(0, Math.round(7 - progress * 7));

type Category = {
  id: string;
  label: string;
  unit: string;
  finalCount: number;
  tone: string; // CSS var name fragment
};

const CATEGORIES: Category[] = [
  { id: 'npcs',     label: 'NPCs',          unit: 'characters', finalCount: 18,  tone: 'spark' },
  { id: 'dialogue', label: 'dialogue lines', unit: 'lines · 30 lang', finalCount: 412, tone: 'highlight' },
  { id: 'textures', label: 'textures',       unit: 'variants',  finalCount: 64,  tone: 'sun' },
  { id: 'music',    label: 'music cues',     unit: 'loops',     finalCount: 9,   tone: 'success' },
];

export function GamingDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0); // 0..1 across ramp
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
      const order: Phase[] = ['ramp', 'live', 'hold'];
      let acc = TIMINGS.idle;
      for (const p of order) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => {
          setPhase(p);
          if (p === 'ramp') {
            const start = Date.now();
            intervalRef.current = setInterval(() => {
              const t = (Date.now() - start) / TIMINGS.ramp;
              setProgress(Math.min(1, t));
              if (t >= 1 && intervalRef.current) clearInterval(intervalRef.current);
            }, 60);
          } else if (p === 'live') {
            setProgress(1);
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

  const days = phase === 'idle' ? 7 : phase === 'live' || phase === 'hold' ? 0 : DAYS_AT(progress);
  const isLive = phase === 'live' || phase === 'hold';

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-highlight/[0.10] via-spark/[0.06] to-success/[0.06] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${isLive ? 'bg-success' : 'bg-spark'} animate-pulse`} aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              LIVE EVENT · build
            </span>
          </div>
          <span className="font-mono text-[10px] text-ink3">
            "midnight forge · winter event"
          </span>
        </div>

        {/* Countdown */}
        <div className="px-4 md:px-5 pt-4 pb-4 border-b border-rule2 bg-bg/30">
          <CountdownClock days={days} isLive={isLive} />
        </div>

        {/* Asset queue lanes */}
        <div className="px-4 md:px-5 pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
              asset queues · parallel
            </span>
            <span className="font-mono text-[9px] text-spark">
              one workflow · 4 categories
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat, i) => (
              <CategoryLane
                key={cat.id}
                cat={cat}
                progress={isLive ? 1 : Math.min(1, progress * 1.05)}
                idx={i}
                isLive={isLive}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLive ? 'live' : phase}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-2 font-mono text-[10px]"
            >
              {isLive ? (
                <>
                  <span className="text-success">● LIVE</span>
                  <span className="text-ink2">503 assets · audited · rolled out</span>
                  <span className="ml-auto text-spark uppercase tracking-eyebrow">
                    rollback in 1 click
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
                  <span className="text-ink3 uppercase tracking-eyebrow">
                    building · all queues running parallel
                  </span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        characters · dialogue · textures · music — one workflow per event
      </div>
    </div>
  );
}

/* ── Countdown clock — big "T-X DAYS" digits ────────────────────────────── */

function CountdownClock({ days, isLive }: { days: number; isLive: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {isLive ? 'NOW' : 'T-MINUS'}
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={isLive ? 'live' : days}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="flex items-baseline gap-1"
          >
            {isLive ? (
              <span className="font-display text-[40px] md:text-[48px] font-semibold tabular-nums text-success leading-none">
                LIVE
              </span>
            ) : (
              <>
                <span className="font-display text-[40px] md:text-[48px] font-semibold tabular-nums text-spark leading-none">
                  {days}
                </span>
                <span className="font-mono text-[12px] text-ink2 lowercase">days</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Day-segment indicator (7 → 0) */}
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: 7 }).map((_, i) => {
          const elapsed = i < 7 - days;
          return (
            <motion.span
              key={i}
              animate={{
                backgroundColor: isLive
                  ? 'rgb(var(--c-success))'
                  : elapsed
                  ? 'rgb(var(--c-spark))'
                  : 'rgb(var(--c-rule2))',
                opacity: elapsed || isLive ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              className="block w-2 h-4 rounded-sm"
              aria-hidden
            />
          );
        })}
      </div>
    </div>
  );
}

/* ── Category lane — progress bar with item count ───────────────────────── */

function CategoryLane({
  cat,
  progress,
  idx,
  isLive,
}: {
  cat: Category;
  progress: number;
  idx: number;
  isLive: boolean;
}) {
  // Stagger lanes so they don't all finish together
  const lagged = Math.max(0, Math.min(1, progress * 1.1 - idx * 0.04));
  const count = Math.round(cat.finalCount * lagged);

  return (
    <div className="grid grid-cols-[120px_1fr_64px_36px] gap-2 items-center px-2 py-1.5 bg-bg border border-rule2 rounded">
      <div className="flex flex-col">
        <span className="font-mono text-[10.5px] text-ink">{cat.label}</span>
        <span className="font-mono text-[8.5px] text-ink3">{cat.unit}</span>
      </div>
      <div className="h-2 bg-surface2 rounded-sm overflow-hidden">
        <motion.span
          className="block h-full rounded-sm"
          style={{ background: `rgb(var(--c-${cat.tone}))` }}
          animate={{ width: `${lagged * 100}%` }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
      </div>
      <span className="font-mono text-[10px] tabular-nums text-spark text-right">
        {count}/{cat.finalCount}
      </span>
      <span className="font-mono text-[10px] text-success text-center">
        {isLive || lagged >= 1 ? '✓' : ''}
      </span>
    </div>
  );
}
