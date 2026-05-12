'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

type Problem = {
  problem: string;
  without: string;
  withus:  string;
  metric:  string;
  pieces:  string[];
};

const PROBLEMS: Problem[] = [
  {
    problem: 'Creative fatigue tanks performance week 2.',
    without: 'CTR drops 40% by day 9. Spend keeps running on dead variants.',
    withus:  'Fatigue detector watches CTR decay. Auto-spin a fresh batch the moment it slips.',
    metric:  'reaction · <5 min',
    pieces:  ['each::ab', 'each::workflows'],
  },
  {
    problem: 'ROAS data lags by three days.',
    without: 'You optimize on stale numbers. Burn $X chasing dead winners.',
    withus:  'Per-creative attribution streams in real time. Slice cost-per-result live.',
    metric:  'attribution · live',
    pieces:  ['each::attributes', 'each::trace'],
  },
  {
    problem: 'Production bottleneck on 50 ad variants.',
    without: 'Designer queue. Two-week turnaround. Half the variants ship late.',
    withus:  'One workflow run, 50 brand-safe variants by morning. Audit per asset.',
    metric:  '$/variant · $0.46',
    pieces:  ['each::workflows', 'each::enhancer'],
  },
  {
    problem: 'Black-box attribution.',
    without: 'Spreadsheet hand-stitching after each campaign. Always wrong.',
    withus:  'Tag creative_id. Pull conversions. We slice cost-per-result back to the asset.',
    metric:  'sliced · per asset',
    pieces:  ['each::attributes', 'each::trace'],
  },
  {
    problem: 'Compliance varies per region.',
    without: 'Regional team flags violations after launch. Take-downs. PR cleanup.',
    withus:  'Pre-serve gate enforces IAB / GDPR / regional rules per workflow.',
    metric:  'pre-serve · gated',
    pieces:  ['each::workflows', 'each::enhancer'],
  },
  {
    problem: 'Spend stuck on a single ad network.',
    without: 'Lock-in to one DSP. Lose negotiating leverage.',
    withus:  'Router routes to best CPA per surface. Spend shifts in real time.',
    metric:  'spend · auto-routed',
    pieces:  ['each::router', 'each::ab'],
  },
];

export function AdTechProblems() {
  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgb(var(--c-fail) / 0.04), transparent 65%)',
        }}
      />
      <div className="container py-24 md:py-28 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-highlight mb-3">
          ● PROBLEMS YOU&rsquo;LL HIT
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Every performance-marketing nightmare. Already in the loop.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Six pains every growth team hits within the first month of a paid
          push. The fix is always inside the closed loop — generate, serve,
          measure, refresh — no exit ramp.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          {PROBLEMS.map((p, i) => (
            <ProblemCard key={p.problem} p={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ p, idx }: { p: Problem; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.36, delay: (idx % 3) * 0.05 }}
      className="bg-surface p-6 md:p-7 flex flex-col gap-4"
    >
      <div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fail mb-1.5">
          ✗ problem
        </div>
        <h3 className="font-display font-semibold text-[15.5px] text-ink leading-snug">
          {p.problem}
        </h3>
      </div>

      {/* Terminal-style metric box */}
      <div className="bg-bg border border-rule2 rounded-md px-3 py-2">
        <div className="font-mono text-[9px] uppercase tracking-eyebrow text-spark">
          {p.metric}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 px-3 py-2 bg-bg border border-rule2 rounded">
          <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3 w-[60px] shrink-0 mt-[2px]">
            without
          </span>
          <span className="text-ink2 text-[12px] leading-[1.55] line-through decoration-ink3/40">
            {p.without}
          </span>
        </div>
        <div className="flex items-start gap-2 px-3 py-2 bg-spark/[0.04] border border-spark/40 rounded">
          <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark w-[60px] shrink-0 mt-[2px]">
            with us
          </span>
          <span className="text-ink text-[12px] leading-[1.55]">{p.withus}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">fixed by</span>
        {p.pieces.map((piece) => (
          <PieceTag key={piece} name={piece} />
        ))}
      </div>
    </motion.div>
  );
}

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
