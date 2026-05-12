'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   WorkflowsDemo — the 5-second story for /workflows.

   Visual: a real production graph executing live.
     input → enhance ──┬── flux-2     (image) ─┐
                       ├── kling-v3   (video)  ├── merge → output
                       └── eleven-v3  (audio)  ┘

   ~7.6s loop, six phases. Tells: "A workflow is N model calls behind one
   each.run() — sequential and parallel — versioned and traced end-to-end."

     idle      0.0 – 0.4s   reset / dim
     input     0.4 – 1.0s   input pulses, edge lights, packet flies
     enhance   1.0 – 2.0s   enhance node "running"
     parallel  2.0 – 4.8s   three branches run concurrently (staggered)
     merge     4.8 – 5.7s   merge node converges all three
     output    5.7 – 6.6s   output node fires; trace banner appears
     done      6.6 – 7.6s   trace banner persists, then loop

   Layout uses an SVG paths layer for edges + absolute-positioned HTML pills
   for nodes. Packets are motion.span dots tweened between node centers.
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'input' | 'enhance' | 'parallel' | 'merge' | 'output' | 'done';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  input: 600,
  enhance: 1000,
  parallel: 2800,
  merge: 900,
  output: 900,
  done: 1700, // extra time so the trace banner is readable before loop restarts
};

const TOTAL_LOOP =
  TIMINGS.idle + TIMINGS.input + TIMINGS.enhance + TIMINGS.parallel +
  TIMINGS.merge + TIMINGS.output + TIMINGS.done;

/* ── Geometry — vertical flow: top→bottom. ViewBox 440×520, nodes positioned
   by center coords. The 3 parallel branches now spread horizontally. ───── */

const VIEW_W = 440;
const VIEW_H = 520;

type NodeId = 'input' | 'enhance' | 'image' | 'video' | 'audio' | 'merge' | 'output';

const NODES: Record<NodeId, { x: number; y: number; label: string; sub?: string; tone?: 'spark' | 'highlight' | 'sun' }> = {
  input:   { x: 220, y:  40, label: 'INPUT' },
  enhance: { x: 220, y: 130, label: 'enhance', sub: 'gpt-4o', tone: 'highlight' },
  image:   { x:  80, y: 250, label: 'image',   sub: 'flux-2',     tone: 'spark' },
  video:   { x: 220, y: 250, label: 'video',   sub: 'kling-v3',   tone: 'spark' },
  audio:   { x: 360, y: 250, label: 'audio',   sub: 'eleven-v3',  tone: 'sun' },
  merge:   { x: 220, y: 380, label: 'merge',   sub: 'compose',    tone: 'highlight' },
  output:  { x: 220, y: 480, label: 'OUT' },
};

type EdgeId = 'in→en' | 'en→im' | 'en→vi' | 'en→au' | 'im→me' | 'vi→me' | 'au→me' | 'me→ou';

/** Curved path between two node centers (used for the parallel splits).
   Vertical flow: control points pull the curve along the y-axis so each
   edge reads as a top-to-bottom arc. */
function curve(from: NodeId, to: NodeId): string {
  const a = NODES[from];
  const b = NODES[to];
  const dy = (b.y - a.y) * 0.55;
  return `M ${a.x},${a.y} C ${a.x},${a.y + dy} ${b.x},${b.y - dy} ${b.x},${b.y}`;
}

const EDGES: Record<EdgeId, { from: NodeId; to: NodeId; d: string }> = {
  'in→en': { from: 'input',   to: 'enhance', d: curve('input',   'enhance') },
  'en→im': { from: 'enhance', to: 'image',   d: curve('enhance', 'image')   },
  'en→vi': { from: 'enhance', to: 'video',   d: curve('enhance', 'video')   },
  'en→au': { from: 'enhance', to: 'audio',   d: curve('enhance', 'audio')   },
  'im→me': { from: 'image',   to: 'merge',   d: curve('image',   'merge')   },
  'vi→me': { from: 'video',   to: 'merge',   d: curve('video',   'merge')   },
  'au→me': { from: 'audio',   to: 'merge',   d: curve('audio',   'merge')   },
  'me→ou': { from: 'merge',   to: 'output',  d: curve('merge',   'output')  },
};

/* ── Status helpers — derive node + edge state from the current phase ───── */

type NodeStatus = 'idle' | 'queued' | 'running' | 'done';

function nodeStatus(id: NodeId, phase: Phase): NodeStatus {
  if (phase === 'idle') return 'idle';
  const order: Record<NodeId, number> = {
    input: 0, enhance: 1, image: 2, video: 2, audio: 2, merge: 3, output: 4,
  };
  const phaseToStep: Record<Phase, number> = {
    idle: -1, input: 0, enhance: 1, parallel: 2, merge: 3, output: 4, done: 4,
  };
  const step = phaseToStep[phase];
  const n = order[id];
  if (n < step) return 'done';
  if (n === step) return 'running';
  return 'queued';
}

