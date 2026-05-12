'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   MarketingAnatomy — "The brand voice profile is the protagonist."

   3-column layout. Different from other anatomies which were time-axis or
   step-by-step. Here we surface the conceptual model: a profile object on
   the left, a compile step in the middle, and a cascade of N channels on
   the right. The point: the brand voice IS the asset; the pipeline is just
   plumbing.
────────────────────────────────────────────────────────────────────────── */

export function MarketingAnatomy() {
  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgb(var(--c-sun) / 0.05), transparent 65%)',
        }}
      />
      <div className="container py-24 md:py-28 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-highlight mb-3">
          ● ANATOMY · BRAND VOICE COMPILES
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          The profile is the asset. Everything else is plumbing.
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
          Brand teams maintain ONE thing: the brand voice profile. The
          platform compiles it once and applies it to every channel,
          season, partner, and persona — without drift, without manual
          review, with audit on every output.
        </p>

        <div className="mt-12 bg-surface border border-rule2 rounded-md p-5 md:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.4fr)] gap-4 items-stretch">
            <ProfilePanel />
            <Connector label="compile" />
            <CompiledPanel />
            <Connector label="apply · 1 each.run()" wide />
            <CascadePanel />
          </div>

          {/* Bottom strip — outcome counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule2 border border-rule2 rounded mt-6 overflow-hidden">
            <Stat label="profile size"   value="1 file"   tone="highlight" />
            <Stat label="surfaces / run" value="6 – 12"   tone="spark" />
            <Stat label="brand drift"     value="0"        tone="success" />
            <Stat label="audit / asset"  value="full"     tone="success" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Profile panel — the brand voice "object" with 4 dimensions ─────────── */

function ProfilePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.36 }}
      className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
          ① BRAND VOICE PROFILE
        </span>
        <span className="font-mono text-[9px] text-ink3">.json · 1 source of truth</span>
      </div>
      <div className="flex flex-col gap-1.5 font-mono text-[10.5px]">
        <ProfileRow label="palette"     swatch="warm"      values={['#FFE3D5', '#FF8A65', '#C2410C']} />
        <ProfileRow label="tone"        swatch="editorial" values={[]} text='"calm · confident · spacious"' />
        <ProfileRow label="era"         swatch="modern"    values={[]} text='"y2k-tinted minimal"' />
        <ProfileRow label="logo·rules"  swatch="locked"    values={[]} text='clearspace, never-tilt' />
      </div>
      <div className="font-mono text-[9.5px] text-success flex items-center gap-1.5 mt-1">
        <span>✓</span>
        <span>maintained by brand team · 1 file</span>
      </div>
    </motion.div>
  );
}

function ProfileRow({
  label,
  swatch,
  values,
  text,
}: {
  label: string;
  swatch: string;
  values: string[];
  text?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-surface border border-rule2 rounded">
      <span className="text-ink2 w-[68px]">{label}</span>
      {values.length > 0 ? (
        <div className="flex items-center gap-1">
          {values.map((c, i) => (
            <span key={i} className="block w-3 h-3 rounded-sm border border-rule2" style={{ background: c }} />
          ))}
        </div>
      ) : (
        <span className="text-ink2 truncate flex-1">{text}</span>
      )}
      <span className="font-mono text-[9px] text-spark whitespace-nowrap ml-auto">{swatch}</span>
    </div>
  );
}

/* ── Compiled panel — the encoded form passed to each.run() ─────────────── */

function CompiledPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.36, delay: 0.1 }}
      className="bg-bg border border-spark/40 rounded-md p-4 flex flex-col gap-3"
    >
      <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
        ② COMPILED PROFILE
      </div>
      <div className="bg-surface border border-rule2 rounded p-2.5 font-mono text-[10.5px] flex flex-col gap-1">
        <div>
          <span className="text-ink2">brand_voice: </span>
          <span className="text-spark">"aster_warm_y2k"</span>
        </div>
        <div className="text-ink3">// hash: c4f1·a8</div>
        <div>
          <span className="text-ink2">version: </span>
          <span className="text-spark">"v3.2"</span>
        </div>
        <div>
          <span className="text-ink2">policies: </span>
          <span className="text-spark">[brand-safety, IP, NSFW]</span>
        </div>
      </div>
      <div className="font-mono text-[9.5px] text-ink3">
        passed as a single tag on each.run()
      </div>
    </motion.div>
  );
}

/* ── Connector — labelled arrow between phases ──────────────────────────── */

function Connector({ label, wide }: { label: string; wide?: boolean }) {
  return (
    <div className={`hidden lg:flex flex-col items-center justify-center ${wide ? 'min-w-[100px]' : 'min-w-[60px]'}`}>
      <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark mb-1">
        {label}
      </span>
      <motion.span
        className="text-spark text-[16px]"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        aria-hidden
      >
        →
      </motion.span>
    </div>
  );
}

/* ── Cascade panel — N surfaces per run ─────────────────────────────────── */

const SURFACES = [
  { label: 'IG·sq',    ratio: 'aspect-square',  tone: 'spark' },
  { label: 'IG·story', ratio: 'aspect-[9/16]',  tone: 'highlight' },
  { label: 'TikTok',   ratio: 'aspect-[9/16]',  tone: 'ember' },
  { label: 'web',      ratio: 'aspect-[16/9]',  tone: 'success' },
  { label: 'email',    ratio: 'aspect-[3/1]',   tone: 'sun' },
  { label: 'OOH',      ratio: 'aspect-[4/3]',   tone: 'highlight' },
] as const;

function CascadePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.36, delay: 0.2 }}
      className="bg-bg border border-rule2 rounded-md p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
          ③ N CHANNELS · SAME BRAND
        </span>
        <span className="font-mono text-[9px] text-success">✓ all dims correct</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {SURFACES.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            className={`relative ${s.ratio} rounded-sm border border-rule2 overflow-hidden`}
            style={{ background: `linear-gradient(135deg, rgb(var(--c-${s.tone}) / 0.5), rgb(var(--c-spark) / 0.3))` }}
          >
            <div className="absolute top-0.5 left-0.5 font-mono text-[7px] uppercase tracking-eyebrow text-bg/95">
              {s.label}
            </div>
            <div className="absolute bottom-0.5 right-0.5 font-mono text-[7px] text-bg/95 bg-success/85 rounded px-1">
              ✓
            </div>
          </motion.div>
        ))}
      </div>
      <div className="font-mono text-[9.5px] text-ink3">
        same compiled profile · zero brand drift
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
      <div className={`font-display text-[16px] font-semibold tabular-nums mt-0.5 ${cls}`}>
        {value}
      </div>
    </div>
  );
}
