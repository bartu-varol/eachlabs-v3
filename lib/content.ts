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
          { title: 'Changelog',     body: 'What shipped this week. And last.', href: '/changelog' },
        ],
      },
      {
        eyebrow: 'COMMUNITY',
        items: [
          { title: 'GitHub',  body: 'Source, examples, issues.', href: 'https://github.com/eachlabs' },
          { title: 'Discord', body: 'Ship-talk, support, drama-free.', href: 'https://discord.gg/eachlabs' },
          { title: 'Status',  body: '99.99% · all systems operational.', href: 'https://docs.eachlabs.ai/introduction' },
          { title: 'Blog',    body: 'Field notes & dispatches.', href: '/blog' },
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
    { label: 'Start Building',         href: '/signup',  variant: 'primary'   as const },
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
  /**
   * Portrait of the person, square, served from /public/customers/photos/.
   * Initials block renders only when the file fails to load.
   */
  photo?: string;
};

/**
 * Company mark shown under the customer name. Intrinsic dimensions are needed
 * because the source files vary widely (some 90×60, some 750×180) and the
 * card uses object-contain inside a fixed-height row.
 */
export type CompanyLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseStudy = {
  industry: string;
  headline: HeadlineToken[];
  quote: string;
  name: string;
  /** Company name, shown as a fallback when the logo asset is missing */
  role: string;
  avatar: Avatar;
  logo: CompanyLogo;
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
      avatar: { initials: 'AG', bg: 'bg-spark', text: 'text-white', photo: '/customers/photos/aziz-gundogdu.jpg' },
      logo: { src: '/customers/logos/scate.svg', alt: 'Scate', width: 93, height: 62 },
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
      avatar: { initials: 'OB', bg: 'bg-highlight', text: 'text-white', photo: '/customers/photos/osman-bahar.png' },
      logo: { src: '/customers/logos/byterise.svg', alt: 'Byterise', width: 147, height: 23 },
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
      avatar: { initials: 'FS', bg: 'bg-success', text: 'text-white', photo: '/customers/photos/furkan-sandal.png' },
      logo: { src: '/customers/logos/pixelbyte.svg', alt: 'PixelByte', width: 113, height: 32 },
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
      avatar: { initials: 'OM', bg: 'bg-ember', text: 'text-white', photo: '/customers/photos/osman-menci.png' },
      logo: { src: '/customers/logos/yoya.png', alt: 'Yoya Mobile', width: 616, height: 247 },
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
      avatar: { initials: 'ED', bg: 'bg-sun', text: 'text-white', photo: '/customers/photos/ekin-dursun.jpeg' },
      logo: { src: '/customers/logos/pixelwizard.png', alt: 'Pixel Wizard', width: 346, height: 53 },
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
      avatar: { initials: 'GO', bg: 'bg-yellow', text: 'text-bg', photo: '/customers/photos/gokce-oguz.svg' },
      logo: { src: '/customers/logos/baby.png', alt: 'baby.ai', width: 129, height: 37 },
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
      avatar: { initials: 'FG', bg: 'bg-spark', text: 'text-white', photo: '/customers/photos/fatih-guler.svg' },
      logo: { src: '/customers/logos/kata.png', alt: 'Kata Technology', width: 289, height: 36 },
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
      avatar: { initials: 'UG', bg: 'bg-highlight', text: 'text-white', photo: '/customers/photos/umut-gul.svg' },
      logo: { src: '/customers/logos/wask.png', alt: 'Wask', width: 468, height: 124 },
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
      avatar: { initials: 'Cİ', bg: 'bg-success', text: 'text-white', photo: '/customers/photos/cihat-imamoglu.svg' },
      logo: { src: '/customers/logos/joyolabs.png', alt: 'JoyoLabs', width: 752, height: 180 },
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
      avatar: { initials: 'SÇ', bg: 'bg-ember', text: 'text-white', photo: '/customers/photos/selimhan-cakir.svg' },
      logo: { src: '/customers/logos/mobileocean.svg', alt: 'MobileOcean', width: 232, height: 42 },
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
        { label: 'Changelog',     href: '/changelog' },
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
    {
      title: 'RESOURCES',
      links: [
        { label: 'Contact Us',        href: '/contact-us' },
        { label: 'Brand Kit',         href: '/brand' },
        { label: 'Privacy Policy',    href: '/privacy-policy' },
        { label: 'Terms of Service',  href: '/terms-of-service' },
      ],
    },
  ],
  copyright: '© 2026 each::labs. All rights reserved.',
  status: '* 99.99% · all systems operational',
};

