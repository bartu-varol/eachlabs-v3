import type { ChangelogEntry } from '@/lib/changelog';

// Preview data. Remove this file + the fallback in page.tsx once the
// Mintlify Updates feed at docs.eachlabs.ai is publishing real entries.
export const MOCK_ENTRIES: ChangelogEntry[] = [
  {
    id: 'mock-2026-05-12-router',
    title: 'Smarter router: latency aware failover',
    link: 'https://docs.eachlabs.ai/changelog',
    description:
      'Cold-start cut by 38% on first-tier providers. The router now scores routes on observed p95 latency, not just availability.',
    publishedAt: 'Tue, 12 May 2026 09:00:00 GMT',
    contentHtml: `
      <p>When the primary provider slips past your latency budget, the next best path takes over without dropping the request. Retries respect provider-specific 429 backoff hints.</p>
      <h3>Highlights</h3>
      <ul>
        <li>38% faster cold start on first-tier providers</li>
        <li>Per-route latency budget in workflow config</li>
        <li>Failure-aware reordering rebuilds itself every 60s</li>
      </ul>
    `,
  },
  {
    id: 'mock-2026-04-30-models',
    title: '80+ new image and video models',
    link: 'https://docs.eachlabs.ai/changelog',
    description:
      'Catalog adds new entries from open-weight image and video providers across photoreal, anime, and motion families.',
    publishedAt: 'Wed, 30 Apr 2026 14:30:00 GMT',
    contentHtml: `
      <p>Every new model ships with an estimated price on its model card, a sample input, and a tested webhook contract. Browse the additions on the <a href="https://eachlabs.ai/explore">Explore</a> page.</p>
    `,
  },
  {
    id: 'mock-2026-04-18-nested-workflows',
    title: 'Nested workflows in beta',
    link: 'https://docs.eachlabs.ai/changelog',
    description:
      'A workflow step can now reference another workflow by ID. Outputs flow through as if the sub-workflow were a single step.',
    publishedAt: 'Fri, 18 Apr 2026 11:15:00 GMT',
    contentHtml: `
      <p>Build a "polish" workflow once, then call it from any pipeline that needs the same post-processing. Parameter references resolve across the nesting boundary.</p>
      <h3>Notes</h3>
      <ul>
        <li>Recursion depth capped at 4 levels</li>
        <li>Failure in a sub-workflow surfaces with the full nested stack</li>
        <li>Pricing is summed across the full call tree</li>
      </ul>
    `,
  },
  {
    id: 'mock-2026-04-02-webhooks',
    title: 'Webhook delivery: stricter retries and signature rotation',
    link: 'https://docs.eachlabs.ai/changelog',
    description:
      'Failed webhooks now retry on a 1/5/30/180/720 minute schedule with jitter. Signing keys can rotate without dropping inflight deliveries.',
    publishedAt: 'Thu, 02 Apr 2026 16:00:00 GMT',
    contentHtml: `
      <p>The retry sweep walks every undelivered webhook hourly, so transient outages on your receiver no longer leak silently. Rotate signing keys from the dashboard with overlap windows up to 24 hours.</p>
    `,
  },
  {
    id: 'mock-2026-03-15-pricing',
    title: 'Estimated price on every model card',
    link: 'https://docs.eachlabs.ai/changelog',
    description:
      'Each model now exposes a typical cost figure derived from the last 24 hours of production runs.',
    publishedAt: 'Sun, 15 Mar 2026 08:45:00 GMT',
    contentHtml: `
      <p>The estimate updates on every catalog refresh and lives next to the model name on its detail page. Workflows surface the same figure summed across their steps.</p>
    `,
  },
];
