'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   MarketingDemo — the 5-second story for /usecases/marketing.

   Centerpiece: a brand voice DIAL (palette + tone + era) being tuned live,
   then one each.run() cascading the same compiled profile across 6 surfaces
   with correct dimensions per channel (IG square, IG story, TikTok 9:16,
   web hero, email banner, OOH billboard). The protagonist is the brand
   voice — not the rendering pipeline.

   ~7.6s loop, 4 phases:
     idle    400    reset
     dial    1500   tune three brand-voice knobs (palette/tone/era)
     compile 700    profile compiles into a tag
     fanout  4000   6 surfaces render in parallel with correct dimensions
     hold    1000   complete state · "shipped to 6 channels" footer
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'dial' | 'compile' | 'fanout' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  dial: 1500,
  compile: 700,
  fanout: 4000,
  hold: 1000,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

type Surface = {
  id: string;
  name: string;
  ratio: string;
  aspectClass: string;
  /** Tailwind-friendly w% based on a 280px canvas (rough). */
  spanCols: number;
  spanRows: number;
  delay: number;
};

const SURFACES: Surface[] = [
  { id: 'ig-sq',    name: 'IG square',    ratio: '1:1',   aspectClass: 'aspect-square',   spanCols: 2, spanRows: 2, delay: 0.0 },
  { id: 'ig-story', name: 'IG story',     ratio: '9:16',  aspectClass: 'aspect-[9/16]',   spanCols: 1, spanRows: 2, delay: 0.10 },
  { id: 'tiktok',   name: 'TikTok',       ratio: '9:16',  aspectClass: 'aspect-[9/16]',   spanCols: 1, spanRows: 2, delay: 0.20 },
  { id: 'web',      name: 'web hero',     ratio: '16:9',  aspectClass: 'aspect-[16/9]',   spanCols: 2, spanRows: 1, delay: 0.30 },
  { id: 'email',    name: 'email',        ratio: '3:1',   aspectClass: 'aspect-[3/1]',    spanCols: 2, spanRows: 1, delay: 0.40 },
  { id: 'ooh',      name: 'OOH billboard',ratio: '4:3',   aspectClass: 'aspect-[4/3]',    spanCols: 2, spanRows: 1, delay: 0.50 },
];

export function MarketingDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [knobs, setKnobs] = useState({ palette: 0.4, tone: 0.6, era: 0.3 });
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    function tick() {
      clearAll();
      setPhase('idle');
      const order: Phase[] = ['dial', 'compile', 'fanout', 'hold'];
      let acc = TIMINGS.idle;
      for (const p of order) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => setPhase(p), at));
        acc += TIMINGS[p];
      }
      // Animate the dials during the dial phase.
      timeoutsRef.current.push(setTimeout(() => setKnobs({ palette: 0.72, tone: 0.45, era: 0.85 }), TIMINGS.idle + 300));
      timeoutsRef.current.push(setTimeout(() => setKnobs({ palette: 0.85, tone: 0.30, era: 0.70 }), TIMINGS.idle + 800));
    }

    tick();
    const id = setInterval(tick, TOTAL_LOOP);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

  const showCompile = phase === 'compile' || phase === 'fanout' || phase === 'hold';
  const showFanout  = phase === 'fanout' || phase === 'hold';

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-sun/[0.10] via-spark/[0.06] to-highlight/[0.08] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              BRAND STUDIO · LIVE
            </span>
          </div>
          <PhaseLabel phase={phase} />
        </div>

        {/* Brief */}
        <div className="px-4 md:px-5 pt-3 pb-2 border-b border-rule2 bg-bg/30">
          <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1">
            campaign brief
          </div>
          <div className="font-mono text-[11px] text-ink leading-snug">
            "summer 2026 · joy · friends gathering"
          </div>
        </div>

        {/* Brand voice dial — 3 knobs */}
        <div className="px-4 md:px-5 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
              brand voice profile
            </span>
            <CompileBadge visible={showCompile} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Knob label="palette" value={knobs.palette} options={['mono', 'warm', 'sunset', 'neon']} />
            <Knob label="tone"    value={knobs.tone}    options={['minimal', 'editorial', 'playful', 'bold']} />
            <Knob label="era"     value={knobs.era}     options={['90s', 'y2k', 'modern', 'next-gen']} />
          </div>
        </div>

        {/* Cascade — 6 surfaces */}
        <div className="border-t border-rule2 bg-bg/30 px-4 md:px-5 pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
              channels · {showFanout ? 'rendered' : 'pending'}
            </span>
            <span className="font-mono text-[9px] text-spark">
              one each.run() · 6 surfaces · parallel
            </span>
          </div>
          <Cascade visible={showFanout} />
        </div>

        {/* Footer */}
        <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase === 'hold' ? 'shipped' : 'pending'}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.16 }}
              className="flex items-center gap-2 font-mono text-[10px]"
            >
              {phase === 'hold' ? (
                <>
                  <span className="text-success">✓</span>
                  <span className="text-ink uppercase tracking-eyebrow">shipped</span>
                  <span className="text-ink2">to 6 channels · brand-safe gate passed</span>
                  <span className="ml-auto text-spark uppercase tracking-eyebrow">~38s · audited</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
                  <span className="text-ink3 uppercase tracking-eyebrow">
                    brand voice locked · safety gates active
                  </span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        one profile · one brief · every channel · same brand
      </div>
    </div>
  );
}

