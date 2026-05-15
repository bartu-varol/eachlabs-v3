import { Check } from 'lucide-react';
import { DotIcon } from '@/components/auth/AuthTerminalShell';

/* ──────────────────────────────────────────────────────────────────────────
   SignupBrandPanel, "what you get" + fake terminal + tagline.
────────────────────────────────────────────────────────────────────────── */

const SIGNUP_PERKS = [
  { label: '600+ models · one API',     sub: 'one signature for everything'     },
  { label: '$0 to start · 10K traces',  sub: 'no credit card on file'           },
  { label: '99.99% uptime',             sub: 'no asterisks'                     },
  { label: '<120ms router overhead',    sub: 'faster than a tweet'              },
];

export function SignupBrandPanel() {
  return (
    <div className="w-full max-w-[440px] space-y-10">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
          * WHAT YOU GET
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {SIGNUP_PERKS.map((p) => (
            <li key={p.label} className="bg-surface flex items-start gap-3 px-4 py-3.5">
              <Check className="size-4 text-spark mt-[3px] shrink-0" strokeWidth={2.5} />
              <div>
                <div className="text-ink text-[14px] font-medium leading-tight">{p.label}</div>
                <div className="text-ink3 italic text-[12px] mt-0.5">{p.sub}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md border border-rule2 bg-bg overflow-hidden shadow-sm">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-rule2 text-black/50">
          <span aria-hidden className="size-2 rounded-full bg-fail/70 inline-flex items-center justify-center">
            <DotIcon color="red" className="size-1.5" />
          </span>
          <span aria-hidden className="size-2 rounded-full bg-sun/70 inline-flex items-center justify-center">
            <DotIcon color="yellow" className="size-1.5" />
          </span>
          <span aria-hidden className="size-2 rounded-full bg-success/70 inline-flex items-center justify-center">
            <DotIcon color="green" className="size-1.5" />
          </span>
          <span className="ml-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
            ~/your-app
          </span>
        </div>
        <div className="font-mono text-[12.5px] leading-[1.75] px-4 py-3.5 text-ink2">
          <div><span className="text-ink3">$</span> pip install eachlabs</div>
          <div><span className="text-ink3">$</span> export EACH_KEY=<span className="text-spark">sk_live_…</span></div>
          <div><span className="text-ink3">$</span> python app.py</div>
          <div className="text-ink3">  ▸ each() · gpt-5 · 252 tok</div>
          <div className="text-success">  ✓ 200 OK · 118ms · $0.0014</div>
        </div>
      </div>

      <p className="font-display italic text-[20px] text-ink2 leading-snug max-w-[380px]">
        We do the <span className="hero-underline not-italic text-ink font-semibold">boring parts.</span>
        <br />
        You ship the product.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SigninBrandPanel, status badge + network stats + changelog teaser.
────────────────────────────────────────────────────────────────────────── */

const SIGNIN_STATS = [
  { v: '284K', k: 'requests routed',     sub: 'across 600+ models'       },
  { v: '0',    k: 'user-visible errors', sub: 'fallback fires in <120ms' },
  { v: '14',   k: 'model swaps fired',   sub: 'your on call slept'       },
];

export function SigninBrandPanel() {
  return (
    <div className="w-full max-w-[440px] space-y-10">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
          * LAST 24H &middot; NETWORK-WIDE
        </div>
        <div className="mt-5 grid grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {SIGNIN_STATS.map((s) => (
            <div key={s.k} className="bg-surface px-4 py-4">
              <div className="font-display font-semibold text-[28px] tabular-nums text-spark leading-none">
                {s.v}
              </div>
              <div className="text-ink text-[11.5px] mt-2 font-medium leading-tight">{s.k}</div>
              <div className="text-ink3 italic text-[10.5px] mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-rule2 bg-bg p-4">
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
          * THIS WEEK &middot; CHANGELOG
        </div>
        <div className="mt-2 text-ink text-[14px] font-medium">
          each::router 1.4, quality-aware spill
        </div>
        <div className="text-ink3 italic text-[12px] mt-1">
          We now route around quality degradations, not just failures.
        </div>
      </div>

      <p className="font-display italic text-[20px] text-ink2 leading-snug max-w-[380px]">
        <span className="hero-underline not-italic text-ink font-semibold">The chaos</span>{' '}
        missed you.
      </p>
    </div>
  );
}
