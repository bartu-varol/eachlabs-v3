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
  items: { title: string; body: string }[];
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
          { title: 'each::router',    body: 'Model-aware fallbacks. Quality-aware routing.' },
          { title: 'each::workflows', body: 'Chain models. Version. Rollback.' },
          { title: 'each::sense',     body: 'Intelligent media generation, hosted.' },
        ],
      },
      {
        eyebrow: 'OBSERVE',
        items: [
          { title: 'each::trace', body: 'Per-call attribution. Slice cost, latency, quality.' },
          { title: 'each::ab',    body: 'Ship the winning model in one click.' },
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
          { title: 'Consumer AI',       body: 'Creative apps, social, gen UX.' },
          { title: 'Enterprise retail', body: 'Product photography, ad creative.' },
          { title: 'Internal AI apps',  body: 'Ops tooling, content for teams.' },
        ],
      },
      {
        eyebrow: 'BY TEAM',
        items: [
          { title: 'Marketing & brand', body: 'Campaign assets, brand creative.' },
          { title: 'Ad-tech & growth',  body: 'Programmatic ads, live A/B.' },
          { title: 'Gaming & live-ops', body: 'NPCs, VO, textures, music.' },
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
      { title: 'Docs',          href: '#' },
      { title: 'API reference', href: '#' },
      { title: 'SDKs',          href: '#' },
      { title: 'Changelog',     href: '#' },
      { title: 'GitHub',        href: '#' },
      { title: 'Discord',       href: '#' },
      { title: 'Status',        href: '#' },
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
  { label: 'Customers',  href: '#' },
  { label: 'Pricing',    href: '#' },
  { label: 'Developers', menu: 'developers' },
];

// ---------- HERO ----------

export const hero = {
  pill: '* SERIES A · $18M LED BY EBRD',
  pillCta: 'Read the memo →',
  body:
    '600+ AI models behind one API. Auto-fallback when models break. Per-call tracing. Live A/B. You write each.run() — we do the rest.',
  ctas: [
    { label: 'Get an API key →',     href: '/signup',         variant: 'primary'   as const },
    { label: 'Talk to an engineer',  href: '/contact',        variant: 'secondary' as const },
    { label: 'Read the cookbook',    href: '/docs/cookbook',  variant: 'tertiary'  as const },
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

// ---------- TRUSTED BY ----------

export const trustedBy = {
  eyebrow: '* TRUSTED BY 120+ TEAMS IN PROD',
  customers: [
    'NOVA', 'Helix', 'LUME', 'Forma', 'Ondra', 'Kairo',
    'Aster', 'Volt', 'Prism', 'Maker', 'Orbit', 'Finch',
  ],
  stats: '20,000+ DEVS  ·  $1.2B SHIPPED  ·  4.3M PRODUCTION TRACES',
};

// ---------- ASK THE AI ----------

export const askAI = {
  eyebrow: '* STILL DECIDING?',
  headline: { line1: 'Do what everyone else does.', line2: 'Ask the AI.' },
  body: "We're in their training data. Ask away.",
  prompt: "Be honest about each::labs (eachlabs.ai). What do they do, who's it for, and what's the catch?",
  footnote: "We don't see what they say. They don't see this page. Honest.",
};

// ---------- THREE WAYS IN ----------

export type TwayCard = {
  product: string;
  cardHeadline: string;
  tags: string[];
  cta: { label: string; href: string };
};

export const threeWaysIn = {
  eyebrow: '* THE PLATFORM',
  headline: { line1: 'Three ways in.', line2: 'Same backbone.' },
  body:
    'Pick the level of abstraction that fits your team. Switch later — your data and workflows come with you.',
  cards: [
    {
      product: 'api',
      cardHeadline: 'You pick the model. We handle the rest.',
      tags: ['200+ models', 'async + webhooks', 'price-matched'],
      cta: { label: 'Read the API docs →', href: 'https://docs.eachlabs.ai/api/overview' },
    },
    {
      product: 'workflows',
      cardHeadline: 'You design the pipeline. We run every step.',
      tags: ['chain & branch', 'versioning', '10× bulk runs'],
      cta: { label: 'See workflow examples →', href: 'https://docs.eachlabs.ai/workflows/overview' },
    },
    {
      product: 'sense',
      cardHeadline: 'Just describe the result. We pick the model.',
      tags: ['OpenAI-compatible', '500+ models', 'auto-routed'],
      cta: { label: 'Try each::sense →', href: 'https://docs.eachlabs.ai/sense/overview' },
    },
  ] as TwayCard[],
  pipelineStrip: 'ROUTE  ·  RETRY  ·  FALLBACK  ·  TRACE  ·  MONITOR',
  pipelineCaption: 'Same backbone behind all three.',
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

// ---------- COMPARISON ----------

export const comparison = {
  eyebrow: '* THE RECEIPTS',
  headline: { left: 'Without each::labs.', right: 'With each::labs.' },
  rows: [
    {
      anchor: 'Model goes down at 3 AM.',
      without: 'PagerDuty fires. You wake up. Debug. Redeploy. Sleep at 5.',
      with: 'Auto-fallback kicks in. You sleep. Read the trace tomorrow.',
    },
    {
      anchor: 'Veo 3 launches.',
      without: 'You write a new integration. QA it. Ship in two weeks.',
      with: 'You change one string. Ship today.',
    },
    {
      anchor: 'Finance asks “cost per user tier?”',
      without: 'You spend a sprint instrumenting.',
      with: 'You open the dashboard.',
    },
    {
      anchor: 'You want to A/B test a model.',
      without: 'First, build an A/B framework.',
      with: 'Set the split percentage.',
    },
    {
      anchor: 'Workflow fails on step 3 of 4.',
      without: 'You pay for steps 1–2. User sees an error.',
      with: 'Auto-retry with state. User sees output.',
    },
    {
      anchor: 'A new OpenAI model drops.',
      without: 'Wait 2 weeks for the SDK.',
      with: 'We onboard it in 24h.',
    },
  ],
  closer: 'Same job. Same tools. Different week.',
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
      cta: { label: 'Get an API key →', href: '/signup', style: 'primary' as const },
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
      title: 'Skim the cookbook.',
      subline: 'Code samples and recipes.',
      body: 'Real workflows, real configurations, real production examples. Copy what fits.',
      cta: { label: 'Open the docs →', href: '/docs/cookbook', style: 'text' as const },
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
        { label: 'each::router',    href: '#' },
        { label: 'each::trace',     href: '#' },
        { label: 'each::workflows', href: '#' },
        { label: 'each::ab',        href: '#' },
        { label: 'each::sense',     href: '#' },
        { label: 'Pricing',         href: '#' },
      ],
    },
    {
      title: 'DEVELOPERS',
      links: [
        { label: 'Docs',          href: '#' },
        { label: 'API reference', href: '#' },
        { label: 'SDKs',          href: '#' },
        { label: 'Changelog',     href: '#' },
        { label: 'Status',        href: '#' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'About',     href: '#' },
        { label: 'Customers', href: '#' },
        { label: 'Blog',      href: '#' },
        { label: 'Brand',     href: '#' },
        { label: 'Careers',   href: '#' },
      ],
    },
    {
      title: 'CONNECT',
      links: [
        { label: 'Discord',     href: '#' },
        { label: 'X / Twitter', href: '#' },
        { label: 'LinkedIn',    href: '#' },
        { label: 'GitHub',      href: '#' },
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
