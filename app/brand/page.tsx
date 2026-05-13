'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const PALETTE = [
  { name: 'Quantum Navy',   hex: '#060228', sub: 'primary identifier'    },
  { name: 'Chaos Spark',    hex: '#FF3C15', sub: 'primary identifier · red' },
  { name: 'Deep Purple',    hex: '#2B0A34', sub: ''                       },
  { name: 'Crimson',        hex: '#450830', sub: ''                       },
  { name: 'Sunset Orange',  hex: '#FB9000', sub: ''                       },
  { name: 'Golden Yellow',  hex: '#FFC534', sub: ''                       },
  { name: 'Background',     hex: '#00011D', sub: ''                       },
  { name: 'Highlight',      hex: '#5046E6', sub: ''                       },
];

const LOGO_ASSETS = [
  {
    title: 'Wordmark',
    desc:
      'Primary version for dark backgrounds. Alternative version available for light backgrounds. Both provided as SVG.',
  },
  {
    title: 'Icon',
    desc:
      '"::" symbol mark designed for compact applications. Use for favicons, app icons, social profiles, and small displays. Available in dark and light variants.',
  },
  {
    title: 'Product logo',
    desc:
      'each::sense branding represents the intelligent media generation layer. Provided as SVG asset.',
  },
];

const DOS = [
  'Use on dark or high-contrast backgrounds',
  'Maintain original aspect ratio and spacing',
  'Apply official palette colors',
  'Write "Eachlabs" as one capitalized word',
  'Deploy the "::" icon for compact contexts',
];

const DONTS = [
  'Distort, stretch, skew, or rotate the logos',
  'Modify colors or add gradients',
  'Place on low-contrast backgrounds',
  'Add visual effects like shadows or glows',
  'Incorporate the logo into other brands',
];

export default function BrandPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.07), transparent 65%)',
          }}
        />
        <div className="container py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              * BRAND KIT
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[60px] lg:text-[76px] leading-[0.98] tracking-tightest text-ink mt-7 max-w-[820px]">
              <span className="block">Eachlabs brand guidelines</span>
              <span className="block text-ink3 italic">and press kit.</span>
            </h1>
            <p className="text-ink2 text-[16px] leading-[1.6] max-w-[620px] mt-7">
              Resources and guidelines for using the Eachlabs brand in your projects, press, and
              partnerships.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="mailto:support@eachlabs.ai?subject=Brand%20asset%20request" variant="primary">
                Request assets
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LOGO ASSETS */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● LOGO ASSETS
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            The marks.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {LOGO_ASSETS.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.34, delay: i * 0.06, ease: EASE_OUT_EXPO }}
              className="bg-surface p-7 md:p-8 flex flex-col"
            >
              <div className="bg-bg border border-rule2 rounded-md aspect-[3/2] flex items-center justify-center mb-6">
                {a.title === 'Wordmark' ? (
                  <span className="font-display font-semibold text-[28px] inline-flex items-baseline">
                    <span className="text-ink">each</span>
                    <span className="text-spark">::</span>
                    <span className="text-ink">labs</span>
                  </span>
                ) : a.title === 'Icon' ? (
                  <span className="font-display font-bold text-[60px] text-spark leading-none">::</span>
                ) : (
                  <span className="font-display font-semibold text-[24px] inline-flex items-baseline">
                    <span className="text-ink">each</span>
                    <span className="text-spark">::</span>
                    <span className="text-ink">sense</span>
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-[18px] text-ink leading-snug mb-3">
                {a.title}
              </h3>
              <p className="text-ink2 text-[13.5px] leading-[1.65]">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COLOR PALETTE */}
      <section className="container border-t border-rule py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● COLOR PALETTE
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            Eight core colors.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          {PALETTE.map((c, i) => (
            <motion.div
              key={c.hex}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: EASE_OUT_EXPO }}
              className="bg-surface flex flex-col"
            >
              <div
                className="aspect-[5/3] w-full"
                style={{ background: c.hex }}
                aria-hidden
              />
              <div className="px-5 py-4">
                <div className="text-ink text-[14px] font-medium">{c.name}</div>
                <div className="font-mono text-[12px] text-spark mt-1">{c.hex}</div>
                {c.sub && (
                  <div className="text-ink3 text-[11.5px] mt-1.5">{c.sub}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section className="container border-t border-rule py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● TYPOGRAPHY
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[820px]">
            Inter is our primary typeface.
            <span className="block text-ink3 italic">Optimized for screen readability.</span>
          </h2>
          <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
            Available on Google Fonts. Use Regular (400), Medium (500), Semibold (600), and Bold
            (700).
          </p>
        </motion.div>

        <div className="mt-10 bg-surface border border-rule2 rounded-md p-8 md:p-10 flex flex-col gap-4">
          <div className="font-display text-[40px] md:text-[56px] text-ink font-bold leading-none">Aa</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden">
            {[
              { weight: 'Regular',  value: '400' },
              { weight: 'Medium',   value: '500' },
              { weight: 'Semibold', value: '600' },
              { weight: 'Bold',     value: '700' },
            ].map((w) => (
              <div key={w.weight} className="bg-surface px-5 py-4">
                <div
                  className="text-ink text-[20px] leading-tight"
                  style={{ fontWeight: parseInt(w.value, 10) }}
                >
                  Inter {w.weight}
                </div>
                <div className="font-mono text-[11px] text-ink3 mt-1.5">{w.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USAGE GUIDELINES, Do / Don't */}
      <section className="container border-t border-rule py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            ● USAGE GUIDELINES
          </div>
          <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
            Do and don't.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-10">
          <div className="bg-surface p-7 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-success/15">
                <Check size={14} className="text-success" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-success">Do</span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {DOS.map((d) => (
                <li key={d} className="text-ink2 text-[14px] leading-[1.6] flex gap-3">
                  <span className="text-success mt-1 shrink-0">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface p-7 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-fail/15">
                <X size={14} className="text-fail" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-eyebrow text-fail">Don't</span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {DONTS.map((d) => (
                <li key={d} className="text-ink2 text-[14px] leading-[1.6] flex gap-3">
                  <span className="text-fail mt-1 shrink-0">✗</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgb(var(--c-spark) / 0.08), transparent 65%)',
          }}
        />
        <div className="container py-20 md:py-28 relative">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-4">
              * NEED A SPECIFIC ASSET?
            </div>
            <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink">
              Press, partnerships, or unique requests.
            </h2>
            <p className="text-ink2 text-[15px] leading-[1.65] mt-6">
              Email us and we will send vector files or a press pack the same business day.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link
                href="mailto:support@eachlabs.ai?subject=Brand%20asset%20request"
                className="inline-flex items-center gap-2 bg-spark text-white hover:bg-ember transition-colors rounded-md px-5 py-3 text-[14px] font-medium"
              >
                support@eachlabs.ai <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
