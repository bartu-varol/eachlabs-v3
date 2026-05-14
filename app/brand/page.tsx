'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Check } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ──────────────────────────────────────────────────────────────────────────
   Brand page. Mirrors the rest of the redesign: mono eyebrows, bordered
   grid tiles with bg-rule separators, terse copy, technical-confident
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
  { name: 'Spark',     hex: '#FF3C15', cssVar: '--c-spark',     rgb: '255 60 21',   use: 'Primary accent · everything that matters.' },
  { name: 'Ember',     hex: '#D63310', cssVar: '--c-ember',     rgb: '214 51 16',   use: 'Deep spark · hover and pressed states.' },
  { name: 'Sun',       hex: '#FB9000', cssVar: '--c-sun',       rgb: '251 144 0',   use: 'Warm support · workflows, secondary CTAs.' },
  { name: 'Highlight', hex: '#5046E6', cssVar: '--c-highlight', rgb: '80 70 230',   use: 'Cool support · code, infra, depth.' },
  { name: 'Yellow',    hex: '#FFC534', cssVar: '--c-yellow',    rgb: '255 197 52',  use: 'Caution · coming-soon, attention pulls.' },
  { name: 'Success',   hex: '#22C55E', cssVar: '--c-success',   rgb: '34 197 94',   use: 'Positive · 200s, healthy traces.' },
  { name: 'Fail',      hex: '#EF4444', cssVar: '--c-fail',      rgb: '239 68 68',   use: 'Negative · 5xx, refused, broken.' },
  { name: 'Ink',       hex: '#0E0D0A', cssVar: '--c-ink',       rgb: '14 13 10',    use: 'Text on light · the near-black we use.' },
  { name: 'Bg',        hex: '#F5F2EB', cssVar: '--c-bg',        rgb: '245 242 235', use: 'Canvas · warm cream, not white.' },
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

const SENSE_CARD: AssetCard = {
  variant: 'dark',
  src: '/brand/each-sense-logo.svg',
  download: 'each-sense-logo.svg',
};

