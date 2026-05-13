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
  /** Optional small mono-style detail / example line shown under the body. */
  detail?: string;
  /** Optional animated visual key shown at the top-right of the card. */
  visual?: PointVisual;
};
export type PairsWith = { product: string; body: string; href: string };

export type Accent = 'spark' | 'highlight' | 'success' | 'sun' | 'yellow' | 'ember';

export type ProductDef = {
  slug: 'workflows' | 'router' | 'enhancer';
  /** Mark as coming-soon, adds a 'COMING SOON' badge on the page header. */
  comingSoon?: boolean;
  /** Per-product primary accent, varies the page's signature color. */
  accent: Accent;
  /** Short product-specific tagline (one line) shown as a chip near the hero. */
  signature: string;
  eyebrow: string;          // e.g. 'PLATFORM · WORKFLOWS'
  title: string;            // hero title
  body: string;             // hero body
  stats: ProductStat[];     // 4 stats
  /** Model providers this product works with, shown as "WORKS WITH" pills under hero. */
  providers: string[];
  /** 5 customer names, quick social proof under hero, used by v3 Showcase. */
  trustedBy: string[];
  whatTitle: string;
  whatBody: string;
  whatPoints: ProductPoint[];
  liveTitle: string;        // e.g. 'product-photo-v3 · executing now.'
  liveBody: string;
  whenTitle: string;
  whenPoints: ProductPoint[];
  code: string;
  pairsWith: PairsWith[];
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export const PRODUCTS: Record<ProductDef['slug'], ProductDef> = {
  workflows: {
    slug: 'workflows',
    accent: 'highlight',
    signature: '8,242 workflows shipped this week · v3.2 in prod',
    eyebrow: 'PLATFORM · WORKFLOWS',
    title: 'Real apps don’t call one model.',
    body:
      'Production-grade outputs come from chains: enhance the prompt, generate, upscale, compose, narrate. Workflows let you build this as a typed graph, versioned, diffed, rolled back, and ship the whole thing through one each() call.',
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
      { n: '01', title: 'Versioned + diffed', body: 'v3.2 in prod, v3.3 in staging, v2.4 archived. Pin a version per call, diff two versions side by side, and roll back in one click, no rebuild, no redeploy.', detail: 'workflow.version("v3.1")', visual: 'diff' },
      { n: '02', title: 'Multi-model parallelism', body: 'Branches run concurrently. Image and video generated in parallel and merged at the next node, total latency = the slowest branch, not the sum of branches.', detail: 'graph: { image, video → merge }', visual: 'flow' },
      { n: '03', title: 'Single endpoint', body: 'Your client calls each({ workflow: "X" }). The graph executes server-side; you don\'t orchestrate steps from the client. One trace_id covers the whole run.', detail: 'POST /v1/run', visual: 'rings' },
    ],
    liveTitle: 'product-photo-v3 · executing now.',
    liveBody: 'A real workflow with 8 nodes, input, enhance, two parallel branches (image + video), upscale, audio, merge, output.',
    whenTitle: 'Reach for workflows when…',
    whenPoints: [
      { n: '01', title: 'A consumer feature needs 4 model calls', body: 'Image + voice + music + compose, orchestrate that from your client and you\'ll be debugging glue code on weekends. Workflows make it one server-side call, one trace, one rollback unit.', detail: '4 calls → 1 each()', visual: 'flow' },
      { n: '02', title: 'QA wants the new version on 10% of traffic', body: 'Without versioning that\'s a redeploy with feature flags. With workflows, ship v3.3 to 10% sticky-by-user and watch the trace before promoting, or roll back in one click if quality drops.', detail: 'version("v3.3") · 10% rollout', visual: 'diff' },
      { n: '03', title: 'Step 3 of 4 just failed in production', body: 'Without resumable steps you re-run from scratch and double-bill the user. Workflows cache step outputs, retry from the failure point, and bill the user once, no half-finished outputs reaching customers.', detail: 'retry from step 3 · cached 1–2', visual: 'rings' },
      { n: '04', title: 'Marketing wants to A/B the whole pipeline', body: 'A/B isn\'t just for individual models, sometimes the whole pipeline (enhance + gen + voice) is what\'s changing. Workflows are A/B-able as a unit, with sticky cohorts and a single significance test.', detail: 'experiment: pipeline-v3 vs v4', visual: 'grid' },
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

const result = await each({
  workflow: "product-photo-v3",
  inputs: { prompt: user.prompt },
  attrs: { user_id: user.id },
});`,
    providers: ['gpt-4o', 'Kling', 'Veo', 'FLUX', 'ElevenLabs', 'Suno'],
    trustedBy: ['NOVA', 'LUME', 'Helix', 'Maker', 'Forma'],
    pairsWith: [
      { product: 'Router', body: 'Each node uses the router for fallbacks.', href: '/router' },
      { product: 'Enhancer', body: '12× fewer errors per node, automatically.', href: '/enhancer' },
    ],
    ctaTitle: 'Build the pipeline once. Ship it from anywhere.',
    ctaBody: 'Workflows are free on every plan. Versioning, rollback, and visual editor are unlimited.',
    ctaPrimary:   { label: 'Follow the white rabbit',         href: '/signup' },
    ctaSecondary: { label: 'See the workflow editor', href: '/docs' },
  },
  router: {
    slug: 'router',
    accent: 'spark',
    signature: '03:14 AM · last fallback fired 124ms ago',
    eyebrow: 'PLATFORM · ROUTER',
    title: 'Pick the best model. Route around the broken one.',
    body:
      'A quality-aware router that watches every call. When your primary degrades, by error, latency, or output quality, traffic spills to a backup in <120ms. Set it once; never page on-call again.',
    stats: [
      { value: '<120ms',  label: 'failover latency' },
      { value: '97×',     label: 'fewer user-visible errors' },
      { value: '99.99%',  label: 'effective uptime' },
      { value: 'every',   label: 'call routed' },
    ],
    whatTitle: 'Quality-aware. Latency-aware. Live.',
    whatBody:
      'The router doesn’t just retry on 5xx. It watches output quality, latency, and provider health, and reroutes traffic the moment any signal degrades. Set fallbacks once; we handle the chaos.',
    whatPoints: [
      { n: '01', title: 'Quality-aware fallback', body: 'Most routers retry on 5xx. Ours measures output drift in real time, perceptual hashing on images, audio fingerprinting on TTS, and reroutes the moment the signal degrades. The check lives on the call path; no separate ML pipeline.', detail: 'routing: "quality-aware"', visual: 'swap' },
      { n: '02', title: 'Latency thresholds', body: 'Set a p95 threshold per provider. When one breaches, the router shifts traffic until it recovers, globally, per-tier, or per-experiment. Every failover lands in the trace with a reason.', detail: 'threshold_p95: 800 // ms', visual: 'graph' },
      { n: '03', title: 'Sticky cohorts', body: 'Variant assignment is sticky-by-user. The same user always lands on the same provider until the router has a reason to switch, keeping cohort data clean for A/B tests and tier-based pricing.', detail: 'cohort: user.id', visual: 'grid' },
    ],
    liveTitle: 'kling-v3 just degraded. wan-2.7 took over.',
    liveBody: 'A real failover at 03:14 AM. User latency unchanged, no on-call paged, traced end-to-end.',
    whenTitle: 'Reach for router when…',
    whenPoints: [
      { n: '01', title: 'It\'s 3:14 AM and kling-v3 just died', body: 'Your on-call hasn\'t slept in two days. The dashboard is red. Users are seeing broken videos. Router catches this 124ms in, before your pager fires, before users notice, before the team reaches Slack.', detail: 'incident.caught = true', visual: 'pulse' },
      { n: '02', title: 'Your bill jumped 40% this week', body: 'Cost shifts when fallbacks fire, wan-2.7 might be 2× the cost of kling-v3, and you have no idea which calls switched. Router writes the served-provider on every trace; finance gets the answer in two clicks.', detail: 'trace.served_by · per call', visual: 'graph' },
      { n: '03', title: 'p95 tripled overnight, no one knows why', body: 'A provider degraded silently, same status codes, slower outputs. Without router you\'d be hunting in logs at 11 PM. With it, the failover already fired and the trace tells you which provider went bad and when.', detail: 'p95: 540ms → 1.42s → spilled', visual: 'flow' },
      { n: '04', title: 'You\'re shipping to 3 regions on day 30', body: 'Single-provider capacity has a ceiling, region throttles, daily limits, model deprecations land at the worst time. Router lets you shop across providers without rewriting a single call site.', detail: 'regions: us, eu, apac', visual: 'grid' },
    ],
    code: `import { each } from "eachlabs";

const result = await each({
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
    providers: ['Kling', 'Veo', 'Wan', 'FLUX', 'ElevenLabs', 'OpenAI'],
    trustedBy: ['LUME', 'Prism', 'Maker', 'Kairo', 'Ondra'],
    pairsWith: [
      { product: 'Workflows', body: 'Each workflow node uses the router for fallbacks.', href: '/workflows' },
      { product: 'Enhancer', body: 'Different model, different failure surface, handled.', href: '/enhancer' },
    ],
    ctaTitle: 'Stop writing retry loops. Start routing.',
    ctaBody: 'Router is included on every plan. Quality-aware mode + custom fallback chains on Pro and up.',
    ctaPrimary:   { label: 'Follow the white rabbit',     href: '/signup' },
    ctaSecondary: { label: 'See router docs',  href: '/docs' },
  },
  enhancer: {
    slug: 'enhancer',
    accent: 'sun',
    signature: '12× lower error rate · vs raw provider · n=4.1M calls',
    eyebrow: 'PLATFORM · PROMPT ENHANCER',
    title: '12× fewer errors. Same model. Same call.',
    body:
      'Refusals, malformed outputs, schema drift, hallucinated formats, the failure modes every provider ships with. The enhancer is a learned layer that catches these before the model call and reshapes the prompt so the failure never happens. Same model, same each(), 12× fewer broken responses.',
    stats: [
      { value: '12×',    label: 'fewer errors vs raw' },
      { value: '<200ms', label: 'enhancer overhead' },
      { value: '600+',   label: 'models supported' },
      { value: '0',      label: 'prompts you rewrite' },
    ],
    whatTitle: 'A small model that catches what your model would miss.',
    whatBody:
      'The enhancer is a fast LLM that reads every prompt, predicts where the target model will fail, refusal, malformed output, format drift, schema break, and reshapes the prompt so the call lands cleanly. Your code, your call signature, your model. 12× fewer errors in production.',
    whatPoints: [
      { n: '01', title: 'Refusal repair', body: 'Provider returns a refusal on an ambiguous-but-harmless prompt? The enhancer catches the trigger before the call and reshapes it. Your user sees a result, not a "sorry, I can\'t help with that".', detail: 'refusal: caught · reshaped', visual: 'swap' },
      { n: '02', title: 'Schema-aware enhancement', body: 'When you need JSON, you get JSON. The enhancer enforces shape before the model sees the prompt, malformed-output bugs collapse from ~8% to <1%. Your parsers stop crashing.', detail: 'schema_hint: auto', visual: 'diff' },
      { n: '03', title: 'Per-model failure mapping', body: 'Each model has its own failure surface, kling refuses different prompts than veo; flux malforms differently than nano-banana. The enhancer maps to the target model, so cross-provider swaps stay reliable.', detail: 'enhance: { target: "auto" }', visual: 'tags' },
    ],
    liveTitle: '"draw a person" · 0.3% errors vs 12.4%.',
    liveBody: 'A real comparison: 1,000 production prompts, same model, with and without the enhancer. Raw provider: 124 refusals/malformed. Enhanced: 3.',
    whenTitle: 'Reach for the enhancer when…',
    whenPoints: [
      { n: '01', title: 'Your users hit the refusal-rate floor', body: 'Consumer prompts trip safety filters, even when nothing is unsafe. Without enhancement, ~12% of prompts come back as a polite refusal. With it, ambiguous prompts get reshaped before they ever hit the model, and the rate drops to under 1%.', detail: 'refusal_rate: 12.4% → 0.9%', visual: 'pulse' },
      { n: '02', title: 'You need JSON and the model gives you "mostly JSON"', body: 'Schema drift breaks downstream parsers. The enhancer enforces shape before the call, malformed outputs collapse from 8% to <1%. Your retry loops empty out, your bills shrink, and your parsers stop crashing.', detail: 'malformed: 8.1% → 0.6%', visual: 'diff' },
      { n: '03', title: 'You\'re swapping kling for veo this week', body: 'Each model fails differently, kling refuses different prompts than veo; flux malforms differently than nano-banana. Without the enhancer, swapping providers means relearning each failure surface. With it, error rate stays 12× lower across any swap.', detail: 'model swap · same error floor', visual: 'swap' },
      { n: '04', title: 'You don\'t have a prompt engineer to hire', body: 'Hiring a prompt engineer is a 6-month search and a $200K headcount. The enhancer benchmarks above the median candidate on every internal eval, same error reduction, no hires, no quits.', detail: '12× fewer errors · 0 hires', visual: 'tags' },
    ],
    code: `import { each } from "eachlabs";

const result = await each({
  model: "kling-v3-12v",
  inputs: { prompt: user.prompt },
  enhance: {
    enabled: true,
    schema:  "video.metadata.v1", // optional, for typed outputs
  },
});

// Behind the scenes:
//   raw_error_rate:      12.4%  (refusals + malformed)
//   enhanced_error_rate:  0.9%
//   overhead:           ~180ms
//   your code:           unchanged`,
    providers: ['Kling', 'Veo', 'FLUX', 'ElevenLabs', 'Suno', 'gpt-4o'],
    trustedBy: ['StoryForge', 'NOVA', 'Maker', 'Aster', 'Forma'],
    pairsWith: [
      { product: 'Router', body: 'Different model, different failure surface, handled.', href: '/router' },
      { product: 'Workflows', body: 'Lower error rate on every node of every pipeline.', href: '/workflows' },
    ],
    ctaTitle: 'Stop debugging prompts. Start shipping reliable outputs.',
    ctaBody: 'Enhancer is free on every plan; schema-aware enhancement + per-team learning on Pro and up.',
    ctaPrimary:   { label: 'Follow the white rabbit',         href: '/signup' },
    ctaSecondary: { label: 'See enhancer docs',    href: '/docs' },
  },
};
