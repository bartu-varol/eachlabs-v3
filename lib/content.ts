// All copy lives here. Edit copy by editing this file.

export const ticker = [
  '* WE DO THE BORING PARTS',
  '* 99.99% UPTIME · 284K REQ/24H',
  '* THE MODEL THAT BROKE YESTERDAY? STILL SHIPPING',
  '* 600+ MODELS · 4 MODALITIES · 1 API',
  '* NO 3AM PAGES (ASK YOUR ON-CALL)',
  '* SERIES A — $18M LED BY EBRD',
];

// ---------- NAV ----------

export type MegaColumn = {
  eyebrow: string;
  items: { title: string; body: string; href: string; comingSoon?: boolean }[];
};

export type FeaturedCard = {
  eyebrow: string;
  title: string;
  body: string;
  link: string;
};

export type MegaMenu = {
  columns: MegaColumn[];
  featured?: FeaturedCard;
  flat?: { title: string; href: string }[];
};

export const megaMenus: Record<'platform' | 'usecases' | 'developers', MegaMenu> = {
  platform: {
    columns: [
      {
        eyebrow: 'RUN',
        items: [
          { title: 'each::router',    body: 'Model-aware fallbacks. Quality-aware routing.', href: '/router' },
          { title: 'each::workflows', body: 'Chain models. Version. Rollback.',              href: '/workflows' },
          { title: 'each::enhancer',  body: 'Same prompt. Better output. Every model.',      href: '/enhancer' },
        ],
      },
      {
        eyebrow: 'OBSERVE',
        items: [
          { title: 'each::trace',      body: 'Per-call attribution. Slice cost, latency.',  href: '/trace', comingSoon: true },
        ],
      },
    ],
    featured: {
      eyebrow: '* THIS WEEK',
      title: 'each::router 1.4 — quality-aware spill',
      body: 'We now route around quality degradations, not just failures.',
      link: 'Read more →',
    },
  },
  usecases: {
    columns: [
      {
        eyebrow: 'BY INDUSTRY',
        items: [
          { title: 'Consumer AI',       body: 'Creative apps, social, gen UX.',         href: '/usecases/consumer-ai' },
          { title: 'Enterprise retail', body: 'Product photography, ad creative.',      href: '/usecases/retail' },
          { title: 'Internal AI apps',  body: 'Ops tooling, content for teams.',        href: '/usecases/internal' },
        ],
      },
      {
        eyebrow: 'BY TEAM',
        items: [
          { title: 'Marketing & brand', body: 'Campaign assets, brand creative.',       href: '/usecases/marketing' },
          { title: 'Ad-tech & growth',  body: 'Programmatic ads, live A/B.',            href: '/usecases/ad-tech' },
          { title: 'Gaming & live-ops', body: 'NPCs, VO, textures, music.',             href: '/usecases/gaming' },
        ],
      },
    ],
    featured: {
      eyebrow: '* CASE STUDY',
      title: 'How LUME dropped user-visible errors 41×',
      body: 'A consumer creative app rewired its inference layer in one week. 6 min read.',
      link: 'Read more →',
    },
  },
  developers: {
    columns: [],
    flat: [
      { title: 'Docs',          href: 'https://docs.eachlabs.ai/introduction' },
      { title: 'API reference', href: 'https://docs.eachlabs.ai/introduction' },
      { title: 'SDKs',          href: 'https://docs.eachlabs.ai/introduction' },
      { title: 'Changelog',     href: 'https://docs.eachlabs.ai/introduction' },
      { title: 'GitHub',        href: 'https://github.com/eachlabs' },
      { title: 'Discord',       href: 'https://discord.gg/eachlabs' },
      { title: 'Status',        href: 'https://docs.eachlabs.ai/introduction' },
    ],
  },
};

export const navItems: Array<
  | { label: string; menu: 'platform' | 'usecases' | 'developers' }
  | { label: string; href: string }
