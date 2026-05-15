'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   PlatformBento, asymmetric grid of products with typography-driven
   micro-animations. Each tile has a subtle accent-tinted background so the
   grid doesn't feel like identical black boxes.
────────────────────────────────────────────────────────────────────────── */

type Tile = {
  name: string;
  tagline: string;
  href: string;
  accent: 'spark' | 'highlight' | 'success' | 'sun' | 'yellow' | 'ember';
  spanClass: string;
  layer: 'RUN' | 'OBSERVE';
  visual: React.ReactNode;
  comingSoon?: boolean;
};

const ACCENT: Record<Tile['accent'], { var: string; tint: string; deepTint: string }> = {
  spark:     { var: 'rgb(var(--c-spark))',     tint: 'rgb(var(--c-spark)     / 0.06)', deepTint: 'rgb(var(--c-spark)     / 0.12)' },
  highlight: { var: 'rgb(var(--c-highlight))', tint: 'rgb(var(--c-highlight) / 0.06)', deepTint: 'rgb(var(--c-highlight) / 0.12)' },
  success:   { var: 'rgb(var(--c-success))',   tint: 'rgb(var(--c-success)   / 0.06)', deepTint: 'rgb(var(--c-success)   / 0.12)' },
  sun:       { var: 'rgb(var(--c-sun))',       tint: 'rgb(var(--c-sun)       / 0.06)', deepTint: 'rgb(var(--c-sun)       / 0.12)' },
  yellow:    { var: 'rgb(var(--c-yellow))',    tint: 'rgb(var(--c-yellow)    / 0.06)', deepTint: 'rgb(var(--c-yellow)    / 0.12)' },
  ember:     { var: 'rgb(var(--c-ember))',     tint: 'rgb(var(--c-ember)     / 0.06)', deepTint: 'rgb(var(--c-ember)     / 0.12)' },
};

/* ──────────────────────────────────────────────────────────────────────────
   Typography micro-animations, same dev/mono aesthetic across all tiles.
────────────────────────────────────────────────────────────────────────── */

type RouterRowState = 'PICK' | 'STANDBY' | 'DOWN' | 'FALLBACK';

const ROUTER_ROWS: { name: string; pct: number; state: RouterRowState }[] = [
  { name: 'claude-opus-4',   pct: 94, state: 'PICK' },
  { name: 'gpt-4o',          pct: 91, state: 'STANDBY' },
  { name: 'gemini-2.0-pro',  pct: 88, state: 'STANDBY' },
  { name: 'kling-v3',        pct: 0,  state: 'DOWN' },
  { name: 'wan-2.7',         pct: 87, state: 'FALLBACK' },
];

function RouterRow({ row, i }: { row: (typeof ROUTER_ROWS)[number]; i: number }) {
  const tone =
    row.state === 'DOWN'     ? 'text-fail'
    : row.state === 'PICK'   ? 'text-spark'
    : row.state === 'FALLBACK' ? 'text-spark'
    : 'text-ink2';
  const barColor =
    row.state === 'DOWN'     ? 'bg-fail/70'
    : row.state === 'PICK'   ? 'bg-spark'
    : row.state === 'FALLBACK' ? 'bg-spark/70'
    : 'bg-ink2/60';
  const struck = row.state === 'DOWN' ? 'line-through decoration-fail/60' : '';

  return (
    <motion.div
      className="flex items-center gap-3 py-1.5"
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
    >
      <span className={`flex-1 truncate ${tone} ${struck}`}>{row.name}</span>
      <div className="w-[60px] md:w-[80px] h-[3px] bg-rule2 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${row.pct}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
        />
      </div>
      <span
        className={`w-[60px] md:w-[72px] text-right text-[9.5px] tracking-eyebrow uppercase ${tone}`}
      >
        {row.state === 'PICK' && (
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ textShadow: '0 0 8px rgb(var(--c-spark) / 0.5)' }}
          >
            {row.state}
          </motion.span>
        )}
        {row.state !== 'PICK' && row.state}
      </span>
    </motion.div>
  );
}

