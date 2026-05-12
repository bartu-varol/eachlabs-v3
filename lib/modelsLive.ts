import { models } from './catalog';

export type LiveModelsCount = {
  total: number;
  categoryCounts: Record<string, number>;
};

export async function fetchLiveModelsCount(): Promise<LiveModelsCount> {
  return { total: models.length, categoryCounts: {} };
}
