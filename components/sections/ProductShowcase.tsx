'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EachLabel } from '@/components/ui/EachLabel';
import type { ProductDef, ProductPoint } from '@/lib/products';

/* ──────────────────────────────────────────────────────────────────────────
   ProductShowcase — shared 9-section page wrapper for /trace, /attributes,
   /ab, and any future product page that wants the bespoke treatment.

   The three "bespoke" sections (demo / howTo / anatomy) are passed as React
   nodes — each product builds its own <FooDemo />, <FooHowTo />, <FooAnatomy />
   in a 'use client' file. Everything else is shared.

   Pass `comingSoon` to render the early-access pill, the stats disclaimer,
   and the EARLY-ACCESS COHORT label instead of SHIPPED BY.

   Note: the existing Router/Workflows/Enhancer pages duplicate this wrapper
   for historical reasons. Migrating them is a free win when convenient.
────────────────────────────────────────────────────────────────────────── */

export type ProductShowcaseProps = {
  product: ProductDef;
  /**
   * Three single-sentence "answers" that run as eyebrow bullets in the hero.
   * Pass strings — or React nodes if you want inline <code> in the HOW.
   */
  whatWhyHow: {
    what: React.ReactNode;
    why: React.ReactNode;
    how: React.ReactNode;
  };
  demo:    React.ReactNode;
  howTo:   React.ReactNode;
  anatomy: React.ReactNode;
  /** When set, the hero + stats + CTA show the early-access framing. */
  comingSoon?: {
    pillLabel?:       string;
    trustedByLabel?:  string;
    statsDisclaimer?: string;
  };
};

const COMING_SOON_DEFAULTS = {
  pillLabel:       'COMING Q1 2026 · EARLY ACCESS',
  trustedByLabel:  'EARLY-ACCESS COHORT',
  statsDisclaimer: '⚐ projections from the early-access cohort · subject to change at GA',
};

