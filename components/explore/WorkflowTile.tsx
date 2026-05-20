'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { WorkflowSummary } from '@/lib/workflows';
import { pickShineDirection } from './shine';

/** Deterministic 1000-2000 multiplier from workflow_id, stable across renders. */
function runsMultiplier(workflowId: string): number {
  let h = 0;
  for (let i = 0; i < workflowId.length; i++) h = (h * 31 + workflowId.charCodeAt(i)) | 0;
  return 1000 + (Math.abs(h) % 1001);
}

export function WorkflowTile({ workflow }: { workflow: WorkflowSummary }) {
  const href = `/ai-flows/${workflow.slug}`;
  const isTrending = workflow.categories?.includes('trending');
  const isVideo = workflow.thumbnail?.match(/\.(webm|mp4|mov)$/i);
  const displayedRuns = workflow.trigger_count * runsMultiplier(workflow.workflow_id);
  const categories = workflow.categories?.filter((c) => c !== 'trending').slice(0, 2) ?? [];
  const shineClass = pickShineDirection(workflow.workflow_id);
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      className="ec-card group relative block aspect-[4/5] rounded-lg overflow-hidden bg-surface-raised no-underline"
    >
      <div className="ec-card-media absolute inset-0 bg-gradient-to-br from-surface-sunken via-surface-raised to-surface-sunken">
        {workflow.thumbnail && !isVideo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={workflow.thumbnail}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {workflow.thumbnail && isVideo && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={workflow.thumbnail}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      <div className={`ec-card-shine ${shineClass}`} aria-hidden />

      <div className="ec-card-scrim absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none z-[1]" />

      {!isTrending && (
        <span className="absolute top-3 left-3 z-10 max-w-[60%] truncate font-mono text-micro uppercase tracking-eyebrow font-semibold px-2.5 py-1 rounded-md backdrop-blur-md bg-white/90 text-zinc-900 shadow-sm">
          Workflow
        </span>
      )}

      {isTrending && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 font-mono text-micro uppercase tracking-eyebrow font-semibold px-2.5 py-1 rounded-md bg-brand text-on-brand shadow-sm">
          ↗ trending
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5 text-white">
        <div className="font-sans font-semibold text-h4 md:text-h4 leading-[1.1] tracking-[-0.02em] line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {workflow.name}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2 font-mono text-micro uppercase tracking-eyebrow text-white/80">
          <span className="truncate">{categories.join(' · ') || 'workflow'}</span>
          {displayedRuns > 0 && (
            <span className="shrink-0">
              {Intl.NumberFormat('en', { notation: 'compact' }).format(displayedRuns)} runs
            </span>
          )}
        </div>
        {workflow.description && (
          <div className="ec-card-reveal mt-2.5 text-caption text-white/85 leading-[1.5] line-clamp-3">
            {workflow.description}
          </div>
        )}
      </div>
    </Link>
  );
}

/** Skeleton placeholder, matches the 4:5 aspect of the real card. */
export function WorkflowTileSkeleton() {
  return (
    <div className="aspect-[4/5] rounded-lg bg-surface-sunken ec-skeleton ring-1 ring-field/60" />
  );
}
