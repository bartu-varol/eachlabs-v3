'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   RouterHowTo — "30 seconds to integrate" section.

   Three horizontal steps, each with a tiny code snippet. Sequential reveal
   on scroll. The goal: a visitor who scanned the hero already understands
   what router does — this section closes the loop on HOW to actually wire
   it up in their code.

     ① Set the chain        — primary + fallback list
     ② Pick a strategy      — errors-only · latency-aware · quality-aware
     ③ Read the trace       — see what fired, sticky on the cohort
────────────────────────────────────────────────────────────────────────── */

const STRATEGIES = [
  {
    key: 'errors-only',
    title: 'errors-only',
    body: 'Spill on 5xx and timeouts. Cheapest. Use for low-stakes endpoints.',
  },
  {
    key: 'latency-aware',
    title: 'latency-aware',
    body: 'Spill on p95 breaches AND errors. Set per-provider thresholds.',
  },
  {
    key: 'quality-aware',
    title: 'quality-aware',
    body: 'Adds output drift detection. Catches "200 OK but garbage" cases.',
    recommended: true,
  },
];

export function RouterHowTo() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● HOW TO USE IT · 30 SECONDS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Three lines. One trace. No retry loops to maintain.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Add a fallback chain to your existing call. Pick a strategy. Read the
        trace to see what fired. That’s it — the router does the chaos handling.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        {/* Step 1 — Set the chain */}
        <Step n="01" title="Set the chain" delay={0}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Pass <Code>fallback</Code> as an ordered list. Router tries them in
            order on failure.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('await '), v('each.run('), o('{')] },
              { indent: 2, tokens: [p('model: '), s('"kling-v3-12v"'), o(',')] },
              { indent: 2, tokens: [p('inputs: '), o('{ prompt }'), o(',')] },
              { indent: 2, tokens: [p('router: '), o('{')] },
              {
                indent: 4,
                tokens: [
                  p('fallback: '),
                  o('['),
                  s('"wan-2.7"'),
                  o(', '),
                  s('"veo-3"'),
                  o('],'),
                ],
                highlight: true,
              },
              { indent: 2, tokens: [o('}')] },
              { tokens: [v('})')] },
            ]}
          />
        </Step>

        {/* Step 2 — Pick a strategy */}
        <Step n="02" title="Pick a strategy" delay={0.1}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Three modes. Default is <Code>quality-aware</Code> — the only one
            that catches the "200 OK but bad" cases.
          </p>
          <div className="flex flex-col gap-2 mt-3">
            {STRATEGIES.map(({ key, ...rest }) => (
              <StrategyPill key={key} {...rest} />
            ))}
          </div>
        </Step>

        {/* Step 3 — Read the trace */}
        <Step n="03" title="Read the trace" delay={0.2}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Every <Code>each.run()</Code> emits a trace with the router’s
            decision and reason. Cohort stays sticky to the new provider.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('const '), p('trace '), o('= '), v('result.trace')] },
              { tokens: [c('// trace.router_decision:')] },
              {
                indent: 2,
                tokens: [c('// {')],
              },
              {
                indent: 4,
                tokens: [c('//   primary:  "kling-v3-12v",')],
              },
              {
                indent: 4,
                tokens: [c('//   fallback: "wan-2.7",')],
                highlight: true,
              },
              {
                indent: 4,
                tokens: [c('//   reason:   "p95_breach",')],
              },
              {
                indent: 4,
                tokens: [c('//   spilled_in_ms: 38')],
              },
              { indent: 2, tokens: [c('// }')] },
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

// Token helpers (k=keyword, p=property, s=string, o=operator/plain, c=comment, v=variable)
const k = (text: string): Token => ({ text, cls: 'text-highlight font-medium' });
const p = (text: string): Token => ({ text, cls: 'text-ink2' });
const s = (text: string): Token => ({ text, cls: 'text-spark' });
const o = (text: string): Token => ({ text, cls: 'text-ink2' });
const c = (text: string): Token => ({ text, cls: 'text-ink3 italic' });
const v = (text: string): Token => ({ text, cls: 'text-ink' });

/* ── Strategy pill ──────────────────────────────────────────────────────── */

function StrategyPill({
  title,
  body,
  recommended,
}: {
  title: string;
  body: string;
  recommended?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-3 py-2.5 border rounded-md ${
        recommended ? 'border-spark/40 bg-spark/[0.04]' : 'border-rule2 bg-bg'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-[11px] ${
            recommended ? 'text-spark' : 'text-ink'
          }`}
        >
          {title}
        </span>
        {recommended && (
          <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark border border-spark/40 rounded px-1 py-[1px]">
            default
          </span>
        )}
      </div>
      <p className="text-ink2 text-[12px] leading-[1.5]">{body}</p>
    </div>
  );
}
