'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   PlatformBento — asymmetric grid of 6 products with mini-animations.
────────────────────────────────────────────────────────────────────────── */

type Tile = {
  name: string;
  tagline: string;
  href: string;
  accent: 'spark' | 'highlight' | 'success' | 'sun' | 'yellow' | 'ember';
  /** Tailwind grid placement (mobile stacks to 1-col). */
  spanClass: string;
  visual: React.ReactNode;
  layer: 'RUN' | 'OBSERVE';
};

const ACCENT: Record<Tile['accent'], { var: string; tint: string }> = {
  spark:     { var: 'rgb(var(--c-spark))',     tint: 'rgb(var(--c-spark)     / 0.10)' },
  highlight: { var: 'rgb(var(--c-highlight))', tint: 'rgb(var(--c-highlight) / 0.10)' },
  success:   { var: 'rgb(var(--c-success))',   tint: 'rgb(var(--c-success)   / 0.10)' },
  sun:       { var: 'rgb(var(--c-sun))',       tint: 'rgb(var(--c-sun)       / 0.10)' },
  yellow:    { var: 'rgb(var(--c-yellow))',    tint: 'rgb(var(--c-yellow)    / 0.10)' },
  ember:     { var: 'rgb(var(--c-ember))',     tint: 'rgb(var(--c-ember)     / 0.10)' },
};

/* ── Visuals — small motion vignettes per tile ─────────────────────────── */

function RouterVisual() {
  // Branch animation: main path on top, fallback path beneath, packet alternates
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      <path d="M 10 40 L 90 40 Q 110 40 120 22 L 190 22" stroke="rgb(var(--c-fail) / 0.6)" strokeWidth="1.5" fill="none" strokeDasharray="3 4" />
      <path d="M 10 40 L 90 40 Q 110 40 120 58 L 190 58" stroke="rgb(var(--c-success))" strokeWidth="1.5" fill="none" />
      <motion.circle
        r="2.5"
        fill="rgb(var(--c-spark))"
        animate={{
          cx: [10, 90, 120, 190],
          cy: [40, 40, 58, 58],
          opacity: [1, 1, 1, 0],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
      />
      <text x="195" y="18" fontSize="7" textAnchor="end" fill="rgb(var(--c-fail) / 0.7)" fontFamily="ui-monospace">primary · 503</text>
      <text x="195" y="76" fontSize="7" textAnchor="end" fill="rgb(var(--c-success))" fontFamily="ui-monospace">fallback · 200</text>
    </svg>
  );
}

function WorkflowsVisual() {
  // 4 connected nodes, sequential pulse
  const nodes = [25, 75, 125, 175];
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full">
      <path d="M 25 40 L 175 40" stroke="rgb(var(--c-rule2))" strokeWidth="1" />
      {nodes.map((cx, i) => (
        <motion.circle
          key={i}
          cx={cx} cy={40} r={6}
          stroke="rgb(var(--c-spark))" strokeWidth="1.2" fill="rgb(var(--c-bg))"
          animate={{
            fill: ['rgb(var(--c-bg))', 'rgb(var(--c-spark))', 'rgb(var(--c-bg))'],
          }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1], delay: i * 0.4 }}
        />
      ))}
      {nodes.map((cx, i) => (
        <text key={i} x={cx} y={62} fontSize="6.5" textAnchor="middle" fill="rgb(var(--c-ink3))" fontFamily="ui-monospace">
          {['enhance', 'gen', 'voice', 'compose'][i]}
        </text>
      ))}
    </svg>
  );
}

function EnhancerVisual() {
  // "a cat" → "a tabby cat in golden hour…" text morph
  return (
    <div className="flex flex-col gap-3 font-mono text-[10px] w-full h-full justify-center">
      <div className="flex items-center gap-2 text-ink3">
        <span className="text-spark">›</span>
        <motion.span
          animate={{ opacity: [1, 1, 0.3, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.4, 0.5, 1] }}
        >
          "a cat"
        </motion.span>
      </div>
      <motion.span
        className="text-spark text-center text-[14px]"
        animate={{ opacity: [0, 0, 1, 1, 0], y: [0, 0, 0, 0, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.45, 0.55, 0.85, 1] }}
      >
        ↓
      </motion.span>
      <div className="flex items-start gap-2 text-ink2">
        <span className="text-spark">›</span>
        <motion.span
          className="leading-tight"
          animate={{ opacity: [0, 0, 1, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.55, 0.7, 1] }}
        >
          "a tabby cat in golden hour, shallow depth of field…"
        </motion.span>
      </div>
    </div>
  );
}

