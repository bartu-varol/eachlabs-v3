import 'server-only';

const GHOST_API_URL = process.env.GHOST_API_URL || 'https://each-ai.ghost.io';
const GHOST_API_KEY = process.env.GHOST_API_KEY || 'db9aa3fd2f54d7478e0d100e6d';

export type BlogAuthor = {
  id: string;
  name: string;
  slug: string;
  profileImage: string | null;
  bio: string | null;
  url: string | null;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPostDetail = {
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  featureImage: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
  readingTime: number;
  author: BlogAuthor | null;
  primaryTag: BlogTag | null;
  tags: BlogTag[];
};

type RawAuthor = {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string | null;
  url: string | null;
};

type RawTag = {
  id: string;
  name: string;
  slug: string;
};

type RawPost = {
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  custom_excerpt: string | null;
  feature_image: string | null;
  published_at: string | null;
  updated_at: string | null;
  reading_time: number | null;
  primary_author: RawAuthor | null;
  primary_tag: RawTag | null;
  tags: RawTag[] | null;
};

function mapAuthor(a: RawAuthor | null | undefined): BlogAuthor | null {
  if (!a) return null;
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    profileImage: a.profile_image ?? null,
    bio: a.bio ?? null,
    url: a.url ?? null,
  };
}

function mapTag(t: RawTag | null | undefined): BlogTag | null {
  if (!t) return null;
  return { id: t.id, name: t.name, slug: t.slug };
}

function mapPost(p: RawPost): BlogPostDetail {
  return {
    slug: p.slug,
    title: p.title,
    html: p.html,
    excerpt: p.custom_excerpt ?? p.excerpt ?? '',
    featureImage: p.feature_image ?? null,
    publishedAt: p.published_at ?? null,
    updatedAt: p.updated_at ?? null,
    readingTime: p.reading_time ?? 0,
    author: mapAuthor(p.primary_author),
    primaryTag: mapTag(p.primary_tag),
    tags: (p.tags ?? []).map(mapTag).filter((t): t is BlogTag => t !== null),
  };
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  const url =
    `${GHOST_API_URL}/ghost/api/v3/content/posts/slug/${encodeURIComponent(slug)}` +
    `?key=${GHOST_API_KEY}&include=authors,tags`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return null;
  const data = (await res.json()) as { posts?: RawPost[] };
  const raw = data.posts?.[0];
  return raw ? mapPost(raw) : null;
}

export async function listBlogPostSlugs(limit = 24): Promise<string[]> {
  const url =
    `${GHOST_API_URL}/ghost/api/v3/content/posts/` +
    `?key=${GHOST_API_KEY}&limit=${limit}&fields=slug`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return [];
  const data = (await res.json()) as { posts?: Array<{ slug: string }> };
  return (data.posts ?? []).map((p) => p.slug);
}
