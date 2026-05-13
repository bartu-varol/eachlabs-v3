'use client';

import { motion } from 'framer-motion';
import { CustomerCard } from './CustomerCard';
import { customerStories } from '@/lib/content';

export function CustomerStories() {
  const c = customerStories;
  // Duplicate the case studies for a seamless marquee loop.
  const loop = [...c.caseStudies, ...c.caseStudies];

  return (
    <section className="border-t border-rule py-24 md:py-32 overflow-hidden">
      {/* Header, kept in container width for readability */}
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
          {c.eyebrow}
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-6xl tracking-tightest leading-[1.05]">
          <span className="block text-ink">{c.headline.line1}</span>
          <span className="block text-ink3 italic">{c.headline.line2}</span>
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.55] max-w-[600px] mt-6">{c.body}</p>
      </motion.div>

      {/* Full-bleed marquee, outside the container */}
      <div
        role="region"
        aria-label="Customer stories"
        className="mt-16 relative group"
      >
        {/* Edge fade masks, left/right vignettes pull the eye into the middle */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[rgb(var(--c-bg))] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[rgb(var(--c-bg))] to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused]"
          style={{ willChange: 'transform' }}
        >
          {loop.map((cs, i) => (
            <CustomerCard key={`${cs.name}-${i}`} cs={cs} variant="marquee" />
          ))}
        </div>

        {/* Subtle hint, auto-cycling, hover to pause */}
        <div className="container mt-6">
          <div className="flex items-center justify-end font-mono text-[10px] text-ink3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse mr-2" aria-hidden />
            auto-scrolling · hover to pause
          </div>
        </div>
      </div>
    </section>
  );
}
