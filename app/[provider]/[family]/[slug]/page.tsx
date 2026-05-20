import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModelDetail } from '@/lib/modelDetail';
import { ModelDetailHero } from '@/components/model-detail/ModelDetailHero';
import { ModelApiSnippets } from '@/components/model-detail/ModelApiSnippets';
import { ModelExamples } from '@/components/model-detail/ModelExamples';
import { ModelPricing } from '@/components/model-detail/ModelPricing';
import { ModelStrengths } from '@/components/model-detail/ModelStrengths';
import { ModelReadme } from '@/components/model-detail/ModelReadme';
import { ModelRelated } from '@/components/model-detail/ModelRelated';
import { FaqSection } from '@/components/explore/FaqSection';
import { modelFaqsFallback } from '@/lib/catalogFaq';
import { displayName } from '@/lib/catalog';

type RouteParams = { provider: string; family: string; slug: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<RouteParams[]> {
  return [{ provider: 'kling', family: 'kling-v3', slug: 'kling-v3-pro-image-to-video' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { provider, family, slug } = await params;
  const model = await getModelDetail(provider, family, slug).catch(() => null);
  if (!model) return { title: 'Model · each::labs' };
  const parts = (model.title ?? model.slug)
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const niceTitle =
    parts.length > 1 ? `${parts.slice(0, -1).join(' ')} · ${parts[parts.length - 1]}` : parts[0];
  return {
    title: `${niceTitle} · each::labs`,
    description: model.description ?? `${niceTitle} on each::labs · run via one API`,
  };
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { provider, family, slug } = await params;
  const model = await getModelDetail(provider, family, slug);
  if (!model) notFound();

  const faqs = modelFaqsFallback({
    slug: model.slug,
    name: model.name,
    title: model.title,
    description: model.description,
    avgPrice: null,
    avgResponseSec: model.averageResponseTime,
    providerSlug: model.provider.slug,
    providerName: model.provider.name,
    familySlug: model.family.slug,
    familyName: model.family.name,
  });

  return (
    <>
      <ModelDetailHero model={model} />

      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          <div className="space-y-8 min-w-0">
            <ModelApiSnippets
              modelSlug={model.slug}
              inputs={model.inputs}
              examplePayload={model.defaultExampleInput}
            />
            <ModelExamples model={model} />
            <ModelReadme readme={model.readme} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <ModelPricing model={model} />
            <ModelStrengths model={model} />
            <Link
              href="https://docs.eachlabs.ai/introduction"
              className="flex items-center justify-between gap-2 px-5 py-4 border border-field rounded-md text-body-sm text-ink hover:border-ink/40 hover:bg-surface-raised/30 transition-colors"
            >
              <span>Get an API key</span>
              <span aria-hidden className="text-ink-faint">→</span>
            </Link>
          </aside>
        </div>
      </section>

      <ModelRelated items={model.related} />

      <FaqSection
        faqs={faqs}
        eyebrow="* FAQ"
        heading={`About ${displayName({ name: model.name, title: model.title })}`}
      />
    </>
  );
}
