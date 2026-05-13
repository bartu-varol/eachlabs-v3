'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CodeBlock } from '@/components/ui/CodeBlock';

const QUICKSTART_CODE = `# 1. Install the SDK
npm install @eachlabs/sdk

# 2. Set your API key
export EACHLABS_API_KEY="elx_..."

# 3. Make a call
import { each } from "@eachlabs/sdk";

const result = await each({
  task:   "image",
  prompt: "a cat surfing at sunset",
  attrs:  { user_id: "u_123" },
});

console.log(result.url, result.trace_id, result.cost);
// → https://elx.cdn/.../img.png
// → trace_8f2a3c1d
// → 0.038`;

const SECTIONS = [
  {
    eyebrow: 'GETTING STARTED',
    items: [
      { title: 'Quickstart',     body: 'API key → first call in 3 minutes.', href: '#' },
      { title: 'Authentication', body: 'Bearer tokens, org keys, scopes.',   href: '#' },
      { title: 'Concepts',       body: 'Workflows, attributes, fallbacks.',  href: '#' },
    ],
  },
  {
    eyebrow: 'API REFERENCE',
    items: [
      { title: 'POST /v1/run',           body: 'Execute a workflow.',                       href: '#' },
      { title: 'GET /v1/runs/:id',       body: 'Fetch a run and its trace.',                href: '#' },
      { title: 'POST /v1/workflows',     body: 'Create or update a workflow.',              href: '#' },
      { title: 'GET /v1/models',         body: 'List models + capabilities.',               href: '#' },
      { title: 'POST /v1/experiments',   body: 'Start an A/B test.',                        href: '#' },
      { title: 'POST /v1/traces/export', body: 'Schedule trace export to S3 / BigQuery.',   href: '#' },
    ],
  },
  {
    eyebrow: 'SDKs',
    items: [
      { title: 'TypeScript / JavaScript', body: '@eachlabs/sdk · npm install', href: '#' },
      { title: 'Python',                  body: 'pip install eachlabs',         href: '#' },
      { title: 'Go',                      body: 'go get github.com/eachlabs/go', href: '#' },
      { title: 'Rust',                    body: 'cargo add eachlabs',           href: '#' },
    ],
  },
  {
    eyebrow: 'COOKBOOK',
    items: [
      { title: 'Build a consumer image generator', body: 'Multi-tier, fallback, moderation. 8 min.', href: '#' },
      { title: 'A/B two video models',             body: 'Sticky cohort + auto-promote. 6 min.',     href: '#' },
      { title: 'Per-user cost dashboards',         body: 'Tag, slice, export to BigQuery. 12 min.',  href: '#' },
      { title: 'Brand-safe ad fan-out',            body: '200 variants + brand_safety gate. 10 min.', href: '#' },
      { title: 'Streaming workflow outputs',       body: 'WebSockets + chunked responses. 7 min.',    href: '#' },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * DOCS
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[76px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[860px]">
            Read the docs. <span className="text-ink3 italic">Ship the same day.</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[640px] mt-7">
            Quickstart, API reference, SDKs, and 40+ end-to-end recipes.
          </p>
        </motion.div>
      </section>

      {/* Quickstart */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 0% 0%, rgb(var(--c-spark) / 0.05), transparent 65%)' }}
        />
        <div className="container py-20 md:py-24 relative">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● QUICKSTART
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink">
            From zero to first call in 3 minutes.
          </h2>
          <div className="mt-8">
            <CodeBlock
              code={QUICKSTART_CODE}
              filename="quickstart.sh + index.ts"
              language="ts + sh"
            />
          </div>
        </div>
      </section>

      {/* Sections */}
      {SECTIONS.map((s, i) => (
        <section key={s.eyebrow} className="container border-t border-rule py-20 md:py-24">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
            {s.eyebrow}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {s.items.map((it, j) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                transition={{ duration: 0.32, delay: (i * 0.04) + (j * 0.03) }}
              >
                <Link
                  href={it.href}
                  className="group flex items-center justify-between gap-4 bg-surface border border-rule2 rounded-md p-5 hover:border-spark/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="font-display font-semibold text-[16px] text-ink leading-tight truncate">
                      {it.title}
                    </div>
                    <div className="text-ink3 text-[13px] mt-1.5 leading-tight">{it.body}</div>
                  </div>
                  <ArrowRight size={16} className="text-ink3 group-hover:text-spark shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            Stuck? <span className="text-ink3 italic">4,200 devs are in our Discord.</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button href="https://discord.gg/eachlabs" variant="primary">Open Discord →</Button>
            <Button href="mailto:support@eachlabs.ai" variant="secondary">Email support</Button>
          </div>
        </div>
      </section>
    </>
  );
}
