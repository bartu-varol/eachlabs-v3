'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Check } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Palette = { name: string; hex: string };

const PALETTE: Palette[] = [
  { name: 'Quantum Navy',  hex: '#060228' },
  { name: 'Chaos Spark',   hex: '#FF3C15' },
  { name: 'Deep Purple',   hex: '#2B0A34' },
  { name: 'Crimson',       hex: '#450830' },
  { name: 'Sunset Orange', hex: '#FB9000' },
  { name: 'Golden Yellow', hex: '#FFC534' },
  { name: 'Background',    hex: '#00011D' },
  { name: 'Highlight',     hex: '#5046E6' },
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

export default function BrandPage() {
  return (
    <>
      {/* HERO — centered */}
      <section className="relative border-b border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.07), transparent 65%)',
          }}
        />
        <div className="container py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="text-center max-w-[920px] mx-auto"
          >
            <h1 className="font-display font-semibold text-[44px] sm:text-[64px] lg:text-[88px] leading-[0.96] tracking-tightest text-ink">
              Brand Guidelines<br className="hidden sm:block" /> and Press Kit
            </h1>
            <p className="text-ink2 text-[16px] leading-[1.6] max-w-[560px] mx-auto mt-7">
              Resources and guidelines for using the Eachlabs brand in your projects, press, and
              partnerships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WORDMARK */}
      <BrandSection
        eyebrow="Wordmark"
        body="The primary Eachlabs wordmark. Use on dark backgrounds for best contrast."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORDMARK_CARDS.map((card) => (
            <AssetTile key={card.variant} card={card} kind="wordmark" />
          ))}
        </div>
      </BrandSection>

      {/* ICON */}
      <BrandSection
        eyebrow="Icon"
        body={'The "::" icon mark for compact usage, favicons, app icons, social profiles, and small displays.'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ICON_CARDS.map((card) => (
            <AssetTile key={card.variant} card={card} kind="icon" />
          ))}
        </div>
      </BrandSection>

      {/* PRODUCT LOGO — each::sense */}
      <BrandSection
        eyebrow="each::sense"
        body="The product logo for each::sense, our intelligent media generation layer."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AssetTile card={SENSE_CARD} kind="wordmark" />
        </div>
      </BrandSection>

      {/* COLORS */}
      <section className="container border-t border-rule py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink">
            Colors
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.6] max-w-[560px] mt-3">
            Our core brand palette. Chaos Spark red and Quantum Navy are the primary identifiers.
            Click any value to copy.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {PALETTE.map((c, i) => (
            <ColorTile key={c.hex} color={c} delay={i * 0.04} />
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section className="container border-t border-rule py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink">
            Typography
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.6] max-w-[560px] mt-3">
            Inter is our primary typeface. It&rsquo;s optimized for screen readability and
            available on{' '}
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
          {/* Aa specimen */}
          <div className="font-display font-bold text-[120px] md:text-[160px] text-ink leading-none">
            Aa
          </div>
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mt-1">
            Inter
          </div>

          <div className="border-t border-rule mt-8 pt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
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
              <p className="text-ink text-[14px] leading-[1.5] mt-3 font-mono">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Section shell with eyebrow + body ──────────────────────────────── */

function BrandSection({
  eyebrow,
  body,
  children,
}: {
  eyebrow: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container border-t border-rule py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.05] tracking-tightest text-ink">
          {eyebrow}
        </h2>
        <p className="text-ink2 text-[14.5px] leading-[1.6] max-w-[560px] mt-3">
          {body}
        </p>
      </motion.div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/* ── Asset tile (wordmark / icon variants) ──────────────────────────── */

function AssetTile({ card, kind }: { card: AssetCard; kind: 'wordmark' | 'icon' }) {
  const isDark = card.variant === 'dark';
  // Match the screenshot palette: navy-ish for dark variant, white for light.
  const previewBg = isDark ? '#0E0A2E' : '#FFFFFF';

  return (
    <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
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
        <span className="text-ink2 text-[13px]">
          On {card.variant}
        </span>
        <a
          href={card.src}
          download={card.download}
          className="inline-flex items-center gap-1.5 bg-white text-bg hover:bg-ink/90 transition-colors rounded-full px-3.5 py-1.5 text-[12px] font-medium"
        >
          <Download size={12} />
          SVG
        </a>
      </div>
    </div>
  );
}

/* ── Color tile with copy-on-click ──────────────────────────────────── */

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
      className="bg-surface border border-rule2 rounded-md overflow-hidden flex flex-col"
    >
      <div
        className="relative aspect-[3/2] flex items-end p-4"
        style={{ background: color.hex }}
        aria-hidden
      >
        <span
          className={`font-display font-semibold text-[15px] ${
            isLightish(color.hex) ? 'text-bg' : 'text-white'
          }`}
        >
          {color.name}
        </span>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-bg/40"
      >
        <span className="font-mono text-[12px] text-ink2">{color.hex}</span>
        <span
          className={`font-mono text-[11px] inline-flex items-center gap-1 ${
            copied ? 'text-success' : 'text-ink3'
          }`}
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
    </motion.div>
  );
}

/** Simple readability check so light-tinted swatches keep dark text. */
function isLightish(hex: string): boolean {
  const m = hex.replace('#', '');
  if (m.length !== 6) return false;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  // Perceived luminance (Rec. 601), >= 160 we treat as "light enough" for dark text.
  return r * 0.299 + g * 0.587 + b * 0.114 >= 160;
}
