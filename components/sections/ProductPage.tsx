'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { EachLabel } from '@/components/ui/EachLabel';
import type { ProductDef, ProductPoint } from '@/lib/products';

/** Per-product code header — filename + language for the dev-feel CodeBlock. */
const CODE_META: Record<ProductDef['slug'], { filename: string; language: string }> = {
  workflows:  { filename: 'workflow.define.ts',     language: 'ts' },
  trace:      { filename: 'trace.export.ts',        language: 'ts' },
  attributes: { filename: 'tag-call.ts',            language: 'ts' },
  router:     { filename: 'router.fallback.ts',     language: 'ts' },
  enhancer:   { filename: 'enhancer.run.ts',        language: 'ts' },
  ab:         { filename: 'experiment.ts',          language: 'ts' },
};

function NumberedCard({ p, accent }: { p: ProductPoint; accent: 'spark' | 'highlight' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.32 }}
      className="bg-surface p-6 md:p-7"
    >
      <div className={`font-mono text-[11px] tabular-nums mb-3 ${accent === 'spark' ? 'text-spark' : 'text-highlight'}`}>
        {p.n}
      </div>
      <h3 className="font-display font-semibold text-[18px] text-ink leading-snug mb-2">{p.title}</h3>
      <p className="text-ink2 text-[13.5px] leading-[1.65]">{p.body}</p>
    </motion.div>
  );
}

export function ProductPage({ product }: { product: ProductDef }) {
  return (
    <>
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <Link
          href="/platform"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> all platform products
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * {product.eyebrow}
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[76px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[920px]">
            {product.title}
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[680px] mt-7">{product.body}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule mt-12 border border-rule rounded-md overflow-hidden">
            {product.stats.map((s) => (
              <div key={s.label} className="bg-surface px-5 py-6">
                <div className="font-display font-semibold text-[24px] md:text-[28px] text-spark tabular-nums leading-none break-words">
                  {s.value}
                </div>
                <div className="text-ink3 text-[12px] mt-2">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Trusted by — quick social proof */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
              SHIPPED BY
            </span>
            {product.trustedBy.map((name) => (
              <span key={name} className="font-mono text-[12px] text-ink2">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* What it does */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 0% 30%, rgb(var(--c-spark) / 0.05), transparent 60%)' }}
        />
        <div className="container py-24 md:py-28 relative">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● WHAT IT DOES
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            {product.whatTitle}
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.65] max-w-[620px] mt-6">{product.whatBody}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
            {product.whatPoints.map((p) => (
              <NumberedCard key={p.n} p={p} accent="spark" />
            ))}
          </div>
        </div>
      </section>

      {/* Live demo (lightweight: title + body + code shell) */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 100% 30%, rgb(var(--c-highlight) / 0.05), transparent 60%)' }}
        />
        <div className="container py-24 md:py-28 relative">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-highlight mb-3">
            ● LIVE
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink max-w-[760px]">
            {product.liveTitle}
          </h2>
          <p className="text-ink2 text-[14px] leading-[1.65] max-w-[620px] mt-4">{product.liveBody}</p>

          <div className="mt-8">
            <CodeBlock
              code={product.code}
              filename={CODE_META[product.slug].filename}
              language={CODE_META[product.slug].language}
            />
          </div>
        </div>
      </section>

      {/* When to reach for it */}
      <section className="container border-t border-rule py-24 md:py-28">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● WHEN YOU’D REACH FOR IT
        </div>
        <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink max-w-[680px]">
          {product.whenTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {product.whenPoints.map((p) => (
            <NumberedCard key={p.n} p={p} accent="spark" />
          ))}
        </div>
      </section>

      {/* Testimonial — metric-driven quote */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.06), transparent 65%)' }}
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
                <div className="text-ink text-[14px] font-medium">{product.testimonial.name}</div>
                <div className="text-ink3 text-[13px] mt-0.5">{product.testimonial.role}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pairs well with */}
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
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">PLATFORM</div>
              <h3 className="font-display font-semibold text-[20px] text-ink"><EachLabel name={pw.product} /></h3>
              <p className="text-ink2 text-[13.5px] leading-[1.6] flex-1">{pw.body}</p>
              <span className="text-spark text-[12.5px] font-medium group-hover:underline underline-offset-4 inline-flex items-center gap-1.5">
                Read more <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            {product.ctaTitle}
          </h2>
          <p className="text-ink2 text-[15px] mt-6">{product.ctaBody}</p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Button href={product.ctaPrimary.href} variant="primary">{product.ctaPrimary.label}</Button>
            <Button href={product.ctaSecondary.href} variant="secondary">{product.ctaSecondary.label}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
