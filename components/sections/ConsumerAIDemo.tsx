'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   ConsumerAIDemo — the 5-second story for /usecases/consumer-ai.

   Cycles through three concrete consumer-app moments — image, video, audio —
   each with a typed user prompt on the left and an animated mock output on
   the right. The narrative: "you describe a thing; we ship the thing,
   regardless of which provider was up that minute."

   ~9.6s loop, three scenes × 3.2s each:
     idle         400ms  reset
     image scene  3000ms (type, generate, render)
     video scene  3000ms
     audio scene  3000ms
────────────────────────────────────────────────────────────────────────── */

type Scene = 'image' | 'video' | 'audio';
type Phase = 'idle' | Scene;

const SCENE_DURATION = 3000;
const SCENES: Scene[] = ['image', 'video', 'audio'];
const TOTAL_LOOP = 400 + SCENES.length * SCENE_DURATION;

type SceneCfg = {
  key: Scene;
  app: string;
  prompt: string;
  modality: string;
  model: string;
  ms: number;
  pieces: string[];
};

const SCENE_DATA: Record<Scene, SceneCfg> = {
  image: {
    key: 'image',
    app: 'avatar generator',
    prompt: 'cyberpunk portrait of me, neon city',
    modality: 'image',
    model: 'flux-2-pro',
    ms: 1840,
    pieces: ['each::router', 'each::enhancer', 'each::trace'],
  },
  video: {
    key: 'video',
    app: 'bedtime story video',
    prompt: 'a brave bunny sails to the moon',
    modality: 'video · 9:16',
    model: 'kling-v3',
    ms: 4220,
    pieces: ['each::workflows', 'each::router', 'each::trace'],
  },
  audio: {
    key: 'audio',
    app: 'AI voice cover',
    prompt: 'sing the chorus in a smoky jazz tone',
    modality: 'audio · 44.1kHz',
    model: 'eleven-v3',
    ms: 1180,
    pieces: ['each::ab', 'each::trace'],
  },
};

export function ConsumerAIDemo() {
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
      let acc = 400;
      for (const s of SCENES) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => setPhase(s), at));
        acc += SCENE_DURATION;
      }
    }

    tick();
    const id = setInterval(tick, TOTAL_LOOP);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

  const cfg = phase === 'idle' ? SCENE_DATA.image : SCENE_DATA[phase];

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
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
              CONSUMER · LIVE
            </span>
          </div>
          <SceneTabs phase={phase} />
        </div>

        {/* App name */}
        <div className="px-4 md:px-5 pt-3 pb-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cfg.key}-app`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="font-mono text-[10px] uppercase tracking-eyebrow text-spark"
            >
              ◐ your app · {cfg.app}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Input → output split */}
        <div className="px-4 md:px-5 pt-2 pb-3 grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
          {/* Input */}
          <div className="bg-bg border border-rule2 rounded-md p-3 flex flex-col gap-2 min-h-[140px]">
            <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
              input
            </div>
            <PromptText scene={cfg.key} prompt={cfg.prompt} />
          </div>

          {/* Arrow + run indicator */}
          <RunArrow phase={phase} cfg={cfg} />

          {/* Output */}
          <div className="bg-bg border border-rule2 rounded-md p-3 flex flex-col gap-2 min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
                output
              </span>
              <span className="font-mono text-[9px] uppercase tracking-eyebrow text-spark">
                {cfg.modality}
              </span>
            </div>
            <OutputViz scene={cfg.key} active={phase !== 'idle'} />
          </div>
        </div>

        {/* Pieces strip */}
        <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-ink3 uppercase tracking-eyebrow whitespace-nowrap">
              behind the scenes
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${cfg.key}-pieces`}
                  initial={{ opacity: 0, x: -3 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 3 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {cfg.pieces.map((p, i) => (
                    <PiecePill key={p} name={p} delay={i * 0.06} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        image · video · audio · one each.run() · one trace
      </div>
    </div>
  );
}

/* ── Scene tabs (image / video / audio) — only the active one is lit ────── */

function SceneTabs({ phase }: { phase: Phase }) {
  return (
    <div className="flex items-center gap-1.5">
      {SCENES.map((s) => (
        <span
          key={s}
          className={`font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 rounded transition-colors ${
            phase === s
              ? 'text-spark border border-spark/55 bg-spark/[0.05]'
              : 'text-ink3 border border-transparent'
          }`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

/* ── Prompt text — fake typewriter on each scene change ─────────────────── */

function PromptText({ scene, prompt }: { scene: Scene; prompt: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${scene}-prompt`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="font-mono text-[12px] text-ink leading-[1.55]"
      >
        <Typewriter text={`"${prompt}"`} speedMs={28} />
      </motion.div>
    </AnimatePresence>
  );
}

