'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { explore } from '@/lib/content';
import { Pill } from '@/components/ui/Pill';

export function ExploreFilters() {
  const [active, setActive] = useState('ALL');
  const [query, setQuery] = useState('');

  return (
    <section className="bg-bg border-y border-rule sticky top-[100px] z-30">
      <div className="container">
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:gap-6">
          <div className="relative flex-1 max-w-[480px]">
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3 w-4 h-4 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models, vendors, capabilities..."
              className="w-full bg-surface border border-rule2 rounded-md pl-10 pr-4 py-2 text-[14px] text-ink placeholder:text-ink3 focus:outline-none focus:border-spark"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {explore.filterTypes.map((type) => (
              <button key={type} type="button" onClick={() => setActive(type)}>
                <Pill active={active === type}>{type}</Pill>
              </button>
            ))}
          </div>

          <div className="flex gap-3 lg:ml-auto">
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2 cursor-pointer hover:text-ink">
              All vendors ▾
            </span>
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2 cursor-pointer hover:text-ink">
              Sort: popular ▾
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
