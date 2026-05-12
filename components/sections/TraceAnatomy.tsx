'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   TraceAnatomy — 3-column "anatomy of a trace" section.

     ① CAPTURE  — what's recorded for every step (model, version, ms, cost, ok)
     ② DRILL    — filter traces by attribute, jump to a single request
     ③ EXPORT   — schedule into your warehouse, joinable with billing tables
────────────────────────────────────────────────────────────────────────── */

export function TraceAnatomy() {
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
          ● ANATOMY OF A TRACE
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Capture. Drill. Export.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Every each.run() call records a complete trace. Read it inline. Filter
          across a fleet of them in the dashboard. Stream them to BigQuery for
          downstream joins with your billing data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          <Column
            n="01"
            label="CAPTURE"
            title="Every step. Every fallback. Every dollar."
            body="model · version · status · cost · latency · attrs — captured per step, with parent linkage so multi-step workflows roll up cleanly."
          >
            <CaptureViz />
          </Column>

          <Column
            n="02"
            label="DRILL"
            title="From a sliced row to one request."
            body='Filter the live feed by any attr — "tier = pro AND user_id = u_241" — then click a row to jump to its full trace.'
          >
            <DrillViz />
          </Column>

          <Column
            n="03"
            label="EXPORT"
            title="Stream to your warehouse. Join your bill."
            body="Schedule traces into BigQuery, Snowflake, or S3. attrs land flat as columns — joinable with your invoicing tables."
          >
            <ExportViz />
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
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {label}
        </span>
      </div>
      <h3 className="font-display font-semibold text-[18px] text-ink leading-snug">
        {title}
      </h3>
      <p className="text-ink2 text-[13.5px] leading-[1.65]">{body}</p>
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}

/* ── ① CAPTURE — schema view: every column captured per step ────────────── */

const SCHEMA_FIELDS = [
  { name: 'trace_id',  type: 'string',  example: '"wf_8f2a"' },
  { name: 'step',      type: 'string',  example: '"fallback"' },
  { name: 'model',     type: 'string',  example: '"wan-2.7"' },
  { name: 'version',   type: 'string',  example: '"v3.2"' },
  { name: 'cost_usd',  type: 'number',  example: '0.140' },
  { name: 'ms',        type: 'number',  example: '1180' },
  { name: 'ok',        type: 'boolean', example: 'true' },
];

function CaptureViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-1 font-mono text-[10.5px]">
      <div className="text-ink3 uppercase tracking-eyebrow text-[9px] mb-2">
        per-step schema
      </div>
      {SCHEMA_FIELDS.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, x: -3 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
          className="flex items-baseline gap-2 px-2 py-1 bg-surface border border-rule2 rounded"
        >
          <span className="text-ink2 w-[64px]">{f.name}</span>
          <span className="text-highlight text-[9.5px] uppercase tracking-eyebrow w-[54px]">
            {f.type}
          </span>
          <span className="text-spark text-[10px] truncate">{f.example}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── ② DRILL — filter chip + drill-down preview ─────────────────────────── */

const DRILL_ROWS = [
  { user: 'u_241', tier: 'pro',  cost: '$0.155', ms: '7.92s', dimmed: false, highlighted: true  },
  { user: 'u_188', tier: 'pro',  cost: '$0.092', ms: '4.10s', dimmed: false, highlighted: false },
  { user: 'u_311', tier: 'free', cost: '$0.020', ms: '2.10s', dimmed: true,  highlighted: false },
  { user: 'u_402', tier: 'pro',  cost: '$0.140', ms: '6.55s', dimmed: false, highlighted: false },
];

function DrillViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>filter</span>
        <span className="text-spark normal-case tracking-normal">tier = "pro"</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-[1fr_50px_64px_64px] gap-2 text-ink3 uppercase tracking-eyebrow text-[8.5px] px-2">
          <span>user</span>
          <span>tier</span>
          <span className="text-right">cost</span>
          <span className="text-right">latency</span>
        </div>
        {DRILL_ROWS.map((r, i) => (
          <motion.div
            key={r.user}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: r.dimmed ? 0.35 : 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
            className={`grid grid-cols-[1fr_50px_64px_64px] gap-2 items-center px-2 py-1 border rounded ${
              r.highlighted ? 'border-spark/60 bg-spark/[0.05]' : 'border-rule2 bg-surface'
            }`}
          >
            <span className={r.highlighted ? 'text-spark' : 'text-ink'}>{r.user}</span>
            <span className="text-ink2">{r.tier}</span>
            <span className="text-spark tabular-nums text-right">{r.cost}</span>
            <span className="text-ink3 tabular-nums text-right">{r.ms}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.55 }}
        className="flex items-center gap-1.5 text-spark text-[10px]"
      >
        <span aria-hidden>↳</span>
        <span>click u_241 → full trace · 5 steps · 1 fallback</span>
      </motion.div>
    </div>
  );
}

/* ── ③ EXPORT — schedule + destinations + sample row ────────────────────── */

function ExportViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>schedule</span>
        <span className="text-spark normal-case tracking-normal">hourly</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <ExportRow dest="bigquery://analytics.traces" status="streaming" delay={0.15} />
        <ExportRow dest="s3://eachlabs-traces/2026/"  status="queued"    delay={0.25} />
        <ExportRow dest="snowflake://prod/traces"     status="paused"    delay={0.35} />
      </div>
      <div className="border-t border-rule2 pt-2 mt-1">
        <div className="text-ink3 uppercase tracking-eyebrow text-[9px] mb-1">
          row schema
        </div>
        <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
          <Pill text="trace_id" />
          <Pill text="user_id" />
          <Pill text="tier" />
          <Pill text="step" />
          <Pill text="model" />
          <Pill text="cost_usd" />
          <Pill text="ms" />
          <Pill text="ok" />
        </div>
      </div>
    </div>
  );
}

function ExportRow({
  dest,
  status,
  delay,
}: {
  dest: string;
  status: 'streaming' | 'queued' | 'paused';
  delay: number;
}) {
  const tone =
    status === 'streaming' ? 'text-success border-success/55 bg-success/8'
    : status === 'queued'  ? 'text-spark border-spark/55 bg-spark/8'
    : 'text-ink3 border-rule2 bg-bg';

  return (
    <motion.div
      initial={{ opacity: 0, x: -3 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay }}
      className="flex items-center gap-2 px-2 py-1.5 bg-surface border border-rule2 rounded"
    >
      <span className="text-ink truncate flex-1">{dest}</span>
      <span
        className={`font-mono text-[8.5px] uppercase tracking-eyebrow px-1.5 py-[1px] border rounded whitespace-nowrap ${tone}`}
      >
        {status}
      </span>
    </motion.div>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[9px] text-ink2 bg-surface border border-rule2 rounded px-1.5 py-[1px]">
      {text}
    </span>
  );
}
