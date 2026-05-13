'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Shield, Zap, Users, BarChart3, Lock, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { enterprise } from '@/lib/content';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const ACCENT_VAR: Record<string, string> = {
  spark:     'rgb(var(--c-spark))',
  highlight: 'rgb(var(--c-highlight))',
  success:   'rgb(var(--c-success))',
  sun:       'rgb(var(--c-sun))',
  ember:     'rgb(var(--c-ember))',
  yellow:    'rgb(var(--c-yellow))',
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
    <section className="relative border-b border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.08), transparent 65%)',
        }}
      />
      <div className="container py-20 md:py-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
          {/* LEFT, copy */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              {hero.pill}
            </div>

            <h1 className="font-display font-semibold text-[44px] sm:text-[60px] lg:text-[72px] leading-[0.98] tracking-tightest text-ink mt-7">
              <span className="block">{hero.headline.line1}</span>
              <span className="block text-ink3 italic">{hero.headline.line2Emph}</span>
            </h1>

            <p className="text-ink2 text-[16px] leading-[1.6] max-w-[560px] mt-7">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule mt-14 border border-rule rounded-md overflow-hidden">
          {hero.stats.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-6">
              <div className="font-display font-semibold text-[26px] md:text-[32px] text-spark tabular-nums leading-none break-words">
                {s.value}
              </div>
              <div className="text-ink text-[12.5px] mt-3">{s.label}</div>
              <div className="text-ink3 text-[11px] mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-6">
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
  cmd:     'text-spark',
  ok:      'text-success',
  fail:    'text-fail',
  trace:   'text-spark',
  comment: 'text-ink3',
};

const LINE_TEXT_COLOR: Record<LineKind, string> = {
  cmd:     'text-ink',
  ok:      'text-ink',
  fail:    'text-ink',
  trace:   'text-ink2',
  comment: 'text-ink3 italic',
};

const LOG_LINES: { kind: LineKind; text: string }[] = [
  { kind: 'cmd',     text: 'each.run("kling-v3", input, { fallback: ["wan-2.7"] })' },
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
    <div className="font-mono text-[11.5px] leading-[1.7] w-full">
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
        <span className="text-spark shrink-0 w-3 select-none">$</span>
        <motion.span
          className="inline-block w-2 h-3.5 bg-spark"
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
    <div className="bg-bg border border-rule2 rounded-md overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-rule2 bg-surface/50">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-fail/55" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow/55" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/55" />
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span>
              <span className="text-ink3">each::</span>router · prod
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[12px] tabular-nums text-ink" suppressHydrationWarning>
            {total.toLocaleString('en-US')}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
            rps · live
          </span>
        </div>
      </div>

      {/* Provider rows */}
      <div className="px-5 md:px-6 py-5 md:py-6 flex flex-col gap-3.5">
        <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
          ▸ providers
        </div>
        {PROVIDERS.map((p) => {
          const value = providerValues[p.id];
          const pct = Math.min(100, Math.round((value / p.max) * 100));
          const isStandby = p.status === 'standby';
          return (
            <div key={p.id} className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-ink2 w-20 shrink-0">{p.id}</span>
              {/* RPS bar */}
              <div className="flex-1 relative h-1.5 bg-surface rounded-sm overflow-hidden">
                <motion.span
                  className={`absolute inset-y-0 left-0 rounded-sm ${
                    isStandby ? 'bg-ink3/40' : 'bg-spark/80'
                  }`}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span
                className="font-mono text-[11px] tabular-nums text-ink w-14 text-right"
                suppressHydrationWarning
              >
                {value}
              </span>
              <span
                className={`font-mono text-[9px] inline-flex items-center gap-1 w-16 shrink-0 ${
                  isStandby ? 'text-ink3' : 'text-success'
                }`}
              >
                <motion.span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    isStandby ? 'bg-ink3' : 'bg-success'
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
      <div className="px-5 md:px-6 py-4 border-t border-rule2 bg-surface/30">
        <div className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3 mb-3">
          ▸ live tail
        </div>
        <LiveTail />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-rule2 bg-surface/30 font-mono text-[10px] text-ink3 uppercase tracking-eyebrow">
        <span>600+ models · one API · zero retention by default</span>
        <span className="hidden sm:inline">
          powered by <span className="text-ink2">each::router</span>
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
    <section className="container py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          {w.eyebrow}
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[56px] leading-[1.02] tracking-tightest text-ink max-w-[820px]">
          <span className="block">{w.headline.line1}</span>
          <span className="block text-ink3 italic">{w.headline.line2}</span>
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[680px] mt-7">
          {w.body}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        {w.pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.34, delay: i * 0.06, ease: EASE_OUT_EXPO }}
            className="bg-surface p-7 md:p-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-display font-semibold text-[20px] md:text-[22px] text-ink leading-snug mb-3">
              {p.title}
            </h3>
            <p className="text-ink2 text-[14px] leading-[1.65]">{p.body}</p>
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
  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgb(var(--c-spark) / 0.06), transparent 70%)',
        }}
      />
      <div className="container py-20 md:py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="text-center max-w-[820px] mx-auto"
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
            {sp.eyebrow}
          </div>
          <div className="font-display font-semibold text-[64px] md:text-[96px] leading-[0.9] tracking-tightest text-spark">
            {sp.metric}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mt-4">
            {sp.metricLabel}
          </div>
          <p className="text-ink2 text-[15px] leading-[1.65] mt-7">
            {sp.body}
          </p>
        </motion.div>

        {/* Customer logos row */}
        <div className="mt-14 border-t border-b border-rule py-7">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {sp.customers.map((c) => (
              <span
                key={c}
                className="font-mono text-[13px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
              >
                {c}
              </span>
            ))}
          </div>
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
    <section className="container border-t border-rule py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          {features.eyebrow}
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[52px] leading-[1.04] tracking-tightest text-ink max-w-[860px]">
          <span className="block">{features.headline.line1}</span>
          <span className="block text-ink3 italic">{features.headline.line2}</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
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
              className="bg-surface p-7 md:p-8 flex flex-col"
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
              <h3 className="font-display font-semibold text-[19px] md:text-[20px] text-ink leading-snug mb-3">
                {t.title}
              </h3>
              <p className="text-ink2 text-[13.5px] leading-[1.65]">{t.body}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   5. 3 AM PROMISE, simplified failover protocol.
   ─────────────────────────────────────────────────────────────────── */
function ThreeAmPromise() {
  const { threeAm } = enterprise;
  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 0% 0%, rgb(var(--c-spark) / 0.07), transparent 65%)',
        }}
      />
      <div className="container py-24 md:py-32 relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            {threeAm.eyebrow}
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[52px] leading-[1.02] tracking-tightest text-ink max-w-[820px]">
            <span className="block">{threeAm.headline.line1}</span>
            <span className="block">{threeAm.headline.line2}</span>
            <span className="block text-ink3 italic">{threeAm.headline.line3}</span>
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.65] max-w-[680px] mt-6">
            {threeAm.body}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
          {threeAm.steps.map((s, i) => (
            <motion.div
              key={s.time}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.34, delay: i * 0.07, ease: EASE_OUT_EXPO }}
              className="bg-surface p-6 md:p-7 flex flex-col"
            >
              <div className="font-mono text-[10.5px] tabular-nums text-spark mb-3">
                {s.time}
              </div>
              <h3 className="font-display font-semibold text-[17px] text-ink leading-snug mb-2">
                {s.title}
              </h3>
              <p className="text-ink2 text-[13px] leading-[1.65]">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-7 max-w-[680px]">
          {threeAm.footnote}
        </p>
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
    <section className="container border-t border-rule py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      >
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          {procurement.eyebrow}
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[52px] leading-[1.04] tracking-tightest text-ink max-w-[820px]">
          <span className="block">{procurement.headline.line1}</span>
          <span className="block text-ink3 italic">{procurement.headline.line2}</span>
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.65] max-w-[680px] mt-6">
          {procurement.body}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        {procurement.assets.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.34, delay: i * 0.04, ease: EASE_OUT_EXPO }}
            className="bg-surface p-6 md:p-7 flex flex-col"
          >
            <h3 className="font-display font-semibold text-[18px] text-ink leading-snug mb-2">
              {a.title}
            </h3>
            <p className="text-ink3 text-[13px] leading-[1.55] flex-1">{a.sub}</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-spark text-[13px] font-medium hover:underline underline-offset-4"
            >
              Request via engineering <ArrowRight size={13} />
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-8">
        {procurement.note}
      </p>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   7. FAQ, homepage style (floating orbs + split layout).
   ─────────────────────────────────────────────────────────────────── */
