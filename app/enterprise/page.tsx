'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, KeyRound, FileSearch, Globe2, Server, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { enterprise } from '@/lib/content';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const ACCENT_VAR: Record<string, string> = {
  spark:     'rgb(var(--c-spark))',
  highlight: 'rgb(var(--c-highlight))',
  success:   'rgb(var(--c-success))',
  sun:       'rgb(var(--c-sun))',
  ember:     'rgb(var(--c-ember))',
  yellow:    'rgb(var(--c-yellow))',
};

const ACCENT_TINT: Record<string, { tint: string; deep: string }> = {
  spark:     { tint: 'rgb(var(--c-spark)     / 0.06)', deep: 'rgb(var(--c-spark)     / 0.12)' },
  highlight: { tint: 'rgb(var(--c-highlight) / 0.06)', deep: 'rgb(var(--c-highlight) / 0.12)' },
  success:   { tint: 'rgb(var(--c-success)   / 0.06)', deep: 'rgb(var(--c-success)   / 0.12)' },
  sun:       { tint: 'rgb(var(--c-sun)       / 0.06)', deep: 'rgb(var(--c-sun)       / 0.12)' },
  ember:     { tint: 'rgb(var(--c-ember)     / 0.06)', deep: 'rgb(var(--c-ember)     / 0.12)' },
  yellow:    { tint: 'rgb(var(--c-yellow)    / 0.06)', deep: 'rgb(var(--c-yellow)    / 0.12)' },
};

const CAPABILITY_ICONS = [Server, KeyRound, FileSearch, Globe2, Shield, Compass];

