'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   WorkflowsAnatomy, 3-column "anatomy of a workflow" section.

   Each column tells one beat of the story:
     ① GRAPH     , what a workflow IS: typed nodes wired by reference
     ② EXECUTION , how it RUNS: sequential + parallel, with a live gantt
     ③ VERSIONING, how you SHIP: pin v3.2, deploy v3.3, rollback in one string
────────────────────────────────────────────────────────────────────────── */

export function WorkflowsAnatomy() {
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
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● ANATOMY OF A WORKFLOW
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          A graph. An execution. A version.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Workflows aren’t scripts. They’re typed graphs with versioned execution.
          The runtime handles parallelism, retries, and traces; you describe what
          chains together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          <Column
            n="01"
            label="GRAPH"
            title="Typed nodes. Wired by reference."
            body="Every node has typed inputs and outputs. Edges are references like 'enhance.out', typo-checked at define time."
          >
            <GraphViz />
          </Column>

          <Column
            n="02"
            label="EXECUTION"
            title="Sequential + parallel. Traced as one."
            body="Independent branches run concurrently. Dependents wait. Every step lands in one trace with cost and latency per node."
          >
            <ExecutionViz />
          </Column>

          <Column
            n="03"
            label="VERSIONING"
            title="Pin a version. Roll back in one string."
            body="v3.2 in prod, v3.3 in staging, v2.4 archived. Promote, rollback, A/B, change one string, no redeploy."
          >
            <VersioningViz />
          </Column>
        </div>
      </div>
    </section>
  );
}

/* ── Column shell ───────────────────────────────────────────────────────── */

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

/* ── ① GRAPH, small typed-graph schematic with reference lines ─────────── */

const GRAPH_NODES = [
  { id: 'enhance', x: 50,  y: 28, label: 'enhance', kind: 'util' as const,  out: 'string' },
  { id: 'image',   x: 50,  y: 80, label: 'image',   kind: 'model' as const, out: 'url' },
  { id: 'video',   x: 50,  y: 132, label: 'video',  kind: 'model' as const, out: 'url' },
];

function GraphViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 font-mono text-[10.5px]">
      <div className="text-ink3 uppercase tracking-eyebrow text-[9px] mb-3">
        graph: {'{'}
      </div>
      <div className="flex flex-col gap-2 ml-2">
        {GRAPH_NODES.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
            className="flex items-baseline gap-2 px-2 py-1.5 bg-surface border border-rule2 rounded"
          >
            <span className="text-spark">{n.id}</span>
            <span className="text-ink3">:</span>
            <span className="text-ink3">{'{'}</span>
            <span className="text-ink2">kind:</span>
            <KindPill kind={n.kind} />
            <span className="text-ink3">,</span>
            <span className="text-ink2">in:</span>
            {i === 0 ? (
              <span className="text-spark">"inputs.prompt"</span>
            ) : (
              <span className="text-spark">"enhance.out"</span>
            )}
            <span className="text-ink3">{'}'}</span>
          </motion.div>
        ))}
      </div>
      <div className="text-ink3 mt-2">{'}'}</div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.55 }}
        className="mt-3 flex items-center gap-1.5 text-success text-[10px]"
      >
        <span>✓</span>
        <span>typed · diffable · 0 typos at runtime</span>
      </motion.div>
    </div>
  );
}

function KindPill({ kind }: { kind: 'util' | 'model' | 'io' }) {
  const cls =
    kind === 'model'
      ? 'border-spark/55 text-spark'
      : kind === 'util'
      ? 'border-highlight/55 text-highlight'
      : 'border-rule2 text-ink3';
  return (
    <span
      className={`inline-flex items-center font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 border rounded ${cls}`}
    >
      "{kind}"
    </span>
  );
}

/* ── ② EXECUTION, gantt-style timeline showing parallel runs ───────────── */

const GANTT_STEPS = [
  { name: 'enhance', start: 0,    end: 12,  tone: 'spark'   as const },
  { name: 'image',   start: 12,   end: 42,  tone: 'spark'   as const },
  { name: 'video',   start: 12,   end: 50,  tone: 'spark'   as const },
  { name: 'audio',   start: 12,   end: 30,  tone: 'spark'   as const },
  { name: 'merge',   start: 50,   end: 56,  tone: 'highlight' as const },
];

function ExecutionViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px] mb-3">
        <span>execution timeline</span>
        <span className="text-spark normal-case tracking-normal">parallel · 6.2s total</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {GANTT_STEPS.map((s, i) => (
          <GanttRow key={s.name} step={s} delay={0.15 + i * 0.08} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-px bg-rule2 border border-rule2 rounded overflow-hidden">
        <Stat label="Σ cost"   value="$0.175" tone="spark" />
        <Stat label="parallel" value="3"      tone="highlight" />
        <Stat label="trace"    value="1"      tone="success" />
      </div>
    </div>
  );
}

function GanttRow({
  step,
  delay,
}: {
  step: { name: string; start: number; end: number; tone: 'spark' | 'highlight' };
  delay: number;
}) {
  const left = step.start;
  const width = step.end - step.start;
  const cls =
    step.tone === 'spark'
      ? 'bg-spark'
      : 'bg-highlight';
  return (
    <div className="flex items-center gap-2">
      <span className="text-ink2 w-[58px] truncate">{step.name}</span>
      <div className="relative flex-1 h-2.5 bg-surface2 rounded-sm overflow-hidden">
        <motion.span
          className={`absolute top-0 h-full rounded-sm ${cls}`}
          style={{ left: `${left}%` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${width}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-ink3 tabular-nums w-12 text-right">{(step.end - step.start) * 0.1 + 0.4}s</span>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'spark' | 'highlight' | 'success';
}) {
  const cls =
    tone === 'spark' ? 'text-spark'
    : tone === 'highlight' ? 'text-highlight'
    : 'text-success';
  return (
    <div className="bg-surface px-2 py-2 text-center">
      <div className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">{label}</div>
      <div className={`font-display text-[13px] font-semibold tabular-nums mt-0.5 ${cls}`}>
        {value}
      </div>
    </div>
  );
}

/* ── ③ VERSIONING, three pinned versions with HEAD pointer ─────────────── */

const VERSIONS = [
  { v: 'v3.3', tag: 'staging', message: 'try eleven-v4 for audio',     tone: 'highlight' as const },
  { v: 'v3.2', tag: 'prod',    message: 'parallel image+video+audio',  tone: 'spark'     as const },
  { v: 'v2.4', tag: 'archived', message: 'sequential video pipeline',  tone: 'muted'     as const },
];

function VersioningViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px] mb-3">
        <span>$ workflow log · product-photo</span>
        <span className="text-spark normal-case tracking-normal">3 versions</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {VERSIONS.map((v, i) => (
          <VersionRow key={v.v} v={v} idx={i} delay={0.1 + i * 0.1} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.45 }}
        className="mt-3 flex items-center gap-1.5 text-success text-[10px]"
      >
        <span>✓</span>
        <span>each.run({'{'} version: <span className="text-spark">"v3.2"</span> {'}'}) · no redeploy</span>
      </motion.div>
    </div>
  );
}

function VersionRow({
  v,
  idx,
  delay,
}: {
  v: { v: string; tag: string; message: string; tone: 'spark' | 'highlight' | 'muted' };
  idx: number;
  delay: number;
}) {
  const dotColor =
    v.tone === 'spark' ? 'rgb(var(--c-spark))'
    : v.tone === 'highlight' ? 'rgb(var(--c-highlight))'
    : 'rgb(var(--c-ink3))';

  const tagCls =
    v.tone === 'spark'
      ? 'border-spark/55 text-spark bg-spark/8'
      : v.tone === 'highlight'
      ? 'border-highlight/55 text-highlight bg-highlight/8'
      : 'border-rule2 text-ink3';

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex items-start gap-2.5"
    >
      <div className="relative w-3 flex flex-col items-center pt-1">
        {idx !== 0 && <span className="absolute -top-3 bottom-1/2 w-px bg-rule2 left-1/2" />}
        {idx !== VERSIONS.length - 1 && <span className="absolute top-1/2 -bottom-3 w-px bg-rule2 left-1/2" />}
        <span
          className="w-2 h-2 rounded-full border-2 mt-0.5"
          style={{
            borderColor: dotColor,
            backgroundColor: 'rgb(var(--c-bg))',
          }}
        />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-ink font-semibold tabular-nums">{v.v}</span>
          <span
            className={`font-mono text-[8.5px] uppercase tracking-eyebrow px-1 py-[1px] border rounded ${tagCls}`}
          >
            {v.tag}
          </span>
        </div>
        <span className="text-ink2 text-[10.5px]">{v.message}</span>
      </div>
    </motion.div>
  );
}
