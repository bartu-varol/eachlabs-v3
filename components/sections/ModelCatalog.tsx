'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { models } from '@/lib/models';
import type { ModelEntry, ModelType } from '@/lib/models';

/* Per-category accent — translucent gradient background, badge color, price color. */
const TYPE_COLOR: Record<ModelType, string> = {
  VIDEO:   '#3D6BC9',
  IMAGE:   '#5B8F3A',
  AUDIO:   '#C98A00',
  '3D':    '#8A4FB8',
  UPSCALE: '#AA6E2C',
  UTIL:    '#76726A',
};

function CatalogCard({ model, idx }: { model: ModelEntry; idx: number }) {
  const c = TYPE_COLOR[model.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.38, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
    >
      <Link
        href="/explore"
        aria-label={`${model.name} · ${model.type}`}
        className="group relative block aspect-[4/5] rounded-md border border-rule2 overflow-hidden no-underline transition-colors duration-200 hover:[border-color:var(--c)]"
        style={{
          ['--c' as string]: c,
          background: `linear-gradient(135deg, ${c}30, ${c}10 55%, ${c}05)`,
        }}
      >
        {/* Top-right: latency badge */}
        <span className="absolute top-3.5 right-3.5 z-10 font-mono text-[10.5px] text-ink3 bg-bg/60 backdrop-blur-sm px-2 py-0.5 rounded">
          {model.latency}
        </span>

        {/* Centered TYPE badge — sits in the upper-middle of the thumbnail */}
        <div className="absolute inset-x-0 top-[38%] flex items-center justify-center z-10">
          <span
            className="font-mono text-[12px] md:text-[13px] uppercase tracking-eyebrow font-semibold px-3 py-1.5 bg-bg border rounded-sm transition-transform duration-200 group-hover:scale-110"
            style={{ color: c, borderColor: c }}
          >
            {model.type}
          </span>
        </div>

        {/* Bottom text overlay with fade so the name reads against the gradient */}
        <div
          className="absolute inset-x-0 bottom-0 p-4 md:p-5 z-10"
          style={{
            background:
              'linear-gradient(to top, rgb(var(--c-bg)) 30%, rgb(var(--c-bg) / 0.85) 60%, transparent)',
          }}
        >
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="font-mono text-[14px] md:text-[15px] text-ink font-semibold truncate">
              {model.name}
            </span>
            <span
              className="font-mono text-[11.5px] font-semibold shrink-0"
              style={{ color: c }}
            >
              {model.price}
            </span>
          </div>
          <div className="font-mono text-[10.5px] text-ink3 tracking-[0.04em] truncate">
            {model.provider}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ModelCatalog() {
  const homepage = models.filter((m) => m.onHomepage);

  return (
    <section
      id="catalog"
      className="container border-t border-rule py-24 md:py-32"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-[680px]">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-4">
            * THE CATALOG · 600+ MODELS
          </div>
          <h2 className="font-display font-semibold text-[40px] md:text-[64px] leading-[0.95] tracking-tightest">
            <span className="block text-ink">Every model worth shipping.</span>
            <span className="block text-ink3 italic">A few of the loud ones.</span>
          </h2>
        </div>
        <Link
          href="/explore"
          className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-rule2 rounded-md text-[13px] font-semibold text-ink hover:bg-surface hover:border-spark/40 transition-colors"
        >
          Browse all 600+ <span aria-hidden>→</span>
        </Link>
      </motion.div>

      {/* Static 4-col grid (3 on md, 2 on sm, 1 on xs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {homepage.map((m, i) => (
          <CatalogCard key={m.name} model={m} idx={i} />
        ))}
      </div>

      {/* Pro tip footer */}
      <div className="mt-12 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center">
        PRO TIP · pin a version, swap providers without touching client code · missing one?{' '}
        <Link href="/contact" className="text-spark hover:underline">
          request a model →
        </Link>
      </div>
    </section>
  );
}
