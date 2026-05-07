import Link from 'next/link';
import { ReactNode } from 'react';

type QA = { q: string; a: ReactNode };

const InlineLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="text-spark hover:underline underline-offset-4">
    {children}
  </Link>
);

const ITEMS: QA[] = [
  {
    q: 'What does it cost?',
    a: (
      <>
        Pay-per-call. Free until you ship — 10K traces, no credit card. After that, you pay the model’s
        API price plus a thin platform fee. We never invoice “starting at.” Full pricing on the{' '}
        <InlineLink href="/pricing">pricing page</InlineLink>.
      </>
    ),
  },
  {
    q: 'Am I locked in?',
    a: (
      <>
        No. Cancel by deleting your API key. We don’t hold your prompts, your workflows, your call
        history, or your contracts hostage. Export anything, anytime.
      </>
    ),
  },
  {
    q: 'Do you train on my data?',
    a: <>No. Never have. Never will. It’s the first item on the Promise list above for a reason.</>,
  },
  {
    q: 'How is this different from Replicate or fal.ai?',
    a: (
      <>
        They give you model access. We give you model access plus the orchestration layer —
        quality-aware routing, automatic fallback, per-call tracing, A/B testing, workflows, version
        control. The boring parts. If all you need is one model occasionally, Replicate is fine. If
        you’re shipping AI in production, you’ll end up building what we already built.
      </>
    ),
  },
  {
    q: 'What’s the latency overhead?',
    a: (
      <>
        ~120ms for the router. Faster than a cold start on most providers, faster than a tweet,
        faster than the time it takes to read this answer.
      </>
    ),
  },
  {
    q: 'Can I self-host?',
    a: (
      <>
        Not today. We’re a hosted service — the routing intelligence relies on our cross-tenant
        signal. If you have a regulatory reason that forces self-hosting, talk to an engineer; we
        have a path for enterprise.
      </>
    ),
  },
  {
    q: 'What SDKs do you have?',
    a: (
      <>
        TypeScript, Python, Go. Plus a typed REST API. Same <code>each.run()</code> signature across
        all of them. Docs at <InlineLink href="/docs">/docs</InlineLink>.
      </>
    ),
  },
  {
    q: 'How fast can I migrate from another provider?',
    a: (
      <>
        If you’re on Replicate, fal.ai, or calling provider APIs directly, about an hour. The{' '}
        <code>each.run()</code> signature is similar enough to most that it’s mostly a
        search-and-replace job. Bring your hardest workflow to the migration call — we’ll port it
        live.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <section className="border-t border-rule py-24 md:py-32">
      <div className="max-w-[820px] mx-auto px-6 md:px-10">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
          * FAQ
        </div>
        <h2 className="font-display font-semibold text-5xl md:text-7xl tracking-tightest text-ink leading-none">
          FAQ
        </h2>
        <p className="italic text-ink3 text-[15px] mt-3">
          is anyone still reading faq?
        </p>

        <div className="mt-12 border-t border-rule">
          {ITEMS.map((item, i) => (
            <details key={i} className="group border-b border-rule py-5">
              <summary className="flex items-center justify-between cursor-pointer text-ink hover:text-spark transition-colors text-[16px] font-medium list-none [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="text-ink3 text-[20px] transition-transform duration-200 group-open:rotate-45 leading-none ml-4 select-none">
                  +
                </span>
              </summary>
              <div className="pt-4 text-ink2 text-[15px] leading-[1.6] max-w-[680px]">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <p className="italic text-ink3 text-[14px] text-center mt-12">
          Still have a question?{' '}
          <a
            href="mailto:engineer@eachlabs.ai"
            className="text-spark hover:underline underline-offset-4"
          >
            Ask an engineer →
          </a>
        </p>
      </div>
    </section>
  );
}
