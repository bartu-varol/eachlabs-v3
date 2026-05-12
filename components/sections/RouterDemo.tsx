'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   RouterDemo, the 5-second story for /router.

   Four-phase loop (~7.2s total). Tells: "Router watches all candidates.
   Primary degrades. Failover decision in <120ms. Trace shows what fired."

     0.0 – 1.8s  STEADY      kling-v3 healthy, traffic flowing, p95 stable
     1.8 – 3.0s  DEGRADE     kling-v3 latency spikes + error rate climbs
     3.0 – 3.8s  DECIDE      router scores 3 candidates → wan-2.7 wins
     3.8 – 7.2s  FAILOVER   traffic on wan-2.7, "saved 1 page" footer

   Primary signal each phase tells in isolation:
     · STEADY  , "many candidates exist"
     · DEGRADE , "router sees the problem first"
     · DECIDE  , "the choice is data-driven"
     · SPILL   , "users never noticed"
────────────────────────────────────────────────────────────────────────── */

type Phase = 'steady' | 'degrade' | 'decide' | 'spill';

const TIMINGS: Record<Phase, number> = {
  steady: 1800,
  degrade: 1200,
  decide: 800,
  spill: 3400,
};

const TOTAL_LOOP =
  TIMINGS.steady + TIMINGS.degrade + TIMINGS.decide + TIMINGS.spill;

type Lane = {
  id: 'kling' | 'wan' | 'veo';
  name: string;
  /** When NOT in failover, all p95 values shown. Latency story */
  p95: { steady: number; degrade: number };
  /** Score the router assigns during DECIDE (1.0 = best). */
  score: number;
};

const LANES: Lane[] = [
  { id: 'kling', name: 'kling-v3-12v', p95: { steady: 640, degrade: 1420 }, score: 0.31 },
  { id: 'wan',   name: 'wan-2.7',      p95: { steady: 580, degrade: 580  }, score: 0.94 },
  { id: 'veo',   name: 'veo-3',        p95: { steady: 720, degrade: 720  }, score: 0.78 },
];

export function RouterDemo() {
  const [phase, setPhase] = useState<Phase>('steady');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    function tick() {
      clearAll();
      setPhase('steady');
      const t1 = TIMINGS.steady;
      const t2 = t1 + TIMINGS.degrade;
      const t3 = t2 + TIMINGS.decide;
      timeoutsRef.current.push(setTimeout(() => setPhase('degrade'), t1));
      timeoutsRef.current.push(setTimeout(() => setPhase('decide'),  t2));
      timeoutsRef.current.push(setTimeout(() => setPhase('spill'),   t3));
    }

    tick();
    const id = setInterval(tick, TOTAL_LOOP);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

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
              ROUTER · LIVE
            </span>
          </div>
          <PhaseLabel phase={phase} />
        </div>

        {/* Three-lane stack */}
        <div className="px-4 md:px-5 pt-4 pb-2 flex flex-col gap-2.5">
          {LANES.map((lane, idx) => (
            <LaneRow key={lane.id} lane={lane} idx={idx} phase={phase} />
          ))}
        </div>

        {/* Decision strip */}
        <DecisionStrip phase={phase} />

        {/* Bottom strip, outcome counters */}
        <div className="grid grid-cols-3 gap-px bg-rule2 border-t border-rule2">
          <Counter
            label="failover"
            value={
              phase === 'decide'
                ? '- ms'
                : phase === 'spill'
                ? '118ms'
                : phase === 'degrade'
                ? 'detecting'
                : 'idle'
            }
            tone={phase === 'spill' ? 'spark' : phase === 'degrade' ? 'fail' : 'muted'}
          />
          <Counter
            label="pages fired"
            value="0"
            tone="success"
          />
          <Counter
            label="user delay"
            value={phase === 'spill' || phase === 'decide' ? '+0ms' : '0ms'}
            tone="success"
          />
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        primary degrades · router spills in &lt;120ms · users never see it
      </div>
    </div>
  );
}

/* ── Phase label that morphs through the four states ────────────────────── */

