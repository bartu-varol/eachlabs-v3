import Link from 'next/link';
import { WorkflowTile } from './WorkflowTile';
import { fetchWorkflowsServer } from '@/lib/workflows';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * Featured workflows strip, pulls top 6 trending flows from the live API.
 * SSR'd so the cards are visible in the initial HTML response.
 */
export async function TemplatesStrip() {
  let featured: Awaited<ReturnType<typeof fetchWorkflowsServer>>['workflows'] = [];
  try {
    const res = await fetchWorkflowsServer({ category: 'trending', limit: 6, offset: 0 });
    featured = res.workflows ?? [];
  } catch (e) {
    console.error('TemplatesStrip prefetch failed', e);
  }

  if (featured.length === 0) return null;

  return (
    <section className="container border-t border-divider py-16 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="max-w-[640px]">
          <Eyebrow className="mb-3">* TRENDING · WORKFLOW TEMPLATES</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.0] tracking-tightest text-ink">
            Six recipes that skip the wiring.
          </h2>
          <p className="text-body md:text-body-lg text-ink-muted leading-[1.55] mt-3">
            Pre-wired multi-model templates running in production right now.
            Fork into your account and override anything.
          </p>
        </div>
        <Link
          href="/explore/workflows"
          className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-field rounded-md text-body-sm font-semibold text-ink hover:bg-surface-raised hover:border-brand/40 transition-colors no-underline"
        >
          All templates <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((w) => (
          <WorkflowTile key={w.workflow_id} workflow={w} />
        ))}
      </div>
    </section>
  );
}
