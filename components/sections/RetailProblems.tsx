'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   RetailProblems — enterprise commerce pains × the each::xxx that fixes each.

   Six recurring nightmares for a brand/marketing/ecom team. Each card: the
   pain, the without-us reality, the with-us fix, and the platform pieces.
────────────────────────────────────────────────────────────────────────── */

type Problem = {
  problem: string;
  without: string;
  withus:  string;
  fix:     'workflows-locale' | 'router' | 'trace' | 'workflows-model' | 'enhancer' | 'workflows-speed';
  pieces:  string[];
};

const PROBLEMS: Problem[] = [
  {
    problem: '"Brand wants 12 locales by Friday."',
    without: 'Twelve briefs, twelve photo shoots, eight weeks.',
    withus:  'One workflow. 12 localized variants. Audit per asset. 48 hours.',
    fix:     'workflows-locale',
    pieces:  ['each::workflows', 'each::attributes', 'each::trace'],
  },
  {
    problem: 'Provider API breaks during the launch.',
    without: 'Marketing escalates. Eng patches. Launch slips.',
    withus:  'Router spills to fallback in 124ms. Marketing never notices.',
    fix:     'router',
    pieces:  ['each::router', 'each::trace'],
  },
  {
    problem: 'Compliance asks: "Who saw what, when?"',
    without: 'A week of log archaeology. Maybe an answer.',
    withus:  'Filter traces by region/asset/user. Export to S3. Done.',
    fix:     'trace',
    pieces:  ['each::trace', 'each::attributes'],
  },
  {
    problem: 'Real model shoots cost $5k/day.',
    without: 'Booking calendar. Casting. Studio rental. Reshoot fees.',
    withus:  'AI on-model in 1.8s per variant. $0.84 per asset.',
    fix:     'workflows-model',
    pieces:  ['each::workflows', 'each::router'],
  },
  {
    problem: 'Brand voice drifts across five channels.',
    without: 'Manual review queue. Slow + expensive. Off-brand ships.',
    withus:  'brand_voice profile enforced via the enhancer. Live, all channels.',
    fix:     'enhancer',
    pieces:  ['each::enhancer', 'each::workflows'],
  },
  {
    problem: 'Studio rescheduled twice. Launch slips.',
    without: 'Calendar Tetris. Three vendors. Inconsistent assets.',
    withus:  'Parallel branches in one workflow. 200 variants by morning.',
    fix:     'workflows-speed',
    pieces:  ['each::workflows', 'each::trace'],
  },
];

export function RetailProblems() {
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
          Every brand-launch nightmare. Already dispatched.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Six pains every retail or commerce team hits within the first launch
          cycle. The fix is always one of our existing pieces — wired by default,
          billed per-asset, audit-ready.
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

/* ── Fix icons — retail-specific glyphs ─────────────────────────────────── */

function FixIcon({ kind }: { kind: Problem['fix'] }) {
  return (
    <div className="w-9 h-9 rounded bg-bg border border-rule2 flex items-center justify-center shrink-0">
      {kind === 'workflows-locale' && <LocaleFanOutIcon />}
      {kind === 'router'            && <RouterIcon />}
      {kind === 'trace'             && <TraceIcon />}
      {kind === 'workflows-model'   && <ModelIcon />}
      {kind === 'enhancer'          && <EnhancerIcon />}
      {kind === 'workflows-speed'   && <SpeedIcon />}
    </div>
  );
}

function LocaleFanOutIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <circle cx="4" cy="10" r="1.5" fill="rgb(var(--c-spark))" />
      {[6, 10, 14].map((y, i) => (
        <motion.line
          key={i}
          x1="5" y1="10" x2="14" y2={y}
          stroke="rgb(var(--c-spark))"
          strokeWidth="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      <rect x="14" y="5" width="3" height="2" rx="0.5" fill="rgb(var(--c-spark) / 0.7)" />
      <rect x="14" y="9" width="3" height="2" rx="0.5" fill="rgb(var(--c-spark) / 0.7)" />
      <rect x="14" y="13" width="3" height="2" rx="0.5" fill="rgb(var(--c-spark) / 0.7)" />
    </svg>
  );
}

function RouterIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <circle cx="4" cy="6" r="1.6" fill="rgb(var(--c-spark))" />
      <circle cx="4" cy="14" r="1.6" fill="rgb(var(--c-spark) / 0.45)" />
      <circle cx="16" cy="10" r="1.6" fill="rgb(var(--c-spark))" />
      <motion.path d="M5 6 C 10 6, 11 10, 15 10" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
      <motion.path d="M5 14 C 10 14, 11 10, 15 10" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 0, 1, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
    </svg>
  );
}

function TraceIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      {[6, 10, 14].map((y, i) => (
        <motion.line
          key={i}
          x1="3" y1={y} x2={[17, 14, 11][i]} y2={y}
          stroke="rgb(var(--c-spark))"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.6, repeat: Infinity }}>
        <circle cx="10" cy="6" r="2" fill="rgb(var(--c-spark) / 0.7)" />
        <path d="M5 18 L5 11 C 5 9, 15 9, 15 11 L 15 18 Z" fill="rgb(var(--c-spark) / 0.55)" />
      </motion.g>
    </svg>
  );
}

function EnhancerIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <motion.line x1="3" y1="6" x2="13" y2="6" stroke="rgb(var(--c-fail))" strokeWidth="1.5" strokeLinecap="round" animate={{ opacity: [1, 1, 0.3, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.line x1="3" y1="14" x2="17" y2="14" stroke="rgb(var(--c-spark))" strokeWidth="1.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 0, 1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      {[5, 9, 13].map((y, i) => (
        <motion.line
          key={i}
          x1="3" y1={y} x2="17" y2={y}
          stroke="rgb(var(--c-spark))"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ x1: 3, x2: 7 }}
          animate={{ x1: [3, 16], x2: [7, 20] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </svg>
  );
}

/* ── Piece tag ──────────────────────────────────────────────────────────── */

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
