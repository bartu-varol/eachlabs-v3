import type { ComponentType } from 'react';
import {
  FallbackVisual,
  LatencyVisual,
  ABVisual,
  AttributionVisual,
  SlicingVisual,
  WorkflowVisual,
  ModelsApiVisual,
  VersioningVisual,
} from '@/components/widget/visuals';

export type ProblemFix = {
  /** Named feature label, e.g. `each::router` — `each::` rendered ink3, name in ink */
  feature: { prefix: string; name: string; tail?: string };
  tagline: string;
  body: string;
  code: string;
  Visual: ComponentType;
  caption: string;
  docsHref: string;
};

export type Problem = {
  id: number;
  label: string;
  fix: ProblemFix;
};

export const PROBLEMS: Problem[] = [
  {
    id: 1,
    label: 'My model just went down',
    fix: {
      feature: { prefix: 'each::', name: 'router' },
      tagline: 'Quality-aware routing. Automatic fallback.',
      body:
        'Set fallbacks once. The router watches every call and spills traffic to a backup the moment your primary degrades. Quality-aware, latency-aware, live.',
      code: `await each.run("kling-v3-12v", input, {
  fallback: ["wan-2.7", "veo-3"]
})`,
      Visual: FallbackVisual,
      caption: 'Recovered in 0.12s. User never noticed.',
      docsHref: '#',
    },
  },
  {
    id: 2,
    label: 'Latency just spiked on my main provider',
    fix: {
      feature: { prefix: 'each::', name: 'router', tail: 'latency mode' },
      tagline: 'Auto-spill to faster providers when yours degrades.',
      body:
        'When p95 latency on a provider exceeds your threshold, the router quietly shifts traffic until it recovers. Your users keep their speed; you keep the cost data.',
      code: `await each.run("kling-v3-12v", input, {
  routing: "latency",
  threshold_p95: 800 // ms
})`,
      Visual: LatencyVisual,
      caption: 'Auto-spilled to provider B at 18:42.',
      docsHref: '#',
    },
  },
  {
    id: 3,
    label: 'I want to test a new model in prod safely',
    fix: {
      feature: { prefix: 'each::', name: 'ab' },
      tagline: 'Live A/B on production traffic.',
      body:
        'Set a split. Tag the experiment. Read the results when they’re significant. Ship the winner without redeploying. Statistical rigor, no SDK.',
      code: `await each.run("kling-v3-12v", input, {
  experiment: "kling-v3-vs-v2",
  split: { "kling-v3": 50, "kling-v2": 50 }
})`,
      Visual: ABVisual,
      caption: 'v3 wins by 9%. One click to roll forward.',
      docsHref: '#',
    },
  },
  {
    id: 4,
    label: 'I have no idea what this user cost me',
    fix: {
      feature: { prefix: 'each::', name: 'trace' },
      tagline: 'Tag every call. Slice cost by user, tier, anything.',
      body:
        'Pass attributes at runtime. We tag the trace with whatever you send — user_id, tier, persona, experiment, anything. Then slice cost, latency, and quality by any of them.',
      code: `await each.run("kling-v3-12v", input, {
  attributes: {
    user_id: "u_8f2a",
    tier: "pro",
    persona: "creator"
  }
})`,
      Visual: AttributionVisual,
      caption: 'One call. Five attributes. Infinite slices.',
      docsHref: '#',
    },
  },
  {
    id: 5,
    label: 'Finance asked for cost per user tier',
    fix: {
      feature: { prefix: 'each::', name: 'trace', tail: 'slicing' },
      tagline: 'Slice cost, latency, quality by any attribute. Live.',
      body:
        'Once your traces are tagged, the dashboard answers any question your finance team can ask. Cost by tier, by feature, by experiment, by hour. Open a tab, screenshot, ship it to Slack.',
      code: `// Already tagged at runtime — query the dashboard:
each.dashboard.cost_by("tier", { window: "24h" })
// → pro: $0.18 · team: $0.21 · free: $0.04`,
      Visual: SlicingVisual,
      caption: 'Cost per tier. Last 24h. Live.',
      docsHref: '#',
    },
  },
  {
    id: 6,
    label: 'My pipeline is 4 model calls long',
    fix: {
      feature: { prefix: 'each::', name: 'workflows' },
      tagline: 'Chain models like functions. Version like code.',
      body:
        'Compose multi-model pipelines as code. Each step is independently retryable. The whole workflow is versioned, traced, and rollback-able. Failures don’t double-bill — we resume from the last good step.',
      code: `await each.workflow("product-vibez")
  .step("enhance", "gpt-4o")
  .step("generate", "kling-v3-12v")
  .step("voice", "eleven-v3")
  .run(input)`,
      Visual: WorkflowVisual,
      caption: '4 models. One workflow. Versioned.',
      docsHref: '#',
    },
  },
  {
    id: 7,
    label: 'I want to try Veo 3 without rewriting code',
    fix: {
      feature: { prefix: '', name: '600+ models · one API' },
      tagline: 'One call signature. Every model, every modality.',
      body:
        'Same each.run() for every model in the catalog. Image, video, audio, 3D — image-to-video, text-to-image, voice cloning, all of it. Try Veo 3 in one string change.',
      code: `// Same call. Different model.
await each.run("veo-3", { prompt, duration: 8 })`,
      Visual: ModelsApiVisual,
      caption: '600+ models. One API. Zero rewrites.',
      docsHref: '#',
    },
  },
  {
    id: 8,
    label: 'I need to roll back yesterday’s deploy',
    fix: {
      feature: { prefix: 'each::', name: 'workflows', tail: 'versioning' },
      tagline: 'Every workflow is versioned. Rollback in one click.',
      body:
        'When you ship a workflow, we tag it. When you change it, we tag the new version. Rollback by passing a version string — no redeploy, no rebuild.',
      code: `await each.workflow("product-vibez")
  .version("v3.1") // rolled back from v3.2
  .run(input)`,
      Visual: VersioningVisual,
      caption: '1-click rollback. No redeploy.',
      docsHref: '#',
    },
  },
];
