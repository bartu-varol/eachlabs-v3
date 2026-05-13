import 'server-only';
import { XMLParser } from 'fast-xml-parser';

const RSS_URL =
  process.env.MINTLIFY_CHANGELOG_RSS_URL ||
  'https://docs.eachlabs.ai/updates/rss.xml';

export type ChangelogEntry = {
  id: string;
  title: string;
  link: string;
  description: string;
  publishedAt: string | null;
  contentHtml: string;
};

type RawItem = {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  guid?: string | { '#text'?: string };
  'content:encoded'?: string;
};

type RawRss = {
  rss?: {
    channel?: {
      item?: RawItem | RawItem[];
    };
  };
};

function txt(v: unknown): string {
  if (typeof v === 'string') return v;
  if (v && typeof v === 'object' && '#text' in v) {
    const t = (v as { '#text': unknown })['#text'];
    return typeof t === 'string' ? t : '';
  }
  return '';
}

function mapItem(it: RawItem, idx: number): ChangelogEntry {
  const title = txt(it.title);
  const guid = txt(it.guid) || `${title || 'entry'}-${idx}`;
  return {
    id: guid,
    title,
    link: it.link ?? '',
    description: it.description ?? '',
    publishedAt: it.pubDate ?? null,
    contentHtml: it['content:encoded'] ?? it.description ?? '',
  };
}

export async function listChangelogEntries(): Promise<ChangelogEntry[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      processEntities: true,
    });
    const data = parser.parse(xml) as RawRss;
    const item = data?.rss?.channel?.item;
    if (!item) return [];
    const items = Array.isArray(item) ? item : [item];
    return items.map(mapItem);
  } catch {
    return [];
  }
}
