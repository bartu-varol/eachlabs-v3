'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SCENARIOS, type Scenario } from '@/lib/scenarios';
import { ChaosVisual } from './ChaosVisuals';
import { EachColons } from '@/components/ui/EachColons';
import { ProductMark } from '@/components/ui/ProductMark';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';

const KNOWN_PRODUCTS = new Set(['router', 'workflows', 'sense', 'trace']);

const CYCLE_MS = 5500;

/* ──────────────────────────────────────────────────────────────────────────
   Count-up, animates a numeric value, formatted per metric type.
────────────────────────────────────────────────────────────────────────── */

function formatValue(v: number, format: Scenario['metric']['format']): string {
  switch (format) {
    case 'percent':
      return `${v.toFixed(2)}%`;
    case 'time':
      if (v < 1) return `${v.toFixed(2)}s`;
      if (v < 60) return `${v.toFixed(2)}s`;
      return `${(v / 60).toFixed(1)}m`;
    case 'usd':
      return `$${v.toFixed(2)}`;
    case 'days':
      if (v < 1 / 24) return `${Math.round(v * 24 * 60)}m`;
      if (v < 1) return `${(v * 24).toFixed(1)}h`;
      return `${v.toFixed(0)}d`;
  }
}

function CountUp({
  to,
  format,
  duration = 1.2,
}: {
  to: number;
  format: Scenario['metric']['format'];
  duration?: number;
}) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const text = useTransform(spring, (v) => formatValue(v, format));
  const [display, setDisplay] = useState(formatValue(0, format));

  useEffect(() => {
    mv.set(to);
    const unsub = text.on('change', (v) => setDisplay(v));
    return () => unsub();
  }, [to, mv, text]);

  return <>{display}</>;
}

/* ──────────────────────────────────────────────────────────────────────────
   ComparisonRow, full-width bar with side label + count-up value.
────────────────────────────────────────────────────────────────────────── */

