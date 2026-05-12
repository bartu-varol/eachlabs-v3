'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   AdTechDemo — the 5-second story for /usecases/ad-tech.

   Trading-floor aesthetic. Six creative "tickers" with live CPA/ROAS,
   winners auto-promoting and losers auto-killing as we watch. Different
   from any other demo on the site — heavy monospace numbers, blinking
   metrics, ticker-style action feed at the bottom.

   ~8s loop, 4 phases:
     idle      400    reset baseline
     accrue    3000   metrics tick, sparklines fill, winners pull ahead
     promote   1500   AUTO-PROMOTE fires on winner, AUTO-KILL on loser
     spend     2000   spend redistributes (visible in pill widths)
     hold      1100
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'accrue' | 'promote' | 'spend' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  accrue: 3000,
  promote: 1500,
  spend: 2000,
  hold: 1100,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

type Creative = {
  id: string;
  surface: string;
  baselineCPA: number;
  finalCPA: number;
  baselineROAS: number;
  finalROAS: number;
  /** Outcome decided after accrue phase. */
  outcome: 'winner' | 'kill' | 'hold';
  spendShare: { before: number; after: number };
};

const CREATIVES: Creative[] = [
  { id: 'cr_8f2a', surface: 'tiktok-9:16', baselineCPA: 3.20, finalCPA: 1.84, baselineROAS: 1.4, finalROAS: 4.6, outcome: 'winner', spendShare: { before: 16, after: 38 } },
  { id: 'cr_3b21', surface: 'meta-1:1',    baselineCPA: 4.10, finalCPA: 6.42, baselineROAS: 1.1, finalROAS: 0.6, outcome: 'kill',   spendShare: { before: 16, after: 0  } },
  { id: 'cr_902a', surface: 'meta-9:16',   baselineCPA: 3.50, finalCPA: 2.18, baselineROAS: 1.3, finalROAS: 3.2, outcome: 'winner', spendShare: { before: 16, after: 26 } },
  { id: 'cr_4e0d', surface: 'reddit-16:9', baselineCPA: 2.90, finalCPA: 3.04, baselineROAS: 1.6, finalROAS: 1.5, outcome: 'hold',   spendShare: { before: 16, after: 14 } },
  { id: 'cr_b71c', surface: 'tiktok-9:16', baselineCPA: 3.80, finalCPA: 5.91, baselineROAS: 1.0, finalROAS: 0.7, outcome: 'kill',   spendShare: { before: 16, after: 0  } },
  { id: 'cr_d04e', surface: 'meta-4:5',    baselineCPA: 3.60, finalCPA: 2.72, baselineROAS: 1.5, finalROAS: 2.6, outcome: 'hold',   spendShare: { before: 20, after: 22 } },
];

export function AdTechDemo() {
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
      const order: Phase[] = ['accrue', 'promote', 'spend', 'hold'];
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

  const showFinalMetrics = phase === 'accrue' || phase === 'promote' || phase === 'spend' || phase === 'hold';
  const showOutcome      = phase === 'promote' || phase === 'spend' || phase === 'hold';
  const showFinalSpend   = phase === 'spend' || phase === 'hold';

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-success/[0.08] via-spark/[0.05] to-fail/[0.05] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Top bar — market status */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              CREATIVE FLOOR · LIVE
            </span>
          </div>
          <span className="font-mono text-[10px] text-ink3 tabular-nums">
            14:32:18 EST · 1m window
          </span>
        </div>

        {/* Aggregate ticker */}
        <div className="grid grid-cols-3 gap-px bg-rule2 border-b border-rule2">
          <Aggregate label="spend · today" value="$48,213" delta="+12%" tone="ink" />
          <Aggregate label="ROAS" value={showOutcome ? '3.4×' : '2.1×'} delta={showOutcome ? '+62%' : '+0%'} tone="success" />
          <Aggregate label="winners" value={showOutcome ? '3 / 6' : '0 / 6'} delta="auto" tone="spark" />
        </div>

        {/* Creative tickers list */}
        <div className="px-3 md:px-4 pt-3 pb-2">
          <div className="grid grid-cols-[80px_60px_minmax(0,1fr)_60px_60px_72px] gap-2 mb-1.5 font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">
            <span>creative</span>
            <span>surface</span>
            <span>cpa · trend</span>
            <span className="text-right">cpa</span>
            <span className="text-right">roas</span>
            <span className="text-right">status</span>
          </div>
          <div className="flex flex-col gap-[3px]">
            {CREATIVES.map((c, i) => (
              <CreativeRow
                key={c.id}
                creative={c}
                idx={i}
                showFinal={showFinalMetrics}
                showOutcome={showOutcome}
              />
            ))}
          </div>
        </div>

        {/* Spend distribution bar */}
        <div className="border-t border-rule2 bg-bg/30 px-4 md:px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
              spend distribution
            </span>
            <span className="font-mono text-[9px] text-spark">
              {showFinalSpend ? 'auto-redistributed' : 'flat 16% each'}
            </span>
          </div>
          <SpendBar showFinal={showFinalSpend} />
        </div>

        {/* Action ticker */}
        <ActionTicker phase={phase} />
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        generate · serve · measure · refresh — all in one each.run() loop
      </div>
    </div>
  );
}

/* ── Aggregate cell ─────────────────────────────────────────────────────── */

function Aggregate({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: 'ink' | 'success' | 'spark';
}) {
  const cls = tone === 'success' ? 'text-success' : tone === 'spark' ? 'text-spark' : 'text-ink';
  return (
    <div className="bg-surface px-3 py-2.5">
      <div className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.18 }}
            className={`font-display text-[18px] font-semibold tabular-nums ${cls}`}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="font-mono text-[9px] text-ink3 tabular-nums">{delta}</span>
      </div>
    </div>
  );
}

