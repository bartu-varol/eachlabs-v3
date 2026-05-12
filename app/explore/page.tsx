import { ExploreHero } from '@/components/explore/ExploreHero';
import { ExploreShell } from '@/components/explore/ExploreShell';
import { TemplatesStrip } from '@/components/explore/TemplatesStrip';
import {
  fetchWorkflowsServer,
  fetchWorkflowCategoriesServer,
  type WorkflowSummary,
  type WorkflowCategory,
} from '@/lib/workflows';
import { fetchLiveModelsCount } from '@/lib/modelsLive';

export const metadata = {
  title: 'Explore models · each::labs',
  description: 'Every public AI model in the each::labs catalog, image, video, audio, text. Plus the workflow recipes that wire them up.',
};

export const revalidate = 60;

type SearchParams = { tab?: string | string[] };

function pickTab(t: string | undefined): 'MODELS' | 'WORKFLOWS' | 'TRENDS' {
  if (t === 'workflows') return 'WORKFLOWS';
  if (t === 'trends') return 'TRENDS';
  return 'MODELS';
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab } = await searchParams;
  const t = Array.isArray(tab) ? tab[0] : tab;
  const initialTab = pickTab(t);

  let initialWorkflows: WorkflowSummary[] = [];
  let initialOffset: number | null = 0;
  let initialTotal = 0;
  let initialCategories: WorkflowCategory[] = [];
  let initialTrends: WorkflowSummary[] = [];
  let initialTrendsOffset: number | null = 0;
  let initialTrendsTotal = 0;
  let liveModelsTotal = 0;
  try {
    const [wRes, cRes, mRes, tRes] = await Promise.all([
      fetchWorkflowsServer({ limit: 60, offset: 0 }),
      fetchWorkflowCategoriesServer(),
      fetchLiveModelsCount(),
      fetchWorkflowsServer({ discovery: 'trending', limit: 60, offset: 0 }),
    ]);
    initialWorkflows = wRes.workflows ?? [];
    initialOffset = wRes.offset ?? null;
    initialTotal = wRes.total_count ?? 0;
    initialCategories = cRes ?? [];
    liveModelsTotal = mRes.total ?? 0;
    initialTrends = tRes.workflows ?? [];
    initialTrendsOffset = tRes.offset ?? null;
    initialTrendsTotal = tRes.total_count ?? 0;
  } catch (e) {
    console.error('explore SSR prefetch failed', e);
  }

  return (
    <>
      <ExploreHero workflowCount={initialTotal} modelsCount={liveModelsTotal} />
      <ExploreShell
        initialTab={initialTab}
        initialWorkflows={initialWorkflows}
        initialWorkflowOffset={initialOffset}
        initialWorkflowTotal={initialTotal}
        initialWorkflowCategories={initialCategories}
        initialTrends={initialTrends}
        initialTrendsOffset={initialTrendsOffset}
        initialTrendsTotal={initialTrendsTotal}
        liveModelsCount={liveModelsTotal}
      />
      <TemplatesStrip />
    </>
  );
}
