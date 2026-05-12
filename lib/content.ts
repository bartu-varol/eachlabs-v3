// All copy lives here. Edit copy by editing this file.

export const ticker = [
  '* WE DO THE BORING PARTS',
  '* 99.99% UPTIME · 284K REQ/24H',
  '* THE MODEL THAT BROKE YESTERDAY? STILL SHIPPING',
  '* 600+ MODELS · 4 MODALITIES · 1 API',
  '* NO 3AM PAGES (ASK YOUR ON-CALL)',
];

// ---------- NAV ----------

export type MegaColumn = {
  eyebrow: string;
  items: {
    title: string;
    body: string;
    href: string;
    /** Mark this item as coming-soon, adds a small badge in the megamenu. */
    comingSoon?: boolean;
  }[];
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

export const megaMenus: Record<'platform' | 'developers', MegaMenu> = {
  platform: {
    columns: [
      {
        eyebrow: 'THE PLATFORM',
        items: [
          { title: 'each::router',    body: 'Model-aware fallbacks. Quality-aware routing.', href: '/router' },
          { title: 'each::workflows', body: 'Chain models. Version. Rollback.',              href: '/workflows' },
          { title: 'each::enhancer',  body: '12× fewer errors. Same model. Same call.',     href: '/enhancer' },
        ],
      },
      {
        eyebrow: 'BROWSE',
        items: [
          { title: 'Explore the catalog', body: '600+ models behind one API. Image, video, audio, 3D.', href: '/explore' },
          { title: 'Customer stories',    body: 'How teams ship faster on each::labs.',                  href: '/customers' },
          { title: 'Pricing',             body: 'Start free. Pay when retention pays off.',              href: '/pricing' },
        ],
      },
    ],
    featured: {
      eyebrow: '* THIS WEEK',
      title: 'each::router 1.4, quality-aware spill',
      body: 'We now route around quality degradations, not just failures.',
      link: 'Read more →',
    },
  },
  developers: {
    columns: [
      {
        eyebrow: 'BUILD',
        items: [
          { title: 'Docs',          body: 'Concepts, recipes, the full reference.', href: 'https://docs.eachlabs.ai/introduction' },
          { title: 'API reference', body: 'Every endpoint. Every param. Live examples.', href: 'https://docs.eachlabs.ai/introduction' },
          { title: 'SDKs',          body: 'TypeScript · Python · Go · Rust.', href: 'https://docs.eachlabs.ai/introduction' },
          { title: 'Changelog',     body: 'What shipped this week. And last.', href: 'https://docs.eachlabs.ai/introduction' },
        ],
      },
      {
        eyebrow: 'COMMUNITY',
        items: [
          { title: 'GitHub',  body: 'Source, examples, issues.', href: 'https://github.com/eachlabs' },
          { title: 'Discord', body: 'Ship-talk, support, drama-free.', href: 'https://discord.gg/eachlabs' },
          { title: 'Status',  body: '99.99% · all systems operational.', href: 'https://docs.eachlabs.ai/introduction' },
        ],
      },
    ],
    featured: {
      eyebrow: '* NEW',
      title: 'TypeScript SDK 2.0, typed workflows + streaming',
      body: 'Workflow IDs are now type-safe at build time. Streaming responses without ceremony.',
      link: 'See the upgrade →',
    },
  },
};

export type NavItem =
  | { label: string; menu: 'platform' | 'developers'; href?: string }
  | { label: string; href: string };

export const navItems: NavItem[] = [
  { label: 'Platform',   menu: 'platform', href: '/platform' },
  { label: 'Explore',    href: '/explore' },
  { label: 'Customers',  href: '/customers' },
  { label: 'Pricing',    href: '/pricing' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'Developers', menu: 'developers' },
];

// ---------- HERO ----------

export const hero = {
  pill: '',
  pillCta: '',
  /** Body lead, large, the hook. */
  bodyLead: '600+ AI models behind one API',
  /** Body rest, descriptive, with playful flair. */
  body:
    '- the hyped ones, the cheap ones, the one that broke yesterday. We do the boring parts: retries when models go down, per-user cost when finance asks, live A/B when product wants to ship. You write each.run(). We do the rest.',
  ctas: [
    { label: 'Follow the white rabbit',         href: '/signup',  variant: 'primary'   as const },
    { label: 'Talk to an engineer (a real one)',   href: '/contact', variant: 'secondary' as const },
  ],
  /** Stats bar, 4 numbers each with a one-line cheeky sub. */
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
  belowEscape: { prefix: 'Don’t see your problem?', linkLabel: 'Talk to an engineer →', href: 'mailto:support@eachlabs.ai' },
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
  /** Headline winner number, e.g. "97×" + "FEWER ERRORS" */
  hero: { multiplier: string; suffix: string };
  /** Side labels */
  others: { label: string; sub: string };
  each: { label: string; sub: string };
  /** Numeric values used for bars + count-up. `inverse` = lower is better. */
  format: 'percent' | 'time' | 'usd' | 'days';
  othersValue: number;
  eachValue: number;
  /** What "filled" bar represents, visual scaling reference */
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
      each:   { label: 'EACH.RUN', sub: 'router failover · live' },
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
  eyebrow: '* LIVE DEMO',
  headline: { line1: 'Tell us your AI', italic: 'chaos.', line2: 'We’ll show you the way out.' },
  body:
    'Type your actual problem. Our AI agent reads it, gives you a short answer, and links you straight to the part of the docs that solves it. No signup, no sales call.',
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
        'Describe the result you want instead of naming a model. We pick (and re-pick) the best fit per call based on quality, latency, and cost.',
      docHref: 'https://docs.eachlabs.ai/introduction',
      docLabel: 'each::labs · model picking',
    },
    'How do I track cost per customer': {
      text:
        'Pass attributes at runtime (user_id, tier, anything) on each.run(). Every call is tagged at the platform layer; the dashboard slices cost, latency, and quality by any attribute in real time, no instrumentation sprint.',
      docHref: 'https://docs.eachlabs.ai/introduction',
      docLabel: 'each::labs · attribution',
    },
  } satisfies Record<string, SenseAnswer>,
  fallback: {
    text:
      'We don’t have a canned answer for that one, but the live agent does. In production, this same input calls a real LLM and links you to the relevant doc.',
    docHref: 'https://docs.eachlabs.ai/introduction',
    docLabel: 'each::labs · docs',
  } satisfies SenseAnswer,
  footnote: '',
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
  /** Tailwind bg utility class, must use a brand-kit color */
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
  eyebrow: '* TESTIMONIALS',
  headline: { line1: 'Trusted by product teams', line2: 'building with AI.' },
  body:
    'Ten teams. Different products. One thing in common, they spent their engineering hours on what users actually see, not on plumbing AI infrastructure.',

  caseStudies: [
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'spark', text: '24/7' },
        { kind: 'plain', text: ' hands-on technical support.' },
      ],
      quote:
        'We work with Eachlabs on selected products where flexibility, speed, and stability matter most. Their 24/7 support during critical moments has been especially valuable, knowing that there is always a responsive and technically capable team available gives us operational confidence while scaling.',
      name: 'Aziz Gündoğdu',
      role: 'Scate',
      avatar: { initials: 'AG', bg: 'bg-spark', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'spark', text: 'Solution-oriented' },
        { kind: 'plain', text: ' and responsive.' },
      ],
      quote:
        'We work with Eachlabs because their team is highly solution-oriented and responsive, and we always receive quick support. Their APIs are also reliable and stable in production.',
      name: 'Osman Bahar',
      role: 'Byterise',
      avatar: { initials: 'OB', bg: 'bg-highlight', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'spark', text: 'Developer-friendly' },
        { kind: 'plain', text: ' API usage.' },
      ],
      quote:
        'Working with the each::labs team has been a genuinely great experience. Their communication is fast, friendly, and truly helpful. The feedback process feels collaborative rather than formal, like you’re actually building something together. They really understand developers and make everything smoother, we genuinely love each::labs!',
      name: 'Furkan Sandal',
      role: 'PixelByte',
      avatar: { initials: 'FS', bg: 'bg-success', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'plain', text: 'More like a ' },
        { kind: 'spark', text: 'technical partner' },
        { kind: 'plain', text: '.' },
      ],
      quote:
        'The top two features I always highlight are the workflows and the model comparison tool. Their workflow templates are truly unique they help you see trends, understand what works, and build a great final result quickly. And the model comparison feature makes it incredibly easy to test different models and instantly find the one that performs best.',
      name: 'Osman Menci',
      role: 'Yoya Mobile',
      avatar: { initials: 'OM', bg: 'bg-ember', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'plain', text: 'Powering AI with the ' },
        { kind: 'spark', text: 'right models' },
        { kind: 'plain', text: '.' },
      ],
      quote:
        'We use each::labs’ infrastructure to power the AI models in our applications. Their deep expertise in AI model market allows us to deliver the most up-to-date, highest-quality, and fastest models to our users.',
      name: 'Ekin Dursun',
      role: 'Pixel Wizard',
      avatar: { initials: 'ED', bg: 'bg-sun', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'plain', text: 'Where ' },
        { kind: 'spark', text: 'reliability' },
        { kind: 'plain', text: ' meets ' },
        { kind: 'spark', text: 'simplicity' },
        { kind: 'plain', text: '.' },
      ],
      quote:
        'each::labs is our choice because it’s reliable, easy to integrate, and incredibly user-friendly. Their strong support team resolves issues instantly, providing a stable and convenient experience.',
      name: 'Gökçe Oğuz',
      role: 'baby.ai',
      avatar: { initials: 'GO', bg: 'bg-yellow', text: 'text-bg' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'spark', text: 'One integration' },
        { kind: 'plain', text: ' for every AI model.' },
      ],
      quote:
        'each::labs gives us a single integration for a large range of Gen AI models. Integrating each AI model seperately would be wasting time and effort unnecessarily. With each::labs we are moving faster, test different model and scale our application efficiently.',
      name: 'Fatih Güler',
      role: 'Kata Technology',
      avatar: { initials: 'FG', bg: 'bg-spark', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'plain', text: 'More like a ' },
        { kind: 'spark', text: 'partner in AI creative' },
        { kind: 'plain', text: '.' },
      ],
      quote:
        'The most important reason for working with each::labs is their ability to effectively address our needs in AI creative production and editing. In our industry, creating creative solutions tailored to the needs and expectations of advertisers is crucial. In this regard, each::labs’ fast and diverse services allow us to continuously improve the “AI Creative” aspect of our product.',
      name: 'Umut Gül',
      role: 'Wask',
      avatar: { initials: 'UG', bg: 'bg-highlight', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'spark', text: 'Multi-model AI' },
        { kind: 'plain', text: ', simplified at scale.' },
      ],
      quote:
        'We’re working with each::labs to power our consumer application with 1M+ downloads. We depend on many different models for different tasks, and each::labs makes it so easy to tackle this.',
      name: 'Cihat İmamoğlu',
      role: 'JoyoLabs',
      avatar: { initials: 'Cİ', bg: 'bg-success', text: 'text-white' },
      href: '/customers',
    },
    {
      industry: 'CUSTOMER STORY',
      headline: [
        { kind: 'spark', text: 'Flexible AI workflows' },
        { kind: 'plain', text: ', optimized costs.' },
      ],
      quote:
        'Flexible workflow feature allows us to combine and use multiple models within a single generation workflow, which gives us much more flexibility when designing the product experience. each::labs’ pricing helps us optimize costs while still giving us access to a wide range of models and capabilities.',
      name: 'Selimhan Çakır',
      role: 'MobileOcean',
      avatar: { initials: 'SÇ', bg: 'bg-ember', text: 'text-white' },
      href: '/customers',
    },
  ] as CaseStudy[],

  ctaCard: {
    eyebrow: '* AND 120+ MORE TEAMS',
    headline: 'Consumer apps and enterprise platforms ship on the same API.',
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
      cta: { label: 'Follow the white rabbit', href: '/signup', style: 'primary' as const },
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
        { label: 'Router',     href: '/router' },
        { label: 'Workflows',  href: '/workflows' },
        { label: 'Enhancer',   href: '/enhancer' },
        { label: 'Pricing',    href: '/pricing' },
        { label: 'Enterprise', href: '/enterprise' },
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
        { label: 'Enterprise', href: '/enterprise' },
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

// ---------- ENTERPRISE ----------

export const enterprise = {
  hero: {
    pill: '* ENTERPRISE · WRITTEN BY THE ON-CALL',
    pillCta: '',
    pillHref: '',
    headline: {
      line1: 'Production AI ',
      line1Underline: 'without',
      line2Prefix: 'the',
      line2Emph: '3 AM phone call.',
    },
    body:
      'You already orchestrate around model failures, leaking budgets, and provider drift. Pay us, and the on-call shifts to our team. ',
    bodyLead:
      'Same each.run(). Direct line to engineering, traceable spend, and a router that catches failures before pagerduty does. ',
    ctas: [
      { label: 'Talk to an engineer (a real one)', href: '/contact', variant: 'primary'   as const },
      { label: 'See how the router works',         href: '/router',  variant: 'secondary' as const },
    ],
    stats: [
      { value: '99.99%',  label: 'effective uptime',     sub: 'across the routed path' },
      { value: '<120ms',  label: 'failover overhead',    sub: 'before your user notices' },
      { value: '24/7',    label: 'engineer-led support', sub: 'no BDRs · no tier-1 queue' },
      { value: '<24h',    label: 'incident response',    sub: 'written. signed. shared.' },
    ],
    subtext: '600+ MODELS · ONE API · DIRECT-TO-ENGINEERING SUPPORT',
  },

  /** "What enterprise actually means" comparison, kills the competitors. */
  meansWhat: {
    eyebrow: '* THE WORD "ENTERPRISE"',
    headline: {
      line1: 'Everyone says enterprise.',
      line2: 'We wrote down what ours means.',
    },
    body:
      'Most platforms hide enterprise behind a sales call. The page promises "SLA," "support," "security." What you actually get arrives in the MSA, three weeks later. Here is ours, on this page, in plain English.',
    rows: [
      {
        topic: 'Support',
        others: 'A shared inbox. Tier-1 reads from a playbook.',
        ours: 'A direct Slack channel with the engineers who built the router. P1 acknowledged the same business day.',
      },
      {
        topic: 'Uptime',
        others: '"99.9%" with no definition of "downtime" and no penalty schedule.',
        ours: '99.99% effective uptime across the routed path. Failover catches provider outages before your users do.',
      },
      {
        topic: 'Incident response',
        others: 'A status page tweet. RCA "available on request."',
        ours: 'Written RCA within 24h on every customer-impacting incident. Root cause, blast radius, fix, prevention.',
      },
      {
        topic: 'Data',
        others: '"Your data is yours." Sub-processor list available "on request."',
        ours: 'Zero retention by default. Provider-side retention disabled per request. We never train on your traffic.',
      },
      {
        topic: 'Procurement',
        others: 'Sales-led, six weeks to MSA, "we don\'t share our security docs."',
        ours: 'Custom MSA / DPA / security review on request, handled directly by engineering, not a sales handoff.',
      },
      {
        topic: 'Pricing',
        others: 'Bundle pricing. Inference markup hidden inside the platform fee.',
        ours: 'Provider price is provider price. Zero markup on inference. You pay us for the platform.',
      },
    ],
  },

  /** 6 capabilities, each with "why this exists" instead of generic bullet. */
  capabilities: {
    eyebrow: '* WHAT YOU ACTUALLY GET',
    headline: {
      line1: 'The capabilities.',
      line2: 'And why each one exists.',
    },
    tiles: [
      {
        accent: 'spark' as const,
        title: 'Quality-aware failover',
        body:
          'Every call is watched on quality, latency, and error rate. When the primary degrades, traffic spills to a healthy fallback in under 120ms, before your user notices.',
        why: 'This is the product. The same router you use in production.',
      },
      {
        accent: 'highlight' as const,
        title: '600+ models behind one API',
        body:
          'Kling, Veo, FLUX, ElevenLabs, OpenAI, and every other provider worth shipping. One signature, one bill, one trace. Swap models without rewriting a call site.',
        why: 'You shouldn\'t pin your roadmap to a single provider\'s pricing.',
      },
      {
        accent: 'success' as const,
        title: 'Per-call traces + cost attribution',
        body:
          'Every each.run() emits a trace, every step, every fallback, every cost. Tag with user_id, tier, experiment; slice spend in the dashboard.',
        why: 'Finance asks who is expensive. The trace answers without an instrumentation sprint.',
      },
      {
        accent: 'sun' as const,
        title: 'Zero retention by default',
        body:
          'We don\'t store prompts or outputs past what you need for traces. Provider-side retention is opt-in per provider. We never train on your traffic.',
        why: 'Default-private is cheaper than auditing a permission you forgot you granted.',
      },
      {
        accent: 'ember' as const,
        title: 'Engineering-led onboarding',
        body:
          'A founding-team engineer walks your stack through integration, fallback design, and trace setup. Slack channel stays open afterward.',
        why: 'The shortest path from "we want this in prod" to actually in prod.',
      },
      {
        accent: 'yellow' as const,
        title: 'Volume commits + custom terms',
        body:
          'Commit to monthly inference volume and the platform fee drops. Custom MSA / DPA / security review handled by engineering, not a sales handoff.',
        why: 'Procurement should be a one-meeting problem, not a quarter.',
      },
    ],
  },

  /** The 3AM Promise, brand voice meets enterprise. */
  threeAm: {
    eyebrow: '* THE 3 AM PROMISE',
    headline: {
      line1: 'When your model dies at 3 AM,',
      line2: 'our on-call wakes up.',
      line3: 'Yours doesn\'t.',
    },
    body:
      'No platform stops models from breaking. We are the difference between "user sees nothing" and "founder gets a 3 AM page." Here is the protocol, verbatim.',
    steps: [
      {
        time: 'T+0ms',
        title: 'Primary model fails.',
        body: 'Provider returns 5xx, timeout, or degraded quality (per-call signal). Router catches it before the SDK returns.',
      },
      {
        time: 'T+~120ms',
        title: 'Failover to fallback.',
        body: 'Quality-aware route picks the next-best healthy model. User sees a response. No retry storm, no half-cached corpses.',
      },
      {
        time: 'T+~30s',
        title: 'Our on-call gets paged.',
        body: 'Senior engineer on PagerDuty. Your stack lit a fire; ours is already at the console. You are still asleep.',
      },
      {
        time: 'T+<24h',
        title: 'Written RCA in your inbox.',
        body: 'Root cause, blast radius, fix, prevention. Signed by the engineer who handled it. Before you ask.',
      },
    ],
    footnote:
      'IF THE FALLBACK ITSELF FAILS, OUR ON-CALL HANDLES IT BEFORE YOURS DOES. THE RCA LANDS IN YOUR INBOX BY THE END OF THE NEXT BUSINESS DAY.',
  },

  /** 3 deep customer outcomes, numbers, not logos. */
  outcomes: {
    eyebrow: '* OUTCOMES, NOT LOGOS',
    headline: {
      line1: 'What "enterprise"',
      line2: 'looks like in production.',
    },
    cards: [
      {
        industry: 'CONSUMER AI · MILLIONS OF USERS',
        metric: '14',
        metricLabel: 'model swaps',
        secondary: 'zero user-visible regressions',
        body:
          'Hot-swapped fourteen image and video models across two providers without a single user-visible regression. Their on-call hasn\'t been paged for inference in two quarters.',
        contract: 'Failover routing · trace per call · engineering Slack',
      },
      {
        industry: 'FINTECH · STRICT CHANGE CONTROL',
        metric: '0',
        metricLabel: 'inference-layer issues',
        secondary: 'two internal reviews · clean',
        body:
          'Standardized on one each.run() signature across teams, locked the trace schema to their data warehouse, and disabled provider-side retention end-to-end. Internal reviews flagged zero issues on the inference layer.',
        contract: 'Trace export · provider retention off · review-ready',
      },
      {
        industry: 'AD-TECH · BILLION+ REQ/MO',
        metric: '$340K',
        metricLabel: 'monthly inference savings',
        secondary: 'same quality · 3 providers · 1 API',
        body:
          'Quality-aware routing pulled traffic toward the cheapest healthy provider per request type. No engineer changed code; each::router did the arithmetic. Procurement team noticed first.',
        contract: 'Volume pricing · cost attribution · quarterly reviews',
      },
    ],
  },

  /** Architecture diagram, text-based but reads like a real wire. */
  architecture: {
    eyebrow: '* THE WIRE',
    headline: {
      line1: 'How traffic moves.',
      line2: 'One call. One trace. Direct to providers.',
    },
    body:
      'The boring diagram every architect asks for. each.run() hits the router, the router talks to the provider you actually need, and a per-call trace lands in your dashboard. No retraining, no rewrites.',
    nodes: [
      {
        label: 'Your app',
        sub: 'each.run() · same signature',
        kind: 'client',
      },
      {
        label: 'each::router',
        sub: 'quality-aware · auto-failover · <120ms',
        kind: 'router',
      },
      {
        label: 'Provider A · B · C',
        sub: 'direct connections · zero retention by default',
        kind: 'providers',
      },
    ],
    sidecars: [
      {
        title: 'Per-call trace',
        body: 'Step, status, cost, latency · queryable for 30 days',
      },
      {
        title: 'Attribute tagging',
        body: 'user_id · tier · experiment · slice spend by anything',
      },
      {
        title: 'Engineering on-call',
        body: 'Senior engineer paged on every customer-impacting incident',
      },
    ],
  },

  /** Procurement assets, available on request from engineering, not gated by sales. */
  procurement: {
    eyebrow: '* THE BORING DOCUMENTS',
    headline: {
      line1: 'Procurement docs,',
      line2: 'one email away.',
    },
    body:
      'We don\'t hide the paperwork behind a sales call. Email the engineering team, your security or legal counterpart gets a direct reply, usually same business day.',
    assets: [
      {
        title: 'Security review',
        sub: 'Architecture, retention, sub-processors, in one document',
        cta: 'Request under NDA',
        href: 'mailto:support@eachlabs.ai?subject=Security%20review%20request',
      },
      {
        title: 'Sub-processor list',
        sub: 'Current providers and their role · updated as we add models',
        cta: 'Request the list →',
        href: 'mailto:support@eachlabs.ai?subject=Sub-processor%20list',
      },
      {
        title: 'DPA',
        sub: 'GDPR Article 28 template · we counter-sign · usually <1 week',
        cta: 'Request the DPA →',
        href: 'mailto:support@eachlabs.ai?subject=DPA%20request',
      },
      {
        title: 'Custom MSA',
        sub: 'Standard template · redlines welcome · handled by engineering',
        cta: 'Start the redlines',
        href: 'mailto:support@eachlabs.ai?subject=MSA%20redlines',
      },
      {
        title: 'Uptime + incident process',
        sub: 'How we run on-call, what counts as a P1, and how we report it',
        cta: 'Read the process →',
        href: '/contact',
      },
      {
        title: 'Pricing terms',
        sub: 'Volume commitments, platform fee tiers, payment terms',
        cta: 'Talk to engineering',
        href: '/contact',
      },
    ],
    note:
      'NOTHING HERE IS BEHIND "JUMP ON A QUICK CALL." YOUR PROCUREMENT TEAM IS WELCOME.',
  },

  /** FAQ tuned to senior-engineer / head-of-AI worries. */
  faq: {
    eyebrow: '* WHAT THEY ACTUALLY ASK',
    headline: 'The questions the procurement form won\'t fit.',
    items: [
      {
        q: 'How is this not just another vendor in the middle?',
        a: 'We bill on the platform, not the inference, your provider invoices stay direct. The router watches every call but doesn\'t store prompts or outputs by default; only traces stay around so you can debug.',
      },
      {
        q: 'What happens if each::labs goes down?',
        a: 'The router caches its policy locally and keeps routing on the last-known-good config so your inference doesn\'t depend on our control plane being up. Same model providers, same direct connections.',
      },
      {
        q: 'Can we negotiate uptime + custom terms?',
        a: 'Yes. Talk to engineering at /contact, we walk through your traffic shape, sketch the failover topology, and put real numbers on a one-page agreement. No sales cycle.',
      },
      {
        q: 'Do you train on our prompts or outputs?',
        a: 'No. We don\'t store prompts or outputs past what you opt into for traces, and we never train models on your traffic. Provider-side retention is opt-in per provider and disabled by default for production accounts.',
      },
      {
        q: 'How do we exit if it isn\'t working?',
        a: 'each.run() is a thin wrapper. Remove our SDK, point at providers directly, your code is portable. Traces are exportable. We keep nothing after termination + 30 days.',
      },
      {
        q: 'Who answers when something breaks?',
        a: 'A founding-team engineer, every time. Direct Slack channel for accounts on a custom plan; same-day email otherwise. No tier-1 queue, no scripted demos.',
      },
    ],
  },

  /** Final CTA, vortex-backed, but a sharper card stack than RabbitHole. */
  finalCta: {
    eyebrow: '* TWO WAYS IN',
    headline: {
      line1: 'Talk to an engineer.',
      line2: 'Not a salesperson.',
    },
    body:
      'The first call is with a senior engineer who reviews your architecture, your traffic shape, your compliance posture. They will quote an SLA tier, a deployment model, and a price. If we can\'t help, we say so on the call.',
    primary: { label: 'Book 30 minutes with engineering', href: '/contact', style: 'primary' as const },
    secondary: { label: 'Email security@eachlabs.ai',     href: 'mailto:security@eachlabs.ai', style: 'outline' as const },
    subtext: 'TYPICAL ENTERPRISE TIMELINE: KICKOFF TO PROD IN 3 WEEKS · LEGAL IN 5 BUSINESS DAYS',
  },
};

// ---------- EXPLORE ----------

export const explore = {
  eyebrow: '* THE CATALOG',
  heading: 'Explore models',
  filterTypes: ['ALL', 'IMAGE', 'VIDEO', 'AUDIO', '3D', 'UPSCALE', 'UTIL'],
  resultCount: 'SHOWING 35 OF 35+ MODELS · 600+ TOTAL IN CATALOG',
};
