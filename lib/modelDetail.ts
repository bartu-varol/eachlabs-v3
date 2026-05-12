import 'server-only';

const CRM_BASE = 'https://crm.eachlabs.ai';

export type ModelInputComponent =
  | 'input'
  | 'select'
  | 'slider'
  | 'checkbox'
  | 'file'
  | 'array_input'
  | string;

export type ModelInput = {
  name: string;
  title: string | null;
  type: string | null;
  component: ModelInputComponent | null;
  required: boolean;
  default: string | null;
  minimum: string | null;
  maximum: string | null;
  description: string | null;
  options: string[] | null;
  acceptedExtensions: string[] | null;
  itemsType: string | null;
};

export type ModelExample = {
  id: number;
  name: string | null;
  status: string | null;
  input: Record<string, unknown> | null;
  output: unknown;
  inferenceTime: number | null;
  totalTime: number | null;
};

export type RelatedModel = {
  slug: string;
  title: string | null;
  type: string;
  outputType: string | null;
  thumbnailUrl: string | null;
  costPerSecond: number | null;
  averageResponseTime: number | null;
  familySlug: string | null;
  providerSlug: string | null;
};

export type PricingRules = {
  type?: string;
  rules?: Array<{
    when?: unknown[];
    formula?: { expr: string; params?: Record<string, number> };
    description?: string;
  }>;
  variables?: Record<string, string>;
};

export type ModelDetail = {
  id: number;
  slug: string;
  title: string | null;
  name: string;
  type: string;
  outputType: string | null;
  thumbnailUrl: string | null;
  description: string | null;
  costPerSecond: number | null;
  averageResponseTime: number | null;
  executionCount: number | null;
  chargeType: string | null;
  fixedCharge: number | null;
  releaseDate: string | null;
  pricingRules: PricingRules | null;
  readme: {
    overview: string | null;
    technicalSpec: string | null;
    keyConsiderations: string | null;
    tipsAndTricks: string | null;
    capabilities: string | null;
    whatCanIUseFor: string | null;
    thingsToBeAwareOf: string | null;
    limitations: string | null;
  };
  family: {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    thumbnailUrl: string | null;
  };
  provider: {
    id: number;
    slug: string;
    name: string;
    title: string | null;
    logo: string | null;
  };
  inputs: ModelInput[];
  examples: ModelExample[];
  fallbackOutput: { url: string; sourceSlug: string } | null;
  defaultExampleInput: Record<string, unknown> | null;
  defaultExampleOutputRaw: unknown;
  related: RelatedModel[];
};

type CrmRef = { id?: number; slug?: string; name?: string };

type CrmInput = {
  name?: string;
  title?: string;
  type?: string;
  component?: string;
  required?: boolean;
  default?: string | number | boolean | null;
  minimum?: number | null;
  maximum?: number | null;
  description?: string;
  options?: string | string[];
  accepted_extensions?: string[];
  items_type?: string;
  order?: number;
};

type CrmReadme = {
  overview?: string | false;
  technical_spec?: string | false;
  key_considerations?: string | false;
  tips_and_tricks?: string | false;
  capabilities?: string | false;
  what_can_i_use_for?: string | false;
  things_to_be_aware_of?: string | false;
  limitations?: string | false;
};

type CrmDefaultExample = {
  name?: string;
  input?: Record<string, unknown>;
  output?: unknown;
  inference_time?: number;
  total_time?: number;
};

type CrmRecommended = {
  slug?: string;
  title?: string;
  name?: string;
  type?: string;
  output_type?: string;
  thumbnail_url?: string;
  step_by_step_price?: number;
  average_response_time?: number;
  family?: CrmRef;
  provider?: CrmRef;
  branded_slug?: string | false;
};

type CrmModel = {
  id: number;
  slug: string;
  title?: string;
  name: string;
  type?: string | null;
  output_type?: string;
  thumbnail_url?: string;
  description?: string;
  release_date?: string;
  average_response_time?: number;
  popularity?: number;
  charge_type?: string;
  step_by_step_price?: number;
  charge?: PricingRules | false;
  readme_information?: CrmReadme;
  family?: CrmRef;
  provider?: CrmRef;
  category?: CrmRef;
  inputs?: Record<string, CrmInput>;
  default_example?: CrmDefaultExample;
  recommended_models?: CrmRecommended[];
};

type CrmResponse = { result?: CrmModel; state?: string; code?: number };

function stringifyDefault(value: unknown): string | null {
  if (value === null || value === undefined || value === false) return null;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'string') return value.length > 0 ? value : null;
  return String(value);
}

