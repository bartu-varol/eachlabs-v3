'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUp, ArrowDown } from 'lucide-react';
import { MODEL_PRICES, type Modality } from '@/lib/modelPricing';

const PRESET_BUDGETS = [10, 50, 100, 500, 1000];
const MODALITIES: Modality[] = ['VIDEO', 'IMAGE', 'AUDIO'];

type SortKey =
  | 'provider'
  | 'name'
  | 'quality'
  | 'type'
  | 'duration'
  | 'price'
  | 'runs';
type SortDir = 'asc' | 'desc';

const TYPE_COLOR: Record<Modality, string> = {
  VIDEO: 'rgb(var(--c-highlight))',
  IMAGE: 'rgb(var(--c-success))',
  AUDIO: 'rgb(var(--c-yellow))',
};

const TYPE_TINT: Record<Modality, string> = {
  VIDEO: 'rgb(var(--c-highlight) / 0.10)',
  IMAGE: 'rgb(var(--c-success)   / 0.10)',
  AUDIO: 'rgb(var(--c-yellow)    / 0.10)',
};

function formatPrice(p: number): string {
  if (p < 0.01) return `$${p.toFixed(4)}`;
  if (p < 1) return `$${p.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;
  return `$${p.toFixed(2)}`;
}

function formatRuns(runs: number): string {
  if (runs >= 1_000_000) return `${(runs / 1_000_000).toFixed(1)}M`;
  if (runs >= 10_000) return `${Math.round(runs / 1000)}K`;
  if (runs >= 1000) return `${(runs / 1000).toFixed(1)}K`;
  return `${Math.round(runs)}`;
}

export function PricingCalculator() {
  const [budget, setBudget] = useState(50);
  const [modality, setModality] = useState<Modality>('VIDEO');
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = MODEL_PRICES.filter((m) => {
      if (m.modality !== modality) return false;
      if (!q) return true;
      return (
        m.model.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q)
      );
    });
    const cmpStr = (a: string, b: string) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    const sorted = [...rows].sort((a, b) => {
      switch (sortKey) {
        case 'price':    return a.price - b.price;
        case 'runs':     return b.price - a.price; // higher runs == lower price
        case 'provider': return cmpStr(a.provider, b.provider);
        case 'name':     return cmpStr(`${a.provider}/${a.model}`, `${b.provider}/${b.model}`);
        case 'quality':  return cmpStr(a.quality, b.quality);
        case 'type':     return cmpStr(a.type, b.type);
        case 'duration': return cmpStr(a.duration, b.duration);
      }
    });
    if (sortDir === 'desc') sorted.reverse();
    return sorted;
  }, [modality, query, sortKey, sortDir]);

  const sortIcon = (key: SortKey) =>
    sortKey !== key
      ? null
      : sortDir === 'asc'
        ? <ArrowUp size={10} />
        : <ArrowDown size={10} />;

  return (
    <section className="relative border-t border-rule overflow-hidden">
      {/* Soft accent backdrop matching active modality */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${TYPE_TINT[modality]}, transparent 65%)`,
        }}
      />

      <div className="container py-24 md:py-28 relative">
        {/* Header */}
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● MODEL PRICING DETAIL
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink max-w-[820px]">
          Choose a budget. <span className="text-ink3 italic">Check how many times you can run each model.</span>
        </h2>
        <p className="text-ink2 text-[14px] leading-[1.6] mt-5 max-w-[640px]">
          Prices are approximate per run; final cost depends on inputs (duration, resolution, mode).
          No markup on inference, provider price is your price.
        </p>

        {/* Controls */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start">
          {/* Budget */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 block mb-3">
              YOUR BUDGET (USD)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3 font-mono">$</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={budget}
                  onChange={(e) => setBudget(Math.max(1, parseInt(e.target.value || '1', 10)))}
                  className="w-32 pl-7 pr-3 py-2 bg-surface border border-rule2 rounded-md text-ink tabular-nums font-mono text-[14px] focus:outline-none focus:border-spark/60"
                />
              </div>
              {PRESET_BUDGETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setBudget(p)}
                  className={[
                    'px-3 py-2 rounded-md font-mono text-[12px] border transition-colors',
                    budget === p
                      ? 'bg-spark text-white border-spark'
                      : 'bg-surface border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
                  ].join(' ')}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          {/* Modality + search */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 block mb-3">
              MODALITY
            </label>
            <div className="flex items-center gap-2">
              {MODALITIES.map((m) => {
                const active = m === modality;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModality(m)}
                    className={[
                      'px-3.5 py-2 rounded-md font-mono text-[11px] uppercase tracking-eyebrow border transition-colors',
                      active
                        ? 'bg-spark text-white border-spark'
                        : 'bg-surface border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
                    ].join(' ')}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 relative max-w-[420px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter, provider or model name…"
            aria-label="Filter models"
            className="w-full pl-9 pr-3 py-2 bg-surface border border-rule2 rounded-md text-ink placeholder:text-ink3 font-mono text-[12.5px] focus:outline-none focus:border-spark/60"
          />
        </div>

        {/* Disclaimer */}
        <p
          role="note"
          className="mt-6 px-4 py-3 bg-surface border border-rule2 rounded-md font-mono text-[11.5px] leading-[1.55] text-ink2"
        >
          <span className="text-spark">●</span>{' '}
          <span className="uppercase tracking-eyebrow text-ink3 text-[10px]">Disclaimer</span>{' '}
          <span className="ml-1">
            Model prices may vary depending on provider updates, usage type, and prompt requirements.
            What the provider charges is what you pay, we don&rsquo;t mark up inference.
          </span>
        </p>

        {/* Table */}
        <div className="mt-8 bg-surface border border-rule2 rounded-md overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_2fr_70px_60px_70px_100px_100px_90px] gap-3 md:gap-4 px-4 md:px-5 py-3 border-b border-rule2 bg-bg/40 font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
            <button
              type="button"
              onClick={() => toggleSort('provider')}
              className="text-left inline-flex items-center gap-1 hover:text-ink transition-colors"
              aria-label="Sort by provider"
            >
              provider {sortIcon('provider')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('name')}
              className="text-left inline-flex items-center gap-1 hover:text-ink transition-colors"
              aria-label="Sort by model name"
            >
              model {sortIcon('name')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('quality')}
              className="text-left inline-flex items-center gap-1 hover:text-ink transition-colors"
              aria-label="Sort by quality"
            >
              quality {sortIcon('quality')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('type')}
              className="text-left inline-flex items-center gap-1 hover:text-ink transition-colors"
              aria-label="Sort by type"
            >
              type {sortIcon('type')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('duration')}
              className="text-left inline-flex items-center gap-1 hover:text-ink transition-colors"
              aria-label="Sort by duration"
            >
              duration {sortIcon('duration')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('price')}
              className="text-right inline-flex items-center justify-end gap-1 hover:text-ink transition-colors"
              aria-label="Sort by provider price"
            >
              provider price {sortIcon('price')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('price')}
              className="text-right inline-flex items-center justify-end gap-1 hover:text-ink transition-colors"
              aria-label="Sort by price per run"
            >
              price / run {sortIcon('price')}
            </button>
            <button
              type="button"
              onClick={() => toggleSort('runs')}
              className="text-right inline-flex items-center justify-end gap-1 hover:text-ink transition-colors"
              aria-label="Sort by runs at budget"
            >
              runs at ${budget} {sortIcon('runs')}
            </button>
          </div>

          {/* Rows */}
          <div className="max-h-[640px] overflow-y-auto no-scrollbar">
            {filtered.length === 0 ? (
              <div className="p-10 text-center font-mono text-[12px] text-ink3">
                No models match, try a different filter or modality.
              </div>
            ) : (
              filtered.map((m, i) => {
                const runs = budget / m.price;
                const accent = TYPE_COLOR[m.modality];
                return (
                  <motion.div
                    key={`${m.provider}-${m.model}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: Math.min(i * 0.012, 0.18) }}
                    className="grid grid-cols-[1fr_2fr_70px_60px_70px_100px_100px_90px] gap-3 md:gap-4 px-4 md:px-5 py-3 border-b border-rule/60 last:border-b-0 hover:bg-bg/40 font-mono text-[12.5px] items-center"
                  >
                    <span className="text-ink2 truncate">{m.provider}</span>
                    <span className="text-ink truncate">{m.model}</span>
                    <span className="text-ink3">{m.quality}</span>
                    <span className="text-ink3">{m.type}</span>
                    <span className="text-ink3">{m.duration}</span>
                    <span className="text-right tabular-nums text-ink3">
                      {formatPrice(m.price)}
                    </span>
                    <span className="text-right tabular-nums font-semibold" style={{ color: accent }}>
                      {formatPrice(m.price)}
                      <span className="ml-1.5 text-spark">=</span>
                    </span>
                    <span className="text-right tabular-nums text-ink font-semibold">
                      {formatRuns(runs)}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        <p className="mt-4 font-mono text-[10px] text-ink3 text-center">
          {filtered.length} of {MODEL_PRICES.filter((p) => p.modality === modality).length} {modality.toLowerCase()} models · sorted by {sortKey} ({sortDir})
        </p>
      </div>
    </section>
  );
}
