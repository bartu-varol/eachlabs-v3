export type ProductStat = { value: string; label: string };
export type PointVisual =
  | 'rings'
  | 'flow'
  | 'graph'
  | 'grid'
  | 'diff'
  | 'tags'
  | 'swap'
  | 'pulse';
export type ProductPoint = {
  n: string;
  title: string;
  body: string;
  detail?: string;
  visual?: PointVisual;
};
export type PairsWith = { product: string; body: string; href: string };

export type Testimonial = {
  metric: string;       // headline number, e.g. "3× faster"
  metricLabel: string;  // what the metric measures
  quote: string;
  name: string;
  role: string;
};

export type ProductDef = {
  slug: 'workflows' | 'trace' | 'attributes' | 'router' | 'enhancer' | 'ab';
  eyebrow: string;          // e.g. 'PLATFORM · WORKFLOWS'
  title: string;            // hero title
  body: string;             // hero body
  stats: ProductStat[];     // 4 stats
  trustedBy: string[];      // 5 customer names — quick social proof under hero
  whatTitle: string;
  whatBody: string;
  whatPoints: ProductPoint[];
  liveTitle: string;        // e.g. 'product-photo-v3 · executing now.'
  liveBody: string;
  whenTitle: string;
  whenPoints: ProductPoint[];
  code: string;
  testimonial: Testimonial; // metric-driven customer quote
  pairsWith: PairsWith[];
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export const PRODUCTS: Record<ProductDef['slug'], ProductDef> = {
  workflows: {
    slug: 'workflows',
    eyebrow: 'PLATFORM · WORKFLOWS',
    title: 'Real apps don’t call one model.',
    body:
      'Production-grade outputs come from chains: enhance the prompt, generate, upscale, compose, narrate. Workflows let you build this as a typed graph — versioned, diffed, rolled back — and ship the whole thing through one each.run() call.',
    stats: [
      { value: '8K+',  label: 'workflows in production' },
      { value: 'v1.0', label: 'versioned, rollback-safe' },
      { value: '<3s',  label: 'avg multi-model run' },
      { value: '0',    label: 'glue code required' },
    ],
    whatTitle: 'A typed graph, shipped through one call.',
    whatBody:
      'Workflows are first-class infrastructure. Each node is a model call or a utility (enhance, moderate, compose). Edges are typed. Versions are pinned. Every run is traced end-to-end.',
    whatPoints: [
      { n: '01', title: 'Versioned + diffed', body: 'v3.2 in prod, v3.3 in staging, v2.4 archived. Pin a version per call, diff two versions side by side, and roll back in one click — no rebuild, no redeploy.', detail: 'workflow.version("v3.1")', visual: 'diff' },
      { n: '02', title: 'Multi-model parallelism', body: 'Branches run concurrently. Image and video generated in parallel and merged at the next node — total latency = the slowest branch, not the sum of branches.', detail: 'graph: { image, video → merge }', visual: 'flow' },
      { n: '03', title: 'Single endpoint', body: 'Your client calls each.run({ workflow: "X" }). The graph executes server-side; you don\'t orchestrate steps from the client. One trace_id covers the whole run.', detail: 'POST /v1/run', visual: 'rings' },
    ],
    liveTitle: 'product-photo-v3 · executing now.',
    liveBody: 'A real workflow with 8 nodes — input, enhance, two parallel branches (image + video), upscale, audio, merge, output.',
    whenTitle: 'Reach for workflows when…',
    whenPoints: [
      { n: '01', title: 'A consumer feature needs 4 model calls', body: 'Image + voice + music + compose — orchestrate that from your client and you\'ll be debugging glue code on weekends. Workflows make it one server-side call, one trace, one rollback unit.', detail: '4 calls → 1 each.run()', visual: 'flow' },
      { n: '02', title: 'QA wants the new version on 10% of traffic', body: 'Without versioning that\'s a redeploy with feature flags. With workflows, ship v3.3 to 10% sticky-by-user and watch the trace before promoting — or roll back in one click if quality drops.', detail: 'version("v3.3") · 10% rollout', visual: 'diff' },
      { n: '03', title: 'Step 3 of 4 just failed in production', body: 'Without resumable steps you re-run from scratch and double-bill the user. Workflows cache step outputs, retry from the failure point, and bill the user once — no half-finished outputs reaching customers.', detail: 'retry from step 3 · cached 1–2', visual: 'rings' },
      { n: '04', title: 'Marketing wants to A/B the whole pipeline', body: 'A/B isn\'t just for individual models — sometimes the whole pipeline (enhance + gen + voice) is what\'s changing. Workflows are A/B-able as a unit, with sticky cohorts and a single significance test.', detail: 'experiment: pipeline-v3 vs v4', visual: 'grid' },
    ],
    code: `import { each } from "eachlabs";

each.workflows.define({
  id: "product-photo-v3",
  inputs: { prompt: "string" },
  graph: {
    enhance: { kind: "util",  model: "gpt-4o" },
    image:   { kind: "image", model: "nano-banana-2", input: "enhance.out" },
    upscale: { kind: "util",  model: "topaz-4x",      input: "image.out"   },
    output:  { kind: "io",                            input: "upscale.out" },
  },
});

const result = await each.run({
  workflow: "product-photo-v3",
  inputs: { prompt: user.prompt },
  attrs: { user_id: user.id },
});`,
    trustedBy: ['NOVA', 'LUME', 'Helix', 'Maker', 'Forma'],
    testimonial: {
      metric: '4 → 1',
      metricLabel: 'inference services collapsed into one workflow',
      quote: 'We went from four inference services glued together with bash to one versioned workflow. Velocity tripled, and rollback is a string change.',
      name: 'Furkan Sandal',
      role: 'CTO · PixelByte',
    },
    pairsWith: [
      { product: 'each::router', body: 'Each node uses the router for fallbacks.', href: '/router' },
      { product: 'each::trace',  body: 'Multi-step traces are first-class.',       href: '/trace' },
    ],
    ctaTitle: 'Build the pipeline once. Ship it from anywhere.',
    ctaBody: 'Workflows are free on every plan. Versioning, rollback, and visual editor are unlimited.',
    ctaPrimary:   { label: 'Start free →',         href: '/signup' },
    ctaSecondary: { label: 'See the workflow editor', href: '/docs' },
  },
  trace: {
    slug: 'trace',
    eyebrow: 'PLATFORM · TRACE',
    title: 'Per-user economics. Live. Per-call.',
    body:
      'Every each.run() emits a complete trace — every step, every fallback, every cost — tagged with your attributes. Drill from "this user costs me too much" to the exact request that made it true.',
    stats: [
      { value: 'every call', label: 'fully traced' },
      { value: '<3ms',       label: 'trace overhead' },
      { value: '30 days',    label: 'retention on Pro' },
      { value: 'BigQuery',   label: '+ S3, Snowflake export' },
    ],
    whatTitle: 'Trace, not log. Cost, not aggregates.',
    whatBody:
      'Logs tell you what happened. Traces tell you what one user experienced. Every each.run() captures the full call chain — fallbacks, retries, model versions, attributes — and ties it back to the user, the campaign, the experiment.',
    whatPoints: [
      { n: '01', title: 'One trace per user request',  body: 'Even multi-step workflows are one trace. The chain is visible end-to-end.' },
      { n: '02', title: 'Cost reconciled per step',    body: 'Inference cost, fallback cost, enhancer cost — separately tracked.' },
      { n: '03', title: 'Exportable to your warehouse', body: 'Trace + attributes stream to BigQuery, Snowflake, S3 on a schedule.' },
    ],
    liveTitle: 'One request, one trace, the whole story.',
    liveBody: 'A real production trace: 6 steps, one fallback fired (content_moderation → wan-2.7), total cost $0.194.',
    whenTitle: 'Reach for trace when…',
    whenPoints: [
      { n: '01', title: 'A user complains "this took forever"',           body: 'Pull the trace by user_id; see the latency per step.' },
      { n: '02', title: 'Your bill jumped 40% week over week',            body: 'Slice traces by attribute. Which workflow? Which user tier?' },
      { n: '03', title: 'A new fallback is firing too often',             body: 'Filter traces by fallback.fired = true. See the rate per primary model.' },
      { n: '04', title: 'Compliance asks "what did we generate for X"',   body: 'Export traces by user_id with full prompt + model + version.' },
    ],
    code: `import { each } from "eachlabs";

const result = await each.run({
  workflow: "consumer-image-v3",
  prompt:   user.prompt,
  attrs:    { user_id: user.id, tier: user.tier },
});

const trace = await each.traces.get(result.trace_id);
// trace.steps = [
//   { step: "enhance",  model: "gpt-4o",       cost: 0.001, status: "ok"   },
//   { step: "primary",  model: "kling-v3-i2v", cost: 0,     status: "fail" },
//   { step: "fallback", model: "wan-2.7",      cost: 0.18,  status: "ok"   },
// ];
// trace.totals = { cost: 0.194, latency_ms: 6800 };

each.traces.export({
  destination: "bigquery://analytics.eachlabs_traces",
  filter:      "tier = 'pro'",
  schedule:    "hourly",
});`,
    trustedBy: ['Helix', 'Forma', 'Aster', 'Volt', 'Orbit'],
    testimonial: {
      metric: '2 hours → 2 clicks',
      metricLabel: 'to answer "what did this user cost?"',
      quote: 'First Monday after we shipped trace, finance asked the per-tier cost question. I answered in 90 seconds. Used to be a sprint.',
      name: 'Selimhan Çakır',
      role: 'Founder & CEO · MobileOcean',
    },
    pairsWith: [
      { product: 'each::router',    body: 'Routing decisions are part of every trace.', href: '/router' },
      { product: 'each::workflows', body: 'Multi-step traces span every workflow node.', href: '/workflows' },
    ],
    ctaTitle: 'Stop running blind. Start running with traces.',
    ctaBody: 'Free plan ships with 7 days of trace retention. Pro extends to 30 days; Enterprise to unlimited + warehouse export.',
    ctaPrimary:   { label: 'Start free →',    href: '/signup' },
    ctaSecondary: { label: 'See trace docs', href: '/docs' },
  },
  attributes: {
    slug: 'attributes',
    eyebrow: 'PLATFORM · ATTRIBUTES',
    title: 'Tag every call. Slice every dollar.',
    body:
      'Attach unlimited custom attributes — user, tier, experiment, region, anything — to every each.run() call. Cost, latency, and quality become sliceable across any combination, in real time.',
    stats: [
      { value: 'unlimited', label: 'custom attributes' },
      { value: '<3ms',      label: 'attribute overhead' },
      { value: '28K+',      label: 'active dimensions in prod' },
      { value: 'real-time', label: 'dashboards + slicing' },
    ],
    whatTitle: 'Custom dimensions. Not predefined buckets.',
    whatBody:
      'Tag with whatever you need: user_id, tier, persona, experiment, surface, campaign — anything. The dashboard automatically infers slicing dimensions and surfaces them as filters within minutes.',
    whatPoints: [
      { n: '01', title: 'No schema, no migrations',     body: 'Add a new attribute in your client. It appears in the dashboard ~30 seconds later.' },
      { n: '02', title: 'Sliceable in real time',       body: 'Filter the live cost feed by any combination of attributes. Drill into a single user.' },
      { n: '03', title: 'Exportable to your warehouse', body: 'Stream to S3, BigQuery, Snowflake on a schedule.' },
    ],
    liveTitle: 'Same $2,162. Four different stories.',
    liveBody: 'One day of spending, sliced four ways.',
    whenTitle: 'Reach for attributes when…',
    whenPoints: [
      { n: '01', title: 'You want per-user unit economics',          body: 'Tag user_id; see exactly which users cost you 10× the median.' },
      { n: '02', title: 'You need to attribute revenue to creative', body: 'Tag campaign_id and creative_id. Pull conversion data; we slice it back.' },
      { n: '03', title: 'You ship features behind feature flags',    body: 'Tag exp; compare cost + quality + error rate per cohort.' },
      { n: '04', title: 'Compliance asks "who saw what when"',       body: 'Attributes carry actor + workflow + retention. Audit log is filterable.' },
    ],
    code: `import { each } from "eachlabs";

await each.run({
  workflow: "consumer-image-v3",
  prompt:   user.prompt,
  attrs: {
    user_id:  user.id,
    tier:     user.tier,
    persona:  user.persona,
    region:   ip.geo.region,
    surface:  "mobile-home",
    campaign: ad.campaign_id,
    creative: ad.creative_id,
    exp:      flags.bucket,
  },
});

each.export({
  destination: "bigquery://analytics.eachlabs_traces",
  schedule:    "hourly",
});`,
    trustedBy: ['Forma', 'Helix', 'Volt', 'Orbit', 'NOVA'],
    testimonial: {
      metric: '0 → 28K',
      metricLabel: 'sliceable dimensions, no migrations',
      quote: 'I tagged user_id once. The dashboard inferred everything else — tier, region, persona — and surfaced filters within minutes.',
      name: 'Umut Gül',
      role: 'AI Expert Specialist · Wask',
    },
    pairsWith: [
      { product: 'each::trace',       body: 'Drill from a sliced row to one specific run.',  href: '/trace' },
      { product: 'each::ab', body: 'Use exp attribute as the cohort dimension.',    href: '/platform' },
      { product: 'each::router',      body: 'Route by tier or region attribute automatically.', href: '/platform' },
    ],
    ctaTitle: 'Stop guessing. Start slicing.',
    ctaBody: 'Attributes is in early access — Q1 2026. Join the waitlist for the first cohort.',
    ctaPrimary:   { label: 'Join the waitlist →',  href: '/signup?waitlist=attributes' },
    ctaSecondary: { label: 'See the spec',         href: '/docs' },
  },
  router: {
    slug: 'router',
    eyebrow: 'PLATFORM · ROUTER',
    title: 'Pick the best model. Route around the broken one.',
    body:
      'A quality-aware router that watches every call. When your primary degrades — by error, latency, or output quality — traffic spills to a backup in <120ms. Set it once; never page on-call again.',
    stats: [
      { value: '<120ms',  label: 'spillover latency' },
      { value: '97×',     label: 'fewer user-visible errors' },
      { value: '99.99%',  label: 'effective uptime' },
      { value: 'every',   label: 'call routed' },
    ],
    whatTitle: 'Quality-aware. Latency-aware. Live.',
    whatBody:
      'The router doesn’t just retry on 5xx. It watches output quality, latency, and provider health, and reroutes traffic the moment any signal degrades. Set fallbacks once; we handle the chaos.',
    whatPoints: [
      { n: '01', title: 'Quality-aware fallback', body: 'Most routers retry on 5xx. Ours measures output drift in real time — perceptual hashing on images, audio fingerprinting on TTS — and reroutes the moment the signal degrades. The check lives on the call path; no separate ML pipeline.', detail: 'routing: "quality-aware"', visual: 'swap' },
      { n: '02', title: 'Latency thresholds',     body: 'Set a p95 threshold per provider. When one breaches, the router shifts traffic until it recovers — globally, per-tier, or per-experiment. Every spillover lands in the trace with a reason.', detail: 'threshold_p95: 800 // ms', visual: 'graph' },
      { n: '03', title: 'Sticky cohorts',         body: 'Variant assignment is sticky-by-user. The same user always lands on the same provider until the router has a reason to switch — keeping cohort data clean for A/B tests and tier-based pricing.', detail: 'cohort: user.id', visual: 'grid' },
    ],
    liveTitle: 'kling-v3 just degraded. wan-2.7 took over.',
    liveBody: 'A real spillover at 03:14 AM. User latency unchanged, no on-call paged, traced end-to-end.',
    whenTitle: 'Reach for router when…',
    whenPoints: [
      { n: '01', title: 'It’s 3:14 AM and kling-v3 just died', body: 'Your on-call hasn’t slept in two days. The dashboard is red. Users are seeing broken videos. Router catches this 124ms in — before your pager fires, before users notice, before the team reaches Slack.', detail: 'incident.caught = true', visual: 'pulse' },
      { n: '02', title: 'Your bill jumped 40% this week',           body: 'Cost shifts when fallbacks fire — wan-2.7 might be 2× the cost of kling-v3, and you have no idea which calls switched. Router writes the served-provider on every trace; finance gets the answer in two clicks.', detail: 'trace.served_by · per call', visual: 'graph' },
      { n: '03', title: 'p95 tripled overnight, no one knows why',  body: 'A provider degraded silently — same status codes, slower outputs. Without router you’d be hunting in logs at 11 PM. With it, the spillover already fired and the trace tells you which provider went bad and when.', detail: 'p95: 540ms → 1.42s → spilled', visual: 'flow' },
      { n: '04', title: 'You’re shipping to 3 regions on day 30', body: 'Single-provider capacity has a ceiling — region throttles, daily limits, model deprecations land at the worst time. Router lets you shop across providers without rewriting a single call site.', detail: 'regions: us, eu, apac', visual: 'grid' },
    ],
    code: `import { each } from "eachlabs";

const result = await each.run({
  model: "kling-v3-12v",
  inputs: { prompt },
  router: {
    fallback:      ["wan-2.7", "veo-3"],
    routing:       "quality-aware",
    threshold_p95: 800, // ms
  },
});

// On primary failure or latency breach, the router spills.
// You don't write the retry. You don't page anyone.
// result.trace shows which provider served the call.`,
    trustedBy: ['LUME', 'Prism', 'Maker', 'Kairo', 'Ondra'],
    testimonial: {
      metric: 'weekly → 0',
      metricLabel: '3AM pages, since router went live',
      quote: 'Our 3AM pages went from weekly to zero. Worth the migration alone — and the spillover trace told us exactly which provider had the bad night.',
      name: 'Uğurcan Sevindik',
      role: 'Marketing Manager · DofaTech',
    },
    pairsWith: [
      { product: 'each::workflows', body: 'Each workflow node uses the router for fallbacks.', href: '/workflows' },
      { product: 'each::trace',     body: 'Routing decisions are part of every trace.',        href: '/trace' },
    ],
    ctaTitle: 'Stop writing retry loops. Start routing.',
    ctaBody: 'Router is included on every plan. Quality-aware mode + custom fallback chains on Pro and up.',
    ctaPrimary:   { label: 'Start free →',     href: '/signup' },
    ctaSecondary: { label: 'See router docs',  href: '/docs' },
  },
  enhancer: {
    slug: 'enhancer',
    eyebrow: 'PLATFORM · PROMPT ENHANCER',
    title: '60% fewer refusals. Same prompt. Every model.',
    body:
      'When the model’s content checker would refuse a prompt, the enhancer rewrites it on the fly — preserving intent, swapping risky tokens — so the output ships, your user pays, and you don’t lose a session to a refusal.',
    stats: [
      { value: '<180ms', label: 'rewrite + recheck overhead' },
      { value: '100%',   label: 'user intent preserved' },
      { value: '0',      label: 'customer-visible refusals' },
    ],
    whatTitle: 'A safety net between the user and the refusal.',
    whatBody:
      'Every call gets a content-policy pre-check. If it would fail, the enhancer rewrites — keeps the user’s intent, swaps the risky bits, re-checks — and ships only a passing prompt. The user never sees the rejection. You never lose the conversion.',
    whatPoints: [
      { n: '01', title: 'Reads the error code', body: 'When a model would refuse, the enhancer sees the rejection category — content safety, content policy, or celebrity / brand-IP — and routes the rewrite around that exact reason. No blind retries.', detail: 'error_code → policy_class', visual: 'pulse' },
      { n: '02', title: 'Rewrites the prompt',  body: 'A small LLM trained to swap risky tokens, never the meaning. "Iron Man" → "an armored superhero in red and gold." The user\'s intent stays intact; only the flagged bits change.', detail: '"Iron Man" → "armored superhero"', visual: 'swap' },
      { n: '03', title: 'Re-checks three policies', body: 'The rewritten prompt re-runs all three policy categories — content safety, content policy, celebrity/IP — and ships only when every check passes. The model never sees the original.', detail: 'recheck: safety · policy · IP', visual: 'rings' },
    ],
    liveTitle: '"looks like Red Bull" → "vibrant blue and silver design"',
    liveBody: 'A real rescue: a brand-IP rejection caught mid-call, rewritten in 156ms, output shipped — the user kept paying.',
    whenTitle: 'Reach for the enhancer when…',
    whenPoints: [
      { n: '01', title: 'Your users hit content filters often',    body: 'Consumer-facing media apps see this constantly — celebrities, brand IP, edgy tokens. Every filter hit is a paid session that didn\'t finish. The enhancer catches them before they bounce off the model.', detail: 'refusal_rate > 15%', visual: 'pulse' },
      { n: '02', title: 'Refusals cost you a paid session',         body: 'If the user can\'t get an output, they don\'t pay you. Every refusal is a churn signal. The enhancer turns near-misses into deliveries — same prompt, rewritten just enough to pass.', detail: 'session.refused = revenue.lost', visual: 'graph' },
      { n: '03', title: 'You ship across multiple providers',       body: 'Kling, Veo, FLUX — each provider has different policies and different refusal categories. The enhancer learns them all and adapts per call. No per-provider rule maintenance.', detail: 'policies: per-provider', visual: 'swap' },
      { n: '04', title: 'You can\'t watch every prompt manually',  body: 'User input is a long tail; you can\'t pre-moderate it by hand. Only an automatic safety net catches the celebrity references, the brand mentions, the policy edges — at production volume.', detail: 'prompts: long-tail volume', visual: 'grid' },
    ],
    code: `import { each } from "eachlabs";

const result = await each.run({
  model: "kling-v3-12v",
  inputs: { prompt: user.prompt },
  enhance: {
    rescue:          true,        // rewrite on policy refusal
    intent_priority: "preserve",  // never alter the user's intent
  },
});

// If the prompt would have been refused, the trace shows:
// result.trace.enhancer = {
//   rescued:   true,
//   rejected:  "brand_ip",
//   original:  "ad creative for our energy drink, looks like Red Bull",
//   rewritten: "ad creative for our energy drink, vibrant blue and silver design",
//   recheck:   "passed",
//   ms:        156,
// };`,
    trustedBy: ['StoryForge', 'NOVA', 'Maker', 'Aster', 'Forma'],
    testimonial: {
      metric: '+23%',
      metricLabel: 'completed sessions, since enhancer went on',
      quote: 'Pre-enhancer, every other story-image prompt got refused for "realistic person" or "IP". Post-enhancer, those just ship. We stopped losing 1 in 3 sessions to a content reject.',
      name: 'Mert Demirhan',
      role: 'Head of Engineering · StoryForge',
    },
    pairsWith: [
      { product: 'each::router', body: 'If the rewrite still fails on a model, router spills to the next.',  href: '/router' },
      { product: 'each::trace',  body: 'Every rescue lands in the trace — original + rewritten side by side.', href: '/trace' },
    ],
    ctaTitle: 'Stop losing sessions to a refusal.',
    ctaBody: 'Enhancer is in early access — Q1 2026. Join the waitlist for the first cohort.',
    ctaPrimary:   { label: 'Join the waitlist →',  href: '/signup?waitlist=enhancer' },
    ctaSecondary: { label: 'See the spec',         href: '/docs' },
  },
  ab: {
    slug: 'ab',
    eyebrow: 'PLATFORM · A/B TESTING',
    title: 'Test in prod. Promote the winner.',
    body:
      'Live A/B testing on production traffic with sticky cohorts, statistical confidence built in, and one-click auto-promote. No SDK to bolt on — A/B is part of every each.run() call.',
    stats: [
      { value: 'live',   label: 'on production traffic' },
      { value: 'sticky', label: 'user-level cohorts' },
      { value: '1-click', label: 'auto-promote' },
      { value: 'p<0.05', label: 'significance baked in' },
    ],
    whatTitle: 'Real significance, no harness to build.',
    whatBody:
      'Set a split percentage. Tag the experiment. Read the dashboard when the test reaches significance. Promote the winner with one click — no redeploy, no rebuild.',
    whatPoints: [
      { n: '01', title: 'Sticky cohorts',           body: 'The same user always gets the same variant — until you promote a winner.' },
      { n: '02', title: 'Statistical rigor',        body: 'Power analysis, sequential testing, p-values — surfaced in the dashboard.' },
      { n: '03', title: 'Auto-promote on confidence', body: 'Set a confidence threshold; the winner ships itself when it’s actually winning.' },
    ],
    liveTitle: 'kling-v3 vs kling-v2 · 10K calls in.',
    liveBody: 'A real production A/B with 5,238 vs 5,219 calls. v3 wins by 9.1% quality. p < 0.05. One click to roll forward.',
    whenTitle: 'Reach for A/B when…',
    whenPoints: [
      { n: '01', title: 'You want to ship a new model safely',     body: 'Test it on 10% before promoting to 100%.' },
      { n: '02', title: 'You’re tuning a workflow',                 body: 'A/B enhanced vs raw, or v3.2 vs v3.3 — sticky cohort, no rebuild.' },
      { n: '03', title: 'You need to defend a model choice',       body: 'Show finance the cost-quality tradeoff with statistical confidence.' },
      { n: '04', title: 'You can’t afford a bad rollout',           body: 'Auto-rollback if the variant degrades quality or error rate.' },
    ],
    code: `import { each } from "eachlabs";

await each.run({
  model: "kling-v3-12v",
  inputs: { prompt: user.prompt },
  experiment: {
    id:     "kling-v3-vs-v2",
    split:  { "kling-v3": 50, "kling-v2": 50 },
    cohort: user.id,
    auto_promote_at: 0.95,
  },
  attrs: { user_id: user.id, tier: user.tier },
});

// Read results in the dashboard. When confidence > 0.95,
// the winner promotes itself. No redeploy.`,
    trustedBy: ['Volt', 'Orbit', 'Forma', 'Kairo', 'Helix'],
    testimonial: {
      metric: '12 swaps in 1 sprint',
      metricLabel: 'model A/Bs, auto-promoted',
      quote: 'We A/B-tested 12 model swaps in the time it used to take to ship one. The sticky cohorts mean we never had to defend a confounded result.',
      name: 'Umut Gül',
      role: 'AI Expert Specialist · Wask',
    },
    pairsWith: [
      { product: 'each::trace',      body: 'Variant assignment is in every trace.',           href: '/trace' },
      { product: 'each::attributes', body: 'Use exp as the cohort; slice cost + quality.',    href: '/attributes' },
      { product: 'each::workflows',  body: 'A/B whole workflows, not just models.',           href: '/workflows' },
    ],
    ctaTitle: 'Stop guessing what wins. Ship the winner.',
    ctaBody: 'A/B testing is in early access — Q1 2026. Join the waitlist for the first cohort.',
    ctaPrimary:   { label: 'Join the waitlist →',  href: '/signup?waitlist=ab' },
    ctaSecondary: { label: 'See the spec',         href: '/docs' },
  },
};
