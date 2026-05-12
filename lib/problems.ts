export type TerminalLineKind =
  | 'cmd'
  | 'ok'
  | 'fail'
  | 'info'
  | 'warn'
  | 'trace'
  | 'comment';

export type TerminalLine = {
  kind: TerminalLineKind;
  text: string;
};

export type ProblemFix = {
  /** Named feature label, e.g. `each::router`, `each::` rendered ink3, name in ink */
  feature: { prefix: string; name: string; tail?: string };
  tagline: string;
  body: string;
  /** Animated terminal log shown in the right panel, replays on selection. */
  terminal: TerminalLine[];
  /** Visual key, selects the matching animated visual component. */
  visual: VisualKey;
  docsHref: string;
};

export type VisualKey =
  | 'fallback'
  | 'latency'
  | 'ab'
  | 'attribution'
  | 'slicing'
  | 'pipeline'
  | 'swap'
  | 'rollback';

export type Problem = {
  id: number;
  /** Short tab pill label, e.g. "Outage", used in the compact nav. */
  shortLabel: string;
  /** Long descriptive label, e.g. "My model just went down", used as panel heading. */
  label: string;
  /** One-line "without each::labs" pain narrative, what happens if you don't have us. */
  chaos: string;
  fix: ProblemFix;
};

export const PROBLEMS: Problem[] = [
  {
    id: 1,
    shortLabel: 'Outage',
    label: 'My model just went down',
    chaos:
      '03:14 AM. PagerDuty fires. You debug on Slack with the on-call. Users see broken videos for 47 minutes.',
    fix: {
      feature: { prefix: 'each::', name: 'router' },
      tagline: 'Quality-aware routing. Automatic fallback.',
      body:
        'Set fallbacks once. The router watches every call and spills traffic to a backup the moment your primary degrades. Quality-aware, latency-aware, live.',
      terminal: [
        { kind: 'cmd',   text: 'each.run("kling-v3-12v", input, { fallback: ["wan-2.7", "veo-3"] })' },
        { kind: 'info',  text: 'primary: kling-v3-12v · health=ok' },
        { kind: 'fail',  text: 'kling-v3-12v → 503 (provider degraded)' },
        { kind: 'info',  text: 'failover armed → wan-2.7' },
        { kind: 'ok',    text: 'wan-2.7 → 200 in 124ms' },
        { kind: 'comment', text: 'user latency unchanged, incident never reached pagerduty' },
      ],
      visual: 'fallback',
      docsHref: '#',
    },
  },
  {
    id: 2,
    shortLabel: 'Latency',
    label: 'Latency just spiked on my main provider',
    chaos:
      'p95 doubles overnight. Users abandon. You add timeouts, which make it worse. Retros pile up.',
    fix: {
      feature: { prefix: 'each::', name: 'router' },
      tagline: 'Auto-spill to faster providers when yours degrades.',
      body:
        'When p95 latency on a provider exceeds your threshold, the router quietly shifts traffic until it recovers. Your users keep their speed; you keep the cost data.',
      terminal: [
        { kind: 'cmd',   text: 'each.run("kling-v3-12v", input, { routing: "latency", threshold_p95: 800 })' },
        { kind: 'trace', text: 'monitoring p95 across providers · 30s window' },
        { kind: 'warn',  text: 'provider A · p95=1.42s · over threshold (800ms)' },
        { kind: 'info',  text: 'spilling 60% traffic → provider B' },
        { kind: 'ok',    text: 'provider B · p95=540ms · stable' },
        { kind: 'ok',    text: 'auto-spilled at 18:42:11 · trace tagged' },
      ],
      visual: 'latency',
      docsHref: '#',
    },
  },
  {
    id: 3,
    shortLabel: 'A/B test',
    label: 'I want to test a new model in prod safely',
    chaos:
      'Build an A/B harness. QA it. Hand-roll metrics. Wait six weeks for significance. Ship the wrong winner.',
    fix: {
      feature: { prefix: 'each::', name: 'ab' },
      tagline: 'Live A/B on production traffic.',
      body:
        'Set a split. Tag the experiment. Read the results when they’re significant. Ship the winner without redeploying. Statistical rigor, no SDK.',
      terminal: [
        { kind: 'cmd',   text: 'each.run("kling-v3-12v", input, { experiment: "v3-vs-v2", split: { v3: 50, v2: 50 } })' },
        { kind: 'trace', text: 'kling-v3 → 5,238 calls' },
        { kind: 'trace', text: 'kling-v2 → 5,219 calls' },
        { kind: 'info',  text: 'reaching significance · p < 0.05' },
        { kind: 'ok',    text: 'winner: kling-v3 · +9.1% quality · −3% latency' },
        { kind: 'comment', text: 'one click to roll forward · zero redeploys' },
      ],
      visual: 'ab',
      docsHref: '#',
    },
  },
  {
    id: 4,
    shortLabel: 'Attribution',
    label: 'I have no idea what this user cost me',
    chaos:
      'Finance pings. You guess. They don’t believe you. You instrument retroactively, miss half the calls.',
    fix: {
      feature: { prefix: 'each::', name: 'trace' },
      tagline: 'Tag every call. Slice cost by user, tier, anything.',
      body:
        'Pass attributes at runtime. We tag the trace with whatever you send, user_id, tier, persona, experiment, anything. Then slice cost, latency, and quality by any of them.',
      terminal: [
        { kind: 'cmd',   text: 'each.run("kling-v3-12v", input, { attributes: { user_id: "u_8f2a", tier: "pro", persona: "creator" } })' },
        { kind: 'trace', text: 'tagged · user_id=u_8f2a' },
        { kind: 'trace', text: 'tagged · tier=pro' },
        { kind: 'trace', text: 'tagged · persona=creator' },
        { kind: 'ok',    text: 'attributes recorded · sliceable from the dashboard' },
        { kind: 'comment', text: 'one call · five attributes · infinite slices' },
      ],
      visual: 'attribution',
      docsHref: '#',
    },
  },
  {
    id: 5,
    shortLabel: 'Cost slicing',
    label: 'Finance asked for cost per user tier',
    chaos:
      'A sprint of Grafana dashboards, broken queries, and weekly “almost there” updates. Number ships wrong anyway.',
    fix: {
      feature: { prefix: 'each::', name: 'trace', tail: 'slicing' },
      tagline: 'Slice cost, latency, quality by any attribute. Live.',
      body:
        'Once your traces are tagged, the dashboard answers any question your finance team can ask. Cost by tier, by feature, by experiment, by hour. Open a tab, screenshot, ship it to Slack.',
      terminal: [
        { kind: 'cmd',   text: 'each.dashboard.cost_by("tier", { window: "24h" })' },
        { kind: 'trace', text: 'aggregating · 4.3M traces · 24h window' },
        { kind: 'ok',    text: 'pro  · $0.18 / call · 1.2M calls' },
        { kind: 'ok',    text: 'team · $0.21 / call · 0.4M calls' },
        { kind: 'ok',    text: 'free · $0.04 / call · 2.7M calls' },
        { kind: 'comment', text: 'screenshot → slack · ship it' },
      ],
      visual: 'slicing',
      docsHref: '#',
    },
  },
  {
    id: 6,
    shortLabel: 'Pipeline',
    label: 'My pipeline is 4 model calls long',
    chaos:
      'Step 3 fails. You pay for steps 1–2. User sees a half-baked output. Re-running it costs you twice.',
    fix: {
      feature: { prefix: 'each::', name: 'workflows' },
      tagline: 'Chain models like functions. Version like code.',
      body:
        'Compose multi-model pipelines as code. Each step is independently retryable. The whole workflow is versioned, traced, and rollback-able. Failures don’t double-bill, we resume from the last good step.',
      terminal: [
        { kind: 'cmd',   text: 'each.workflow("product-vibez").run(input)' },
        { kind: 'ok',    text: 'step 1/4 · enhance (gpt-4o) · 1.2s' },
        { kind: 'ok',    text: 'step 2/4 · generate (kling-v3) · 4.8s' },
        { kind: 'fail',  text: 'step 3/4 · voice (eleven-v3) · timeout' },
        { kind: 'info',  text: 'retry from step 3 · cached steps 1–2 · no double-bill' },
        { kind: 'ok',    text: 'step 4/4 · done · workflow v3.2' },
      ],
      visual: 'pipeline',
      docsHref: '#',
    },
  },
  {
    id: 7,
    shortLabel: 'Model swap',
    label: 'I want to try Veo 3 without rewriting code',
    chaos:
      'New SDK. New auth. New error shape. Two weeks of integration before you can even benchmark it.',
    fix: {
      feature: { prefix: '', name: '600+ models · one API' },
      tagline: 'One call signature. Every model, every modality.',
      body:
        'Same each.run() for every model in the catalog. Image, video, audio, 3D, image-to-video, text-to-image, voice cloning, all of it. Try Veo 3 in one string change.',
      terminal: [
        { kind: 'cmd',   text: 'each.run("kling-v3-12v", { prompt, duration: 8 })' },
        { kind: 'ok',    text: 'output ready · 4.2s' },
        { kind: 'comment', text: 'one string change ↓' },
        { kind: 'cmd',   text: 'each.run("veo-3", { prompt, duration: 8 })' },
        { kind: 'ok',    text: 'output ready · 5.8s' },
        { kind: 'info',  text: 'same call signature · zero SDK rewrites' },
      ],
      visual: 'swap',
      docsHref: '#',
    },
  },
  {
    id: 8,
    shortLabel: 'Rollback',
    label: 'I need to roll back yesterday’s deploy',
    chaos:
      'git revert. Rebuild. Redeploy. Pray. Now do the same for vendor configs scattered across three repos.',
    fix: {
      feature: { prefix: 'each::', name: 'workflows', tail: 'versioning' },
      tagline: 'Every workflow is versioned. Rollback in one click.',
      body:
        'When you ship a workflow, we tag it. When you change it, we tag the new version. Rollback by passing a version string, no redeploy, no rebuild.',
      terminal: [
        { kind: 'cmd',   text: 'each.workflow("product-vibez").version("v3.2").run(input)' },
        { kind: 'fail',  text: 'output quality regressed · rolling back' },
        { kind: 'cmd',   text: 'each.workflow("product-vibez").version("v3.1").run(input)' },
        { kind: 'ok',    text: 'workflow v3.1 active · v3.2 archived' },
        { kind: 'comment', text: 'no rebuild · no redeploy · one string change' },
      ],
      visual: 'rollback',
      docsHref: '#',
    },
  },
];
