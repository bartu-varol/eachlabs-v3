'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   AttributesDemo — the 5-second story for /attributes.

   Story: pass `attrs: { ... }` to each.run(); those tags become live filter
   dimensions in your dashboard. Slice cost by any combination, drill to one
   request, no schema, no migrations.

   ~6s loop, five phases:
     idle    0.0 – 0.4   reset
     tag     0.4 – 2.4   five attrs slide in to the each.run() block
     dims    2.4 – 3.0   "AVAILABLE DIMENSIONS" panel materializes
     slice   3.0 – 4.5   click "tier" → cost re-slices into pro/team/free bars
     drill   4.5 – 5.6   click a row → trace_id appears
     hold    5.6 – 6.0   brief still moment before loop
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'tag' | 'dims' | 'slice' | 'drill' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  tag: 2000,
  dims: 600,
  slice: 1500,
  drill: 1100,
  hold: 400,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

const ATTRS = [
  { name: 'user_id',  value: '"u_241"' },
  { name: 'tier',     value: '"pro"'   },
  { name: 'persona',  value: '"creator"' },
  { name: 'region',   value: '"eu"'    },
  { name: 'exp',      value: '"router_v3"' },
];

const TIERS = [
  { name: 'pro',  cost: 0.21, calls: '0.4M', width: 100 },
  { name: 'team', cost: 0.18, calls: '1.2M', width: 86  },
  { name: 'free', cost: 0.04, calls: '2.7M', width: 18  },
];

export function AttributesDemo() {
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
      const order: Phase[] = ['tag', 'dims', 'slice', 'drill', 'hold'];
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

  // Number of attrs visible — ramps up across the `tag` phase.
  const tagPhaseStartedAt = TIMINGS.idle;
  const visibleAttrs =
    phase === 'idle'
      ? 0
      : phase === 'tag'
      ? ATTRS.length // we use stagger via per-attr delay below
      : ATTRS.length;

  const showDims  = phase === 'dims' || phase === 'slice' || phase === 'drill' || phase === 'hold';
  const showSlice = phase === 'slice' || phase === 'drill' || phase === 'hold';
  const showDrill = phase === 'drill' || phase === 'hold';

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
              ATTRIBUTES · PREVIEW
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-eyebrow text-spark border border-spark/40 rounded px-1.5 py-0.5 bg-spark/[0.04]">
            COMING Q1 2026
          </span>
        </div>

        {/* The each.run() snippet with attrs growing */}
        <div className="px-4 md:px-5 pt-4 pb-3 border-b border-rule2">
          <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-2">
            each.run()
          </div>
          <div className="bg-bg border border-rule2 rounded-md font-mono text-[11.5px] leading-[1.6] py-2.5 px-3">
            <div>
              <span className="text-highlight font-medium">await </span>
              <span className="text-ink">each.run(</span>
              <span className="text-ink2">{'{'}</span>
            </div>
            <div className="pl-4">
              <span className="text-ink2">workflow: </span>
              <span className="text-spark">"product-photo-v3"</span>
              <span className="text-ink2">,</span>
            </div>
            <div className="pl-4">
              <span className="text-ink2">attrs: </span>
              <span className="text-ink2">{'{'}</span>
            </div>
            <div className="pl-8 flex flex-col gap-0.5">
              {ATTRS.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{
                    opacity: phase === 'idle' ? 0 : 1,
                    x: phase === 'idle' ? -4 : 0,
                  }}
                  transition={{
                    duration: 0.25,
                    delay: phase === 'idle' ? 0 : i * 0.32,
                  }}
                  className="flex items-baseline"
                >
                  <span className="text-ink2">{a.name}</span>
                  <span className="text-ink3">: </span>
                  <span className="text-spark">{a.value}</span>
                  <span className="text-ink2">,</span>
                </motion.div>
              ))}
            </div>
            <div className="pl-4">
              <span className="text-ink2">{'},'}</span>
            </div>
            <div>
              <span className="text-ink">{'})'}</span>
            </div>
          </div>
        </div>

        {/* Available dimensions */}
        <AnimatePresence>
          {showDims && (
            <motion.div
              key="dims"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 md:px-5 pt-3 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                    available dimensions
                  </div>
                  <div className="font-mono text-[9px] text-success">
                    ✓ inferred · ~30s after first call
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {ATTRS.map((a, i) => (
                    <DimensionChip
                      key={a.name}
                      name={a.name}
                      delay={i * 0.06}
                      active={a.name === 'tier' && (phase === 'slice' || phase === 'drill' || phase === 'hold')}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sliced cost view (appears once dims show; bars animate when phase = slice) */}
        <AnimatePresence>
          {showDims && (
            <motion.div
              key="slice"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-rule2 bg-bg/30"
            >
              <div className="px-4 md:px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                    cost · sliced by{' '}
                    <span className={showSlice ? 'text-spark' : 'text-ink3'}>tier</span>
                  </div>
                  <div className="font-mono text-[9px] text-ink3">24h</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {TIERS.map((t, i) => (
                    <TierBar
                      key={t.name}
                      tier={t}
                      animate={showSlice}
                      drill={showDrill && t.name === 'pro'}
                      delay={i * 0.08}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drill footer */}
        <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={showDrill ? 'drill' : 'idle'}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 font-mono text-[10px]"
            >
              {showDrill ? (
                <>
                  <span className="text-spark" aria-hidden>↳</span>
                  <span className="text-ink uppercase tracking-eyebrow text-[9px]">drill</span>
                  <span className="text-ink2">tier="pro" · u_241</span>
                  <span className="ml-auto text-spark">→ trace_id wf_8f2a</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
                  <span className="text-ink3 uppercase tracking-eyebrow">no schema · no migrations</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        tag once · slice forever · drill to one request
      </div>
    </div>
  );
}

/* ── Dimension chip (a tag becomes a filter) ─────────────────────────────── */

function DimensionChip({
  name,
  delay,
  active,
}: {
  name: string;
  delay: number;
  active: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay }}
      className={`inline-flex items-center gap-1 px-2 py-1 border rounded font-mono text-[10px] ${
        active
          ? 'border-spark/55 bg-spark/[0.08] text-spark'
          : 'border-rule2 bg-bg text-ink2'
      }`}
    >
      {active && <span aria-hidden>◉</span>}
      {name}
    </motion.span>
  );
}

/* ── Tier bar (animates width when slice phase fires) ───────────────────── */

function TierBar({
  tier,
  animate,
  drill,
  delay,
}: {
  tier: { name: string; cost: number; calls: string; width: number };
  animate: boolean;
  drill: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay }}
      className={`grid grid-cols-[60px_1fr_60px_56px] gap-2 items-center px-2 py-1 border rounded font-mono text-[10px] ${
        drill ? 'border-spark/55 bg-spark/[0.06]' : 'border-rule2 bg-surface'
      }`}
    >
      <span className={drill ? 'text-spark' : 'text-ink2'}>{tier.name}</span>
      <div className="h-2 bg-surface2 rounded-sm overflow-hidden">
        <motion.span
          className={`block h-full rounded-sm ${drill ? 'bg-spark' : 'bg-spark/70'}`}
          initial={{ width: 0 }}
          animate={{ width: animate ? `${tier.width}%` : 0 }}
          transition={{ duration: 0.6, delay: animate ? delay + 0.1 : 0, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-spark text-right tabular-nums">${tier.cost.toFixed(2)}</span>
      <span className="text-ink3 text-right tabular-nums">{tier.calls}</span>
    </motion.div>
  );
}
