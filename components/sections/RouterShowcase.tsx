'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EachLabel } from '@/components/ui/EachLabel';
import { PointVisual } from '@/components/ui/PointVisual';
import { PRODUCTS, type ProductPoint } from '@/lib/products';
import { RouterDemo } from './RouterDemo';
import { RouterAnatomy } from './RouterAnatomy';
import { LiveTerminal } from './LiveTerminal';
import { ChaosVisual } from './ChaosVisuals';

/* ──────────────────────────────────────────────────────────────────────────
   RouterShowcase — bespoke /router page.

   Why bespoke: the generic ProductPage tells the same story for all six
   platform products. Router benefits from a domain-specific live demo (model
   lanes, spillover anatomy, integration steps) that the template can't model.
   The other five products keep using ProductPage; only /router opts out.

   Section order (designed for the 5-second comprehension test):
     1. Hero            — split copy + live RouterDemo (the "what + why")
     2. Stats grid      — quantitative anchor under the hero
     3. What it does    — three mechanism cards (mock code panels)
     4. Live            — cinematic console: streaming logs + fallback scene
     5. Anatomy         — trigger / decision / outcome breakdown
     6. When to reach   — four scenarios with ambient point visuals
     7. Testimonial     — metric-driven quote
     8. Pairs with      — links to Workflows / Trace / Attributes
     9. CTA             — start free / docs
────────────────────────────────────────────────────────────────────────── */

export function RouterShowcase() {
  const product = PRODUCTS.router;

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
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              * {product.eyebrow}
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[56px] lg:text-[64px] xl:text-[72px] leading-[0.98] tracking-tightest mt-6 text-ink">
              {product.title}
            </h1>
            <p className="text-ink2 text-[16px] leading-[1.55] max-w-[540px] mt-7">
              {product.body}
            </p>

            {/* Three-line "what / why / how" the demo on the right unpacks visually. */}
            <ul className="mt-8 flex flex-col gap-2.5 max-w-[520px]">
              <BulletLine
                accent="WHAT"
                text="An auto-failover layer between your code and every model provider."
              />
              <BulletLine
                accent="WHY"
                text="Quality, latency and errors are watched live. Spillover fires before pagerduty."
              />
              <BulletLine
                accent="HOW"
                text={
                  <>
                    Add <code className="font-mono text-[12.5px] text-spark">router.fallback</code> to any
                    each.run() call. The trace shows what fired.
                  </>
                }
              />
            </ul>

            {/* Trusted by — quick social proof */}
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
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

          {/* RIGHT — live demo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <RouterDemo />
          </motion.div>
        </div>
      </section>

      {/* 2. STATS — full-width anchor under hero */}
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
              <WhatCard key={p.n} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE — kling-v3 just degraded. wan-2.7 took over. */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.06), transparent 65%)',
          }}
        />
        <div className="container py-24 md:py-28 relative">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● LIVE
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink max-w-[760px]">
            {product.liveTitle}
          </h2>
          <p className="text-ink2 text-[14px] leading-[1.65] max-w-[620px] mt-4">
            {product.liveBody}
          </p>

          {/* Cinematic console — terminal (logs) on the left, scene (visual) on the right. */}
          <div className="mt-10 bg-bg border border-rule2 rounded-md overflow-hidden">
            <LiveConsoleHeader />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-rule2">
              {/* Left — streaming logs */}
              <div className="px-6 md:px-7 py-6 md:py-7 min-h-[320px]">
                <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-3">
                  ▸ live logs
                </div>
                <LiveTerminal slug="router" />
              </div>
              {/* Right — animated fallback scene */}
              <div className="px-6 md:px-7 py-6 md:py-7 min-h-[320px] flex flex-col">
                <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-3">
                  ▸ what happens
                </div>
                <div className="flex-1 flex items-center">
                  <div className="w-full">
                    <ChaosVisual visual="fallback" />
                  </div>
                </div>
              </div>
            </div>
            <LiveConsoleFooter />
          </div>

          <div className="mt-4 flex items-center justify-end">
            <Link
              href="https://docs.eachlabs.ai/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-spark transition-colors inline-flex items-center gap-1.5"
            >
              full reference in the docs <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SPILLOVER ANATOMY */}
      <RouterAnatomy />

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
            <WhenCard key={p.n} p={p} />
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

      {/* 9. CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
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

/* ── Hero bullet line — eyebrow tag + text ──────────────────────────────── */

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

/* ── WhatCard — mechanism panel (mock code editor) + title + body ───────── */

function WhatCard({ p }: { p: ProductPoint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.32 }}
      className="bg-surface p-6 md:p-7 flex flex-col"
    >
      {/* Mechanism panel — looks like a tiny code/config editor */}
      <div className="bg-bg/60 border border-rule2 rounded-md px-3 py-2.5 mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
              mechanism
            </span>
          </span>
          <span className="font-mono text-[9px] text-ink3">{p.n}</span>
        </div>
        <div className="font-mono text-[12px] leading-[1.5] text-spark flex items-center gap-1 min-h-[18px]">
          <span className="text-ink3">›</span>
          <motion.span
            className="truncate"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {p.detail ?? p.title}
          </motion.span>
          <motion.span
            className="inline-block w-1 h-3 bg-spark shrink-0"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        </div>
      </div>

      <h3 className="font-display font-semibold text-[19px] text-ink leading-snug mb-2.5">
        {p.title}
      </h3>
      <p className="text-ink2 text-[13.5px] leading-[1.65]">{p.body}</p>
    </motion.div>
  );
}

