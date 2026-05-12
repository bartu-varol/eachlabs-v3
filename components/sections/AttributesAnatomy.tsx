'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   AttributesAnatomy — 3-column "anatomy of attributes" section.

     ① TAG        — flat object on each.run(); typed inference happens server-side
     ② SLICE      — combine any attrs as filters; no schema
     ③ AUDIT      — every tagged call is audit-loggable, joinable with billing
────────────────────────────────────────────────────────────────────────── */

export function AttributesAnatomy() {
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
          ● ANATOMY OF ATTRIBUTES
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Tag. Slice. Audit.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Attributes turn one each.run() call into infinite slicing dimensions —
          tier, region, persona, experiment, anything — without a schema migration
          or a column to add.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          <Column
            n="01"
            label="TAG"
            title="Flat object. Inferred types."
            body="Pass strings, numbers, booleans. The type system infers cardinality and surfaces the right filter widget — autocomplete, range, toggle."
          >
            <TagViz />
          </Column>
          <Column
            n="02"
            label="SLICE"
            title="Any combination. No upfront index."
            body="Combine tier × region × persona without warning. Every dashboard view re-slices in <300ms across the 28K active dimensions."
          >
            <SliceViz />
          </Column>
          <Column
            n="03"
            label="AUDIT"
            title="Joinable with your bill."
            body="Stream tagged traces to BigQuery. attrs land flat as columns — joinable to your invoicing tables, ready for finance."
          >
            <AuditViz />
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

/* ── ① TAG — inferred types per attr ────────────────────────────────────── */

const INFERRED = [
  { name: 'user_id', type: 'string',  card: '~28k unique', widget: 'autocomplete' },
  { name: 'tier',    type: 'enum<3>', card: 'pro|team|free', widget: 'toggle' },
  { name: 'region',  type: 'string',  card: '~24 unique',  widget: 'autocomplete' },
  { name: 'spend',   type: 'number',  card: '0.001 – 1.4', widget: 'range' },
  { name: 'tagged',  type: 'boolean', card: 'true|false',  widget: 'toggle' },
];

function TagViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-1.5 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px] mb-1">
        <span>inferred</span>
        <span className="text-spark normal-case tracking-normal">~30s after first call</span>
      </div>
      {INFERRED.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, x: -3 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.1 + i * 0.06 }}
          className="grid grid-cols-[80px_60px_1fr_72px] gap-2 items-center px-2 py-1 bg-surface border border-rule2 rounded"
        >
          <span className="text-ink2">{f.name}</span>
          <span className="text-highlight text-[9.5px] uppercase tracking-eyebrow">{f.type}</span>
          <span className="text-ink3 text-[9.5px] truncate">{f.card}</span>
          <span className="text-spark text-[9px] uppercase tracking-eyebrow text-right">{f.widget}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── ② SLICE — combine attrs, watch cost re-distribute ──────────────────── */

const SLICE_COMBOS = [
  { label: 'tier=pro · region=eu',                width: 38,  cost: '$612' },
  { label: 'tier=pro · region=us',                width: 64,  cost: '$1.04k' },
  { label: 'tier=team · region=eu',               width: 22,  cost: '$348' },
  { label: 'tier=team · region=us · persona=cre', width: 18,  cost: '$284' },
];

function SliceViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-2 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px] mb-1">
        <span>cost · sliced</span>
        <span className="text-spark normal-case tracking-normal">re-slices · &lt;300ms</span>
      </div>
      {SLICE_COMBOS.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
          className="flex items-center gap-2"
        >
          <span className="text-ink2 truncate w-[160px] text-[9.5px]">{c.label}</span>
          <div className="flex-1 h-2 bg-surface2 rounded-sm overflow-hidden">
            <motion.span
              className="block h-full rounded-sm bg-spark"
              initial={{ width: 0 }}
              whileInView={{ width: `${c.width}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="text-spark tabular-nums w-12 text-right">{c.cost}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── ③ AUDIT — sample row schema joinable with billing ──────────────────── */

function AuditViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10.5px]">
      <div className="text-ink3 uppercase tracking-eyebrow text-[9px]">
        bigquery row · joinable with stripe.charges
      </div>
      <div className="bg-surface border border-rule2 rounded p-2.5 flex flex-col gap-0.5">
        <Field name="trace_id"    value='"wf_8f2a"'        />
        <Field name="user_id"     value='"u_241"'           />
        <Field name="tier"        value='"pro"'             tone="spark" />
        <Field name="region"      value='"eu"'              />
        <Field name="cost_usd"    value='0.155'             tone="spark" />
        <Field name="ms"          value='7920'              />
        <Field name="started_at"  value='"2026-01-12 09:..."' />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="text-success text-[10px] flex items-center gap-1.5"
      >
        <span aria-hidden>✓</span>
        <span>SQL JOIN stripe.charges USING (user_id) ✓</span>
      </motion.div>
    </div>
  );
}

function Field({
  name,
  value,
  tone,
}: {
  name: string;
  value: string;
  tone?: 'spark';
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-ink2 w-[80px]">{name}</span>
      <span className={tone === 'spark' ? 'text-spark' : 'text-ink'}>{value}</span>
    </div>
  );
}
