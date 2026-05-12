'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Stat = { value: string; label: string };
type UseCase = {
  n: string;
  category: string;
  title: string;
  sub: string;
  body: string;
  stats: [Stat, Stat, Stat];
  usedBy: string[];
  accent: 'spark' | 'highlight' | 'success' | 'sun' | 'yellow' | 'ember';
};

const ACCENT_VAR: Record<UseCase['accent'], string> = {
  spark:     'rgb(var(--c-spark))',
  highlight: 'rgb(var(--c-highlight))',
  success:   'rgb(var(--c-success))',
  sun:       'rgb(var(--c-sun))',
  yellow:    'rgb(var(--c-yellow))',
  ember:     'rgb(var(--c-ember))',
};

const ACCENT_TINT: Record<UseCase['accent'], string> = {
  spark:     'rgb(var(--c-spark)     / 0.06)',
  highlight: 'rgb(var(--c-highlight) / 0.06)',
  success:   'rgb(var(--c-success)   / 0.06)',
  sun:       'rgb(var(--c-sun)       / 0.06)',
  yellow:    'rgb(var(--c-yellow)    / 0.06)',
  ember:     'rgb(var(--c-ember)     / 0.06)',
};

const USE_CASES: UseCase[] = [
  {
    n: '01',
    category: 'CONSUMER AI',
    title: 'Consumer creative apps',
    sub: 'Photo editors. Avatar generators. Social-first AI.',
    body:
      'Millions of end-users generating images, video, and audio inside your app. We keep latency low, costs predictable, and the lights on when a model crashes.',
    stats: [
      { value: '41×',  label: 'fewer user-visible errors' },
      { value: '<2s',  label: 'p50 latency for image gen' },
      { value: '8 mo', label: 'eng time saved on plumbing' },
    ],
    usedBy: ['NOVA', 'LUME', 'Prism', 'Maker'],
    accent: 'spark',
  },
  {
    n: '02',
    category: 'ENTERPRISE RETAIL',
    title: 'E-commerce & retail',
    sub: 'Product photography. Lifestyle imagery. Localized creative.',
    body:
      'Generate, regenerate, and localize thousands of product images and ad creatives — branded, on-spec, with the moderation and compliance baked in.',
    stats: [
      { value: '$2.1M',   label: 'saved on stock + studios in 12mo' },
      { value: '73%',     label: 'faster from brief to asset' },
      { value: '12 langs', label: 'localized in one workflow' },
    ],
    usedBy: ['Forma', 'Helix', 'Aster', 'Volt'],
    accent: 'success',
  },
  {
    n: '03',
    category: 'INTERNAL AI APPS',
    title: 'Internal AI tools',
    sub: 'Ops tooling. Internal content. Team-only generators.',
    body:
      'Build the AI features your internal teams need — slide decks, voiceovers, training data, support drafts — without standing up an entire ML platform yourself.',
    stats: [
      { value: '1 dev',    label: 'shipped 6 internal tools' },
      { value: '14 days',  label: 'from kick-off to first deploy' },
      { value: 'SSO+SAML', label: 'on day 1, no rebuild' },
    ],
    usedBy: ['Kairo', 'Orbit', 'Finch', 'Ondra'],
    accent: 'highlight',
  },
  {
    n: '04',
    category: 'MARKETING & BRAND',
    title: 'Marketing & brand creative',
    sub: 'Campaign assets. Social content. Brand-safe variants at scale.',
    body:
      'Generate the volume your brand calendar demands — campaign hero shots, social variants, regional adaptations — with brand-safety gates and full audit trails baked in.',
    stats: [
      { value: '120×',  label: 'more campaign variants' },
      { value: '48 hr', label: 'brief → published asset' },
      { value: 'audit', label: 'trail on every output' },
    ],
    usedBy: ['Aster', 'Forma', 'Helix', 'Volt'],
    accent: 'sun',
  },
  {
    n: '05',
    category: 'AD-TECH & GROWTH',
    title: 'Programmatic ad creative',
    sub: 'Performance ads. Live A/B. Per-creative attribution.',
    body:
      'Programmatic creative at the volume your campaigns demand. Generate, A/B in production, attribute to the user, and auto-promote the winning creative — all in real time.',
    stats: [
      { value: '260%', label: 'net retention via creative scale' },
      { value: '47×',  label: 'more variants per campaign' },
      { value: 'live', label: 'A/B winner auto-promotion' },
    ],
    usedBy: ['Forma', 'Orbit', 'Volt', 'Kairo'],
    accent: 'ember',
  },
  {
    n: '06',
    category: 'GAMING & LIVE-SERVICE',
    title: 'Game studios & live-ops',
    sub: 'NPCs. Textures. VO localization. Live-event content.',
    body:
      'Generate game-ready assets at the speed of live-service: characters and items, voice in 30+ languages, music cues for events, and texture variants on demand.',
    stats: [
      { value: '6 weeks', label: 'saved per content drop' },
      { value: '30+ langs', label: 'localized VO from one workflow' },
      { value: '1 dev',   label: 'shipped a live-event pipeline' },
    ],
    usedBy: ['Maker', 'Prism', 'Volt', 'Finch'],
    accent: 'yellow',
  },
];