/* ── WhenCard — corner ambient visual + number + title + body + detail ──── */

function WhenCard({ p }: { p: ProductPoint }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.32 }}
      className="bg-surface p-6 md:p-7 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4 min-h-[36px]">
        <span className="font-mono text-[11px] tabular-nums text-spark">{p.n}</span>
        {p.visual && (
          <div className="opacity-90">
            <PointVisual kind={p.visual} />
          </div>
        )}
      </div>

      <h3 className="font-display font-semibold text-[18px] text-ink leading-snug mb-2.5">
        {p.title}
      </h3>
      <p className="text-ink2 text-[13.5px] leading-[1.65]">{p.body}</p>

      {p.detail && (
        <code className="mt-4 inline-block font-mono text-[11.5px] text-spark bg-bg/40 border border-rule2 rounded px-2.5 py-1.5 leading-snug self-start max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {p.detail}
        </code>
      )}
    </motion.div>
  );
}

/* ── LIVE console chrome — header (pulse + live counter) + footer ───────── */

function LiveCounter() {
  const base = 47; // reqs / sec
  const [n, setN] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => {
        const drift = Math.round((Math.random() - 0.45) * 2);
        const next = Math.max(Math.round(base * 0.95), Math.min(Math.round(base * 1.05), prev + drift));
        return next;
      });
    }, 380);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-[11px] tabular-nums text-ink" suppressHydrationWarning>
      {n}
    </span>
  );
}

function LiveConsoleHeader() {
  return (
    <div className="flex items-center justify-between px-5 md:px-6 py-3 border-b border-rule2 bg-surface/50">
      <div className="flex items-center gap-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-fail/55" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow/55" />
          <span className="w-2.5 h-2.5 rounded-full bg-success/55" />
        </span>
        <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
          <span>
            <span className="text-ink3">each::</span>router · prod
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <LiveCounter />
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
          reqs / sec
        </span>
      </div>
    </div>
  );
}

function LiveConsoleFooter() {
  return (
    <div className="flex items-center justify-between px-5 md:px-6 py-2.5 border-t border-rule2 bg-surface/30 font-mono text-[10px] text-ink3 uppercase tracking-eyebrow">
      <span>region: us-east-1 · eu-west-1 · apac-1</span>
      <span className="hidden sm:inline">
        powered by <span className="text-ink2">each::router</span>
      </span>
    </div>
  );
}
