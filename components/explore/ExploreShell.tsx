'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Pill } from '@/components/ui/Pill';
import { ModelTile } from './ModelTile';
import { WorkflowsShell } from './WorkflowsShell';
import {
  models as allModels,
  providers as allProviders,
  type CatalogModel,
} from '@/lib/catalog';
import type { WorkflowCategory, WorkflowSummary } from '@/lib/workflows';

type Tab = 'MODELS' | 'WORKFLOWS' | 'TRENDS' | 'LLMS';

const LLM_CATEGORY_SLUG = 'text-to-text';

/** Curated leading order so common categories sit on the left. */
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

const PAGE_SIZE = 24;

type ExploreShellProps = {
  initialTab?: Tab;
  initialWorkflows: WorkflowSummary[];
  initialWorkflowOffset: number | null;
  initialWorkflowTotal: number;
  initialWorkflowCategories: WorkflowCategory[];
  /** SSR-fetched first page of the trends slice. */
  initialTrends: WorkflowSummary[];
  initialTrendsOffset: number | null;
  initialTrendsTotal: number;
  /** Live model count from upstream API, used for the tab counter. */
  liveModelsCount?: number;
};

export function ExploreShell({
  initialTab = 'MODELS',
  initialWorkflows,
  initialWorkflowOffset,
  initialWorkflowTotal,
  initialWorkflowCategories,
  initialTrends,
  initialTrendsOffset,
  initialTrendsTotal,
  liveModelsCount,
}: ExploreShellProps) {
  const [tab, setTab] = useState<Tab>(initialTab);

  // Model filters
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [provider, setProvider] = useState<string>('ALL');
  const [showAll, setShowAll] = useState(false);

  // LLMs filters (independent search + provider so switching tabs doesn't
  // leak filter state between the Models grid and the LLMs grid).
  const [llmQuery, setLlmQuery] = useState('');
  const [llmProvider, setLlmProvider] = useState<string>('ALL');
  const [llmShowAll, setLlmShowAll] = useState(false);

  const llmAllModels = useMemo(
    () => allModels.filter((m: CatalogModel) => m.categorySlug === LLM_CATEGORY_SLUG),
    [],
  );

  const llmProviders = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of llmAllModels) counts[m.providerSlug] = (counts[m.providerSlug] ?? 0) + 1;
    return [...allProviders]
      .filter((p) => counts[p.slug])
      .sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0));
  }, [llmAllModels]);

  const filteredLlms = useMemo(() => {
    const q = llmQuery.trim().toLowerCase();
    return llmAllModels.filter((m: CatalogModel) => {
      if (llmProvider !== 'ALL' && m.providerSlug !== llmProvider) return false;
      if (q) {
        const hay = `${m.name} ${m.title ?? ''} ${m.providerSlug} ${m.familySlug} ${m.description ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [llmAllModels, llmQuery, llmProvider]);

  const visibleLlms = llmShowAll ? filteredLlms : filteredLlms.slice(0, PAGE_SIZE);

  /** Models after the provider filter, used to derive available categories. */
  const providerScopedModels = useMemo(() => {
    if (provider === 'ALL') return allModels;
    return allModels.filter((m: CatalogModel) => m.providerSlug === provider);
  }, [provider]);

  /** Categories that actually exist in the current provider scope. */
  const availableCategories = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {};
    for (const m of providerScopedModels) {
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
  }, [providerScopedModels]);

  // If the active category disappears when provider changes, reset to ALL.
  // (Done as a useMemo side-derivation to avoid effect/state flicker.)
  const safeCategory = useMemo(() => {
    if (category === 'ALL') return 'ALL';
    return availableCategories.some((c) => c.slug === category) ? category : 'ALL';
  }, [category, availableCategories]);

  const filteredModels = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providerScopedModels.filter((m: CatalogModel) => {
      if (safeCategory !== 'ALL' && m.categorySlug !== safeCategory) return false;
      if (q) {
        const hay = `${m.name} ${m.title ?? ''} ${m.providerSlug} ${m.familySlug} ${m.description ?? ''} ${m.categoryName ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [providerScopedModels, safeCategory, query]);

  const providersWithCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of allModels) counts[m.providerSlug] = (counts[m.providerSlug] ?? 0) + 1;
    return [...allProviders].sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0));
  }, []);

  const visibleModels = showAll ? filteredModels : filteredModels.slice(0, PAGE_SIZE);

  return (
    <>
      {/* Tabs */}
      <section className="container">
        <div role="tablist" aria-label="Explore tabs" className="flex items-end gap-6 border-b border-rule">
          <Tab
            label="Models"
            count={liveModelsCount && liveModelsCount > 0 ? liveModelsCount : allModels.length}
            active={tab === 'MODELS'}
            onClick={() => setTab('MODELS')}
          />
          <Tab
            label="Workflows"
            count={Math.max(0, initialWorkflowTotal - initialTrendsTotal)}
            active={tab === 'WORKFLOWS'}
            onClick={() => setTab('WORKFLOWS')}
          />
          <Tab
            label="Trends"
            count={initialTrendsTotal}
            active={tab === 'TRENDS'}
            onClick={() => setTab('TRENDS')}
          />
          <Tab
            label="LLMs"
            count={llmAllModels.length}
            active={tab === 'LLMS'}
            onClick={() => setTab('LLMS')}
          />
          <span className="ml-auto pb-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
            * {allProviders.length} providers
          </span>
        </div>
      </section>

      {/* Filters bar, sticky */}
      <section className="bg-bg border-b border-rule sticky top-[100px] z-30 backdrop-blur-sm">
        <div className="container">
          {tab === 'MODELS' ? (
            <div className="flex flex-col gap-3 py-4">
              {/* Row 1: long search input + provider select on the right. */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="relative flex-1">
                  <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search models, vendors, capabilities..."
                    className="w-full bg-surface border border-rule2 rounded-md pl-10 pr-4 py-2 text-[14px] text-ink placeholder:text-ink3 focus:outline-none focus:border-spark"
                  />
                </div>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="bg-surface border border-rule2 rounded-md px-3 py-2 text-[12px] font-mono uppercase tracking-eyebrow text-ink2 focus:outline-none focus:border-spark sm:shrink-0"
                  aria-label="Provider filter"
                >
                  <option value="ALL">All providers</option>
                  {providersWithCount.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Row 2: category chip rail, uses the full container width. */}
              {availableCategories.length > 1 && (
                <div
                  className="flex flex-wrap gap-2 w-full"
                  role="tablist"
                  aria-label="Filter by category"
                >
                  <button type="button" onClick={() => setCategory('ALL')}>
                    <Pill active={safeCategory === 'ALL'}>All</Pill>
                  </button>
                  {availableCategories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setCategory(c.slug)}
                      title={`${c.count} model${c.count === 1 ? '' : 's'}`}
                    >
                      <Pill active={safeCategory === c.slug}>{c.name}</Pill>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : tab === 'WORKFLOWS' ? (
            // Workflows tab manages its own filter bar inside <WorkflowsShell />.
            // Keep this row empty so the sticky section keeps a consistent height.
            <div className="py-4">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
                * AI WORKFLOWS · production-ready recipes
              </div>
            </div>
          ) : tab === 'TRENDS' ? (
            <div className="py-4">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
                * TRENDS · what people are remixing right now
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1">
                <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={llmQuery}
                  onChange={(e) => setLlmQuery(e.target.value)}
                  placeholder="Search LLMs..."
                  className="w-full bg-surface border border-rule2 rounded-md pl-10 pr-4 py-2 text-[14px] text-ink placeholder:text-ink3 focus:outline-none focus:border-spark"
                />
              </div>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="bg-surface border border-rule2 rounded-md px-3 py-2 text-[12px] font-mono uppercase tracking-eyebrow text-ink2 focus:outline-none focus:border-spark sm:shrink-0"
                aria-label="LLM provider filter"
              >
                <option value="ALL">All providers</option>
                {llmProviders.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="container py-10">
        {tab === 'MODELS' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
                {filteredModels.length} of {liveModelsCount && liveModelsCount > 0 ? liveModelsCount : allModels.length} models
              </div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                sorted by popularity
              </div>
            </div>
            {filteredModels.length === 0 ? (
              <EmptyState message="No models match those filters." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {visibleModels.map((m) => (
                  <ModelTile key={m.brandedSlug} model={m} />
                ))}
              </div>
            )}
            {!showAll && filteredModels.length > PAGE_SIZE && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-rule2 rounded-md text-[13px] font-semibold text-ink hover:bg-surface hover:border-spark/40 transition-colors"
                >
                  Load all {filteredModels.length} <span aria-hidden>→</span>
                </button>
              </div>
            )}
          </>
        )}

        {tab === 'WORKFLOWS' && (
          <WorkflowsShell
            mode="workflows"
            initialWorkflows={initialWorkflows}
            initialOffset={initialWorkflowOffset}
            initialTotal={initialWorkflowTotal}
            initialCategories={initialWorkflowCategories}
          />
        )}

        {tab === 'TRENDS' && (
          <WorkflowsShell
            mode="trends"
            initialWorkflows={initialTrends}
            initialOffset={initialTrendsOffset}
            initialTotal={initialTrendsTotal}
            initialCategories={initialWorkflowCategories}
          />
        )}

        {tab === 'LLMS' && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
                {filteredLlms.length} of {llmAllModels.length} LLMs
              </div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                text-to-text · sorted by popularity
              </div>
            </div>
            {filteredLlms.length === 0 ? (
              <EmptyState message="No LLMs match those filters." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {visibleLlms.map((m) => (
                  <ModelTile key={m.brandedSlug} model={m} />
                ))}
              </div>
            )}
            {!llmShowAll && filteredLlms.length > PAGE_SIZE && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setLlmShowAll(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 border border-rule2 rounded-md text-[13px] font-semibold text-ink hover:bg-surface hover:border-spark/40 transition-colors"
                >
                  Load all {filteredLlms.length} <span aria-hidden>→</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function Tab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative pb-3 pt-2 text-[15px] font-semibold tracking-[-0.01em] transition-colors ${
        active ? 'text-ink' : 'text-ink3 hover:text-ink2'
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        <span className={`font-mono text-[11px] font-normal ${active ? 'text-ink2' : 'text-ink3'}`}>
          {count}
        </span>
      </span>
      <span
        aria-hidden
        className={`absolute left-0 right-0 -bottom-px h-[2px] transition-colors ${
          active ? 'bg-spark' : 'bg-transparent'
        }`}
      />
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-rule2 rounded-md py-20 text-center">
      <p className="font-mono text-[12px] uppercase tracking-eyebrow text-ink3">{message}</p>
    </div>
  );
}
