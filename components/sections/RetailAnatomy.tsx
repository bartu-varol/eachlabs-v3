'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   RetailAnatomy — "1 brief → 12 markets" localization fan-out.

   Different beat from the consumer-ai anatomy (which traces one call). Here
   the focus is on PARALLEL fan-out: a single brief explodes into 12 locale-
   specific branches, each generating + audit-stamping its own asset, all in
   the same workflow run. The trace pulls the whole thing together.

   ~7.4s loop:
     idle    400    reset
     brief   900    brief appears
     split   900    12 branches split off + workflow tag
     run     2400   each branch's progress bar fills (staggered)
     audit   1200   audit checks tick on all 12
     totals  1200   bottom strip animates totals
     hold    400    brief still moment before loop
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'brief' | 'split' | 'run' | 'audit' | 'totals' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  brief: 900,
  split: 900,
  run: 2400,
  audit: 1200,
  totals: 1200,
  hold: 400,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

const LOCALES = [
  { code: 'EN-US', tone: 'spark' },
  { code: 'EN-UK', tone: 'spark' },
  { code: 'TR',    tone: 'highlight' },
  { code: 'DE',    tone: 'success' },
  { code: 'FR',    tone: 'sun' },
  { code: 'ES',    tone: 'ember' },
  { code: 'IT',    tone: 'spark' },
  { code: 'JP',    tone: 'highlight' },
  { code: 'KR',    tone: 'success' },
  { code: 'AR',    tone: 'sun' },
  { code: 'PT-BR', tone: 'ember' },
  { code: 'ZH',    tone: 'spark' },
] as const;

