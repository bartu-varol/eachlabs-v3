import Link from 'next/link';
import { ReactNode } from 'react';
import { FaqShowcase, type FaqItem } from '@/components/ui/FaqShowcase';

const InlineLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="text-brand hover:underline underline-offset-4">
    {children}
  </Link>
);

const ITEMS: FaqItem[] = [
  {
    q: 'What does it cost?',
    tag: 'PRICING',
    a: (
      <>
        Pay-per-call. Free until you ship, 10K traces, no credit card. After that, you pay the
        model’s API price plus a thin platform fee. We never invoice “starting at.” Full pricing
        on the <InlineLink href="/pricing">pricing page</InlineLink>.
      </>
    ),
  },
  {
    q: 'Am I locked in?',
    tag: 'LOCK-IN',
    a: (
      <>
        No. Cancel by deleting your API key. We don’t hold your prompts, your workflows, your
        call history, or your contracts hostage. Export anything, anytime.
      </>
    ),
  },
  {
    q: 'Do you train on my data?',
    tag: 'PRIVACY',
    a: <>No. Never have. Never will. It’s the first item on the Promise list above for a reason.</>,
  },
  {
    q: 'How is this different from Replicate or fal.ai?',
    tag: 'COMPARE',
    a: (
      <>
        They give you model access. We give you model access plus the orchestration layer:
        quality-aware routing, automatic fallback, per-call tracing, A/B testing, workflows,
        version control. The boring parts. If all you need is one model occasionally, Replicate
        is fine. If you’re shipping AI in production, you’ll end up building what we already
        built.
      </>
    ),
  },
  {
    q: 'What’s the latency overhead?',
    tag: 'LATENCY',
    a: (
      <>
        ~120ms for the router. Faster than a cold start on most providers, faster than a tweet,
        faster than the time it takes to read this answer.
      </>
    ),
  },
  {
    q: 'Can I self-host?',
    tag: 'DEPLOY',
    a: (
      <>
        Not today. We’re a hosted service, the routing intelligence relies on our cross-tenant
        signal. If you have a regulatory reason that forces self-hosting, talk to an engineer;
        we have a path for enterprise.
      </>
    ),
  },
  {
    q: 'What SDKs do you have?',
    tag: 'SDKs',
    a: (
      <>
        TypeScript, Python, Go. Plus a typed REST API. Same <code>each()</code> signature
        across all of them. Docs at <InlineLink href="/docs">/docs</InlineLink>.
      </>
    ),
  },
  {
    q: 'How fast can I migrate from another provider?',
    tag: 'MIGRATE',
    a: (
      <>
        If you’re on Replicate, fal.ai, or calling provider APIs directly, about an hour. The{' '}
        <code>each()</code> signature is similar enough to most that it’s mostly a
        search-and-replace job. Bring your hardest workflow to the migration call, we’ll port
        it live.
      </>
    ),
  },
];

export function FAQ() {
  return (
    <FaqShowcase
      items={ITEMS}
      heading="FAQ"
      subtitle="is anyone still reading faq?"
      footer={
        <>
          Still have a question?{' '}
          <a
            href="mailto:support@eachlabs.ai"
            className="text-brand hover:underline underline-offset-4 not-italic"
          >
            Ask an engineer →
          </a>
        </>
      }
    />
  );
}
