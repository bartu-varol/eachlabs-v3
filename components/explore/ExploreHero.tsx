import Link from 'next/link';
import { models, providers } from '@/lib/catalog';

type Props = {
  /** Total public workflows from the live API, keeps the hero copy honest. */
  workflowCount?: number;
  /** Live model count from upstream API. Falls back to static catalog. */
  modelsCount?: number;
};

export function ExploreHero({ workflowCount, modelsCount }: Props) {
  const displayedModels = modelsCount && modelsCount > 0 ? modelsCount : models.length;
  return (
    <section className="container py-14 md:py-20">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        * THE CATALOG
      </div>
      <h1 className="font-display font-semibold text-[44px] md:text-[80px] leading-[0.95] tracking-tightest text-ink mt-4 max-w-[820px]">
        Every model worth shipping.
        <span className="block text-ink3 italic">Plus the recipes that wire them up.</span>
      </h1>
      <p className="text-[15px] md:text-[16px] text-ink2 leading-[1.55] max-w-[680px] mt-6">
        {displayedModels} pinned models from {providers.length} providers, image, video, audio, text, all behind one{' '}
        <code className="font-mono text-spark">each.run()</code>.
        {workflowCount && workflowCount > 0 ? (
          <>
            {' '}Plus <strong className="text-ink">{workflowCount}+</strong> pre-wired workflow
            templates you can fork into your account.
          </>
        ) : (
          <> Plus production-ready workflow templates you can fork into your account.</>
        )}
      </p>

      <div className="flex flex-wrap gap-3 mt-8">
        <Link
          href="https://docs.eachlabs.ai/introduction"
          className="inline-flex items-center gap-2 px-5 py-3 bg-spark text-white rounded-md text-[13px] font-semibold no-underline hover:bg-ember transition-colors"
        >
          Read the API docs <span aria-hidden>→</span>
        </Link>
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 px-5 py-3 border border-rule2 rounded-md text-[13px] font-semibold text-ink no-underline hover:bg-surface hover:border-spark/40 transition-colors"
        >
          Browse templates <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