function TraceVisual() {
  // Mini trace rows
  const rows = [
    { kind: 'ok',   step: 'enhance',   t: '0.4s' },
    { kind: 'fail', step: 'primary',   t: '—' },
    { kind: 'ok',   step: 'fallback',  t: '5.6s' },
    { kind: 'ok',   step: 'compose',   t: '0.6s' },
  ];
  const dot = (k: string) =>
    k === 'ok' ? 'bg-success' : k === 'fail' ? 'bg-fail' : 'bg-ink3';
  return (
    <div className="flex flex-col gap-1 font-mono text-[9.5px] w-full">
      {rows.map((r, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 px-2 py-1 bg-bg/40 rounded"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: [0, 1, 1, 0.4, 0], x: [-4, 0, 0, 0, -4] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.15 + i * 0.08, 0.7, 0.85, 1],
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dot(r.kind)}`} aria-hidden />
          <span className="text-ink truncate flex-1">{r.step}</span>
          <span className="text-ink3 tabular-nums">{r.t}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Tiles ──────────────────────────────────────────────────────────────── */

const TILES: Tile[] = [
  {
    name: 'each::router',
    tagline: 'Pick the best model. Route around the broken one.',
    href: '/router',
    accent: 'spark',
    layer: 'RUN',
    spanClass: 'lg:col-span-2 lg:row-span-2',
    visual: <RouterVisual />,
  },
  {
    name: 'each::trace',
    tagline: 'Per-call attribution. Live.',
    href: '/trace',
    accent: 'highlight',
    layer: 'OBSERVE',
    spanClass: 'lg:col-span-1 lg:row-span-1',
    visual: <TraceVisual />,
  },
  {
    name: 'each::enhancer',
    tagline: 'Same prompt. Better output. Every model.',
    href: '/enhancer',
    accent: 'success',
    layer: 'RUN',
    spanClass: 'lg:col-span-1 lg:row-span-1',
    visual: <EnhancerVisual />,
  },
  {
    name: 'each::workflows',
    tagline: 'Chain models. Version. Rollback.',
    href: '/workflows',
    accent: 'spark',
    layer: 'RUN',
    spanClass: 'lg:col-span-3 lg:row-span-1',
    visual: <WorkflowsVisual />,
  },
];

function BentoTile({ tile, idx }: { tile: Tile; idx: number }) {
  const accent = ACCENT[tile.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`group relative bg-surface border border-rule2 rounded-md overflow-hidden hover:[border-color:var(--c)] transition-colors ${tile.spanClass}`}
      style={{ ['--c' as string]: accent.var }}
    >
      <Link href={tile.href} className="block h-full p-6 md:p-7 flex flex-col">
        {/* Layer eyebrow */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-mono text-[10px] uppercase tracking-eyebrow"
            style={{ color: accent.var }}
          >
            {tile.layer}
          </span>
          <ArrowRight
            size={14}
            className="text-ink3 group-hover:translate-x-0.5 transition-transform"
            style={{ color: undefined }}
          />
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-[20px] md:text-[24px] leading-tight text-ink">
          <EachLabel name={tile.name} />
        </h3>

        {/* Tagline */}
        <p className="text-ink2 text-[13.5px] leading-[1.55] mt-2 max-w-[440px]">
          {tile.tagline}
        </p>

        {/* Visual area — flexible height */}
        <div
          className="mt-5 flex-1 min-h-[100px] md:min-h-[120px] rounded-sm border flex items-center justify-center px-3 py-3"
          style={{
            background: `linear-gradient(135deg, ${accent.tint}, transparent)`,
            borderColor: 'rgb(var(--c-rule2))',
          }}
        >
          {tile.visual}
        </div>
      </Link>
    </motion.div>
  );
}

export function PlatformBento() {
  return (
    <section className="relative border-t border-rule overflow-hidden">
      {/* Soft accent backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 50% at 0% 0%, rgb(var(--c-spark) / 0.05), transparent 60%), radial-gradient(ellipse 40% 50% at 100% 100%, rgb(var(--c-highlight) / 0.05), transparent 60%)',
        }}
      />

      <div className="container py-24 md:py-28 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● THE PLATFORM
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink max-w-[800px]">
          Four products. Two layers. <span className="text-ink3 italic">One control plane.</span>
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.6] max-w-[620px] mt-5">
          Each tile is a real product, used in production today. Click any of them to see how it
          works on its own — or how it pairs with the rest.
        </p>

        {/* Bento grid — 3 cols × 3 rows on lg, stacks on mobile */}
        <div
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(3,minmax(0,1fr))] gap-3 md:gap-4 auto-rows-[180px] lg:auto-rows-auto"
        >
          {TILES.map((tile, i) => (
            <BentoTile key={tile.name} tile={tile} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
