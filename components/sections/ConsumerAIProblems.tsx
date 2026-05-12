'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   ConsumerAIProblems — "every problem you'll hit, we already solve."

   Six recurring consumer-app pains. Each card: the problem, the without-us
   reality, the with-us fix, and which platform pieces make the fix work.
   The visceral feeling: the visitor finds their nightmare on the page and
   sees it dispatched in two lines.
────────────────────────────────────────────────────────────────────────── */

type Problem = {
  problem: string;
  without: string;
  withus: string;
  fix: 'router' | 'attributes' | 'enhancer' | 'ab' | 'workflows' | 'trace';
  pieces: string[];
};

const PROBLEMS: Problem[] = [
  {
    problem: '3 AM, kling-v3 goes down.',
    without: 'On-call paged. App degrades. 47 minutes of broken videos.',
    withus:  'Spillover to wan-2.7 in 124ms. Users keep generating.',
    fix: 'router',
    pieces: ['each::router', 'each::trace'],
  },
  {
    problem: 'A free user generates 200 images.',
    without: 'Bill arrives Monday. Surprise + finance call.',
    withus:  'tier="free" caps spend live. No surprise, no abuse.',
    fix: 'attributes',
    pieces: ['each::attributes', 'each::trace'],
  },
  {
    problem: '"Looks like Red Bull" gets refused.',
    without: 'User sees an error. Session ends. You don\'t bill.',
    withus:  'Enhancer rewrites in 156ms; safe variant ships. User pays.',
    fix: 'enhancer',
    pieces: ['each::enhancer', 'each::trace'],
  },
  {
    problem: 'New model drops on Wednesday.',
    without: 'New SDK, new auth, two-week integration.',
    withus:  'Change one string. A/B on 10%. Promote when significant.',
    fix: 'ab',
    pieces: ['each::ab', 'each::router'],
  },
  {
    problem: 'Brand voice drifts across modalities.',
    without: 'Manual review queue. Slow + expensive.',
    withus:  'One workflow with brand_voice profile across image/video/audio.',
    fix: 'workflows',
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    problem: '"Why does this user cost me 10×?"',
    without: 'A week of log archaeology. Maybe an answer.',
    withus:  'Drill by user_id in the dashboard. Trace ID in 90 seconds.',
    fix: 'trace',
    pieces: ['each::trace', 'each::attributes'],
  },
];

export function ConsumerAIProblems() {
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
          Every consumer-AI nightmare. Already dispatched.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Six pains every consumer-AI team hits within the first three months.
          The fix is always one of our existing pieces — wired by default.
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

/* ── Problem card ───────────────────────────────────────────────────────── */

function ProblemCard({ p, idx }: { p: Problem; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.36, delay: (idx % 3) * 0.05 }}
      className="bg-surface p-6 md:p-7 flex flex-col gap-4"
    >
      {/* Problem header */}
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

      {/* Before / after */}
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

      {/* Pieces */}
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

/* ── Tiny icon per fix kind — animated to give the card life ────────────── */

function FixIcon({ kind }: { kind: Problem['fix'] }) {
  return (
    <div className="w-9 h-9 rounded bg-bg border border-rule2 flex items-center justify-center shrink-0 relative">
      {kind === 'router'     && <RouterIcon />}
      {kind === 'attributes' && <AttributesIcon />}
      {kind === 'enhancer'   && <EnhancerIcon />}
      {kind === 'ab'         && <ABIcon />}
      {kind === 'workflows'  && <WorkflowsIcon />}
      {kind === 'trace'      && <TraceIcon />}
    </div>
  );
}

function RouterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="4" cy="6" r="1.6" fill="rgb(var(--c-spark))" />
      <circle cx="4" cy="14" r="1.6" fill="rgb(var(--c-spark) / 0.45)" />
      <circle cx="16" cy="10" r="1.6" fill="rgb(var(--c-spark))" />
      <motion.path
        d="M5 6 C 10 6, 11 10, 15 10"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.4, 0.7, 1] }}
      />
      <motion.path
        d="M5 14 C 10 14, 11 10, 15 10"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, times: [0, 0.45, 0.85, 1] }}
      />
    </svg>
  );
}

function AttributesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <motion.rect
        x="3" y="4" width="14" height="2" rx="1"
        fill="rgb(var(--c-spark))"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0 }}
      />
      <motion.rect
        x="3" y="9" width="10" height="2" rx="1"
        fill="rgb(var(--c-spark))"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
      />
      <motion.rect
        x="3" y="14" width="12" height="2" rx="1"
        fill="rgb(var(--c-spark))"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
      />
    </svg>
  );
}

function EnhancerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <motion.line
        x1="3" y1="6" x2="13" y2="6"
        stroke="rgb(var(--c-fail))"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ opacity: [1, 1, 0.3, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.line
        x1="3" y1="14" x2="17" y2="14"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M9 8 L9 12"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1"
        strokeDasharray="2,1"
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

function ABIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <motion.rect
        x="3" y="6" width="6" height="8" rx="1"
        fill="rgb(var(--c-spark) / 0.7)"
        animate={{ height: [4, 8, 8], y: [10, 6, 6] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
      />
      <motion.rect
        x="11" y="6" width="6" height="8" rx="1"
        fill="rgb(var(--c-ink2) / 0.45)"
        animate={{ height: [3, 5, 5], y: [11, 9, 9] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
      />
    </svg>
  );
}

function WorkflowsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="4" cy="10" r="1.5" fill="rgb(var(--c-spark))" />
      <circle cx="10" cy="6" r="1.5" fill="rgb(var(--c-spark))" />
      <circle cx="10" cy="14" r="1.5" fill="rgb(var(--c-spark))" />
      <circle cx="16" cy="10" r="1.5" fill="rgb(var(--c-spark))" />
      <motion.path
        d="M5 10 L 9 6 M5 10 L 9 14 M11 6 L 15 10 M11 14 L 15 10"
        stroke="rgb(var(--c-spark) / 0.6)"
        strokeWidth="0.8"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </svg>
  );
}

function TraceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <motion.line
        x1="3" y1="6" x2="17" y2="6"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.4, 1] }}
      />
      <motion.line
        x1="3" y1="10" x2="14" y2="10"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
      />
      <motion.line
        x1="3" y1="14" x2="11" y2="14"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 0, 1] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.6, 1] }}
      />
    </svg>
  );
}

/* ── Piece tag — same logo style as EachLabel ───────────────────────────── */

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
