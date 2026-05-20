'use client';

import { motion } from 'framer-motion';
import { rabbitHole } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* Vortex, concentric rotating rings + pulsing opacity, sits behind the headline. */
function Vortex() {
  // Each ring: scale factor, dashed?, rotation direction & speed.
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
          className={`absolute rounded-full border border-brand`}
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

      {/* Center spark glow */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-brand"
        animate={{
          opacity: [0.6, 1, 0.6],
          boxShadow: [
            '0 0 0 0 rgb(var(--brand) / 0.5)',
            '0 0 24px 6px rgb(var(--brand) / 0.4)',
            '0 0 0 0 rgb(var(--brand) / 0.5)',
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export function RabbitHole() {
  return (
    <section className="border-t border-divider py-28 md:py-36 relative overflow-hidden">
      {/* Vortex behind everything */}
      <Vortex />

      {/* Radial fade so the vortex doesn't compete with the cards */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgb(var(--surface-raised)) 65%)',
        }}
      />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionHeader
            eyebrow={rabbitHole.eyebrow}
            headline={rabbitHole.headline.line1}
            headlineSub={rabbitHole.headline.line2}
          />
        </motion.div>

        {/* 3 doors, drop in stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {rabbitHole.cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{
                duration: 0.5,
                delay: 0.18 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -3 }}
              className="bg-surface-raised/90 backdrop-blur border border-field rounded-md p-8 flex flex-col hover:border-brand/40 hover:bg-surface-raised transition-colors duration-200"
            >
              <Eyebrow>{card.eyebrow}</Eyebrow>
              <h3 className="font-sans font-semibold text-2xl mt-4 text-ink">
                {card.title}
              </h3>
              <div className="text-ink-muted italic text-body mt-1">{card.subline}</div>
              <p className="text-ink-muted text-body leading-relaxed mt-4">{card.body}</p>
              <div className="mt-auto pt-6">
                {card.cta.style === 'primary' ? (
                  <RabbitButton
                    href={card.cta.href}
                    label={card.cta.label}
                    fullWidth
                  />
                ) : (
                  <Button
                    href={card.cta.href}
                    variant={card.cta.style as 'primary' | 'outline' | 'text'}
                    fullWidth
                  >
                    {card.cta.label}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint text-center mt-12 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {rabbitHole.subtext}
        </motion.p>
      </div>
    </section>
  );
}
