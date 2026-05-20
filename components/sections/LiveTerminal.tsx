'use client';

import { motion } from 'framer-motion';
import type { ProductDef } from '@/lib/products';

/* ──────────────────────────────────────────────────────────────────────────
   LiveTerminal, a streaming log/terminal feed per product.
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
  cmd:     'text-brand',
  ok:      'text-ok',
  fail:    'text-brand',
  warn:    'text-caution',
  info:    'text-ink-muted',
  trace:   'text-brand',
  data:    'text-cobrand',
  comment: 'text-ink-faint',
};

const TEXT_COLOR: Record<LineKind, string> = {
  cmd:     'text-ink',
  ok:      'text-ink',
  fail:    'text-ink',
  warn:    'text-ink-muted',
  info:    'text-ink-muted',
  trace:   'text-ink-muted',
  data:    'text-ink',
  comment: 'text-ink-faint',
};

/* Per-product mock terminal scripts, each plays a believable production scene. */
const SCRIPTS: Record<ProductDef['slug'], Line[]> = {
  router: [
    { kind: 'cmd',  text: 'each("seedance-2.0-i2v", input, { fallback: ["wan-2.7"] })' },
    { kind: 'ok',   text: '[03:14:22] seedance-2.0 · 200 · 892ms · trace_8f2a' },
    { kind: 'fail', text: '[03:14:24] seedance-2.0 · 503 · upstream timeout · trace_8f2c' },
    { kind: 'trace', text: '[03:14:24] failover armed → wan-2.7' },
    { kind: 'ok',   text: '[03:14:24] wan-2.7 · 200 · 124ms · trace_8f2c · ✓ recovered' },
    { kind: 'ok',   text: '[03:14:25] seedance-2.0 · 200 · 901ms · trace_8f2d' },
    { kind: 'comment', text: 'no pages fired · uptime preserved · 99.99%' },
  ],
  workflows: [
    { kind: 'cmd',  text: 'each({ workflow: "product-photo-v3" })' },
    { kind: 'info', text: '[12:01:03] enter · enhance (gpt-4o)' },
    { kind: 'ok',   text: '[12:01:04] step ok · enhance · 0.4s · $0.001' },
    { kind: 'info', text: '[12:01:04] enter · video (veo-3.1) ║ voice (eleven-v3), parallel' },
    { kind: 'ok',   text: '[12:01:09] step ok · image · 4.8s · $0.180' },
    { kind: 'ok',   text: '[12:01:09] step ok · voice · 0.5s · $0.012' },
    { kind: 'ok',   text: '[12:01:10] step ok · compose · 0.3s · $0.001' },
    { kind: 'comment', text: 'workflow done · total 6.9s · $0.194 · v3.2' },
  ],
  enhancer: [
    { kind: 'cmd',  text: 'each({ enhance: true, model: "nano-banana-2", prompt })' },
    { kind: 'info', text: 'raw prompt → nano-banana-2 · predicted_error 12.4% (refusal · malformed)' },
    { kind: 'info', text: 'enhancer reshaping · target=nano-banana-2 · 178ms' },
    { kind: 'ok',   text: 'enhanced prompt → nano-banana-2 · predicted_error 0.9%' },
    { kind: 'ok',   text: 'output ready · 4.2s · $0.180 · no refusal · schema ok' },
    { kind: 'data', text: 'cohort · 1,000 calls · raw 124 errors · enhanced 9 errors' },
    { kind: 'comment', text: '12× fewer errors vs raw provider · same model · same call' },
  ],
  sense: [
    { kind: 'cmd',  text: 'each.sense → "make a 6s product video with a voiceover"' },
    { kind: 'info', text: '[03:14:22] sense · parsing intent · 600 models cross-checked' },
    { kind: 'trace', text: '[03:14:22] selected · wan-2.5 (video) · suno-v3 (voice) · compose' },
    { kind: 'data', text: 'workflow assembled · 3 steps · est $0.19 · 6.4s · 1 trace' },
    { kind: 'ok',   text: '[03:14:23] step ok · video · 4.8s · wan-2.5 · trace_b1' },
    { kind: 'ok',   text: '[03:14:23] step ok · voice · 0.5s · suno-v3 · trace_b2' },
    { kind: 'comment', text: 'one prompt · 3 models · 1 workflow · OpenAI compatible' },
  ],
};

const TOTAL_DURATION_S = 10; // full cycle including a brief reset

export function LiveTerminal({ slug }: { slug: ProductDef['slug'] }) {
  const lines = SCRIPTS[slug];
  const stagger = 0.85 / Math.max(1, lines.length); // % of cycle between lines

  return (
    <div className="font-mono text-caption md:text-caption leading-[1.85] text-ink-muted w-full">
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
        <span className="text-brand shrink-0 w-3 select-none">$</span>
        <motion.span
          className="inline-block w-2 h-4 bg-brand"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        />
      </div>
    </div>
  );
}
