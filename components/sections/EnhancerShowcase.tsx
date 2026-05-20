'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductMark } from '@/components/ui/ProductMark';
import { PointVisual } from '@/components/ui/PointVisual';
import { PRODUCTS, type ProductPoint } from '@/lib/products';
import { EnhancerDemo } from './EnhancerDemo';
import { EnhancerHowTo } from './EnhancerHowTo';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* ──────────────────────────────────────────────────────────────────────────
   EnhancerShowcase, bespoke /enhancer page.

   Mirrors RouterShowcase / WorkflowsShowcase. Distinctive bit: this product
   is shipping in early access, so the hero carries an explicit "COMING Q1
   2026" pill and the CTA points to a waitlist instead of /signup.
────────────────────────────────────────────────────────────────────────── */

export function EnhancerShowcase() {
  const product = PRODUCTS.enhancer;

  return (
    <>
      {/* 1. HERO */}
      <section className="container py-16 md:py-24">
        <Link
          href="/platform"
          className="inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> all platform products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-10 lg:gap-16 items-start mt-8">
          {/* LEFT, copy */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>* {product.eyebrow}</Eyebrow>
              <ComingSoonPill />
            </div>
            <h1 className="font-sans font-semibold text-display sm:text-display-lg lg:text-hero xl:text-hero leading-[0.98] tracking-tightest mt-6 text-ink">
              {product.title}
            </h1>
            <p className="text-ink-muted text-body-lg leading-[1.55] max-w-[540px] mt-7">
              {product.body}
            </p>

            {/* Three-line "what / why / how" */}
            <ul className="mt-8 flex flex-col gap-2.5 max-w-[540px]">
              <BulletLine
                accent="READ"
                text="The enhancer reads the model's error code, content safety, content policy, or a celebrity / brand-IP hit."
              />
              <BulletLine
                accent="REWRITE"
                text="It rewrites only the flagged tokens, never the intent, then re-checks against all three policies before shipping."
              />
              <BulletLine
                accent="HOW"
                text={
                  <>
                    Add <code className="font-mono text-caption text-brand">enhance.prompt: true</code> to your each() call.
                    The trace tells you what was rewritten and why.
                  </>
                }
              />
            </ul>

            {/* Trusted by */}
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
              <Eyebrow as="span" size="sm" tone="ink-faint">EARLY-ACCESS COHORT</Eyebrow>
              {product.trustedBy.map((name) => (
                <span key={name} className="font-mono text-caption text-ink-muted">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT, live demo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <EnhancerDemo />
          </motion.div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="container -mt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {product.stats.map((s) => (
            <div key={s.label} className="bg-surface-raised px-5 py-6">
              <div className="font-sans font-semibold text-h3 md:text-h2 text-brand tabular-nums leading-none break-words">
                {s.value}
              </div>
              <div className="text-ink-faint text-caption mt-2">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mt-3 text-center md:text-left">
          ⚐ projections from the early-access cohort · subject to change at GA
        </p>
      </section>

      {/* 3. WHAT IT DOES */}
      <section className="relative border-t border-divider overflow-hidden mt-20 md:mt-28">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 0% 30%, rgb(var(--brand) / 0.05), transparent 60%)',
          }}
        />
        <div className="container py-24 md:py-28 relative">
          <Eyebrow className="mb-3">● WHAT IT DOES</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            {product.whatTitle}
          </h2>
          <p className="text-ink-muted text-body-lg leading-[1.65] max-w-[620px] mt-6">
            {product.whatBody}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-10">
            {product.whatPoints.map((p) => (
              <WhatCard key={p.n} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW TO USE IT, One flag. Five policies. Every refusal saved. */}
      <EnhancerHowTo />

      {/* 5. WHEN TO REACH FOR IT */}
      <section className="container border-t border-divider py-24 md:py-28">
        <Eyebrow className="mb-3">● WHEN YOU’D REACH FOR IT</Eyebrow>
        <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.1] tracking-tightest text-ink max-w-[680px]">
          {product.whenTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-10">
          {product.whenPoints.map((p) => (
            <WhenCard key={p.n} p={p} />
          ))}
        </div>
      </section>

      {/* 6. PAIRS WELL WITH */}
      <section className="container border-t border-divider py-20 md:py-24">
        <Eyebrow className="mb-3">● PAIRS WELL WITH</Eyebrow>
        <h2 className="font-sans font-semibold text-h3 md:text-h2 leading-[1.15] tracking-tight text-ink mb-8">
          Other products you’ll use alongside this.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {product.pairsWith.map((pw) => (
            <Link
              key={pw.product}
              href={pw.href}
              className="group bg-surface-raised border border-field rounded-md p-6 hover:border-brand/40 transition-colors flex flex-col gap-3"
            >
              <Eyebrow size="sm" tone="ink-faint">PLATFORM</Eyebrow>
              <div className="h-[22px] flex items-center text-ink font-sans font-semibold text-h4">
                <ProductMark name={pw.product} />
              </div>
              <p className="text-ink-muted text-body-sm leading-[1.6] flex-1">{pw.body}</p>
              <span className="text-brand text-caption font-medium group-hover:underline underline-offset-4 inline-flex items-center gap-1.5">
                Read more <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. CTA, explicit waitlist framing */}
      <section className="container border-t border-divider py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <div className="inline-flex items-center mb-5">
            <ComingSoonPill />
          </div>
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
            {product.ctaTitle}
          </h2>
          <p className="text-ink-muted text-body-lg mt-6">{product.ctaBody}</p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Button href={product.ctaPrimary.href} variant="primary">
              {product.ctaPrimary.label}
            </Button>
            <Button href={product.ctaSecondary.href} variant="secondary">
              {product.ctaSecondary.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Coming-soon pill, used in the hero AND in the CTA block ───────────── */

function ComingSoonPill() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-eyebrow text-brand border border-brand/45 bg-brand/[0.04] rounded px-2 py-1">
      <span className="inline-block w-1 h-1 rounded-full bg-brand animate-pulse" aria-hidden />
      COMING Q1 2026 · EARLY ACCESS
    </span>
  );
}

/* ── Hero bullet line ───────────────────────────────────────────────────── */

function BulletLine({
  accent,
  text,
}: {
  accent: string;
  text: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <Eyebrow as="span" size="sm" className="mt-[3px] w-12 shrink-0">{accent}</Eyebrow>
      <span className="text-ink-muted text-body leading-[1.55]">{text}</span>
    </li>
  );
}

/* ── WhatCard, mechanism panel (mock code editor) + title + body ───────── */

function WhatCard({ p }: { p: ProductPoint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.32 }}
      className="bg-surface-raised p-6 md:p-7 flex flex-col"
    >
      <div className="bg-surface/60 border border-field rounded-md px-3 py-2.5 mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden />
            <Eyebrow as="span" size="sm" tone="ink-faint">mechanism</Eyebrow>
          </span>
          <span className="font-mono text-micro text-ink-faint">{p.n}</span>
        </div>
        <div className="font-mono text-caption leading-[1.5] text-brand flex items-center gap-1 min-h-[18px]">
          <span className="text-ink-faint">›</span>
          <motion.span
            className="truncate"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {p.detail ?? p.title}
          </motion.span>
          <motion.span
            className="inline-block w-1 h-3 bg-brand shrink-0"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        </div>
      </div>

      <h3 className="font-sans font-semibold text-h4 text-ink leading-snug mb-2.5">
        {p.title}
      </h3>
      <p className="text-ink-muted text-body-sm leading-[1.65]">{p.body}</p>
    </motion.div>
  );
}

/* ── WhenCard, corner ambient visual + number + title + body + detail ──── */

function WhenCard({ p }: { p: ProductPoint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.32 }}
      className="bg-surface-raised p-6 md:p-7 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4 min-h-[36px]">
        <span className="font-mono text-eyebrow tabular-nums text-brand">{p.n}</span>
        {p.visual && (
          <div className="opacity-90">
            <PointVisual kind={p.visual} />
          </div>
        )}
      </div>

      <h3 className="font-sans font-semibold text-h4 text-ink leading-snug mb-2.5">
        {p.title}
      </h3>
      <p className="text-ink-muted text-body-sm leading-[1.65]">{p.body}</p>

      {p.detail && (
        <code className="mt-4 inline-block font-mono text-eyebrow text-brand bg-surface/40 border border-field rounded px-2.5 py-1.5 leading-snug self-start max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {p.detail}
        </code>
      )}
    </motion.div>
  );
}