function RouterMini() {
  return (
    <div className="font-mono text-[11.5px] w-full flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-rule2 text-ink3 text-[9.5px] uppercase tracking-eyebrow">
        <span className="flex-1">CANDIDATE</span>
        <span className="w-[60px] md:w-[80px]">SCORE</span>
        <span className="w-[60px] md:w-[72px] text-right">STATE</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {ROUTER_ROWS.map((row, i) => (
          <RouterRow key={row.name} row={row} i={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-rule2 flex items-center justify-between text-[10px]">
        <span className="text-ink3">1.2M routes · 24h</span>
        <motion.span
          className="text-spark inline-flex items-center gap-1.5"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-spark" />
          routing live
        </motion.span>
      </div>
    </div>
  );
}

function WorkflowsMini() {
  // enhance → gen → voice → compose, sequential highlight
  const steps = ['enhance', 'gen', 'voice', 'compose'];
  return (
    <div className="font-mono text-[11.5px] flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => (
        <span key={s} className="flex items-center gap-2">
          <motion.span
            animate={{
              color: [
                'rgb(var(--c-ink3))',
                'rgb(var(--c-spark))',
                'rgb(var(--c-ink3))',
              ],
            }}
            transition={{
              duration: 2.4,
              times: [0, 0.5, 1],
              delay: i * 0.18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {s}
          </motion.span>
          {i < steps.length - 1 && <span className="text-ink3/60">→</span>}
        </span>
      ))}
    </div>
  );
}

function EnhancerMini() {
  // raw provider error rate (red) vs enhancer error rate (spark), animated reveal
  return (
    <div className="font-mono text-[11.5px] flex flex-col gap-1.5 w-full">
      <motion.div
        className="flex items-center gap-2"
        animate={{ opacity: [0.45, 1, 1, 0.4] }}
        transition={{ duration: 2.6, times: [0, 0.3, 0.7, 1], repeat: Infinity }}
      >
        <span className="text-ink3">raw</span>
        <span className="text-fail line-through decoration-fail/60 tabular-nums">12.4%</span>
        <span className="text-ink3 text-[10px]">err</span>
      </motion.div>
      <motion.div
        className="self-start ml-3 text-spark/70"
        animate={{ opacity: [0, 0, 1, 1, 0], y: [-4, -4, 0, 0, 4] }}
        transition={{ duration: 2.6, times: [0, 0.45, 0.55, 0.85, 1], repeat: Infinity }}
      >
        ↓ enhanced
      </motion.div>
      <motion.div
        className="flex items-center gap-2"
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ duration: 2.6, times: [0, 0.5, 0.7, 1], repeat: Infinity }}
      >
        <span className="text-ink3">each</span>
        <span
          className="text-spark tabular-nums"
          style={{ textShadow: '0 0 8px rgb(var(--c-spark) / 0.4)' }}
        >
          0.9%
        </span>
        <span className="text-spark text-[10px]">err · 12× lower</span>
      </motion.div>
    </div>
  );
}


/* ── Tiles ──────────────────────────────────────────────────────────────── */

const TILES: Tile[] = [
  {
    name: 'Router',
    tagline: 'Pick the best model. Route around the broken one.',
    href: '/router',
    accent: 'spark',
    layer: 'RUN',
    spanClass: 'lg:col-span-2 lg:row-span-2',
    visual: <RouterMini />,
  },
  {
    name: 'Enhancer',
    tagline: '12× fewer errors. Same model.',
    href: '/enhancer',
    accent: 'sun',
    layer: 'RUN',
    spanClass: 'lg:col-span-1 lg:row-span-1',
    visual: <EnhancerMini />,
  },
  {
    name: 'Workflows',
    tagline: 'Chain models. Version. Rollback.',
    href: '/workflows',
    accent: 'highlight',
    layer: 'RUN',
    spanClass: 'lg:col-span-1 lg:row-span-1',
    visual: <WorkflowsMini />,
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
      className={`group relative rounded-md border border-rule2 overflow-hidden hover:[border-color:var(--c)] transition-colors ${tile.spanClass}`}
      style={{
        ['--c' as string]: accent.var,
        // Subtle accent-tinted gradient over the surface, each tile feels its own color.
        background: `linear-gradient(135deg, ${accent.deepTint} 0%, rgb(var(--c-surface)) 50%, ${accent.tint} 100%)`,
      }}
    >
      <Link href={tile.href} className="block h-full p-5 md:p-6 flex flex-col">
        {/* Layer eyebrow + arrow + (optional) coming-soon */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] uppercase tracking-eyebrow"
              style={{ color: accent.var }}
            >
              {tile.layer}
            </span>
            {tile.comingSoon && (
              <span className="font-mono text-[8.5px] uppercase tracking-eyebrow px-1.5 py-px border border-yellow text-yellow rounded bg-yellow/10 leading-none">
                soon
              </span>
            )}
          </div>
          <ArrowRight
            size={14}
            className="text-ink3 group-hover:translate-x-0.5 transition-transform"
          />
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-[20px] md:text-[24px] leading-tight text-ink mt-4">
          {tile.name}
        </h3>

        {/* Tagline */}
        <p className="text-ink2 text-[13px] leading-[1.5] mt-1.5 max-w-[440px]">
          {tile.tagline}
        </p>

        {/* Visual area, typography-driven, expands to fill the tile */}
        <div
          className="mt-5 flex-1 flex items-center min-h-[64px]"
          aria-hidden
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
          Modular products. Two layers. <span className="text-ink3 italic">One control plane.</span>
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.6] max-w-[620px] mt-5">
          Each tile is a real product, used in production today. Click any of them to see how it
          works on its own, or how it pairs with the rest.
        </p>

        {/* Bento grid, 3 cols × 3 rows on lg, stacks on mobile */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[repeat(2,minmax(0,1fr))] gap-3 md:gap-4 auto-rows-[200px] lg:auto-rows-auto">
          {TILES.map((tile, i) => (
            <BentoTile key={tile.name} tile={tile} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
