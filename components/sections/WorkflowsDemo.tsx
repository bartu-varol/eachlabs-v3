'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   WorkflowsDemo — vertical card-stack execution.

   Visual: a real production graph executing live, top-to-bottom.

     01  INPUT
     02  enhance · gpt-4o
     03  parallel: image · video · audio  (3 sub-cards side-by-side)
     04  merge · compose
     05  OUTPUT — trace + cost summary

   Each row lights up in sequence. Parallel row shows the 3 branches
   running concurrently, all greening at once. A subtle progress rail on the
   left tracks current position. ~7.4s loop, looping cleanly forever.
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'input' | 'enhance' | 'parallel' | 'merge' | 'output' | 'done';

const TIMINGS: Record<Phase, number> = {
  idle: 350,
  input: 700,
  enhance: 1000,
  parallel: 1900,
  merge: 800,
  output: 700,
  done: 1900,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

type StepId = 'input' | 'enhance' | 'parallel' | 'merge' | 'output';

const PHASE_TO_STEP: Record<Phase, number> = {
  idle: -1, input: 0, enhance: 1, parallel: 2, merge: 3, output: 4, done: 4,
};
const STEP_INDEX: Record<StepId, number> = {
  input: 0, enhance: 1, parallel: 2, merge: 3, output: 4,
};

type Status = 'idle' | 'queued' | 'running' | 'done';

function stepStatus(step: StepId, phase: Phase): Status {
  if (phase === 'idle') return 'idle';
  const i = PHASE_TO_STEP[phase];
  const me = STEP_INDEX[step];
  if (me < i) return 'done';
  if (me === i) return 'running';
  return 'queued';
}

/* ── Branch sub-card (image/video/audio) ─────────────────────────────────── */

function BranchCard({
  label,
  model,
  status,
  delay,
  ms,
}: {
  label: string;
  model: string;
  status: Status;
  delay: number;
  ms: number;
}) {
  const running = status === 'running';
  const done = status === 'done';

  const border =
    running ? 'border-spark' : done ? 'border-success/55' : 'border-rule2';
  const tone =
    running ? 'text-spark' : done ? 'text-success' : 'text-ink3';

  return (
    <motion.div
      animate={{
        scale: running ? 1.03 : 1,
        boxShadow: running
          ? '0 0 0 1px rgb(var(--c-spark) / 0.3), 0 0 14px rgb(var(--c-spark) / 0.28)'
          : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className={`relative flex-1 min-w-0 bg-bg/60 border ${border} rounded-md px-3 py-2.5 transition-colors duration-200`}
    >
      <div className={`font-mono text-[10px] uppercase tracking-eyebrow ${tone}`}>
        {label}
      </div>
      <div className="font-mono text-[11px] text-ink2 mt-1 truncate">{model}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-[10px] text-ink3 tabular-nums">
          {done || running ? `${(ms / 1000).toFixed(1)}s` : '—'}
        </span>
        <StatusBadge status={status} delay={delay} small />
      </div>
    </motion.div>
  );
}

/* ── Video branch with live kling-v3 → wan-2.7 fallback ──────────────────── */

type VideoSub = 'pending' | 'kling-run' | 'kling-fail' | 'wan-run' | 'wan-done';

function FallbackBranchCard({
  status,
  delay,
}: {
  status: Status;
  delay: number;
}) {
  const [sub, setSub] = useState<VideoSub>('pending');

  useEffect(() => {
    if (status === 'idle' || status === 'queued') {
      setSub('pending');
      return;
    }
    if (status === 'done') {
      setSub('wan-done');
      return;
    }
    // status === 'running' — start kling, fail mid-run, fall back to wan
    setSub('kling-run');
    const t1 = setTimeout(() => setSub('kling-fail'), 650);
    const t2 = setTimeout(() => setSub('wan-run'), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [status]);

  const failing = sub === 'kling-fail';
  const onFallback = sub === 'wan-run' || sub === 'wan-done';
  const running = sub === 'kling-run' || sub === 'wan-run';
  const done = sub === 'wan-done';
  const model: 'kling-v3' | 'wan-2.7' =
    sub === 'wan-run' || sub === 'wan-done' ? 'wan-2.7' : 'kling-v3';

  const border = failing
    ? 'border-fail'
    : running
      ? 'border-spark'
      : done
        ? 'border-success/55'
        : 'border-rule2';
  const labelTone = failing
    ? 'text-fail'
    : running
      ? 'text-spark'
      : done
        ? 'text-success'
        : 'text-ink3';

  return (
    <motion.div
      animate={{
        scale: running ? 1.03 : 1,
        boxShadow: failing
          ? '0 0 0 1px rgb(var(--c-fail) / 0.35), 0 0 14px rgb(var(--c-fail) / 0.25)'
          : running
            ? '0 0 0 1px rgb(var(--c-spark) / 0.3), 0 0 14px rgb(var(--c-spark) / 0.28)'
            : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className={`relative flex-1 min-w-0 bg-bg/60 border ${border} rounded-md px-3 py-2.5 transition-colors duration-200`}
    >
      <div className={`font-mono text-[10px] uppercase tracking-eyebrow ${labelTone} flex items-center gap-1.5`}>
        <span>video</span>
        <AnimatePresence>
          {onFallback && (
            <motion.span
              key="fb-pill"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="font-mono text-[8.5px] text-success bg-success/15 border border-success/40 px-1.5 py-px rounded-sm normal-case tracking-normal"
            >
              ↳ fallback
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Animated model name — swaps on fallback */}
      <div className="relative h-[15px] mt-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={model}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 font-mono text-[11px] truncate ${
              failing ? 'text-fail line-through' : 'text-ink2'
            }`}
          >
            {model}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-2">
        <span
          className={`font-mono text-[10px] tabular-nums ${
            failing ? 'text-fail' : 'text-ink3'
          }`}
        >
          {failing ? '503 ✗' : done ? '2.6s' : running ? '…' : '—'}
        </span>
        <FallbackBadge sub={sub} delay={delay} />
      </div>
    </motion.div>
  );
}

function FallbackBadge({ sub, delay = 0 }: { sub: VideoSub; delay?: number }) {
  const size = 'w-3 h-3 text-[8px]';
  if (sub === 'kling-fail') {
    return (
      <motion.span
        key="fail"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.18 }}
        className={`inline-flex items-center justify-center ${size} rounded-full bg-fail text-bg font-bold`}
        aria-hidden
      >
        ✗
      </motion.span>
    );
  }
  if (sub === 'wan-done') {
    return (
      <motion.span
        key="done"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, delay }}
        className={`inline-flex items-center justify-center ${size} rounded-full bg-success text-bg font-bold`}
        aria-hidden
      >
        ✓
      </motion.span>
    );
  }
  if (sub === 'kling-run' || sub === 'wan-run') {
    return (
      <motion.span
        className={`inline-block ${size} rounded-full border-2 border-spark border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      />
    );
  }
  return <span className={`inline-block w-1.5 h-1.5 rounded-full bg-rule2`} aria-hidden />;
}

/* ── Status badge — spinner while running, ✓ when done ──────────────────── */

function StatusBadge({
  status,
  delay = 0,
  small = false,
}: {
  status: Status;
  delay?: number;
  small?: boolean;
}) {
  const size = small ? 'w-3 h-3 text-[8px]' : 'w-4 h-4 text-[9px]';

  if (status === 'done') {
    return (
      <motion.span
        key="done"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, delay }}
        className={`inline-flex items-center justify-center ${size} rounded-full bg-success text-bg font-bold`}
        aria-hidden
      >
        ✓
      </motion.span>
    );
  }
  if (status === 'running') {
    return (
      <motion.span
        className={`inline-block ${size} rounded-full border-2 border-spark border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      />
    );
  }
  return (
    <span
      className={`inline-block ${small ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full bg-rule2`}
      aria-hidden
    />
  );
}

/* ── A single step row ──────────────────────────────────────────────────── */

function StepRow({
  index,
  step,
  phase,
  children,
}: {
  index: number;
  step: StepId;
  phase: Phase;
  children: React.ReactNode;
}) {
  const status = stepStatus(step, phase);
  const dim = status === 'queued' || status === 'idle';

  return (
    <motion.div
      animate={{ opacity: dim ? 0.55 : 1 }}
      transition={{ duration: 0.3 }}
      className="relative flex items-stretch gap-3 px-4 py-3.5 border-b border-rule2 last:border-b-0"
    >
      {/* Rail dot (left) */}
      <div className="relative flex flex-col items-center w-5 shrink-0 pt-1">
        <motion.span
          className={`relative inline-block w-2.5 h-2.5 rounded-full ${
            status === 'running'
              ? 'bg-spark'
              : status === 'done'
              ? 'bg-success'
              : 'bg-rule2'
          }`}
          animate={
            status === 'running'
              ? { boxShadow: ['0 0 0 0 rgb(var(--c-spark)/0.5)', '0 0 0 6px rgb(var(--c-spark)/0)', '0 0 0 0 rgb(var(--c-spark)/0)'] }
              : { boxShadow: '0 0 0 0 transparent' }
          }
          transition={
            status === 'running'
              ? { duration: 1.2, repeat: Infinity, ease: 'easeOut' }
              : { duration: 0.25 }
          }
        />
        {/* Continuing rail line */}
        <span
          aria-hidden
          className={`flex-1 w-px mt-1 ${
            status === 'done' ? 'bg-success/40' : 'bg-rule2'
          }`}
        />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1">
          step · 0{index + 1}
        </div>
        {children}
      </div>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export function WorkflowsDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    function tick() {
      clearAll();
      setPhase('idle');
      const order: Phase[] = ['input', 'enhance', 'parallel', 'merge', 'output', 'done'];
      let acc = TIMINGS.idle;
      for (const p of order) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => setPhase(p), at));
        acc += TIMINGS[p];
      }
    }

    tick();
    const id = setInterval(tick, TOTAL_LOOP);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

  const inputS   = stepStatus('input',    phase);
  const enhanceS = stepStatus('enhance',  phase);
  const parallelS = stepStatus('parallel', phase);
  const mergeS   = stepStatus('merge',    phase);
  const outputS  = stepStatus('output',   phase);

  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-spark/[0.10] via-transparent to-spark/[0.05] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              WORKFLOW · LIVE
            </span>
          </div>
          <PhaseLabel phase={phase} />
        </div>

        {/* Step stack */}
        <div className="bg-surface/40">
          <StepRow index={0} step="input" phase={phase}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-[12px] text-ink truncate">INPUT</div>
                <div className="font-mono text-[10.5px] text-ink3 mt-0.5 truncate">
                  2 portraits · Person1.png · Person2.png
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                {/* Real flow inputs: Person1 / Person2 portrait images */}
                {[
                  {
                    label: 'Person1',
                    src: 'https://cdn-us.eachlabs.ai/uploads/8f5d5d4a-8504-44b1-a255-ff0c6022a98d.png',
                  },
                  {
                    label: 'Person2',
                    src: 'https://cdn-us.eachlabs.ai/uploads/25a896fa-099b-4d48-9ca9-92e6fec86b74.png',
                  },
                ].map((p) => (
                  <span
                    key={p.label}
                    className="w-11 h-11 rounded-md overflow-hidden bg-bg/60 border border-rule2 shrink-0"
                    aria-label={`${p.label}.png`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt=""
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </span>
                ))}
              </div>
              <StatusBadge status={inputS} />
            </div>
          </StepRow>

          <StepRow index={1} step="enhance" phase={phase}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[12px] text-ink truncate">enhance</div>
                <div className="font-mono text-[10.5px] text-ink3 mt-0.5 truncate">
                  gpt-4o · 0.4s · $0.001
                </div>
              </div>
              <StatusBadge status={enhanceS} />
            </div>
          </StepRow>

          <StepRow index={2} step="parallel" phase={phase}>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="font-mono text-[12px] text-ink flex items-center gap-2">
                <span>⋯ parallel</span>
                <span className="font-mono text-[10px] text-ink3">3 branches</span>
              </div>
              <StatusBadge status={parallelS} />
            </div>
            <div className="flex gap-2">
              <BranchCard
                label="image"
                model="flux-2"
                status={parallelS}
                delay={0.1}
                ms={2140}
              />
              <FallbackBranchCard
                status={parallelS}
                delay={0.25}
              />
              <BranchCard
                label="audio"
                model="eleven-v3"
                status={parallelS}
                delay={0.4}
                ms={1180}
              />
            </div>
          </StepRow>

          <StepRow index={3} step="merge" phase={phase}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[12px] text-ink truncate">merge</div>
                <div className="font-mono text-[10.5px] text-ink3 mt-0.5 truncate">
                  compose · 0.2s
                </div>
              </div>
              <StatusBadge status={mergeS} />
            </div>
          </StepRow>

          <StepRow index={4} step="output" phase={phase}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-[12px] text-ink truncate">OUTPUT</div>
                <div className="font-mono text-[10.5px] text-ink3 mt-0.5 truncate">
                  the-last-hold.mp4 · 15s · 720p · 16:9
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                {/* Real flow output: the-last-hold-video preview frame */}
                <span
                  className="relative w-[72px] h-11 rounded-md overflow-hidden bg-bg/60 border border-rule2 shrink-0"
                  aria-label="the-last-hold.mp4 preview"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn-us.eachlabs.ai/defaults/62f121e39b3f45998c8e9e07b83cc66a.png"
                    alt=""
                    width={72}
                    height={44}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center bg-bg/30"
                    aria-hidden
                  >
                    <span className="w-4 h-4 rounded-full bg-bg/80 backdrop-blur-sm flex items-center justify-center text-ink text-[8px] leading-none pl-px">
                      ▶
                    </span>
                  </span>
                </span>
              </div>
              <StatusBadge status={outputS} />
            </div>
          </StepRow>
        </div>

        {/* Footer — total cost & trace summary */}
        <TraceFooter phase={phase} />
      </div>

      {/* Caption */}
      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        five models · one each.run() · one trace · zero glue code
      </div>
    </div>
  );
}

/* ── Phase label that morphs through the states ─────────────────────────── */

function PhaseLabel({ phase }: { phase: Phase }) {
  const text =
    phase === 'idle'     ? 'queued'
    : phase === 'input'    ? '→ enhance'
    : phase === 'enhance'  ? 'enhance · gpt-4o'
    : phase === 'parallel' ? '3 branches · parallel'
    : phase === 'merge'    ? 'merge · compose'
    : phase === 'output'   ? '→ output'
    : 'done · 6.2s · trace_8f2a';

  const tone =
    phase === 'idle' ? 'text-ink3'
    : phase === 'done' ? 'text-success'
    : 'text-spark';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phase}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.16 }}
        className={`font-mono text-[10px] uppercase tracking-eyebrow ${tone} flex items-center gap-1.5`}
      >
        {text}
        {(phase === 'input' || phase === 'enhance' || phase === 'merge' || phase === 'output') && (
          <ChevronDown size={10} className="opacity-60" />
        )}
      </motion.span>
    </AnimatePresence>
  );
}

/* ── Trace footer — fills in on completion ──────────────────────────────── */

function TraceFooter({ phase }: { phase: Phase }) {
  const showTrace = phase === 'done';

  return (
    <div className="relative border-t border-rule2 bg-bg/40 px-4 py-2.5 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={showTrace ? 'trace' : 'idle'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14 }}
          className="flex items-center gap-3 font-mono text-[10px]"
        >
          {showTrace ? (
            <>
              <span className="text-success">✓</span>
              <span className="text-ink3 uppercase tracking-eyebrow whitespace-nowrap">
                trace · 5 steps
              </span>
              <span className="text-ink2 truncate flex-1">
                enhance · flux-2 · <span className="text-fail line-through">kling-v3</span>{' '}
                <span className="text-success">↳ wan-2.7</span> · eleven-v3 · compose
              </span>
              <span className="text-spark tabular-nums shrink-0">Σ $0.175</span>
            </>
          ) : (
            <>
              <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
              <span className="text-ink3 uppercase tracking-eyebrow">
                each.run(&quot;the-last-hold-video&quot;)
              </span>
              <span className="ml-auto text-ink3 normal-case tracking-normal">
                5 steps · v3.2 · 1 trace
              </span>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