/** Edge "active" when its `from` node has fired and `to` node is running/done. */
function edgeActive(edge: EdgeId, phase: Phase): boolean {
  const e = EDGES[edge];
  const fromS = nodeStatus(e.from, phase);
  const toS   = nodeStatus(e.to,   phase);
  return fromS === 'done' && (toS === 'running' || toS === 'done');
}

/** Whether an edge has fully completed (used for "done + soft glow" state). */
function edgeDone(edge: EdgeId, phase: Phase): boolean {
  return nodeStatus(EDGES[edge].to, phase) === 'done';
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

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
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

        {/* Graph */}
        <Graph phase={phase} />

        {/* Trace footer */}
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
    : 'done · 6.2s · trace_id wf_8f2a';

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
        className={`font-mono text-[10px] uppercase tracking-eyebrow ${tone}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

/* ── Graph — SVG edges layer + absolute-positioned HTML node pills ──────── */

function Graph({ phase }: { phase: Phase }) {
  return (
    <div className="relative py-3" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
      {/* Edges layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {(Object.keys(EDGES) as EdgeId[]).map((id) => (
          <Edge key={id} id={id} phase={phase} />
        ))}
      </svg>

      {/* Nodes layer */}
      <div className="absolute inset-0">
        {(Object.keys(NODES) as NodeId[]).map((id) => (
          <Node key={id} id={id} phase={phase} />
        ))}
      </div>

      {/* Packets — small dots that ride active edges */}
      <Packets phase={phase} />

      {/* "PARALLEL" annotation, only during the parallel phase */}
      <AnimatePresence>
        {phase === 'parallel' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute font-mono text-[9px] uppercase tracking-eyebrow text-spark whitespace-nowrap"
            style={{
              left: '50%',
              top: `${((NODES.image.y - 50) / VIEW_H) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            ⋯ parallel
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Edge — animated SVG path ───────────────────────────────────────────── */

function Edge({ id, phase }: { id: EdgeId; phase: Phase }) {
  const e = EDGES[id];
  const active = edgeActive(id, phase);
  const done = edgeDone(id, phase);

  // Hide certain edges entirely until their phase. Otherwise they look
  // pre-drawn and lose the "the workflow is unfolding" feeling.
  const reveal =
    nodeStatus(e.from, phase) === 'done' || nodeStatus(e.from, phase) === 'running';

  return (
    <>
      {/* Static base path (always visible once revealed) */}
      <motion.path
        d={e.d}
        fill="none"
        stroke="rgb(var(--c-rule2))"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0.35 }}
        transition={{ duration: 0.25 }}
      />
      {/* Active spark overlay — draws on as edge fires */}
      <motion.path
        d={e.d}
        fill="none"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: active || done ? 1 : 0,
          opacity: active ? 1 : done ? 0.55 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: 'drop-shadow(0 0 4px rgb(var(--c-spark) / 0.5))' }}
      />
    </>
  );
}

/* ── Node — HTML pill positioned by node coords ─────────────────────────── */

