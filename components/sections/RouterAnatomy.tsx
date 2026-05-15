'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   RouterAnatomy, 3-column "failover anatomy" section.

   Each column tells one beat of the story:
     ① TRIGGER  , three signals the router watches (latency / errors / quality)
     ② DECISION , router scores 3 candidates, picks the winner
     ③ OUTCOME  , trace shows what fired; pages: 0; users: unaffected

   Cards animate in on viewport. Inner mini-diagrams have their own loops.
────────────────────────────────────────────────────────────────────────── */

export function RouterAnatomy() {
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
          ● ANATOMY OF A FAILOVER
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Three signals. One decision. Zero pages.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          The router doesn’t just retry on 5xx. It watches latency, error rate, and
          output quality on every call, and reroutes the moment any of them slips,
          before pagerduty notices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          <Column
            n="01"
            label="TRIGGER"
            title="Three signals, watched live."
            body="Latency p95 breach. 5xx error spike. Output quality drift. Any one pulls the trigger."
          >
            <SignalsViz />
          </Column>

          <Column
            n="02"
            label="DECISION"
            title="Score every candidate. Pick the best."
            body="The router scores each fallback by recent health, latency, and quality. Highest score wins. Decision in <40ms."
          >
            <DecisionViz />
          </Column>

          <Column
            n="03"
            label="OUTCOME"
            title="Trace logs the swap. Users see nothing."
            body="The decision and reason land in the trace. Sticky cohorts keep the user on the new provider until conditions change."
          >
            <OutcomeViz />
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

/* ── ① TRIGGER, three signal meters ────────────────────────────────────── */

function SignalsViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10px]">
      <SignalMeter
        name="latency p95"
        threshold="800ms"
        peakValue="1.42s"
        baselineValue="640ms"
        bars={[18, 22, 24, 28, 36, 58, 78, 92, 86, 70]}
        breachAt={5}
      />
      <SignalMeter
        name="error rate"
        threshold="2%"
        peakValue="4.7%"
        baselineValue="0.3%"
        bars={[6, 8, 6, 8, 10, 14, 36, 64, 58, 40]}
        breachAt={6}
      />
      <SignalMeter
        name="quality drift"
        threshold="-3σ"
        peakValue="-4.1σ"
        baselineValue="-0.2σ"
        bars={[14, 18, 16, 18, 20, 22, 38, 54, 70, 58]}
        breachAt={7}
      />
    </div>
  );
}

