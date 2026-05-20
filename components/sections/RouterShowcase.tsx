'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductMark } from '@/components/ui/ProductMark';
import { PointVisual } from '@/components/ui/PointVisual';
import { PRODUCTS, type ProductPoint } from '@/lib/products';
import { RouterDemo } from './RouterDemo';
import { RouterAnatomy } from './RouterAnatomy';
import { LiveTerminal } from './LiveTerminal';
import { ChaosVisual } from './ChaosVisuals';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* ──────────────────────────────────────────────────────────────────────────
   RouterShowcase, bespoke /router page.

   Why bespoke: the generic ProductPage tells the same story for all six
   platform products. Router benefits from a domain-specific live demo (model
   lanes, failover anatomy, integration steps) that the template can't model.
   The other five products keep using ProductPage; only /router opts out.

   Section order (designed for the 5-second comprehension test):
     1. Hero           , split copy + live RouterDemo (the "what + why")
     2. Stats grid     , quantitative anchor under the hero
     3. What it does   , three mechanism cards (mock code panels)
     4. Live           , cinematic console: streaming logs + fallback scene
     5. Anatomy        , trigger / decision / outcome breakdown
     6. When to reach  , four scenarios with ambient point visuals
     7. Pairs with     , links to Workflows / Trace / Attributes
     8. CTA            , start free / docs
────────────────────────────────────────────────────────────────────────── */

export function RouterShowcase() {
  const product = PRODUCTS.router;

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
            <Eyebrow>* {product.eyebrow}</Eyebrow>
            <h1 className="font-sans font-semibold text-display sm:text-display-lg lg:text-hero xl:text-hero leading-[0.98] tracking-tightest mt-6 text-ink">
              {product.title}
            </h1>
            <p className="text-ink-muted text-body-lg leading-[1.55] max-w-[540px] mt-7">
              {product.body}
            </p>

            {/* Three-line "what / why / how" the demo on the right unpacks visually. */}
            <ul className="mt-8 flex flex-col gap-2.5 max-w-[520px]">
              <BulletLine
                accent="WHAT"
                text="An auto failover layer between your code and every model provider."
              />
              <BulletLine
                accent="WHY"
                text="Quality, latency and errors are watched live. Failover fires before pagerduty."
              />
              <BulletLine
                accent="HOW"
                text={
                  <>
                    Add <code className="font-mono text-caption text-brand">router.fallback</code> to any
                    each() call. The trace shows what fired.
                  </>
                }
              />
            </ul>
          </motion.div>

          {/* RIGHT, live demo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <RouterDemo />
          </motion.div>
        </div>
      </section>

      {/* 2. STATS, full-width anchor under hero */}
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

      {/* 4. LIVE, kling-v3 just degraded. wan-2.7 took over. */}
      <section className="relative border-t border-divider overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--brand) / 0.06), transparent 65%)',
          }}
        />
        <div className="container py-24 md:py-28 relative">
          <Eyebrow className="mb-3">● LIVE</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.1] tracking-tightest text-ink max-w-[760px]">
            {product.liveTitle}
          </h2>
          <p className="text-ink-muted text-body leading-[1.65] max-w-[620px] mt-4">
            {product.liveBody}
          </p>

          {/* Cinematic console, terminal (logs) on the left, scene (visual) on the right. */}
          <div className="mt-10 bg-surface border border-field rounded-md overflow-hidden">
            <LiveConsoleHeader />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] divide-y lg:divide-y-0 lg:divide-x divide-field">
              {/* Left, streaming logs */}
              <div className="px-6 md:px-7 py-6 md:py-7 min-h-[320px]">
                <Eyebrow size="sm" tone="ink-faint" className="mb-3">▸ live logs</Eyebrow>
                <LiveTerminal slug="router" />
              </div>
              {/* Right, animated fallback scene */}
              <div className="px-6 md:px-7 py-6 md:py-7 min-h-[320px] flex flex-col">
                <Eyebrow size="sm" tone="ink-faint" className="mb-3">▸ what happens</Eyebrow>
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
              className="font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint hover:text-brand transition-colors inline-flex items-center gap-1.5"
            >
              full reference in the docs <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FAILOVER ANATOMY */}
      <RouterAnatomy />

      {/* 6. WHEN TO REACH FOR IT */}
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

      {/* 7. PAIRS WELL WITH */}
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

      {/* 8. CTA */}
      <section className="container border-t border-divider py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
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

/* ── Hero bullet line, eyebrow tag + text ──────────────────────────────── */

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
      {/* Mechanism panel, looks like a tiny code/config editor */}
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

/* ── LIVE console chrome, header (pulse + live counter) + footer ───────── */

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
    <span className="font-mono text-eyebrow tabular-nums text-ink" suppressHydrationWarning>
      {n}
    </span>
  );
}

function LiveConsoleHeader() {
  return (
    <div className="flex items-center justify-between px-5 md:px-6 py-3 border-b border-field bg-surface-raised/50">
      <div className="flex items-center gap-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-danger/55" />
          <span className="w-2.5 h-2.5 rounded-full bg-caution/55" />
          <span className="w-2.5 h-2.5 rounded-full bg-ok/55" />
        </span>
        <span className="hidden sm:inline-flex items-center gap-2 font-mono text-micro uppercase tracking-eyebrow text-ink-muted">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden />
          <span>
            <span className="text-ink-faint">each::</span>router · prod
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <LiveCounter />
        <Eyebrow as="span" size="sm">reqs / sec</Eyebrow>
      </div>
    </div>
  );
}

function LiveConsoleFooter() {
  return (
    <div className="flex items-center justify-between px-5 md:px-6 py-2.5 border-t border-field bg-surface-raised/30 font-mono text-micro text-ink-faint uppercase tracking-eyebrow">
      <span>region: us-east-1 · eu-west-1 · apac-1</span>
      <span className="hidden sm:inline-flex items-center gap-1.5 normal-case tracking-normal">
        <span>powered by</span>
        <Image
          src="/brand/each-router-logo.svg"
          alt="each::router"
          width={1527}
          height={327}
          className="h-[14px] w-auto translate-y-[1px]"
        />
      </span>
    </div>
  );
}
