'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

type Problem = {
  problem: string;
  without: string;
  withus:  string;
  pieces:  string[];
};

const PROBLEMS: Problem[] = [
  {
    problem: 'Live event drops in 2 weeks. Not enough content.',
    without: 'Three art contractors, two QA cycles, content slips. Event hits half-empty.',
    withus:  'One workflow, parallel asset categories, 503 assets ready by T-1.',
    pieces:  ['each::workflows', 'each::trace'],
  },
  {
    problem: 'Localize VO into 30 languages.',
    without: 'Voice agency. Six months. Six-figure budget. Inconsistent character voice.',
    withus:  'One workflow, 30 locales, same character voice across every line.',
    pieces:  ['each::workflows', 'each::router'],
  },
  {
    problem: 'Bad asset shipped. Players complaining.',
    without: 'Hotfix patch. Risky redeploy. Players notice the rollback.',
    withus:  'Roll back to v3.2 in one string. No redeploy. Players unaware.',
    pieces:  ['each::workflows', 'each::trace'],
  },
  {
    problem: 'Sensitive IP can\'t go to public providers.',
    without: 'Build internal ML platform. Hire team. Two-year horizon.',
    withus:  'Same SDK, deployed inside your VPC. Zero data egress.',
    pieces:  ['each::workflows', 'each::router'],
  },
  {
    problem: 'Player count spikes 8× at event launch.',
    without: 'Provider rate-limits. Asset generation queues. Players see stale content.',
    withus:  'Router spills to high-throughput providers during burst, back when calm.',
    pieces:  ['each::router'],
  },
  {
    problem: 'Texture quality regressed in last update.',
    without: 'You don\'t know until reviews come in. Damage control week.',
    withus:  'A/B between v3.2 and v3.3 on 10% of players. Promote when significant.',
    pieces:  ['each::ab', 'each::trace'],
  },
];

export function GamingProblems() {
  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgb(var(--c-yellow) / 0.05), transparent 65%)',
        }}
      />
      <div className="container py-24 md:py-28 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-highlight mb-3">
          ● PROBLEMS YOU&rsquo;LL HIT
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Every live-ops nightmare. Already on the calendar.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Six pains every game studio hits between event drops. The fix sits
          on a workflow version you can pin, A/B, or roll back without a
          deploy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          {PROBLEMS.map((p, i) => (
            <ProblemCard key={p.problem} p={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ p, idx }: { p: Problem; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.36, delay: (idx % 3) * 0.05 }}
      className="bg-surface p-6 md:p-7 flex flex-col gap-4"
    >
      <div className="flex items-start gap-3">
        <PixelIcon idx={idx} />
        <div className="flex-1">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-fail mb-1">
            ✗ problem
          </div>
          <h3 className="font-display font-semibold text-[15.5px] text-ink leading-snug">
            {p.problem}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2 px-3 py-2 bg-bg border border-rule2 rounded">
          <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3 w-[60px] shrink-0 mt-[2px]">
            without
          </span>
          <span className="text-ink2 text-[12px] leading-[1.55] line-through decoration-ink3/40">
            {p.without}
          </span>
        </div>
        <div className="flex items-start gap-2 px-3 py-2 bg-spark/[0.04] border border-spark/40 rounded">
          <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark w-[60px] shrink-0 mt-[2px]">
            with us
          </span>
          <span className="text-ink text-[12px] leading-[1.55]">{p.withus}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">fixed by</span>
        {p.pieces.map((piece) => (
          <PieceTag key={piece} name={piece} />
        ))}
      </div>
    </motion.div>
  );
}

/* Pixel-art-style icon — different pattern per problem index. */
function PixelIcon({ idx }: { idx: number }) {
  const tones = ['spark', 'highlight', 'sun', 'success', 'ember', 'highlight'];
  const tone = tones[idx % tones.length];
  // 6 different 4×4 patterns
  const patterns: number[][][] = [
    [[1,1,0,1],[1,0,1,1],[0,1,1,0],[1,1,1,0]], // event
    [[0,1,1,0],[1,1,1,1],[1,0,0,1],[1,1,1,1]], // VO
    [[1,1,1,0],[0,0,1,1],[1,1,0,0],[0,1,1,1]], // rollback
    [[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]], // VPC (lock-ish)
    [[0,1,1,1],[1,1,0,1],[1,0,1,1],[1,1,1,0]], // burst
    [[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]], // A/B
  ];
  const cells = patterns[idx % patterns.length];
  return (
    <div className="w-9 h-9 rounded bg-bg border border-rule2 flex items-center justify-center shrink-0 p-[3px]">
      <div className="grid grid-cols-4 gap-[1px] w-full h-full">
        {cells.flat().map((v, i) => (
          <motion.div
            key={i}
            className="aspect-square"
            style={{ backgroundColor: v ? `rgb(var(--c-${tone}))` : 'rgb(var(--c-rule2) / 0.4)' }}
            animate={v ? { opacity: [0.7, 1, 0.7] } : {}}
            transition={v ? { duration: 1.6, repeat: Infinity, delay: i * 0.04 } : {}}
          />
        ))}
      </div>
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
