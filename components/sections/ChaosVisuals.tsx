'use client';

import { motion } from 'framer-motion';
import type { VisualKey } from '@/lib/problems';

/* ──────────────────────────────────────────────────────────────────────────
   Common shell + primitives
────────────────────────────────────────────────────────────────────────── */

const SHELL =
  'bg-bg border border-rule2 rounded-md min-h-[300px] p-5 md:p-6 flex flex-col justify-center overflow-hidden relative';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
      {children}
    </div>
  );
}

function StatusPill({
  text,
  tone,
  pulse,
}: {
  text: string;
  tone: 'ok' | 'fail' | 'warn' | 'muted';
  pulse?: boolean;
}) {
  const cls = {
    ok:    'border-success/60 text-success bg-success/10',
    fail:  'border-fail/60 text-fail bg-fail/10',
    warn:  'border-yellow/60 text-yellow bg-yellow/10',
    muted: 'border-rule2 text-ink3 bg-bg',
  }[tone];
  return (
    <span
      className={`inline-flex items-center font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-md whitespace-nowrap ${cls} ${
        pulse ? 'animate-pulse' : ''
      }`}
    >
      {text}
    </span>
  );
}

function Cursor() {
  return (
    <motion.span
      className="inline-block w-1.5 h-3 bg-spark align-middle ml-0.5"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.0, repeat: Infinity }}
      aria-hidden
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   1. Fallback, HTTP packet hits primary, fails, deflects to fallback.
────────────────────────────────────────────────────────────────────────── */

function FallbackVisual() {
  return (
    <div className={SHELL}>
      <Eyebrow>POST /v1/run · request flow</Eyebrow>

      <div className="mt-4 flex flex-col gap-3 font-mono text-[12px]">
        {/* Primary endpoint */}
        <Endpoint
          name="kling-v3-12v"
          role="primary"
          statuses={[
            { t: 0,    code: '200', tone: 'ok' },
            { t: 1.6,  code: '503', tone: 'fail' },
            { t: 2.6,  code: '503', tone: 'fail' },
            { t: 3.6,  code: '200', tone: 'ok' },
          ]}
          packetActive={[true, false, false, true]}
        />

        {/* Down arrow */}
        <motion.div
          className="self-start ml-3 text-spark text-[14px] -my-1"
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 4, times: [0, 0.4, 0.5, 0.85, 1], repeat: Infinity }}
        >
          ↳ failover
        </motion.div>

        {/* Fallback endpoint */}
        <Endpoint
          name="wan-2.7"
          role="fallback"
          statuses={[
            { t: 0,    code: '-',   tone: 'muted' },
            { t: 1.6,  code: '-',   tone: 'muted' },
            { t: 2.6,  code: '200', tone: 'ok' },
            { t: 3.6,  code: '-',   tone: 'muted' },
          ]}
          packetActive={[false, false, true, false]}
        />
      </div>

      <div className="mt-4 font-mono text-[10px] text-ink3">
        <Cursor /> recovered in 124ms · user latency unchanged
      </div>
    </div>
  );
}

