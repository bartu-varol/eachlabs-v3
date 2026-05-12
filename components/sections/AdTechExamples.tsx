'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   AdTechExamples — 6 performance-marketing scenarios.
────────────────────────────────────────────────────────────────────────── */

type Example = {
  app: string;
  tagline: string;
  metric: { label: string; value: string };
  pieces: string[];
};

const EXAMPLES: Example[] = [
  {
    app: 'generative ad creative · 50 variants',
    tagline: 'One brief → 50 brand-safe variants per audience. Performance team picks winners.',
    metric: { label: '$/variant', value: '$0.46' },
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    app: 'per-creative attribution',
    tagline: 'Tag creative_id; pull conversions from Stripe; we slice cost-per-result back.',
    metric: { label: 'attribution', value: 'live · per asset' },
    pieces: ['each::attributes', 'each::trace'],
  },
  {
    app: 'live A/B with auto-kill',
    tagline: 'Loser cut after 1k impressions. Winner promoted on confidence. No human gate.',
    metric: { label: 'reaction', value: '<5 min' },
    pieces: ['each::ab', 'each::router'],
  },
  {
    app: 'creative-fatigue refresh',
    tagline: 'Detector watches CTR decay. Drops below threshold → spin a fresh batch.',
    metric: { label: 'lift', value: '+34% CTR' },
    pieces: ['each::workflows', 'each::ab'],
  },
  {
    app: 'audience × creative grid',
    tagline: 'Same creative across 4 audiences. Different CPAs. Slice by audience attr.',
    metric: { label: 'sliced by', value: 'audience_id' },
    pieces: ['each::attributes', 'each::ab'],
  },
  {
    app: 'regional compliance gate',
    tagline: 'IAB / GDPR / regional creative rules enforced before serve. No takedowns.',
    metric: { label: 'pre-serve gate', value: '✓ 6 regions' },
    pieces: ['each::workflows', 'each::enhancer', 'each::trace'],
  },
];

export function AdTechExamples() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● EXAMPLES · YOUR PERFORMANCE LOOP
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Six closed-loop plays your performance team can ship today.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Each scenario closes the loop between generation, serving, measurement,
        and refresh. Every creative carries an attribution tag; every winner
        promotes itself; every loser exits without a human in the loop.
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
          ◐ closed loop
        </div>
        <h3 className="font-mono font-semibold text-[14px] text-ink leading-snug">
          {ex.app}
        </h3>
        <p className="text-ink2 text-[12.5px] leading-[1.55] mt-2">{ex.tagline}</p>
      </div>

      {/* Single big metric — terminal vibe */}
      <div className="bg-bg border border-rule2 rounded-md p-3">
        <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3 mb-1">
          {ex.metric.label}
        </div>
        <div className="font-display text-[24px] font-semibold tabular-nums text-spark">
          {ex.metric.value}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {ex.pieces.map((p) => (
          <PieceTag key={p} name={p} />
        ))}
      </div>
    </motion.div>
  );
}

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
