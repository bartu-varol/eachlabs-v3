import { llmRouterModels, type LlmRouterModel } from './llmRouter.generated';

export type { LlmRouterModel } from './llmRouter.generated';
export { llmRouterModels };

export type LlmRouterProviderGroup = {
  slug: string;
  name: string;
  count: number;
};

export function getLlmRouterProviders(): LlmRouterProviderGroup[] {
  const map = new Map<string, LlmRouterProviderGroup>();
  for (const m of llmRouterModels) {
    const existing = map.get(m.providerSlug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(m.providerSlug, { slug: m.providerSlug, name: m.providerName, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function findLlmRouterModel(urlSlug: string): LlmRouterModel | null {
  return llmRouterModels.find((m) => m.urlSlug === urlSlug) ?? null;
}

/** Same provider, excluding the given model. Limited to `limit` entries. */
export function getRelatedLlmRouterModels(model: LlmRouterModel, limit = 6): LlmRouterModel[] {
  return llmRouterModels
    .filter((m) => m.providerSlug === model.providerSlug && m.routerSlug !== model.routerSlug)
    .slice(0, limit);
}