function normalizeOptions(opts: unknown): string[] | null {
  if (Array.isArray(opts)) {
    const items = opts
      .map((o) => {
        if (typeof o === 'string' || typeof o === 'number') return String(o);
        if (o && typeof o === 'object' && 'value' in (o as Record<string, unknown>)) {
          const v = (o as Record<string, unknown>).value;
          return v == null ? null : String(v);
        }
        return null;
      })
      .filter((s): s is string => s !== null);
    return items.length > 0 ? items : null;
  }
  if (typeof opts === 'string' && opts.trim().length > 0) {
    return opts.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return null;
}

function mapInput(name: string, raw: CrmInput): ModelInput {
  return {
    name: raw.name ?? name,
    title: raw.title ?? null,
    type: raw.type ?? null,
    component: raw.component ?? null,
    required: Boolean(raw.required),
    default: stringifyDefault(raw.default),
    minimum: raw.minimum != null ? String(raw.minimum) : null,
    maximum: raw.maximum != null ? String(raw.maximum) : null,
    description: raw.description ?? null,
    options: normalizeOptions(raw.options),
    acceptedExtensions: raw.accepted_extensions ?? null,
    itemsType: raw.items_type ?? null,
  };
}

function readmeField(value: string | false | undefined): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function extractMediaUrl(output: unknown): string | null {
  if (typeof output === 'string') {
    const trimmed = output.trim().replace(/^"|"$/g, '');
    if (!trimmed) return null;
    if (trimmed.startsWith('http')) return trimmed;
    try {
      return extractMediaUrl(JSON.parse(output.trim()));
    } catch {
      return null;
    }
  }
  if (Array.isArray(output)) {
    for (const item of output) {
      const url = extractMediaUrl(item);
      if (url) return url;
    }
    return null;
  }
  if (output && typeof output === 'object') {
    const obj = output as Record<string, unknown>;
    const direct = obj.url ?? obj.video_url ?? obj.image_url ?? obj.audio_url ?? obj.output;
    const directUrl = extractMediaUrl(direct);
    if (directUrl) return directUrl;
    if (Array.isArray(obj.outputs)) {
      for (const item of obj.outputs) {
        const url = extractMediaUrl(item);
        if (url) return url;
      }
    }
  }
  return null;
}

function mapRecommended(r: CrmRecommended): RelatedModel | null {
  if (!r.slug) return null;
  return {
    slug: r.slug,
    title: r.title ?? r.name ?? r.slug,
    type: r.type ?? '',
    outputType: r.output_type ?? null,
    thumbnailUrl: r.thumbnail_url ?? null,
    costPerSecond: r.step_by_step_price ?? null,
    averageResponseTime: r.average_response_time ?? null,
    familySlug: r.family?.slug ?? null,
    providerSlug: r.provider?.slug ?? null,
  };
}

export async function getModelDetail(
  _providerSlug: string,
  _familySlug: string,
  slug: string,
): Promise<ModelDetail | null> {
  let body: CrmResponse;
  try {
    const res = await fetch(`${CRM_BASE}/v1/model?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    body = (await res.json()) as CrmResponse;
  } catch {
    return null;
  }

  const m = body.result;
  if (!m || !m.slug) return null;

  // Inputs, convert keyed map to ordered array.
  const inputsObj = m.inputs ?? {};
  const inputs = Object.entries(inputsObj)
    .filter(([k]) => k !== 'type')
    .map(([k, v]) => mapInput(k, v))
    .sort((a, b) => {
      const aOrder = (inputsObj as Record<string, CrmInput>)[a.name]?.order ?? 0;
      const bOrder = (inputsObj as Record<string, CrmInput>)[b.name]?.order ?? 0;
      return aOrder - bOrder;
    });

  // Default example → unified example.
  const de = m.default_example;
  const ownExamples: ModelExample[] = de
    ? [
        {
          id: 0,
          name: de.name ?? null,
          status: 'success',
          input: de.input ?? null,
          output: de.output ?? null,
          inferenceTime: de.inference_time ?? null,
          totalTime: de.total_time ?? null,
        },
      ]
    : [];

  // fallbackOutput: only when output is a media URL (image/video/audio).
  const exampleUrl = de?.output ? extractMediaUrl(de.output) : null;
  const fallbackOutput = exampleUrl ? { url: exampleUrl, sourceSlug: m.slug } : null;

  const charge = m.charge && typeof m.charge === 'object' ? m.charge : null;
  const readme = m.readme_information ?? {};

  const related = (m.recommended_models ?? [])
    .map(mapRecommended)
    .filter((r): r is RelatedModel => r !== null)
    .slice(0, 4);

  return {
    id: m.id,
    slug: m.slug,
    title: m.title ?? null,
    name: m.name,
    type: m.type ?? m.output_type ?? '',
    outputType: m.output_type ?? null,
    thumbnailUrl: m.thumbnail_url ?? null,
    description: m.description ?? null,
    costPerSecond: m.step_by_step_price ?? null,
    averageResponseTime: m.average_response_time ?? null,
    executionCount: m.popularity ?? null,
    chargeType: m.charge_type ?? null,
    fixedCharge: null,
    releaseDate: m.release_date ?? null,
    pricingRules: charge,
    readme: {
      overview: readmeField(readme.overview),
      technicalSpec: readmeField(readme.technical_spec),
      keyConsiderations: readmeField(readme.key_considerations),
      tipsAndTricks: readmeField(readme.tips_and_tricks),
      capabilities: readmeField(readme.capabilities),
      whatCanIUseFor: readmeField(readme.what_can_i_use_for),
      thingsToBeAwareOf: readmeField(readme.things_to_be_aware_of),
      limitations: readmeField(readme.limitations),
    },
    family: {
      id: m.family?.id ?? 0,
      slug: m.family?.slug ?? 'eachlabs',
      name: m.family?.name ?? 'eachlabs',
      description: null,
      thumbnailUrl: null,
    },
    provider: {
      id: m.provider?.id ?? 0,
      slug: m.provider?.slug ?? 'each-labs',
      name: m.provider?.name ?? 'each::labs',
      title: null,
      logo: null,
    },
    inputs,
    examples: ownExamples,
    fallbackOutput,
    defaultExampleInput: de?.input ?? null,
    defaultExampleOutputRaw: de?.output ?? null,
    related,
  };
}
