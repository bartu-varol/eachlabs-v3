import { Suspense } from 'react';
import { ExploreShell } from '@/components/explore/ExploreShell';
import { TemplatesStrip } from '@/components/explore/TemplatesStrip';
import { ReadmeSection } from '@/components/explore/ReadmeSection';
import { FaqSection } from '@/components/explore/FaqSection';
import { exploreFaqs, exploreReadmeMd } from '@/lib/catalogFaq';
import { fetchExploreData } from '@/lib/exploreData';

export const metadata = {
  title: 'Workflow templates · each::labs',
  description:
    'Pre-wired AI workflow templates from each::labs, fork into your account and ship production AI features in hours.',
};

export const revalidate = 60;

export default async function ExploreWorkflowsPage() {
  const d = await fetchExploreData();

  return (
    <>
      <Suspense fallback={null}>
        <ExploreShell
          initialTab="WORKFLOWS"
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
