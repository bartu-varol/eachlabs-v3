'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { models as catalogModels, type CatalogModel } from '@/lib/catalog';
import { ModelTile } from '@/components/explore/ModelTile';
import { SectionHeader } from '@/components/ui/SectionHeader';

/**
 * Curated homepage picks: top recommended models from the real catalog, deduped
 * by family and balanced across modalities. Computed at module load, static.
 */
const HOMEPAGE_MODELS: CatalogModel[] = (() => {
  const ranked = [...catalogModels]
    .filter((m) => m.thumbnailUrl && m.recommended)
    .sort((a, b) => b.popularity - a.popularity);

  const byType: Record<string, CatalogModel[]> = {};
  for (const m of ranked) {
    const t = m.outputType ?? 'other';
    (byType[t] ||= []).push(m);
  }

  const seenFamilies = new Set<string>();
  const picks: CatalogModel[] = [];

  function take(type: string, max: number) {
    const list = byType[type] ?? [];
    let added = picks.filter((p) => (p.outputType ?? 'other') === type).length;
    for (const m of list) {
      if (added >= max || picks.length >= 8) return;
      const fam = `${m.providerSlug}/${m.familySlug}`;
      if (seenFamilies.has(fam)) continue;
      seenFamilies.add(fam);
      picks.push(m);
      added += 1;
    }
  }

  take('video', 4);
  take('array', 2);
  take('image', 1);
  take('audio', 1);
  // Fill any leftover slots from whatever's most popular.
  take('video', 8);
  take('array', 8);

  return picks.slice(0, 8);
})();

export function ModelCatalog() {
  return (
    <section
      id="catalog"
      className="container border-t border-divider py-24 md:py-32"
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
          <SectionHeader
            eyebrow="* THE CATALOG · 600+ MODELS"
            headline="Every model worth shipping."
            headlineSub="A few of the loud ones."
          />
        </div>
        <Link
          href="/explore"
          className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-field rounded-md text-body-sm font-semibold text-ink hover:bg-surface-raised hover:border-brand/40 transition-colors"
        >
          Browse all 600+ <span aria-hidden>→</span>
        </Link>
      </motion.div>

      {/* 4-col grid of real catalog models, same tile as /explore. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {HOMEPAGE_MODELS.map((m, i) => (
          <motion.div
            key={m.brandedSlug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            transition={{ duration: 0.38, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <ModelTile model={m} />
          </motion.div>
        ))}
      </div>

      {/* Pro tip footer */}
      <div className="mt-12 font-mono text-micro uppercase tracking-eyebrow text-ink-faint text-center">
        PRO TIP · pin a version, swap providers without touching client code · missing one?{' '}
        <Link href="/contact" className="text-brand hover:underline">
          request a model →
        </Link>
      </div>
    </section>
  );
}
