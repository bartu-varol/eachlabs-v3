'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { StatTile, StatGrid } from '@/components/ui/StatTile';
import { PageHero } from '@/components/ui/PageHero';
import { PlatformBento } from '@/components/sections/PlatformBento';
import { Eyebrow } from '@/components/ui/Eyebrow';

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
    body: 'Tracing is not an SDK you bolt on. Every call emits a complete trace by default.',
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
      <PageHero
        eyebrow="* PLATFORM"
        headline="One control plane for every AI call you ship."
        description={
          <>
            Modular products, two layers.{' '}
            <strong className="text-ink font-semibold">Run</strong> orchestrates the calls, router,
            workflows, enhancer.{' '}
            <strong className="text-ink font-semibold">Observe</strong> tells you what happened:
            attributes, A/B, trace.
          </>
        }
      >
        <StatGrid columns={4} className="mt-12">
          {STATS.map((s) => (
            <StatTile key={s.label} value={s.value} label={s.label} size="lg" labelStyle="eyebrow" />
          ))}
        </StatGrid>
      </PageHero>

      {/* Bento grid of all products */}
      <PlatformBento />

      {/* Principles */}
      <section className="container border-t border-divider py-24 md:py-28">
        <Eyebrow className="mb-3">* PRINCIPLES</Eyebrow>
        <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1] tracking-tightest text-ink">
          How the platform thinks.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-10">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="bg-surface-raised p-7"
            >
              <div className="font-mono text-eyebrow tabular-nums text-brand mb-3">{p.n}</div>
              <h3 className="font-sans font-semibold text-h4 text-ink leading-tight mb-3">
                {p.title}
              </h3>
              <p className="text-ink-muted text-body leading-[1.65]">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container border-t border-divider py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-sans font-semibold text-h2 md:text-display-lg leading-[1] tracking-tightest text-ink">
            One platform. Modular products. <span className="text-ink-faint italic">Free to start.</span>
          </h2>
          <p className="text-ink-muted text-body-lg mt-6">
            API key in 60 seconds. Free plan covers your first 10K traces. Subscribe only when
            retention or A/B starts paying off.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-10">
            <RabbitButton href="/sign-up" />
            <Button href="/pricing" variant="secondary">See pricing</Button>
          </div>
        </div>
      </section>
    </>
  );
}
