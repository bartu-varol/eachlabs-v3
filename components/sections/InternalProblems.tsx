'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   InternalProblems — IT/Security/Platform-Eng pains × the each::xxx fix.

   Different beats from consumer/retail: the audience is a VPE/CTO/IT lead,
   so the pains are about platform overhead, governance, and approval
   workflows — not 3AM outages or 12-locale launches.
────────────────────────────────────────────────────────────────────────── */

type Problem = {
  problem: string;
  without: string;
  withus:  string;
  fix:     'multi-tool' | 'sso' | 'audit' | 'cost' | 'retention' | 'surfaces';
  pieces:  string[];
};

const PROBLEMS: Problem[] = [
  {
    problem: '"Every team wants their own AI tool."',
    without: 'Stand up an ML platform. Hire SRE. Ship in two quarters.',
    withus:  'One dev, one SDK, six tools in two weeks. Same infra under all.',
    fix:     'multi-tool',
    pieces:  ['each::workflows', 'each::trace'],
  },
  {
    problem: 'IT requires SSO+SAML before launch.',
    without: 'Custom auth glue per tool. Months of platform work.',
    withus:  'Wire your IDP once. Every tool inherits SSO + RBAC by default.',
    fix:     'sso',
    pieces:  ['each::workflows', 'each::attributes'],
  },
  {
    problem: 'Legal asks: "Where did this output come from?"',
    without: 'You don\'t know. PR meeting on Monday.',
    withus:  'Trace by tool, by user, by prompt. Exportable audit log per call.',
    fix:     'audit',
    pieces:  ['each::trace', 'each::attributes'],
  },
  {
    problem: 'Finance wants per-team cost.',
    without: 'Spreadsheet hand-stitching every month. Always wrong.',
    withus:  'Tag team_id once. Finance sees a clean line-item per team.',
    fix:     'cost',
    pieces:  ['each::attributes', 'each::trace'],
  },
  {
    problem: 'Sensitive prompts must auto-purge after 30 days.',
    without: 'Manual deletion job. Compliance escalation when missed.',
    withus:  'Set retention per workflow. Sensitive prompts auto-purge on schedule.',
    fix:     'retention',
    pieces:  ['each::workflows', 'each::trace'],
  },
  {
    problem: 'Slack bot, web UI, and CLI must share infra.',
    without: 'Three codebases. Three auth glues. Drift forever.',
    withus:  'Same each.run() from any surface. Same audit. Same RBAC.',
    fix:     'surfaces',
    pieces:  ['each::workflows', 'each::router'],
  },
];

export function InternalProblems() {
  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgb(var(--c-highlight) / 0.05), transparent 65%)',
        }}
      />
      <div className="container py-24 md:py-28 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-highlight mb-3">
          ● PROBLEMS YOU&rsquo;LL HIT
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Every internal-AI ops nightmare. Already governed.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Six pains every platform/IT lead hits within the first quarter of
          rolling out internal AI. The fix is always one of our existing
          pieces — wired by default, audit-ready, ops-friendly.
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

/* ── Fix icons — IT/governance flavored ─────────────────────────────────── */

function FixIcon({ kind }: { kind: Problem['fix'] }) {
  return (
    <div className="w-9 h-9 rounded bg-bg border border-rule2 flex items-center justify-center shrink-0">
      {kind === 'multi-tool' && <MultiToolIcon />}
      {kind === 'sso'        && <SsoIcon />}
      {kind === 'audit'      && <AuditIcon />}
      {kind === 'cost'       && <CostIcon />}
      {kind === 'retention'  && <RetentionIcon />}
      {kind === 'surfaces'   && <SurfacesIcon />}
    </div>
  );
}

function MultiToolIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <circle cx="10" cy="10" r="2" fill="rgb(var(--c-spark))" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const x = 10 + Math.cos(angle) * 6.5;
        const y = 10 + Math.sin(angle) * 6.5;
        return (
          <motion.circle
            key={i}
            cx={x} cy={y} r="1.4"
            fill="rgb(var(--c-spark) / 0.55)"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18 }}
          />
        );
      })}
    </svg>
  );
}

function SsoIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <rect x="6" y="9" width="8" height="7" rx="1" stroke="rgb(var(--c-spark))" strokeWidth="1.2" fill="none" />
      <path d="M8 9 V 7 A 2 2 0 0 1 12 7 V 9" stroke="rgb(var(--c-spark))" strokeWidth="1.2" fill="none" />
      <motion.circle
        cx="10" cy="12.5" r="0.8"
        fill="rgb(var(--c-spark))"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <rect x="4" y="3" width="12" height="14" rx="1" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" />
      {[6, 9, 12].map((y, i) => (
        <motion.line
          key={i}
          x1="6" y1={y} x2={[14, 12, 13][i]} y2={y}
          stroke="rgb(var(--c-spark))"
          strokeWidth="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
      <circle cx="14" cy="14" r="1.5" fill="rgb(var(--c-success))" />
    </svg>
  );
}

function CostIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <motion.rect
        x="3" y="13" width="3" height="4" rx="0.5"
        fill="rgb(var(--c-spark) / 0.6)"
        animate={{ height: [3, 5, 4], y: [14, 12, 13] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
      <motion.rect
        x="8.5" y="9" width="3" height="8" rx="0.5"
        fill="rgb(var(--c-spark))"
        animate={{ height: [6, 9, 8], y: [11, 8, 9] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.rect
        x="14" y="6" width="3" height="11" rx="0.5"
        fill="rgb(var(--c-spark) / 0.7)"
        animate={{ height: [9, 12, 10], y: [8, 5, 7] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }}
      />
    </svg>
  );
}

function RetentionIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <circle cx="10" cy="10" r="6" stroke="rgb(var(--c-spark))" strokeWidth="1.2" fill="none" />
      <motion.line
        x1="10" y1="10" x2="10" y2="6"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1.2"
        strokeLinecap="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '10px 10px' }}
      />
      <line x1="10" y1="10" x2="13" y2="11" stroke="rgb(var(--c-spark) / 0.7)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function SurfacesIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden>
      <rect x="2" y="4" width="6" height="4" rx="0.5" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" />
      <rect x="12" y="4" width="6" height="4" rx="0.5" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" />
      <rect x="7" y="12" width="6" height="4" rx="0.5" stroke="rgb(var(--c-spark))" strokeWidth="1" fill="none" />
      <motion.line
        x1="5" y1="8" x2="10" y2="12"
        stroke="rgb(var(--c-spark) / 0.55)"
        strokeWidth="0.8"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0 }}
      />
      <motion.line
        x1="15" y1="8" x2="10" y2="12"
        stroke="rgb(var(--c-spark) / 0.55)"
        strokeWidth="0.8"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.5 }}
      />
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
