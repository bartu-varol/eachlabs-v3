'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { UseCaseDef } from '@/lib/usecases';

const ACCENT_VAR: Record<UseCaseDef['accent'], string> = {
  spark:     'rgb(var(--c-spark))',
  highlight: 'rgb(var(--c-highlight))',
  success:   'rgb(var(--c-success))',
  sun:       'rgb(var(--c-sun))',
  yellow:    'rgb(var(--c-yellow))',
  ember:     'rgb(var(--c-ember))',
};

const ACCENT_TINT: Record<UseCaseDef['accent'], string> = {
  spark:     'rgb(var(--c-spark)     / 0.06)',
  highlight: 'rgb(var(--c-highlight) / 0.06)',
  success:   'rgb(var(--c-success)   / 0.06)',
  sun:       'rgb(var(--c-sun)       / 0.06)',
  yellow:    'rgb(var(--c-yellow)    / 0.06)',
  ember:     'rgb(var(--c-ember)     / 0.06)',
};

export function UseCasePage({ uc }: { uc: UseCaseDef }) {
  const c = ACCENT_VAR[uc.accent];
  const tint = ACCENT_TINT[uc.accent];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 0% 0%, ${tint}, transparent 65%)` }}
        />
        <div className="container py-20 md:py-28 relative">
          <Link
            href="/usecases"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
          >
            <ArrowLeft size={12} /> all use cases
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow" style={{ color: c }}>
              * {uc.n} / {uc.category}
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[76px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[920px]">
              {uc.title}
            </h1>
            <p className="text-ink2 italic text-[15px] mt-4">{uc.sub}</p>
            <p className="text-ink2 text-[16px] leading-[1.55] max-w-[680px] mt-6">{uc.body}</p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule mt-12 border border-rule rounded-md overflow-hidden">
              {uc.stats.map((s) => (
                <div key={s.label} className="bg-surface px-5 py-6">
                  <div
                    className="font-display font-semibold text-[24px] md:text-[28px] tabular-nums leading-none break-words"
                    style={{ color: c }}
                  >
                    {s.value}
                  </div>
                  <div className="text-ink3 text-[12px] mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Before / After — three concrete moments */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(115deg, rgb(var(--c-fail) / 0.04) 0%, transparent 48%, transparent 55%, rgb(var(--c-success) / 0.04) 100%)',
          }}
        />
        <div className="container py-20 md:py-24 relative">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● THE DAY IT MATTERS
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[40px] leading-[1.1] tracking-tightest text-ink max-w-[620px]">
            Same situation. <span className="text-ink3 italic">Different week.</span>
          </h2>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden">
            {/* Headers (desktop only — mobile stacks) */}
            <div className="hidden lg:flex bg-bg/50 px-6 py-3 border-b border-rule font-mono text-[10px] uppercase tracking-eyebrow text-fail">
              × WITHOUT EACH::LABS
            </div>
            <div className="hidden lg:flex bg-bg/50 px-6 py-3 border-b border-rule font-mono text-[10px] uppercase tracking-eyebrow text-success">
              ✓ WITH EACH::LABS
            </div>

            {uc.beforeAfter.map((row, i) => (
              <div key={i} className="contents">
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ duration: 0.32, delay: i * 0.06 }}
                  className="bg-surface px-6 py-5 flex gap-3 items-start"
                >
                  <span className="text-fail font-mono text-[14px] mt-0.5 shrink-0">×</span>
                  <p className="text-[15px] leading-[1.55] text-ink2">
                    <span className="text-ink font-medium">{row.anchor}</span>{' '}
                    {row.without}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ duration: 0.32, delay: 0.08 + i * 0.06 }}
                  className="bg-surface px-6 py-5 flex gap-3 items-start"
                >
                  <span className="text-success font-mono text-[14px] mt-0.5 shrink-0">✓</span>
                  <p className="text-[15px] leading-[1.55] text-ink">
                    <span className="font-medium">{row.anchor}</span>{' '}
                    <span className="text-ink2">{row.withus}</span>
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fit — why this team ships on each::labs */}
      <section className="container border-t border-rule py-24 md:py-28">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow mb-3" style={{ color: c }}>
          ● HOW IT FITS
        </div>
        <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
          {uc.fitTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {uc.fitPoints.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.32, delay: i * 0.05 }}
              className="bg-surface p-6 md:p-7"
            >
              <div className="font-mono text-[11px] tabular-nums mb-3" style={{ color: c }}>{p.n}</div>
              <h3 className="font-display font-semibold text-[18px] text-ink leading-snug mb-2">
                {p.title}
              </h3>
              <p className="text-ink2 text-[13.5px] leading-[1.65]">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Customer story + USED BY */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 100% 50%, ${tint}, transparent 65%)` }}
        />
        <div className="container py-20 md:py-24 relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mb-3">
              ● CUSTOMER STORY
            </div>
            <blockquote className="font-display text-[24px] md:text-[32px] leading-[1.25] tracking-tight text-ink">
              <span style={{ color: c }}>“</span>
              {uc.story.quote}
              <span style={{ color: c }}>”</span>
            </blockquote>
            <div className="mt-6">
              <div className="text-ink text-[14px] font-medium">{uc.story.name}</div>
              <div className="text-ink3 text-[13px] mt-0.5">{uc.story.role}</div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mb-4">
              USED BY
            </div>
            <div className="flex flex-wrap gap-2">
              {uc.usedBy.map((name) => (
                <span
                  key={name}
                  className="px-3.5 py-2 rounded-md border border-rule2 bg-surface text-ink2 text-[13px]"
                >
                  {name}
                </span>
              ))}
            </div>
            <Link
              href="/customers"
              className="text-spark text-[13px] font-medium hover:underline underline-offset-4 inline-flex items-center gap-1.5 mt-6"
            >
              See all customers <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            Ship it on each::labs.{' '}
            <span className="text-ink3 italic">Free until you do.</span>
          </h2>
          <p className="text-ink2 text-[15px] mt-6">
            10K traces free. No credit card. Cancel by deleting your API key.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button href="/signup" variant="primary">Start free →</Button>
            <Button href="/contact" variant="secondary">Talk to solutions</Button>
          </div>
        </div>
      </section>
    </>
  );
}
