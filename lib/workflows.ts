/** Live workflow data — fetched from /api/workflows (proxy to workflows.eachlabs.run). */

export type WorkflowSummary = {
  workflow_id: string;
  version_id?: string;
  slug: string;
  name: string;
  description: string;
  thumbnail?: string;
  categories: string[];
  tags?: string[];
  trigger_count: number;
  popular_sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export type WorkflowsResponse = {
  workflows: WorkflowSummary[];
  /** Next offset to request, or null when exhausted. */
  offset: number | null;
  total_count: number;
};

export type WorkflowCategory = {
  slug: string;
  label: string;
  description: string;
  is_default: boolean;
  public_workflow_count: number;
};

export type Discovery = 'all' | 'trending' | 'newest';

export type WorkflowsQuery = {
  category?: string;
  keyword?: string;
  discovery?: Discovery;
  limit?: number;
  offset?: number;
};

function buildQS(q: WorkflowsQuery): string {
  const sp = new URLSearchParams();
  if (q.category && q.category !== 'all') sp.set('category', q.category);
  if (q.keyword) sp.set('keyword', q.keyword.trim());
  if (q.discovery === 'trending') sp.set('category', 'trending');
  if (q.discovery === 'newest') sp.set('sort', 'newest');
  if (q.limit) sp.set('limit', String(q.limit));
  if (q.offset != null) sp.set('offset', String(q.offset));
  return sp.toString();
}

/** Client-side fetcher. Use only from the browser ("use client"). */
export async function fetchWorkflows(q: WorkflowsQuery, signal?: AbortSignal): Promise<WorkflowsResponse> {
  const qs = buildQS(q);
  const res = await fetch(`/api/workflows${qs ? `?${qs}` : ''}`, { signal });
  if (!res.ok) throw new Error(`workflows fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchWorkflowCategories(): Promise<WorkflowCategory[]> {
  const res = await fetch('/api/workflow-categories');
  if (!res.ok) throw new Error(`categories fetch failed: ${res.status}`);
  const body = await res.json();
  const list = Array.isArray(body?.categories) ? (body.categories as WorkflowCategory[]) : [];
  return list;
}

/** Server-side fetcher — call from Server Components only. Uses absolute upstream URL. */
export async function fetchWorkflowsServer(q: WorkflowsQuery): Promise<WorkflowsResponse> {
  const qs = buildQS(q);
  const url = `https://workflows.eachlabs.run/api/v1/public/workflows${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`workflows upstream failed: ${res.status}`);
  return res.json();
}

export async function fetchWorkflowCategoriesServer(): Promise<WorkflowCategory[]> {
  const res = await fetch('https://workflows.eachlabs.run/api/v1/categories', {
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body?.categories) ? (body.categories as WorkflowCategory[]) : [];
}