function PhaseLabel({ phase }: { phase: Phase }) {
  const text =
    phase === 'steady'
      ? 'all healthy'
      : phase === 'degrade'
      ? 'kling-v3 ↑ p95'
      : phase === 'decide'
      ? 'scoring 3 candidates'
      : 'spilled → wan-2.7';

  const tone =
    phase === 'steady'
      ? 'text-success'
      : phase === 'degrade'
      ? 'text-fail'
      : 'text-spark';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phase}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18 }}
        className={`font-mono text-[10px] uppercase tracking-eyebrow ${tone}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

/* ── A single model lane: name · packets · p95 · status ─────────────────── */

function LaneRow({
  lane,
  idx,
  phase,
}: {
  lane: Lane;
  idx: number;
  phase: Phase;
}) {
  const isPrimary = lane.id === 'kling';
  const isWinner  = lane.id === 'wan';

  // Whether THIS lane is currently serving traffic.
  const serving =
    isPrimary
      ? phase === 'steady' || phase === 'degrade'
      : isWinner
      ? phase === 'spill'
      : false;

  // p95 value shown for primary's degrade phase; others are stable.
  const p95 =
    isPrimary && (phase === 'degrade' || phase === 'decide')
      ? lane.p95.degrade
      : lane.p95.steady;

  // Latency bar fill (0–100%), relative to a 1500ms ceiling.
  const fill = Math.min(100, (p95 / 1500) * 100);

  // Status tone for the badge on the right.
  const statusTone: 'ok' | 'fail' | 'standby' | 'serving' =
    isPrimary && (phase === 'degrade' || phase === 'decide')
      ? 'fail'
      : serving
      ? 'serving'
      : phase === 'decide' && (isWinner || lane.id === 'veo')
      ? 'standby'
      : 'ok';

  return (
    <motion.div
      className="relative bg-bg border border-rule2 rounded-md px-3 py-2.5"
      animate={{
        borderColor:
          serving
            ? 'rgb(var(--c-spark) / 0.55)'
            : statusTone === 'fail'
            ? 'rgb(var(--c-fail) / 0.55)'
            : 'rgb(var(--c-rule2))',
        boxShadow:
          serving
            ? '0 0 0 1px rgb(var(--c-spark) / 0.18)'
            : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-3">
        {/* Role tag */}
        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3 w-12 shrink-0">
          {isPrimary ? 'primary' : `f.b ${idx}`}
        </span>

        {/* Name */}
        <span
          className={`font-mono text-[12px] flex-shrink-0 ${
            statusTone === 'fail' ? 'text-fail' : 'text-ink'
          }`}
        >
          {lane.name}
        </span>

        {/* Packet stream */}
        <div className="relative flex-1 h-3 hidden sm:block">
          <PacketStream serving={serving} laneIdx={idx} />
        </div>

        {/* p95 readout */}
        <motion.span
          key={`${lane.id}-${p95}`}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-mono text-[10px] tabular-nums w-14 text-right ${
            isPrimary && phase === 'degrade'
              ? 'text-fail'
              : isPrimary && phase === 'decide'
              ? 'text-fail'
              : 'text-ink2'
          }`}
        >
          {p95}ms
        </motion.span>

        {/* Status badge */}
        <StatusBadge tone={statusTone} />
      </div>

      {/* Latency bar */}
      <div className="mt-2 h-1 bg-surface2 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={{
            width: `${fill}%`,
            backgroundColor:
              isPrimary && (phase === 'degrade' || phase === 'decide')
                ? 'rgb(var(--c-fail))'
                : serving
                ? 'rgb(var(--c-spark))'
                : 'rgb(var(--c-success) / 0.6)',
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

/* ── Status badge, small uppercase pill ────────────────────────────────── */

function StatusBadge({ tone }: { tone: 'ok' | 'fail' | 'standby' | 'serving' }) {
  const cfg = {
    ok:       { text: 'ok',       cls: 'border-success/55 text-success bg-success/8' },
    fail:     { text: 'breach',   cls: 'border-fail/60 text-fail bg-fail/10' },
    standby:  { text: 'standby',  cls: 'border-rule2 text-ink3 bg-bg' },
    serving:  { text: 'serving',  cls: 'border-spark/55 text-spark bg-spark/10' },
  }[tone];
  return (
    <motion.span
      key={tone}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18 }}
      className={`inline-flex items-center font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 border rounded whitespace-nowrap w-[58px] justify-center ${cfg.cls}`}
    >
      {cfg.text}
    </motion.span>
  );
}

