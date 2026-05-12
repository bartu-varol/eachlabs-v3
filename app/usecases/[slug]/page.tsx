import { notFound } from 'next/navigation';
import { UseCasePage } from '@/components/sections/UseCasePage';
import { ConsumerAIShowcase } from '@/components/sections/ConsumerAIShowcase';
import { RetailShowcase } from '@/components/sections/RetailShowcase';
import { InternalShowcase } from '@/components/sections/InternalShowcase';
import { MarketingShowcase } from '@/components/sections/MarketingShowcase';
import { AdTechShowcase } from '@/components/sections/AdTechShowcase';
import { GamingShowcase } from '@/components/sections/GamingShowcase';
import { USE_CASES, USE_CASE_SLUGS, type UseCaseSlug } from '@/lib/usecases';

export function generateStaticParams() {
  return USE_CASE_SLUGS.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!USE_CASE_SLUGS.includes(slug as UseCaseSlug)) {
    notFound();
  }
  const uc = USE_CASES[slug as UseCaseSlug];

  // All six use cases now have bespoke showcases. UseCasePage stays as a
  // fallback for any future slug that hasn't been redesigned yet.
  if (uc.slug === 'consumer-ai') return <ConsumerAIShowcase uc={uc} />;
  if (uc.slug === 'retail')      return <RetailShowcase uc={uc} />;
  if (uc.slug === 'internal')    return <InternalShowcase uc={uc} />;
  if (uc.slug === 'marketing')   return <MarketingShowcase uc={uc} />;
  if (uc.slug === 'ad-tech')     return <AdTechShowcase uc={uc} />;
  if (uc.slug === 'gaming')      return <GamingShowcase uc={uc} />;

  return <UseCasePage uc={uc} />;
}