/* ──────────────────────────────────────────────────────────────────────────
   HeroIncidentTimeline, replaces the standard widget on enterprise. Shows a
   single incident playing out in real time: primary fails → failover →
   on-call paged → RCA filed. The visual reinforces "we wake up so you don't."
────────────────────────────────────────────────────────────────────────── */
function HeroIncidentTimeline() {
  const events = [
    { t: 'T+0ms',    label: 'kling-v3',  state: 'fail',     note: 'provider timeout' },
    { t: 'T+118ms',  label: 'wan-2.7',   state: 'recover',  note: 'fallback · user sees response' },
    { t: 'T+28s',    label: 'oncall',    state: 'paged',    note: 'engineer ack · investigating' },
    { t: 'T+19h',    label: 'rca.pdf',   state: 'filed',    note: 'root cause · sent · signed' },
  ];

  const stateClass = {
    fail:    'text-fail',
    recover: 'text-spark',
    paged:   'text-sun',
    filed:   'text-success',
  } as const;

  const stateDot = {
    fail:    'bg-fail',
    recover: 'bg-spark',
    paged:   'bg-sun',
    filed:   'bg-success',
  } as const;

  return (
    <div className="relative rounded-md border border-rule2 bg-surface/80 backdrop-blur p-5 md:p-6 overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-rule pb-3 mb-4">
        <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-spark">
          * LIVE INCIDENT REPLAY
        </div>
        <div className="font-mono text-[10.5px] text-ink3 flex items-center gap-1.5">
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full bg-success"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          sla, 99.99%
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-5">
        {/* Vertical rail */}
        <div className="absolute left-1.5 top-1 bottom-1 w-px bg-rule" />

        {events.map((ev, i) => (
          <motion.div
            key={ev.t}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.4 + i * 0.6, ease: EASE_OUT_EXPO }}
            className="relative flex items-baseline gap-3 py-2.5"
          >
            <motion.span
              className={`absolute -left-[15px] top-[10px] inline-block w-2 h-2 rounded-full ${stateDot[ev.state as keyof typeof stateDot]}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.6 }}
              style={{
                boxShadow: ev.state === 'recover'
                  ? '0 0 12px 2px rgb(var(--c-spark) / 0.4)'
                  : ev.state === 'fail'
                  ? '0 0 8px 1px rgb(var(--c-fail) / 0.4)'
                  : undefined,
              }}
            />
            <span className="font-mono text-[11px] tabular-nums text-ink3 w-14 shrink-0">
              {ev.t}
            </span>
            <span className={`font-mono text-[13px] ${stateClass[ev.state as keyof typeof stateClass]}`}>
              {ev.label}
            </span>
            <span className="font-mono text-[11.5px] text-ink2 italic">
              {ev.note}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Footer caption */}
      <div className="border-t border-rule mt-4 pt-3">
        <p className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
          your user saw a response. <span className="text-spark">your on-call slept.</span>
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Hero
────────────────────────────────────────────────────────────────────────── */
function EnterpriseHero() {
  const { hero } = enterprise;

  return (
    <section className="container py-20 md:py-24 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="text-center lg:text-left"
        >
          {/* Pill */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-eyebrow">
            <span className="text-spark">{hero.pill}</span>
            <span className="text-ink3">·</span>
            <Link
              href={hero.pillHref}
              className="text-ink2 hover:text-ink transition-colors normal-case tracking-normal"
            >
              {hero.pillCta}
            </Link>
          </div>

          {/* H1 */}
          <h1 className="font-display font-semibold text-[44px] sm:text-[56px] md:text-[68px] lg:text-[72px] leading-[0.98] tracking-tightest mt-8 text-ink">
            <span className="block">
              {hero.headline.line1}
              <span className="hero-underline">{hero.headline.line1Underline}</span>
            </span>
            <span className="block">
              <span className="text-ink3">{hero.headline.line2Prefix}</span>{' '}
              <em className="text-spark">{hero.headline.line2Emph}</em>
            </span>
          </h1>

          {/* Body */}
          <p className="text-[15.5px] leading-[1.6] text-ink2 max-w-[560px] mx-auto lg:mx-0 mt-7">
            <strong className="text-ink font-semibold">{hero.bodyLead}</strong>
            {hero.body.split('each.run()').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <code className="!bg-transparent !border-0 !p-0 text-spark">each.run()</code>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
            <Button href={hero.ctas[0].href} variant="primary">
              {hero.ctas[0].label}
            </Button>
            <Button href={hero.ctas[1].href} variant="secondary">
              {hero.ctas[1].label}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden max-w-[640px] mx-auto lg:mx-0">
            {hero.stats.map((s) => (
              <div key={s.label} className="bg-surface px-4 py-4 text-left">
                <div className="font-display font-semibold text-[22px] md:text-[24px] text-spark tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="text-ink text-[11px] mt-1.5 font-medium">{s.label}</div>
                <div className="text-ink3 text-[10.5px] italic mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Subtext */}
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-7">
            {hero.subtext}
          </p>
        </motion.div>

        {/* Right, incident timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
          className="relative"
        >
          <HeroIncidentTimeline />
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   "What enterprise means", comparison rows
────────────────────────────────────────────────────────────────────────── */
function MeansWhat() {
  const { meansWhat } = enterprise;

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        {meansWhat.eyebrow}
      </div>
      <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink max-w-[820px]">
        <span className="block">{meansWhat.headline.line1}</span>
        <span className="block text-ink3 italic">{meansWhat.headline.line2}</span>
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.6] max-w-[680px] mt-5">
        {meansWhat.body}
      </p>

      {/* Comparison grid */}
      <div className="mt-10 border border-rule rounded-md overflow-hidden">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-[140px_1fr_1fr] bg-surface2 border-b border-rule">
          <div className="px-5 py-3 font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
            * TOPIC
          </div>
          <div className="px-5 py-3 font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 border-l border-rule">
            OTHER PLATFORMS
          </div>
          <div className="px-5 py-3 font-mono text-[10.5px] uppercase tracking-eyebrow text-spark border-l border-rule">
            EACH::LABS
          </div>
        </div>

        {meansWhat.rows.map((row, i) => (
          <motion.div
            key={row.topic}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: EASE_OUT_EXPO }}
            className={`grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] ${
              i !== meansWhat.rows.length - 1 ? 'border-b border-rule' : ''
            } bg-surface`}
          >
            <div className="px-5 py-5 md:py-6">
              <div className="font-display font-semibold text-[15px] text-ink md:text-[14px] md:text-ink2 md:uppercase md:tracking-eyebrow md:font-mono md:text-[10.5px]">
                {row.topic}
              </div>
            </div>
            <div className="px-5 py-3 md:py-6 md:border-l border-rule">
              <div className="md:hidden font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-1">
                Others
              </div>
              <p className="text-ink3 text-[14px] leading-[1.55] line-through decoration-ink3/30">
                {row.others}
              </p>
            </div>
            <div className="px-5 py-5 md:py-6 md:border-l border-rule">
              <div className="md:hidden font-mono text-[10px] uppercase tracking-eyebrow text-spark mb-1">
                each::labs
              </div>
              <p className="text-ink text-[14px] leading-[1.55]">{row.ours}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Capabilities, 6 tiles, each with "why this exists"
────────────────────────────────────────────────────────────────────────── */
function Capabilities() {
  const { capabilities } = enterprise;

  return (
    <section className="relative border-t border-rule overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 50% at 0% 0%, rgb(var(--c-spark) / 0.05), transparent 60%), radial-gradient(ellipse 40% 50% at 100% 100%, rgb(var(--c-highlight) / 0.05), transparent 60%)',
        }}
      />

      <div className="container py-24 md:py-28 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          {capabilities.eyebrow}
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink max-w-[820px]">
          <span className="block">{capabilities.headline.line1}</span>
          <span className="block text-ink3 italic">{capabilities.headline.line2}</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {capabilities.tiles.map((tile, i) => {
            const accent = ACCENT_TINT[tile.accent];
            const accentVar = ACCENT_VAR[tile.accent];
            const Icon = CAPABILITY_ICONS[i] ?? Shield;

            return (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE_OUT_EXPO }}
                whileHover={{ y: -2 }}
                className="group relative rounded-md border border-rule2 overflow-hidden hover:[border-color:var(--c)] transition-colors"
                style={{
                  ['--c' as string]: accentVar,
                  background: `linear-gradient(135deg, ${accent.deep} 0%, rgb(var(--c-surface)) 50%, ${accent.tint} 100%)`,
                }}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-rule2"
                      style={{ color: accentVar, background: 'rgb(var(--c-bg))' }}
                    >
                      <Icon size={16} />
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-ink3 group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>

                  <h3 className="font-display font-semibold text-[20px] md:text-[22px] leading-tight text-ink mt-5">
                    {tile.title}
                  </h3>
                  <p className="text-ink2 text-[14px] leading-[1.55] mt-2.5">
                    {tile.body}
                  </p>

                  <div className="mt-5 pt-4 border-t border-rule">
                    <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-1.5">
                      * WHY THIS EXISTS
                    </div>
                    <p className="text-ink2 text-[12.5px] leading-[1.55] italic">
                      {tile.why}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   The 3AM Promise, timeline section
────────────────────────────────────────────────────────────────────────── */
function ThreeAmPromise() {
  const { threeAm } = enterprise;

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        {threeAm.eyebrow}
      </div>
      <h2 className="font-display font-semibold text-[34px] md:text-[56px] leading-[1] tracking-tightest text-ink max-w-[920px]">
        <span className="block text-ink">{threeAm.headline.line1}</span>
        <span className="block text-ink">{threeAm.headline.line2}</span>
        <span className="block text-ink3 italic">{threeAm.headline.line3}</span>
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.6] max-w-[680px] mt-6">
        {threeAm.body}
      </p>

      {/* Timeline grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden">
        {threeAm.steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: EASE_OUT_EXPO }}
            className="bg-surface p-6 relative"
          >
            <div className="font-mono text-[11px] tabular-nums text-spark mb-3">
              {step.time}
            </div>
            <h3 className="font-display font-semibold text-[18px] text-ink leading-tight mb-2">
              {step.title}
            </h3>
            <p className="text-ink2 text-[13.5px] leading-[1.6]">{step.body}</p>

            {/* Arrow between steps on desktop */}
            {i < threeAm.steps.length - 1 && (
              <div
                aria-hidden
                className="hidden md:block absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-surface border-t border-r border-rule rotate-45 z-10"
              />
            )}
          </motion.div>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-8">
        {threeAm.footnote}
      </p>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Outcomes, 3 deep case studies
────────────────────────────────────────────────────────────────────────── */
function Outcomes() {
  const { outcomes } = enterprise;

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        {outcomes.eyebrow}
      </div>
      <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink max-w-[820px]">
        <span className="block">{outcomes.headline.line1}</span>
        <span className="block text-ink3 italic">{outcomes.headline.line2}</span>
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {outcomes.cards.map((card, i) => (
          <motion.div
            key={card.industry}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_OUT_EXPO }}
            whileHover={{ y: -3 }}
            className="bg-surface border border-rule2 rounded-md p-7 flex flex-col hover:border-spark/40 transition-colors"
          >
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
              {card.industry}
            </div>

            <div className="mt-6 mb-2">
              <div className="font-display font-semibold text-[56px] md:text-[64px] leading-none text-spark tabular-nums tracking-tightest">
                {card.metric}
              </div>
              <div className="text-ink text-[14px] font-medium mt-2">{card.metricLabel}</div>
              <div className="text-ink3 text-[12.5px] italic mt-0.5">{card.secondary}</div>
            </div>

            <p className="text-ink2 text-[13.5px] leading-[1.65] mt-5">{card.body}</p>

            <div className="mt-auto pt-5 border-t border-rule">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-1.5">
                * CONTRACT
              </div>
              <p className="font-mono text-[11.5px] text-ink2">{card.contract}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Architecture, text-based wire diagram
────────────────────────────────────────────────────────────────────────── */
function Architecture() {
  const { architecture } = enterprise;

  return (
    <section className="border-t border-rule py-24 md:py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 50%, rgb(var(--c-highlight) / 0.04), transparent 65%)',
        }}
      />

      <div className="container relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          {architecture.eyebrow}
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink max-w-[820px]">
          <span className="block">{architecture.headline.line1}</span>
          <span className="block text-ink3 italic">{architecture.headline.line2}</span>
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.6] max-w-[640px] mt-5">
          {architecture.body}
        </p>

        {/* Wire diagram, 3 main nodes in a horizontal flow */}
        <div className="mt-14 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-0 relative">
            {architecture.nodes.map((node, i) => (
              <div key={node.label} className="relative flex">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                  transition={{ duration: 0.4, delay: i * 0.15, ease: EASE_OUT_EXPO }}
                  className="flex-1 bg-surface border border-rule2 rounded-md p-6 md:m-2 relative z-10"
                >
                  <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mb-2">
                    * NODE / 0{i + 1}
                  </div>
                  <div className="font-display font-semibold text-[20px] text-ink leading-tight">
                    {node.label}
                  </div>
                  <div className="text-ink2 text-[12.5px] mt-1.5 font-mono">
                    {node.sub}
                  </div>
                </motion.div>

                {/* Connector arrow (desktop only) */}
                {i < architecture.nodes.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden md:flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20 items-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                      className="w-8 h-8 rounded-full bg-bg border border-rule2 flex items-center justify-center"
                    >
                      <ArrowRight size={14} className="text-spark" />
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidecar callouts */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {architecture.sidecars.map((side, i) => (
              <motion.div
                key={side.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -40px 0px' }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                className="border border-dashed border-rule2 rounded-md p-5 bg-surface/40"
              >
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-1.5">
                  * SIDECAR
                </div>
                <div className="font-display font-semibold text-[15px] text-ink">{side.title}</div>
                <p className="text-ink2 text-[12.5px] leading-[1.55] mt-1 font-mono">
                  {side.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Procurement assets, anchor: #sla
────────────────────────────────────────────────────────────────────────── */
function Procurement() {
  const { procurement } = enterprise;

  return (
    <section
      id="sla"
      className="container border-t border-rule py-24 md:py-28 scroll-mt-24"
    >
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        {procurement.eyebrow}
      </div>
      <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink max-w-[820px]">
        <span className="block">{procurement.headline.line1}</span>
        <span className="block text-ink3 italic">{procurement.headline.line2}</span>
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.6] max-w-[680px] mt-5">
        {procurement.body}
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {procurement.assets.map((asset, i) => (
          <motion.a
            key={asset.title}
            href={asset.href}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: EASE_OUT_EXPO }}
            whileHover={{ y: -2 }}
            className="group block bg-surface border border-rule2 rounded-md p-6 hover:border-spark/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-display font-semibold text-[16px] text-ink leading-tight">
                  {asset.title}
                </h3>
                <p className="text-ink3 text-[12px] mt-1 font-mono">{asset.sub}</p>
              </div>
              <ArrowRight
                size={16}
                className="text-ink3 group-hover:text-spark group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
              />
            </div>
            <div className="mt-5 pt-4 border-t border-rule">
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2 group-hover:text-spark transition-colors">
                {asset.cta}
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-10 text-center md:text-left">
        {procurement.note}
      </p>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   FAQ, accordion-lite
────────────────────────────────────────────────────────────────────────── */
function EnterpriseFAQ() {
  const { faq } = enterprise;

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        {faq.eyebrow}
      </div>
      <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1] tracking-tightest text-ink max-w-[860px]">
        {faq.headline}
      </h2>

      <div className="mt-12 border-t border-rule">
        {faq.items.map((item, i) => (
          <motion.details
            key={item.q}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="group border-b border-rule py-5 md:py-6"
          >
            <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
              <span className="font-display font-medium text-[17px] md:text-[19px] text-ink leading-tight group-open:text-spark transition-colors">
                {item.q}
              </span>
              <span
                aria-hidden
                className="font-mono text-[18px] text-ink3 group-open:rotate-45 transition-transform shrink-0 leading-none"
              >
                +
              </span>
            </summary>
            <p className="text-ink2 text-[14.5px] leading-[1.7] mt-4 max-w-[760px]">
              {item.a}
            </p>
          </motion.details>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Final CTA, vortex-backed
────────────────────────────────────────────────────────────────────────── */
function Vortex() {
  const rings = [
    { size: 720, dashed: true,  dur: 80, dir: 1,  opacity: 0.10 },
    { size: 580, dashed: false, dur: 60, dir: -1, opacity: 0.14 },
    { size: 440, dashed: true,  dur: 50, dir: 1,  opacity: 0.18 },
    { size: 320, dashed: false, dur: 40, dir: -1, opacity: 0.22 },
    { size: 220, dashed: true,  dur: 30, dir: 1,  opacity: 0.28 },
    { size: 140, dashed: false, dur: 22, dir: -1, opacity: 0.34 },
    { size:  80, dashed: true,  dur: 16, dir: 1,  opacity: 0.42 },
  ];

  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
    >
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-spark"
          style={{
            width: r.size,
            height: r.size,
            borderStyle: r.dashed ? 'dashed' : 'solid',
            opacity: r.opacity,
          }}
          animate={{
            rotate: r.dir > 0 ? 360 : -360,
            scale: [1, 1.04, 1],
          }}
          transition={{
            rotate: { duration: r.dur, repeat: Infinity, ease: 'linear' },
            scale: { duration: 6 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      ))}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-spark"
        animate={{
          opacity: [0.6, 1, 0.6],
          boxShadow: [
            '0 0 0 0 rgb(var(--c-spark) / 0.5)',
            '0 0 24px 6px rgb(var(--c-spark) / 0.4)',
            '0 0 0 0 rgb(var(--c-spark) / 0.5)',
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function FinalCTA() {
  const { finalCta } = enterprise;

  return (
    <section className="border-t border-rule py-28 md:py-36 relative overflow-hidden">
      <Vortex />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgb(var(--c-bg)) 65%)',
        }}
      />

      <div className="container relative">
        <motion.div
          className="font-mono text-[11px] uppercase tracking-eyebrow text-spark"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4 }}
        >
          {finalCta.eyebrow}
        </motion.div>

        <motion.h2
          className="font-display font-semibold text-[40px] md:text-[64px] leading-[0.95] tracking-tightest mt-4 max-w-[820px]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE_OUT_EXPO }}
        >
          <span className="block text-ink">{finalCta.headline.line1}</span>
          <span className="block text-ink3 italic">{finalCta.headline.line2}</span>
        </motion.h2>

        <motion.p
          className="text-ink2 text-[15.5px] leading-[1.6] max-w-[640px] mt-7"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {finalCta.body}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 mt-10"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.25, ease: EASE_OUT_EXPO }}
        >
          <Button href={finalCta.primary.href} variant="primary">
            {finalCta.primary.label}
          </Button>
          <Button href={finalCta.secondary.href} variant="secondary">
            {finalCta.secondary.label}
          </Button>
          <RabbitButton href="/signup" label="Or just sign up" />
        </motion.div>

        <motion.p
          className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {finalCta.subtext}
        </motion.p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────────────────────── */
export default function EnterprisePage() {
  return (
    <>
      <EnterpriseHero />
      <MeansWhat />
      <Capabilities />
      <ThreeAmPromise />
      <Outcomes />
      <Architecture />
      <Procurement />
      <EnterpriseFAQ />
      <FinalCTA />
    </>
  );
}
