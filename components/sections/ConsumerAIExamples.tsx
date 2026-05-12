'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   ConsumerAIExamples — 6 concrete consumer-app scenarios with mini
   input → output animations + the each::labs pieces each one uses.

   The point: a visitor scans, recognizes their app type, sees what the input
   and output actually look like, and walks away with "ah — that's mine."
────────────────────────────────────────────────────────────────────────── */

type Example = {
  app: string;
  tagline: string;
  input: { kind: 'photo' | 'text' | 'audio'; label: string };
  output: { kind: 'image' | 'image-styled' | 'video' | 'audio' | 'edited' | 'parallel'; label: string };
  pieces: string[];
};

const EXAMPLES: Example[] = [
  {
    app: 'avatar generator',
    tagline: 'Selfie in. Stylized portrait out. 4 looks per session.',
    input: { kind: 'photo', label: 'user selfie' },
    output: { kind: 'parallel', label: '4 styles · parallel' },
    pieces: ['each::workflows', 'each::router', 'each::trace'],
  },
  {
    app: 'bedtime story video',
    tagline: 'A kid types a story. Out comes a 9:16 narrated video.',
    input: { kind: 'text', label: '"a brave bunny..."' },
    output: { kind: 'video', label: 'video · 9:16' },
    pieces: ['each::workflows', 'each::enhancer', 'each::router'],
  },
  {
    app: 'AI voice cover',
    tagline: 'Your voice + their lyrics. Cohort A vs B, auto-promote.',
    input: { kind: 'audio', label: 'voice sample' },
    output: { kind: 'audio', label: 'cover · 44.1kHz' },
    pieces: ['each::ab', 'each::router', 'each::trace'],
  },
  {
    app: 'kid-safe image gen',
    tagline: 'A risky prompt becomes a safe one — output ships either way.',
    input: { kind: 'text', label: '"…with realistic blood"' },
    output: { kind: 'image-styled', label: 'safe rewrite · shipped' },
    pieces: ['each::enhancer', 'each::trace'],
  },
  {
    app: 'AI photo editor',
    tagline: '"remove this" / "make it sunset" — mask + edit in one call.',
    input: { kind: 'photo', label: 'photo + brush' },
    output: { kind: 'edited', label: 'edited image' },
    pieces: ['each::router', 'each::workflows'],
  },
  {
    app: 'profile pic stylizer',
    tagline: 'One photo, 4 brand-safe styles, billed per-user.',
    input: { kind: 'photo', label: 'one photo' },
    output: { kind: 'parallel', label: '4 outputs · parallel' },
    pieces: ['each::workflows', 'each::attributes', 'each::trace'],
  },
];

export function ConsumerAIExamples() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● EXAMPLES · IN YOUR APP
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Six things you can ship by next week.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Concrete consumer-app scenarios — each with a real input, an animated
        output, and the platform pieces that make the chaos behind it disappear.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-12">
        {EXAMPLES.map((ex, i) => (
          <ExampleCard key={ex.app} ex={ex} idx={i} />
        ))}
      </div>
    </section>
  );
}

/* ── Card shell ─────────────────────────────────────────────────────────── */

function ExampleCard({ ex, idx }: { ex: Example; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.36, delay: (idx % 3) * 0.05 }}
      className="bg-surface border border-rule2 rounded-md p-5 md:p-6 flex flex-col gap-4 hover:border-spark/40 transition-colors"
    >
      <div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mb-2">
          ◐ your app
        </div>
        <h3 className="font-display font-semibold text-[18px] text-ink leading-snug">
          {ex.app}
        </h3>
        <p className="text-ink2 text-[12.5px] leading-[1.55] mt-2">{ex.tagline}</p>
      </div>

      {/* In/out panel */}
      <div className="grid grid-cols-[1fr_auto_1.2fr] gap-2 items-stretch">
        <InputPanel kind={ex.input.kind} label={ex.input.label} />
        <Arrow />
        <OutputPanel kind={ex.output.kind} label={ex.output.label} />
      </div>

      {/* Pieces */}
      <div className="flex flex-wrap items-center gap-1.5">
        {ex.pieces.map((p) => (
          <PieceTag key={p} name={p} />
        ))}
      </div>
    </motion.div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center px-1">
      <motion.span
        className="text-spark text-[16px]"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        aria-hidden
      >
        →
      </motion.span>
    </div>
  );
}

/* ── Input panels ───────────────────────────────────────────────────────── */

function InputPanel({ kind, label }: { kind: Example['input']['kind']; label: string }) {
  return (
    <div className="bg-bg border border-rule2 rounded-md px-2 py-2 flex flex-col gap-1.5 min-h-[88px] justify-center">
      <div className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">
        input
      </div>
      <div className="flex-1 flex items-center justify-center">
        {kind === 'photo'  && <PhotoIcon />}
        {kind === 'text'   && <TextInputIcon label={label} />}
        {kind === 'audio'  && <AudioInputIcon />}
      </div>
      {kind !== 'text' && (
        <div className="font-mono text-[9px] text-ink2 text-center truncate">{label}</div>
      )}
    </div>
  );
}

