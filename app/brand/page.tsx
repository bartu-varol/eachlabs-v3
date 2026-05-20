'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Check } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ──────────────────────────────────────────────────────────────────────────
   Brand page. Mirrors the rest of the redesign: mono eyebrows, bordered
   grid tiles with bg-divider separators, terse copy, technical-confident
   voice. Colors are pulled from globals.css tokens, not legacy values.
────────────────────────────────────────────────────────────────────────── */

type Palette = {
  name: string;
  hex: string;
  cssVar: string;
  rgb: string;
  /** What this color is for, in one phrase. */
  use: string;
};

const PALETTE: Palette[] = [
  { name: 'Spark',     hex: '#FF3C15', cssVar: '--brand',     rgb: '255 60 21',   use: 'Primary accent · everything that matters.' },
  { name: 'Ember',     hex: '#D63310', cssVar: '--brand-deep',     rgb: '214 51 16',   use: 'Deep spark · hover and pressed states.' },
  { name: 'Sun',       hex: '#FB9000', cssVar: '--glow',       rgb: '251 144 0',   use: 'Warm support · workflows, secondary CTAs.' },
  { name: 'Highlight', hex: '#5046E6', cssVar: '--cobrand', rgb: '80 70 230',   use: 'Cool support · code, infra, depth.' },
  { name: 'Yellow',    hex: '#FFC534', cssVar: '--caution',    rgb: '255 197 52',  use: 'Caution · coming-soon, attention pulls.' },
  { name: 'Success',   hex: '#22C55E', cssVar: '--ok',   rgb: '34 197 94',   use: 'Positive · 200s, healthy traces.' },
  { name: 'Fail',      hex: '#EF4444', cssVar: '--danger',      rgb: '239 68 68',   use: 'Negative · 5xx, refused, broken.' },
  { name: 'Ink',       hex: '#0E0D0A', cssVar: '--ink',       rgb: '14 13 10',    use: 'Text on light · the near-black we use.' },
  { name: 'Bg',        hex: '#F5F2EB', cssVar: '--surface-raised',        rgb: '245 242 235', use: 'Canvas · warm cream, not white.' },
];

type AssetCard = {
  variant: 'dark' | 'light';
  src: string;
  download: string;
};

const WORDMARK_CARDS: AssetCard[] = [
  { variant: 'dark',  src: '/brand/wordmark-dark.svg',  download: 'eachlabs-wordmark-on-dark.svg' },
  { variant: 'light', src: '/brand/wordmark-light.svg', download: 'eachlabs-wordmark-on-light.svg' },
];

const ICON_CARDS: AssetCard[] = [
  { variant: 'dark',  src: '/brand/icon-dark.svg',  download: 'eachlabs-icon-on-dark.svg' },
  { variant: 'light', src: '/brand/icon-light.svg', download: 'eachlabs-icon-on-light.svg' },
];

type ProductMark = {
  slug: string;
  name: string;
  tagline: string;
  cards: AssetCard[];
};

const PRODUCT_MARKS: ProductMark[] = [
  {
    slug: 'router',
    name: 'each::router',
    tagline: 'Quality-aware routing and automatic fallback.',
    cards: [
      { variant: 'dark',  src: '/brand/each-router-logo-dark.svg', download: 'each-router-logo-on-dark.svg'  },
      { variant: 'light', src: '/brand/each-router-logo.svg',      download: 'each-router-logo-on-light.svg' },
    ],
  },
  {
    slug: 'trace',
    name: 'each::trace',
    tagline: 'Tag every call. Slice cost by anything.',
    cards: [
      { variant: 'dark',  src: '/brand/each-trace-logo-dark.svg',  download: 'each-trace-logo-on-dark.svg'   },
      { variant: 'light', src: '/brand/each-trace-logo.svg',       download: 'each-trace-logo-on-light.svg'  },
    ],
  },
  {
    slug: 'sense',
    name: 'each::sense',
    tagline: 'The natural-language agent in front of the catalog.',
    cards: [
      { variant: 'dark',  src: '/brand/each-sense-logo-dark.svg',  download: 'each-sense-logo-on-dark.svg'   },
      { variant: 'light', src: '/brand/each-sense-logo.svg',       download: 'each-sense-logo-on-light.svg'  },
    ],
  },
  {
    slug: 'workflows',
    name: 'each::workflows',
    tagline: 'A typed graph that chains models as one call.',
    cards: [
      { variant: 'dark',  src: '/brand/each-workflows-logo-dark.svg', download: 'each-workflows-logo-on-dark.svg'  },
      { variant: 'light', src: '/brand/each-workflows-logo.svg',      download: 'each-workflows-logo-on-light.svg' },
    ],
  },
];

