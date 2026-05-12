'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   RetailExamples — 6 concrete commerce / asset-production scenarios.

   Drawn from the fashion-ai page features (model gen, try-on, bg swap, etc.)
   plus enterprise concerns (locale fan-out, brand-voice campaigns). Every
   card shows a real input, an animated mock output, and the each::xxx pieces
   that make the asset pipeline run unattended.
────────────────────────────────────────────────────────────────────────── */

type Example = {
  app: string;
  tagline: string;
  input: { kind: 'product' | 'pair' | 'brief' | 'sku'; label: string };
  output: { kind: 'model' | 'tryon' | 'bg-swap' | 'lookbook' | 'locales' | 'campaign'; label: string };
  pieces: string[];
};

const EXAMPLES: Example[] = [
  {
    app: 'AI model on a garment',
    tagline: 'Bare-product photo → on-model shot. No studio, no booking, no callback.',
    input:  { kind: 'product', label: 'sku photo' },
    output: { kind: 'model',   label: 'on-model · 4 poses' },
    pieces: ['each::workflows', 'each::enhancer', 'each::router'],
  },
  {
    app: 'virtual try-on',
    tagline: 'Customer uploads a selfie. Sees the dress on themselves, in 1.8s.',
    input:  { kind: 'pair',  label: 'photo + sku' },
    output: { kind: 'tryon', label: 'try-on · 1.8s' },
    pieces: ['each::workflows', 'each::router', 'each::trace'],
  },
  {
    app: 'background swap',
    tagline: 'Same product, four lifestyle scenes. Brand-safe by default.',
    input:  { kind: 'product', label: 'white-bg' },
    output: { kind: 'bg-swap', label: '4 scenes · parallel' },
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    app: 'lookbook fan-out',
    tagline: 'One outfit → twelve editorial variants. One workflow run.',
    input:  { kind: 'product',  label: 'one outfit' },
    output: { kind: 'lookbook', label: '12 lookbook shots' },
    pieces: ['each::workflows', 'each::router', 'each::trace'],
  },
  {
    app: 'locale fan-out',
    tagline: 'One brief → 12 localized variants. Different model, language, scene.',
    input:  { kind: 'brief',   label: '"summer 2026 hero"' },
    output: { kind: 'locales', label: '12 markets · audited' },
    pieces: ['each::workflows', 'each::attributes', 'each::trace'],
  },
  {
    app: 'brand-voice campaign',
    tagline: '200 social variants from one brief. Brand voice locked across all.',
    input:  { kind: 'brief',    label: 'brief + style profile' },
    output: { kind: 'campaign', label: '200 variants · audited' },
    pieces: ['each::workflows', 'each::enhancer', 'each::trace'],
  },
];

export function RetailExamples() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● EXAMPLES · YOUR ASSET PIPELINE
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Six things your studio can stop doing.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Concrete commerce scenarios — every one a real production pipeline,
        every one with input, animated output, and the platform pieces that
        replace the studio booking on your calendar.
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
          ◐ commerce pipeline
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
        {kind === 'product' && <DressInput />}
        {kind === 'pair'    && <PairInput />}
        {kind === 'brief'   && <BriefInput label={label} />}
        {kind === 'sku'     && <SkuInput />}
      </div>
      {kind !== 'brief' && (
        <div className="font-mono text-[9px] text-ink2 text-center truncate">{label}</div>
      )}
    </div>
  );
}

/* Single garment silhouette — used for product / sku inputs. */
function DressSilhouette({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 80 100" width={size} height={size * 1.25} aria-hidden>
      <path
        d="M30 8 L50 8 L52 16 L60 22 L66 38 L62 44 L58 42 L66 95 L14 95 L22 42 L18 44 L14 38 L20 22 L28 16 Z"
        fill="rgb(var(--c-spark) / 0.55)"
        stroke="rgb(var(--c-ink2) / 0.4)"
        strokeWidth="0.6"
      />
    </svg>
  );
}

function DressInput() {
  return (
    <motion.div
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-12 h-14 bg-surface2 rounded flex items-center justify-center border border-rule2"
    >
      <DressSilhouette size={26} />
    </motion.div>
  );
}

function SkuInput() {
  return <DressInput />;
}

