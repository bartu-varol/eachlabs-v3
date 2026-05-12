'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { customerStories } from '@/lib/content';

export default function CustomersPage() {
  const c = customerStories;

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
            * {c.eyebrow.replace('* ', '')}
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[860px]">
            <span className="block">{c.headline.line1}</span>
            <span className="block text-ink3 italic">{c.headline.line2}</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[640px] mt-7">{c.body}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule mt-12 border border-rule rounded-md overflow-hidden">
            {[
              { v: '20,000+', l: 'developers' },
              { v: '120+',    l: 'teams in production' },
              { v: '$1.2B',   l: 'shipped through the platform' },
              { v: '4.3M',    l: 'production traces' },
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

      {/* Case studies — full width grid */}
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
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-8">
            ● CASE STUDIES
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.caseStudies.map((cs, i) => (
              <motion.article
                key={cs.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="bg-surface border border-rule2 rounded-md p-7 flex flex-col hover:border-spark/40 transition-colors"
              >
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-5">
                  {cs.industry}
                </div>
                <h3 className="text-ink font-medium text-[19px] leading-[1.3] tracking-tight mb-5">
                  {cs.headline.map((t, idx) =>
                    t.kind === 'spark' ? (
                      <span key={idx} className="text-spark">{t.text}</span>
                    ) : (
                      <span key={idx}>{t.text}</span>
                    ),
                  )}
                </h3>
                <p className="text-ink2 italic text-[14px] leading-[1.65] flex-1">{`"${cs.quote}"`}</p>
                <div className="border-t border-rule pt-5 mt-5 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-medium tracking-wide flex-shrink-0 ${cs.avatar.bg} ${cs.avatar.text}`}
                  >
                    {cs.avatar.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-ink text-[13.5px] font-medium truncate">{cs.name}</div>
                    <div className="text-ink3 text-[12px] mt-0.5 truncate">{cs.role}</div>
                  </div>
                </div>
                <Link
                  href={cs.href}
                  className="text-spark text-[12.5px] font-medium hover:underline underline-offset-4 mt-4 inline-flex items-center gap-1.5"
                >
                  Read the full story <ArrowRight size={13} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            {c.ctaCard.headline}
          </h2>
          <p className="text-ink2 text-[15px] mt-6">{c.ctaCard.body}</p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button href={c.ctaCard.href} variant="primary">
              {c.ctaCard.cta}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
