'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { customerStories, type HeadlineToken } from '@/lib/content';

function HeadlineText({ tokens }: { tokens: HeadlineToken[] }) {
  return (
    <h3 className="text-ink font-display font-semibold text-[22px] md:text-[24px] leading-[1.2] tracking-tight">
      {tokens.map((t, i) =>
        t.kind === 'spark' ? (
          <span key={i} className="text-spark">{t.text}</span>
        ) : (
          <span key={i}>{t.text}</span>
        ),
      )}
    </h3>
  );
}

export default function CustomersPage() {
  const c = customerStories;

  // Companies list (preserve order from caseStudies), derived from real testimonial data.
  const companies = c.caseStudies.map((cs) => cs.role);
  const marqueeRow = [...companies, ...companies, ...companies];

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
            * {c.eyebrow.replace('* ', '')}
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[920px]">
            <span className="block">{c.headline.line1}</span>
            <span className="block text-ink3 italic">{c.headline.line2}</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[640px] mt-7">{c.body}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule mt-12 border border-rule rounded-md overflow-hidden">
            {[
              { v: '10+',    l: 'production teams quoted' },
              { v: '1M+',    l: 'downloads powered by us' },
              { v: '600+',   l: 'models · one API' },
              { v: '24/7',   l: 'engineer support' },
            ].map((s) => (
              <div key={s.l} className="bg-surface px-5 py-6">
                <div className="font-display font-semibold text-[24px] md:text-[28px] text-spark tabular-nums leading-none">
                  {s.v}
                </div>
                <div className="text-ink3 text-[12px] mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Company marquee ────────────────────────────────────────────── */}
      <section
        aria-label="Featured customers"
        className="border-t border-b border-rule py-8 md:py-10 overflow-hidden relative"
      >
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[rgb(var(--c-bg))] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[rgb(var(--c-bg))] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-12 md:gap-16 w-max animate-marquee" style={{ willChange: 'transform' }}>
          {marqueeRow.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display font-medium text-[18px] md:text-[22px] text-ink3 hover:text-ink transition-colors whitespace-nowrap tracking-tight"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ─── Testimonials grid ──────────────────────────────────────────── */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 0% 0%, rgb(var(--c-spark) / 0.05), transparent 65%), radial-gradient(ellipse 60% 50% at 100% 100%, rgb(var(--c-highlight) / 0.05), transparent 65%)',
          }}
        />
        <div className="container py-20 md:py-24 relative">
          <div className="flex items-baseline justify-between gap-6 flex-wrap mb-10">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
                ● IN THEIR WORDS
              </div>
              <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink">
                Ten quotes.{' '}
                <span className="text-ink3 italic">Verbatim from the teams shipping on each::labs.</span>
              </h2>
            </div>
            <span className="font-mono text-[11px] text-ink3 uppercase tracking-eyebrow">
              {c.caseStudies.length} stories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {c.caseStudies.map((cs, i) => (
              <motion.article
                key={`${cs.name}-${cs.role}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="group relative bg-surface border border-rule2 rounded-md p-7 md:p-8 flex flex-col hover:border-spark/40 hover:bg-surface2 transition-colors"
              >
                {/* Hanging quote glyph */}
                <Quote
                  size={28}
                  strokeWidth={1.5}
                  className="absolute top-6 right-6 text-ink3/30 group-hover:text-spark/40 transition-colors"
                  aria-hidden
                />

                {/* Company eyebrow */}
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mb-4">
                  {cs.role}
                </div>

                {/* Headline (= summary) */}
                <HeadlineText tokens={cs.headline} />

                {/* Full verbatim quote */}
                <p className="text-ink2 text-[14px] leading-[1.7] mt-5 flex-1">
                  {cs.quote}
                </p>

                {/* Author */}
                <div className="border-t border-rule pt-5 mt-6 flex items-center gap-3">
                  <div
                    className={[
                      'w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-medium tracking-wide flex-shrink-0',
                      cs.avatar.bg,
                      cs.avatar.text,
                    ].join(' ')}
                    aria-hidden
                  >
                    {cs.avatar.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-ink text-[14px] font-medium truncate">{cs.name}</div>
                    <div className="text-ink3 text-[12px] mt-0.5 truncate">{cs.role}</div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 80% at 50% 100%, rgb(var(--c-spark) / 0.08), transparent 60%)',
          }}
        />
        <div className="container py-24 md:py-32 relative">
          <div className="max-w-[680px] mx-auto text-center">
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-4">
              {c.ctaCard.eyebrow}
            </div>
            <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
              {c.ctaCard.headline}
            </h2>
            <p className="text-ink2 text-[15px] mt-6">{c.ctaCard.body}</p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <RabbitButton href="/signup" />
              <Button href="/contact" variant="secondary">
                Talk to an engineer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
