import raw from './catalog.data.json';

export type OutputType = 'video' | 'image' | 'audio' | 'text' | 'array' | 'code' | 'object';

export type Modality = 'VIDEO' | 'IMAGE' | 'AUDIO' | 'TEXT' | 'OTHER';

export type CatalogProvider = {
  slug: string;
  name: string;
  logo: string | null;
  title: string | null;
  description: string | null;
  readmeMd: string | null;
};

export type CatalogFamily = {
  providerSlug: string;
  slug: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  order: number | null;
  readmeMd: string | null;
};

export type CatalogFaq = {
  providerSlug: string;
  familySlug: string | null;
  question: string;
  /** Stored as HTML in the DB. */
  answer: string;
  sequence: number | null;
};

export type CatalogModel = {
  brandedSlug: string;
  name: string;
  title: string | null;
  providerSlug: string;
  familySlug: string;
  outputType: OutputType | null;
  /** Curated marketplace category (e.g. "text-to-video"). Null only for legacy models. */
  categorySlug: string | null;
  categoryName: string | null;
  recommended: boolean;
  popularity: number;
  avgPrice: number | null;
  /** Average response time, in seconds (DB column: average_response_time). */
  avgResponseSec: number | null;
  thumbnailUrl: string | null;
  description: string | null;
  executionCount: number;
};

type Raw = {
  providers: CatalogProvider[];
  families: CatalogFamily[];
  models: CatalogModel[];
  faqs: CatalogFaq[];
};

const data = raw as Raw;

export const providers: CatalogProvider[] = data.providers;
export const families: CatalogFamily[] = data.families;
export const models: CatalogModel[] = data.models;
export const faqs: CatalogFaq[] = data.faqs ?? [];

export function providerFaqs(providerSlug: string): CatalogFaq[] {
  return faqs.filter((f) => f.providerSlug === providerSlug && f.familySlug == null);
}

export function familyFaqs(providerSlug: string, familySlug: string): CatalogFaq[] {
  return faqs.filter((f) => f.providerSlug === providerSlug && f.familySlug === familySlug);
}

export function modalityOf(m: Pick<CatalogModel, 'outputType'>): Modality {
  switch (m.outputType) {
    case 'video': return 'VIDEO';
    case 'image':
    case 'array': return 'IMAGE';
    case 'audio': return 'AUDIO';
    case 'text':
    case 'code':
    case 'object': return 'TEXT';
    default: return 'OTHER';
  }
}

export const MODALITY_LABEL: Record<Modality, string> = {
  VIDEO: 'Video',
  IMAGE: 'Image',
  AUDIO: 'Audio',
  TEXT: 'Text',
  OTHER: 'Other',
};

export function getProvider(slug: string): CatalogProvider | undefined {
  return providers.find((p) => p.slug === slug);
}

export function getFamily(providerSlug: string, familySlug: string): CatalogFamily | undefined {
  return families.find((f) => f.providerSlug === providerSlug && f.slug === familySlug);
}

export function familiesByProvider(providerSlug: string): CatalogFamily[] {
  return families.filter((f) => f.providerSlug === providerSlug);
}

export function modelsByProvider(providerSlug: string): CatalogModel[] {
  return models.filter((m) => m.providerSlug === providerSlug);
}

export function modelsByFamily(providerSlug: string, familySlug: string): CatalogModel[] {
  return models.filter((m) => m.providerSlug === providerSlug && m.familySlug === familySlug);
}

export function modelByBrandedSlug(slug: string): CatalogModel | undefined {
  return models.find((m) => m.brandedSlug === slug);
}

/** Top providers by public-model count, for nav/explore. */
export const providersByModelCount: CatalogProvider[] = [...providers].sort((a, b) => {
  const ca = models.filter((m) => m.providerSlug === a.slug).length;
  const cb = models.filter((m) => m.providerSlug === b.slug).length;
  return cb - ca;
});

/** Display-formatted price ($/run). Returns "—" when unknown. */
export function formatPrice(m: Pick<CatalogModel, 'avgPrice'>): string {
  if (m.avgPrice == null) return '—';
  if (m.avgPrice === 0) return 'Free';
  if (m.avgPrice < 0.01) return `$${m.avgPrice.toFixed(4)}`;
  if (m.avgPrice < 1) return `$${m.avgPrice.toFixed(3)}`;
  return `$${m.avgPrice.toFixed(2)}`;
}

/** Display-formatted latency from seconds. */
export function formatLatency(m: Pick<CatalogModel, 'avgResponseSec'>): string {
  const s = m.avgResponseSec;
  if (s == null || s === 0) return '—';
  if (s >= 60) return `${Math.round(s / 60)}m`;
  return `${s}s`;
}

/** Pretty model title — prefers title (DB-curated), falls back to slug. */
export function displayName(m: Pick<CatalogModel, 'name' | 'title'>): string {
  return (m.title && m.title.trim()) || m.name;
}
