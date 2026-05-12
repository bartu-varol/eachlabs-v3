import 'server-only';

const BASE = 'https://workflows.eachlabs.run/api/v1';

export type FlowInputProperty = {
  type: 'image' | 'video' | 'audio' | 'string' | 'number' | 'boolean' | string;
  required?: boolean;
  default_value?: unknown;
  accept_multiple_files?: boolean;
  description?: string;
  enum?: string[];
};

export type FlowInputSchema = {
  type?: 'object';
  properties: Record<string, FlowInputProperty>;
};

export type FlowStep = {
  id: string;
  model: string;
  type: 'model' | string;
  params: Record<string, unknown>;
};

export type FlowDefinition = {
  version: string;
  input_schema: FlowInputSchema;
  steps: FlowStep[];
};

export type FlowDetail = {
  workflowId: string;
  versionId: string;
  slug: string;
  name: string;
  description: string;
  thumbnail: string | null;
  categories: string[];
  triggerCount: number;
  definition: FlowDefinition;
  status: string;
  exampleOutput: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type RelatedFlow = {
  slug: string;
  name: string;
  description: string;
  thumbnail: string | null;
  categories: string[];
  triggerCount: number;
};

type RawWorkflowVersion = {
  workflow_id: string;
  version_id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail?: string;
  categories?: string[];
  trigger_count?: number;
  definition: FlowDefinition;
  status: string;
  example_output?: string;
  created_at?: string;
  updated_at?: string;
};

type RawDetailResponse = {
  versions?: RawWorkflowVersion[];
};

type RawListResponse = {
  workflows?: Array<{
    workflow_id: string;
    slug: string;
    name: string;
    description: string;
    thumbnail?: string;
    categories?: string[];
    trigger_count?: number;
  }>;
};

function mapVersion(v: RawWorkflowVersion): FlowDetail {
  return {
    workflowId: v.workflow_id,
    versionId: v.version_id,
    slug: v.slug,
    name: v.name,
    description: v.description,
    thumbnail: v.thumbnail ?? null,
    categories: v.categories ?? [],
    triggerCount: v.trigger_count ?? 0,
    definition: v.definition,
    status: v.status,
    exampleOutput: v.example_output ?? null,
    createdAt: v.created_at ?? null,
    updatedAt: v.updated_at ?? null,
  };
}

export async function getFlowDetail(slug: string): Promise<FlowDetail | null> {
  const res = await fetch(`${BASE}/public/workflows/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const body = (await res.json()) as RawDetailResponse;
  const version = body.versions?.[0];
  if (!version) return null;
  return mapVersion(version);
}

export async function getRelatedFlows(
  category: string | undefined,
  excludeSlug: string,
  limit = 4,
): Promise<RelatedFlow[]> {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  params.set('limit', String(limit + 1));
  const res = await fetch(`${BASE}/public/workflows?${params.toString()}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const body = (await res.json()) as RawListResponse;
  const items = body.workflows ?? [];
  return items
    .filter((w) => w.slug !== excludeSlug)
    .slice(0, limit)
    .map((w) => ({
      slug: w.slug,
      name: w.name,
      description: w.description,
      thumbnail: w.thumbnail ?? null,
      categories: w.categories ?? [],
      triggerCount: w.trigger_count ?? 0,
    }));
}

export async function listPopularFlowSlugs(limit = 12): Promise<string[]> {
  const res = await fetch(`${BASE}/public/workflows?limit=${limit}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  const body = (await res.json()) as RawListResponse;
  return (body.workflows ?? []).map((w) => w.slug);
}

export function resolveInputRef(ref: unknown, inputs: FlowInputSchema['properties']): unknown {
  if (typeof ref !== 'string') return ref;
  const m = ref.match(/^\$\.inputs\.(.+)$/);
  if (!m) return ref;
  const key = m[1];
  return inputs[key]?.default_value ?? ref;
}

export function buildExampleInputJson(flow: FlowDetail): string {
  const props = flow.definition.input_schema?.properties ?? {};
  const obj: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(props)) {
    if (key === 'type') continue;
    obj[key] = val?.default_value ?? sampleByType(val?.type);
  }
  return JSON.stringify(obj, null, 2);
}

function sampleByType(type: string | undefined): unknown {
  switch (type) {
    case 'image':
      return 'https://files.eachlabs.ai/your-image.jpg';
    case 'video':
      return 'https://files.eachlabs.ai/your-video.mp4';
    case 'audio':
      return 'https://files.eachlabs.ai/your-audio.mp3';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    default:
      return '';
  }
}