function SignalMeter({
  name,
  threshold,
  peakValue,
  baselineValue,
  bars,
  breachAt,
}: {
  name: string;
  threshold: string;
  peakValue: string;
  baselineValue: string;
  bars: number[];
  breachAt: number;
}) {
  // Cycle: 0-60% baseline value (ok) · 60-95% peak value (breach) · 95-100% baseline.
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-ink2">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-ink3">th: {threshold}</span>
          <motion.span
            className="tabular-nums w-[50px] text-right"
            animate={{
              color: [
                'rgb(var(--c-success))',
                'rgb(var(--c-success))',
                'rgb(var(--c-fail))',
                'rgb(var(--c-success))',
              ],
            }}
            transition={{ duration: 4, times: [0, 0.6, 0.7, 0.95], repeat: Infinity }}
          >
            <span className="relative inline-block">
              {[baselineValue, peakValue, baselineValue].map((v, i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 text-right"
                  animate={{
                    opacity: i === 0 ? [1, 1, 0, 0, 1] : i === 1 ? [0, 0, 1, 1, 0] : [0, 0, 0, 0, 0],
                  }}
                  transition={{ duration: 4, times: [0, 0.55, 0.65, 0.9, 1], repeat: Infinity }}
                >
                  {v}
                </motion.span>
              ))}
              <span className="invisible">{peakValue}</span>
            </span>
          </motion.span>
        </div>
      </div>
      <div className="relative h-7 flex items-end gap-[2px]">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-sm"
            style={{ minWidth: 0 }}
            animate={{
              height: `${h}%`,
              backgroundColor:
                i >= breachAt
                  ? [
                      'rgb(var(--c-success) / 0.55)',
                      'rgb(var(--c-success) / 0.55)',
                      'rgb(var(--c-fail))',
                      'rgb(var(--c-success) / 0.55)',
                    ]
                  : 'rgb(var(--c-success) / 0.55)',
            }}
            transition={{
              height: { duration: 0.4, delay: i * 0.04 },
              backgroundColor: { duration: 4, times: [0, 0.55, 0.7, 0.95], repeat: Infinity },
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── ② DECISION, three candidate scores with winner reveal ─────────────── */

function DecisionViz() {
  const candidates = [
    { name: 'kling-v3', score: 0.31, isLoser: true,  isWinner: false },
    { name: 'wan-2.7',  score: 0.94, isLoser: false, isWinner: true  },
    { name: 'veo-3',    score: 0.78, isLoser: false, isWinner: false },
  ];

  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-2.5 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>scoring 3 candidates</span>
        <motion.span
          className="text-spark"
          animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
          transition={{ duration: 4, times: [0, 0.4, 0.55, 0.85, 0.9, 1], repeat: Infinity }}
        >
          decision · 38ms
        </motion.span>
      </div>
      {candidates.map((c, i) => (
        <CandidateRow key={c.name} c={c} delay={0.3 + i * 0.12} />
      ))}
      <motion.div
        className="mt-1 font-mono text-[10px] text-success flex items-center gap-1.5"
        animate={{ opacity: [0, 0, 0, 1, 1, 0] }}
        transition={{ duration: 4, times: [0, 0.4, 0.6, 0.7, 0.95, 1], repeat: Infinity }}
      >
        <span>✓</span>
        <span>winner: wan-2.7 · routing to it</span>
      </motion.div>
    </div>
  );
}

function CandidateRow({
  c,
  delay,
}: {
  c: { name: string; score: number; isLoser: boolean; isWinner: boolean };
  delay: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`w-[68px] truncate ${
          c.isWinner ? 'text-spark' : c.isLoser ? 'text-fail' : 'text-ink2'
        }`}
      >
        {c.name}
      </span>
      <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            c.isWinner ? 'bg-spark' : c.isLoser ? 'bg-fail/70' : 'bg-ink2/40'
          }`}
          initial={{ width: 0 }}
          whileInView={{ width: `${c.score * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span
        className={`tabular-nums w-8 text-right ${
          c.isWinner ? 'text-spark' : c.isLoser ? 'text-fail' : 'text-ink3'
        }`}
      >
        {c.score.toFixed(2)}
      </span>
    </div>
  );
}

/* ── ③ OUTCOME, trace card + counters ──────────────────────────────────── */

function OutcomeViz() {
  return (
    <div className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3 font-mono text-[10.5px]">
      <div className="flex items-center justify-between text-ink3 uppercase tracking-eyebrow text-[9px]">
        <span>trace · req_8f2a</span>
        <span className="text-success">✓ served</span>
      </div>
      {/* Trace lines */}
      <div className="flex flex-col gap-1.5">
        <TraceLine
          step="primary"
          model="kling-v3-12v"
          status="fail"
          ms="1422"
        />
        <TraceLine
          step="router"
          model="scoring"
          status="ok"
          ms="38"
        />
        <TraceLine
          step="fallback"
          model="wan-2.7"
          status="ok"
          ms="1180"
        />
      </div>
    </div>
  );
}

function TraceLine({
  step,
  model,
  status,
  ms,
}: {
  step: string;
  model: string;
  status: 'ok' | 'fail';
  ms: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          status === 'ok' ? 'bg-success' : 'bg-fail'
        }`}
        aria-hidden
      />
      <span className="text-ink3 w-[54px]">{step}</span>
      <span className={`flex-1 truncate ${status === 'fail' ? 'text-fail' : 'text-ink'}`}>
        {model}
      </span>
      <span className="text-ink2 tabular-nums">{ms}ms</span>
    </motion.div>
  );
}

