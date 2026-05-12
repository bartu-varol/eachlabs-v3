'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { PlatformBento } from '@/components/sections/PlatformBento';

const STATS = [
  { value: '600+',   label: 'models behind one API' },
  { value: '99.99%', label: 'uptime' },
  { value: '<120ms', label: 'router overhead' },
  { value: '10×',    label: 'fewer end-user errors' },
];

const PRINCIPLES = [
  {
    n: '01',
    title: 'Compose, don’t lock in',
    body: 'Use Router without Workflows. Use Trace without A/B. Each product stands alone; they multiply when combined.',
  },
  {
    n: '02',
    title: 'Attribute-driven, not opinionated',
    body: 'We don’t pick a "user model" or "tier model" for you. You attach attributes; the platform reasons over them.',
  },
  {
    n: '03',
    title: 'Observability is part of the call',
    body: 'Tracing is not an SDK you bolt on. Every each.run() emits a complete trace by default.',
  },
  {
    n: '04',
    title: 'No markup on inference',
    body: 'Provider price is what you pay. We make money on subscription + enterprise.',
  },
];

export default function PlatformPage() {
  return (
    <>
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * PLATFORM
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[900px]">
            One control plane for every AI call you ship.
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[640px] mt-7">
            Six products, two layers.{' '}
            <strong className="text-ink font-semibold">Run</strong> orchestrates the calls, router,
            workflows, enhancer.{' '}
            <strong className="text-ink font-semibold">Observe</strong> tells you what happened:
            attributes, A/B, trace.
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule mt-12 border border-rule rounded-md overflow-hidden">
            {STATS.map((s) => (
              <div key={s.label} className="bg-surface px-5 py-6">
                <div className="font-display font-semibold text-[26px] md:text-[32px] text-spark tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="text-ink3 text-[12px] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Bento grid of all 6 products */}
      <PlatformBento />

      {/* Principles */}
      <section className="container border-t border-rule py-24 md:py-28">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          * PRINCIPLES
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink">
          How the platform thinks.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="bg-surface p-7"
            >
              <div className="font-mono text-[11px] tabular-nums text-spark mb-3">{p.n}</div>
              <h3 className="font-display font-semibold text-[20px] text-ink leading-tight mb-3">
                {p.title}
              </h3>
              <p className="text-ink2 text-[14px] leading-[1.65]">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[36px] md:text-[52px] leading-[1] tracking-tightest text-ink">
            One platform. Six products. <span className="text-ink3 italic">Free to start.</span>
          </h2>
          <p className="text-ink2 text-[15px] mt-6">
            API key in 60 seconds. Free plan covers your first 10K traces. Subscribe only when
            retention or A/B starts paying off.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <RabbitButton href="/signup" />
            <Button href="/pricing" variant="secondary">See pricing</Button>
          </div>
        </div>
      </section>
    </>
  );
}
