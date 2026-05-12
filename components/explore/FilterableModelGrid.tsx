'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Pill } from '@/components/ui/Pill';
import { ModelTile } from './ModelTile';
import type { CatalogModel } from '@/lib/catalog';

type Props = {
  models: CatalogModel[];
  /** Eyebrow shown above the grid. */
  eyebrow: string;
  /** Placeholder text for the search box. */
  searchPlaceholder?: string;
};

/** Categories that should always lead the row when present — image/video first. */
const CATEGORY_ORDER = [
  'text-to-video',
  'image-to-video',
  'video-to-video',
  'reference-to-video',
  'text-to-image',
  'image-to-image',
  'reference-to-image',
  'image-to-3d',
  'text-to-3d',
  'image-to-text',
  'video-to-text',
  'pdf-to-text',
  'text-to-voice',
  'voice-to-text',
  'voice-to-voice',
  'music-generation',
  'text-to-text',
];

function rankCategory(slug: string): number {
  const i = CATEGORY_ORDER.indexOf(slug);
  return i === -1 ? CATEGORY_ORDER.length : i;
}

export function FilterableModelGrid({ models, eyebrow, searchPlaceholder = 'Search models...' }: Props) {
  const [category, setCategory] = useState<string>('ALL');
  const [query, setQuery] = useState('');

  /** Categories present in *this* model set, sorted by curated order then by count. */
  const availableCategories = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    for (const m of models) {
      if (!m.categorySlug || !m.categoryName) continue;
      const cur = counts[m.categorySlug];
      if (cur) cur.count++;
      else counts[m.categorySlug] = { name: m.categoryName, count: 1 };
    }
    return Object.entries(counts)
      .map(([slug, v]) => ({ slug, name: v.name, count: v.count }))
      .sort((a, b) => {
        const ra = rankCategory(a.slug);
        const rb = rankCategory(b.slug);
        if (ra !== rb) return ra - rb;
        return b.count - a.count;
      });
  }, [models]);

  // If only one (or zero) categories exist for this set, hiding the filter
  // is cleaner than showing a useless single-option row.
  const showCategoryFilter = availableCategories.length > 1;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models.filter((m) => {
      if (category !== 'ALL' && m.categorySlug !== category) return false;
      if (q) {
        const hay = `${m.name} ${m.title ?? ''} ${m.familySlug} ${m.description ?? ''} ${m.categoryName ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [models, category, query]);

  return (
    <div className="min-w-0">
      <div
        className="ec-anim ec-anim-up flex flex-col gap-3 mb-5 lg:flex-row lg:items-start lg:gap-4"
        style={{ ['--ec-delay' as string]: 320 }}
      >
        <div className="relative flex-1 max-w-[420px] shrink-0">
          <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-surface border border-rule2 rounded-md pl-10 pr-4 py-2 text-[14px] text-ink placeholder:text-ink3 focus:outline-none focus:border-spark"
          />
        </div>

        {showCategoryFilter && (
          <div
            className="flex flex-wrap gap-2 lg:max-w-[640px]"
            role="tablist"
            aria-label="Filter by category"
          >
            <button type="button" onClick={() => setCategory('ALL')}>
              <Pill active={category === 'ALL'}>All</Pill>
            </button>
            {availableCategories.map((c) => (
              <button key={c.slug} type="button" onClick={() => setCategory(c.slug)} title={`${c.count} model${c.count === 1 ? '' : 's'}`}>
                <Pill active={category === c.slug}>{c.name}</Pill>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="ec-anim ec-anim-up flex items-baseline justify-between mb-5"
        style={{ ['--ec-delay' as string]: 380 }}
      >
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">{eyebrow}</div>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {filtered.length} of {models.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-rule2 rounded-md py-16 text-center">
          <p className="font-mono text-[12px] uppercase tracking-eyebrow text-ink3">
            No models match those filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((m, i) => (
            // Index-driven stagger via --ec-i, capped at 14 so very long lists
            // don't pile up delay.
            <div
              key={m.brandedSlug}
              className="ec-anim-card"
              style={{ ['--ec-i' as string]: Math.min(i, 14) }}
            >
              <ModelTile model={m} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
