import { ExploreShell } from '@/components/explore/ExploreShell';
import { TemplatesStrip } from '@/components/explore/TemplatesStrip';
import { ReadmeSection } from '@/components/explore/ReadmeSection';
import { FaqSection } from '@/components/explore/FaqSection';
import { exploreFaqs, exploreReadmeMd } from '@/lib/catalogFaq';
import { fetchExploreData } from '@/lib/exploreData';

export const metadata = {
  title: 'LLMs · each::labs',
  description:
    'Every LLM available through the eachlabs-llm-router, one signature, one bill, automatic failover.',
};

export const revalidate = 60;

export default async function ExploreLlmsPage() {
  const d = await fetchExploreData();

  return (
    <>
      <ExploreShell
        initialTab="LLMS"
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
