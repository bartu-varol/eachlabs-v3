import { NextResponse } from 'next/server';

/**
 * Proxy for the eachlabs public workflows endpoint. Lives on our origin so
 * the browser doesn't need CORS access to workflows.eachlabs.run, and so we
 * can tune caching policy here without touching the upstream service.
 */

const UPSTREAM = 'https://workflows.eachlabs.run/api/v1/public/workflows';

export const revalidate = 60; // seconds, list is fairly stable, 1 min is plenty

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const upstream = new URL(UPSTREAM);
  for (const key of ['category', 'keyword', 'limit', 'offset', 'recommended', 'sort']) {
    const v = searchParams.get(key);
    if (v != null && v !== '') upstream.searchParams.set(key, v.trim());
  }
  if (!upstream.searchParams.has('limit')) upstream.searchParams.set('limit', '60');
  if (!upstream.searchParams.has('offset')) upstream.searchParams.set('offset', '0');

  const res = await fetch(upstream.toString(), {
    headers: { 'Content-Type': 'application/json' },
    // Cache upstream response at the platform edge, keyed by URL incl. params.
    next: { revalidate: 60 },
  });
  const body = await res.json().catch(() => ({ error: 'invalid upstream response' }));

  return NextResponse.json(body, { status: res.status });
}
