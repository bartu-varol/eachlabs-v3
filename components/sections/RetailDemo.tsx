'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   RetailDemo — the 5-second story for /usecases/retail.

   Studio-replacement narrative: a single bare product photo becomes a full
   campaign asset set, fanned out across 12 markets — all from one each.run().

   ~7.4s loop, 6 phases:
     idle      400ms  reset
     raw       1200   white-bg product appears
     enhance   800    enhance.brand_voice pulses
     variants  1500   4 styled lifestyle variants fade in (parallel)
     locales   1800   12 locale tags layer on (12-market fan-out)
     ship      1100   "shipped to commerce" success indicator
     hold      600    brief still moment before loop
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'raw' | 'enhance' | 'variants' | 'locales' | 'ship' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  raw: 1200,
  enhance: 800,
  variants: 1500,
  locales: 1800,
  ship: 1100,
  hold: 600,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

const LOCALES = [
  'EN-US', 'EN-UK', 'TR', 'DE',
  'FR', 'ES', 'IT', 'JP',
  'KR', 'AR', 'PT-BR', 'ZH',
];

export function RetailDemo() {
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
      const order: Phase[] = ['raw', 'enhance', 'variants', 'locales', 'ship', 'hold'];
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

  const showRaw      = phase !== 'idle';
  const showEnhance  = phase === 'enhance' || phase === 'variants' || phase === 'locales' || phase === 'ship' || phase === 'hold';
  const showVariants = phase === 'variants' || phase === 'locales' || phase === 'ship' || phase === 'hold';
  const showLocales  = phase === 'locales'  || phase === 'ship' || phase === 'hold';
  const showShip     = phase === 'ship'     || phase === 'hold';

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-success/[0.08] via-transparent to-spark/[0.05] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              ASSET STUDIO · LIVE
            </span>
          </div>
          <PhaseLabel phase={phase} />
        </div>

        {/* Brief */}
        <div className="px-4 md:px-5 pt-3 pb-2 border-b border-rule2 bg-bg/30">
          <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1">
            brief
          </div>
          <div className="font-mono text-[11px] text-ink leading-snug">
            "summer 2026 hero · dress sku #4192"
            <span className="text-ink3"> · </span>
            <span className="text-spark">brand_voice="aster_minimal"</span>
          </div>
        </div>

        {/* Stage */}
        <div className="px-4 md:px-5 pt-4 pb-3 grid grid-cols-[1fr_auto_1.4fr] gap-3 items-stretch">
          {/* Left: raw input */}
          <Stage label="input" subLabel="white-bg · 1 photo">
            <RawProduct visible={showRaw} />
          </Stage>

          {/* Arrow + enhance pill */}
          <ArrowColumn enhanceActive={phase === 'enhance'} variants={showVariants} />

          {/* Right: variants grid evolving */}
          <Stage label="output" subLabel={showLocales ? '4 styles × 12 locales' : showVariants ? '4 styles · parallel' : showEnhance ? 'enhancing…' : '—'}>
            <VariantStage
              showVariants={showVariants}
              showLocales={showLocales}
            />
          </Stage>
        </div>

        {/* Locale fan-out strip */}
        <LocaleStrip visible={showLocales} />

        {/* Ship footer */}
        <ShipFooter visible={showShip} />
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        one brief · four styles · twelve markets · audit per asset
      </div>
    </div>
  );
}

/* ── Phase label ────────────────────────────────────────────────────────── */

function PhaseLabel({ phase }: { phase: Phase }) {
  const text =
    phase === 'idle'      ? 'queued'
    : phase === 'raw'       ? 'studio bg removed'
    : phase === 'enhance'   ? 'enhance · brand_voice'
    : phase === 'variants'  ? '4 styles · parallel'
    : phase === 'locales'   ? '12 markets · fanning out'
    : phase === 'ship'      ? '✓ shipped · audit stamped'
    : 'done · 48 assets';

  const tone =
    phase === 'idle'                           ? 'text-ink3'
    : phase === 'ship' || phase === 'hold'       ? 'text-success'
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

/* ── Stage shell ────────────────────────────────────────────────────────── */

function Stage({
  label,
  subLabel,
  children,
}: {
  label: string;
  subLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-2.5 flex flex-col gap-1.5 min-h-[170px]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">
          {label}
        </span>
        <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark truncate ml-2">
          {subLabel}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ── Raw product — garment silhouette on white background ───────────────── */

function RawProduct({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.95 }}
      transition={{ duration: 0.4 }}
      className="relative w-full aspect-square bg-bg border border-rule2 rounded flex items-center justify-center overflow-hidden"
    >
      {/* Studio-light gradient (very subtle) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgb(var(--c-bg)), rgb(var(--c-surface)))',
        }}
      />
      {/* Dress silhouette */}
      <svg viewBox="0 0 80 100" className="relative w-[60%] h-auto" aria-hidden>
        <defs>
          <linearGradient id="dress" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--c-spark) / 0.55)" />
            <stop offset="100%" stopColor="rgb(var(--c-ember) / 0.7)" />
          </linearGradient>
        </defs>
        <path
          d="M30 8 L50 8 L52 16 L60 22 L66 38 L62 44 L58 42 L66 95 L14 95 L22 42 L18 44 L14 38 L20 22 L28 16 Z"
          fill="url(#dress)"
          stroke="rgb(var(--c-ink2) / 0.3)"
          strokeWidth="0.6"
        />
      </svg>
      {/* SKU label */}
      <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between font-mono text-[8px] text-ink3">
        <span>sku #4192</span>
        <span>1024 × 1024</span>
      </div>
    </motion.div>
  );
}

