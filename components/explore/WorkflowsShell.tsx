'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { MonoSelect } from '@/components/ui/MonoSelect';
import { WorkflowTile, WorkflowTileSkeleton } from './WorkflowTile';
import {
  fetchWorkflowCategories,
  fetchWorkflows,
  type Discovery,
  type WorkflowCategory,
  type WorkflowSummary,
} from '@/lib/workflows';
import { Eyebrow } from '@/components/ui/Eyebrow';

const PAGE_LIMIT = 60;
const PREFETCH_ROOT_MARGIN = '600px'; // start next page ~600px before reaching sentinel

type Mode = 'workflows' | 'trends';

type Props = {
  /** SSR-fetched first page so the user sees content immediately. */
  initialWorkflows: WorkflowSummary[];
  initialOffset: number | null;
  initialTotal: number;
  initialCategories: WorkflowCategory[];
  /**
   * Which slice of the catalog this shell renders:
   * - `workflows`: real use-case recipes (e-commerce, ad creative, etc.)
   * - `trends`: trend-driven content (viral effects, style transfers).
   */
  mode?: Mode;
};

export function WorkflowsShell({
  initialWorkflows,
  initialOffset,
  initialTotal,
  initialCategories,
  mode = 'workflows',
}: Props) {
  const isTrends = mode === 'trends';
  const [query, setQuery] = useState('');
  // Trends mode is hard-pinned to discovery=trending; users can't toggle it.
  const [discovery, setDiscovery] = useState<Discovery>(isTrends ? 'trending' : 'all');
  const [category, setCategory] = useState<string>('all');

  // The upstream API has no "exclude trending" filter, so the workflows tab
  // bleeds trending-tagged items into the regular list. Filter them out
  // client-side in workflows mode; trends mode passes everything through.
  const stripTrendingForMode = (list: WorkflowSummary[]) =>
    isTrends ? list : list.filter((w) => !(w.categories?.includes('trending')));

  const [workflows, setWorkflows] = useState<WorkflowSummary[]>(stripTrendingForMode(initialWorkflows));
  const [offset, setOffset] = useState<number | null>(initialOffset);
  const [total, setTotal] = useState<number>(initialTotal);
  const [loading, setLoading] = useState(false);
  /** True while a filter changed and we're swapping out the entire list. */
  const [reloading, setReloading] = useState(false);

  /** Categories shown in the Events select, only those with public workflows.
   *  Hide the `trending` category from the Workflows tab (it lives in its own
   *  Trends tab now). */
  const availableCategories = useMemo(() => {
    return initialCategories
      .filter((c) => c.public_workflow_count > 0)
      .filter((c) => isTrends || c.slug !== 'trending')
      .sort((a, b) => b.public_workflow_count - a.public_workflow_count);
  }, [initialCategories, isTrends]);

  /** Active request token, lets us cancel out-of-date inflight fetches. */
  const reqId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // Refetch from the start whenever a filter changes.
  useEffect(() => {
    const id = ++reqId.current;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setReloading(true);
    fetchWorkflows(
      { discovery, category, keyword: query.trim() || undefined, limit: PAGE_LIMIT, offset: 0 },
      ctrl.signal,
    )
      .then((res) => {
        if (reqId.current !== id) return;
        setWorkflows(stripTrendingForMode(res.workflows ?? []));
        setOffset(res.offset);
        setTotal(res.total_count ?? 0);
      })
      .catch((e) => {
        if (e?.name === 'AbortError' || reqId.current !== id) return;
        console.error('workflows fetch error', e);
        setWorkflows([]);
        setOffset(null);
      })
      .finally(() => {
        if (reqId.current === id) setReloading(false);
      });

    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discovery, category, query]);

  // Debounced search input, wait 220ms before firing the effect above.
  const [rawQuery, setRawQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery), 220);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const loadMore = useCallback(async () => {
    if (loading || offset == null) return;
    setLoading(true);
    try {
      const res = await fetchWorkflows({
        discovery,
        category,
        keyword: query.trim() || undefined,
        limit: PAGE_LIMIT,
        offset,
      });
      setWorkflows((cur) => [...cur, ...stripTrendingForMode(res.workflows ?? [])]);
      setOffset(res.offset);
      setTotal(res.total_count ?? total);
    } catch (e) {
      console.error('load more workflows error', e);
    } finally {
      setLoading(false);
    }
  }, [loading, offset, discovery, category, query, total]);

  // Intersection observer near the sentinel, fires when user scrolls close
  // to the bottom of the rendered list. PREFETCH_ROOT_MARGIN gives ~600px of
  // lead time so the next batch lands before the user actually reaches it.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || offset == null) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            loadMore();
            break;
          }
        }
      },
      { rootMargin: PREFETCH_ROOT_MARGIN },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [loadMore, offset, workflows.length]);

  const hasMore = offset != null;

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-col gap-3 mb-6 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative flex-1 max-w-[460px] shrink-0">
          <Search aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={rawQuery}
            onChange={(e) => setRawQuery(e.target.value)}
            placeholder="Search workflows..."
            className="w-full bg-surface-raised border border-field rounded-md pl-10 pr-4 py-2 text-body text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand"
          />
        </div>

        {/* Trends tab is hard-pinned to discovery=trending, no selector. */}
        {!isTrends && (
          <MonoSelect
            label="Discovery"
            value={discovery}
            onChange={(v) => setDiscovery(v as Discovery)}
            ariaLabel="Discovery"
            options={[
              { value: 'all',    label: 'All' },
              { value: 'newest', label: 'Newest' },
            ]}
          />
        )}

        <MonoSelect
          label="Events"
          value={category}
          onChange={setCategory}
          ariaLabel="Events"
          options={[
            { value: 'all', label: 'All' },
            ...availableCategories.map((c) => ({ value: c.slug, label: c.label })),
          ]}
        />

        <Eyebrow as="span" size="sm" tone="ink-faint" className="lg:ml-auto">{isTrends
            ? total
              ? `${total} trends`
              : ''
            : workflows.length
              ? `${workflows.length}${hasMore ? '+' : ''} workflows`
              : ''}</Eyebrow>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {reloading
          ? Array.from({ length: 12 }).map((_, i) => <WorkflowTileSkeleton key={`s-${i}`} />)
          : workflows.map((w, i) => (
              <div
                key={w.workflow_id}
                className="ec-anim-card"
                style={{ ['--ec-i' as string]: Math.min(i, 14) }}
              >
                <WorkflowTile workflow={w} />
              </div>
            ))}

        {/* Show 6 skeletons while the next page is loading mid-scroll. */}
        {loading && !reloading &&
          Array.from({ length: 6 }).map((_, i) => <WorkflowTileSkeleton key={`l-${i}`} />)}
      </div>

      {!reloading && workflows.length === 0 && (
        <div className="border border-dashed border-field rounded-md py-16 text-center mt-6">
          <p className="font-mono text-caption uppercase tracking-eyebrow text-ink-faint">
            No {isTrends ? 'trends' : 'workflows'} match those filters.
          </p>
        </div>
      )}

      {/* Sentinel, invisible row the IntersectionObserver watches. */}
      {hasMore && <div ref={sentinelRef} className="h-px w-full mt-10" aria-hidden />}

      {!hasMore && workflows.length > 0 && (
        <div className="mt-10 text-center font-mono text-micro uppercase tracking-eyebrow text-ink-faint">
          end of catalog · {workflows.length} {isTrends ? 'trends' : 'workflows'}
        </div>
      )}
    </>
  );
}