function Typewriter({ text, speedMs }: { text: string; speedMs: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => {
      setN((prev) => (prev >= text.length ? prev : prev + 1));
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);
  const visible = text.slice(0, n);
  const done = n >= text.length;
  return (
    <span>
      {visible}
      {!done && (
        <motion.span
          className="inline-block w-[6px] h-[12px] bg-spark align-middle ml-0.5"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          aria-hidden
        />
      )}
    </span>
  );
}

/* ── Run arrow — shows the model + ms while a scene is active ───────────── */

function RunArrow({ phase, cfg }: { phase: Phase; cfg: SceneCfg }) {
  const visible = phase !== 'idle';
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-1">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={`${cfg.key}-arrow`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3 whitespace-nowrap">
              each.run()
            </span>
            <motion.span
              className="text-spark text-[18px]"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              aria-hidden
            >
              →
            </motion.span>
            <span className="font-mono text-[9px] tabular-nums text-spark whitespace-nowrap">
              {cfg.model}
            </span>
            <span className="font-mono text-[9px] tabular-nums text-ink3 whitespace-nowrap">
              {cfg.ms}ms
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Output visualizations — image / video / audio ──────────────────────── */

function OutputViz({ scene, active }: { scene: Scene; active: boolean }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.22 }}
        className="flex-1 flex items-center justify-center"
      >
        {scene === 'image' && <ImageOutput active={active} />}
        {scene === 'video' && <VideoOutput active={active} />}
        {scene === 'audio' && <AudioOutput active={active} />}
      </motion.div>
    </AnimatePresence>
  );
}

/* Image — gradient placeholder with a slowly emerging "subject" silhouette. */
function ImageOutput({ active }: { active: boolean }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden border border-rule2">
      {/* Background gradient evoking a cyberpunk skyline */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--c-highlight) / 0.6) 0%, rgb(var(--c-spark) / 0.55) 60%, rgb(var(--c-sun) / 0.5) 100%)',
        }}
      />
      {/* Skyline silhouette */}
      <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          d="M0 60 L0 50 L8 50 L8 38 L14 38 L14 30 L22 30 L22 42 L28 42 L28 22 L36 22 L36 36 L44 36 L44 28 L52 28 L52 18 L60 18 L60 32 L70 32 L70 24 L80 24 L80 36 L92 36 L92 30 L100 30 L100 60 Z"
          fill="rgb(var(--c-bg) / 0.7)"
          stroke="rgb(var(--c-bg))"
          strokeWidth="0.3"
        />
      </svg>
      {/* Subject portrait silhouette */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{ left: '50%', top: '52%', transform: 'translate(-50%, -50%)' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden>
          <circle cx="30" cy="22" r="11" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-spark))" strokeWidth="1.5" />
          <path d="M10 60 C10 42 50 42 50 60" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-spark))" strokeWidth="1.5" />
        </svg>
      </motion.div>
      {/* Bottom label */}
      <div className="absolute bottom-1 left-1 font-mono text-[8px] uppercase tracking-eyebrow text-bg bg-ink/60 px-1 rounded">
        1024 × 768
      </div>
    </div>
  );
}