const DONTS: { rule: string; why: string }[] = [
  { rule: 'Don’t recolor the mark',  why: 'It’s ink on cream, or cream on ink. Spark for the eyes, not the wordmark.' },
  { rule: 'Don’t squish or stretch', why: 'The mark has a fixed aspect ratio. Scale uniformly. No exceptions.' },
  { rule: 'Don’t rotate',            why: 'It reads left-to-right. Always. Even when the layout is being clever.' },
  { rule: 'Don’t replace the ::',    why: 'The double-colon is the icon. Hyphens, dots, slashes break the cadence.' },
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
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> back to home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="max-w-[860px] mt-8"
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * BRAND · PRESS KIT
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] lg:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink">
            Use it well, use it wrong,<br className="hidden sm:block" /> just don’t squish it.
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.6] max-w-[640px] mt-7">
            The mark, the palette, the type, the voice. Everything you need to drop each::labs into a deck, a press release, a partnership page, or a stylesheet. SVGs are below. Hex codes copy on click.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#wordmark"
              className="inline-flex items-center gap-2 bg-ink text-bg hover:opacity-90 transition rounded-md px-4 py-2.5 text-[13.5px] font-medium"
            >
              <Download size={14} /> Get the marks
            </a>
            <a
              href="#colors"
              className="inline-flex items-center gap-2 border border-rule2 text-ink hover:bg-surface transition rounded-md px-4 py-2.5 text-[13.5px] font-medium"
            >
              Copy a hex
            </a>
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 ml-2">
              v1 · refreshed Q1 2026
            </span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {WORDMARK_CARDS.map((card) => (
            <AssetTile key={card.variant} card={card} kind="wordmark" />
          ))}
        </div>
      </BrandSection>

      {/* 3. ICON */}
      <BrandSection
        eyebrow="● ICON"
        title="The double-colon."
        body={'The :: mark for compact use, favicons, app icons, social avatars, embed badges. Same flat treatment as the wordmark.'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {ICON_CARDS.map((card) => (
            <AssetTile key={card.variant} card={card} kind="icon" />
          ))}
        </div>
      </BrandSection>

      {/* 4. PRODUCT MARK — each::sense */}
      <BrandSection
        eyebrow="● PRODUCT MARK · EACH::SENSE"
        title="The agent has its own mark."
        body="each::sense is the natural-language agent in front of the catalog. Its mark ships alongside the platform wordmark when sense is the named product."
      >
        <div className="grid grid-cols-1 md:max-w-[50%] gap-px bg-rule border border-rule rounded-md overflow-hidden">
          <AssetTile card={SENSE_CARD} kind="wordmark" />
        </div>
      </BrandSection>

      {/* 5. DO / DON'T */}
      <BrandSection
        eyebrow="● USAGE · DON’T"
        title="Six ways to ruin the mark."
        body="Most of these are obvious. We list them because someone, somewhere, has already tried."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {DONTS.map((d, i) => (
            <DontCard key={d.rule} d={d} index={i} />
          ))}
        </div>
      </BrandSection>

      {/* 6. COLORS */}
      <section id="colors" className="container border-t border-rule py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● COLOR · PALETTE
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink">
            Spark is the hero. Everything else gets out of the way.
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.6] max-w-[640px] mt-4">
            Nine tokens. Spark is the only accent that earns attention by itself; the rest support, signal, or recede. Values match the live CSS variables; click any hex to copy.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {PALETTE.map((c, i) => (
            <ColorTile key={c.cssVar} color={c} delay={i * 0.03} />
          ))}
        </div>
      </section>

      {/* 7. TYPOGRAPHY */}
      <section className="container border-t border-rule py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● TYPE · INTER
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink">
            One face. Four weights. That’s it.
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.6] max-w-[640px] mt-4">
            Inter handles every label, headline, and paragraph on the site. Optical sizing on display; tightened tracking on big type. Free from{' '}
            <a
              href="https://fonts.google.com/specimen/Inter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-4 decoration-spark/60 hover:decoration-spark"
            >
              Google Fonts
            </a>
            .
          </p>
        </motion.div>

        <div className="mt-10 bg-surface border border-rule2 rounded-md p-8 md:p-12">
          <div className="font-display font-bold text-[120px] md:text-[180px] text-ink leading-none tracking-tightest">
            Aa
          </div>
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mt-2">
            Inter · display · semibold
          </div>

          <div className="border-t border-rule mt-10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-4">
                Weights
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  { weight: 'Bold',     value: 700 },
                  { weight: 'Semibold', value: 600 },
                  { weight: 'Medium',   value: 500 },
                  { weight: 'Regular',  value: 400 },
                ].map((w) => (
                  <li
                    key={w.value}
                    className="text-ink text-[20px] leading-tight"
                    style={{ fontWeight: w.value }}
                  >
                    {w.weight} {w.value}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-4">
                Sample
              </div>
              <p className="text-ink text-[18px] leading-[1.55]">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-ink2 text-[13.5px] leading-[1.6] mt-3 font-mono">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>

            <div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-4">
                In product
              </div>
              <ul className="flex flex-col gap-3 text-[13.5px] leading-[1.6]">
                <li className="text-ink2">
                  Display · <span className="text-ink font-semibold">font-display semibold</span> · tracking-tightest
                </li>
                <li className="text-ink2">
                  Body · <span className="text-ink">font-sans regular</span> · 1.55 leading
                </li>
                <li className="text-ink2">
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
    <section id={id} className="container border-t border-rule py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          {eyebrow}
        </div>
        <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.05] tracking-tightest text-ink max-w-[680px]">
          {title}
        </h2>
        <p className="text-ink2 text-[14.5px] leading-[1.6] max-w-[560px] mt-3">
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
    <div className="bg-surface flex flex-col">
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
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-rule2">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          On {card.variant}
        </span>
        <a
          href={card.src}
          download={card.download}
          className="inline-flex items-center gap-1.5 bg-ink text-bg hover:opacity-90 transition rounded-full px-3.5 py-1.5 text-[12px] font-medium"
        >
          <Download size={12} />
          SVG
        </a>
      </div>
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
      className="bg-surface p-6 flex flex-col gap-3"
    >
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-fail inline-flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-fail" aria-hidden />
        DON’T
      </span>
      <h3 className="font-display font-semibold text-[17px] text-ink leading-snug">
        {d.rule}
      </h3>
      <p className="text-ink2 text-[13px] leading-[1.6]">{d.why}</p>
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
      className="bg-surface flex flex-col"
    >
      <div
        className="relative aspect-[16/9] flex items-end p-5"
        style={{ background: color.hex }}
        aria-hidden
      >
        <span
          className={`font-display font-semibold text-[18px] tracking-tight ${
            isLightish(color.hex) ? 'text-ink' : 'text-bg'
          }`}
        >
          {color.name}
        </span>
        <span
          className={`absolute top-4 right-4 font-mono text-[10px] uppercase tracking-eyebrow ${
            isLightish(color.hex) ? 'text-ink2' : 'text-bg/70'
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
          <span className="font-mono text-[12.5px] text-ink2 group-hover:text-ink transition-colors">
            {color.hex}
          </span>
          <span
            className={`font-mono text-[10.5px] inline-flex items-center gap-1 ${
              copied ? 'text-success' : 'text-ink3 group-hover:text-spark'
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
        <div className="font-mono text-[10.5px] text-ink3">
          rgb({color.rgb.replace(/ /g, ', ')})
        </div>
        <p className="text-ink2 text-[12px] leading-[1.45] border-t border-rule2 pt-3">
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