function Endpoint({
  name,
  role,
  statuses,
  packetActive,
}: {
  name: string;
  role: string;
  statuses: { t: number; code: string; tone: 'ok' | 'fail' | 'muted' }[];
  packetActive: boolean[];
}) {
  // For animation, take just the second-state (the "interesting" one) for the badge.
  const badgeTone = statuses[1].tone;
  const badgeCode = statuses[1].code;

  const codeKeyframes = statuses.map((s) => s.code);
  const toneColors = statuses.map((s) =>
    s.tone === 'ok' ? 'rgb(var(--c-success))'
    : s.tone === 'fail' ? 'rgb(var(--c-fail))'
    : 'rgb(var(--c-ink3))'
  );

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-surface border border-rule2 rounded-md">
      <span className="text-ink3 text-[10px] uppercase tracking-eyebrow w-16 shrink-0">{role}</span>
      <span className="text-ink flex-1 truncate">{name}</span>

      {/* Packet trail */}
      <div className="relative w-24 h-4 hidden sm:block">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-spark"
            initial={{ left: '0%', opacity: 0 }}
            animate={{
              left: ['0%', '100%'],
              opacity: packetActive.map((on) => (on ? 1 : 0)),
            }}
            transition={{
              left: { duration: 1.4, delay: i * 0.18, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 4, times: [0, 0.4, 0.6, 0.85], repeat: Infinity },
            }}
          />
        ))}
      </div>

      {/* Status badge */}
      <motion.span
        className="inline-flex items-center font-mono text-[10px] uppercase tracking-eyebrow px-2 py-0.5 border rounded-md whitespace-nowrap"
        animate={{ color: toneColors, borderColor: toneColors }}
        transition={{ duration: 4, times: [0, 0.4, 0.65, 1], repeat: Infinity }}
      >
        <motion.span
          animate={{ opacity: [1, 1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <CodeText keyframes={codeKeyframes} />
        </motion.span>
      </motion.span>
    </div>
  );
}

function CodeText({ keyframes }: { keyframes: string[] }) {
  // Each state holds visible for ~hold of the cycle, then fades out FAST (~swap),
  // a brief dark gap, then the next state fades in. Eliminates the long
  // crossfade where two HTTP codes (e.g. 200 / 503) would sit on top of each
  // other and look like an overlap bug.
  const N = keyframes.length;
  const swap = 0.025;       // 100ms at 4s cycle, the fade itself
  const gap  = 0.015;       //  60ms invisible window between states
  const slot = 1 / N;       // each state owns 1/N of the cycle

  // 4 timing markers per state: hold-end, swap-end, gap-end, prep-for-next
  // We build 4 keyframes per state, giving a clean on→off step pattern.
  const times: number[] = [];
  for (let i = 0; i < N; i++) {
    const base = i * slot;
    times.push(base);                          // state i visible (on)
    times.push(base + slot - swap - gap);      // state i still on, fade about to start
    times.push(base + slot - gap);             // state i off, in dark gap
    times.push(base + slot);                   // dark gap ends, next state begins
  }

  return (
    <span className="relative inline-block min-w-[26px] text-center">
      {keyframes.map((code, i) => (
        <motion.span
          key={i}
          className="absolute inset-0"
          animate={{
            opacity: keyframes.flatMap((_, j) =>
              j === i ? [1, 1, 0, 0] : [0, 0, 0, 0]
            ),
          }}
          transition={{ duration: 4, times, repeat: Infinity, ease: 'linear' }}
        >
          {code}
        </motion.span>
      ))}
      <span className="invisible">{keyframes[0]}</span>
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   2. Latency, live histogram, threshold breach, failover.
────────────────────────────────────────────────────────────────────────── */

function LatencyVisual() {
  // Two streams of bar heights (in % of viewport): A spikes mid-cycle, B stays low.
  const A = [22, 28, 24, 38, 56, 88, 92, 78, 64, 48];
  const B = [20, 18, 22, 20, 24, 22, 20, 26, 22, 20];

  return (
    <div className={SHELL}>
      <div className="flex items-center justify-between">
        <Eyebrow>p95 / 30s window</Eyebrow>
        <span className="font-mono text-[10px] text-spark">threshold: 800ms</span>
      </div>

      {/* Provider A */}
      <Histogram
        label="provider A"
        bars={A}
        threshold={70}
        breachKeyframes={[false, false, true, true]}
        valueKeyframes={['540ms', '720ms', '1.42s', '610ms']}
      />

      {/* Provider B (active after failover) */}
      <Histogram
        label="provider B"
        bars={B}
        threshold={70}
        breachKeyframes={[false, false, false, false]}
        valueKeyframes={['-', '-', '540ms', '540ms']}
        secondary
      />

      <div className="font-mono text-[10px] text-ink3 mt-3">
        <Cursor /> auto-spilled at 18:42:11
      </div>
    </div>
  );
}

function Histogram({
  label,
  bars,
  threshold,
  breachKeyframes,
  valueKeyframes,
  secondary,
}: {
  label: string;
  bars: number[];
  threshold: number;
  breachKeyframes: boolean[];
  valueKeyframes: string[];
  secondary?: boolean;
}) {
  const colors = breachKeyframes.map((b) =>
    b ? 'rgb(var(--c-fail))' : 'rgb(var(--c-success))',
  );
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1.5 font-mono text-[10px]">
        <span className="text-ink2">{label}</span>
        <motion.span
          className="text-ink"
          animate={{ color: colors }}
          transition={{ duration: 4, times: [0, 0.4, 0.65, 1], repeat: Infinity }}
        >
          <span className="relative inline-block min-w-[40px] text-right">
            {valueKeyframes.map((v, i) => (
              <motion.span
                key={i}
                className="absolute inset-0 text-right"
                animate={{ opacity: valueKeyframes.map((_, j) => (j === i ? 1 : 0)) }}
                transition={{ duration: 4, times: [0, 0.4, 0.65, 0.95], repeat: Infinity }}
              >
                {v}
              </motion.span>
            ))}
            <span className="invisible">{valueKeyframes[0]}</span>
          </span>
        </motion.span>
      </div>
      <div className="relative h-12 flex items-end gap-1">
        {/* threshold line */}
        <span
          className="absolute left-0 right-0 border-t border-dashed border-spark/40"
          style={{ top: `${100 - threshold}%` }}
        />
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 rounded-sm"
            style={{ minWidth: 0 }}
            initial={{ height: '0%' }}
            animate={{
              height: `${h}%`,
              backgroundColor: secondary
                ? colors.map(() => 'rgb(var(--c-success))')
                : colors,
              opacity: secondary
                ? [0.2, 0.2, 1, 1]
                : breachKeyframes.map((b) => (b ? 0.85 : 0.7)),
            }}
            transition={{
              height: { duration: 0.5, delay: i * 0.04 },
              backgroundColor: { duration: 4, times: [0, 0.4, 0.65, 1], repeat: Infinity },
              opacity: { duration: 4, times: [0, 0.4, 0.65, 1], repeat: Infinity },
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3. A/B, live experiment dashboard, calls + quality + winner badge.
────────────────────────────────────────────────────────────────────────── */

function ABVisual() {
  return (
    <div className={SHELL}>
      <div className="flex items-center justify-between">
        <Eyebrow>experiment: kling-v3-vs-v2</Eyebrow>
        <motion.span
          className="font-mono text-[10px] text-success"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1] }}
          transition={{ duration: 3, times: [0, 0.6, 0.7, 1], repeat: Infinity, repeatDelay: 1 }}
        >
          ✓ p &lt; 0.05
        </motion.span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-6 font-mono text-[12px]">
        <ABColumn label="kling-v3" calls={5238} quality={91} winner />
        <ABColumn label="kling-v2" calls={5219} quality={82} />
      </div>
    </div>
  );
}

function ABColumn({
  label,
  calls,
  quality,
  winner,
}: {
  label: string;
  calls: number;
  quality: number;
  winner?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={winner ? 'text-spark' : 'text-ink2'}>{label}</span>
        {winner && (
          <motion.span
            className="text-success text-[14px] leading-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            aria-hidden
          >
            ✓
          </motion.span>
        )}
      </div>
      {/* Calls counter */}
      <div className="text-[16px] text-ink tabular-nums">
        <Counter to={calls} duration={1.4} />
        <span className="text-ink3 text-[10px] ml-1">calls</span>
      </div>
      {/* Quality bar */}
      <div className="h-2 bg-surface2 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${winner ? 'bg-spark' : 'bg-ink2/40'} rounded-full`}
          initial={{ width: '0%' }}
          animate={{ width: `${quality}%` }}
          transition={{ duration: 1.2, delay: winner ? 0.1 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="flex items-baseline justify-between text-[10px]">
        <span className="text-ink3">quality</span>
        <span className={winner ? 'text-spark' : 'text-ink2'}>{quality}%</span>
      </div>
    </div>
  );
}

function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  // Lightweight count-up using motion timeline. We render to.toLocaleString() at end -
  // for a richer effect, useMotionValue + useTransform; but keep this fast & simple.
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration * 0.5 }}
    >
      {to.toLocaleString()}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   4. Attribution, JSON object types in line by line.
────────────────────────────────────────────────────────────────────────── */

function AttributionVisual() {
  const lines = [
    { key: 'trace_id',  value: '"4d2a91"',     baseDelay: 0.1 },
    { key: 'user_id',   value: '"u_8f2a"',     baseDelay: 0.4 },
    { key: 'tier',      value: '"pro"',        baseDelay: 0.7 },
    { key: 'persona',   value: '"creator"',    baseDelay: 1.0 },
    { key: 'tagged',    value: 'true',         baseDelay: 1.3 },
  ];
  return (
    <div className={SHELL}>
      <Eyebrow>attributes · runtime tagging</Eyebrow>

      <div className="mt-4 font-mono text-[12px] leading-[1.85]">
        <div className="text-ink3">{'{'}</div>
        {lines.map((line) => (
          <motion.div
            key={line.key}
            className="flex items-baseline gap-2 pl-4"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.baseDelay, duration: 0.35, ease: 'easeOut' }}
          >
            <span className="text-ink2">{`"${line.key}"`}</span>
            <span className="text-ink3">:</span>
            <span className="text-spark">{line.value}</span>
            <span className="text-ink3">,</span>
          </motion.div>
        ))}
        <div className="text-ink3">{'}'}</div>
      </div>

      <motion.div
        className="mt-4 font-mono text-[10px] text-success flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        ✓ tagged · sliceable from the dashboard
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   5. Slicing, SQL query → result rows fade in, bars animate.
────────────────────────────────────────────────────────────────────────── */

function SlicingVisual() {
  const rows = [
    { tier: 'pro',  cost: '$0.18', calls: '1.2M', width: 90 },
    { tier: 'team', cost: '$0.21', calls: '0.4M', width: 100 },
    { tier: 'free', cost: '$0.04', calls: '2.7M', width: 22 },
  ];
  return (
    <div className={SHELL}>
      <Eyebrow>cost_by("tier") · 24h</Eyebrow>

      <div className="mt-3 font-mono text-[11px]">
        <div className="text-ink2">
          <span className="text-spark">SELECT</span> tier, $/call, calls
        </div>
        <div className="text-ink2">
          <span className="text-spark">FROM</span> traces <span className="text-ink3">--</span> n=4.3M
        </div>
      </div>

      <div className="mt-3 border-t border-rule2 pt-3 flex flex-col gap-2 font-mono text-[11px]">
        {/* Header */}
        <div className="grid grid-cols-[60px_1fr_60px_50px] gap-3 text-ink3 uppercase tracking-eyebrow text-[9px]">
          <span>tier</span>
          <span>distribution</span>
          <span className="text-right">$/call</span>
          <span className="text-right">calls</span>
        </div>
        {rows.map((r, i) => (
          <motion.div
            key={r.tier}
            className="grid grid-cols-[60px_1fr_60px_50px] gap-3 items-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.18 }}
          >
            <span className="text-ink">{r.tier}</span>
            <div className="h-3 bg-surface2 rounded-sm overflow-hidden">
              <motion.div
                className="h-full bg-spark/80 rounded-sm"
                initial={{ width: 0 }}
                animate={{ width: `${r.width}%` }}
                transition={{ duration: 1.0, delay: 0.4 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-spark text-right">{r.cost}</span>
            <span className="text-ink3 text-right">{r.calls}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 font-mono text-[10px] text-ink3">
        <Cursor /> screenshot → slack
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   6. Pipeline, workflow with packet flowing across nodes; step 3 fails+retries.
────────────────────────────────────────────────────────────────────────── */

function PipelineVisual() {
  const steps = [
    { name: 'enhance',  model: 'gpt-4o',     time: '1.2s', failsAt: false },
    { name: 'generate', model: 'kling-v3',   time: '4.8s', failsAt: false },
    { name: 'voice',    model: 'eleven-v3',  time: '↻ 0.8s',  failsAt: true  },
    { name: 'compose',  model: 'mux',        time: '0.6s', failsAt: false },
  ];
  return (
    <div className={SHELL}>
      <Eyebrow>workflow("product-vibez") · run</Eyebrow>

      <div className="mt-5 space-y-2 font-mono text-[11px]">
        {steps.map((s, i) => (
          <PipelineStep key={s.name} idx={i + 1} step={s} />
        ))}
      </div>

      <div className="mt-3 font-mono text-[10px] text-ink3 flex items-center gap-2">
        <span className="text-success">✓</span> total: 7.4s · resumed from cache · no double-bill
      </div>
    </div>
  );
}

function PipelineStep({
  idx,
  step,
}: {
  idx: number;
  step: { name: string; model: string; time: string; failsAt: boolean };
}) {
  const baseDelay = (idx - 1) * 0.5;
  const colors = step.failsAt
    ? [
        'rgb(var(--c-rule2))',     // pending
        'rgb(var(--c-fail))',      // fail
        'rgb(var(--c-yellow))',    // retry
        'rgb(var(--c-success))',   // ok
      ]
    : [
        'rgb(var(--c-rule2))',
        'rgb(var(--c-success))',
        'rgb(var(--c-success))',
        'rgb(var(--c-success))',
      ];
  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 bg-surface border rounded-md"
      initial={{ borderColor: 'rgb(var(--c-rule2))' }}
      animate={{ borderColor: colors }}
      transition={{ duration: 4, times: [0, baseDelay / 4, (baseDelay + 0.5) / 4, 1], repeat: Infinity }}
    >
      <motion.span
        className="w-6 h-6 rounded-full border flex items-center justify-center font-semibold"
        animate={{
          borderColor: colors,
          color: colors,
        }}
        transition={{ duration: 4, times: [0, baseDelay / 4, (baseDelay + 0.5) / 4, 1], repeat: Infinity }}
      >
        {step.failsAt ? (
          <motion.span
            animate={{ rotate: [0, 0, 0, 360] }}
            transition={{ duration: 4, times: [0, 0.5, 0.6, 0.7], repeat: Infinity }}
          >
            ↻
          </motion.span>
        ) : (
          idx
        )}
      </motion.span>
      <span className="text-ink flex-1">{step.name}</span>
      <span className="text-ink3 hidden sm:inline">{step.model}</span>
      <span className="text-ink2 tabular-nums w-14 text-right">{step.time}</span>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   7. Swap, model name cycles through several. Same call, different model.
────────────────────────────────────────────────────────────────────────── */

function SwapVisual() {
  const models = [
    { name: 'kling-v3-12v', tag: 'VIDEO',   tone: 'border-highlight text-highlight' },
    { name: 'veo-3',        tag: 'VIDEO',   tone: 'border-highlight text-highlight' },
    { name: 'flux-pro',     tag: 'IMAGE',   tone: 'border-emerald-500 text-emerald-400' },
    { name: 'eleven-v3',    tag: 'AUDIO',   tone: 'border-yellow text-yellow' },
  ];
  return (
    <div className={SHELL}>
      <Eyebrow>each.run("…", input)</Eyebrow>

      <div className="mt-5 bg-surface border border-rule2 rounded-md px-4 py-4 font-mono text-[14px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-ink3">each.run(</span>
          <span className="relative inline-block min-w-[160px] h-[22px]">
            {models.map((m, i) => (
              <motion.span
                key={m.name}
                className="absolute inset-0 text-spark whitespace-nowrap"
                animate={{
                  opacity: models.map((_, j) => (j === i ? 1 : 0)),
                  y:       models.map((_, j) => (j === i ? 0 : -8)),
                }}
                transition={{
                  duration: 4,
                  times: [0, 0.25, 0.5, 0.75],
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                "{m.name}"
              </motion.span>
            ))}
          </span>
          <span className="text-ink3">, input</span>
          <span className="text-ink3">)</span>
        </div>
      </div>

      {/* Active modality pills */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {models.map((m, i) => (
          <motion.div
            key={i}
            className={`px-2 py-1.5 rounded-md border text-[10px] uppercase tracking-eyebrow text-center ${m.tone}`}
            animate={{
              opacity: models.map((_, j) => (j === i ? 1 : 0.25)),
            }}
            transition={{ duration: 4, times: [0, 0.25, 0.5, 0.75], repeat: Infinity }}
          >
            {m.tag}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 font-mono text-[10px] text-ink3 text-center">
        600+ models · 4 modalities · same call signature
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   8. Rollback, git-style commit graph; HEAD jumps from v3.2 back to v3.1.
────────────────────────────────────────────────────────────────────────── */

function RollbackVisual() {
  const commits = [
    { v: 'v3.2', msg: 'tweak voice prompt',   tone: 'fail' as const, headAt: [false, true,  false, false] },
    { v: 'v3.1', msg: 'last known good',      tone: 'ok'   as const, headAt: [true,  false, true,  true]  },
    { v: 'v3.0', msg: 'initial workflow',     tone: 'muted' as const, headAt: [false, false, false, false] },
  ];

  return (
    <div className={SHELL}>
      <Eyebrow>$ workflow log · product-vibez</Eyebrow>

      <div className="mt-4 font-mono text-[11.5px] flex flex-col gap-3">
        {commits.map((c, i) => (
          <CommitRow key={c.v} commit={c} idx={i} />
        ))}
      </div>

      <motion.div
        className="mt-4 font-mono text-[11px] flex items-center gap-2 text-success"
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.5, 0.65, 1], repeat: Infinity }}
      >
        ✓ HEAD → v3.1 · no rebuild · no redeploy
      </motion.div>
    </div>
  );
}

function CommitRow({
  commit,
  idx,
}: {
  commit: { v: string; msg: string; tone: 'fail' | 'ok' | 'muted'; headAt: boolean[] };
  idx: number;
}) {
  const dotColor = commit.tone === 'fail'
    ? 'rgb(var(--c-fail))'
    : commit.tone === 'ok'
      ? 'rgb(var(--c-success))'
      : 'rgb(var(--c-ink3))';

  return (
    <div className="flex items-start gap-3">
      {/* Track + dot */}
      <div className="relative w-3 flex flex-col items-center">
        {idx !== 0 && <span className="absolute -top-3 bottom-1/2 w-px bg-rule2 left-1/2" />}
        {idx !== 2 && <span className="absolute top-1/2 -bottom-3 w-px bg-rule2 left-1/2" />}
        <span
          className="w-2.5 h-2.5 rounded-full border-2 mt-1.5"
          style={{
            borderColor: dotColor,
            backgroundColor: 'rgb(var(--c-bg))',
          }}
        />
      </div>

      {/* Commit body */}
      <div className="flex-1 flex items-baseline gap-2 flex-wrap">
        <span className="text-ink font-semibold tabular-nums">{commit.v}</span>
        <motion.span
          className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 border rounded"
          animate={{
            opacity: commit.headAt.map((on) => (on ? 1 : 0)),
            borderColor: commit.tone === 'fail'
              ? 'rgb(var(--c-fail))'
              : 'rgb(var(--c-spark))',
            color: commit.tone === 'fail'
              ? 'rgb(var(--c-fail))'
              : 'rgb(var(--c-spark))',
          }}
          transition={{ duration: 4, times: [0, 0.4, 0.6, 1], repeat: Infinity }}
        >
          HEAD
        </motion.span>
        <span className="text-ink2">{commit.msg}</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Public API: pick visual by key.
────────────────────────────────────────────────────────────────────────── */

export function ChaosVisual({ visual }: { visual: VisualKey }) {
  switch (visual) {
    case 'fallback':    return <FallbackVisual />;
    case 'latency':     return <LatencyVisual />;
    case 'ab':          return <ABVisual />;
    case 'attribution': return <AttributionVisual />;
    case 'slicing':     return <SlicingVisual />;
    case 'pipeline':    return <PipelineVisual />;
    case 'swap':        return <SwapVisual />;
    case 'rollback':    return <RollbackVisual />;
  }
}
