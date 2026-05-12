'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   HeroWidget — "each::labs · LIVE"
   Story we want felt: many models break · each::labs catches each one · the
   error rate would climb without us, but stays at 0.04% because we keep
   pulling it back down.
────────────────────────────────────────────────────────────────────────── */

const COLS = 28;
const ROWS = 9;
const TOTAL = COLS * ROWS;

// Master loop matches the ORCHESTRATE pane (6s) so both panes pulse together.
// Three events per master cycle — 1 of 3 synced with the ORCHESTRATE swap:
//   · FILLER_1 at 0.0s — random pair (warm-up)
//   · SYNCED   at 2.0s — same moment as kling-v3 fail in ORCHESTRATE
//   · FILLER_2 at 4.0s — random pair (cool-down, keeps the grid alive)
// Each event takes ~1.8s to fully clear, so they don't overlap.
const MASTER_LOOP_MS = 6000;
const FILLER_1_AT_MS = 0;
const SYNCED_AT_MS   = 2000;
const FILLER_2_AT_MS = 4000;
const FALLBACK_AT_MS = 240;   // each::labs catches and reroutes
const HEALED_AT_MS   = 800;   // both dots green; rate snaps back
const CLEAR_AT_MS    = 1800;  // back to idle

const STEADY_RATE = 0.04;
const FAILED_RATE = 0.06; // brief bump while uncaught

/** Real model pairs from the catalog. */
const FAILOVER_PAIRS: { from: string; to: string; ms: number }[] = [
  { from: 'kling-v3-12v',  to: 'wan-2.7',      ms: 124 },
  { from: 'veo-3',         to: 'kling-v3',     ms: 156 },
  { from: 'flux-1.1-pro',  to: 'sdxl-turbo',   ms:  89 },
  { from: 'eleven-v3',     to: 'azure-tts',    ms: 102 },
  { from: 'gpt-4o',        to: 'claude-3.5',   ms: 138 },
  { from: 'sora-2',        to: 'kling-v3',     ms: 178 },
  { from: 'nano-banana-2', to: 'flux-1.1-pro', ms:  74 },
  { from: 'hunyuan-3d-2',  to: 'tripo-3d',     ms: 211 },
];

type Phase = 'idle' | 'fail' | 'fallback' | 'healed';
type Ev = { fail: number; fallback: number; pair: typeof FAILOVER_PAIRS[number] };

