'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   WorkflowsHowTo — "30 seconds to ship your first pipeline" section.

   Three steps:
     ① Define the graph        — typed inputs, model nodes, edges as references
     ② Trigger from anywhere    — one each.run() call from anywhere in your code
     ③ Inspect the trace        — every step traced, costed, and rollbackable
────────────────────────────────────────────────────────────────────────── */

const NODE_TYPES = [
  { key: 'model', title: 'model',  body: 'Calls any of the 600+ models with typed inputs/outputs.' },
  { key: 'util',  title: 'util',   body: 'Built-in: enhance, moderate, upscale, compose, narrate.' },
  { key: 'io',    title: 'io',     body: 'Reads/writes the workflow’s inputs and final output.' },
];

export function WorkflowsHowTo() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● HOW TO USE IT · 30 SECONDS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Define a graph. Run it from anywhere. Read the trace.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Workflows live in code — typed, diffable, versioned. Define once and call
        from any backend. The platform handles parallelism, retries, fallbacks,
        and the trace.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        {/* Step 1 — Define */}
        <Step n="01" title="Define the graph" delay={0}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Each node has an <Code>id</Code>, a <Code>kind</Code>, and an
            optional reference to another node’s output via{' '}
            <Code>"node.out"</Code>.
          </p>
          <CodeMini
            lines={[
              { tokens: [v('each.workflows.'), v('define'), o('({')] },
              { indent: 2, tokens: [p('id: '), s('"product-photo-v3"'), o(',')] },
              { indent: 2, tokens: [p('inputs: '), o('{ '), p('prompt: '), s('"string"'), o(' },')] },
              { indent: 2, tokens: [p('graph: '), o('{')] },
              {
                indent: 4,
                tokens: [
                  p('enhance: '),
                  o('{ '),
                  p('kind: '),
                  s('"util"'),
                  o(', '),
                  p('model: '),
                  s('"gpt-4o"'),
                  o(' },'),
                ],
              },
              {
                indent: 4,
                tokens: [
                  p('image: '),
                  o('{ '),
                  p('kind: '),
                  s('"image"'),
                  o(', '),
                  p('input: '),
                  s('"enhance.out"'),
                  o(' },'),
                ],
                highlight: true,
              },
              { indent: 2, tokens: [o('},')] },
              { tokens: [v('})')] },
            ]}
          />
          {/* Node-type legend */}
          <div className="flex flex-col gap-1.5 mt-1">
            {NODE_TYPES.map((nt) => (
              <div
                key={nt.key}
                className="flex items-baseline gap-2 px-2 py-1 border border-rule2 rounded bg-bg"
              >
                <span className="font-mono text-[11px] text-spark">{nt.title}</span>
                <span className="text-ink2 text-[12px] leading-[1.5]">{nt.body}</span>
              </div>
            ))}
          </div>
        </Step>

        {/* Step 2 — Trigger */}
        <Step n="02" title="Trigger from anywhere" delay={0.1}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            One <Code>each.run()</Code> call. Inputs are typed. Output is the
            final node’s value. Fallbacks and parallelism happen server-side.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('const '), p('result '), o('= '), k('await '), v('each.run('), o('{')] },
              { indent: 2, tokens: [p('workflow: '), s('"product-photo-v3"'), o(',')], highlight: true },
              { indent: 2, tokens: [p('inputs: '), o('{ '), p('prompt: '), p('user.prompt'), o(' },')] },
              { indent: 2, tokens: [p('attrs: '), o('{ '), p('user_id: '), p('user.id'), o(' },')] },
              { tokens: [v('})')] },
              { tokens: [c('// → result.image, result.video, result.audio')] },
            ]}
          />
          <div className="flex flex-col gap-1.5 mt-1">
            <Bullet text="Sync (await) or async (webhook on completion)." />
            <Bullet text="Bulk-trigger up to 10 workflows in one call." />
            <Bullet text="Same call works server-side, edge, or in a job queue." />
          </div>
        </Step>

        {/* Step 3 — Inspect */}
        <Step n="03" title="Read the trace" delay={0.2}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Every run returns a <Code>trace_id</Code>. The trace shows every
            step, cost, latency, and which version of the workflow ran.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('const '), p('t '), o('= '), k('await '), v('each.traces.get'), o('('), p('result.trace_id'), o(')')] },
              { tokens: [c('// t.steps:')] },
              { indent: 2, tokens: [c('// [')] },
              {
                indent: 4,
                tokens: [c('//   { step: "enhance", cost: 0.001, ms:  820, ok: true },')],
              },
              {
                indent: 4,
                tokens: [c('//   { step: "image",   cost: 0.020, ms: 2140, ok: true },')],
                highlight: true,
              },
              {
                indent: 4,
                tokens: [c('//   { step: "video",   cost: 0.140, ms: 2680, ok: true },')],
              },
              {
                indent: 4,
                tokens: [c('//   { step: "audio",   cost: 0.014, ms: 1180, ok: true },')],
              },
              { indent: 2, tokens: [c('// ]')] },
              { tokens: [c('// t.totals = { cost: 0.175, ms: 6240, version: "v3.2" }')] },
            ]}
          />
        </Step>
      </div>
    </section>
  );
}

/* ── Step shell ─────────────────────────────────────────────────────────── */

function Step({
  n,
  title,
  delay,
  children,
}: {
  n: string;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.36, delay }}
      className="bg-surface p-6 md:p-7 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums text-spark">{n}</span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          STEP
        </span>
      </div>
      <h3 className="font-display font-semibold text-[20px] text-ink leading-snug">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

/* ── Inline <code> for prose ────────────────────────────────────────────── */

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[12.5px] text-spark bg-bg/60 border border-rule2 rounded px-1 py-[1px]">
      {children}
    </code>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 px-2 py-1">
      <span className="text-spark mt-[2px]" aria-hidden>
        ›
      </span>
      <span className="text-ink2 text-[12.5px] leading-[1.55]">{text}</span>
    </div>
  );
}

/* ── Mini code block ────────────────────────────────────────────────────── */

type Token = { text: string; cls: string };
type Line = { tokens: Token[]; indent?: number; highlight?: boolean };

function CodeMini({ lines }: { lines: Line[] }) {
  return (
    <div className="bg-bg border border-rule2 rounded-md font-mono text-[11.5px] leading-[1.7] overflow-x-auto no-scrollbar">
      <div className="px-3 py-3">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.22, delay: 0.05 * i }}
            className={`flex items-baseline gap-0 whitespace-pre ${
              line.highlight ? 'bg-spark/[0.06] -mx-3 px-3 rounded-sm' : ''
            }`}
          >
            <span className="text-ink3/60 mr-3 select-none tabular-nums w-3 text-right">
              {i + 1}
            </span>
            {line.indent ? <span>{' '.repeat(line.indent)}</span> : null}
            {line.tokens.map((t, j) => (
              <span key={j} className={t.cls}>
                {t.text}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Token helpers
const k = (text: string): Token => ({ text, cls: 'text-highlight font-medium' });
const p = (text: string): Token => ({ text, cls: 'text-ink2' });
const s = (text: string): Token => ({ text, cls: 'text-spark' });
const o = (text: string): Token => ({ text, cls: 'text-ink2' });
const c = (text: string): Token => ({ text, cls: 'text-ink3 italic' });
const v = (text: string): Token => ({ text, cls: 'text-ink' });