/* Video — three keyframes scrolling left to right with a play head. */
function VideoOutput({ active }: { active: boolean }) {
  return (
    <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border border-rule2 bg-surface2">
      {/* Three "keyframes" */}
      <div className="absolute inset-0 grid grid-cols-3 gap-[1px]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.18 }}
            className="relative"
            style={{
              background: i === 0
                ? 'linear-gradient(135deg, rgb(var(--c-highlight) / 0.55), rgb(var(--c-spark) / 0.4))'
                : i === 1
                ? 'linear-gradient(135deg, rgb(var(--c-spark) / 0.55), rgb(var(--c-sun) / 0.5))'
                : 'linear-gradient(135deg, rgb(var(--c-sun) / 0.55), rgb(var(--c-highlight) / 0.5))',
            }}
          >
            {/* "Bunny" silhouette */}
            <motion.div
              className="absolute"
              animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
              style={{ left: `${30 + i * 5}%`, top: '40%' }}
            >
              <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden>
                <circle cx="11" cy="14" r="6" fill="rgb(var(--c-bg))" />
                <ellipse cx="7" cy="6" rx="2" ry="5" fill="rgb(var(--c-bg))" />
                <ellipse cx="15" cy="6" rx="2" ry="5" fill="rgb(var(--c-bg))" />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>
      {/* Play head sweep */}
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-spark"
        initial={{ left: '0%' }}
        animate={{ left: active ? ['0%', '100%'] : '0%' }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 6px rgb(var(--c-spark) / 0.7)' }}
        aria-hidden
      />
      <div className="absolute bottom-1 left-1 font-mono text-[8px] uppercase tracking-eyebrow text-bg bg-ink/60 px-1 rounded">
        9:16 · 4.2s
      </div>
    </div>
  );
}

/* Audio — animated waveform with a sweeping play head. */
function AudioOutput({ active }: { active: boolean }) {
  // Pre-randomized but stable bar heights
  const BARS = [40, 64, 80, 56, 90, 70, 50, 88, 72, 58, 84, 64, 46, 78, 90, 60, 72, 52, 84, 68, 50, 82, 64, 46, 76, 88];

  return (
    <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border border-rule2 bg-bg flex items-center justify-center">
      <div className="flex items-end gap-[2px] h-[60%] px-3">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="block bg-spark rounded-sm"
            style={{ width: '3px' }}
            initial={{ height: '8%' }}
            animate={{
              height: active ? [`${h * 0.4}%`, `${h}%`, `${h * 0.6}%`] : '8%',
              opacity: active ? [0.5, 1, 0.7] : 0.3,
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.04,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <motion.div
        className="absolute top-2 bottom-2 w-px bg-highlight"
        initial={{ left: '6%' }}
        animate={{ left: active ? ['6%', '94%'] : '6%' }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 4px rgb(var(--c-highlight) / 0.7)' }}
        aria-hidden
      />
      <div className="absolute bottom-1 left-1 font-mono text-[8px] uppercase tracking-eyebrow text-ink bg-bg/80 px-1 rounded border border-rule2">
        wav · 1.2 MB
      </div>
    </div>
  );
}

/* ── Piece pill — used in the bottom strip and other places ─────────────── */

function PiecePill({ name, delay = 0 }: { name: string; delay?: number }) {
  // Renders the each:: prefix with the colon dots, like the wordmark.
  const stripped = name.startsWith('each::') ? name.slice(6) : name;
  return (
    <motion.span
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="inline-flex items-center font-mono text-[9px] text-spark border border-spark/45 bg-spark/[0.04] rounded px-1.5 py-[2px]"
    >
      <span className="text-ink2">each</span>
      <span
        aria-hidden
        className="inline-flex items-center"
        style={{ gap: '0.18em', margin: '0 0.18em' }}
      >
        <ColonPair />
        <ColonPair />
      </span>
      <span>{stripped}</span>
    </motion.span>
  );
}

function ColonPair() {
  return (
    <span className="inline-flex flex-col" style={{ gap: '0.18em' }}>
      <span className="block bg-spark" style={{ width: '0.22em', height: '0.22em' }} />
      <span className="block bg-spark" style={{ width: '0.22em', height: '0.22em' }} />
    </span>
  );
}