export function RetailAnatomy() {
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
      const order: Phase[] = ['brief', 'split', 'run', 'audit', 'totals', 'hold'];
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

  const showBrief  = phase !== 'idle';
  const showSplit  = phase === 'split' || phase === 'run' || phase === 'audit' || phase === 'totals' || phase === 'hold';
  const showRun    = phase === 'run' || phase === 'audit' || phase === 'totals' || phase === 'hold';
  const showAudit  = phase === 'audit' || phase === 'totals' || phase === 'hold';
  const showTotals = phase === 'totals' || phase === 'hold';

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● ANATOMY · ONE BRIEF, TWELVE MARKETS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        How a brief turns into a campaign in 48 hours.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        One workflow run, twelve parallel locale branches, twelve audit-stamped
        assets. Marketing writes the brief. Compliance reads the trace. You ship
        the campaign.
      </p>

      <div className="mt-12 bg-surface border border-rule2 rounded-md p-5 md:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              campaign run · live
            </span>
          </div>
          <PhaseLabel phase={phase} />
        </div>

        {/* Brief box */}
        <BriefBox visible={showBrief} />

        {/* Workflow tag */}
        <WorkflowTag visible={showSplit} />

        {/* 12 lanes */}
        <Lanes
          showSplit={showSplit}
          showRun={showRun}
          showAudit={showAudit}
        />

        {/* Outputs grid */}
        <Outputs
          showRun={showRun}
          showAudit={showAudit}
        />

        {/* Totals */}
        <AnimatePresence>
          {showTotals && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule2 border border-rule2 rounded mt-6 overflow-hidden">
                <Stat label="assets shipped" value="48" tone="spark" />
                <Stat label="cost / asset"   value="$0.84" tone="success" />
                <Stat label="time"           value="38s" tone="highlight" />
                <Stat label="audit stamps"   value="48 ✓" tone="spark" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── Phase label ────────────────────────────────────────────────────────── */

function PhaseLabel({ phase }: { phase: Phase }) {
  const text =
    phase === 'idle'    ? 'queued'
    : phase === 'brief'   ? 'brief received'
    : phase === 'split'   ? 'fan-out · 12 markets'
    : phase === 'run'     ? 'rendering in parallel'
    : phase === 'audit'   ? 'audit · stamping each'
    : phase === 'totals'  ? 'done · 48 assets'
    : 'shipped';

  const tone =
    phase === 'idle'                          ? 'text-ink3'
    : phase === 'audit' || phase === 'totals' || phase === 'hold' ? 'text-success'
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

/* ── Brief box ──────────────────────────────────────────────────────────── */

function BriefBox({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: visible ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-bg border border-rule2 rounded-md px-4 py-3 max-w-[560px] mx-auto"
    >
      <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1">
        brief
      </div>
      <div className="font-mono text-[12px] text-ink leading-snug">
        "summer 2026 hero · sku #4192"
        <span className="text-ink3"> · </span>
        <span className="text-spark">brand_voice="aster_minimal"</span>
        <span className="text-ink3"> · </span>
        <span className="text-spark">locales=12</span>
      </div>
    </motion.div>
  );
}

/* ── Workflow tag ───────────────────────────────────────────────────────── */

function WorkflowTag({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-center justify-center my-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-spark/45 bg-spark/[0.04] rounded">
            <span className="font-mono text-[10px] text-spark">
              <EachLabel name="each::workflows" />
            </span>
            <span className="font-mono text-[9.5px] text-ink2">
              · "campaign-locale-fanout-v3"
            </span>
            <motion.span
              className="text-spark text-[10px]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              aria-hidden
            >
              ◐
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Lanes — 12 parallel branches with progress bars ────────────────────── */

function Lanes({
  showSplit,
  showRun,
  showAudit,
}: {
  showSplit: boolean;
  showRun: boolean;
  showAudit: boolean;
}) {
  return (
    <AnimatePresence>
      {showSplit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32 }}
          className="overflow-hidden"
        >
          <div className="bg-bg border border-rule2 rounded-md p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                12 parallel branches
              </span>
              <span className="font-mono text-[9px] text-spark">localize · generate · audit</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
              {LOCALES.map((loc, i) => (
                <Lane
                  key={loc.code}
                  code={loc.code}
                  tone={loc.tone}
                  showRun={showRun}
                  showAudit={showAudit}
                  delay={0.04 + i * 0.04}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Lane({
  code,
  tone,
  showRun,
  showAudit,
  delay,
}: {
  code: string;
  tone: string;
  showRun: boolean;
  showAudit: boolean;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-1.5 px-1.5 py-1 bg-surface border border-rule2 rounded">
      <span className="font-mono text-[9px] text-ink2 w-[40px] truncate">{code}</span>
      <div className="flex-1 h-1.5 bg-surface2 rounded-sm overflow-hidden">
        <motion.span
          className="block h-full rounded-sm"
          style={{ background: `rgb(var(--c-${tone}))` }}
          initial={{ width: 0 }}
          animate={{ width: showRun ? '100%' : 0 }}
          transition={{ duration: 0.8, delay: showRun ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <AnimatePresence>
        {showAudit && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.04 + delay * 0.6 }}
            className="text-success text-[9px] w-[8px]"
            aria-hidden
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Outputs — 12 thumbnails materializing as branches finish ───────────── */

function Outputs({
  showRun,
  showAudit,
}: {
  showRun: boolean;
  showAudit: boolean;
}) {
  return (
    <AnimatePresence>
      {showRun && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32 }}
          className="overflow-hidden"
        >
          <div className="bg-bg border border-rule2 rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                outputs · 12 markets
              </span>
              <AnimatePresence>
                {showAudit && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[9.5px] text-success"
                  >
                    ✓ all audited · trace per asset
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-[3px]">
              {LOCALES.map((loc, i) => (
                <OutputThumb
                  key={loc.code}
                  code={loc.code}
                  tone={loc.tone}
                  delay={0.06 + i * 0.05}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OutputThumb({
  code,
  tone,
  delay,
}: {
  code: string;
  tone: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="relative aspect-[3/4] rounded-sm overflow-hidden border border-rule2"
      style={{
        background: `linear-gradient(135deg, rgb(var(--c-${tone}) / 0.55), rgb(var(--c-spark) / 0.35))`,
      }}
    >
      {/* Garment silhouette */}
      <svg
        viewBox="0 0 80 100"
        className="absolute inset-0 m-auto"
        width="50%"
        style={{ top: '14%' }}
        aria-hidden
      >
        <path
          d="M30 8 L50 8 L52 16 L60 22 L66 38 L62 44 L58 42 L66 95 L14 95 L22 42 L18 44 L14 38 L20 22 L28 16 Z"
          fill="rgb(var(--c-bg) / 0.92)"
          stroke="rgb(var(--c-ink2) / 0.45)"
          strokeWidth="0.6"
        />
      </svg>
      {/* Locale tag */}
      <div className="absolute bottom-[2px] left-[2px] right-[2px] flex items-center justify-center">
        <span className="font-mono text-[8px] text-bg bg-ink/65 rounded px-1 leading-[1.3]">
          {code}
        </span>
      </div>
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