> = [
  { label: 'Platform',   menu: 'platform' },
  { label: 'Use Cases',  menu: 'usecases' },
  { label: 'Explore',    href: '/explore' },
  { label: 'Customers',  href: '/customers' },
  { label: 'Pricing',    href: '/pricing' },
  { label: 'Developers', menu: 'developers' },
];

// ---------- HERO ----------

export const hero = {
  pill: '* SERIES A · $18M LED BY EBRD',
  pillCta: 'Read the memo →',
  /** Body lead — large, the hook. */
  bodyLead: '600+ AI models behind one API',
  /** Body rest — descriptive, with playful flair. */
  body:
    '— the hyped ones, the cheap ones, the one that broke yesterday. We do the boring parts: retries when models go down, per-user cost when finance asks, live A/B when product wants to ship. You write each.run(). We do the rest.',
  ctas: [
    { label: "Start shipping — it's free →",       href: '/signup',  variant: 'primary'   as const },
    { label: 'Talk to an engineer (a real one)',   href: '/contact', variant: 'secondary' as const },
  ],
  /** Stats bar — 4 numbers each with a one-line cheeky sub. */
  stats: [
    { value: '600+',    label: 'models',          sub: 'one API · one signature' },
    { value: '10×',     label: 'fewer errors',    sub: 'auto-fallback in <120ms' },
    { value: '99.99%',  label: 'uptime',          sub: 'no asterisks' },
    { value: '<120ms',  label: 'router overhead', sub: 'faster than a tweet' },
  ],
  subtext: 'NO CREDIT CARD · NO "JUMP ON A QUICK CALL" · CANCEL BY DELETING YOUR API KEY',
};

// ---------- WIDGET ----------

export const widget = {
  eyebrow: '* WHAT’S BREAKING TODAY?',
  headline: { line1: 'Tell us what’s breaking.', line2: 'We’ve already built the fix.' },
  belowCount: '8 PROBLEMS · 5 NAMED PRODUCTS · ONE API',
  belowEscape: { prefix: 'Don’t see your problem?', linkLabel: 'Talk to an engineer →', href: 'mailto:engineer@eachlabs.ai' },
};

// ---------- CHAOS → FIX (Section 02) ----------

export const chaosToFix = {
  eyebrow: '* SECTION / 02 · CHAOS → FIX · EACH::SENSE',
  headline: {
    line1: 'Tell us what’s breaking.',
    line2: 'We’ve already built the fix.',
  },
};

// ---------- RECEIPTS / BENCHMARKED ----------

export type Metric = {
  /** Tab pill label, e.g. "USER-VISIBLE ERRORS" */
  label: string;
  /** Short caption shown under the headline */
  caption: string;
  /** Headline winner number — e.g. "97×" + "FEWER ERRORS" */
  hero: { multiplier: string; suffix: string };
  /** Side labels */
  others: { label: string; sub: string };
  each: { label: string; sub: string };
  /** Numeric values used for bars + count-up. `inverse` = lower is better. */
  format: 'percent' | 'time' | 'usd' | 'days';
  othersValue: number;
  eachValue: number;
  /** What "filled" bar represents — visual scaling reference */
  scaleMax?: number;
};

