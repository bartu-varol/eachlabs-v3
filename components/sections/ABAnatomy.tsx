'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   ABAnatomy — 3-column "anatomy of a live A/B" section.

     ① ASSIGN     — sticky cohorts; the same user always gets the same variant
     ② MEASURE    — significance built in; auto-stops at confidence
     ③ PROMOTE    — winner ships itself; rollback is a config flip
────────────────────────────────────────────────────────────────────────── */

export function ABAnatomy() {
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
          ● ANATOMY OF AN EXPERIMENT
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Assign. Measure. Promote.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Live A/B testing on production traffic — sticky cohorts that don't drift,
          significance built in, and a winner that ships itself when the math holds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          <Column
            n="01"
            label="ASSIGN"
            title="The same user always sees the same variant."
            body="Sticky cohorts hash by user_id (or any attr). No flickering, no confounded results, no users randomly seeing both variants across sessions."
          >
            <AssignViz />
          </Column>
          <Column
            n="02"
            label="MEASURE"
            title="Real significance, no harness to build."
            body="Power analysis, sequential testing, p-values — surfaced in the dashboard. Quality, latency, error rate, and any custom metric you tag."
          >
            <MeasureViz />
          </Column>
          <Column
            n="03"
            label="PROMOTE"
            title="Winner ships itself."
            body="When confidence holds, the platform flips traffic to the winner. No redeploy. Auto-rollback if quality regresses post-promote."
          >
            <PromoteViz />
          </Column>
        </div>
      </div>
    </section>
  );
}

function Column({
  n,
  label,
  title,
  body,
  children,
}: {
  n: string;
  label: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.36 }}
      className="bg-surface p-6 md:p-7 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums text-spark">{n}</span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">{label}</span>
      </div>
      <h3 className="font-display font-semibold text-[18px] text-ink leading-snug">{title}</h3>
      <p className="text-ink2 text-[13.5px] leading-[1.65]">{body}</p>
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}

/* ── ① ASSIGN — sticky hash visualization ───────────────────────────────── */

const COHORT = [
  { user: 'u_241', variant: 'kling-v3' },
  { user: 'u_188', variant: 'kling-v2' },
  { user: 'u_311', variant: 'kling-v3' },
  { user: 'u_402', variant: 'kling-v3' },
  { user: 'u_555', variant: 'kling-v2' },
  { user: 'u_241', variant: 'kling-v3' }, // repeat user → same variant
];

function AssignViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-2 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>cohort assignment</span>
        <span className="text-spark normal-case tracking-normal">hash · sticky</span>
      </div>
      <div className="flex flex-col gap-1">
        {COHORT.map((c, i) => (
          <motion.div
            key={`${c.user}-${i}`}
            initial={{ opacity: 0, x: -3 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.22, delay: 0.1 + i * 0.05 }}
            className={`flex items-center gap-2 px-2 py-1 border rounded ${
              i === COHORT.length - 1
                ? 'border-spark/55 bg-spark/[0.05]'
                : 'border-rule2 bg-surface'
            }`}
          >
            <span className="text-ink2 w-[68px]">{c.user}</span>
            <span className="text-ink3" aria-hidden>→</span>
            <span
              className={`flex-1 ${
                c.variant === 'kling-v3' ? 'text-spark' : 'text-ink2'
              }`}
            >
              {c.variant}
            </span>
            {i === COHORT.length - 1 && (
              <span className="text-spark text-[9px] uppercase tracking-eyebrow">repeat → same</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── ② MEASURE — p-value timeline ────────────────────────────────────────── */

const PVAL_TIMELINE = [
  { n: '500',   p: 0.42, ok: false },
  { n: '1.5k',  p: 0.21, ok: false },
  { n: '3k',    p: 0.11, ok: false },
  { n: '5k',    p: 0.04, ok: true  },
  { n: '10k',   p: 0.01, ok: true  },
];

function MeasureViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-2 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>p-value · over n</span>
        <span className="text-success normal-case tracking-normal">target · 0.05</span>
      </div>
      <div className="flex flex-col gap-1">
        {PVAL_TIMELINE.map((t, i) => (
          <motion.div
            key={t.n}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: 0.1 + i * 0.07 }}
            className="grid grid-cols-[60px_1fr_60px] gap-2 items-center"
          >
            <span className="text-ink3 tabular-nums">n = {t.n}</span>
            <div className="relative h-2 bg-surface2 rounded-sm overflow-hidden">
              <motion.span
                className={`block h-full rounded-sm ${t.ok ? 'bg-success' : 'bg-fail/60'}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(4, t.p * 200)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              />
              <span
                className="absolute top-0 bottom-0 w-px bg-spark/60"
                style={{ left: `${0.05 * 200}%` }}
                aria-hidden
              />
            </div>
            <span
              className={`tabular-nums text-right ${
                t.ok ? 'text-success' : 'text-ink2'
              }`}
            >
              p = {t.p.toFixed(2)}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.55 }}
        className="text-success text-[10px] flex items-center gap-1.5 mt-1"
      >
        <span>✓</span>
        <span>significant at n = 5k · auto-promote armed</span>
      </motion.div>
    </div>
  );
}

/* ── ③ PROMOTE — before/after traffic split ─────────────────────────────── */

function PromoteViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>traffic · before / after</span>
        <span className="text-spark normal-case tracking-normal">no redeploy</span>
      </div>
      <div className="flex flex-col gap-2">
        <SplitBar label="before" winner={50} loser={50} promoted={false} delay={0.1} />
        <SplitBar label="after"  winner={100} loser={0} promoted={true} delay={0.3} />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.55 }}
        className="text-ink3 text-[10px] flex items-center gap-1.5 mt-1"
      >
        <span className="text-success">✓</span>
        <span>auto-rollback if quality drops post-promote</span>
      </motion.div>
    </div>
  );
}

function SplitBar({
  label,
  winner,
  loser,
  promoted,
  delay,
}: {
  label: string;
  winner: number;
  loser: number;
  promoted: boolean;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-ink3 uppercase tracking-eyebrow text-[9px] w-[60px]">{label}</span>
      <div className="flex-1 flex h-3 rounded-sm overflow-hidden border border-rule2">
        <motion.span
          className={promoted ? 'bg-spark' : 'bg-spark/70'}
          initial={{ width: 0 }}
          whileInView={{ width: `${winner}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="bg-ink2/35"
          initial={{ width: 0 }}
          whileInView={{ width: `${loser}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-ink2 tabular-nums w-12 text-right">
        {winner}/{loser}
      </span>
    </div>
  );
}