const DONTS: { rule: string; why: string }[] = [
  { rule: 'Don’t recolor the mark',  why: 'It’s ink on cream, or cream on ink. Spark for the eyes, not the wordmark.' },
  { rule: 'Don’t squish or stretch', why: 'The mark has a fixed aspect ratio. Scale uniformly. No exceptions.' },
  { rule: 'Don’t rotate',            why: 'It reads left to right. Always. Even when the layout is being clever.' },
  { rule: 'Don’t replace the ::',    why: 'The double colon is the icon. Hyphens, dots, slashes break the cadence.' },
  { rule: 'Don’t add effects',       why: 'No shadows, glows, gradients, embosses. The mark ships flat or it doesn’t ship.' },
  { rule: 'Don’t crowd it',          why: 'Leave at least one cap-height of clear space on every side. Always.' },
];

export default function BrandPage() {
  return (
    <>
      {/* 1. HERO */}
      <section className="container py-14 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="max-w-[860px] mt-8"
        >
          <Eyebrow>* BRAND · PRESS KIT</Eyebrow>
          <h1 className="font-sans font-semibold text-display sm:text-display-lg lg:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink">
            Use it well, use it wrong,<br className="hidden sm:block" /> just don’t squish it.
          </h1>
          <p className="text-ink-muted text-body-lg leading-[1.6] max-w-[640px] mt-7">
            The mark, the palette, the type, the voice. Everything you need to drop each::labs into a deck, a press release, a partnership page, or a stylesheet. SVGs are below. Hex codes copy on click.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#wordmark"
              className="inline-flex items-center gap-2 bg-ink text-surface hover:opacity-90 transition rounded-md px-4 py-2.5 text-body-sm font-medium"
            >
              <Download size={14} /> Get the marks
            </a>
            <a
              href="#colors"
              className="inline-flex items-center gap-2 border border-field text-ink hover:bg-surface-raised transition rounded-md px-4 py-2.5 text-body-sm font-medium"
            >
              Copy a hex
            </a>
            <Eyebrow as="span" tone="ink-faint" className="ml-2">v1 · refreshed Q1 2026</Eyebrow>
          </div>
        </motion.div>
      </section>

      {/* 2. WORDMARK */}
      <BrandSection
        id="wordmark"
        eyebrow="● WORDMARK"
        title="The full mark."
        body="The primary lockup. Use it whenever you have the room. Always on a flat ink or cream surface; never on Spark, never on a photo."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {WORDMARK_CARDS.map((card) => (
            <AssetTile key={card.variant} card={card} kind="wordmark" />
          ))}
        </div>
      </BrandSection>

      {/* 3. ICON */}
      <BrandSection
        eyebrow="● ICON"
        title="The double colon."
        body={'The :: mark for compact use, favicons, app icons, social avatars, embed badges. Same flat treatment as the wordmark.'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {ICON_CARDS.map((card) => (
            <AssetTile key={card.variant} card={card} kind="icon" />
          ))}
        </div>
      </BrandSection>

      {/* 4. PRODUCT MARKS · router · trace · sense · workflows */}
      <BrandSection
        eyebrow="● PRODUCT MARKS"
        title="Each product gets its own mark."
        body="Router, trace, sense and workflows ship alongside the platform wordmark when the named product is the subject. Same construction, same colon cadence, same two surfaces."
      >
        <div className="flex flex-col gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {PRODUCT_MARKS.map((p) => (
            <ProductMarkRow key={p.slug} product={p} />
          ))}
        </div>
      </BrandSection>

      {/* 5. DO / DON'T */}
      <BrandSection
        eyebrow="● USAGE · DON’T"
        title="Six ways to ruin the mark."
        body="Most of these are obvious. We list them because someone, somewhere, has already tried."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {DONTS.map((d, i) => (
            <DontCard key={d.rule} d={d} index={i} />
          ))}
        </div>
      </BrandSection>

      {/* 6. COLORS */}
      <section id="colors" className="container border-t border-divider py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <Eyebrow className="mb-3">● COLOR · PALETTE</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
            Spark is the hero. Everything else gets out of the way.
          </h2>
          <p className="text-ink-muted text-body-lg leading-[1.6] max-w-[640px] mt-4">
            Nine tokens. Spark is the only accent that earns attention by itself; the rest support, signal, or recede. Values match the live CSS variables; click any hex to copy.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-10">
          {PALETTE.map((c, i) => (
            <ColorTile key={c.cssVar} color={c} delay={i * 0.03} />
          ))}
        </div>
      </section>

      {/* 7. TYPOGRAPHY */}
      <section className="container border-t border-divider py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <Eyebrow className="mb-3">● TYPE · INTER</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
            One face. Four weights. That’s it.
          </h2>
          <p className="text-ink-muted text-body-lg leading-[1.6] max-w-[640px] mt-4">
            Inter handles every label, headline, and paragraph on the site. Optical sizing on display; tightened tracking on big type. Free from{' '}
            <a
              href="https://fonts.google.com/specimen/Inter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 decoration-brand/60 hover:decoration-brand"
            >
              Google Fonts
            </a>
            .
          </p>
        </motion.div>

        <div className="mt-10 bg-surface-raised border border-field rounded-md p-8 md:p-12">
          <div className="font-sans font-bold text-[120px] md:text-[180px] text-ink leading-none tracking-tightest">
            Aa
          </div>
          <Eyebrow tone="ink-faint" className="mt-2">Inter · display · semibold</Eyebrow>

          <div className="border-t border-divider mt-10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <Eyebrow size="sm" tone="ink-faint" className="mb-4">Weights</Eyebrow>
              <ul className="flex flex-col gap-3">
                {[
                  { weight: 'Bold',     value: 700 },
                  { weight: 'Semibold', value: 600 },
                  { weight: 'Medium',   value: 500 },
                  { weight: 'Regular',  value: 400 },
                ].map((w) => (
                  <li
                    key={w.value}
                    className="text-ink text-h4 leading-tight"
                    style={{ fontWeight: w.value }}
                  >
                    {w.weight} {w.value}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Eyebrow size="sm" tone="ink-faint" className="mb-4">Sample</Eyebrow>
              <p className="text-ink text-h4 leading-[1.55]">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-ink-muted text-body-sm leading-[1.6] mt-3 font-mono">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>

            <div>
              <Eyebrow size="sm" tone="ink-faint" className="mb-4">In product</Eyebrow>
              <ul className="flex flex-col gap-3 text-body-sm leading-[1.6]">
                <li className="text-ink-muted">
                  Display · <span className="text-ink font-semibold">font-sans semibold</span> · tracking-tightest
                </li>
                <li className="text-ink-muted">
                  Body · <span className="text-ink">font-sans regular</span> · 1.55 leading
                </li>
                <li className="text-ink-muted">
                  Mono · <span className="text-ink font-mono">font-mono medium</span> · tracking-eyebrow for labels
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

/* ── Section shell with eyebrow + headline + body ───────────────────── */

function BrandSection({
  id,
  eyebrow,
  title,
  body,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="container border-t border-divider py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
        <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.05] tracking-tightest text-ink max-w-[680px]">
          {title}
        </h2>
        <p className="text-ink-muted text-body leading-[1.6] max-w-[560px] mt-3">
          {body}
        </p>
      </motion.div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/* ── Asset tile, dark/light variant + download ──────────────────────── */

function AssetTile({ card, kind }: { card: AssetCard; kind: 'wordmark' | 'icon' }) {
  const isDark = card.variant === 'dark';
  // Brand-true backgrounds: ink for dark, cream for light.
  const previewBg = isDark ? '#0E0D0A' : '#F5F2EB';

  return (
    <div className="bg-surface-raised flex flex-col">
      <div
        className="flex items-center justify-center"
        style={{
          background: previewBg,
          minHeight: kind === 'icon' ? 220 : 240,
        }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.src}
          alt=""
          className={kind === 'icon' ? 'h-12 w-12' : 'h-9 md:h-11 w-auto'}
        />
      </div>
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-field">
        <Eyebrow as="span" size="sm" tone="ink-faint">On {card.variant}</Eyebrow>
        <a
          href={card.src}
          download={card.download}
          className="inline-flex items-center gap-1.5 bg-ink text-surface hover:opacity-90 transition rounded-full px-3.5 py-1.5 text-caption font-medium"
        >
          <Download size={12} />
          SVG
        </a>
      </div>
    </div>
  );
}

/* ── Product mark row, label + light + dark variant tiles ───────────── */

function ProductMarkRow({ product }: { product: ProductMark }) {
  return (
    <div className="bg-surface-raised grid grid-cols-1 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-divider">
      <div className="bg-surface-raised px-5 py-6 md:py-0 md:flex md:flex-col md:justify-center">
        <Eyebrow size="sm">● {product.slug}</Eyebrow>
        <div className="font-sans font-semibold text-h4 text-ink mt-2 leading-tight">
          {product.name}
        </div>
        <div className="text-ink-faint italic text-caption leading-snug mt-1.5">
          {product.tagline}
        </div>
      </div>
      {product.cards.map((card) => (
        <AssetTile key={`${product.slug}-${card.variant}`} card={card} kind="wordmark" />
      ))}
    </div>
  );
}

/* ── Don't card ─────────────────────────────────────────────────────── */

function DontCard({
  d,
  index,
}: {
  d: { rule: string; why: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: EASE_OUT_EXPO }}
      className="bg-surface-raised p-6 flex flex-col gap-3"
    >
      <span className="font-mono text-micro uppercase tracking-eyebrow text-danger inline-flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-danger" aria-hidden />
        DON’T
      </span>
      <h3 className="font-sans font-semibold text-body-lg text-ink leading-snug">
        {d.rule}
      </h3>
      <p className="text-ink-muted text-body-sm leading-[1.6]">{d.why}</p>
    </motion.div>
  );
}

/* ── Color tile with copy-on-click + variable metadata ──────────────── */

function ColorTile({ color, delay }: { color: Palette; delay: number }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(color.hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.3, delay, ease: EASE_OUT_EXPO }}
      className="bg-surface-raised flex flex-col"
    >
      <div
        className="relative aspect-[16/9] flex items-end p-5"
        style={{ background: color.hex }}
        aria-hidden
      >
        <span
          className={`font-sans font-semibold text-h4 tracking-tight ${
            isLightish(color.hex) ? 'text-ink' : 'text-surface'
          }`}
        >
          {color.name}
        </span>
        <span
          className={`absolute top-4 right-4 font-mono text-micro uppercase tracking-eyebrow ${
            isLightish(color.hex) ? 'text-ink-muted' : 'text-surface/70'
          }`}
        >
          {color.cssVar}
        </span>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={copy}
          className="flex items-center justify-between text-left group"
        >
          <span className="font-mono text-caption text-ink-muted group-hover:text-ink transition-colors">
            {color.hex}
          </span>
          <span
            className={`font-mono text-micro inline-flex items-center gap-1 ${
              copied ? 'text-ok' : 'text-ink-faint group-hover:text-brand'
            } transition-colors`}
          >
            {copied ? (
              <>
                <Check size={11} /> Copied
              </>
            ) : (
              'Copy'
            )}
          </span>
        </button>
        <div className="font-mono text-micro text-ink-faint">
          rgb({color.rgb.replace(/ /g, ', ')})
        </div>
        <p className="text-ink-muted text-caption leading-[1.45] border-t border-field pt-3">
          {color.use}
        </p>
      </div>
    </motion.div>
  );
}

/** Light-vs-dark luminance check for text contrast on color swatches. */
function isLightish(hex: string): boolean {
  const m = hex.replace('#', '');
  if (m.length !== 6) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 >= 160;
}