/* ── Creative row — sparkline + live metrics + status ──────────────────── */

function CreativeRow({
  creative: c,
  idx,
  showFinal,
  showOutcome,
}: {
  creative: Creative;
  idx: number;
  showFinal: boolean;
  showOutcome: boolean;
}) {
  const cpa = showFinal ? c.finalCPA : c.baselineCPA;
  const roas = showFinal ? c.finalROAS : c.baselineROAS;

  const status = showOutcome ? c.outcome : 'hold';
  const statusCfg =
    status === 'winner' ? { text: 'PROMOTED', cls: 'text-success border-success/55 bg-success/8' }
    : status === 'kill' ? { text: 'KILLED', cls: 'text-fail border-fail/55 bg-fail/10' }
    : { text: 'hold', cls: 'text-ink3 border-rule2 bg-bg' };

  const cpaTone = showFinal && c.outcome === 'winner' ? 'text-success'
    : showFinal && c.outcome === 'kill' ? 'text-fail'
    : 'text-ink2';

  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor:
          status === 'winner' ? 'rgb(var(--c-success) / 0.06)'
          : status === 'kill' ? 'rgb(var(--c-fail) / 0.06)'
          : 'rgb(var(--c-bg) / 0)',
        opacity: status === 'kill' && showOutcome ? 0.7 : 1,
      }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-[80px_60px_minmax(0,1fr)_60px_60px_72px] gap-2 items-center px-2 py-1.5 border border-rule2 rounded font-mono text-[10px]"
    >
      <span className="text-ink truncate">{c.id}</span>
      <span className="text-ink3 truncate text-[9px]">{c.surface}</span>
      <Sparkline outcome={c.outcome} idx={idx} />
      <span className={`tabular-nums text-right ${cpaTone}`}>${cpa.toFixed(2)}</span>
      <span className={`tabular-nums text-right ${roas > 1.5 ? 'text-success' : roas < 1 ? 'text-fail' : 'text-ink2'}`}>
        {roas.toFixed(1)}×
      </span>
      <span className={`font-mono text-[8.5px] uppercase tracking-eyebrow text-right border rounded px-1 py-[1px] ${statusCfg.cls}`}>
        {statusCfg.text}
      </span>
    </motion.div>
  );
}

/* Sparkline — animated mini chart of CPA over the accrue phase */
function Sparkline({ outcome, idx }: { outcome: Creative['outcome']; idx: number }) {
  // Pre-baked points trending up/down based on outcome
  const points = outcome === 'winner'
    ? [60, 55, 50, 45, 40, 36, 30, 26]
    : outcome === 'kill'
    ? [55, 60, 64, 70, 75, 78, 80, 82]
    : [55, 53, 56, 50, 54, 52, 50, 51];

  const stroke = outcome === 'winner' ? 'rgb(var(--c-success))'
    : outcome === 'kill' ? 'rgb(var(--c-fail))'
    : 'rgb(var(--c-ink2) / 0.6)';

  const pathD = points
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * 100},${y}`)
    .join(' ');

  return (
    <svg viewBox="0 0 100 90" preserveAspectRatio="none" className="w-full h-5" aria-hidden>
      <motion.path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: idx * 0.08, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ── Spend bar — proportional rectangles, redistribute on phase change ──── */

function SpendBar({ showFinal }: { showFinal: boolean }) {
  return (
    <div className="flex h-3 rounded-sm overflow-hidden border border-rule2">
      {CREATIVES.map((c, i) => {
        const share = showFinal ? c.spendShare.after : c.spendShare.before;
        const tone = c.outcome === 'winner' ? 'rgb(var(--c-success))'
          : c.outcome === 'kill' ? 'rgb(var(--c-fail) / 0.5)'
          : i % 2 === 0 ? 'rgb(var(--c-spark))'
          : 'rgb(var(--c-highlight))';
        return (
          <motion.div
            key={c.id}
            animate={{ width: `${share}%`, backgroundColor: tone }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          />
        );
      })}
    </div>
  );
}

/* ── Action ticker — scrolling event feed ───────────────────────────────── */

const ACTIONS = [
  { time: '14:32:14', text: 'cr_8f2a · auto-promoted to 38% spend', tone: 'success' as const },
  { time: '14:32:13', text: 'cr_3b21 · auto-killed (CPA 4× target)', tone: 'fail'    as const },
  { time: '14:32:12', text: 'cr_902a · auto-promoted to 26% spend', tone: 'success' as const },
  { time: '14:32:09', text: 'cr_b71c · auto-killed (ROAS 0.7×)',     tone: 'fail'    as const },
  { time: '14:32:06', text: 'fatigue detector armed · all creatives', tone: 'spark'  as const },
];

function ActionTicker({ phase }: { phase: Phase }) {
  const visible = phase === 'promote' || phase === 'spend' || phase === 'hold';

  return (
    <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3 min-h-[58px]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
          action feed
        </span>
        {visible && (
          <span className="font-mono text-[9px] text-spark animate-pulse">● live</span>
        )}
      </div>
      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-[2px]"
          >
            {ACTIONS.slice(0, 3).map((a, i) => (
              <motion.div
                key={a.text}
                initial={{ opacity: 0, x: -3 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.06 + i * 0.1 }}
                className="flex items-center gap-2 font-mono text-[9.5px]"
              >
                <span className="text-ink3 tabular-nums">{a.time}</span>
                <span className={a.tone === 'success' ? 'text-success' : a.tone === 'fail' ? 'text-fail' : 'text-spark'}>
                  ▸
                </span>
                <span className="text-ink truncate">{a.text}</span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex items-center gap-2 font-mono text-[9.5px] text-ink3">
            <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="uppercase tracking-eyebrow">market open · accruing data</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
