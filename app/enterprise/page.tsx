'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users, BarChart3, Lock, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { customerStories, enterprise } from '@/lib/content';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { FaqShowcase } from '@/components/ui/FaqShowcase';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const ACCENT_VAR: Record<string, string> = {
  spark:     'rgb(var(--brand))',
  highlight: 'rgb(var(--cobrand))',
  success:   'rgb(var(--ok))',
  sun:       'rgb(var(--glow))',
  ember:     'rgb(var(--brand-deep))',
  yellow:    'rgb(var(--caution))',
};

const FEATURE_ICON: Record<string, typeof Shield> = {
  'Team budget management':           BarChart3,
  '24/7 contact with engineering':    Zap,
  'Dedicated customer success manager': Users,
  'Custom volume pricing':            BarChart3,
  'Zero retention by default':        Lock,
  'Quarterly business reviews':       CalendarCheck,
};

/* ─────────────────────────────────────────────────────────────────────
   1. HERO, left: copy + CTAs · right: live ops console
   ─────────────────────────────────────────────────────────────────── */
function EnterpriseHero() {
  const { hero } = enterprise;
  return (
    <section className="relative border-b border-divider overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--brand) / 0.08), transparent 65%)',
        }}
      />
      <div className="container py-16 md:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
          {/* LEFT, copy */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <h1 className="font-sans font-semibold text-display sm:text-display-lg lg:text-hero leading-[0.98] tracking-tightest text-ink">
              <span className="block">{hero.headline.line1}</span>
              <span className="block text-ink-faint">{hero.headline.line2Emph}</span>
            </h1>

            <p className="text-ink-muted text-body-lg leading-[1.6] max-w-[560px] mt-7">
              <span className="text-ink">{hero.body}</span>
              {hero.bodyLead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {hero.ctas.map((c) => (
                <Button key={c.label} href={c.href} variant={c.variant}>
                  {c.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT, live ops console */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: EASE_OUT_EXPO }}
          >
            <LiveOpsConsole />
          </motion.div>
        </div>

        {/* Stats grid, full width below the split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-divider mt-14 border border-divider rounded-md overflow-hidden">
          {hero.stats.map((s) => (
            <div key={s.label} className="bg-surface-raised px-5 py-6">
              <div className="font-sans font-semibold text-h3 md:text-h2 text-brand tabular-nums leading-none break-words">
                {s.value}
              </div>
              <div className="text-ink text-caption mt-3">{s.label}</div>
              <div className="text-ink-faint text-eyebrow mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        <p className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mt-6">
          {hero.subtext}
        </p>
      </div>
    </section>
  );
}

/* ── Live ops console ────────────────────────────────────────────────
   Subtle dashboard mock backed by what the page actually claims:
   live request counter (the 1M+ / month stat), three model providers
   from the catalog with pulsing health indicators + animated rps bars
   (the won't-crash pillar), and a streaming log tail showing a real
   failover (kling-v3 503 → wan-2.7 takes over). Loops indefinitely.
*/
const PROVIDERS = [
  { id: 'kling-v3', base: 612, max: 800, status: 'healthy' as const },
  { id: 'veo-3',    base: 384, max: 520, status: 'healthy' as const },
  { id: 'wan-2.7',  base: 251, max: 360, status: 'standby' as const },
] as const;

/* Live tail script, pure text terminal in the workflows LiveTerminal
   style (no image-generating visuals). Lines appear one by one with
   stagger, all sit together once revealed, then fade out and restart. */
type LineKind = 'cmd' | 'ok' | 'fail' | 'trace' | 'comment';

const LINE_PREFIX: Record<LineKind, string> = {
  cmd:     '$',
  ok:      '✓',
  fail:    '✗',
  trace:   '↳',
  comment: '#',
};

const LINE_PREFIX_COLOR: Record<LineKind, string> = {
  cmd:     'text-brand',
  ok:      'text-ok',
  fail:    'text-danger',
  trace:   'text-brand',
  comment: 'text-ink-faint',
};

const LINE_TEXT_COLOR: Record<LineKind, string> = {
  cmd:     'text-ink',
  ok:      'text-ink',
  fail:    'text-ink',
  trace:   'text-ink-muted',
  comment: 'text-ink-faint',
};

const LOG_LINES: { kind: LineKind; text: string }[] = [
  { kind: 'cmd',     text: 'each("kling-v3", input, { fallback: ["wan-2.7"] })' },
  { kind: 'ok',      text: '[03:14:22] kling-v3 · 200 · 892ms · trace_8f2a' },
  { kind: 'fail',    text: '[03:14:24] kling-v3 · 503 · upstream timeout' },
  { kind: 'trace',   text: '[03:14:24] failover armed → wan-2.7' },
  { kind: 'ok',      text: '[03:14:24] wan-2.7 · 200 · 124ms · ✓ recovered' },
  { kind: 'comment', text: 'no pages fired · uptime preserved · 99.99%' },
];

const LOG_CYCLE_S = 10;

function useDrift(base: number, max: number, intervalMs = 600) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => {
        const drift = Math.round((Math.random() - 0.45) * Math.max(4, base * 0.04));
        const next = Math.max(Math.round(base * 0.85), Math.min(max, prev + drift));
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, max, intervalMs]);
  return n;
}

function LiveTail() {
  const lines = LOG_LINES;
  const stagger = 0.85 / Math.max(1, lines.length);
  return (
    <div className="font-mono text-eyebrow leading-[1.7] w-full">
      {lines.map((line, i) => {
        const showStart = i * stagger;
        const t0 = Math.max(0, showStart);
        const t1 = Math.min(0.99, showStart + 0.04);
        const t2 = 0.94;
        const t3 = 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -3 }}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              x: [-3, -3, 0, 0, -3],
            }}
            transition={{
              duration: LOG_CYCLE_S,
              times: [0, t0, t1, t2, t3],
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="flex gap-3 whitespace-nowrap overflow-hidden"
          >
            <span
              className={`${LINE_PREFIX_COLOR[line.kind]} shrink-0 w-3 select-none`}
            >
              {LINE_PREFIX[line.kind]}
            </span>
            <span className={`${LINE_TEXT_COLOR[line.kind]} truncate`}>
              {line.text}
            </span>
          </motion.div>
        );
      })}
      {/* Blinking cursor */}
      <div className="flex gap-3 mt-1">
        <span className="text-brand shrink-0 w-3 select-none">$</span>
        <motion.span
          className="inline-block w-2 h-3.5 bg-brand"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function LiveOpsConsole() {
  // Total requests/sec across active providers, drifts each tick.
  const a = useDrift(PROVIDERS[0].base, PROVIDERS[0].max, 500);
  const b = useDrift(PROVIDERS[1].base, PROVIDERS[1].max, 620);
  const c = useDrift(PROVIDERS[2].base, PROVIDERS[2].max, 720);
  const total = a + b + c;

  const providerValues: Record<string, number> = {
    'kling-v3': a,
    'veo-3':    b,
    'wan-2.7':  c,
  };

  return (
    <div className="bg-surface border border-field rounded-md overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-field bg-surface-raised/50">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-danger/55" />
            <span className="w-2.5 h-2.5 rounded-full bg-caution/55" />
            <span className="w-2.5 h-2.5 rounded-full bg-ok/55" />
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-micro uppercase tracking-eyebrow text-ink-muted">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden />
            <span>
              <span className="text-ink-faint">each::</span>router · prod
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-caption tabular-nums text-ink" suppressHydrationWarning>
            {total.toLocaleString('en-US')}
          </span>
          <Eyebrow as="span" size="sm">rps · live</Eyebrow>
        </div>
      </div>

      {/* Provider rows */}
      <div className="px-5 md:px-6 py-5 md:py-6 flex flex-col gap-3.5">
        <Eyebrow size="sm" tone="ink-faint">▸ providers</Eyebrow>
        {PROVIDERS.map((p) => {
          const value = providerValues[p.id];
          const pct = Math.min(100, Math.round((value / p.max) * 100));
          const isStandby = p.status === 'standby';
          return (
            <div key={p.id} className="flex items-center gap-3">
              <span className="font-mono text-eyebrow text-ink-muted w-20 shrink-0">{p.id}</span>
              {/* RPS bar */}
              <div className="flex-1 relative h-1.5 bg-surface-raised rounded-sm overflow-hidden">
                <motion.span
                  className={`absolute inset-y-0 left-0 rounded-sm ${
                    isStandby ? 'bg-ink-faint/40' : 'bg-brand/80'
                  }`}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span
                className="font-mono text-eyebrow tabular-nums text-ink w-14 text-right"
                suppressHydrationWarning
              >
                {value}
              </span>
              <span
                className={`font-mono text-micro inline-flex items-center gap-1 w-16 shrink-0 ${
                  isStandby ? 'text-ink-faint' : 'text-ok'
                }`}
              >
                <motion.span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    isStandby ? 'bg-ink-faint' : 'bg-ok'
                  }`}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
                {p.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Streaming log tail, workflows LiveTerminal pattern (text-only) */}
      <div className="px-5 md:px-6 py-4 border-t border-field bg-surface-raised/30">
        <Eyebrow size="sm" tone="ink-faint" className="mb-3">▸ live tail</Eyebrow>
        <LiveTail />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-field bg-surface-raised/30 font-mono text-micro text-ink-faint uppercase tracking-eyebrow">
        <span>600+ models · one API · zero retention by default</span>
        <span className="hidden sm:inline">
          powered by <span className="text-ink-muted">each::router</span>
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   2. WHY ENTERPRISE, single narrative, no comparison.
   ─────────────────────────────────────────────────────────────────── */
function WhyEnterprise() {
  const { whyEnterprise: w } = enterprise;
  return (
    <section className="container py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <h2 className="font-sans font-semibold text-h2 md:text-display-lg leading-[1.02] tracking-tightest text-ink max-w-[820px]">
          <span className="block">{w.headline.line1}</span>
          <span className="block text-ink-faint">{w.headline.line2}</span>
        </h2>
        <p className="text-ink-muted text-body-lg leading-[1.65] max-w-[680px] mt-7">
          {w.body}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-12">
        {w.pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.34, delay: i * 0.06, ease: EASE_OUT_EXPO }}
            className="bg-surface-raised p-7 md:p-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand animate-pulse" aria-hidden />
              <Eyebrow as="span" size="sm" tone="ink-faint">{String(i + 1).padStart(2, '0')}</Eyebrow>
            </div>
            <h3 className="font-sans font-semibold text-h4 md:text-h3 text-ink leading-snug mb-3">
              {p.title}
            </h3>
            <p className="text-ink-muted text-body leading-[1.65]">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   3. SOCIAL PROOF, Top 20% + trusted-by row.
   ─────────────────────────────────────────────────────────────────── */
function SocialProof() {
  const { socialProof: sp } = enterprise;
  const logos = customerStories.caseStudies.map((cs) => ({ ...cs.logo, role: cs.role }));
  const marqueeRow = [...logos, ...logos, ...logos];
  return (
    <section className="relative border-t border-divider overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgb(var(--brand) / 0.06), transparent 70%)',
        }}
      />
      <div className="container pt-20 md:pt-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="text-center max-w-[820px] mx-auto"
        >
          <div className="font-sans font-semibold text-hero md:text-[96px] leading-[0.9] tracking-tightest text-brand">
            {sp.metric}
          </div>
          <Eyebrow tone="ink-faint" className="mt-4">{sp.metricLabel}</Eyebrow>
          <p className="text-ink-muted text-body-lg leading-[1.65] mt-7">
            {sp.body}
          </p>
        </motion.div>
      </div>

      {/* Customer logos row — full-width marquee */}
      <div className="mt-14 border-t border-divider py-8 md:py-10 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[rgb(var(--surface-raised))] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[rgb(var(--surface-raised))] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-12 md:gap-16 w-max animate-marquee" style={{ willChange: 'transform' }}>
          {marqueeRow.map((logo, i) => (
            <span
              key={`${logo.alt}-${i}`}
              className="inline-flex h-10 md:h-12 w-32 md:w-40 items-center justify-center text-ink-faint hover:text-ink transition-colors shrink-0"
              aria-label={logo.alt}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="customer-logo h-full w-full object-contain opacity-90"
                unoptimized
              />
              <span className="sr-only">{logo.role}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   4. ENTERPRISE FEATURES, Team budget / 24/7 contact / CSM + more.
   ─────────────────────────────────────────────────────────────────── */
function EnterpriseFeatures() {
  const { features } = enterprise;
  return (
    <section className="container border-t border-divider py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <h2 className="font-sans font-semibold text-h2 md:text-display-lg leading-[1.04] tracking-tightest text-ink max-w-[860px]">
          <span className="block">{features.headline.line1}</span>
          <span className="block text-ink-faint">{features.headline.line2}</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-12">
        {features.tiles.map((t, i) => {
          const Icon = FEATURE_ICON[t.title] ?? Shield;
          const accent = ACCENT_VAR[t.accent];
          return (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.34, delay: i * 0.05, ease: EASE_OUT_EXPO }}
              className="bg-surface-raised p-7 md:p-8 flex flex-col"
            >
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center mb-5"
                style={{
                  background: `${accent.replace(')', ' / 0.10)')}`,
                  border: `1px solid ${accent.replace(')', ' / 0.30)')}`,
                }}
              >
                <Icon size={18} style={{ color: accent }} aria-hidden />
              </div>
              <h3 className="font-sans font-semibold text-h4 md:text-h4 text-ink leading-snug mb-3">
                {t.title}
              </h3>
              <p className="text-ink-muted text-body-sm leading-[1.65]">{t.body}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   6. PROCUREMENT, all CTAs point to /contact (engineering support).
   ─────────────────────────────────────────────────────────────────── */
function Procurement() {
  const { procurement } = enterprise;
  return (
    <section className="container border-t border-divider py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <h2 className="font-sans font-semibold text-h2 md:text-display-lg leading-[1.04] tracking-tightest text-ink max-w-[820px]">
          <span className="block">{procurement.headline.line1}</span>
          <span className="block text-ink-faint">{procurement.headline.line2}</span>
        </h2>
        <p className="text-ink-muted text-body-lg leading-[1.65] max-w-[680px] mt-6">
          {procurement.body}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-12">
        {procurement.assets.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.34, delay: i * 0.04, ease: EASE_OUT_EXPO }}
            className="bg-surface-raised p-6 md:p-7 flex flex-col"
          >
            <h3 className="font-sans font-semibold text-h4 text-ink leading-snug mb-2">
              {a.title}
            </h3>
            <p className="text-ink-faint text-body-sm leading-[1.55] flex-1">{a.sub}</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-brand text-body-sm font-medium hover:underline underline-offset-4"
            >
              Request via engineering <ArrowRight size={13} />
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mt-8">
        {procurement.note}
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   7. FAQ, shared homepage component for design + animation parity.
   ─────────────────────────────────────────────────────────────────── */
function EnterpriseFAQ() {
  const { faq } = enterprise;
  return (
    <FaqShowcase
      items={faq.items}
      eyebrow={faq.eyebrow}
      heading={faq.headline}
      subtitle={faq.italic}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────
   8. FINAL CTA, Talk to engineering.
   ─────────────────────────────────────────────────────────────────── */
function FinalCta() {
  const { finalCta } = enterprise;
  return (
    <section className="relative border-t border-divider py-20 md:py-28 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgb(var(--brand) / 0.10), transparent 65%)',
        }}
      />
      <div className="container relative">
        <div className="max-w-[760px] mx-auto text-center">
          <h2 className="font-sans font-semibold text-display md:text-display-lg leading-[1.02] tracking-tightest text-ink">
            <span className="block">{finalCta.headline.line1}</span>
            <span className="block text-ink-faint">{finalCta.headline.line2}</span>
          </h2>
          <p className="text-ink-muted text-body-lg leading-[1.65] mt-7 max-w-[600px] mx-auto">
            {finalCta.body}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-9">
            <Button href={finalCta.primary.href} variant="primary">
              {finalCta.primary.label}
            </Button>
            <Button href={finalCta.secondary.href} variant="secondary">
              {finalCta.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   PAGE
   ─────────────────────────────────────────────────────────────────── */
export default function EnterprisePage() {
  return (
    <>
      <EnterpriseHero />
      <WhyEnterprise />
      <SocialProof />
      <EnterpriseFeatures />
      <Procurement />
      <EnterpriseFAQ />
      <FinalCta />
    </>
  );
}
