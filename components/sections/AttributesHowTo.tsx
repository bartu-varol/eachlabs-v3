'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   AttributesHowTo — "30 seconds to start tagging" section.

     ① Pass attrs        — flat object on each.run(); add what you want
     ② Slice the data    — filter the live feed by any combination
     ③ Drill or export   — jump to a trace, or stream to your warehouse
────────────────────────────────────────────────────────────────────────── */

const COMMON_ATTRS = [
  { key: 'user_id',  body: 'Per-user economics, churn signals, support drilldowns.' },
  { key: 'tier',     body: 'Free vs pro vs team — sliceable cost per cohort.' },
  { key: 'persona',  body: 'Creator vs viewer vs admin — segmenting by behavior.' },
  { key: 'region',   body: 'Geographic cost breakdown, latency by edge.' },
  { key: 'exp',      body: 'Experiment cohort tag — combines with A/B testing.' },
];

export function AttributesHowTo() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● HOW TO USE IT · 30 SECONDS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Pass an object. Slice forever. No schema.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Attributes are a flat tag bag on every <Code>each.run()</Code> call. They
        become live filter dimensions in the dashboard within ~30 seconds — no
        column to migrate, no schema to maintain.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        <Step n="01" title="Pass attrs" delay={0}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            One <Code>attrs</Code> object on each.run(). Strings, numbers,
            booleans. Add anything you might want to slice by later.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('await '), v('each.run('), o('{')] },
              { indent: 2, tokens: [p('workflow: '), s('"product-photo-v3"'), o(',')] },
              { indent: 2, tokens: [p('attrs: '), o('{')] },
              { indent: 4, tokens: [p('user_id: '), p('user.id'), o(',')] },
              { indent: 4, tokens: [p('tier: '), p('user.tier'), o(',')], highlight: true },
              { indent: 4, tokens: [p('exp: '), p('flags.bucket'), o(',')] },
              { indent: 2, tokens: [o('},')] },
              { tokens: [v('})')] },
            ]}
          />
          <Bullet text="Unlimited keys per call. Schema-free." />
          <Bullet text="<3ms overhead vs untagged calls." />
        </Step>

        <Step n="02" title="Slice the data" delay={0.1}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Every attr you tag becomes a filter dimension in the dashboard.
            Combine them however — cost / latency / quality re-slice live.
          </p>
          <div className="bg-bg border border-rule2 rounded-md p-3 font-mono text-[11px] flex flex-col gap-1.5">
            <div className="text-ink3">
              <span className="text-spark">SELECT</span> tier, $/call, calls
            </div>
            <div className="text-ink3">
              <span className="text-spark">FROM</span> traces
            </div>
            <div className="text-ink3">
              <span className="text-spark">WHERE</span>{' '}
              <span className="text-ink">tier =</span>{' '}
              <span className="text-spark">"pro"</span>{' '}
              <span className="text-spark">AND</span>{' '}
              <span className="text-ink">region =</span>{' '}
              <span className="text-spark">"eu"</span>
            </div>
          </div>
          <Bullet text="Combine any attrs — no upfront index." />
          <Bullet text="Live cost feed re-slices as you click." />
        </Step>

        <Step n="03" title="Drill or export" delay={0.2}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Click a row to jump to its trace. Or stream the whole stream to
            your warehouse — attrs land flat as columns.
          </p>
          <CodeMini
            lines={[
              { tokens: [v('each.export('), o('{')] },
              { indent: 2, tokens: [p('destination: '), s('"bigquery://analytics.traces"'), o(',')], highlight: true },
              { indent: 2, tokens: [p('schedule:    '), s('"hourly"'), o(',')] },
              { tokens: [v('})')] },
            ]}
          />
          <div className="flex flex-col gap-1.5 mt-1">
            {COMMON_ATTRS.map((a) => (
              <AttrPill key={a.key} title={a.key} body={a.body} />
            ))}
          </div>
        </Step>
      </div>
    </section>
  );
}

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
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">STEP</span>
      </div>
      <h3 className="font-display font-semibold text-[20px] text-ink leading-snug">{title}</h3>
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

function AttrPill({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-baseline gap-2 px-3 py-2 border border-rule2 rounded-md bg-bg">
      <span className="font-mono text-[11px] text-spark whitespace-nowrap">{title}</span>
      <span className="text-ink2 text-[12px] leading-[1.5]">{body}</span>
    </div>
  );
}

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
            <span className="text-ink3/60 mr-3 select-none tabular-nums w-3 text-right">{i + 1}</span>
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
const v = (text: string): Token => ({ text, cls: 'text-ink' });
