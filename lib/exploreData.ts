import {
  fetchWorkflowsServer,
  fetchWorkflowCategoriesServer,
  type WorkflowSummary,
  type WorkflowCategory,
} from '@/lib/workflows';
import { fetchLiveModelsCount } from '@/lib/modelsLive';

export type ExploreSSRData = {
  initialWorkflows: WorkflowSummary[];
  initialWorkflowOffset: number | null;
  initialWorkflowTotal: number;
  initialCategories: WorkflowCategory[];
  initialTrends: WorkflowSummary[];
  initialTrendsOffset: number | null;
  initialTrendsTotal: number;
  liveModelsTotal: number;
};

const empty: ExploreSSRData = {
  initialWorkflows: [],
  initialWorkflowOffset: 0,
  initialWorkflowTotal: 0,
  initialCategories: [],
  initialTrends: [],
  initialTrendsOffset: 0,
  initialTrendsTotal: 0,
  liveModelsTotal: 0,
};

export async function fetchExploreData(): Promise<ExploreSSRData> {
  try {
    const [wRes, cRes, mRes, tRes] = await Promise.all([
      fetchWorkflowsServer({ limit: 60, offset: 0 }),
      fetchWorkflowCategoriesServer(),
      fetchLiveModelsCount(),
      fetchWorkflowsServer({ discovery: 'trending', limit: 60, offset: 0 }),
    ]);
    return {
      initialWorkflows: wRes.workflows ?? [],
      initialWorkflowOffset: wRes.offset ?? null,
      initialWorkflowTotal: wRes.total_count ?? 0,
      initialCategories: cRes ?? [],
      initialTrends: tRes.workflows ?? [],
      initialTrendsOffset: tRes.offset ?? null,
      initialTrendsTotal: tRes.total_count ?? 0,
      liveModelsTotal: mRes.total ?? 0,
    };
  } catch (e) {
    console.error('explore SSR prefetch failed', e);
    return empty;
  }
}