// ---------- ENTERPRISE ----------

export const enterprise = {
  hero: {
    pill: '* ENTERPRISE READY',
    pillCta: '',
    pillHref: '',
    headline: {
      line1: 'Run AI at scale.',
      line1Underline: 'without',
      line2Prefix: '',
      line2Emph: 'losing sleep over it.',
    },
    body:
      'For CTOs and engineering leaders shipping AI in production. ',
    bodyLead:
      'We are already handling millions of requests across hundreds of teams, with security and uptime that keep your platform online while you scale. ',
    ctas: [
      { label: 'Talk to engineering', href: '/contact', variant: 'primary' as const },
    ],
    stats: [
      { value: '1M+',     label: 'requests handled / month', sub: 'across hundreds of customer teams' },
      { value: '99.99%',  label: 'effective uptime',         sub: 'across the routed path' },
      { value: '<120ms',  label: 'failover overhead',        sub: 'before your user notices' },
      { value: '24/7',    label: 'engineer-led support',     sub: 'no BDRs · no tier-1 queue' },
    ],
    subtext: '600+ MODELS · ONE API · TRUSTED BY TEAMS SHIPPING AI IN PRODUCTION',
  },

  /** "Why enterprise" - single narrative, no comparison. Trust + reliability + scale. */
  whyEnterprise: {
    eyebrow: '* WHY ENTERPRISE TEAMS PICK US',
    headline: {
      line1: 'Run safely.',
      line2: 'Don\'t crash.',
    },
    body:
      'The two things every CTO worries about when AI moves to production: a security gap that surfaces in an audit, or a provider outage that takes the whole product down. Each Labs is built so neither happens to you.',
    pillars: [
      {
        title: 'Won\'t crash on a bad provider day',
        body: 'Quality-aware failover catches degradations on every call. When Kling 503s or Veo slows to a crawl, traffic spills to a healthy fallback in under 120ms, before your users notice.',
      },
      {
        title: 'Won\'t leak through a security gap',
        body: 'Zero retention by default. Provider-side retention disabled per request. We never train on your traffic. Your prompts and outputs stay where you need them, nowhere else.',
      },
      {
        title: 'Won\'t blow your budget without warning',
        body: 'Per-call traces tag every request with cost, latency, and the attributes you care about. Finance gets the answer to "who is expensive" without a quarterly instrumentation sprint.',
      },
    ],
  },

  /** Social proof - "Top 20% of app studios" + customer logos. */
  socialProof: {
    eyebrow: '* TRUST · IN PRODUCTION',
    metric: 'Top 20%',
    metricLabel: 'of app studios shipping AI use Each Labs',
    body: 'Consumer apps with millions of users, ad-tech platforms running billion+ monthly requests, and enterprise platforms with strict change control are all on the same router.',
    customers: ['NOVA', 'LUME', 'Helix', 'Forma', 'Ondra', 'Kairo', 'Aster', 'Prism', 'Maker', 'Orbit'],
  },

  /** Enterprise features - 6 perks specific to enterprise accounts. */
  features: {
    eyebrow: '* WHAT YOU GET ON ENTERPRISE',
    headline: {
      line1: 'Enterprise features.',
      line2: 'Built around how teams actually run AI in production.',
    },
    tiles: [
      {
        accent: 'spark' as const,
        title: 'Team budget management',
        body:
          'Set monthly inference budgets per team, per project, or per environment. Alert thresholds, hard caps, and rollovers, all enforced at the router so finance never gets surprised.',
      },
      {
        accent: 'highlight' as const,
        title: '24/7 contact with engineering',
        body:
          'Direct Slack channel with the engineers who built the router. P1 issues acknowledged the same business day; on-call coverage 24/7/365, not "business hours in our timezone."',
      },
      {
        accent: 'success' as const,
        title: 'Dedicated customer success manager',
        body:
          'A named CSM assigned at signing, walks your team through onboarding, traffic design, and quarterly business reviews. Direct input on roadmap.',
      },
      {
        accent: 'sun' as const,
        title: 'Custom volume pricing',
        body:
          'Commit to monthly inference volume and the platform fee drops. Provider price is still provider price. Zero markup on inference, ever.',
      },
      {
        accent: 'ember' as const,
        title: 'Zero retention by default',
        body:
          'We don\'t store prompts or outputs past what you opt into for traces. Provider-side retention disabled per provider. We never train on your traffic.',
      },
      {
        accent: 'yellow' as const,
        title: 'Quarterly business reviews',
        body:
          'Scheduled QBR with your CSM and a senior engineer. Cost trends, failover patterns, model swap opportunities, and what is shipping next quarter on our side.',
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

  /** FAQ in homepage style (tag + Q + A). Aimed at CTO-level concerns. */
  faq: {
    eyebrow: '* FAQ',
    headline: 'FAQ',
    italic: 'the questions every CTO asks before signing',
    items: [
      {
        tag: 'UPTIME',
        q: 'What if a model provider has an outage?',
        a: 'Quality-aware failover catches it on every call. Traffic spills to a healthy fallback in under 120ms before your user notices. Your app does not depend on a single provider being healthy.',
      },
      {
        tag: 'SECURITY',
        q: 'Do you train on our prompts or outputs?',
        a: 'No. We do not store prompts or outputs past what you opt into for traces, and we never train models on your traffic. Provider-side retention is opt-in per provider and disabled by default for production accounts.',
      },
      {
        tag: 'PAGING',
        q: 'What happens if Each Labs itself goes down?',
        a: 'The router caches its policy locally and keeps routing on the last-known-good config so your inference does not depend on our control plane being up. Same providers, same direct connections.',
      },
      {
        tag: 'BUDGET',
        q: 'How do we keep AI spend predictable?',
        a: 'Set monthly inference budgets per team, project, or environment. Alerts and hard caps are enforced at the router. Per-call traces tag every request with cost so finance can slice spend by any attribute.',
      },
      {
        tag: 'SUPPORT',
        q: 'Who answers when something breaks?',
        a: 'A founding-team engineer, every time. Direct Slack channel with your CSM and senior engineers, 24/7/365 coverage. No tier-1 queue, no scripted demos, no sales handoff.',
      },
      {
        tag: 'EXIT',
        q: 'How do we exit if it is not working?',
        a: 'The SDK is a thin wrapper. Remove it, point at providers directly, your code is portable. Traces are exportable. We keep nothing after termination plus 30 days.',
      },
    ],
  },

  /** Final CTA, vortex-backed, but a sharper card stack than RabbitHole. */
  finalCta: {
    eyebrow: '* TALK TO ENGINEERING',
    headline: {
      line1: 'Get on a call with the team',
      line2: 'building this.',
    },
    body:
      'The first call is with a senior engineer who reviews your architecture, your traffic shape, and your scale targets. They will quote a deployment model and a price. If we cannot help, we say so on the call.',
    primary: { label: 'Talk to engineering', href: '/contact', style: 'primary' as const },
    secondary: { label: 'Email support@eachlabs.ai', href: 'mailto:support@eachlabs.ai', style: 'outline' as const },
    subtext: 'TYPICAL ENTERPRISE TIMELINE: KICKOFF TO PROD IN 3 WEEKS',
  },
};

// ---------- EXPLORE ----------

export const explore = {
  eyebrow: '* THE CATALOG',
  heading: 'Explore models',
  filterTypes: ['ALL', 'IMAGE', 'VIDEO', 'AUDIO', '3D', 'UPSCALE', 'UTIL'],
  resultCount: 'SHOWING 35 OF 35+ MODELS · 600+ TOTAL IN CATALOG',
};
