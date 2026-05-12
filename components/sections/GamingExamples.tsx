'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

type Example = {
  app: string;
  tagline: string;
  badge: string;
  pieces: string[];
};

const EXAMPLES: Example[] = [
  {
    app: 'localized VO · 30 languages',
    tagline: 'One line in EN → consistent character voice in 30 languages, lip-sync ready.',
    badge: '30 langs · 1 voice',
    pieces: ['each::workflows', 'each::router', 'each::trace'],
  },
  {
    app: 'texture variants on demand',
    tagline: 'Base material → 4 weather/season variants. Drop in for live events.',
    badge: '4 variants · parallel',
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    app: 'NPC dialogue trees',
    tagline: 'Character profile + scene → 50 dialogue variants. Personality stays.',
    badge: '50 lines · 1 voice',
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    app: 'event music cue',
    tagline: 'Mood + theme → 30s loop, auto-stitched to gameplay tempo.',
    badge: '30s · loopable',
    pieces: ['each::workflows', 'each::trace'],
  },
  {
    app: 'one-click rollback',
    tagline: 'v3.3 broke the level → roll back to v3.2. No redeploy. Players unaware.',
    badge: 'rollback · 1 string',
    pieces: ['each::workflows', 'each::trace'],
  },
  {
    app: 'on-prem for sensitive IP',
    tagline: 'Same SDK, same dashboard, deployed inside your VPC. No data egress.',
    badge: 'VPC · enterprise',
    pieces: ['each::workflows', 'each::router'],
  },
];

export function GamingExamples() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● EXAMPLES · YOUR LIVE-OPS PIPELINE
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Six things your live-ops calendar can ship before next event.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Concrete game-asset pipelines — every one tuned for live-event speed,
        every one rollback-safe, every one tagged with the workflow version
        that produced it.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-12">
        {EXAMPLES.map((ex, i) => (
          <ExampleCard key={ex.app} ex={ex} idx={i} />
        ))}
      </div>
    </section>
  );
}

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
          ◐ live-ops asset
        </div>
        <h3 className="font-mono font-semibold text-[14px] text-ink leading-snug">
          {ex.app}
        </h3>
        <p className="text-ink2 text-[12.5px] leading-[1.55] mt-2">{ex.tagline}</p>
      </div>

      {/* Pixel-blocks decoration + badge */}
      <div className="bg-bg border border-rule2 rounded-md p-3 flex items-center gap-3 min-h-[52px]">
        <PixelBlocks idx={idx} />
        <span className="font-mono text-[10px] text-spark uppercase tracking-eyebrow">
          {ex.badge}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {ex.pieces.map((p) => (
          <PieceTag key={p} name={p} />
        ))}
      </div>
    </motion.div>
  );
}

/* Pixel-art-ish decoration — 4×4 mini grid in the accent palette per card. */
function PixelBlocks({ idx }: { idx: number }) {
  const tones = ['spark', 'highlight', 'success', 'sun', 'ember', 'spark'];
  const tone = tones[idx % tones.length];
  const cells = [
    [0, 1, 1, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ];
  return (
    <div className="grid grid-cols-4 gap-[1px]" style={{ width: '32px', height: '32px' }}>
      {cells.flat().map((v, i) => (
        <motion.div
          key={i}
          className="aspect-square"
          style={{
            backgroundColor: v ? `rgb(var(--c-${tone}))` : 'rgb(var(--c-rule2))',
          }}
          animate={v ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={v ? { duration: 1.6, repeat: Infinity, delay: i * 0.05 } : {}}
        />
      ))}
    </div>
  );
}

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