function PhotoIcon() {
  return (
    <motion.svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      aria-hidden
    >
      <rect x="3" y="6" width="34" height="28" rx="2" fill="rgb(var(--c-surface2))" stroke="rgb(var(--c-rule2))" strokeWidth="1" />
      <circle cx="14" cy="16" r="3" fill="rgb(var(--c-spark) / 0.7)" />
      <path d="M3 30 L14 21 L24 28 L30 23 L37 30 L37 34 L3 34 Z" fill="rgb(var(--c-rule2))" />
    </motion.svg>
  );
}

function TextInputIcon({ label }: { label: string }) {
  return (
    <div className="font-mono text-[10px] text-ink leading-tight px-1 italic">
      {label}
      <motion.span
        className="inline-block w-[5px] h-[10px] bg-spark align-middle ml-0.5"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        aria-hidden
      />
    </div>
  );
}

function AudioInputIcon() {
  const BARS = [40, 70, 55, 85, 60, 75, 50];
  return (
    <div className="flex items-end gap-[2px] h-[28px]">
      {BARS.map((h, i) => (
        <motion.span
          key={i}
          className="block bg-spark rounded-sm"
          style={{ width: '3px' }}
          animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.5}%`] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.06 }}
        />
      ))}
    </div>
  );
}

/* ── Output panels ──────────────────────────────────────────────────────── */

function OutputPanel({ kind, label }: { kind: Example['output']['kind']; label: string }) {
  return (
    <div className="bg-bg border border-rule2 rounded-md px-2 py-2 flex flex-col gap-1.5 min-h-[88px] justify-center">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">
          output
        </span>
        <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark truncate ml-1">
          {label}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {kind === 'image'         && <ImageMockOutput />}
        {kind === 'image-styled'  && <SafeImageOutput />}
        {kind === 'video'         && <VideoMockOutput />}
        {kind === 'audio'         && <AudioMockOutput />}
        {kind === 'edited'        && <EditedImageOutput />}
        {kind === 'parallel'      && <ParallelImageOutput />}
      </div>
    </div>
  );
}

function ImageMockOutput() {
  return (
    <motion.div
      className="w-full aspect-[4/3] rounded border border-rule2 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgb(var(--c-spark) / 0.5), rgb(var(--c-highlight) / 0.5))',
      }}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.4, repeat: Infinity }}
      aria-hidden
    />
  );
}

function SafeImageOutput() {
  return (
    <div className="w-full aspect-[4/3] relative rounded border border-success/45 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgb(var(--c-success) / 0.45), rgb(var(--c-highlight) / 0.4))' }}
      />
      <motion.div
        className="absolute top-1 right-1 font-mono text-[8px] uppercase tracking-eyebrow text-success bg-bg/85 border border-success/55 rounded px-1 py-[1px]"
        animate={{ opacity: [0, 1, 1] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 1] }}
      >
        ✓ rescued
      </motion.div>
    </div>
  );
}

function VideoMockOutput() {
  return (
    <div className="w-full aspect-[16/9] rounded border border-rule2 grid grid-cols-3 gap-[1px] overflow-hidden">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="relative"
          style={{
            background: i === 0
              ? 'linear-gradient(135deg, rgb(var(--c-highlight) / 0.55), rgb(var(--c-spark) / 0.4))'
              : i === 1
              ? 'linear-gradient(135deg, rgb(var(--c-spark) / 0.55), rgb(var(--c-sun) / 0.5))'
              : 'linear-gradient(135deg, rgb(var(--c-sun) / 0.55), rgb(var(--c-highlight) / 0.5))',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function AudioMockOutput() {
  const BARS = [40, 64, 80, 56, 90, 70, 50, 88, 72, 58, 84, 64, 46, 78, 90, 60];
  return (
    <div className="w-full h-[40px] flex items-end gap-[1.5px]">
      {BARS.map((h, i) => (
        <motion.span
          key={i}
          className="flex-1 bg-spark rounded-sm"
          style={{ minWidth: 0 }}
          animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.5}%`] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.04 }}
        />
      ))}
    </div>
  );
}

function EditedImageOutput() {
  return (
    <div className="relative w-full aspect-[4/3] rounded border border-rule2 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgb(var(--c-sun) / 0.55), rgb(var(--c-spark) / 0.45))' }}
      />
      {/* Mask "shimmer" diagonal sweep */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(110deg, transparent 30%, rgb(var(--c-bg) / 0.5) 50%, transparent 70%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      />
    </div>
  );
}

function ParallelImageOutput() {
  return (
    <div className="w-full grid grid-cols-2 gap-[2px] aspect-[2/1.4]">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="rounded-sm"
          style={{
            background:
              i === 0 ? 'linear-gradient(135deg, rgb(var(--c-spark) / 0.5), rgb(var(--c-sun) / 0.5))'
              : i === 1 ? 'linear-gradient(135deg, rgb(var(--c-highlight) / 0.5), rgb(var(--c-spark) / 0.4))'
              : i === 2 ? 'linear-gradient(135deg, rgb(var(--c-sun) / 0.5), rgb(var(--c-success) / 0.4))'
              : 'linear-gradient(135deg, rgb(var(--c-highlight) / 0.5), rgb(var(--c-success) / 0.4))',
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
        />
      ))}
    </div>
  );
}

/* ── Piece tag — same logo style as EachLabel ───────────────────────────── */

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
