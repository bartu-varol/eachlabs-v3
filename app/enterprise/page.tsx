'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
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
   1. HERO
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
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            {hero.pill}
          </div>

          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] lg:text-[76px] leading-[0.98] tracking-tightest text-ink mt-7 max-w-[920px]">
            <span className="block">{hero.headline.line1}</span>
            <span className="block text-ink3 italic">{hero.headline.line2Emph}</span>
          </h1>

          <p className="text-ink2 text-[16px] leading-[1.6] max-w-[640px] mt-7">
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

          {/* Stats grid */}
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
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   2. WHY ENTERPRISE — single narrative, no comparison.
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
   3. SOCIAL PROOF — Top 20% + trusted-by row.
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
   4. ENTERPRISE FEATURES — Team budget / 24/7 contact / CSM + more.
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
   5. 3 AM PROMISE — simplified failover protocol.
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
   6. PROCUREMENT — all CTAs point to /contact (engineering support).
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
   7. FAQ — homepage style (floating orbs + split layout).
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

        {/* Split layout — questions on left, active answer on right */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr] gap-10 lg:gap-16 mt-14 md:mt-20">
          {/* Left column — question list */}
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

          {/* Right column — active answer */}
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
   8. FINAL CTA — Talk to engineering.
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
