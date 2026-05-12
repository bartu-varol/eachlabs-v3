'use client';

import { motion } from 'framer-motion';
import type { ProductDef } from '@/lib/products';

/* ──────────────────────────────────────────────────────────────────────────
   LiveTerminal — a streaming log/terminal feed per product.
   Looks like watching `tail -f` on a real production system. Lines appear
   one-by-one with stagger, sit, then loop.
────────────────────────────────────────────────────────────────────────── */

type LineKind = 'cmd' | 'ok' | 'fail' | 'warn' | 'info' | 'trace' | 'data' | 'comment';
type Line = { kind: LineKind; text: string };

const PREFIX: Record<LineKind, string> = {
  cmd:     '$',
  ok:      '✓',
  fail:    '✗',
  warn:    '⚠',
  info:    '·',
  trace:   '↳',
  data:    '»',
  comment: '#',
};

const PREFIX_COLOR: Record<LineKind, string> = {
  cmd:     'text-spark',
  ok:      'text-success',
  fail:    'text-fail',
  warn:    'text-yellow',
  info:    'text-ink2',
  trace:   'text-spark',
  data:    'text-highlight',
  comment: 'text-ink3',
};

const TEXT_COLOR: Record<LineKind, string> = {
  cmd:     'text-ink',
  ok:      'text-ink',
  fail:    'text-ink',
  warn:    'text-ink2',
  info:    'text-ink2',
  trace:   'text-ink2',
  data:    'text-ink',
  comment: 'text-ink3 italic',
};