/* ── Packet stream, three running dots when serving, faded when idle ───── */

function PacketStream({ serving, laneIdx }: { serving: boolean; laneIdx: number }) {
  return (
    <>
      <span className="absolute left-0 right-0 top-1/2 h-px bg-rule2 -translate-y-1/2" aria-hidden />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-spark"
          initial={{ left: '0%', opacity: 0 }}
          animate={{
            left: ['0%', '100%'],
            opacity: serving ? [0, 1, 1, 0] : 0,
          }}
          transition={{
            left: {
              duration: 1.4,
              delay: i * 0.45 + laneIdx * 0.12,
              repeat: Infinity,
              ease: 'linear',
            },
            opacity: {
              duration: 1.4,
              delay: i * 0.45 + laneIdx * 0.12,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          style={{ boxShadow: '0 0 4px rgb(var(--c-spark) / 0.7)' }}
        />
      ))}
    </>
  );
}

/* ── Decision strip, visible during DECIDE + SPILL phases ──────────────── */

function DecisionStrip({ phase }: { phase: Phase }) {
  // Single keyed child per phase, mode="wait" gives a clean cross-fade with no overlap.
  return (
    <div className="relative h-[58px] border-t border-rule2 bg-bg/40 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 px-4 md:px-5"
        >
          {phase === 'decide' ? (
            <div className="h-full flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark whitespace-nowrap">
                ◐ scoring
              </span>
              <div className="flex-1 flex flex-col gap-1">
                {LANES.map((l) => (
                  <ScoreRow
                    key={l.id}
                    name={l.name}
                    score={l.id === 'kling' ? 0.31 : l.score}
                    winner={l.id === 'wan'}
                  />
                ))}
              </div>
            </div>
          ) : phase === 'spill' ? (
            <div className="h-full flex items-center gap-3 font-mono text-[11px]">
              <span className="text-success">✓</span>
              <span className="text-ink3 line-through decoration-fail/70">
                kling-v3-12v
              </span>
              <span className="text-spark">→</span>
              <span className="text-ink">wan-2.7</span>
              <span className="text-ink3 hidden sm:inline">·</span>
              <span className="text-ink2 hidden sm:inline">trace.router_decision</span>
              <span className="ml-auto text-ink3 hidden sm:inline">sticky cohort</span>
            </div>
          ) : (
            <div className="h-full flex items-center font-mono text-[10px] uppercase tracking-eyebrow text-ink3 gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-success animate-pulse" aria-hidden />
              watching · latency · errors · quality drift
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ScoreRow({
  name,
  score,
  winner,
}: {
  name: string;
  score: number;
  winner: boolean;
}) {
  return (
    <div className="flex items-center gap-2 font-mono text-[9.5px]">
      <span className={`w-[88px] truncate ${winner ? 'text-spark' : 'text-ink3'}`}>
        {name}
      </span>
      <div className="flex-1 h-1 bg-surface2 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${winner ? 'bg-spark' : score < 0.5 ? 'bg-fail/70' : 'bg-ink2/50'}`}
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className={`tabular-nums w-8 text-right ${winner ? 'text-spark' : 'text-ink3'}`}>
        {score.toFixed(2)}
      </span>
    </div>
  );
}

/* ── Bottom counter cell ────────────────────────────────────────────────── */

function Counter({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'spark' | 'success' | 'fail' | 'muted';
}) {
  const cls = {
    spark:   'text-spark',
    success: 'text-success',
    fail:    'text-fail',
    muted:   'text-ink3',
  }[tone];
  return (
    <div className="bg-surface px-3 py-3">
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3 mb-1">
        {label}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.18 }}
          className={`font-display text-[15px] md:text-[16px] font-semibold tabular-nums ${cls}`}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
