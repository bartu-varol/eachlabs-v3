import { ExploreShell } from '@/components/explore/ExploreShell';
import { TemplatesStrip } from '@/components/explore/TemplatesStrip';
import { ReadmeSection } from '@/components/explore/ReadmeSection';
import { FaqSection } from '@/components/explore/FaqSection';
import { exploreFaqs, exploreReadmeMd } from '@/lib/catalogFaq';
import { fetchExploreData } from '@/lib/exploreData';

export const metadata = {
  title: 'Trending workflows · each::labs',
  description:
    'The workflows others are forking, remixing, and shipping right now on each::labs.',
};

export const revalidate = 60;

export default async function ExploreTrendsPage() {
  const d = await fetchExploreData();

  return (
    <>
      <ExploreShell
        initialTab="TRENDS"
        initialWorkflows={d.initialWorkflows}
        initialWorkflowOffset={d.initialWorkflowOffset}
        initialWorkflowTotal={d.initialWorkflowTotal}
        initialWorkflowCategories={d.initialCategories}
        initialTrends={d.initialTrends}
        initialTrendsOffset={d.initialTrendsOffset}
        initialTrendsTotal={d.initialTrendsTotal}
        liveModelsCount={d.liveModelsTotal}
      />
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