function UseCaseBlock({ uc, idx }: { uc: UseCase; idx: number }) {
  const c = ACCENT_VAR[uc.accent];
  const tint = ACCENT_TINT[uc.accent];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative border-t border-rule overflow-hidden"
    >
      {/* Accent ambient — alternates left/right per index */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 60% at ${idx % 2 ? '100%' : '0%'} 30%, ${tint}, transparent 60%)`,
        }}
      />

      <div className="container py-20 md:py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16">
          {/* Left — title block */}
          <div>
            <div className="font-mono text-[11px] uppercase tracking-eyebrow flex items-center gap-3" style={{ color: c }}>
              <span>{uc.n} / {uc.category}</span>
            </div>
            <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink mt-5">
              {uc.title}
            </h2>
            <p className="text-ink2 italic text-[14px] mt-3">{uc.sub}</p>
            <p className="text-ink2 text-[15px] leading-[1.6] mt-5 max-w-[480px]">{uc.body}</p>
          </div>

          {/* Right — stats + usedBy */}
          <div>
            <div className="grid grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden">
              {uc.stats.map((s) => (
                <div key={s.label} className="bg-surface px-4 py-5 flex flex-col">
                  <div className="font-display font-semibold text-[22px] md:text-[26px] tabular-nums leading-none" style={{ color: c }}>
                    {s.value}
                  </div>
                  <div className="text-ink3 text-[11px] mt-2 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-3">
                USED BY
              </div>
              <div className="flex flex-wrap gap-2">
                {uc.usedBy.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 rounded-md border border-rule2 bg-surface text-ink2 text-[13px]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/customers"
              className="text-spark text-[13px] font-medium hover:underline underline-offset-4 inline-flex items-center gap-1.5 mt-7"
            >
              See the full breakdown <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function UseCasesPage() {
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
            * USE CASES
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[860px]">
            Pick the team you’re shipping for.
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[640px] mt-7">
            The same orchestration + observability platform powers six very different products.
            Find the one that looks like yours.
          </p>
        </motion.div>
      </section>

      {USE_CASES.map((uc, i) => (
        <UseCaseBlock key={uc.n} uc={uc} idx={i} />
      ))}

      {/* Bottom CTA */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.05), transparent 60%)',
          }}
        />
        <div className="container py-24 md:py-32 relative">
          <div className="max-w-[680px] mx-auto text-center">
            <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink">
              Don’t see yours?{' '}
              <span className="text-ink3 italic">It works the same way.</span>
            </h2>
            <p className="text-ink2 text-[15px] mt-6">
              Healthcare, ed-tech, real-estate — if you’re shipping a feature backed by AI models,
              the same story applies.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              <Button href="/signup" variant="primary">Start free →</Button>
              <Button href="/contact" variant="secondary">Talk to solutions</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