function PairInput() {
  return (
    <div className="flex items-center gap-1">
      {/* User photo placeholder */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
        className="w-9 h-12 bg-surface2 rounded border border-rule2 flex items-center justify-center"
      >
        <svg viewBox="0 0 30 36" width="22" height="26" aria-hidden>
          <circle cx="15" cy="11" r="6" fill="rgb(var(--c-highlight) / 0.5)" />
          <path d="M3 36 C 3 24, 27 24, 27 36 Z" fill="rgb(var(--c-highlight) / 0.45)" />
        </svg>
      </motion.div>
      <span className="text-ink3 text-[12px]" aria-hidden>+</span>
      {/* Garment placeholder */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        className="w-9 h-12 bg-surface2 rounded border border-rule2 flex items-center justify-center"
      >
        <DressSilhouette size={20} />
      </motion.div>
    </div>
  );
}

function BriefInput({ label }: { label: string }) {
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
        {kind === 'model'    && <OnModelOutput />}
        {kind === 'tryon'    && <TryOnOutput />}
        {kind === 'bg-swap'  && <BgSwapOutput />}
        {kind === 'lookbook' && <LookbookOutput />}
        {kind === 'locales'  && <LocalesOutput />}
        {kind === 'campaign' && <CampaignOutput />}
      </div>
    </div>
  );
}

/* On-model — 4 model silhouettes wearing the garment in different poses. */
function OnModelOutput() {
  return (
    <div className="w-full grid grid-cols-2 gap-[2px] aspect-[2/1.4]">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="relative rounded-sm overflow-hidden"
          style={{
            background:
              i === 0 ? 'linear-gradient(135deg, rgb(var(--c-sun) / 0.5), rgb(var(--c-spark) / 0.4))'
              : i === 1 ? 'linear-gradient(135deg, rgb(var(--c-highlight) / 0.5), rgb(var(--c-spark) / 0.4))'
              : i === 2 ? 'linear-gradient(135deg, rgb(var(--c-success) / 0.5), rgb(var(--c-highlight) / 0.4))'
              : 'linear-gradient(135deg, rgb(var(--c-ember) / 0.5), rgb(var(--c-sun) / 0.4))',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
        >
          <svg viewBox="0 0 30 50" className="absolute inset-x-0 mx-auto top-1" width="50%" aria-hidden>
            <circle cx="15" cy="6" r="3.5" fill="rgb(var(--c-bg))" />
            <path d="M9 12 L21 12 L23 18 L27 26 L26 30 L24 28 L26 46 L4 46 L6 28 L4 30 L3 26 L7 18 Z" fill="rgb(var(--c-bg))" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* Try-on — single user silhouette wearing the dress. */
function TryOnOutput() {
  return (
    <div className="relative w-full aspect-square rounded border border-rule2 overflow-hidden bg-surface2">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgb(var(--c-highlight) / 0.35), rgb(var(--c-spark) / 0.3))' }}
      />
      <svg viewBox="0 0 60 80" className="absolute inset-x-0 mx-auto bottom-0" width="68%" aria-hidden>
        <circle cx="30" cy="12" r="7" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-spark))" strokeWidth="0.8" />
        <path d="M16 22 L44 22 L46 30 L52 40 L50 44 L46 42 L52 78 L8 78 L14 42 L10 44 L8 40 L14 30 Z" fill="rgb(var(--c-bg))" stroke="rgb(var(--c-spark))" strokeWidth="0.8" />
      </svg>
      <motion.div
        className="absolute top-1 right-1 font-mono text-[7.5px] uppercase tracking-eyebrow text-bg bg-success/85 rounded px-1"
        animate={{ opacity: [0, 1, 1] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.4, 1] }}
      >
        ✓ fit
      </motion.div>
    </div>
  );
}

/* Background swap — 4 different scene gradients with same garment overlay. */
function BgSwapOutput() {
  return (
    <div className="w-full grid grid-cols-2 gap-[2px] aspect-[2/1.4]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative rounded-sm overflow-hidden"
          style={{
            background:
              i === 0 ? 'linear-gradient(180deg, rgb(var(--c-highlight) / 0.5), rgb(var(--c-spark) / 0.4))'
              : i === 1 ? 'linear-gradient(180deg, rgb(var(--c-success) / 0.45), rgb(var(--c-highlight) / 0.35))'
              : i === 2 ? 'linear-gradient(180deg, rgb(var(--c-sun) / 0.5), rgb(var(--c-ember) / 0.45))'
              : 'linear-gradient(180deg, rgb(var(--c-ember) / 0.5), rgb(var(--c-spark) / 0.45))',
          }}
        >
          <svg viewBox="0 0 80 100" className="absolute inset-0 m-auto" width="46%" aria-hidden style={{ top: '10%' }}>
            <path
              d="M30 8 L50 8 L52 16 L60 22 L66 38 L62 44 L58 42 L66 95 L14 95 L22 42 L18 44 L14 38 L20 22 L28 16 Z"
              fill="rgb(var(--c-bg) / 0.95)"
              stroke="rgb(var(--c-ink2) / 0.45)"
              strokeWidth="0.6"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* Lookbook — 6 small thumbnails representing more variants. */
function LookbookOutput() {
  const tones = ['spark', 'highlight', 'success', 'sun', 'ember', 'highlight'] as const;
  return (
    <div className="w-full grid grid-cols-3 gap-[2px] aspect-[3/1.4]">
      {tones.map((tone, i) => (
        <motion.div
          key={i}
          className="rounded-sm"
          style={{
            background: `linear-gradient(135deg, rgb(var(--c-${tone}) / 0.55), rgb(var(--c-spark) / 0.35))`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
        />
      ))}
    </div>
  );
}

/* Locales — 4×3 grid with locale codes. */
const LOCALE_CODES = ['EN', 'TR', 'DE', 'JP', 'KR', 'FR', 'ES', 'IT', 'ZH', 'BR', 'AR', 'IN'];
function LocalesOutput() {
  return (
    <div className="w-full grid grid-cols-4 grid-rows-3 gap-[2px] aspect-[4/2.4]">
      {LOCALE_CODES.map((code, i) => (
        <motion.div
          key={code}
          className="relative bg-spark/15 border border-spark/45 rounded-sm flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.05 + i * 0.03 }}
        >
          <span className="font-mono text-[8px] text-spark">{code}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* Campaign — many tiny squares to evoke "200 variants". */
function CampaignOutput() {
  return (
    <div className="w-full grid grid-cols-10 gap-[1px] aspect-[10/3]">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-[1px]"
          style={{
            background:
              i % 4 === 0 ? 'rgb(var(--c-spark) / 0.55)'
              : i % 4 === 1 ? 'rgb(var(--c-highlight) / 0.45)'
              : i % 4 === 2 ? 'rgb(var(--c-success) / 0.45)'
              : 'rgb(var(--c-sun) / 0.45)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.18, delay: 0.02 + i * 0.012 }}
        />
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
