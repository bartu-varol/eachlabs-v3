'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductMark } from '@/components/ui/ProductMark';
import { PointVisual } from '@/components/ui/PointVisual';
import { PRODUCTS, type ProductPoint } from '@/lib/products';
import { AskSense } from './AskSense';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* ──────────────────────────────────────────────────────────────────────────
   SenseShowcase, bespoke /each-sense page.

   The agent is the headline. We open with a tight framing strip, then drop
   the live AskSense demo immediately, then anatomy, OpenAI-compatible
   drop-in, use-cases, pairs-with, CTA.
────────────────────────────────────────────────────────────────────────── */

export function SenseShowcase() {
  const product = PRODUCTS.sense;

  return (
    <>
      {/* 1. TIGHT HERO STRIP, frames what AskSense is below */}
      <section className="container py-14 md:py-20">
        <Link
          href="/platform"
          className="inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> all platform products
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-[820px] mt-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <LiveNowPill />
            <OpenAIPill />
          </div>
          <h1 className="font-sans font-semibold text-display sm:text-display-lg lg:text-hero xl:text-hero leading-[0.98] tracking-tightest mt-6 text-ink">
            {product.title}
          </h1>
          <p className="text-ink-muted text-body-lg leading-[1.55] max-w-[640px] mt-7">
            {product.body}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 font-mono text-caption text-brand">
            <span aria-hidden>↓</span> try the agent
          </div>
        </motion.div>
      </section>

      {/* 2. THE AGENT, full-width interactive demo, the attention-grabber */}
      <AskSense />

      {/* 3. STATS */}
      <section className="container mt-8 md:mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {product.stats.map((s) => (
            <div key={s.label} className="bg-surface-raised px-5 py-6">
              <div className="font-sans font-semibold text-h3 md:text-h2 text-brand tabular-nums leading-none break-words">
                {s.value}
              </div>
              <div className="text-ink-faint text-caption mt-2 leading-[1.35]">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mt-3 text-center md:text-left">
          ⚐ what the agent does the moment you call it
        </p>
      </section>

      {/* 4. WHAT IT DOES */}
      <section className="relative border-t border-divider overflow-hidden mt-20 md:mt-28">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 0% 30%, rgb(var(--brand) / 0.05), transparent 60%)',
          }}
        />
        <div className="container py-20 md:py-24 relative">
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

      {/* 5. DROP-IN, OpenAI-compatible code example + agent-framework pills */}
      <section className="container border-t border-divider py-20 md:py-24">
        <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          Change the base URL. Keep the SDK.
        </h2>
        <p className="text-ink-muted text-body-lg leading-[1.65] max-w-[620px] mt-6">
          sense ships an OpenAI-shaped endpoint, so anything that already speaks
          OpenAI, official SDK, LangChain, CrewAI, AutoGen, the Vercel AI SDK,
          becomes a media-aware agent the moment you point it at the new URL.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 mt-10 items-start">
          <CodeBlock code={product.code} />

          <div className="flex flex-col gap-5">
            <Eyebrow size="sm" tone="ink-faint">WORKS WITH</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {product.providers.map((p) => (
                <span
                  key={p}
                  className="font-mono text-caption px-3 py-1.5 border border-field rounded-full text-ink-muted bg-surface-raised"
                >
                  {p}
                </span>
              ))}
            </div>
            <div className="bg-surface-raised border border-field rounded-md p-5 mt-2">
              <Eyebrow size="sm" className="mb-2">BASE URL</Eyebrow>
              <code className="font-mono text-caption text-ink break-all">
                https://eachsense-agent.core.eachlabs.run/v1
              </code>
              <p className="text-ink-faint text-caption mt-3 leading-[1.5]">
                Use it with <code className="text-brand">model: &quot;each::sense&quot;</code>. Tool
                calls and streaming behave exactly as your framework expects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHEN TO REACH FOR IT */}
      <section className="container border-t border-divider py-20 md:py-24">
        <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.1] tracking-tightest text-ink max-w-[680px]">
          {product.whenTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-10">
          {product.whenPoints.map((p) => (
            <WhenCard key={p.n} p={p} />
          ))}
        </div>
      </section>

      {/* 7. EXPLORE THE REST */}
      <section className="container border-t border-divider py-16 md:py-20">
        <h2 className="font-sans font-semibold text-h3 md:text-h2 leading-[1.15] tracking-tight text-ink mb-8">
          Explore the rest of each::labs.
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
      <section className="container border-t border-divider py-20 md:py-28">
        <div className="max-w-[680px] mx-auto text-center">
          <div className="inline-flex items-center mb-5 gap-2">
            <LiveNowPill />
            <OpenAIPill />
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

/* ── Live pill, sense ships today ─────────────────────────────────────── */

function LiveNowPill() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-eyebrow text-brand border border-brand/45 bg-brand/[0.04] rounded px-2 py-1">
      <span className="inline-block w-1 h-1 rounded-full bg-brand animate-pulse" aria-hidden />
      LIVE NOW
    </span>
  );
}

/* ── OpenAI-compatible pill ──────────────────────────────────────────── */

function OpenAIPill() {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-micro uppercase tracking-eyebrow text-ink-muted border border-field bg-surface-raised rounded px-2 py-1">
      OPENAI-COMPATIBLE
    </span>
  );
}

/* ── Code block with terminal-style framing ──────────────────────────── */

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="bg-surface-raised border border-field rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-field bg-surface/40">
        <Eyebrow as="span" size="sm" tone="ink-faint">example · openai sdk</Eyebrow>
        <span className="font-mono text-micro text-ink-faint">javascript</span>
      </div>
      <pre className="overflow-x-auto p-5 text-caption leading-[1.7] font-mono text-ink-muted">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ── WhatCard, mechanism panel + title + body ─────────────────────────── */

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

/* ── WhenCard, ambient visual + number + title + body + detail ────────── */

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
