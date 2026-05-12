'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   MarketingProblems — brand-team pains × the each::xxx fix.
────────────────────────────────────────────────────────────────────────── */

type Problem = {
  problem: string;
  without: string;
  withus:  string;
  fix:     'voice-drift' | 'multi-dim' | 'approval' | 'speed' | 'cobrand' | 'perf-ab';
  pieces:  string[];
};

const PROBLEMS: Problem[] = [
  {
    problem: 'Brand voice drifts after the rebrand.',
    without: 'Manual review on every output. Off-brand assets ship anyway.',
    withus:  'One profile is the only source of truth. Drift detected → blocked.',
    fix:     'voice-drift',
    pieces:  ['each::enhancer', 'each::trace'],
  },
  {
    problem: 'Every channel demands a different dimension.',
    without: 'Designer recropping forever. Specs Slack channel war.',
    withus:  'One brief × N channel specs. Parallel run. Correct dims. Audited.',
    fix:     'multi-dim',
    pieces:  ['each::workflows', 'each::enhancer'],
  },
  {
    problem: 'Approval chains take two weeks.',
    without: 'Endless email threads. Unclear which version is "approved".',
    withus:  'Pin a workflow version. Trace shows who approved what, when.',
    fix:     'approval',
    pieces:  ['each::workflows', 'each::trace'],
  },
  {
    problem: 'Launch creative needed by Friday.',
    without: 'Agency turnaround: two weeks, $40k, three rounds.',
    withus:  'One workflow, 200 brand-safe variants by morning. Audit included.',
    fix:     'speed',
    pieces:  ['each::workflows', 'each::trace'],
  },
  {
    problem: 'Tone drifts on partner co-branding.',
    without: 'Three review cycles per asset. Both teams unhappy.',
    withus:  'Co-brand profile blends both voices. Drift gates on each side.',
    fix:     'cobrand',
    pieces:  ['each::enhancer', 'each::workflows'],
  },
  {
    problem: 'Performance team wants A/B per channel.',
    without: 'Build a separate A/B harness. Six weeks. Confounded results.',
    withus:  'Set splits per surface. Auto-promote the winner. Trace knows.',
    fix:     'perf-ab',
    pieces:  ['each::ab', 'each::trace', 'each::attributes'],
  },
];

export function MarketingProblems() {
  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgb(var(--c-spark) / 0.05), transparent 65%)',
        }}
      />
      <div className="container py-24 md:py-28 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-highlight mb-3">
          ● PROBLEMS YOU&rsquo;LL HIT
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Every brand-launch nightmare. Already brand-safe.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Six pains every brand or marketing team hits within the first
          quarterly calendar. The fix is always the same shape: brand voice
          profile + workflow + trace.
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
      <div className="flex items-start gap-3">
        <FixIcon kind={p.fix} />
        <div className="flex-1">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fail mb-1">
            ✗ problem
          </div>
          <h3 className="font-display font-semibold text-[15.5px] text-ink leading-snug">
            {p.problem}
          </h3>
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
        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
          fixed by
        </span>
        {p.pieces.map((piece) => (
          <PieceTag key={piece} name={piece} />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Fix icons — brand/marketing themed ─────────────────────────────────── */

function FixIcon({ kind }: { kind: Problem['fix'] }) {
  return (
    <div className="w-9 h-9 rounded bg-bg border border-rule2 flex items-center justify-center shrink-0">
      {kind === 'voice-drift' && <DriftIcon />}
      {kind === 'multi-dim'   && <MultiDimIcon />}
      {kind === 'approval'    && <ApprovalIcon />}
      {kind === 'speed'       && <SpeedIcon />}
      {kind === 'cobrand'     && <CobrandIcon />}
      {kind === 'perf-ab'     && <PerfAbIcon />}
    </div>
  );
}

function DriftIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <motion.circle cx="10" cy="10" r="2.5" fill="rgb(var(--c-spark))" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <circle cx="10" cy="10" r="6" stroke="rgb(var(--c-spark) / 0.45)" strokeWidth="0.8" fill="none" strokeDasharray="2 2" />
    </svg>
  );
}

function MultiDimIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <rect x="3" y="3" width="6" height="6" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" rx="0.5" />
      <rect x="11" y="3" width="6" height="3" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" rx="0.5" />
      <rect x="3" y="11" width="3" height="6" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" rx="0.5" />
      <rect x="8" y="11" width="9" height="6" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" rx="0.5" />
    </svg>
  );
}

function ApprovalIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <rect x="4" y="3" width="12" height="14" rx="1" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" />
      <motion.path d="M7 9 L9.5 11.5 L13 7" stroke="rgb(var(--c-success))" strokeWidth="1.5" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      {[5, 9, 13].map((y, i) => (
        <motion.line key={i} x1="3" y1={y} x2="17" y2={y} stroke="rgb(var(--c-spark))" strokeWidth="1.5" strokeLinecap="round"
          initial={{ x1: 3, x2: 7 }}
          animate={{ x1: [3, 16], x2: [7, 20] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function CobrandIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <circle cx="7" cy="10" r="4" fill="rgb(var(--c-spark) / 0.55)" />
      <circle cx="13" cy="10" r="4" fill="rgb(var(--c-highlight) / 0.55)" />
    </svg>
  );
}

function PerfAbIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <motion.rect x="3" y="6" width="6" height="9" rx="0.5" fill="rgb(var(--c-spark))" animate={{ height: [6, 10, 9], y: [11, 7, 8] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <motion.rect x="11" y="9" width="6" height="6" rx="0.5" fill="rgb(var(--c-ink2) / 0.45)" animate={{ height: [4, 6, 5], y: [13, 11, 12] }} transition={{ duration: 1.6, repeat: Infinity, delay: 0.2 }} />
    </svg>
  );
}

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
