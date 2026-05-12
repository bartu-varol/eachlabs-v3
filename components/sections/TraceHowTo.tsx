'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   TraceHowTo — "30 seconds to read a trace" section.

     ① Get the trace_id     — every result includes one
     ② Inspect the steps    — typed step list with cost + latency + ok
     ③ Stream to warehouse  — BigQuery / Snowflake / S3 with attribute filter
────────────────────────────────────────────────────────────────────────── */

const DESTINATIONS = [
  { key: 'bq',  title: 'BigQuery',  body: 'Daily, hourly, or per-call. Native partitioning by date.' },
  { key: 'sf',  title: 'Snowflake', body: 'Pipe over a stage; arrives as Snowpipe-ingestable JSON.' },
  { key: 's3',  title: 'S3',        body: 'Newline-delimited JSON; lands in your bucket on schedule.' },
];

export function TraceHowTo() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● HOW TO USE IT · 30 SECONDS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Every call has a trace. Read it. Export it.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Traces are on by default — you don’t opt in. Every <Code>each.run()</Code>
        result carries a <Code>trace_id</Code> you can fetch, filter, or stream to
        your warehouse on a schedule.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        {/* Step 1 */}
        <Step n="01" title="Get the trace_id" delay={0}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Every <Code>each.run()</Code> result returns a <Code>trace_id</Code>.
            Save it next to your user/session record for direct lookup later.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('const '), p('result '), o('= '), k('await '), v('each.run('), o('{...})')] },
              { tokens: [v('result.trace_id')], highlight: true },
              { tokens: [c('// → "wf_8f2a-241b-…"')] },
            ]}
          />
          <Bullet text="One trace per request, no matter how many models run inside." />
          <Bullet text="<3ms overhead even for a 10-step workflow." />
        </Step>

        {/* Step 2 */}
        <Step n="02" title="Inspect the steps" delay={0.1}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Fetch the trace by id. Each step has its model, version, status, cost,
            and latency. Failures land here too with their error logs.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('const '), p('t '), o('= '), k('await '), v('each.traces.get('), p('id'), o(')')] },
              { tokens: [c('// t.steps = [')] },
              { indent: 2, tokens: [c('//   { step: "enhance",  cost: 0.001, ms:  820, ok: true  },')] },
              { indent: 2, tokens: [c('//   { step: "primary",  cost: 0.000, ms: 4500, ok: false },')], highlight: true },
              { indent: 2, tokens: [c('//   { step: "fallback", cost: 0.140, ms: 1180, ok: true  },')] },
              { tokens: [c('// ]')] },
              { tokens: [c('// t.totals = { cost: 0.155, ms: 7920, fallbacks: 1 }')] },
            ]}
          />
        </Step>

        {/* Step 3 */}
        <Step n="03" title="Stream to your warehouse" delay={0.2}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            One config call. Filter by attributes. Pick a schedule. The traces land
            with their attrs flat — joinable with your billing tables.
          </p>
          <CodeMini
            lines={[
              { tokens: [v('each.traces.export('), o('{')] },
              { indent: 2, tokens: [p('destination: '), s('"bigquery://analytics.traces"'), o(',')], highlight: true },
              { indent: 2, tokens: [p('filter:      '), s('"tier = \'pro\'"'), o(',')] },
              { indent: 2, tokens: [p('schedule:    '), s('"hourly"'), o(',')] },
              { tokens: [v('})')] },
            ]}
          />
          <div className="flex flex-col gap-1.5 mt-1">
            {DESTINATIONS.map((d) => (
              <DestinationPill key={d.key} title={d.title} body={d.body} />
            ))}
          </div>
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
      <span className="text-spark mt-[2px]" aria-hidden>›</span>
      <span className="text-ink2 text-[12.5px] leading-[1.55]">{text}</span>
    </div>
  );
}

function DestinationPill({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-baseline gap-2 px-3 py-2 border border-rule2 rounded-md bg-bg">
      <span className="font-mono text-[11px] text-spark whitespace-nowrap">{title}</span>
      <span className="text-ink2 text-[12px] leading-[1.5]">{body}</span>
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
              <span key={j} className={t.cls}>{t.text}</span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const k = (text: string): Token => ({ text, cls: 'text-highlight font-medium' });
const p = (text: string): Token => ({ text, cls: 'text-ink2' });
const s = (text: string): Token => ({ text, cls: 'text-spark' });
const o = (text: string): Token => ({ text, cls: 'text-ink2' });
const c = (text: string): Token => ({ text, cls: 'text-ink3 italic' });
const v = (text: string): Token => ({ text, cls: 'text-ink' });
