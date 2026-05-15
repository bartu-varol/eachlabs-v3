'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * ABOUT EACH::LABS
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[940px]">
            <span className="block">We make AI</span>
            <span className="block">behave like</span>
            <span className="block text-ink3 italic">software.</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.6] max-w-[640px] mt-7">
            each::labs is the orchestration and observability layer for teams shipping AI to real
            users. One API for 600+ models, routing that fails over automatically, and traces that
            tell you exactly what happened, what it cost, and how long it took.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/career" variant="primary">
              We're hiring
            </Button>
            <Button href="/customers" variant="secondary">
              See who's using us
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ─── Stats strip ────────────────────────────────────────────────── */}
      <section className="border-t border-b border-rule bg-surface">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-rule">
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
                <div className="font-display font-semibold text-[28px] md:text-[36px] text-spark tabular-nums leading-none">
                  {s.v}
                </div>
                <div className="text-ink3 text-[12px] mt-2 uppercase tracking-eyebrow font-mono">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why we exist ───────────────────────────────────────────────── */}
      <section className="border-t border-rule">
        <div className="container py-20 md:py-24 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-20 items-start">
          <div className="md:sticky md:top-24">
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-3">
              WHY WE EXIST
            </div>
            <h2 className="font-display font-semibold text-[28px] md:text-[44px] leading-[1.05] tracking-tightest text-ink">
              The model layer changed.
              <span className="block text-ink3 italic">The plumbing didn't.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-6 text-ink2 text-[16px] leading-[1.7] max-w-[680px]">
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
      <section className="border-t border-rule">
        <div className="container py-20 md:py-24">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-3">
            WHAT WE BELIEVE
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            Four ideas we won't compromise on.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-12">
            {BELIEFS.map((b) => (
              <div
                key={b.label}
                className="bg-surface border border-rule2 rounded-md p-7 md:p-8"
              >
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
                  {b.label}
                </div>
                <h3 className="font-display font-semibold text-[22px] md:text-[24px] text-ink mt-3 leading-tight">
                  {b.title}
                </h3>
                <p className="text-ink2 text-[14.5px] leading-[1.65] mt-3">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline ───────────────────────────────────────────────────── */}
      <section className="border-t border-rule">
        <div className="container py-20 md:py-24">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-3">
            THE SHORT VERSION
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            Where we've been.
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden">
            {TIMELINE.map((t) => (
              <div key={t.year} className="bg-surface p-7 md:p-8">
                <div className="font-mono text-[11px] text-spark tracking-eyebrow">{t.year}</div>
                <h3 className="font-display font-semibold text-[20px] md:text-[22px] text-ink mt-3 leading-tight">
                  {t.title}
                </h3>
                <p className="text-ink2 text-[14px] leading-[1.6] mt-2">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="border-t border-rule">
        <div className="container py-20 md:py-24">
          <div className="bg-surface border border-rule2 rounded-md p-8 md:p-14 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center justify-between">
            <div className="max-w-[640px]">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mb-3">
                * COME WORK WITH US
              </div>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] leading-[1.05] tracking-tightest text-ink">
                We're a small team and we're hiring.
              </h2>
              <p className="text-ink2 text-[15px] leading-[1.6] mt-4">
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
