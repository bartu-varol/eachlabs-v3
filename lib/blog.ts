export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Display date — already formatted, e.g. "Mar 14, 2026". */
  date: string;
  readMin: number;
  category: 'ENGINEERING' | 'PRODUCT' | 'COMPANY' | 'CASE STUDY' | 'CHANGELOG';
  author: { name: string; role: string; initials: string; avatarBg: string; avatarText: string };
  /** Tile accent — drives the gradient on listing cards. */
  accent: 'spark' | 'highlight' | 'success' | 'sun' | 'yellow' | 'ember';
  featured?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-we-cut-errors-97x',
    title: 'How we cut user-visible errors 97×',
    excerpt:
      'A walkthrough of the router’s quality-aware spillover engine — what we measure, when we reroute, and why p95 alone is not enough. With production traces from a real outage night.',
    date: 'May 02, 2026',
    readMin: 9,
    category: 'ENGINEERING',
    author: { name: 'Furkan Sandal', role: 'CTO · each::labs', initials: 'FS', avatarBg: 'bg-spark', avatarText: 'text-bg' },
    accent: 'spark',
    featured: true,
  },
  {
    slug: 'each-run-the-call-signature',
    title: 'each.run() — the call signature for 600+ models',
    excerpt:
      'Why every model on the platform — image, video, audio, 3D — answers the same call. The design choice that lets you swap providers in one string change.',
    date: 'Apr 24, 2026',
    readMin: 6,
    category: 'ENGINEERING',
    author: { name: 'Selimhan Çakır', role: 'Founder & CEO', initials: 'SC', avatarBg: 'bg-highlight', avatarText: 'text-white' },
    accent: 'highlight',
  },
  {
    slug: 'quality-aware-routing',
    title: 'Quality-aware routing: beyond 5xx retries',
    excerpt:
      'Most routers retry on errors. Ours measures output drift and reroutes before users notice. How we score quality on the hot path in <20ms.',
    date: 'Apr 18, 2026',
    readMin: 7,
    category: 'PRODUCT',
    author: { name: 'Uğurcan Sevindik', role: 'Eng · Routing', initials: 'US', avatarBg: 'bg-sun', avatarText: 'text-bg' },
    accent: 'success',
  },
  {
    slug: 'per-user-economics',
    title: 'Per-user economics: tagging and slicing in production',
    excerpt:
      'Finance asked "what does a power user cost us?" Two clicks later, we had the answer. The tagging model that lets the dashboard infer dimensions on its own.',
    date: 'Apr 11, 2026',
    readMin: 8,
    category: 'ENGINEERING',
    author: { name: 'Umut Gül', role: 'Eng · Trace', initials: 'UG', avatarBg: 'bg-yellow', avatarText: 'text-bg' },
    accent: 'yellow',
  },
  {
    slug: 'no-markup-on-inference',
    title: 'Why we don’t markup inference',
    excerpt:
      'Provider price is what you pay. We make money on subscription + enterprise — and we’re happy to tell you exactly why that incentive alignment matters.',
    date: 'Apr 02, 2026',
    readMin: 5,
    category: 'COMPANY',
    author: { name: 'Selimhan Çakır', role: 'Founder & CEO', initials: 'SC', avatarBg: 'bg-highlight', avatarText: 'text-white' },
    accent: 'ember',
  },
  {
    slug: 'pagerduty-zero',
    title: 'On-call PagerDuty went from weekly to zero',
    excerpt:
      'A consumer-AI customer’s before/after, with their actual incident timeline overlaid on the trace logs. What auto-fallback looked like in the wild.',
    date: 'Mar 28, 2026',
    readMin: 6,
    category: 'CASE STUDY',
    author: { name: 'Furkan Sandal', role: 'CTO · each::labs', initials: 'FS', avatarBg: 'bg-spark', avatarText: 'text-bg' },
    accent: 'spark',
  },
  {
    slug: 'bento-we-shipped',
    title: 'The bento we shipped last Friday',
    excerpt:
      'Six products, two layers, one control plane — visualized. A look at the design choices behind the new platform page and how each tile maps to a real product.',
    date: 'Mar 21, 2026',
    readMin: 4,
    category: 'CHANGELOG',
    author: { name: 'Uğurcan Sevindik', role: 'Eng · Routing', initials: 'US', avatarBg: 'bg-sun', avatarText: 'text-bg' },
    accent: 'sun',
  },
  {
    slug: 'series-a-18m',
    title: 'Series A — $18M led by EBRD',
    excerpt:
      'We raised an $18M Series A to make production AI boring. Where the money is going: routing intelligence, observability depth, and the people who keep your weekend.',
    date: 'Mar 14, 2026',
    readMin: 4,
    category: 'COMPANY',
    author: { name: 'Selimhan Çakır', role: 'Founder & CEO', initials: 'SC', avatarBg: 'bg-highlight', avatarText: 'text-white' },
    accent: 'highlight',
  },
  {
    slug: 'sticky-cohorts-ab',
    title: 'Sticky cohorts: A/B testing without a confounded result',
    excerpt:
      'Random assignment per call breaks A/B in production. Here’s how sticky-by-user cohorts plus sequential testing keep the math honest.',
    date: 'Mar 07, 2026',
    readMin: 7,
    category: 'PRODUCT',
    author: { name: 'Umut Gül', role: 'Eng · Trace', initials: 'UG', avatarBg: 'bg-yellow', avatarText: 'text-bg' },
    accent: 'yellow',
  },
];

export const BLOG_CATEGORIES: BlogPost['category'][] = [
  'ENGINEERING',
  'PRODUCT',
  'COMPANY',
  'CASE STUDY',
  'CHANGELOG',
];
