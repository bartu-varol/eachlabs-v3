'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   MarketingExamples — 6 brand-marketing scenarios, all centered on the
   brand voice profile travelling cleanly across surfaces and seasons.
────────────────────────────────────────────────────────────────────────── */

type Example = {
  app: string;
  tagline: string;
  input: { kind: 'brief' | 'master' | 'voice' | 'partner' | 'season' | 'audience'; label: string };
  output: { kind: 'multi-surface' | 'channel-pack' | 'video' | 'cobrand' | 'reseason' | 'persona-pack'; label: string };
  pieces: string[];
};

const EXAMPLES: Example[] = [
  {
    app: 'campaign hero × all surfaces',
    tagline: 'One brief, one brand voice → IG, TikTok, web, email, OOH — correct dims, brand-safe.',
    input:  { kind: 'brief', label: '"summer · joy"' },
    output: { kind: 'multi-surface', label: '6 surfaces · brand-safe' },
    pieces: ['each::workflows', 'each::enhancer', 'each::trace'],
  },
  {
    app: 'master → channel pack',
    tagline: 'One hero asset → resized + recropped + retypset for every channel’s spec.',
    input:  { kind: 'master', label: 'master 1:1' },
    output: { kind: 'channel-pack', label: '12 channel cuts' },
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    app: 'brand-voice 30s spot',
    tagline: 'Brand voice + script → 30s video that actually sounds like your brand.',
    input:  { kind: 'voice', label: 'voice profile + script' },
    output: { kind: 'video', label: '30s spot · safe · audited' },
    pieces: ['each::workflows', 'each::enhancer', 'each::trace'],
  },
  {
    app: 'co-brand creative',
    tagline: 'Your brand × partner brand → safe overlap, both voices respected, IP cleared.',
    input:  { kind: 'partner', label: 'us × partner' },
    output: { kind: 'cobrand', label: 'co-brand pack' },
    pieces: ['each::workflows', 'each::enhancer', 'each::trace'],
  },
  {
    app: 'seasonal refresh',
    tagline: 'Q3 hero → "spring" recolor + relight. Composition + brand voice preserved.',
    input:  { kind: 'season', label: 'q3 hero · "spring"' },
    output: { kind: 'reseason', label: 'reskinned · same hero' },
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    app: 'audience-matched pack',
    tagline: 'Same brief × 4 personas. Different copy, same brand. Tag for performance later.',
    input:  { kind: 'audience', label: 'brief + 4 personas' },
    output: { kind: 'persona-pack', label: '4 persona variants' },
    pieces: ['each::workflows', 'each::attributes', 'each::trace'],
  },
];

export function MarketingExamples() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● EXAMPLES · YOUR CAMPAIGN PIPELINE
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Six things your brand calendar can stop chasing.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Concrete brand-marketing scenarios — every one tied to your brand voice
        profile, every one fanning out to the surfaces and seasons your calendar
        demands, every one audit-ready.
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
          ◐ campaign asset
        </div>
        <h3 className="font-display font-semibold text-[18px] text-ink leading-snug">
          {ex.app}
        </h3>
        <p className="text-ink2 text-[12.5px] leading-[1.55] mt-2">{ex.tagline}</p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1.2fr] gap-2 items-stretch">
        <InputPanel kind={ex.input.kind} label={ex.input.label} />
        <Arrow />
        <OutputPanel kind={ex.output.kind} label={ex.output.label} />
      </div>

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
      <div className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">input</div>
      <div className="flex-1 flex items-center justify-center">
        {kind === 'brief'    && <BriefIn label={label} />}
        {kind === 'master'   && <MasterIn />}
        {kind === 'voice'    && <VoiceIn />}
        {kind === 'partner'  && <PartnerIn />}
        {kind === 'season'   && <SeasonIn />}
        {kind === 'audience' && <AudienceIn />}
      </div>
      {kind !== 'brief' && (
        <div className="font-mono text-[9px] text-ink2 text-center truncate">{label}</div>
      )}
    </div>
  );
}