export const receipts = {
  eyebrow: '* RECEIPTS · BENCHMARKED Q1 2026',
  cohort: 'n=4.1M production traces',
  metrics: [
    {
      label: 'USER-VISIBLE ERRORS',
      caption: 'auto-fallback fires in <120ms when the primary model dies',
      hero: { multiplier: '97×', suffix: 'FEWER ERRORS' },
      others: { label: 'OTHERS', sub: 'raw SDKs, no router' },
      each:   { label: 'EACH.RUN', sub: 'quality-aware + fallback' },
      format: 'percent',
      othersValue: 3.42,
      eachValue: 0.035,
      scaleMax: 4,
    },
    {
      label: 'P99 RECOVERY ON FAIL',
      caption: 'how long until the user sees a recovered response',
      hero: { multiplier: '6,200×', suffix: 'FASTER RECOVERY' },
      others: { label: 'OTHERS', sub: 'manual rollover, on-call paged' },
      each:   { label: 'EACH.RUN', sub: 'router spillover · live' },
      format: 'time',
      othersValue: 744, // seconds (12.4 min)
      eachValue: 0.12,  // seconds (120ms)
      scaleMax: 800,
    },
    {
      label: 'COST PER SHIPPED RESULT',
      caption: 'average $/successful output across 600+ models',
      hero: { multiplier: '3×', suffix: 'CHEAPER' },
      others: { label: 'OTHERS', sub: 'pinned to one provider' },
      each:   { label: 'EACH.RUN', sub: 'quality-aware routing' },
      format: 'usd',
      othersValue: 0.18,
      eachValue: 0.06,
      scaleMax: 0.2,
    },
    {
      label: 'INTEGRATION TIME',
      caption: 'time to first prod call after signing up',
      hero: { multiplier: '2,520×', suffix: 'FASTER TO SHIP' },
      others: { label: 'OTHERS', sub: 'new SDK · auth · QA' },
      each:   { label: 'EACH.RUN', sub: 'one API · one signature' },
      format: 'days',
      othersValue: 14,    // days
      eachValue: 0.0056,  // days (8 minutes)
      scaleMax: 14,
    },
  ] satisfies Metric[],
};

// ---------- ASK::SENSE (mock demo) ----------

export type SenseAnswer = {
  text: string;
  docHref: string;
  docLabel: string;
};

export const askSense = {
  eyebrow: '* LIVE DEMO · EACH::SENSE',
  headline: { line1: 'Tell us your AI', italic: 'chaos.', line2: 'We’ll show you the way out.' },
  body:
    'Type your actual problem. each::sense — our AI agent — reads it, gives you a 2–3 sentence answer, and links you straight to the part of the docs that solves it. No signup, no demo call.',
  inputPlaceholders: [
    'how do I track cost per customer…',
    'my model keeps failing at 3 AM…',
    'I need to A/B test two models in prod…',
    'finance asked for cost per user tier…',
    'rollback yesterday’s deploy…',
  ],
  chips: [
    'Model keeps failing',
    'Don’t know which model to pick',
    'How do I track cost per customer',
  ],
  /** Hardcoded answers for the chip labels. Anything else falls through to fallback. */
  answers: {
    'Model keeps failing': {
      text:
        'Set fallbacks once on each.run(). The router watches every call and spills traffic to a backup the moment your primary degrades. Recovery in ~120ms; your users never see the error.',
      docHref: '/docs/router/fallbacks',
      docLabel: 'each::router · fallbacks',
    },
    'Don’t know which model to pick': {
      text:
        'Use each::sense — same call signature, but you describe the result instead of naming a model. We pick (and re-pick) the best fit per call based on quality, latency, and cost.',
      docHref: '/docs/sense/overview',
      docLabel: 'each::sense · overview',
    },
    'How do I track cost per customer': {
      text:
        'Pass attributes at runtime (user_id, tier, anything). each::trace tags every call. Then slice cost, latency, and quality by any attribute in the dashboard — no instrumentation sprint.',
      docHref: '/docs/trace/attribution',
      docLabel: 'each::trace · attribution',
    },
  } satisfies Record<string, SenseAnswer>,
  fallback: {
    text:
      'We don’t have a canned answer for that one — but the live each::sense agent does. In production, this same input would call a real LLM and link you to the relevant doc.',
    docHref: '/docs/sense/overview',
    docLabel: 'each::sense · overview',
  } satisfies SenseAnswer,
  footnote: 'powered by each::sense (demo) · responses are mocked · no API call yet',
};

// ---------- TRUSTED BY ----------