export function ProductShowcase({
  product,
  whatWhyHow,
  demo,
  howTo,
  anatomy,
  comingSoon,
}: ProductShowcaseProps) {
  const cs = comingSoon ? { ...COMING_SOON_DEFAULTS, ...comingSoon } : null;

  return (
    <>
      {/* 1. HERO */}
      <section className="container py-16 md:py-24">
        <Link
          href="/platform"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> all platform products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-10 lg:gap-16 items-start mt-8">
          {/* LEFT — copy */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
                * {product.eyebrow}
              </div>
              {cs && <ComingSoonPill label={cs.pillLabel} />}
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[56px] lg:text-[64px] xl:text-[72px] leading-[0.98] tracking-tightest mt-6 text-ink">
              {product.title}
            </h1>
            <p className="text-ink2 text-[16px] leading-[1.55] max-w-[540px] mt-7">
              {product.body}
            </p>

            {/* WHAT / WHY / HOW */}
            <ul className="mt-8 flex flex-col gap-2.5 max-w-[540px]">
              <BulletLine accent="WHAT" text={whatWhyHow.what} />
              <BulletLine accent="WHY"  text={whatWhyHow.why}  />
              <BulletLine accent="HOW"  text={whatWhyHow.how}  />
            </ul>

            {/* Trusted by — quick social proof, label flips for early access */}
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                {cs ? cs.trustedByLabel : 'SHIPPED BY'}
              </span>
              {product.trustedBy.map((name) => (
                <span key={name} className="font-mono text-[12px] text-ink2">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — bespoke demo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            {demo}
          </motion.div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="container -mt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {product.stats.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-6">
              <div className="font-display font-semibold text-[24px] md:text-[28px] text-spark tabular-nums leading-none break-words">
                {s.value}
              </div>
              <div className="text-ink3 text-[12px] mt-2">{s.label}</div>
            </div>
          ))}
        </div>
        {cs && (
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-3 text-center md:text-left">
            {cs.statsDisclaimer}
          </p>
        )}
      </section>

      {/* 3. WHAT IT DOES */}
      <section className="relative border-t border-rule overflow-hidden mt-20 md:mt-28">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 0% 30%, rgb(var(--c-spark) / 0.05), transparent 60%)',
          }}
        />
        <div className="container py-24 md:py-28 relative">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● WHAT IT DOES
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            {product.whatTitle}
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.65] max-w-[620px] mt-6">
            {product.whatBody}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
            {product.whatPoints.map((p) => (
              <NumberedCard key={p.n} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW TO USE IT — bespoke */}
      {howTo}

      {/* 5. ANATOMY — bespoke */}
      {anatomy}

      {/* 6. WHEN TO REACH FOR IT */}
      <section className="container border-t border-rule py-24 md:py-28">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● WHEN YOU’D REACH FOR IT
        </div>
        <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink max-w-[680px]">
          {product.whenTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {product.whenPoints.map((p) => (
            <NumberedCard key={p.n} p={p} />
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIAL */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.06), transparent 65%)',
          }}
        />
        <div className="container py-20 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-center">
            <div className="lg:border-r lg:border-rule lg:pr-16">
              <div className="font-display font-semibold text-[44px] md:text-[64px] leading-[0.9] tracking-tightest text-spark tabular-nums whitespace-nowrap">
                {product.testimonial.metric}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-3 max-w-[260px]">
                {product.testimonial.metricLabel}
              </div>
            </div>
            <div>
              <blockquote className="font-display text-[20px] md:text-[26px] leading-[1.35] tracking-tight text-ink">
                <span className="text-spark">“</span>
                {product.testimonial.quote}
                <span className="text-spark">”</span>
              </blockquote>
              <div className="mt-5">
                <div className="text-ink text-[14px] font-medium">
                  {product.testimonial.name}
                </div>
                <div className="text-ink3 text-[13px] mt-0.5">
                  {product.testimonial.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PAIRS WELL WITH */}
      <section className="container border-t border-rule py-20 md:py-24">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● PAIRS WELL WITH
        </div>
        <h2 className="font-display font-semibold text-[24px] md:text-[28px] leading-[1.15] tracking-tight text-ink mb-8">
          Other products you’ll use alongside this.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {product.pairsWith.map((pw) => (
            <Link
              key={pw.product}
              href={pw.href}
              className="group bg-surface border border-rule2 rounded-md p-6 hover:border-spark/40 transition-colors flex flex-col gap-3"
            >
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                PLATFORM
              </div>
              <h3 className="font-display font-semibold text-[20px] text-ink">
                <EachLabel name={pw.product} />
              </h3>
              <p className="text-ink2 text-[13.5px] leading-[1.6] flex-1">{pw.body}</p>
              <span className="text-spark text-[12.5px] font-medium group-hover:underline underline-offset-4 inline-flex items-center gap-1.5">
                Read more <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. CTA — coming-soon products show the pill above the headline too */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          {cs && (
            <div className="inline-flex items-center mb-5">
              <ComingSoonPill label={cs.pillLabel} />
            </div>
          )}
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            {product.ctaTitle}
          </h2>
          <p className="text-ink2 text-[15px] mt-6">{product.ctaBody}</p>
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

/* ── Coming-soon pill ───────────────────────────────────────────────────── */

function ComingSoonPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-eyebrow text-spark border border-spark/45 bg-spark/[0.04] rounded px-2 py-1">
      <span className="inline-block w-1 h-1 rounded-full bg-spark animate-pulse" aria-hidden />
      {label}
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
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mt-[3px] w-12 shrink-0">
        {accent}
      </span>
      <span className="text-ink2 text-[14px] leading-[1.55]">{text}</span>
    </li>
  );
}

/* ── Numbered card (used by What it does + When to reach for it) ────────── */

function NumberedCard({ p }: { p: ProductPoint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.32 }}
      className="bg-surface p-6 md:p-7"
    >
      <div className="font-mono text-[11px] tabular-nums mb-3 text-spark">{p.n}</div>
      <h3 className="font-display font-semibold text-[18px] text-ink leading-snug mb-2">
        {p.title}
      </h3>
      <p className="text-ink2 text-[13.5px] leading-[1.65]">{p.body}</p>
    </motion.div>
  );
}