function ComparisonRow({
  side,
  scenario,
  isWinner,
}: {
  side: 'others' | 'each';
  scenario: Scenario;
  isWinner: boolean;
}) {
  const m = scenario.metric;
  const value = side === 'others' ? m.others.value : m.each.value;
  const sideMeta = side === 'others' ? m.others : m.each;
  const widthPct = Math.min(100, Math.max(2, (value / m.scaleMax) * 100));
  const barColor = isWinner ? 'bg-brand' : 'bg-ink-muted/40';
  const valueColor = isWinner ? 'text-brand' : 'text-ink';

  return (
    <div className="grid grid-cols-[120px_1fr_72px] md:grid-cols-[180px_1fr_88px] gap-3 md:gap-6 items-center">
      <div className="min-w-0">
        <div
          className={`font-mono text-eyebrow md:text-caption uppercase tracking-eyebrow ${
            isWinner ? 'text-brand' : 'text-ink-muted'
          }`}
        >
          {sideMeta.label}
        </div>
        <div className="text-ink-faint italic text-eyebrow md:text-caption mt-0.5 truncate">
          {sideMeta.sub}
        </div>
      </div>

      <div className="h-9 md:h-11 bg-surface-sunken rounded-sm overflow-hidden">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: '0%' }}
          animate={{ width: `${widthPct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div
        className={`font-sans font-semibold text-h4 md:text-h3 tabular-nums whitespace-nowrap text-right ${valueColor}`}
      >
        <CountUp to={value} format={m.format} />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   StorySegments, Instagram-style top-of-section progress bars.
────────────────────────────────────────────────────────────────────────── */

function StorySegments({
  activeIdx,
  paused,
  total,
  onPick,
}: {
  activeIdx: number;
  paused: boolean;
  total: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`Show scenario ${i + 1}`}
            aria-pressed={isActive}
            className="group flex-1 relative h-1 rounded-full overflow-hidden focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <span
              className={[
                'block h-full w-full rounded-full transition-colors duration-300',
                isPast
                  ? 'bg-brand/40'
                  : isActive
                    ? 'bg-brand/20'
                    : 'bg-field group-hover:bg-ink-faint',
              ].join(' ')}
            />
            {isActive && (
              <motion.span
                key={`progress-${activeIdx}-${paused ? 'p' : 'r'}`}
                className="absolute inset-y-0 left-0 bg-brand rounded-full"
                initial={{ width: '0%' }}
                animate={paused ? { width: '0%' } : { width: '100%' }}
                transition={{ duration: paused ? 0 : CYCLE_MS / 1000, ease: 'linear' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ProofSection, top: receipts metric · bottom: chaos→fix · shared cycle.
────────────────────────────────────────────────────────────────────────── */

export function ProofSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % SCENARIOS.length);
    }, CYCLE_MS);
    return () => clearTimeout(id);
  }, [paused, activeIdx]);

  function handleSegmentClick(i: number) {
    // Click on a segment: select + pause auto-cycle (user is reading).
    setActiveIdx(i);
    setPaused(true);
  }

  function toggleAuto() {
    setPaused((p) => !p);
  }

  const s = SCENARIOS[activeIdx];
  const eachIsWinner = s.metric.each.value < s.metric.others.value;

  return (
    <section
      id="proof"
      className="relative border-t border-divider overflow-hidden"
    >
      {/* Chaos → Fix ambient wash, fail-red on the left, success-green on the right */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(115deg, rgb(var(--danger) / 0.05) 0%, rgb(var(--danger) / 0.04) 25%, transparent 48%, transparent 55%, rgb(var(--ok) / 0.04) 78%, rgb(var(--ok) / 0.05) 100%)',
        }}
      />

      <div className="container py-24 md:py-32 relative">
      <SectionHeader
        eyebrow="* SECTION / 02 · CHAOS → FIX · BENCHMARKED Q1 2026"
        headline="Tell us what’s breaking."
        headlineSub="We’ve already built the fix."
        description="Four scenarios. Real benchmarks against raw SDKs. Same numbers, different week."
      />

      {/* Story segments, controls everything below */}
      <div className="mt-12 flex items-center gap-4">
        <StorySegments
          activeIdx={activeIdx}
          paused={paused}
          total={SCENARIOS.length}
          onPick={handleSegmentClick}
        />
        <span className="font-mono text-micro text-ink-faint hidden sm:inline whitespace-nowrap">
          n=4.1M traces
        </span>
      </div>

      {/* Active category label + scenario index */}
      <div className="mt-4 flex items-center justify-between font-mono text-micro uppercase tracking-eyebrow">
        <div className="flex items-center gap-3">
          <span className="text-ink-faint">{String(activeIdx + 1).padStart(2, '0')} / {String(SCENARIOS.length).padStart(2, '0')}</span>
          <span className="text-ink-faint">·</span>
          <span className="text-ink">{s.category}</span>
        </div>
        <button
          type="button"
          onClick={toggleAuto}
          aria-label={paused ? 'Resume auto-cycling' : 'Pause auto-cycling'}
          className={`flex items-center gap-1.5 transition-colors hover:text-ink ${
            paused ? 'text-ink-faint' : 'text-brand'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              paused ? 'bg-ink-faint' : 'bg-brand animate-pulse'
            }`}
            aria-hidden
          />
          {paused ? '▸ resume' : '● auto'}
        </button>
      </div>

      {/* Animated content, receipts row + chaos panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="mt-8"
        >
          {/* ── RECEIPTS BLOCK (top) ────────────────────────────────────── */}
          <div className="bg-surface-raised border border-field rounded-md p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
              <div>
                <div className="font-mono text-eyebrow uppercase tracking-eyebrow text-ink flex items-center gap-2">
                  <span className="text-brand">▸</span>
                  {s.metric.label}
                </div>
                <p className="text-ink-faint italic text-body-sm mt-2 max-w-[520px]">
                  {s.metric.caption}
                </p>
              </div>
              <div className="md:text-right">
                <div className="font-sans font-semibold text-display md:text-hero leading-[0.85] text-brand tabular-nums">
                  {s.metric.hero.multiplier}
                </div>
                <Eyebrow size="sm" tone="ink-faint" className="mt-2">{s.metric.hero.suffix}</Eyebrow>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <ComparisonRow side="others" scenario={s} isWinner={!eachIsWinner} />
              <ComparisonRow side="each"   scenario={s} isWinner={eachIsWinner} />
            </div>
          </div>

          {/* ── CHAOS / FIX BLOCK (bottom, same scenario expanded) ──────── */}
          <div className="mt-3 bg-surface-raised border border-field rounded-md grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-10 p-6 md:p-8">
            {/* Left, readable narrative */}
            <div className="flex flex-col">
              <div className="font-mono text-eyebrow uppercase tracking-eyebrow text-danger">
                × THE CHAOS
              </div>
              <p className="text-ink-muted text-body-lg leading-relaxed mt-2">{s.chaos}</p>

              <div className="h-px bg-divider my-6" />

              <div className="font-mono text-eyebrow uppercase tracking-eyebrow text-ok">
                ✓ THE FIX
              </div>
              {s.fix.feature.prefix === 'each::' && KNOWN_PRODUCTS.has(s.fix.feature.name) ? (
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <ProductMark name={s.fix.feature.name} size="lg" />
                  {s.fix.feature.tail && (
                    <span className="text-ink-faint italic font-normal text-body-lg sm:text-h4">
                      ({s.fix.feature.tail})
                    </span>
                  )}
                </div>
              ) : (
                <h3 className="font-sans font-semibold text-h3 sm:text-h2 leading-[1.05] mt-3 text-ink">
                  {s.fix.feature.prefix &&
                    (s.fix.feature.prefix.endsWith('::') ? (
                      <>
                        {s.fix.feature.prefix.slice(0, -2)}
                        <EachColons />
                      </>
                    ) : (
                      <span className="text-ink-faint">{s.fix.feature.prefix}</span>
                    ))}
                  {s.fix.feature.name}
                  {s.fix.feature.tail && (
                    <span className="text-ink-faint italic font-normal text-h4 sm:text-h4 ml-2">
                      ({s.fix.feature.tail})
                    </span>
                  )}
                </h3>
              )}
              <div className="text-ink-muted italic text-body mt-2">{s.fix.tagline}</div>
              <p className="text-ink-muted text-body leading-relaxed mt-3 max-w-[480px]">
                {s.fix.body}
              </p>
              <Link
                href={s.fix.docsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand text-body-sm font-medium hover:underline underline-offset-4 mt-6 inline-flex items-center gap-1.5 self-start"
              >
                See the docs <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right, animated visual */}
            <div className="flex items-center">
              <div className="w-full">
                <ChaosVisual visual={s.visual} />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </section>
  );
}