function Node({ id, phase }: { id: NodeId; phase: Phase }) {
  const n = NODES[id];
  const status = nodeStatus(id, phase);
  const isIO = id === 'input' || id === 'output';

  // Visual variants
  const baseCls =
    'absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-md border bg-bg whitespace-nowrap text-center transition-colors duration-200';
  const toneCls =
    status === 'running'
      ? 'border-spark text-spark'
      : status === 'done'
      ? 'border-success/55 text-success'
      : status === 'queued'
      ? 'border-rule2 text-ink3'
      : 'border-rule2 text-ink3 opacity-60';

  return (
    <motion.div
      animate={{
        scale: status === 'running' ? 1.04 : 1,
        boxShadow:
          status === 'running'
            ? '0 0 0 1px rgb(var(--c-spark) / 0.35), 0 0 12px rgb(var(--c-spark) / 0.35)'
            : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className={`${baseCls} ${toneCls}`}
      style={{
        left: `${(n.x / VIEW_W) * 100}%`,
        top: `${(n.y / VIEW_H) * 100}%`,
        minWidth: isIO ? 56 : 92,
      }}
    >
      <div className={`font-mono ${isIO ? 'text-[10px] uppercase tracking-eyebrow' : 'text-[10px]'}`}>
        {n.label}
      </div>
      {n.sub && (
        <div
          className={`font-mono text-[9px] mt-0.5 ${
            status === 'running' || status === 'done' ? 'text-ink2' : 'text-ink3/70'
          }`}
        >
          {n.sub}
        </div>
      )}
      {/* tiny progress dot when running */}
      {status === 'running' && (
        <motion.span
          className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-spark"
          animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          style={{ boxShadow: '0 0 5px rgb(var(--c-spark) / 0.7)' }}
          aria-hidden
        />
      )}
      {/* check when done */}
      {status === 'done' && (
        <span
          className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-success text-bg text-[8px] font-bold flex items-center justify-center"
          aria-hidden
        >
          ✓
        </span>
      )}
    </motion.div>
  );
}

/* ── Packets — small spark dots that fly between nodes on active edges ──── */

type PacketTrip = { from: NodeId; to: NodeId; delay: number; duration: number };

function Packets({ phase }: { phase: Phase }) {
  // Compose the list of trips to fire for this phase. Each trip animates
  // a dot from `from` node center to `to` node center.
  const trips: PacketTrip[] =
    phase === 'input'
      ? [{ from: 'input', to: 'enhance', delay: 0, duration: 0.55 }]
      : phase === 'enhance'
      ? [
          { from: 'enhance', to: 'image', delay: 0.55, duration: 0.45 },
          { from: 'enhance', to: 'video', delay: 0.55, duration: 0.45 },
          { from: 'enhance', to: 'audio', delay: 0.55, duration: 0.45 },
        ]
      : phase === 'parallel'
      ? [
          { from: 'image', to: 'merge', delay: 2.05, duration: 0.5 },
          { from: 'video', to: 'merge', delay: 2.30, duration: 0.5 },
          { from: 'audio', to: 'merge', delay: 2.55, duration: 0.5 },
        ]
      : phase === 'merge'
      ? [{ from: 'merge', to: 'output', delay: 0.55, duration: 0.45 }]
      : [];

  return (
    <>
      {trips.map((t, i) => (
        <Packet key={`${phase}-${i}-${t.from}-${t.to}`} trip={t} />
      ))}
    </>
  );
}

function Packet({ trip }: { trip: PacketTrip }) {
  const a = NODES[trip.from];
  const b = NODES[trip.to];

  return (
    <motion.span
      className="absolute w-1.5 h-1.5 rounded-full bg-spark pointer-events-none"
      style={{
        boxShadow: '0 0 6px rgb(var(--c-spark) / 0.85)',
        left: 0,
        top: 0,
        // anchored at top-left, position via translate
      }}
      initial={{
        x: `calc(${(a.x / VIEW_W) * 100}% - 3px)`,
        y: `calc(${(a.y / VIEW_H) * 100}% - 3px)`,
        opacity: 0,
      }}
      animate={{
        x: `calc(${(b.x / VIEW_W) * 100}% - 3px)`,
        y: `calc(${(b.y / VIEW_H) * 100}% - 3px)`,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        x: { duration: trip.duration, delay: trip.delay, ease: [0.5, 0, 0.5, 1] },
        y: { duration: trip.duration, delay: trip.delay, ease: [0.5, 0, 0.5, 1] },
        opacity: { duration: trip.duration, delay: trip.delay, times: [0, 0.15, 0.85, 1] },
      }}
    />
  );
}

/* ── Trace footer — shows a 5-step trace on completion ──────────────────── */

const TRACE_STEPS = [
  { name: 'enhance',  model: 'gpt-4o',     ms: 820,   cost: '$0.001' },
  { name: 'image',    model: 'flux-2',     ms: 2140,  cost: '$0.020' },
  { name: 'video',    model: 'kling-v3',   ms: 2680,  cost: '$0.140' },
  { name: 'audio',    model: 'eleven-v3',  ms: 1180,  cost: '$0.014' },
  { name: 'merge',    model: 'compose',    ms: 240,   cost: '$0.000' },
];

function TraceFooter({ phase }: { phase: Phase }) {
  const showTrace = phase === 'done';

  return (
    <div className="relative h-[72px] border-t border-rule2 bg-bg/40 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={showTrace ? 'trace' : 'idle'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.14 }}
          className="absolute inset-0 px-4 md:px-5"
        >
          {showTrace ? (
            <div className="h-full flex items-center gap-3 font-mono text-[10px]">
              <span className="text-success">✓</span>
              <span className="text-ink3 uppercase tracking-eyebrow whitespace-nowrap">
                trace · 5 steps
              </span>
              <div className="flex-1 flex items-center gap-1 overflow-hidden">
                {TRACE_STEPS.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.08 }}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-bg border border-rule2 rounded text-[9.5px] whitespace-nowrap"
                  >
                    <span className="inline-block w-1 h-1 rounded-full bg-success" aria-hidden />
                    <span className="text-ink2">{s.model}</span>
                    <span className="text-ink3 tabular-nums">{s.ms}ms</span>
                  </motion.div>
                ))}
              </div>
              <div className="text-spark tabular-nums whitespace-nowrap">
                Σ $0.175
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center font-mono text-[10px] uppercase tracking-eyebrow text-ink3 gap-3">
              <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
              <span>each.run("product-photo-v3", inputs)</span>
              <span className="ml-auto text-ink2 normal-case tracking-normal">5 steps · v3.2 · 1 trace</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
