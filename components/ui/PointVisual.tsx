'use client';

import { motion } from 'framer-motion';
import type { PointVisual as Kind } from '@/lib/products';

/* Tiny ambient animations for WHAT IT DOES / WHEN TO REACH FOR cards.
   Each visual is ~36×36 to ~48×24 — sits in the corner of a card. */

function Rings() {
  return (
    <div className="relative w-9 h-9">
      {[0, 4, 8].map((inset, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-spark/40"
          style={{ inset: `${inset}px` }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{
            duration: 2 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function Flow() {
  return (
    <svg viewBox="0 0 60 16" className="w-[60px] h-4">
      <line x1="2" y1="8" x2="58" y2="8" stroke="rgb(var(--c-rule2))" strokeWidth="1" />
      <motion.circle
        cy="8" r="2" fill="rgb(var(--c-spark))"
        initial={{ cx: 2, opacity: 0 }}
        animate={{ cx: [2, 58, 58], opacity: [0, 1, 0] }}
        transition={{ duration: 2.4, times: [0, 0.7, 1], repeat: Infinity, ease: 'linear' }}
        style={{ filter: 'drop-shadow(0 0 3px rgb(var(--c-spark) / 0.6))' }}
      />
    </svg>
  );
}

function Graph() {
  // Sparkline that draws + a dot at the active point.
  const path = 'M 2 14 L 12 9 L 22 11 L 32 6 L 42 8 L 52 4 L 58 5';
  return (
    <svg viewBox="0 0 60 18" className="w-[60px] h-[18px]">
      <motion.path
        d={path}
        fill="none"
        stroke="rgb(var(--c-spark))"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1] }}
        transition={{ duration: 2.6, times: [0, 0.7, 1], repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.circle
        r="1.8" fill="rgb(var(--c-spark))"
        initial={{ cx: 2, cy: 14, opacity: 0 }}
        animate={{
          cx: [2, 12, 22, 32, 42, 52, 58],
          cy: [14, 9, 11, 6, 8, 4, 5],
          opacity: [1, 1, 1, 1, 1, 1, 0],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

function Grid() {
  // Small dot grid that pulses with offset waves.
  return (
    <div className="grid grid-cols-5 gap-[3px] w-9">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.span
          key={i}
          className="block w-1 h-1 rounded-full bg-spark/40"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{
            duration: 1.6,
            delay: (i % 5) * 0.08 + Math.floor(i / 5) * 0.05,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function Diff() {
  // Git-style + and - lines that fade in alternately.
  return (
    <div className="font-mono text-[10px] leading-[1.3] flex flex-col gap-0.5 w-[64px]">
      <motion.div
        className="flex items-center gap-1 text-fail"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>−</span>
        <span className="h-px flex-1 bg-fail/50" />
      </motion.div>
      <motion.div
        className="flex items-center gap-1 text-success"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>+</span>
        <span className="h-px flex-1 bg-success/50" />
      </motion.div>
      <motion.div
        className="flex items-center gap-1 text-success"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>+</span>
        <span className="h-px flex-1 bg-success/50" />
      </motion.div>
    </div>
  );
}

function Tags() {
  // Small pill tags appearing in stagger.
  const tags = ['user', 'tier', 'region'];
  return (
    <div className="flex flex-wrap gap-1 w-[80px] justify-end">
      {tags.map((t, i) => (
        <motion.span
          key={t}
          className="inline-block px-1.5 py-0.5 rounded border border-spark/40 text-spark font-mono text-[8.5px] uppercase tracking-eyebrow"
          animate={{ opacity: [0.2, 1, 1, 0.2], scale: [0.85, 1, 1, 0.85] }}
          transition={{
            duration: 3,
            times: [0, 0.15 + i * 0.1, 0.7, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {t}
        </motion.span>
      ))}
    </div>
  );
}

function Swap() {
  // Two model names cross-fading in place.
  return (
    <div className="relative font-mono text-[10px] w-[68px] h-4">
      <motion.span
        className="absolute inset-0 text-spark text-right whitespace-nowrap overflow-hidden"
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ duration: 3, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity }}
      >
        kling-v3
      </motion.span>
      <motion.span
        className="absolute inset-0 text-spark text-right whitespace-nowrap overflow-hidden"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.4, 0.5, 0.9, 1], repeat: Infinity }}
      >
        wan-2.7
      </motion.span>
    </div>
  );
}

function Pulse() {
  return (
    <div className="relative w-9 h-9 flex items-center justify-center">
      <motion.span
        className="absolute w-3 h-3 rounded-full bg-spark"
        animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.span
        className="relative w-2 h-2 rounded-full bg-spark"
        animate={{ opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: '0 0 6px rgb(var(--c-spark) / 0.8)' }}
      />
    </div>
  );
}

export function PointVisual({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'rings': return <Rings />;
    case 'flow':  return <Flow />;
    case 'graph': return <Graph />;
    case 'grid':  return <Grid />;
    case 'diff':  return <Diff />;
    case 'tags':  return <Tags />;
    case 'swap':  return <Swap />;
    case 'pulse': return <Pulse />;
  }
}
