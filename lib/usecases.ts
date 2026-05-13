export type UseCaseSlug =
  | 'consumer-ai'
  | 'retail'
  | 'internal'
  | 'marketing'
  | 'ad-tech'
  | 'gaming';

export type UseCaseStat = { value: string; label: string };
export type UseCaseStory = { quote: string; name: string; role: string };

export type BeforeAfter = {
  anchor: string;     // the situation
  without: string;    // what happens without each::labs
  withus: string;     // what happens with each::labs
};

export type UseCaseDef = {
  slug: UseCaseSlug;
  n: string;
  category: string;       // e.g. 'CONSUMER AI'
  title: string;
  sub: string;
  body: string;
  stats: UseCaseStat[];   // 4 stats
  /** Three concrete moments showing the before/after for this team. */
  beforeAfter: BeforeAfter[];
  /** What the platform looks like for this team, 4 numbered points. */
  fitTitle: string;
  fitPoints: { n: string; title: string; body: string }[];
  /** A representative customer story. */
  story: UseCaseStory;
  usedBy: string[];       // 4 customer logos
  /** Accent token name from globals (spark / highlight / success / sun / yellow / ember). */
  accent: 'spark' | 'highlight' | 'success' | 'sun' | 'yellow' | 'ember';
};

export const USE_CASES: Record<UseCaseSlug, UseCaseDef> = {
  'consumer-ai': {
    slug: 'consumer-ai',
    n: '01',
    category: 'CONSUMER AI',
    title: 'Consumer creative apps',
    sub: 'Photo editors. Avatar generators. Social-first AI.',
    body:
      'Millions of end-users generating images, video, and audio inside your app. We keep latency low, costs predictable, and the lights on when a model crashes.',
    stats: [
      { value: '41×',     label: 'fewer user-visible errors' },
      { value: '<2s',     label: 'p50 latency for image gen' },
      { value: '8 mo',    label: 'eng time saved on plumbing' },
      { value: '99.99%',  label: 'effective uptime' },
    ],
    beforeAfter: [
      {
        anchor: 'Model goes down at 3 AM.',
        without: 'On-call paged. App degrades. 47 minutes of broken videos.',
        withus:  'Auto-fallback fires in 124ms. User latency unchanged.',
      },
      {
        anchor: 'A free user generates 200 images.',
        without: 'Bill arrives Monday. Surprise + finance call.',
        withus:  'Per-tier cap enforced live. Cost stays predictable.',
      },
      {
        anchor: 'A new model drops.',
        without: 'New SDK, new auth, two-week integration.',
        withus:  'Change one string. A/B on 10%. Promote when significant.',
      },
    ],
    fitTitle: 'Why consumer apps ship faster on each::labs.',
    fitPoints: [
      { n: '01', title: 'Sticky speed under load',  body: 'Router auto-spills to faster providers when p95 spikes, your users keep the snappy feel.' },
      { n: '02', title: 'Per-user cost ceilings',   body: 'Tag user_id and tier. Cap free-tier spend automatically; never get surprised by abuse.' },
      { n: '03', title: 'Built-in moderation',      body: 'Safety pre-checks before inference. Failover routes around content_moderation blocks.' },
      { n: '04', title: 'Same-day model swaps',     body: 'New model drops? Change one string. A/B it on 10%. Promote when significant.' },
    ],
    story: {
      quote:
        'Without each::labs we’d have built our own. That alone would’ve been a 3-to-5-person effort, just to keep up with a model landscape that keeps growing.',
      name: 'Selimhan Çakır',
      role: 'Founder & CEO · MobileOcean',
    },
    usedBy: ['NOVA', 'LUME', 'Prism', 'Maker'],
    accent: 'spark',
  },
  'retail': {
    slug: 'retail',
    n: '02',
    category: 'ENTERPRISE RETAIL',
    title: 'E-commerce & retail',
    sub: 'Product photography. Lifestyle imagery. Localized creative.',
    body:
      'Generate, regenerate, and localize thousands of product images and ad creatives, branded, on-spec, with the moderation and compliance baked in.',
    stats: [
      { value: '$2.1M',   label: 'saved on stock + studios in 12mo' },
      { value: '73%',     label: 'faster from brief to asset' },
      { value: '12 langs', label: 'localized in one workflow' },
      { value: 'audit',   label: 'trail on every asset' },
    ],
    beforeAfter: [
      {
        anchor: 'Brand asks for 12 locales.',
        without: 'Twelve briefs, twelve photo shoots, eight weeks.',
        withus:  'One workflow. Twelve localized outputs. 48 hours.',
      },
      {
        anchor: 'Provider API breaks during a launch.',
        without: 'Marketing escalates. Eng patches. Launch slips.',
        withus:  'Router spills to fallback. Marketing never notices.',
      },
      {
        anchor: 'Compliance asks who saw what.',
        without: 'A week of log archaeology.',
        withus:  'Filter traces by user_id. Export to S3. Done.',
      },
    ],
    fitTitle: 'Retail playbook on each::labs.',
    fitPoints: [
      { n: '01', title: 'Brand-safe by default',    body: 'Brand voice + visual style profiles enforced via the enhancer; nothing off-spec ships.' },
      { n: '02', title: 'Locale fan-out',           body: 'One brief → 12 localized variants in one workflow run. Audit who-saw-what included.' },
      { n: '03', title: 'Provider price = your price', body: 'No markup on inference. Finance gets clean line-items per SKU.' },
      { n: '04', title: 'Compliance + retention',   body: 'Trace export to your warehouse on a schedule. Filter by region, surface, or campaign.' },
    ],
    story: {
      quote:
        'each::labs lifted the entire deployment burden from us. But what really keeps us is the partnership.',
      name: 'Furkan Sandal',
      role: 'CTO · PixelByte',
    },
    usedBy: ['Forma', 'Helix', 'Aster', 'Volt'],
    accent: 'success',
  },
  'internal': {
    slug: 'internal',
    n: '03',
    category: 'INTERNAL AI APPS',
    title: 'Internal AI tools',
    sub: 'Ops tooling. Internal content. Team-only generators.',
    body:
      'Build the AI features your internal teams need, slide decks, voiceovers, training data, support drafts, without standing up an entire ML platform yourself.',
    stats: [
      { value: '1 dev',    label: 'shipped 6 internal tools' },
      { value: '14 days',  label: 'from kick-off to first deploy' },
      { value: 'SSO+SAML', label: 'on day 1, no rebuild' },
      { value: '0',        label: 'infra to maintain' },
    ],
    beforeAfter: [
      {
        anchor: 'A team needs an AI feature.',
        without: 'Stand up an ML platform. Hire SRE. Ship in two quarters.',
        withus:  'One developer ships in two weeks on the existing API key.',
      },
      {
        anchor: 'IT requires SSO.',
        without: 'Custom auth glue per tool. Months of work.',
        withus:  'Wire IDP once. Every internal tool inherits it.',
      },
      {
        anchor: 'Legal asks "where did this come from?"',
        without: 'You don’t know.',
        withus:  'Trace by tool, by user, by prompt. Exportable audit log.',
      },
    ],
    fitTitle: 'Internal apps without an ML platform team.',
    fitPoints: [
      { n: '01', title: 'SSO + RBAC on day 1',       body: 'Wire your IDP; we handle scopes per team. No homegrown auth glue.' },
      { n: '02', title: 'Per-team cost views',       body: 'Tag with team_id; finance sees exactly what each function costs.' },
      { n: '03', title: 'Built-in retention controls', body: 'Set retention per workflow; sensitive prompts auto-purge.' },
      { n: '04', title: 'Composable workflows',      body: 'Slack bot? Internal gen UI? Same each(), six tools share one infra.' },
    ],
    story: {
      quote:
        'A 2-to-3-hour AI task is done in 15 minutes. Product and marketing finally ship at the same pace.',
      name: 'Uğurcan Sevindik',
      role: 'Marketing Manager · DofaTech',
    },
    usedBy: ['Kairo', 'Orbit', 'Finch', 'Ondra'],
    accent: 'highlight',
  },
  'marketing': {
    slug: 'marketing',
    n: '04',
    category: 'MARKETING & BRAND',
    title: 'Marketing & brand creative',
    sub: 'Campaign assets. Social content. Brand-safe variants at scale.',
    body:
      'Generate the volume your brand calendar demands, campaign hero shots, social variants, regional adaptations, with brand-safety gates and full audit trails baked in.',
    stats: [
      { value: '120×',    label: 'more campaign variants' },
      { value: '48 hr',   label: 'brief → published asset' },
      { value: 'audit',   label: 'trail on every output' },
      { value: '+34%',    label: 'enhancer quality lift' },
    ],
    beforeAfter: [
      {
        anchor: 'Calendar wants 200 social variants.',
        without: 'Agency turnaround. Two weeks. $40k.',
        withus:  'One workflow. 200 brand-safe variants. 48 hours.',
      },
      {
        anchor: 'Brand voice drifts across channels.',
        without: 'Manual review queue. Slow + expensive.',
        withus:  'Brand voice profile enforced via the enhancer. Live.',
      },
      {
        anchor: 'Performance team wants creative A/Bs.',
        without: 'Build an A/B harness. Wait six weeks.',
        withus:  'Set a split. Auto-promote winner. Read the trace.',
      },
    ],
    fitTitle: 'Brand at scale on each::labs.',
    fitPoints: [
      { n: '01', title: 'Brand voice profiles',     body: 'One profile = consistent tone across every model. Image, video, audio.' },
      { n: '02', title: 'Variant fan-out',          body: 'One brief → 200 social variants. Same brand. Same workflow.' },
      { n: '03', title: 'Approval-friendly traces', body: 'Every output is traceable: who, when, which prompt, which model.' },
      { n: '04', title: 'Live channel A/B',         body: 'A/B creatives by surface (IG / TikTok / web). Promote per-channel winners.' },
    ],
    story: {
      quote:
        'The entire creative side of Wask runs on each::labs. Every new model update makes our work easier.',
      name: 'Umut Gül',
      role: 'AI Expert Specialist · Wask',
    },
    usedBy: ['Aster', 'Forma', 'Helix', 'Volt'],
    accent: 'sun',
  },
  'ad-tech': {
    slug: 'ad-tech',
    n: '05',
    category: 'AD-TECH & GROWTH',
    title: 'Programmatic ad creative',
    sub: 'Performance ads. Live A/B. Per-creative attribution.',
    body:
      'Programmatic creative at the volume your campaigns demand. Generate, A/B in production, attribute to the user, and auto-promote the winning creative, all in real time.',
    stats: [
      { value: '260%',  label: 'net retention via creative scale' },
      { value: '47×',   label: 'more variants per campaign' },
      { value: 'live',  label: 'A/B winner auto-promotion' },
      { value: '<120ms', label: 'router overhead' },
    ],
    beforeAfter: [
      {
        anchor: 'Campaign needs 50 creatives by morning.',
        without: 'Production team pulls an all-nighter.',
        withus:  'One workflow. 50 variants. Brand-safe. Done by 11pm.',
      },
      {
        anchor: 'A creative outperforms by 3×.',
        without: 'Find out next quarter, after the campaign ends.',
        withus:  'Auto-promote on confidence. Spend shifts in real time.',
      },
      {
        anchor: 'Attribution is a black box.',
        without: 'Spreadsheet hand-stitching after each campaign.',
        withus:  'Tag creative_id. Pull conversions. We slice it back.',
      },
    ],
    fitTitle: 'Performance creative loop, closed.',
    fitPoints: [
      { n: '01', title: 'Per-creative attribution', body: 'Tag creative_id; pull conversion; we slice it back to cost-per-result.' },
      { n: '02', title: 'Live A/B with auto-promote', body: 'Set confidence threshold; winning variant ships itself.' },
      { n: '03', title: 'Real-time spend visibility', body: 'Live cost feed sliced by campaign, surface, region, audience.' },
      { n: '04', title: 'Brand-safety gates',       body: 'Programmatic doesn’t mean unsafe. Moderation layer on every generated asset.' },
    ],
    story: {
      quote:
        'each::labs lifted the entire deployment burden from us. But what really keeps us is the partnership.',
      name: 'Furkan Sandal',
      role: 'CTO · PixelByte',
    },
    usedBy: ['Forma', 'Orbit', 'Volt', 'Kairo'],
    accent: 'ember',
  },
  'gaming': {
    slug: 'gaming',
    n: '06',
    category: 'GAMING & LIVE-SERVICE',
    title: 'Game studios & live-ops',
    sub: 'NPCs. Textures. VO localization. Live-event content.',
    body:
      'Generate game-ready assets at the speed of live-service: characters and items, voice in 30+ languages, music cues for events, and texture variants on demand.',
    stats: [
      { value: '6 weeks',   label: 'saved per content drop' },
      { value: '30+ langs', label: 'localized VO from one workflow' },
      { value: '1 dev',     label: 'shipped a live-event pipeline' },
      { value: 'on-prem',   label: 'option for sensitive IP' },
    ],
    beforeAfter: [
      {
        anchor: 'A live event drops in 6 weeks.',
        without: 'Three art contractors, two QA cycles, content slips.',
        withus:  'One workflow. Asset variants on demand. 2 weeks back.',
      },
      {
        anchor: 'You localize VO into 30 languages.',
        without: 'Voice agency. Six months. Six-figure budget.',
        withus:  'One workflow. 30 locales. Same character voice.',
      },
      {
        anchor: 'A bad workflow ships to production.',
        without: 'Hotfix patch. Risky redeploy. Players notice.',
        withus:  'Roll back to v3.1 in one click. No redeploy.',
      },
    ],
    fitTitle: 'Live-service pipeline on each::labs.',
    fitPoints: [
      { n: '01', title: 'Voice in 30+ languages',   body: 'One workflow, multi-locale VO with consistent character voice.' },
      { n: '02', title: 'Asset versioning',         body: 'Workflow versions = asset cohorts. Roll back a bad event in one click.' },
      { n: '03', title: 'On-prem for sensitive IP', body: 'Enterprise plan supports VPC deploy with the same SDK and dashboard.' },
      { n: '04', title: 'Live-event burst capacity', body: 'Router spills to high-throughput providers during seasonal spikes; back when calm.' },
    ],
    story: {
      quote:
        'Without each::labs we’d have built our own. That alone would’ve been a 3-to-5-person effort.',
      name: 'Selimhan Çakır',
      role: 'Founder & CEO · MobileOcean',
    },
    usedBy: ['Maker', 'Prism', 'Volt', 'Finch'],
    accent: 'yellow',
  },
};

export const USE_CASE_SLUGS: UseCaseSlug[] = Object.keys(USE_CASES) as UseCaseSlug[];
