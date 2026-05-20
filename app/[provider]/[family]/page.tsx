import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getProvider,
  getFamily,
  familiesByProvider,
  modelsByProvider,
  modelsByFamily,
  families,
} from '@/lib/catalog';
import { familyFaqsWithFallback } from '@/lib/catalogFaq';
import { ProviderSidebar } from '@/components/explore/ProviderSidebar';
import { FilterableModelGrid } from '@/components/explore/FilterableModelGrid';
import { ReadmeSection } from '@/components/explore/ReadmeSection';
import { FaqSection } from '@/components/explore/FaqSection';
import { AiAssistantMenu } from '@/components/model-detail/AiAssistantMenu';

type RouteParams = { provider: string; family: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<RouteParams[]> {
  return families.map((f) => ({ provider: f.providerSlug, family: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { provider, family } = await params;
  const fam = getFamily(provider, family);
  if (!fam) return { title: 'Family · each::labs' };
  return {
    title: `${fam.name} · models · each::labs`,
    description:
      fam.description ?? `${fam.name} model family on each::labs, all variants in one place.`,
  };
}

export default async function FamilyPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { provider: providerSlug, family: familySlug } = await params;
  const provider = getProvider(providerSlug);
  const family = getFamily(providerSlug, familySlug);
  if (!provider || !family) notFound();

  const allFamilies = familiesByProvider(providerSlug);
  const allModels = modelsByProvider(providerSlug);
  const variants = modelsByFamily(providerSlug, familySlug);
  const faqs = familyFaqsWithFallback(provider, family, variants.length);

  const countsByFamily: Record<string, number> = {};
  for (const m of allModels) countsByFamily[m.familySlug] = (countsByFamily[m.familySlug] ?? 0) + 1;

  return (
    <>
      <section className="container py-14 md:py-16 min-h-[360px] md:min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint hover:text-ink no-underline"
          >
            <span aria-hidden>←</span> The catalog
          </Link>
          <AiAssistantMenu
            llmsUrl={`https://www.eachlabs.ai/${provider.slug}/${family.slug}/llms.txt`}
            downloadName={`${provider.slug}-${family.slug}`}
            modelName={`${family.name} family`}
          />
        </div>
        <div key={`${provider.slug}/${family.slug}`} className="flex flex-col flex-1">
          <div
            className="ec-anim ec-anim-left font-mono text-eyebrow uppercase tracking-eyebrow text-brand"
            style={{ ['--ec-delay' as string]: 0 }}
          >
            * FAMILY · <Link href={`/${provider.slug}`} className="text-brand hover:text-brand-deep no-underline">{provider.slug}</Link>/{family.slug}
          </div>
          <h1
            className="ec-anim ec-anim-scale font-sans font-semibold text-display md:text-display-lg leading-[1.0] tracking-tightest text-ink mt-4 line-clamp-1"
            style={{ ['--ec-delay' as string]: 80 }}
          >
            {family.name}
          </h1>
          <p
            className="ec-anim ec-anim-right text-body-lg md:text-body-lg text-ink-muted leading-[1.55] max-w-[720px] mt-5 line-clamp-2 min-h-[3.2em]"
            style={{ ['--ec-delay' as string]: 180 }}
          >
            {family.description ?? ' '}
          </p>
          <div
            className="ec-anim ec-anim-up flex flex-wrap items-center gap-x-6 gap-y-2 mt-auto pt-7 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint"
            style={{ ['--ec-delay' as string]: 280 }}
          >
            <span><strong className="text-ink">{variants.length}</strong> variants</span>
            <span>part of <Link href={`/${provider.slug}`} className="text-ink hover:text-brand no-underline">{provider.name}</Link></span>
          </div>
        </div>
      </section>

      <section className="container border-t border-divider py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8 lg:gap-10">
          <ProviderSidebar
            providerSlug={provider.slug}
            providerName={provider.name}
            families={allFamilies}
            totalCount={allModels.length}
            countsByFamily={countsByFamily}
            activeFamily={family.slug}
          />
          <div key={family.slug} className="min-w-0">
            <Suspense fallback={null}>
              <FilterableModelGrid
                models={variants}
                eyebrow={`* ${family.name.toUpperCase()} VARIANTS`}
                searchPlaceholder={`Search ${family.name} variants...`}
              />
            </Suspense>
          </div>
        </div>
      </section>

      {family.readmeMd ? (
        <div key={`readme-${family.slug}`} className="ec-anim ec-anim-up" style={{ ['--ec-delay' as string]: 0 }}>
          <ReadmeSection
            markdown={family.readmeMd}
            eyebrow={`* ABOUT ${family.name.toUpperCase()}`}
            heading={`Working with ${family.name}`}
          />
        </div>
      ) : (
        <section className="container border-t border-divider py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10">
            <div>
              <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.05] tracking-tightest text-ink">
                One family. Many shapes.
              </h2>
            </div>
            <div className="text-body md:text-body-lg text-ink-muted leading-[1.65] space-y-4">
              <p>
                Every variant in the <strong className="text-ink">{family.name}</strong> family
                shares the same input contract and the same call signature. Switch from{' '}
                standard to pro to 4K by changing one string, no client
                code changes, no re-auth.
              </p>
              <p>
                Pin a version when you ship. Promote a new variant when ready. Roll back if
                quality dips. The family is a moving target, your code shouldn't be.
              </p>
            </div>
          </div>
        </section>
      )}

      <div key={`faq-${family.slug}`} className="ec-anim ec-anim-up" style={{ ['--ec-delay' as string]: 0 }}>
        <FaqSection faqs={faqs} eyebrow="* FAQ" heading={`About ${family.name}`} />
      </div>
    </>
  );
}