/* Per-product mock terminal scripts — each plays a believable production scene. */
const SCRIPTS: Record<ProductDef['slug'], Line[]> = {
  router: [
    { kind: 'cmd',  text: 'each.run("kling-v3-12v", input, { fallback: ["wan-2.7"] })' },
    { kind: 'ok',   text: '[03:14:22] kling-v3 · 200 · 892ms · trace_8f2a' },
    { kind: 'fail', text: '[03:14:24] kling-v3 · 503 · upstream timeout · trace_8f2c' },
    { kind: 'trace', text: '[03:14:24] spillover armed → wan-2.7' },
    { kind: 'ok',   text: '[03:14:24] wan-2.7 · 200 · 124ms · trace_8f2c · ✓ recovered' },
    { kind: 'ok',   text: '[03:14:25] kling-v3 · 200 · 901ms · trace_8f2d' },
    { kind: 'comment', text: 'no pages fired · uptime preserved · 99.99%' },
  ],
  workflows: [
    { kind: 'cmd',  text: 'each.run({ workflow: "product-photo-v3" })' },
    { kind: 'info', text: '[12:01:03] enter · enhance (gpt-4o)' },
    { kind: 'ok',   text: '[12:01:04] step ok · enhance · 0.4s · $0.001' },
    { kind: 'info', text: '[12:01:04] enter · image (kling-v3) ║ voice (eleven-v3) — parallel' },
    { kind: 'ok',   text: '[12:01:09] step ok · image · 4.8s · $0.180' },
    { kind: 'ok',   text: '[12:01:09] step ok · voice · 0.5s · $0.012' },
    { kind: 'ok',   text: '[12:01:10] step ok · compose · 0.3s · $0.001' },
    { kind: 'comment', text: 'workflow done · total 6.9s · $0.194 · v3.2' },
  ],
  trace: [
    { kind: 'cmd',  text: 'each.traces.get("trace_8f2a3c1d")' },
    { kind: 'data', text: 'trace_id    trace_8f2a3c1d' },
    { kind: 'data', text: 'user_id     u_8f2a · tier=pro' },
    { kind: 'ok',   text: '+0.0s   enhance       · gpt-4o       · $0.001 · ok' },
    { kind: 'fail', text: '+0.4s   image.primary · kling-v3      · — · content_moderation' },
    { kind: 'ok',   text: '+0.6s   image.fallback · wan-2.7      · $0.180 · ok' },
    { kind: 'ok',   text: '+6.2s   audio         · eleven-v3    · $0.012 · ok' },
    { kind: 'comment', text: 'TOTAL · 6.8s · $0.194 · billed to u_8f2a' },
  ],
  attributes: [
    { kind: 'cmd',  text: 'each.run({ attrs: { user_id, tier, region, persona } })' },
    { kind: 'trace', text: 'tagged · user_id=u_8f2a' },
    { kind: 'trace', text: 'tagged · tier=pro' },
    { kind: 'trace', text: 'tagged · region=eu-west' },
    { kind: 'trace', text: 'tagged · persona=creator' },
    { kind: 'ok',   text: 'attributes recorded · 4 dimensions live' },
    { kind: 'cmd',  text: 'each.dashboard.cost_by("tier", "24h")' },
    { kind: 'data', text: 'pro $1,280 · team $840 · free $42 · screenshot → slack' },
  ],
  enhancer: [
    { kind: 'cmd',  text: 'each.run({ enhance: true, prompt: "a cat" })' },
    { kind: 'info', text: 'raw      "a cat"' },
    { kind: 'info', text: 'enhancer expanding for kling-v3 · brand_voice=playful_minimal' },
    { kind: 'ok',   text: 'enhanced "a tabby cat in golden hour, shallow DoF, vertical 9:16"' },
    { kind: 'info', text: 'kling-v3 dispatched · trace_8f2a' },
    { kind: 'ok',   text: 'output ready · 4.2s · $0.180 · trace_8f2a' },
    { kind: 'comment', text: '+34% avg quality lift vs raw input · zero prompt-engineering hires' },
  ],
  ab: [
    { kind: 'cmd',  text: 'each.run({ experiment: "kling-v3-vs-v2" })' },
    { kind: 'data', text: 'cohort kling-v3 · 5,238 calls · stable' },
    { kind: 'data', text: 'cohort kling-v2 · 5,219 calls · stable' },
    { kind: 'info', text: 'reaching significance · p < 0.05' },
    { kind: 'ok',   text: 'winner · kling-v3 · +9.1% quality · −3% latency' },
    { kind: 'warn', text: 'guardrail check · error_rate 0.04% < 1.0% threshold ✓' },
    { kind: 'ok',   text: 'auto-promoting kling-v3 to 100% · zero redeploys' },
  ],
};

const TOTAL_DURATION_S = 10; // full cycle including a brief reset

export function LiveTerminal({ slug }: { slug: ProductDef['slug'] }) {
  const lines = SCRIPTS[slug];
  const stagger = 0.85 / Math.max(1, lines.length); // % of cycle between lines

  return (
    <div className="font-mono text-[12px] md:text-[12.5px] leading-[1.85] text-ink2 w-full">
      {lines.map((line, i) => {
        const showStart = i * stagger;
        // Times must be strictly increasing.
        const t0 = Math.max(0, showStart);
        const t1 = Math.min(0.99, showStart + 0.04);
        const t2 = 0.94;
        const t3 = 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -3 }}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              x: [-3, -3, 0, 0, -3],
            }}
            transition={{
              duration: TOTAL_DURATION_S,
              times: [0, t0, t1, t2, t3],
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="flex gap-3 whitespace-nowrap overflow-hidden"
          >
            <span className={`${PREFIX_COLOR[line.kind]} shrink-0 w-3 select-none`}>
              {PREFIX[line.kind]}
            </span>
            <span className={`${TEXT_COLOR[line.kind]} truncate`}>{line.text}</span>
          </motion.div>
        );
      })}

      {/* Always-on blinking cursor at the end */}
      <div className="flex gap-3 mt-1">
        <span className="text-spark shrink-0 w-3 select-none">$</span>
        <motion.span
          className="inline-block w-2 h-4 bg-spark"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      </div>
    </div>
  );
}
