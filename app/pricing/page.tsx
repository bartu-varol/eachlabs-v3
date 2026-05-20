'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { PageHero } from '@/components/ui/PageHero';
import { PricingCalculator } from '@/components/sections/PricingCalculator';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* ────────────────────────────────────────────────────────────────────────────
   Storage Price: pass-through cloud cost
   ──────────────────────────────────────────────────────────────────────────── */
const STORAGE_TIERS = [
  { label: 'First 5 GB',     rate: 'Free',        note: 'Included on every account, indefinitely.' },
  { label: 'After 5 GB',     rate: '$0.023 / GB', note: 'Per GB-month. Same as S3 Standard.' },
  { label: 'Egress / serve', rate: '$0.00',       note: 'No bandwidth surcharge to fetch your assets.' },
];

function StoragePrice() {
  return (
    <section id="storage" className="relative border-t border-divider overflow-hidden scroll-mt-24">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 85% 10%, rgb(var(--cobrand) / 0.06), transparent 65%)',
        }}
      />
      <div className="container py-16 md:py-20 relative">
        <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink max-w-[820px]">
          Generated assets live somewhere.{' '}
          <span className="text-ink-faint">We pass through the cloud cost.</span>
        </h2>
        <p className="text-ink-muted text-body leading-[1.6] mt-5 max-w-[640px]">
          Videos, images, audio, every output is stored so you can fetch it, share it,
          or chain it into the next step. We bill storage at the underlying cloud rate.
          No retrieval fees, no per-request charges, no surprise egress.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden">
          {STORAGE_TIERS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.32, delay: i * 0.06 }}
              className="bg-surface-raised px-6 py-7"
            >
              <Eyebrow size="sm" tone="ink-faint">{t.label}</Eyebrow>
              <div className="font-sans font-semibold text-h2 md:text-h2 text-ink tabular-nums mt-3 leading-none">
                {t.rate}
              </div>
              <div className="text-ink-muted text-body-sm leading-[1.55] mt-3">{t.note}</div>
            </motion.div>
          ))}
        </div>

        <ul className="mt-8 space-y-2.5">
          {[
            'Pass-through pricing, we charge what the cloud charges us.',
            'No retrieval fee. Fetching your output is free.',
            'No bandwidth surcharge. Same rate whether you serve 10 or 10M.',
          ].map((l) => (
            <li key={l} className="flex items-start gap-2.5 text-ink-muted text-body-sm leading-[1.55]">
              <Check size={14} className="mt-0.5 text-brand shrink-0" aria-hidden />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Page */
export default function PricingPage() {
  return (
    <>
      <PageHero
        headline={
          <>
            No additional price.{' '}
            <span className="text-ink-faint">No egress cost.</span>
          </>
        }
        description="Same rate as the upstream provider, every model, every run. No bandwidth fees, no surprise bills."
      />

      {/* Main sections */}
      <PricingCalculator />
      <StoragePrice />

      {/* Enterprise CTA banner */}
      <section className="relative border-t border-divider overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 80% at 100% 50%, rgb(var(--brand) / 0.08), transparent 60%)',
          }}
        />
        <div className="container py-16 md:py-20 relative">
          <div className="bg-surface-raised border border-field rounded-md p-7 md:p-9 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10">
            <span className="font-sans text-h2 md:text-display leading-none">💸</span>
            <div>
              <h3 className="font-sans font-semibold text-h4 md:text-h3 leading-[1.25] tracking-tight text-ink">
                Running high-volume AI?{' '}
                <span className="text-ink-faint">We&rsquo;ll go below provider price.</span>
              </h3>
              <p className="text-ink-muted text-body mt-2 max-w-[640px]">
                Committed-volume discounts, on-prem / VPC deploy, dedicated SLAs.
              </p>
            </div>
            <Button href="/contact" variant="secondary">Talk to enterprise →</Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container border-t border-divider py-20 md:py-28">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
            Same price as the provider.{' '}
            <span className="text-ink-faint">One API, one bill.</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <RabbitButton href="/sign-up" />
            <Button href="/contact" variant="secondary">Talk to sales</Button>
          </div>
        </div>
      </section>
    </>
  );
}
