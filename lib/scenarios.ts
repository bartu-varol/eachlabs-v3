import type { VisualKey } from '@/lib/problems';

/** A unified "scenario" — one storyline with a receipts metric + chaos narrative. */
export type Scenario = {
  /** Stable id used in DOM keys + analytics. */
  id: string;
  /** One-word category shown alongside the dot, e.g. "Outage". */
  category: string;

  /** Quantitative claim (top half — bars + count-up + hero number). */
  metric: {
    label: string;       // e.g. 'USER-VISIBLE ERRORS'
    caption: string;     // sub-caption under the label
    hero: { multiplier: string; suffix: string };
    others: { label: 'OTHERS'; sub: string; value: number };
    each:   { label: 'EACH.RUN'; sub: string; value: number };
    format: 'percent' | 'time' | 'usd' | 'days';
    /** Bar scale ceiling — both sides scale to this. */
    scaleMax: number;
  };

  /** Qualitative narrative (bottom half). */
  chaos: string;
  fix: {
    feature: { prefix: string; name: string; tail?: string };
    tagline: string;
    body: string;
    docsHref: string;
  };
  visual: VisualKey;
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'errors',
    category: 'Outage',
    metric: {
      label: 'USER-VISIBLE ERRORS',
      caption: 'auto-fallback fires in <120ms when the primary model dies',
      hero: { multiplier: '97×', suffix: 'FEWER ERRORS' },
      others: { label: 'OTHERS',   sub: 'raw SDKs, no router',         value: 3.42 },
      each:   { label: 'EACH.RUN', sub: 'quality-aware + fallback',     value: 0.04 },
      format: 'percent',
      scaleMax: 4,
    },
    chaos:
      '03:14 AM. PagerDuty fires. You debug on Slack with the on-call. Users see broken videos for 47 minutes.',
    fix: {
      feature: { prefix: 'each::', name: 'router' },
      tagline: 'Quality-aware routing. Automatic fallback.',
      body:
        'Set fallbacks once. The router watches every call and spills traffic to a backup the moment your primary degrades. Quality-aware, latency-aware, live.',
      docsHref: '#',
    },
    visual: 'fallback',
  },
  {
    id: 'recovery',
    category: 'Latency',
    metric: {
      label: 'P99 RECOVERY ON FAIL',
      caption: 'next-best provider picked before your user notices',
      hero: { multiplier: '6,200×', suffix: 'FASTER RECOVERY' },
      others: { label: 'OTHERS',   sub: 'manual rollover · on-call paged',  value: 744 },   // seconds
      each:   { label: 'EACH.RUN', sub: 'router spillover · live',          value: 0.12 },  // seconds
      format: 'time',
      scaleMax: 800,
    },
    chaos:
      'p95 doubles overnight. Users abandon. You add timeouts, which make it worse. Retros pile up.',
    fix: {
      feature: { prefix: 'each::', name: 'router', tail: 'latency mode' },
      tagline: 'Auto-spill to faster providers when yours degrades.',
      body:
        'When p95 latency on a provider exceeds your threshold, the router quietly shifts traffic until it recovers. Your users keep their speed; you keep the cost data.',
      docsHref: '#',
    },
    visual: 'latency',
  },
  {
    id: 'cost',
    category: 'Attribution',
    metric: {
      label: 'COST PER SHIPPED RESULT',
      caption: 'average $/successful output across 600+ models',
      hero: { multiplier: '3×', suffix: 'CHEAPER' },
      others: { label: 'OTHERS',   sub: 'pinned to one provider',        value: 0.18 },
      each:   { label: 'EACH.RUN', sub: 'quality-aware routing + tags',  value: 0.06 },
      format: 'usd',
      scaleMax: 0.2,
    },
    chaos:
      'Finance pings. You guess. They don’t believe you. You instrument retroactively, miss half the calls.',
    fix: {
      feature: { prefix: 'each::', name: 'trace' },
      tagline: 'Tag every call. Slice cost by user, tier, anything.',
      body:
        'Pass attributes at runtime. We tag the trace with whatever you send — user_id, tier, persona, experiment, anything. Then slice cost, latency, and quality by any of them.',
      docsHref: '#',
    },
    visual: 'attribution',
  },
  {
    id: 'integration',
    category: 'Velocity',
    metric: {
      label: 'INTEGRATION TIME',
      caption: 'time to first prod call after signing up',
      hero: { multiplier: '2,520×', suffix: 'FASTER TO SHIP' },
      others: { label: 'OTHERS',   sub: 'new SDK · auth · QA',          value: 14 },     // days
      each:   { label: 'EACH.RUN', sub: 'one API · one signature',       value: 0.0056 }, // ~8 minutes
      format: 'days',
      scaleMax: 14,
    },
    chaos:
      'New SDK. New auth. New error shape. Two weeks of integration before you can even benchmark it.',
    fix: {
      feature: { prefix: '', name: '600+ models · one API' },
      tagline: 'One call signature. Every model, every modality.',
      body:
        'Same each.run() for every model in the catalog. Image, video, audio, 3D — image-to-video, text-to-image, voice cloning, all of it. Try Veo 3 in one string change.',
      docsHref: '#',
    },
    visual: 'swap',
  },
];
