import Link from 'next/link';
import { WorkflowTile } from './WorkflowTile';
import { fetchWorkflowsServer } from '@/lib/workflows';

/**
 * Featured workflows strip — pulls top 6 trending flows from the live API.
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
    <section className="container border-t border-rule py-16 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="max-w-[640px]">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            * TRENDING · WORKFLOW TEMPLATES
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.0] tracking-tightest text-ink">
            Six recipes that skip the wiring.
          </h2>
          <p className="text-[14px] md:text-[15px] text-ink2 leading-[1.55] mt-3">
            Pre-wired multi-model templates running in production right now.
            Fork into your account and override anything.
          </p>
        </div>
        <Link
          href="/templates"
          className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 border border-rule2 rounded-md text-[13px] font-semibold text-ink hover:bg-surface hover:border-spark/40 transition-colors no-underline"
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
