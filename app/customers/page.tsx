'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { PageHero } from '@/components/ui/PageHero';
import { StatTile, StatGrid } from '@/components/ui/StatTile';
import { CustomerCard } from '@/components/sections/CustomerCard';
import { customerStories } from '@/lib/content';
import { Eyebrow } from '@/components/ui/Eyebrow';

export default function CustomersPage() {
  const c = customerStories;

  // Logo list (preserve order from caseStudies), derived from real testimonial data.
  const logos = c.caseStudies.map((cs) => ({ ...cs.logo, role: cs.role }));
  const marqueeRow = [...logos, ...logos, ...logos];

  return (
    <>
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <PageHero
        eyebrow={c.eyebrow}
        headline={
          <>
            <span className="block">{c.headline.line1}</span>
            <span className="block text-ink-faint italic">{c.headline.line2}</span>
          </>
        }
        description={c.body}
      >
        <StatGrid columns={4} className="mt-12">
          {[
            { v: '10+',  l: 'production teams quoted' },
            { v: '1M+',  l: 'downloads powered by us' },
            { v: '600+', l: 'models · one API'        },
            { v: '24/7', l: 'engineer support'        },
          ].map((s) => (
            <StatTile key={s.l} value={s.v} label={s.l} size="lg" labelStyle="eyebrow" />
          ))}
        </StatGrid>
      </PageHero>

      {/* ─── Company marquee ────────────────────────────────────────────── */}
      <section
        aria-label="Featured customers"
        className="border-t border-b border-divider py-8 md:py-10 overflow-hidden relative"
      >
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[rgb(var(--surface-raised))] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[rgb(var(--surface-raised))] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-12 md:gap-16 w-max animate-marquee" style={{ willChange: 'transform' }}>
          {marqueeRow.map((logo, i) => (
            <span
              key={`${logo.alt}-${i}`}
              className="inline-flex h-10 md:h-12 w-32 md:w-40 items-center justify-center text-ink-faint hover:text-ink transition-colors shrink-0"
              aria-label={logo.alt}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="customer-logo h-full w-full object-contain opacity-90"
                unoptimized
              />
              <span className="sr-only">{logo.role}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ─── Testimonials grid ──────────────────────────────────────────── */}
      <section className="relative border-t border-divider overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 0% 0%, rgb(var(--brand) / 0.05), transparent 65%), radial-gradient(ellipse 60% 50% at 100% 100%, rgb(var(--cobrand) / 0.05), transparent 65%)',
          }}
        />
        <div className="container py-20 md:py-24 relative">
          <div className="flex items-baseline justify-between gap-6 flex-wrap mb-10">
            <div>
              <Eyebrow className="mb-3">● IN THEIR WORDS</Eyebrow>
              <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.1] tracking-tightest text-ink">
                Ten quotes.{' '}
                <span className="text-ink-faint italic">Verbatim from the teams shipping on each::labs.</span>
              </h2>
            </div>
            <span className="font-mono text-eyebrow text-ink-faint uppercase tracking-eyebrow">
              {c.caseStudies.length} stories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {c.caseStudies.map((cs, i) => (
              <motion.div
                key={`${cs.name}-${cs.role}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
              >
                <CustomerCard cs={cs} variant="grid" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="relative border-t border-divider overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 80% at 50% 100%, rgb(var(--brand) / 0.08), transparent 60%)',
          }}
        />
        <div className="container py-24 md:py-32 relative">
          <div className="max-w-[680px] mx-auto text-center">
            <Eyebrow className="mb-4">{c.ctaCard.eyebrow}</Eyebrow>
            <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
              {c.ctaCard.headline}
            </h2>
            <p className="text-ink-muted text-body-lg mt-6">{c.ctaCard.body}</p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <RabbitButton href="/sign-up" />
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
