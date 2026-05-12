'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { UseCaseDef } from '@/lib/usecases';
import { InternalDemo } from './InternalDemo';
import { InternalExamples } from './InternalExamples';
import { InternalProblems } from './InternalProblems';
import { InternalAnatomy } from './InternalAnatomy';

/* ──────────────────────────────────────────────────────────────────────────
   InternalShowcase — bespoke /usecases/internal page.

     1. Hero       — split: copy + 6-tool grid demo
     2. Stats      — 4 quantitative anchors (devs, days, SSO, infra)
     3. Examples   — 6 internal-tool scenarios (support, sales, HR, ...)
     4. Problems   — 6 IT/security/governance pains × the each::xxx fix
     5. Anatomy    — SSO → RBAC → run → trace → audit lifecycle
     6. Why it fits — 4 platform tenets specific to internal apps
     7. Story
     8. CTA
────────────────────────────────────────────────────────────────────────── */

export function InternalShowcase({ uc }: { uc: UseCaseDef }) {
  return (
    <>
      {/* 1. HERO */}
      <section className="container py-16 md:py-24">
        <Link
          href="/usecases"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> all use cases
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-10 lg:gap-16 items-start mt-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              * {uc.n} / {uc.category}
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[56px] lg:text-[64px] xl:text-[72px] leading-[0.98] tracking-tightest mt-6 text-ink">
              {uc.title}
            </h1>
            <p className="text-ink2 italic text-[15px] mt-4">{uc.sub}</p>
            <p className="text-ink2 text-[16px] leading-[1.55] max-w-[560px] mt-7">
              {uc.body}
            </p>

            <ul className="mt-8 flex flex-col gap-2.5 max-w-[540px]">
              <BulletLine
                accent="WHAT"
                text="One SDK behind every internal tool — Slack bots, web UIs, CLIs, ops dashboards. Same auth, same audit."
              />
              <BulletLine
                accent="WHY"
                text="Your platform team doesn't have to build an ML platform. One dev ships six tools in two weeks."
              />
              <BulletLine
                accent="HOW"
                text={
                  <>
                    Wire your IDP once. Tag{' '}
                    <code className="font-mono text-[12.5px] text-spark">team_id</code>.
                    Finance slices cost by team. Compliance reads the trace.
                  </>
                }
              />
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                SHIPPED BY
              </span>
              {uc.usedBy.map((name) => (
                <span key={name} className="font-mono text-[12px] text-ink2">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <InternalDemo />
          </motion.div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="container -mt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {uc.stats.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-6">
              <div className="font-display font-semibold text-[24px] md:text-[28px] text-spark tabular-nums leading-none break-words">
                {s.value}
              </div>
              <div className="text-ink3 text-[12px] mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-20 md:mt-28">
        <InternalExamples />
      </div>

      <InternalProblems />

      <InternalAnatomy />

      {/* 6. WHY IT FITS */}
      <section className="container border-t border-rule py-24 md:py-28">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● WHY INTERNAL APPS FIT
        </div>
        <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink max-w-[680px]">
          {uc.fitTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {uc.fitPoints.map((p) => (
            <FitCard key={p.n} p={p} />
          ))}
        </div>
      </section>

      {/* 7. STORY */}
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
          <div className="max-w-[720px] mx-auto text-center">
            <blockquote className="font-display text-[24px] md:text-[32px] leading-[1.3] tracking-tight text-ink">
              <span className="text-spark">“</span>
              {uc.story.quote}
              <span className="text-spark">”</span>
            </blockquote>
            <div className="mt-6">
              <div className="text-ink text-[14px] font-medium">{uc.story.name}</div>
              <div className="text-ink3 text-[13px] mt-0.5">{uc.story.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            Stop building ML infrastructure. Ship the tools.
          </h2>
          <p className="text-ink2 text-[15px] mt-6">
            SSO + SAML on day 1. Audit-ready out of the box. Per-team cost views.
            Your platform team doesn&rsquo;t need to become an ML platform team.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <Button href="/signup" variant="primary">Start free →</Button>
            <Button href="/contact" variant="secondary">Talk to platform eng</Button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Hero bullet line ───────────────────────────────────────────────────── */

function BulletLine({ accent, text }: { accent: string; text: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mt-[3px] w-12 shrink-0">
        {accent}
      </span>
      <span className="text-ink2 text-[14px] leading-[1.55]">{text}</span>
    </li>
  );
}

/* ── Fit card ───────────────────────────────────────────────────────────── */

function FitCard({ p }: { p: { n: string; title: string; body: string } }) {
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
