'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   EnhancerAnatomy — 3-column "anatomy of a rescue" section.

     ① DETECT   — pre-check intercepts the refusal before it ships
     ② REWRITE  — small LLM swaps risky tokens, never the meaning
     ③ DELIVER  — output ships; every actor in the chain gets paid
────────────────────────────────────────────────────────────────────────── */

export function EnhancerAnatomy() {
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
          ● ANATOMY OF A RESCUE
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Detect. Rewrite. Deliver.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          The whole rescue happens inside one each.run() call — under 180ms — and
          your user sees no error, no retry prompt, no "I can’t generate that".
          Just the output they came for.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          <Column
            n="01"
            label="DETECT"
            title="Catch the refusal before it lands."
            body="A pre-check runs the prompt against the target model's policy table. If it would refuse, the call never reaches the model — the rescuer takes over."
          >
            <DetectViz />
          </Column>

          <Column
            n="02"
            label="REWRITE"
            title="Swap the risky tokens. Keep the meaning."
            body="A small LLM trained on rejection patterns swaps the offending tokens for safe equivalents — preserving intent, modality, and style cues."
          >
            <RewriteViz />
          </Column>

          <Column
            n="03"
            label="DELIVER"
            title="Output ships. Everyone gets paid."
            body="The rewritten prompt re-passes the policy and runs through the model. Your user gets their output. You bill them. We bill you."
          >
            <DeliverViz />
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

/* ── ① DETECT — refusal stamp + intercept indicator ─────────────────────── */

function DetectViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10.5px]">
      <div className="text-ink3 uppercase tracking-eyebrow text-[9px]">
        without enhancer
      </div>
      <FlowRow
        label="prompt"
        arrow="→"
        result="✗ REFUSED"
        resultTone="fail"
        sub="user sees error · no output · no payment"
      />
      <div className="text-ink3 uppercase tracking-eyebrow text-[9px] mt-2">
        with enhancer
      </div>
      <FlowRow
        label="prompt"
        arrow="→"
        result="◐ INTERCEPTED"
        resultTone="spark"
        sub="model never sees the original"
      />

      {/* Tiny stat row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="grid grid-cols-2 gap-px bg-rule2 border border-rule2 rounded overflow-hidden mt-1"
      >
        <Stat label="latency added" value="+38ms" tone="spark" />
        <Stat label="user sees" value="0 errors" tone="success" />
      </motion.div>
    </div>
  );
}

function FlowRow({
  label,
  arrow,
  result,
  resultTone,
  sub,
}: {
  label: string;
  arrow: string;
  result: string;
  resultTone: 'spark' | 'fail' | 'success';
  sub: string;
}) {
  const tone =
    resultTone === 'spark' ? 'text-spark border-spark/55 bg-spark/8'
    : resultTone === 'fail' ? 'text-fail border-fail/55 bg-fail/10'
    : 'text-success border-success/55 bg-success/8';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-ink2 px-2 py-1 bg-surface border border-rule2 rounded text-[10px]">
          {label}
        </span>
        <span className="text-ink3">{arrow}</span>
        <span
          className={`font-mono text-[10px] uppercase tracking-eyebrow px-2 py-1 border rounded ${tone}`}
        >
          {result}
        </span>
      </div>
      <span className="text-ink3 text-[10px] pl-1">{sub}</span>
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
  tone: 'spark' | 'success';
}) {
  const cls = tone === 'spark' ? 'text-spark' : 'text-success';
  return (
    <div className="bg-surface px-2 py-2 text-center">
      <div className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">
        {label}
      </div>
      <div className={`font-display text-[13px] font-semibold tabular-nums mt-0.5 ${cls}`}>
        {value}
      </div>
    </div>
  );
}

/* ── ② REWRITE — token swap viz ─────────────────────────────────────────── */

const SWAPS = [
  { from: '"Iron Man"',         to: '"armored superhero in red and gold"' },
  { from: '"Tom Cruise"',       to: '"a man with chiseled features"'        },
  { from: '"looks like Coke"',  to: '"red and white branded"'                 },
  { from: '"battle with gore"', to: '"battle with dynamic action"'            },
];

function RewriteViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-2.5 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>token swaps</span>
        <span className="text-spark normal-case tracking-normal">intent · preserved</span>
      </div>
      {SWAPS.map((s, i) => (
        <SwapRow key={s.from} from={s.from} to={s.to} delay={0.15 + i * 0.08} />
      ))}
    </div>
  );
}

function SwapRow({ from, to, delay }: { from: string; to: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex flex-col gap-1 px-2 py-1.5 bg-surface border border-rule2 rounded"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-fail line-through decoration-fail/50">{from}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-spark" aria-hidden>↳</span>
        <span className="text-spark">{to}</span>
      </div>
    </motion.div>
  );
}

/* ── ③ DELIVER — value chain bars ───────────────────────────────────────── */

const ACTORS = [
  { who: 'user',        sub: 'got the output' },
  { who: 'your app',    sub: 'billed the user' },
  { who: 'each::labs',  sub: 'billed your app' },
];

function DeliverViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10.5px]">
      <div className="text-ink3 uppercase tracking-eyebrow text-[9px]">
        the chain after a rescue
      </div>
      <div className="flex flex-col gap-2">
        {ACTORS.map((a, i) => (
          <ActorRow key={a.who} who={a.who} sub={a.sub} delay={0.2 + i * 0.12} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="text-success text-[10px] flex items-center gap-1.5 mt-1"
      >
        <span>✓</span>
        <span>without enhancer · all three of these would be zero</span>
      </motion.div>
    </div>
  );
}

function ActorRow({
  who,
  sub,
  delay,
}: {
  who: string;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-2.5 px-2 py-1.5 bg-surface border border-spark/30 rounded"
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark" aria-hidden />
      <span className="text-ink w-[68px] text-[10.5px]">{who}</span>
      <span className="text-ink3" aria-hidden>·</span>
      <span className="text-success flex items-center gap-1 text-[10px]">
        <span aria-hidden>✓</span>
        <span>{sub}</span>
      </span>
    </motion.div>
  );
}