function BriefIn({ label }: { label: string }) {
  return (
    <div className="font-mono text-[10px] text-ink leading-tight px-1 italic w-full text-center">
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

function MasterIn() {
  return (
    <motion.div
      className="w-12 h-12 rounded border border-rule2"
      style={{ background: 'linear-gradient(135deg, rgb(var(--c-spark) / 0.5), rgb(var(--c-sun) / 0.45))' }}
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      aria-hidden
    />
  );
}

function VoiceIn() {
  const BARS = [50, 70, 60, 80, 65, 75, 55];
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-[9.5px] text-spark">aster_warm</span>
      <div className="flex items-end gap-[2px] h-5">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="block bg-spark/60 rounded-sm"
            style={{ width: '2px' }}
            animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.5}%`] }}
            transition={{ duration: 1.0, repeat: Infinity, delay: i * 0.06 }}
          />
        ))}
      </div>
    </div>
  );
}

function PartnerIn() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-7 h-7 rounded border border-rule2" style={{ background: 'rgb(var(--c-spark) / 0.55)' }} />
      <span className="text-ink3 text-[10px]">×</span>
      <div className="w-7 h-7 rounded border border-rule2" style={{ background: 'rgb(var(--c-highlight) / 0.55)' }} />
    </div>
  );
}

function SeasonIn() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-9 h-12 rounded border border-rule2" style={{ background: 'linear-gradient(180deg, rgb(var(--c-ember) / 0.55), rgb(var(--c-sun) / 0.45))' }} />
      <span className="text-ink3 text-[8px] uppercase tracking-eyebrow">→ spring</span>
    </div>
  );
}

function AudienceIn() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-6 h-6 rounded-full border border-rule2"
          style={{
            background:
              i === 0 ? 'rgb(var(--c-spark) / 0.55)'
              : i === 1 ? 'rgb(var(--c-highlight) / 0.55)'
              : i === 2 ? 'rgb(var(--c-success) / 0.55)'
              : 'rgb(var(--c-sun) / 0.55)',
          }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
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
        {kind === 'multi-surface' && <MultiSurfaceOut />}
        {kind === 'channel-pack'  && <ChannelPackOut />}
        {kind === 'video'         && <VideoOut />}
        {kind === 'cobrand'       && <CobrandOut />}
        {kind === 'reseason'      && <ReseasonOut />}
        {kind === 'persona-pack'  && <PersonaPackOut />}
      </div>
    </div>
  );
}

function MultiSurfaceOut() {
  return (
    <div className="w-full grid grid-cols-3 gap-[2px]">
      <div className="aspect-square rounded-sm" style={{ background: 'linear-gradient(135deg, rgb(var(--c-spark) / 0.5), rgb(var(--c-sun) / 0.45))' }} />
      <div className="aspect-[9/16] rounded-sm" style={{ background: 'linear-gradient(180deg, rgb(var(--c-highlight) / 0.5), rgb(var(--c-spark) / 0.4))' }} />
      <div className="aspect-[16/9] rounded-sm" style={{ background: 'linear-gradient(135deg, rgb(var(--c-success) / 0.45), rgb(var(--c-highlight) / 0.4))' }} />
    </div>
  );
}

function ChannelPackOut() {
  const sizes = ['1:1', '9:16', '16:9', '4:5', '3:1', '4:3', '2:3', '21:9', '16:10', '1:1', '9:16', '4:5'];
  return (
    <div className="w-full grid grid-cols-6 gap-[1px]">
      {sizes.map((s, i) => (
        <motion.div
          key={i}
          className="aspect-square rounded-[1px] flex items-center justify-center"
          style={{ background: i % 2 === 0 ? 'rgb(var(--c-spark) / 0.45)' : 'rgb(var(--c-highlight) / 0.45)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.05 + i * 0.04 }}
        >
          <span className="font-mono text-[6.5px] text-bg/95">{s}</span>
        </motion.div>
      ))}
    </div>
  );
}

function VideoOut() {
  return (
    <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-rule2">
      <div className="absolute inset-0 grid grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background:
                i === 0 ? 'linear-gradient(135deg, rgb(var(--c-spark) / 0.5), rgb(var(--c-sun) / 0.45))'
                : i === 1 ? 'linear-gradient(135deg, rgb(var(--c-highlight) / 0.5), rgb(var(--c-spark) / 0.4))'
                : 'linear-gradient(135deg, rgb(var(--c-sun) / 0.5), rgb(var(--c-ember) / 0.45))',
            }}
          />
        ))}
      </div>
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-spark"
        initial={{ left: '0%' }}
        animate={{ left: ['0%', '100%'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute bottom-1 left-1 font-mono text-[7px] uppercase tracking-eyebrow text-bg/95 bg-ink/55 px-1 rounded">
        30s · ✓ brand-safe
      </div>
    </div>
  );
}

function CobrandOut() {
  return (
    <div className="w-full aspect-video rounded-sm border border-rule2 overflow-hidden flex">
      <div className="flex-1" style={{ background: 'rgb(var(--c-spark) / 0.55)' }} />
      <div className="w-1 bg-bg" />
      <div className="flex-1" style={{ background: 'rgb(var(--c-highlight) / 0.55)' }} />
    </div>
  );
}

function ReseasonOut() {
  return (
    <div className="w-full aspect-video rounded-sm overflow-hidden flex border border-rule2">
      <div className="flex-1 relative" style={{ background: 'linear-gradient(180deg, rgb(var(--c-ember) / 0.55), rgb(var(--c-sun) / 0.45))' }}>
        <div className="absolute top-0.5 left-0.5 font-mono text-[7px] text-bg/95">q3</div>
      </div>
      <motion.div
        className="flex-1 relative"
        style={{ background: 'linear-gradient(180deg, rgb(var(--c-success) / 0.5), rgb(var(--c-highlight) / 0.45))' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="absolute top-0.5 left-0.5 font-mono text-[7px] text-bg/95">spring</div>
      </motion.div>
    </div>
  );
}

function PersonaPackOut() {
  const tones = ['spark', 'highlight', 'success', 'sun'];
  return (
    <div className="w-full grid grid-cols-2 gap-[2px]">
      {tones.map((tone, i) => (
        <motion.div
          key={tone}
          className="aspect-[5/3] rounded-sm flex items-end p-1"
          style={{ background: `rgb(var(--c-${tone}) / 0.5)` }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
        >
          <span className="font-mono text-[7px] text-bg/95 uppercase tracking-eyebrow">p{i + 1}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Piece tag ──────────────────────────────────────────────────────────── */

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