/* ── Phase label ────────────────────────────────────────────────────────── */

function PhaseLabel({ phase }: { phase: Phase }) {
  const text =
    phase === 'idle'    ? 'queued'
    : phase === 'dial'    ? 'tuning · brand voice'
    : phase === 'compile' ? '✓ profile compiled'
    : phase === 'fanout'  ? 'rendering 6 channels'
    : '✓ shipped · 6 channels';

  const tone = phase === 'idle' ? 'text-ink3' : phase === 'hold' ? 'text-success' : 'text-spark';

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

/* ── Compile badge ──────────────────────────────────────────────────────── */

function CompileBadge({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="font-mono text-[9px] uppercase tracking-eyebrow text-spark border border-spark/45 bg-spark/[0.04] rounded px-1.5 py-[1px]"
        >
          ✓ aster_warm_y2k
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/* ── Knob — animated dial with discrete options ─────────────────────────── */

function Knob({
  label,
  value,
  options,
}: {
  label: string;
  value: number;
  options: string[];
}) {
  // Map value to angle (-60° to 60°)
  const angle = -60 + value * 120;
  const optionIdx = Math.min(options.length - 1, Math.floor(value * options.length));

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
        {label}
      </div>
      <div className="relative w-12 h-12 rounded-full bg-bg border border-rule2 flex items-center justify-center">
        {/* Tick marks */}
        {[-60, -30, 0, 30, 60].map((a) => (
          <span
            key={a}
            className="absolute w-px h-1 bg-rule2"
            style={{
              top: 1,
              left: '50%',
              transformOrigin: '50% 22px',
              transform: `translateX(-50%) rotate(${a}deg)`,
            }}
            aria-hidden
          />
        ))}
        {/* Pointer */}
        <motion.div
          className="absolute"
          animate={{ rotate: angle }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: 2, height: 18, top: 4, transformOrigin: '50% 18px' }}
        >
          <div className="w-full h-full bg-spark rounded-full" />
        </motion.div>
        {/* Center dot */}
        <span className="block w-1.5 h-1.5 rounded-full bg-ink2" aria-hidden />
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={optionIdx}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.18 }}
          className="font-mono text-[9px] text-spark"
        >
          {options[optionIdx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ── Cascade — 6 surfaces in a mosaic, each with channel-correct dims ───── */

function Cascade({ visible }: { visible: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-1.5" style={{ gridAutoRows: '40px' }}>
      {SURFACES.map((s) => (
        <SurfaceTile key={s.id} surface={s} visible={visible} />
      ))}
    </div>
  );
}

function SurfaceTile({ surface, visible }: { surface: Surface; visible: boolean }) {
  const gradient =
    surface.id === 'ig-sq' ? 'linear-gradient(135deg, rgb(var(--c-spark) / 0.5), rgb(var(--c-sun) / 0.45))'
    : surface.id === 'ig-story' ? 'linear-gradient(180deg, rgb(var(--c-highlight) / 0.5), rgb(var(--c-spark) / 0.4))'
    : surface.id === 'tiktok' ? 'linear-gradient(180deg, rgb(var(--c-ember) / 0.5), rgb(var(--c-sun) / 0.45))'
    : surface.id === 'web' ? 'linear-gradient(135deg, rgb(var(--c-success) / 0.45), rgb(var(--c-highlight) / 0.4))'
    : surface.id === 'email' ? 'linear-gradient(135deg, rgb(var(--c-sun) / 0.5), rgb(var(--c-spark) / 0.4))'
    : 'linear-gradient(135deg, rgb(var(--c-highlight) / 0.55), rgb(var(--c-ember) / 0.45))';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
      transition={{ duration: 0.4, delay: visible ? surface.delay : 0 }}
      className="relative rounded-sm overflow-hidden border border-rule2"
      style={{
        gridColumn: `span ${surface.spanCols}`,
        gridRow: `span ${surface.spanRows}`,
        background: gradient,
      }}
    >
      {/* Header type-block */}
      <div className="absolute top-1 left-1 right-1 flex items-center justify-between font-mono text-[7px] uppercase tracking-eyebrow text-bg/95">
        <span>{surface.name}</span>
        <span>{surface.ratio}</span>
      </div>
      {/* Composition: a sun + figure suggesting "joy / summer / friends" */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <circle cx="78" cy="22" r="9" fill="rgb(var(--c-bg) / 0.7)" />
        <circle cx="22" cy="68" r="6" fill="rgb(var(--c-bg) / 0.55)" />
        <circle cx="50" cy="62" r="5" fill="rgb(var(--c-bg) / 0.6)" />
      </svg>
      {/* Brand-safety check */}
      <div className="absolute bottom-1 right-1 font-mono text-[7.5px] text-bg/95 bg-success/85 rounded px-1">
        ✓
      </div>
    </motion.div>
  );
}