export function HeroWidget() {
  const [event, setEvent] = useState<Ev | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  // All pending timers for the *current* event — cleared whenever we start a new one.
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function clearPending() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    /**
     * Fire one fail → fallback → healed → cleared event in the dot grid.
     * If `forcedPair` is provided, use it (so the synced event always reads
     * "kling-v3-12v → wan-2.7", matching the ORCHESTRATE pane's swap).
     */
    function fireEvent(forcedPair?: typeof FAILOVER_PAIRS[number]) {
      const fail = Math.floor(Math.random() * TOTAL);
      const offsets = [1, COLS, COLS + 1, -1, -COLS, -COLS + 1, 2, COLS + 2, -2];
      const off = offsets[Math.floor(Math.random() * offsets.length)];
      const fallback = (fail + off + TOTAL) % TOTAL;
      const pair = forcedPair ?? FAILOVER_PAIRS[Math.floor(Math.random() * FAILOVER_PAIRS.length)];

      setEvent({ fail, fallback, pair });
      setPhase('fail');

      timeoutsRef.current.push(
        setTimeout(() => setPhase('fallback'), FALLBACK_AT_MS),
        setTimeout(() => setPhase('healed'),   HEALED_AT_MS),
        setTimeout(() => {
          setPhase('idle');
          setEvent(null);
        }, CLEAR_AT_MS),
      );
    }

    // The "synced" pair — same model the ORCHESTRATE pane swaps to.
    const KLING_PAIR =
      FAILOVER_PAIRS.find((p) => p.from === 'kling-v3-12v') ?? FAILOVER_PAIRS[0];

    function tick() {
      clearPending();
      // 1 of 3 events syncs with ORCHESTRATE — the middle one.
      // Filler 1 — random pair, fires immediately at cycle start.
      if (FILLER_1_AT_MS === 0) {
        fireEvent();
      } else {
        timeoutsRef.current.push(setTimeout(() => fireEvent(), FILLER_1_AT_MS));
      }
      // Synced — kling-v3-12v → wan-2.7, exactly when ORCHESTRATE flips.
      timeoutsRef.current.push(setTimeout(() => fireEvent(KLING_PAIR), SYNCED_AT_MS));
      // Filler 2 — random pair after the synced moment.
      timeoutsRef.current.push(setTimeout(() => fireEvent(), FILLER_2_AT_MS));
    }

    // Run a partial first cycle synced as if mount = t=0.
    tick();
    intervalRef.current = setInterval(tick, MASTER_LOOP_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearPending();
    };
  }, []);

  // ── Geometry for the SVG arc connecting fail dot → fallback dot ───────────
  const failPos = event
    ? { x: ((event.fail % COLS) + 0.5) / COLS, y: (Math.floor(event.fail / COLS) + 0.5) / ROWS }
    : null;
  const fbPos = event
    ? { x: ((event.fallback % COLS) + 0.5) / COLS, y: (Math.floor(event.fallback / COLS) + 0.5) / ROWS }
    : null;

  const arcPath =
    failPos && fbPos
      ? (() => {
          const x1 = failPos.x * 100;
          const y1 = failPos.y * 100;
          const x2 = fbPos.x * 100;
          const y2 = fbPos.y * 100;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 - 12;
          return `M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`;
        })()
      : null;

  function dotState(i: number): 'idle' | 'fail' | 'fallback' | 'healed' {
    if (!event || phase === 'idle') return 'idle';
    const isFail = event.fail === i;
    const isFb   = event.fallback === i;
    if (!isFail && !isFb) return 'idle';
    if (phase === 'healed') return 'healed';
    if (isFail) return 'fail';
    if (isFb && phase !== 'fail') return 'fallback';
    return 'idle';
  }

  // ── Live-feeling error rate value ─────────────────────────────────────────
  // fail/fallback: bumps up to FAILED_RATE (the rate "would" be this without us)
  // healed/idle:  snaps back to STEADY_RATE — because each::labs caught it
  const rateValue =
    phase === 'fail' || phase === 'fallback' ? FAILED_RATE : STEADY_RATE;
  const rateRising = phase === 'fail' || phase === 'fallback';

  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-spark/[0.08] via-transparent to-spark/[0.04] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Header — orchestration + observability framing */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              ORCHESTRATION + OBSERVABILITY · LIVE
            </span>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3 -mb-0.5">
              uptime · 24h
            </div>
            <motion.span
              className="font-display text-[18px] md:text-[20px] font-semibold text-success tabular-nums"
              animate={{ opacity: [1, 0.85, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              99.99<span className="text-success/70">%</span>
            </motion.span>
          </div>
        </div>

        {/* ① ORCHESTRATE — compact pipeline showing a workflow running live */}
        <OrchestratePane />

        {/* ② OBSERVE — dot grid + SVG overlay */}
        <div className="px-5 md:px-6 pt-4 pb-3 border-t border-rule2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
              <span className="text-spark">②</span> OBSERVE · 600+ models running
            </span>
            <span className="font-mono text-[10px] text-ink3">
              healed in <span className="text-spark">&lt;120ms</span>
            </span>
          </div>

          <div className="relative">
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
              aria-label="600+ live model status grid"
            >
              {Array.from({ length: TOTAL }).map((_, i) => (
                <Dot key={i} state={dotState(i)} />
              ))}
            </div>

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {arcPath && (
                <motion.path
                  key={`arc-${event?.fail}-${event?.fallback}`}
                  d={arcPath}
                  fill="none"
                  stroke="rgb(var(--c-spark))"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: phase === 'fallback' || phase === 'healed' ? 1 : 0,
                    opacity:
                      phase === 'fallback' ? 0.95 :
                      phase === 'healed'   ? 0.4  : 0,
                  }}
                  transition={{ duration: 0.32, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 4px rgb(var(--c-spark) / 0.7))' }}
                />
              )}
            </svg>
          </div>

          {/* Floating event label */}
          <div className="mt-3 h-[22px] relative">
            <AnimatePresence mode="wait">
              {event && (phase === 'fallback' || phase === 'healed') ? (
                <motion.div
                  key={`ev-${event.pair.from}-${event.pair.to}-${phase}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 flex items-center gap-2 font-mono text-[11px]"
                >
                  <span className="text-success">✓</span>
                  <span className="text-ink3 line-through decoration-fail/70">
                    {event.pair.from}
                  </span>
                  <span className="text-spark">→</span>
                  <span className="text-ink">{event.pair.to}</span>
                  <span className="text-ink3">·</span>
                  <span className="text-spark tabular-nums">{event.pair.ms}ms</span>
                  <span className="text-success">· healed</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center gap-2 font-mono text-[11px] text-ink3"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-success/70" aria-hidden />
                  <span>0 active failures · all models healthy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom strip — error rate that visibly bumps + drops */}
        <div className="grid grid-cols-2 gap-4 px-5 md:px-6 py-4 border-t border-rule2 bg-bg/30">
          <div>
            <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1 flex items-center gap-2">
              <span>error rate · 24h</span>
              <AnimatePresence>
                {(phase === 'fallback' || phase === 'healed') && (
                  <motion.span
                    key={`catch-${event?.fail}`}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-spark normal-case tracking-normal"
                  >
                    ↓ caught
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-baseline gap-1.5">
              <motion.span
                key={`rate-${rateValue}`}
                className={`font-display text-[28px] md:text-[32px] font-semibold tabular-nums ${
                  rateRising ? 'text-fail' : 'text-success'
                }`}
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {rateValue.toFixed(2)}
              </motion.span>
              <span
                className={`font-display text-[18px] ${rateRising ? 'text-fail/70' : 'text-success/70'}`}
              >
                %
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-1">
              vs raw SDKs
            </div>
            <div className="flex items-baseline justify-end gap-2">
              <span className="font-display text-[28px] md:text-[32px] font-semibold text-spark tabular-nums">
                97×
              </span>
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
                fewer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        models break · each::labs catches each one · rate stays at 0.04%
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   OrchestratePane — compact pipeline strip showing a live workflow.
   The packet pauses at the kling-v3 step, kling fails (red flash), and the
   pill swaps to wan-2.7 (the fallback). Then the packet continues to OUTPUT.
   Loops forever. Sells the "ORCHESTRATION + auto-failover" story in 6s.
────────────────────────────────────────────────────────────────────────── */

const PIPELINE_LOOP_S = 6;

type SwapPhase = 'primary' | 'fail' | 'fallback';

function OrchestratePane() {
  const [phase, setPhase] = useState<SwapPhase>('primary');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    function tick() {
      clearAll();
      setPhase('primary');
      // Packet arrives at kling around 2.0s → flash red
      timeoutsRef.current.push(setTimeout(() => setPhase('fail'), 2000));
      // 400ms later → swap to wan-2.7 (fallback)
      timeoutsRef.current.push(setTimeout(() => setPhase('fallback'), 2400));
      // At cycle end (≈5.76s) → reset to primary so kling/wan-2.7 dims together
      // with the other pills, instead of staying lit until the next master tick.
      timeoutsRef.current.push(setTimeout(() => setPhase('primary'), 5760));
    }

    tick();
    const id = setInterval(tick, PIPELINE_LOOP_S * 1000);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

  return (
    <div className="px-5 md:px-6 pt-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          <span className="text-spark">①</span> ORCHESTRATE
        </span>
        <span className="font-mono text-[10px] text-ink3">
          req_8f2a · workflow v3.2
        </span>
      </div>

      <div className="relative">
        {/* Static connecting line */}
        <div className="absolute left-3 right-3 top-1/2 h-px bg-rule2 -translate-y-1/2" />
        {/* Animated spark line that draws as the packet travels */}
        <motion.div
          className="absolute left-3 top-1/2 h-px bg-spark -translate-y-1/2 origin-left"
          style={{ right: 12 }}
          animate={{ scaleX: [0, 0.5, 0.5, 1, 1, 0] }}
          transition={{
            duration: PIPELINE_LOOP_S,
            times: [0, 0.32, 0.45, 0.7, 0.95, 1],
            repeat: Infinity,
          }}
        />

        {/* Step pills */}
        <div className="relative flex items-center justify-between gap-1">
          <NormalPill step="INPUT"   index={0} />
          <NormalPill step="enhance" index={1} />
          <SwappingPill phase={phase} />
          <NormalPill step="eleven"  index={3} />
          <NormalPill step="OUTPUT"  index={4} />
        </div>

        {/* Traveling packet — pauses briefly at the kling position
            so the swap reads as "the failure caused the reroute". */}
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-spark"
          initial={{ left: '4%' }}
          animate={{ left: ['4%', '50%', '50%', '96%', '96%', '4%'] }}
          transition={{
            duration: PIPELINE_LOOP_S,
            times: [0, 0.32, 0.45, 0.7, 0.95, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ boxShadow: '0 0 6px rgb(var(--c-spark) / 0.6)' }}
        />
      </div>
    </div>
  );
}

/* Highlight peak (normalized 0–1 in the 6s loop) for each pill index.
   Calibrated to fire when the packet ARRIVES at that pill — not before.
   Packet path (timeline 0–1):
     0 → 0.32   packet  4 → 50  (INPUT → kling)
     0.32 → 0.45 pause at 50    (swap)
     0.45 → 0.70 packet 50 → 96 (kling → OUTPUT)
   Packet arrival at each pill:
     INPUT (4%)  ≈ t = 0.000
     enhance(27%) ≈ t = 0.175  (in segment 1)
     kling (50%) ≈ t = 0.320
     eleven(73%) ≈ t = 0.575  (in segment 3 — POST-swap)
     OUTPUT(96%) ≈ t = 0.700
*/
const PILL_PEAK: Record<number, number> = {
  0: 0.03,  // INPUT
  1: 0.20,  // enhance
  // index 2 is SwappingPill (driven by phase state, not these keyframes)
  3: 0.60,  // eleven — slightly AFTER packet arrives at 0.575 so it lights as packet hits it
  4: 0.74,  // OUTPUT — slightly after packet arrives at 0.70
};

/* Step pill that lights up as the packet passes and STAYS lit until the
   cycle reset — so each pill the packet has visited remains sparked. */
function NormalPill({ step, index }: { step: string; index: number }) {
  const peak = PILL_PEAK[index] ?? 0;
  // Tight ramp — pill stays dark until packet is right at it, then snaps on.
  const start = Math.max(0, peak - 0.02);
  // Stay lit until the very end of the cycle, then snap back to idle.
  const HOLD_UNTIL = 0.96;

  return (
    <motion.span
      className="relative z-10 px-2 py-1 rounded-md bg-bg border font-mono text-[9.5px] md:text-[10px] uppercase tracking-eyebrow whitespace-nowrap"
      initial={{ borderColor: 'rgb(var(--c-rule2))', color: 'rgb(var(--c-ink3))' }}
      animate={{
        borderColor: [
          'rgb(var(--c-rule2))',
          'rgb(var(--c-spark))',
          'rgb(var(--c-spark))',
          'rgb(var(--c-rule2))',
        ],
        color: [
          'rgb(var(--c-ink3))',
          'rgb(var(--c-spark))',
          'rgb(var(--c-spark))',
          'rgb(var(--c-ink3))',
        ],
      }}
      transition={{
        duration: PIPELINE_LOOP_S,
        times: [start, peak, HOLD_UNTIL, 1],
        repeat: Infinity,
      }}
    >
      {step}
    </motion.span>
  );
}

/* The kling-v3 / wan-2.7 swapping pill. Both names are layered;
   the active one slides in (y:0, opacity:1), the other slides out.
   A floating "↳ FALLBACK" tag appears above during the fail+fallback
   window to make the model swap unmistakable. */
function SwappingPill({ phase }: { phase: SwapPhase }) {
  const isFail = phase === 'fail';
  const showFb = phase === 'fallback';
  const swapWindow = isFail || showFb; // tag stays up through both phases

  const borderColor =
    isFail  ? 'rgb(var(--c-fail))' :
    showFb  ? 'rgb(var(--c-spark))' :
              'rgb(var(--c-rule2))';
  const textColor =
    isFail  ? 'rgb(var(--c-fail))' :
    showFb  ? 'rgb(var(--c-spark))' :
              'rgb(var(--c-ink3))';

  return (
    <span className="relative inline-block z-10">
      {/* Floating "FALLBACK" tag — appears above the pill during fail+fallback */}
      <AnimatePresence>
        {swapWindow && (
          <motion.span
            key="fb-tag"
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -2, scale: 0.9 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 -top-[18px] font-mono text-[8.5px] uppercase tracking-eyebrow px-1.5 py-px rounded-sm whitespace-nowrap pointer-events-none"
            style={{
              color: isFail ? 'rgb(var(--c-fail))' : 'rgb(var(--c-spark))',
              backgroundColor: isFail
                ? 'rgb(var(--c-fail) / 0.12)'
                : 'rgb(var(--c-spark) / 0.15)',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: isFail
                ? 'rgb(var(--c-fail) / 0.5)'
                : 'rgb(var(--c-spark) / 0.55)',
            }}
            aria-hidden
          >
            {isFail ? '✗ kling failed' : '↳ fallback'}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span
        className="relative inline-block px-2 py-1 rounded-md bg-bg border font-mono text-[9.5px] md:text-[10px] uppercase tracking-eyebrow whitespace-nowrap overflow-hidden"
        animate={{
          borderColor,
          color: textColor,
          scale: showFb ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{
          boxShadow: showFb
            ? '0 0 0 1px rgb(var(--c-spark) / 0.4), 0 0 14px rgb(var(--c-spark) / 0.55)'
            : isFail
              ? '0 0 0 1px rgb(var(--c-fail) / 0.4), 0 0 10px rgb(var(--c-fail) / 0.45)'
              : 'none',
        }}
      >
        <span className="relative block">
          {/* kling-v3 — visible during primary + fail; slides up & out on fallback.
              On fail, gets strike-through to underline the death. */}
          <motion.span
            className="block"
            animate={{
              y: showFb ? -22 : 0,
              opacity: showFb ? 0 : 1,
              textDecoration: isFail ? 'line-through' : 'none',
            }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            kling-v3
          </motion.span>
          {/* wan-2.7 — slides in from below on fallback */}
          <motion.span
            className="absolute inset-0 block"
            animate={{ y: showFb ? 0 : 22, opacity: showFb ? 1 : 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            wan-2.7
          </motion.span>
        </span>
      </motion.span>
    </span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Dot — single grid cell. 4 states: idle / fail / fallback / healed.
────────────────────────────────────────────────────────────────────────── */
function Dot({ state }: { state: 'idle' | 'fail' | 'fallback' | 'healed' }) {
  const cls =
    state === 'fail'     ? 'bg-fail'
    : state === 'fallback' ? 'bg-spark'
    : state === 'healed'   ? 'bg-success'
    : 'bg-success/35';

  const scale =
    state === 'fail'     ? 1.8
    : state === 'fallback' ? 2.2
    : state === 'healed'   ? 1.6
    : 1;

  const z = state === 'idle' ? 0 : 5;

  const shadow =
    state === 'fail'     ? '0 0 6px 1px rgb(var(--c-fail) / 0.7)'
    : state === 'fallback' ? '0 0 9px 2px rgb(var(--c-spark) / 0.8)'
    : state === 'healed'   ? '0 0 8px 1.5px rgb(var(--c-success) / 0.7)'
    : 'none';

  return (
    <span
      className={`block w-1.5 h-1.5 rounded-full transition-all duration-200 ${cls}`}
      style={{
        transform: `scale(${scale})`,
        zIndex: z,
        boxShadow: shadow,
      }}
    />
  );
}