function EnterpriseFAQ() {
  const { faq } = enterprise;
  const [activeIdx, setActiveIdx] = useState(0);
  const active = faq.items[activeIdx];

  return (
    <section className="relative border-t border-rule py-24 md:py-32 overflow-hidden">
      {/* Floating orbs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {[
          { size: 280, x: '12%', y: '18%', delay: 0,   dur: 8,  tone: 'spark' },
          { size: 220, x: '78%', y: '32%', delay: 1.2, dur: 9,  tone: 'highlight' },
          { size: 320, x: '42%', y: '70%', delay: 2.4, dur: 10, tone: 'spark' },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              transform: 'translate(-50%, -50%)',
              background:
                orb.tone === 'spark'
                  ? 'rgb(var(--c-spark) / 0.05)'
                  : 'rgb(var(--c-highlight) / 0.05)',
            }}
            animate={{ y: [0, -16, 0], opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: orb.dur,
              delay: orb.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
            {faq.eyebrow}
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-display font-semibold text-5xl md:text-7xl tracking-tightest text-ink leading-none">
              {faq.headline}
            </h2>
            <p className="italic text-ink3 text-[15px] md:max-w-[320px]">
              {faq.italic}
            </p>
          </div>
        </motion.div>

        {/* Split layout, questions on left, active answer on right */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr] gap-10 lg:gap-16 mt-14 md:mt-20">
          {/* Left column, question list */}
          <ul className="flex flex-col">
            {faq.items.map((item, i) => {
              const isActive = i === activeIdx;
              return (
                <li
                  key={item.q}
                  className={`group border-t ${
                    i === faq.items.length - 1 ? 'border-b' : ''
                  } border-rule`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className="w-full text-left py-5 flex items-start gap-4 transition-colors"
                  >
                    <span
                      className={`font-mono text-[10px] uppercase tracking-eyebrow shrink-0 mt-1 w-16 ${
                        isActive ? 'text-spark' : 'text-ink3'
                      } transition-colors`}
                    >
                      {item.tag}
                    </span>
                    <span
                      className={`text-[16px] leading-snug flex-1 ${
                        isActive
                          ? 'text-ink font-medium'
                          : 'text-ink2 group-hover:text-ink'
                      } transition-colors`}
                    >
                      {item.q}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className={`shrink-0 mt-1 ${
                        isActive ? 'text-spark' : 'text-ink3'
                      } transition-colors`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right column, active answer */}
          <div className="md:sticky md:top-24 md:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="bg-surface border border-rule2 rounded-md p-7 md:p-9"
              >
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mb-3">
                  {active.tag}
                </div>
                <h3 className="font-display font-semibold text-[22px] md:text-[26px] text-ink leading-snug mb-5">
                  {active.q}
                </h3>
                <p className="text-ink2 text-[15px] leading-[1.7]">
                  {active.a}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   8. FINAL CTA, Talk to engineering.
   ─────────────────────────────────────────────────────────────────── */
function FinalCta() {
  const { finalCta } = enterprise;
  return (
    <section className="relative border-t border-rule py-24 md:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgb(var(--c-spark) / 0.10), transparent 65%)',
        }}
      />
      <div className="container relative">
        <div className="max-w-[760px] mx-auto text-center">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-5">
            {finalCta.eyebrow}
          </div>
          <h2 className="font-display font-semibold text-[40px] md:text-[60px] leading-[1.02] tracking-tightest text-ink">
            <span className="block">{finalCta.headline.line1}</span>
            <span className="block text-ink3 italic">{finalCta.headline.line2}</span>
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.65] mt-7 max-w-[600px] mx-auto">
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
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-8">
            {finalCta.subtext}
          </p>
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
      <ThreeAmPromise />
      <Procurement />
      <EnterpriseFAQ />
      <FinalCta />
    </>
  );
}
