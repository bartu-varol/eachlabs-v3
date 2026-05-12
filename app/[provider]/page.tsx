import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProvider,
  familiesByProvider,
  modelsByProvider,
  providerFaqs,
  providers,
} from '@/lib/catalog';
import { ProviderSidebar } from '@/components/explore/ProviderSidebar';
import { FilterableModelGrid } from '@/components/explore/FilterableModelGrid';
import { ReadmeSection } from '@/components/explore/ReadmeSection';
import { FaqSection } from '@/components/explore/FaqSection';
import { AiAssistantMenu } from '@/components/model-detail/AiAssistantMenu';

type RouteParams = { provider: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<RouteParams[]> {
  return providers.map((p) => ({ provider: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { provider } = await params;
  const p = getProvider(provider);
  if (!p) return { title: 'Provider · each::labs' };
  return {
    title: `${p.name} · models · each::labs`,
    description:
      p.description ??
      `All ${p.name} AI models available through the each::labs API, pinned versions, transparent pricing, one signature.`,
  };
}

export default async function ProviderPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { provider: providerSlug } = await params;
  const provider = getProvider(providerSlug);
  if (!provider) notFound();

  const families = familiesByProvider(providerSlug);
  const models = modelsByProvider(providerSlug);
  const faqs = providerFaqs(providerSlug);

  const countsByFamily: Record<string, number> = {};
  for (const m of models) countsByFamily[m.familySlug] = (countsByFamily[m.familySlug] ?? 0) + 1;

  return (
    <>
      <section className="container py-14 md:py-16 min-h-[360px] md:min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink no-underline"
          >
            <span aria-hidden>←</span> The catalog
          </Link>
          <AiAssistantMenu
            llmsUrl={`https://www.eachlabs.ai/${provider.slug}/llms.txt`}
            downloadName={provider.slug}
            modelName={`${provider.name} models`}
          />
        </div>
        <div key={provider.slug} className="flex flex-col flex-1">
          <div
            className="ec-anim ec-anim-left font-mono text-[11px] uppercase tracking-eyebrow text-spark"
            style={{ ['--ec-delay' as string]: 0 }}
          >
            * PROVIDER · {provider.slug}
          </div>
          <h1
            className="ec-anim ec-anim-scale font-display font-semibold text-[40px] md:text-[60px] leading-[1.0] tracking-tightest text-ink mt-4 line-clamp-1"
            style={{ ['--ec-delay' as string]: 80 }}
          >
            {provider.name}
          </h1>
          <p
            className="ec-anim ec-anim-right text-[15px] md:text-[16px] text-ink2 leading-[1.55] max-w-[720px] mt-5 line-clamp-2 min-h-[3.2em]"
            style={{ ['--ec-delay' as string]: 180 }}
          >
            {provider.description ?? ' '}
          </p>
          <div
            className="ec-anim ec-anim-up flex flex-wrap items-center gap-x-6 gap-y-2 mt-auto pt-7 font-mono text-[11px] uppercase tracking-eyebrow text-ink3"
            style={{ ['--ec-delay' as string]: 280 }}
          >
            <span><strong className="text-ink">{models.length}</strong> models</span>
            <span><strong className="text-ink">{families.length}</strong> families</span>
          </div>
        </div>
      </section>

      <section className="container border-t border-rule py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-10">
          <ProviderSidebar
            providerSlug={provider.slug}
            providerName={provider.name}
            families={families}
            totalCount={models.length}
            countsByFamily={countsByFamily}
            activeFamily={null}
          />
          <div key={provider.slug} className="min-w-0">
            <FilterableModelGrid
              models={models}
              eyebrow={`* EVERY ${provider.name.toUpperCase()} MODEL`}
              searchPlaceholder={`Search ${provider.name} models...`}
            />
          </div>
        </div>
      </section>

      <ReadmeSection
        markdown={provider.readmeMd}
        eyebrow={`* ABOUT ${provider.name.toUpperCase()}`}
        heading={`Working with ${provider.name}`}
      />

      <FaqSection
        faqs={faqs}
        eyebrow="* FREQUENTLY ASKED"
        heading={`About ${provider.name}`}
      />
    </>
  );
}