/* ── Arrow column with enhance pill ─────────────────────────────────────── */

function ArrowColumn({ enhanceActive, variants }: { enhanceActive: boolean; variants: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-1">
      <motion.div
        animate={{
          color: enhanceActive ? 'rgb(var(--c-spark))' : variants ? 'rgb(var(--c-success))' : 'rgb(var(--c-ink3))',
        }}
        transition={{ duration: 0.25 }}
        className="font-mono text-[9px] uppercase tracking-eyebrow whitespace-nowrap text-center"
      >
        enhance
      </motion.div>
      <motion.span
        className="text-spark text-[20px]"
        animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        aria-hidden
      >
        →
      </motion.span>
      <motion.div
        animate={{
          opacity: enhanceActive ? 1 : 0.4,
          scale: enhanceActive ? 1.04 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="font-mono text-[9px] text-spark whitespace-nowrap"
      >
        brand_voice
      </motion.div>
    </div>
  );
}

/* ── Variant stage — empty / 4-grid / 12-locale-overlay ─────────────────── */

const VARIANT_GRADIENTS = [
  // Lifestyle / outdoor
  'linear-gradient(135deg, rgb(var(--c-sun) / 0.55), rgb(var(--c-spark) / 0.4))',
  // Studio / softlight
  'linear-gradient(135deg, rgb(var(--c-highlight) / 0.55), rgb(var(--c-spark) / 0.4))',
  // Beach / aqua
  'linear-gradient(135deg, rgb(var(--c-success) / 0.5), rgb(var(--c-highlight) / 0.45))',
  // Editorial / dark
  'linear-gradient(135deg, rgb(var(--c-ember) / 0.55), rgb(var(--c-sun) / 0.45))',
];

function VariantStage({
  showVariants,
  showLocales,
}: {
  showVariants: boolean;
  showLocales: boolean;
}) {
  return (
    <div className="relative w-full aspect-square">
      {/* Empty state (subtle dashed grid) */}
      <AnimatePresence>
        {!showVariants && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border border-dashed border-rule2 rounded-sm" />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 variants grid */}
      <AnimatePresence>
        {showVariants && (
          <motion.div
            key="variants"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px]"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="relative rounded-sm overflow-hidden"
                style={{ background: VARIANT_GRADIENTS[i] }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.05 + i * 0.1 }}
              >
                {/* Garment silhouette positioned in scene */}
                <svg
                  viewBox="0 0 80 100"
                  className="absolute"
                  style={{ left: '32%', top: '20%', width: '34%' }}
                  aria-hidden
                >
                  <path
                    d="M30 8 L50 8 L52 16 L60 22 L66 38 L62 44 L58 42 L66 95 L14 95 L22 42 L18 44 L14 38 L20 22 L28 16 Z"
                    fill="rgb(var(--c-bg) / 0.95)"
                    stroke="rgb(var(--c-ink2) / 0.45)"
                    strokeWidth="0.7"
                  />
                </svg>
                <div className="absolute top-1 left-1 font-mono text-[7.5px] uppercase tracking-eyebrow text-bg/90 bg-ink/55 px-1 rounded">
                  v{i + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locale tag overlays — small chips appear on top of the variants */}
      <AnimatePresence>
        {showLocales && (
          <motion.div
            key="locales"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {LOCALES.slice(0, 6).map((code, i) => (
              <motion.span
                key={code}
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.06 + i * 0.06 }}
                className="absolute font-mono text-[8.5px] text-bg bg-ink/75 border border-spark/35 rounded px-1 py-[1px]"
                style={{
                  left: `${(i % 3) * 33 + 4}%`,
                  top: `${Math.floor(i / 3) * 50 + 4}%`,
                }}
              >
                {code}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Locale strip — full 12-market list ─────────────────────────────────── */

function LocaleStrip({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden border-t border-rule2 bg-bg/30"
        >
          <div className="px-4 md:px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                12 markets · localized
              </span>
              <span className="font-mono text-[9px] text-spark">
                ~38s total · parallel
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {LOCALES.map((code, i) => (
                <motion.span
                  key={code}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.04 + i * 0.04 }}
                  className="inline-flex items-center font-mono text-[9.5px] text-spark border border-spark/40 bg-spark/[0.04] rounded px-1.5 py-[1.5px]"
                >
                  <span className="text-success mr-1" aria-hidden>✓</span>
                  {code}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Ship footer ────────────────────────────────────────────────────────── */

function ShipFooter({ visible }: { visible: boolean }) {
  return (
    <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={visible ? 'shipped' : 'idle'}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.16 }}
          className="flex items-center gap-2 font-mono text-[10px]"
        >
          {visible ? (
            <>
              <span className="text-success">✓</span>
              <span className="text-ink uppercase tracking-eyebrow">shipped to commerce</span>
              <span className="text-ink2">· 48 assets · audit per asset</span>
              <span className="ml-auto text-spark uppercase tracking-eyebrow">$0.84 / asset</span>
            </>
          ) : (
            <>
              <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
              <span className="text-ink3 uppercase tracking-eyebrow">
                stand-by · brand-safe gates active
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
