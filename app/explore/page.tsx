import { Suspense } from 'react';
import { ExploreShell } from '@/components/explore/ExploreShell';
import { TemplatesStrip } from '@/components/explore/TemplatesStrip';
import { ReadmeSection } from '@/components/explore/ReadmeSection';
import { FaqSection } from '@/components/explore/FaqSection';
import { exploreFaqs, exploreReadmeMd } from '@/lib/catalogFaq';
import { fetchExploreData } from '@/lib/exploreData';

export const metadata = {
  title: 'Explore models · each::labs',
  description:
    'Every public AI model in the each::labs catalog, image, video, audio, text. Plus the workflow recipes that wire them up.',
};

export const revalidate = 60;

export default async function ExplorePage() {
  const d = await fetchExploreData();

  return (
    <>
      <Suspense fallback={null}>
        <ExploreShell
          initialTab="MODELS"
          initialWorkflows={d.initialWorkflows}
          initialWorkflowOffset={d.initialWorkflowOffset}
          initialWorkflowTotal={d.initialWorkflowTotal}
          initialWorkflowCategories={d.initialCategories}
          initialTrends={d.initialTrends}
          initialTrendsOffset={d.initialTrendsOffset}
          initialTrendsTotal={d.initialTrendsTotal}
          liveModelsCount={d.liveModelsTotal}
        />
      </Suspense>
      <TemplatesStrip />
      <ReadmeSection
        markdown={exploreReadmeMd}
        eyebrow="* ABOUT THE CATALOG"
        heading="How the catalog works"
      />
      <FaqSection
        faqs={exploreFaqs(d.initialWorkflowTotal)}
        eyebrow="* FREQUENTLY ASKED"
        heading="About the each::labs catalog"
      />
    </>
  );
}
