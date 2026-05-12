'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   AdTechAnatomy — closed-loop creative→serve→measure→refresh CYCLE.

   Different from other anatomies on the site: those were sequential
   pipelines. This one is a 4-quadrant LOOP that rotates. The point is the
   loop never stops — content gets generated, served, measured, then refresh
   triggers new generation. each::labs sits in the middle.
────────────────────────────────────────────────────────────────────────── */

type Quadrant = 'generate' | 'serve' | 'measure' | 'refresh';

const QUADRANTS: Quadrant[] = ['generate', 'serve', 'measure', 'refresh'];
const STEP_MS = 1200;

export function AdTechAnatomy() {
  const [active, setActive] = useState<Quadrant>('generate');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let i = 0;
    intervalRef.current = setInterval(() => {
      i = (i + 1) % QUADRANTS.length;
      setActive(QUADRANTS[i]);
    }, STEP_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● ANATOMY · THE LOOP NEVER STOPS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Generate. Serve. Measure. Refresh.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Performance creative isn&rsquo;t a launch — it&rsquo;s a loop. The
        platform generates the variants, serves through your network, measures
        per-creative attribution, and triggers refresh when CTR fatigues.
        each::labs sits at the center of the loop, not at one end of it.
      </p>

      <div className="mt-12 bg-surface border border-rule2 rounded-md p-5 md:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
          {/* Left column — top + bottom quadrants */}
          <div className="flex flex-col gap-4">
            <Quadrant1 q="generate" active={active === 'generate'} />
            <Quadrant1 q="refresh"  active={active === 'refresh'}  />
          </div>

          {/* Center — each::labs hub with rotating arrow */}
          <CenterHub active={active} />

          {/* Right column — top + bottom quadrants */}
          <div className="flex flex-col gap-4">
            <Quadrant1 q="serve"   active={active === 'serve'}   />
            <Quadrant1 q="measure" active={active === 'measure'} />
          </div>
        </div>

        {/* Outcome stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule2 border border-rule2 rounded mt-6 overflow-hidden">
          <Stat label="cycle time"    value="<5 min"    tone="spark" />
          <Stat label="human gates"   value="0"         tone="success" />
          <Stat label="winners promoted" value="3 / 6" tone="success" />
          <Stat label="losers killed" value="2 / 6"     tone="highlight" />
        </div>
      </div>
    </section>
  );
}

/* ── Quadrant block ─────────────────────────────────────────────────────── */

const QUAD_CONFIG: Record<Quadrant, { title: string; sub: string; pieces: string[]; mini: 'gen' | 'serve' | 'measure' | 'refresh' }> = {
  generate: {
    title: 'GENERATE',
    sub: 'brief → 50 variants',
    pieces: ['each::workflows', 'each::enhancer'],
    mini: 'gen',
  },
  serve: {
    title: 'SERVE',
    sub: 'meta · tiktok · reddit',
    pieces: ['each::router'],
    mini: 'serve',
  },
  measure: {
    title: 'MEASURE',
    sub: 'cpa · roas · per creative',
    pieces: ['each::attributes', 'each::trace'],
    mini: 'measure',
  },
  refresh: {
    title: 'REFRESH',
    sub: 'fatigue → new batch',
    pieces: ['each::ab', 'each::workflows'],
    mini: 'refresh',
  },
};

function Quadrant1({ q, active }: { q: Quadrant; active: boolean }) {
  const cfg = QUAD_CONFIG[q];

  return (
    <motion.div
      animate={{
        borderColor: active ? 'rgb(var(--c-spark) / 0.7)' : 'rgb(var(--c-rule2))',
        boxShadow: active ? '0 0 0 1px rgb(var(--c-spark) / 0.18)' : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className="flex-1 bg-bg border rounded-md p-4 flex flex-col gap-2.5 min-h-[140px]"
    >
      <div className="flex items-center justify-between">
        <span className={`font-mono text-[10px] uppercase tracking-eyebrow ${active ? 'text-spark' : 'text-ink3'}`}>
          {cfg.title}
        </span>
        {active && (
          <motion.span
            className="text-[8px] text-spark"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          >
            ● live
          </motion.span>
        )}
      </div>
      <span className="font-mono text-[10.5px] text-ink2">{cfg.sub}</span>

      {/* mini activity */}
      <div className="flex-1 flex items-center justify-center">
        <MiniActivity kind={cfg.mini} active={active} />
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {cfg.pieces.map((p) => (
          <span key={p} className="font-mono text-[9px] text-ink2 border border-rule2 rounded px-1 py-[1px]">
            <EachLabel name={p} />
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function MiniActivity({ kind, active }: { kind: 'gen' | 'serve' | 'measure' | 'refresh'; active: boolean }) {
  if (kind === 'gen') {
    return (
      <div className="grid grid-cols-5 gap-[2px] w-full">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-[1px]"
            animate={{
              backgroundColor: active
                ? `rgb(var(--c-spark) / ${0.3 + (i % 4) * 0.15})`
                : 'rgb(var(--c-ink3) / 0.18)',
              opacity: active ? 1 : 0.4,
            }}
            transition={{ duration: 0.3, delay: active ? i * 0.02 : 0 }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'serve') {
    return (
      <div className="flex items-center justify-around w-full">
        {['IG', 'TT', 'RD'].map((label) => (
          <motion.div
            key={label}
            animate={{ opacity: active ? [0.5, 1, 0.5] : 0.4 }}
            transition={{ duration: 1.4, repeat: Infinity, delay: label === 'TT' ? 0.4 : label === 'RD' ? 0.8 : 0 }}
            className="font-mono text-[9.5px] text-ink2 border border-rule2 bg-surface rounded px-1.5 py-1"
          >
            {label}
          </motion.div>
        ))}
      </div>
    );
  }
  if (kind === 'measure') {
    const BARS = [50, 70, 35, 80, 60, 75, 45];
    return (
      <div className="flex items-end gap-1 w-full h-8">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-sm"
            style={{
              backgroundColor: i === 1 || i === 3 ? 'rgb(var(--c-success))' : i === 2 ? 'rgb(var(--c-fail) / 0.7)' : 'rgb(var(--c-spark))',
            }}
            animate={{ height: active ? `${h}%` : '20%', opacity: active ? 1 : 0.4 }}
            transition={{ duration: 0.5, delay: active ? i * 0.04 : 0 }}
          />
        ))}
      </div>
    );
  }
  // refresh
  return (
    <motion.div
      animate={{ rotate: active ? 360 : 0 }}
      transition={{ duration: 1.6, repeat: active ? Infinity : 0, ease: 'linear' }}
      className="text-spark text-[28px]"
      aria-hidden
    >
      ↻
    </motion.div>
  );
}

/* ── Center hub — each::labs at the center, rotating arrow follows active ── */

const ARROW_ANGLE: Record<Quadrant, number> = {
  generate: -45,  // top-left
  serve:    45,   // top-right
  measure:  135,  // bottom-right
  refresh:  -135, // bottom-left
};

function CenterHub({ active }: { active: Quadrant }) {
  const angle = ARROW_ANGLE[active];
  return (
    <div className="hidden lg:flex flex-col items-center justify-center min-w-[140px] py-4">
      <div className="relative w-28 h-28 rounded-full bg-bg border-2 border-spark/45 flex items-center justify-center">
        {/* rotating pointer */}
        <motion.div
          className="absolute"
          animate={{ rotate: angle }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: 2, height: 50, top: 6, transformOrigin: '50% 50px' }}
        >
          <div className="w-full h-1/2 bg-spark rounded-full" />
        </motion.div>
        <div className="text-center">
          <div className="font-mono text-[10px] text-spark">
            <EachLabel name="each::labs" />
          </div>
          <div className="font-mono text-[8px] text-ink3 uppercase tracking-eyebrow mt-0.5">
            hub
          </div>
        </div>
      </div>
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3 mt-3 text-center">
        cycle never stops
      </div>
    </div>
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
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">{label}</div>
      <div className={`font-display text-[16px] font-semibold tabular-nums mt-0.5 ${cls}`}>{value}</div>
    </div>
  );
}
