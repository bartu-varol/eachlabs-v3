'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   GamingAnatomy — TIME-AXIS timeline (T-7 → T-0 → T+7).

   Different from any other anatomy: this one is a horizontal timeline with
   asset milestones distributed across "before launch" and "after launch".
   The story: each::labs supports the entire live-event lifecycle, not just
   the build phase.
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'pre' | 'launch' | 'post';

const STAGES: { day: string; label: string; tone: string; pieces: string[] }[] = [
  { day: 'T-7d', label: 'kickoff brief',         tone: 'highlight', pieces: ['each::workflows'] },
  { day: 'T-5d', label: 'NPC + dialogue spin',    tone: 'spark',     pieces: ['each::workflows', 'each::enhancer'] },
  { day: 'T-3d', label: 'localized VO',           tone: 'sun',       pieces: ['each::workflows', 'each::router'] },
  { day: 'T-1d', label: 'A/B reskin previews',    tone: 'highlight', pieces: ['each::ab'] },
  { day: 'T-0',  label: 'LIVE',                   tone: 'success',   pieces: ['each::router', 'each::trace'] },
  { day: 'T+1d', label: 'event metrics',          tone: 'spark',     pieces: ['each::trace', 'each::attributes'] },
  { day: 'T+3d', label: 'patch / rollback',       tone: 'ember',     pieces: ['each::workflows'] },
  { day: 'T+7d', label: 'wrap + retro',           tone: 'highlight', pieces: ['each::trace'] },
];

export function GamingAnatomy() {
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let i = 0;
    intervalRef.current = setInterval(() => {
      i = (i + 1) % STAGES.length;
      setActiveIdx(i);
    }, 1200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● ANATOMY · LIVE-EVENT TIMELINE
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Pre-launch. Live. Post-mortem. Same SDK across all of it.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Live-service content isn&rsquo;t a one-shot deploy — it&rsquo;s a 14-day
        cycle around every event drop. Build, launch, measure, patch. The
        platform sits on every milestone so your live-ops team doesn&rsquo;t
        have to switch tools at any point.
      </p>

      <div className="mt-12 bg-surface border border-rule2 rounded-md p-5 md:p-7">
        {/* Timeline header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              winter event · current cycle
            </span>
          </div>
          <span className="font-mono text-[10px] text-spark">
            8 stages · 1 SDK
          </span>
        </div>

        {/* Timeline track */}
        <Timeline activeIdx={activeIdx} />

        {/* Active stage detail */}
        <ActiveDetail stage={STAGES[activeIdx]} />

        {/* Outcome stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule2 border border-rule2 rounded mt-6 overflow-hidden">
          <Stat label="cycle"          value="14 days"   tone="highlight" />
          <Stat label="tools you maintain" value="0"      tone="success" />
          <Stat label="rollback time"   value="1 string" tone="spark" />
          <Stat label="VPC / on-prem"   value="optional" tone="success" />
        </div>
      </div>
    </section>
  );
}

/* ── Timeline track — horizontal scrolling milestones ───────────────────── */

function Timeline({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="relative">
      {/* baseline */}
      <div className="absolute left-0 right-0 top-[14px] h-px bg-rule2" />
      {/* T-0 marker */}
      <div className="absolute top-0 bottom-0" style={{ left: '50%', transform: 'translateX(-50%)' }}>
        <div className="w-px h-full bg-spark/30" />
      </div>

      <div className="grid grid-cols-8 relative">
        {STAGES.map((s, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          return (
            <div key={s.day} className="flex flex-col items-center gap-1.5 px-1">
              <motion.div
                animate={{
                  backgroundColor: isActive
                    ? `rgb(var(--c-${s.tone}))`
                    : isPast
                    ? `rgb(var(--c-${s.tone}) / 0.6)`
                    : 'rgb(var(--c-rule2))',
                  scale: isActive ? 1.4 : 1,
                  boxShadow: isActive ? `0 0 0 3px rgb(var(--c-${s.tone}) / 0.18)` : '0 0 0 0 transparent',
                }}
                transition={{ duration: 0.3 }}
                className="w-3 h-3 rounded-full relative z-10"
                aria-hidden
              />
              <span
                className={`font-mono text-[9px] tabular-nums ${
                  isActive ? `text-${s.tone === 'success' ? 'success' : 'spark'}` : 'text-ink3'
                }`}
              >
                {s.day}
              </span>
              <span
                className={`font-mono text-[8.5px] uppercase tracking-eyebrow text-center leading-tight ${
                  isActive ? 'text-ink' : 'text-ink3'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Active stage detail panel ──────────────────────────────────────────── */

function ActiveDetail({ stage }: { stage: typeof STAGES[number] }) {
  return (
    <motion.div
      key={stage.day}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mt-8 bg-bg border border-rule2 rounded-md p-4 flex items-center gap-4 flex-wrap"
    >
      <div>
        <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3 mb-0.5">
          stage
        </div>
        <div className="font-display text-[18px] font-semibold tabular-nums" style={{ color: `rgb(var(--c-${stage.tone}))` }}>
          {stage.day} · {stage.label}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 ml-auto">
        <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
          uses
        </span>
        {stage.pieces.map((p) => (
          <span
            key={p}
            className="inline-flex items-center font-mono text-[10px] text-spark border border-spark/45 bg-spark/[0.04] rounded px-1.5 py-[2px]"
          >
            <EachLabel name={p} />
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Stat cell ──────────────────────────────────────────────────────────── */

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'spark' | 'highlight' | 'success';
}) {
  const cls =
    tone === 'spark' ? 'text-spark'
    : tone === 'highlight' ? 'text-highlight'
    : 'text-success';
  return (
    <div className="bg-surface px-3 py-3 text-center">
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">{label}</div>
      <div className={`font-display text-[16px] font-semibold tabular-nums mt-0.5 ${cls}`}>{value}</div>
    </div>
  );
}