export const trustedBy = {
  eyebrow: '* TRUSTED BY 120+ TEAMS IN PROD',
  customers: [
    'NOVA', 'Helix', 'LUME', 'Forma', 'Ondra', 'Kairo',
    'Aster', 'Volt', 'Prism', 'Maker', 'Orbit', 'Finch',
  ],
  stats: '20,000+ DEVS  ·  $1.2B SHIPPED  ·  4.3M PRODUCTION TRACES',
};

// ---------- CUSTOMER STORIES ----------

/** Inline highlight token used in headlines. `spark` segments render in spark color. */
export type HeadlineToken = { kind: 'plain' | 'spark'; text: string };

export type Avatar = {
  initials: string;
  /** Tailwind bg utility class — must use a brand-kit color */
  bg: string;
  /** Tailwind text utility class for the initials */
  text: string;
};

export type CaseStudy = {
  industry: string;
  headline: HeadlineToken[];
  quote: string;
  name: string;
  role: string;
  avatar: Avatar;
  href: string;
};

export const customerStories = {
  eyebrow: '* THE WORK',
  headline: { line1: 'They build product.', line2: 'We do the rest.' },
  body:
    'Five teams. Five different products. One thing in common — they spent their engineering hours on what users actually see.',

  caseStudies: [
    {
      industry: 'AI MOBILE APP STUDIO',
      headline: [
        { kind: 'plain', text: 'Cut AI costs ' },
        { kind: 'spark', text: '50%' },
        { kind: 'plain', text: '. Skipped a ' },
        { kind: 'spark', text: '5-engineer' },
        { kind: 'plain', text: ' build.' },
      ],
      quote:
        "Without each::labs we’d have built our own. That alone would’ve been a 3-to-5-person effort, just to keep up with a model landscape that keeps growing.",
      name: 'Selimhan Çakır',
      role: 'Founder & CEO · MobileOcean',
      avatar: { initials: 'SC', bg: 'bg-spark', text: 'text-bg' },
      href: '/customers',
    },
    {
      industry: 'GENERATIVE AI APP',
      headline: [
        { kind: 'spark', text: '10 models' },
        { kind: 'plain', text: ' in the time one deploy used to take.' },
      ],
      quote:
        "each::labs lifted the entire deployment burden from us. But what really keeps us is the partnership.",
      name: 'Furkan Sandal',
      role: 'CTO · PixelByte',
      avatar: { initials: 'FS', bg: 'bg-highlight', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CONSUMER AI PRODUCT',
      headline: [
        { kind: 'spark', text: '15 minutes' },
        { kind: 'plain', text: ' for a task that took 3 hours.' },
      ],
      quote:
        "A 2-to-3-hour AI task is done in 15 minutes. Product and marketing finally ship at the same pace.",
      name: 'Uğurcan Sevindik',
      role: 'Marketing Manager · DofaTech',
      avatar: { initials: 'US', bg: 'bg-sun', text: 'text-bg' },
      href: '/customers',
    },
    {
      industry: 'PERFORMANCE MARKETING',
      headline: [
        { kind: 'spark', text: '1,000' },
        { kind: 'plain', text: ' AI creatives a month. Zero models owned.' },
      ],
      quote:
        "The entire creative side of Wask runs on each::labs. Every new model update makes our work easier.",
      name: 'Umut Gül',
      role: 'AI Expert Specialist · Wask',
      avatar: { initials: 'UG', bg: 'bg-yellow', text: 'text-bg' },
      href: '/customers',
    },
    {
      industry: 'AI PRODUCT BUILDER',
      headline: [
        { kind: 'plain', text: 'Shipped their AI layer on ' },
        { kind: 'spark', text: 'day one' },
        { kind: 'plain', text: '.' },
      ],
      quote:
        "each::labs is the first AI partner we committed to. Direct access to the team keeps the work moving forward.",
      name: 'Ramazan Küçük',
      role: 'Product Manager · OAK',
      avatar: { initials: 'RK', bg: 'bg-emerald-600', text: 'text-white' },
      href: '/customers',
    },
  ] as CaseStudy[],

  ctaCard: {
    eyebrow: '* AND 120+ MORE TEAMS',
    headline: 'From AI consumer apps to enterprise growth teams.',
    body: 'Each one shipping faster because the boring parts already exist.',
    cta: 'Read all customer stories →',
    href: '/customers',
  },
};

// ---------- RABBIT HOLE ----------

export const rabbitHole = {
  eyebrow: '* THREE DOORS',
  headline: { line1: 'Welcome to the rabbit hole.', line2: 'Three ways down. All free until you ship.' },
  cards: [
    {
      eyebrow: '* TAKE THE LEAP',
      title: 'Sign up.',
      subline: 'API key in 60 seconds.',
      body: '10K free traces. No credit card. Cancel by deleting your key.',
      cta: { label: 'Follow the white rabbit →', href: '/signup', style: 'primary' as const },
    },
    {
      eyebrow: '* TAKE A HAND',
      title: 'Talk to an engineer.',
      subline: 'A real engineer. Not a sales-call.',
      body: 'We’ll show you how each::labs would fit your stack at your scale. Bring your hard questions.',
      cta: { label: 'Book 30 minutes →', href: '/contact', style: 'outline' as const },
    },
    {
      eyebrow: '* READ THE MAP',
      title: 'Skim the doc.',
      subline: 'Code samples and recipes.',
      body: 'Real workflows, real configurations, real production examples. Copy what fits.',
      cta: { label: 'Open the docs →', href: 'https://docs.eachlabs.ai/introduction', style: 'text' as const },
    },
  ],
  subtext: 'NO CREDIT CARD · NO "JUMP ON A QUICK CALL" · CANCEL BY DELETING YOUR API KEY',
};

// ---------- FOOTER ----------

export const footer = {
  tagline: 'The orchestration + observability layer for production AI.',
  city: 'San Francisco',
  columns: [
    {
      title: 'PRODUCT',
      links: [
        { label: 'each::router',     href: '/router' },
        { label: 'each::workflows',  href: '/workflows' },
        { label: 'each::enhancer',   href: '/enhancer' },
        { label: 'each::trace',      href: '/trace' },
        { label: 'Pricing',          href: '/pricing' },
      ],
    },
    {
      title: 'DEVELOPERS',
      links: [
        { label: 'Docs',          href: 'https://docs.eachlabs.ai/introduction' },
        { label: 'API reference', href: 'https://docs.eachlabs.ai/introduction' },
        { label: 'SDKs',          href: 'https://docs.eachlabs.ai/introduction' },
        { label: 'Changelog',     href: 'https://docs.eachlabs.ai/introduction' },
        { label: 'GitHub',        href: 'https://github.com/eachlabs' },
        { label: 'Status',        href: 'https://docs.eachlabs.ai/introduction' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'About',     href: '#' },
        { label: 'Customers', href: '/customers' },
        { label: 'Use cases', href: '/usecases' },
        { label: 'Blog',      href: '/blog' },
        { label: 'Careers',   href: '#' },
      ],
    },
    {
      title: 'CONNECT',
      links: [
        { label: 'Discord',     href: 'https://discord.gg/eachlabs' },
        { label: 'X / Twitter', href: 'https://x.com/eachlabs' },
        { label: 'LinkedIn',    href: 'https://www.linkedin.com/company/eachlabs' },
        { label: 'GitHub',      href: 'https://github.com/eachlabs' },
      ],
    },
  ],
  copyright: '© 2026 each::labs. All rights reserved.',
  status: '* 99.99% · all systems operational',
};

// ---------- EXPLORE ----------

export const explore = {
  eyebrow: '* THE CATALOG',
  heading: 'Explore models',
  filterTypes: ['ALL', 'IMAGE', 'VIDEO', 'AUDIO', '3D', 'UPSCALE', 'UTIL'],
  resultCount: 'SHOWING 35 OF 35+ MODELS · 600+ TOTAL IN CATALOG',
};
