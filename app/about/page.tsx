'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Eyebrow } from '@/components/ui/Eyebrow';

const BELIEFS = [
  {
    label: 'RELIABILITY',
    title: 'Production-first, demo-second.',
    body:
      'A model that works in a notebook and falls over under load is a liability. Everything we build is graded by what happens at the 99th percentile, not the average.',
  },
  {
    label: 'OBSERVABILITY',
    title: 'If you can\'t see it, you can\'t ship it.',
    body:
      'Per call traces, cost, latency, and routing decisions are exposed by default. Debugging shouldn\'t require a quarterly instrumentation sprint.',
  },
  {
    label: 'COMPOSITION',
    title: 'Many models, one surface.',
    body:
      '600+ models across providers, one consistent API. Swap providers without rewriting your stack, route by cost or capability, fail over automatically.',
  },
  {
    label: 'TASTE',
    title: 'Boring choices in the right places.',
    body:
      'We\'re excited about the model layer. We\'re deliberately conservative about everything underneath it, because reliability is more interesting than novelty.',
  },
];

const TIMELINE = [
  {
    year: '2024',
    title: 'Started in a room',
    body: 'Founded around a thesis: shipping AI to production is mostly infrastructure, not models.',
  },
  {
    year: '2025',
    title: 'One API, every model',
    body: 'Workflows, Router, and Observability launch. Hundreds of teams onboard in the first months.',
  },
  {
    year: '2026',
    title: '8M+ requests / month',
    body: 'Millions of requests routed across providers each month, with enterprise customers in production.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="* ABOUT EACH::LABS"
        headline={
          <>
            <span className="block">We make AI</span>
            <span className="block">behave like</span>
            <span className="block text-ink-faint italic">software.</span>
          </>
        }
        description="each::labs is the orchestration and observability layer for teams shipping AI to real users. One API for 600+ models, routing that fails over automatically, and traces that tell you exactly what happened, what it cost, and how long it took."
        ctas={
          <>
            <Button href="/career" variant="primary">We're hiring</Button>
            <Button href="/customers" variant="secondary">See who's using us</Button>
          </>
        }
      />

      {/* ─── Stats strip ────────────────────────────────────────────────── */}
      <section className="border-t border-b border-divider bg-surface-raised">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-divider">
            {[
              { v: '600+', l: 'models · one API' },
              { v: '8M+',  l: 'requests / month' },
              { v: '10+',  l: 'production teams' },
              { v: '99.99%', l: 'uptime' },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`px-5 py-8 md:py-10 ${i === 2 || i === 3 ? 'md:border-t-0' : ''}`}
              >
                <div className="font-sans font-semibold text-h2 md:text-h2 text-brand tabular-nums leading-none">
                  {s.v}
                </div>
                <div className="text-ink-faint text-caption mt-2 uppercase tracking-eyebrow font-mono">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why we exist ───────────────────────────────────────────────── */}
      <section className="border-t border-divider">
        <div className="container py-20 md:py-24 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-20 items-start">
          <div className="md:sticky md:top-24">
            <Eyebrow size="sm" tone="ink-faint" className="mb-3">WHY WE EXIST</Eyebrow>
            <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
              The model layer changed.
              <span className="block text-ink-faint italic">The plumbing didn't.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 text-ink-muted text-body-lg leading-[1.7] max-w-[680px]">
            <p>
              In 2023, the question was <em className="text-ink not-italic">which model</em>. By
              2025, it was <em className="text-ink not-italic">all of them, at once, reliably</em>.
              Teams started running three or four providers in parallel, swapping models per task,
              and discovering that the hard part wasn't the prompt, it was everything around it.
            </p>
            <p>
              Routing decisions, cost attribution, fallbacks, retries, evals, observability, fine
              control over which request hits which model and why. Each of these is a project on
              its own, and most teams end up building half of them in-house, badly, twice.
            </p>
            <p>
              each::labs is what we wish we had when we were the team in that room. One API across
              600+ models, a router that picks the right one and fails over when it doesn't, and
              per call traces that answer "what happened, what did it cost, where did it go" without
              an instrumentation sprint.
            </p>
            <p className="text-ink">
              The model layer keeps moving. Our job is to make sure the rails underneath stay
              boring enough that you can sleep on them.
            </p>
          </div>
        </div>
      </section>

      {/* ─── What we believe ────────────────────────────────────────────── */}
      <section className="border-t border-divider">
        <div className="container py-20 md:py-24">
          <Eyebrow size="sm" tone="ink-faint" className="mb-3">WHAT WE BELIEVE</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            Four ideas we won't compromise on.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-12">
            {BELIEFS.map((b) => (
              <div
                key={b.label}
                className="bg-surface-raised border border-field rounded-md p-7 md:p-8"
              >
                <Eyebrow size="sm">{b.label}</Eyebrow>
                <h3 className="font-sans font-semibold text-h3 md:text-h3 text-ink mt-3 leading-tight">
                  {b.title}
                </h3>
                <p className="text-ink-muted text-body leading-[1.65] mt-3">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline ───────────────────────────────────────────────────── */}
      <section className="border-t border-divider">
        <div className="container py-20 md:py-24">
          <Eyebrow size="sm" tone="ink-faint" className="mb-3">THE SHORT VERSION</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            Where we've been.
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden">
            {TIMELINE.map((t) => (
              <div key={t.year} className="bg-surface-raised p-7 md:p-8">
                <div className="font-mono text-eyebrow text-brand tracking-eyebrow">{t.year}</div>
                <h3 className="font-sans font-semibold text-h4 md:text-h3 text-ink mt-3 leading-tight">
                  {t.title}
                </h3>
                <p className="text-ink-muted text-body leading-[1.6] mt-2">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="border-t border-divider">
        <div className="container py-20 md:py-24">
          <div className="bg-surface-raised border border-field rounded-md p-8 md:p-14 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center justify-between">
            <div className="max-w-[640px]">
              <Eyebrow size="sm" className="mb-3">* COME WORK WITH US</Eyebrow>
              <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
                We're a small team and we're hiring.
              </h2>
              <p className="text-ink-muted text-body-lg leading-[1.6] mt-4">
                Remote, async, four open roles across engineering, support, and sales. If you've
                ever wanted to work on infra that real teams ship on every day, this is the door.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button href="/career" variant="primary">
                View open roles <ArrowRight size={14} className="ml-2" />
              </Button>
              <Button href="/contact-us" variant="secondary">
                Get in touch
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
