'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   ABHowTo — "30 seconds to ship a sticky A/B" section.

     ① Define experiment   — one block on each.run()
     ② Read the dashboard  — significance, sample size, sticky cohort
     ③ Auto-promote        — winner ships itself when confidence holds
────────────────────────────────────────────────────────────────────────── */

const SCOPES = [
  { key: 'model',     title: 'model swap',    body: 'kling-v3 vs kling-v2 — same prompt, different generator.' },
  { key: 'workflow',  title: 'workflow swap', body: 'product-photo-v3 vs v3.3 — A/B the whole graph.' },
  { key: 'enhancer',  title: 'enhancer on/off', body: 'measure the lift from the rescue layer itself.' },
  { key: 'param',     title: 'parameter tweak', body: 'aspect_ratio = 16:9 vs 9:16 — micro-tunes.' },
];

export function ABHowTo() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● HOW TO USE IT · 30 SECONDS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        One block. Sticky cohorts. Auto-promote.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Add an <Code>experiment</Code> block to your <Code>each.run()</Code> call.
        The platform handles assignment, significance, and the rollout — you watch
        the dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        <Step n="01" title="Define the experiment" delay={0}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Pick an <Code>id</Code>, a split, and a <Code>cohort</Code> (usually
            user_id) so the same user always sees the same variant.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('await '), v('each.run('), o('{')] },
              { indent: 2, tokens: [p('model: '), s('"kling-v3-12v"'), o(',')] },
              { indent: 2, tokens: [p('experiment: '), o('{')] },
              { indent: 4, tokens: [p('id: '), s('"kling-v3-vs-v2"'), o(',')] },
              {
                indent: 4,
                tokens: [
                  p('split: '),
                  o('{ '),
                  s('"kling-v3"'),
                  o(': '),
                  s('50'),
                  o(', '),
                  s('"kling-v2"'),
                  o(': '),
                  s('50'),
                  o(' },'),
                ],
                highlight: true,
              },
              { indent: 4, tokens: [p('cohort: '), p('user.id'), o(',')] },
              { indent: 4, tokens: [p('auto_promote_at: '), s('0.95'), o(',')] },
              { indent: 2, tokens: [o('},')] },
              { tokens: [v('})')] },
            ]}
          />
          <div className="flex flex-col gap-1.5 mt-1">
            {SCOPES.map((s) => (
              <ScopePill key={s.key} title={s.title} body={s.body} />
            ))}
          </div>
        </Step>

        <Step n="02" title="Read the dashboard" delay={0.1}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            The dashboard shows live calls per variant, quality (your defined
            metric), p-value, and remaining sample size to reach significance.
          </p>
          <div className="bg-bg border border-rule2 rounded-md p-3 flex flex-col gap-2 font-mono text-[11px]">
            <DashRow label="kling-v3" value="5238 calls · q=91" tone="spark" />
            <DashRow label="kling-v2" value="5219 calls · q=82" tone="ink"   />
            <div className="flex items-center justify-between border-t border-rule2 pt-1.5 mt-1">
              <span className="text-ink3 uppercase tracking-eyebrow text-[9px]">significance</span>
              <span className="text-success">p &lt; 0.05 ✓</span>
            </div>
          </div>
          <Bullet text="Sticky cohorts mean the same user always gets the same variant — until you promote." />
        </Step>

        <Step n="03" title="Auto-promote" delay={0.2}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Set <Code>auto_promote_at</Code> and the winner ships itself when
            confidence holds. No redeploy, no rebuild — just a config flip.
          </p>
          <CodeMini
            lines={[
              { tokens: [c('// when p < 0.05 AND quality_lift > 0:')] },
              { tokens: [c('//   experiment.status → "promoted"')] },
              { tokens: [c('//   "kling-v3" → 100% traffic')], highlight: true },
              { tokens: [c('//   sticky cohorts kept until next experiment')] },
            ]}
          />
          <div className="flex flex-col gap-1.5 mt-1">
            <Bullet text="Auto-rollback on quality regression or error spike." />
            <Bullet text="Manual promote button in the dashboard if you want a human gate." />
            <Bullet text="Bayesian and frequentist modes — pick your stats team's flavor." />
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

function ScopePill({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-baseline gap-2 px-3 py-2 border border-rule2 rounded-md bg-bg">
      <span className="font-mono text-[11px] text-spark whitespace-nowrap">{title}</span>
      <span className="text-ink2 text-[12px] leading-[1.5]">{body}</span>
    </div>
  );
}

function DashRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'spark' | 'ink';
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={tone === 'spark' ? 'text-spark' : 'text-ink2'}>{label}</span>
      <span className="text-ink2 text-[10.5px]">{value}</span>
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
const c = (text: string): Token => ({ text, cls: 'text-ink3 italic' });
const v = (text: string): Token => ({ text, cls: 'text-ink' });
