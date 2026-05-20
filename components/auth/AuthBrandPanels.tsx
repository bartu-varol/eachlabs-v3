import { Check } from 'lucide-react';
import { DotIcon } from '@/components/auth/AuthTerminalShell';
import { Eyebrow } from '@/components/ui/Eyebrow';

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
        <Eyebrow>* WHAT YOU GET</Eyebrow>
        <ul className="mt-5 grid grid-cols-1 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {SIGNUP_PERKS.map((p) => (
            <li key={p.label} className="bg-surface-raised flex items-start gap-3 px-4 py-3.5">
              <Check className="size-4 text-brand mt-[3px] shrink-0" strokeWidth={2.5} />
              <div>
                <div className="text-ink text-body font-medium leading-tight">{p.label}</div>
                <div className="text-ink-faint italic text-caption mt-0.5">{p.sub}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-md border border-field bg-surface overflow-hidden shadow-sm">
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-field text-black/50">
          <span aria-hidden className="size-2 rounded-full bg-danger/70 inline-flex items-center justify-center">
            <DotIcon color="red" className="size-1.5" />
          </span>
          <span aria-hidden className="size-2 rounded-full bg-glow/70 inline-flex items-center justify-center">
            <DotIcon color="yellow" className="size-1.5" />
          </span>
          <span aria-hidden className="size-2 rounded-full bg-ok/70 inline-flex items-center justify-center">
            <DotIcon color="green" className="size-1.5" />
          </span>
          <span className="ml-3 font-mono text-micro uppercase tracking-eyebrow text-ink-faint">
            ~/your-app
          </span>
        </div>
        <div className="font-mono text-caption leading-[1.75] px-4 py-3.5 text-ink-muted">
          <div><span className="text-ink-faint">$</span> pip install eachlabs</div>
          <div><span className="text-ink-faint">$</span> export EACH_KEY=<span className="text-brand">sk_live_…</span></div>
          <div><span className="text-ink-faint">$</span> python app.py</div>
          <div className="text-ink-faint">  ▸ each() · gpt-5 · 252 tok</div>
          <div className="text-ok">  ✓ 200 OK · 118ms · $0.0014</div>
        </div>
      </div>

      <p className="font-sans italic text-h4 text-ink-muted leading-snug max-w-[380px]">
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
        <Eyebrow size="sm">* LAST 24H &middot; NETWORK-WIDE</Eyebrow>
        <div className="mt-5 grid grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {SIGNIN_STATS.map((s) => (
            <div key={s.k} className="bg-surface-raised px-4 py-4">
              <div className="font-sans font-semibold text-h2 tabular-nums text-brand leading-none">
                {s.v}
              </div>
              <div className="text-ink text-eyebrow mt-2 font-medium leading-tight">{s.k}</div>
              <div className="text-ink-faint italic text-micro mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-field bg-surface p-4">
        <Eyebrow size="sm">* THIS WEEK &middot; CHANGELOG</Eyebrow>
        <div className="mt-2 text-ink text-body font-medium">
          each::router 1.4, quality-aware spill
        </div>
        <div className="text-ink-faint italic text-caption mt-1">
          We now route around quality degradations, not just failures.
        </div>
      </div>

      <p className="font-sans italic text-h4 text-ink-muted leading-snug max-w-[380px]">
        <span className="hero-underline not-italic text-ink font-semibold">The chaos</span>{' '}
        missed you.
      </p>
    </div>
  );
}
