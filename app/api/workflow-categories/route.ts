import { NextResponse } from 'next/server';

const UPSTREAM = 'https://workflows.eachlabs.run/api/v1/categories';

export const revalidate = 600; // 10 min, categories don't churn

export async function GET(): Promise<NextResponse> {
  const res = await fetch(UPSTREAM, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 600 },
  });
  const body = await res.json().catch(() => ({ error: 'invalid upstream response' }));
  return NextResponse.json(body, { status: res.status });
}
