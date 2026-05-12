import type { Metadata } from 'next';
import Link from 'next/link';
import { WorkflowsShell } from '@/components/explore/WorkflowsShell';
import {
  fetchWorkflowsServer,
  fetchWorkflowCategoriesServer,
  type WorkflowSummary,
  type WorkflowCategory,
} from '@/lib/workflows';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Workflow templates · each::labs',
  description:
    'Pre-wired AI workflow templates from each::labs, fork into your account and ship production AI features in hours.',
};

export default async function TemplatesPage() {
  let initialWorkflows: WorkflowSummary[] = [];
  let initialOffset: number | null = 0;
  let initialTotal = 0;
  let initialCategories: WorkflowCategory[] = [];
  try {
    const [wRes, cRes] = await Promise.all([
      fetchWorkflowsServer({ limit: 60, offset: 0 }),
      fetchWorkflowCategoriesServer(),
    ]);
    initialWorkflows = wRes.workflows ?? [];
    initialOffset = wRes.offset ?? null;
    initialTotal = wRes.total_count ?? 0;
    initialCategories = cRes ?? [];
  } catch (e) {
    console.error('templates SSR prefetch failed', e);
  }

  return (
    <>
      <section className="container py-14 md:py-20">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink no-underline mb-6"
        >
          <span aria-hidden>←</span> The catalog
        </Link>
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
          * WORKFLOW TEMPLATES
        </div>
        <h1 className="font-display font-semibold text-[44px] md:text-[72px] leading-[0.95] tracking-tightest text-ink mt-4 max-w-[820px]">
          Pre-wired recipes.
          <span className="block text-ink3 italic">Fork. Ship. Iterate.</span>
        </h1>
        <p className="text-[15px] md:text-[16px] text-ink2 leading-[1.55] max-w-[680px] mt-6">
          Every template wires multiple models behind one{' '}
          <code className="font-mono text-spark">each.run()</code>. Fallbacks tuned, prices pinned,
          observability on.{' '}
          <strong className="text-ink">{initialTotal}</strong> public workflows running in
          production today.
        </p>
      </section>

      <section className="container border-t border-rule py-10 md:py-14">
        <WorkflowsShell
          initialWorkflows={initialWorkflows}
          initialOffset={initialOffset}
          initialTotal={initialTotal}
          initialCategories={initialCategories}
        />
      </section>
    </>
  );
}
