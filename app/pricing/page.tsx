'use client';

import { motion } from 'framer-motion';
import { Check, HardDrive, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RabbitButton } from '@/components/ui/RabbitButton';
import { PricingCalculator } from '@/components/sections/PricingCalculator';

/* Pricing page — two main sections: §01 Model Price · §02 Storage Price */

const SECTIONS = [
  { n: '01', id: 'model',   icon: Cpu,       title: 'Model price',   body: 'Same number the provider charges.' },
  { n: '02', id: 'storage', icon: HardDrive, title: 'Storage price', body: 'Pass-through cloud cost. First 5 GB free.' },
];

/* ────────────────────────────────────────────────────────────────────────────
   §01 — Model Price: single unified table (provider price == eachlabs price)
   ──────────────────────────────────────────────────────────────────────────── */
function ModelPriceSection() {
  return (
    <section id="model" className="relative border-t border-rule overflow-hidden scroll-mt-24">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.05), transparent 65%)',
        }}
      />
      <div className="container pt-20 md:pt-24 pb-2 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● §01 MODEL PRICE
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink max-w-[820px]">
          What the provider charges.{' '}
          <span className="text-ink3 italic">What you pay. Same number.</span>
        </h2>
        <p className="text-ink2 text-[14.5px] leading-[1.6] mt-5 max-w-[640px]">
          Every model on Eachlabs is billed at the upstream provider&rsquo;s rate. We don&rsquo;t
          mark it up, we don&rsquo;t round up, we don&rsquo;t bundle it into a seat. If Alibaba
          says <span className="font-mono text-ink">$0.10</span>, you pay{' '}
          <span className="font-mono text-ink">$0.10</span>.
        </p>
      </div>

      {/* Unified interactive table: provider price · eachlabs price · runs at budget */}
      <PricingCalculator />
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   §02 — Storage Price: pass-through cloud cost
   ──────────────────────────────────────────────────────────────────────────── */
const STORAGE_TIERS = [
  { label: 'First 5 GB',     rate: 'Free',        note: 'Included on every account, indefinitely.' },
  { label: 'After 5 GB',     rate: '$0.023 / GB', note: 'Per GB-month. Same as S3 Standard.' },
  { label: 'Egress / serve', rate: '$0.00',       note: 'No bandwidth surcharge to fetch your assets.' },
];

function StoragePrice() {
  return (
    <section id="storage" className="relative border-t border-rule overflow-hidden scroll-mt-24">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 45% at 85% 10%, rgb(var(--c-highlight) / 0.06), transparent 65%)',
        }}
      />
      <div className="container py-20 md:py-24 relative">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
          ● §02 STORAGE PRICE
        </div>
        <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink max-w-[820px]">
          Generated assets live somewhere.{' '}
          <span className="text-ink3 italic">We pass through the cloud cost.</span>
        </h2>
        <p className="text-ink2 text-[14.5px] leading-[1.6] mt-5 max-w-[640px]">
          Videos, images, audio — every output is stored so you can fetch it, share it,
          or chain it into the next step. We bill storage at the underlying cloud rate.
          No retrieval fees, no per-request charges, no surprise egress.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden">
          {STORAGE_TIERS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.32, delay: i * 0.06 }}
              className="bg-surface px-6 py-7"
            >
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                {t.label}
              </div>
              <div className="font-display font-semibold text-[32px] md:text-[36px] text-ink tabular-nums mt-3 leading-none">
                {t.rate}
              </div>
              <div className="text-ink2 text-[13px] leading-[1.55] mt-3">{t.note}</div>
            </motion.div>
          ))}
        </div>

        <ul className="mt-8 space-y-2.5">
          {[
            'Pass-through pricing — we charge what the cloud charges us.',
            'No retrieval fee. Fetching your output is free.',
            'No bandwidth surcharge. Same rate whether you serve 10 or 10M.',
          ].map((l) => (
            <li key={l} className="flex items-start gap-2.5 text-ink2 text-[13.5px] leading-[1.55]">
              <Check size={14} className="mt-0.5 text-spark shrink-0" aria-hidden />
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
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * PRICING
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[920px]">
            No additional price.{' '}
            <span className="text-ink3 italic">Pay the provider, not a penny more.</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.6] max-w-[680px] mt-7">
            Eachlabs charges the same rate as the upstream provider — for every model, every
            run. Storage is pass-through. You only pay for what you would have paid anyway.
          </p>

          {/* Section anchor strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule mt-12 border border-rule rounded-md overflow-hidden">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.n}
                  href={`#${s.id}`}
                  className="bg-surface px-6 py-6 hover:bg-bg/40 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-[11px] tabular-nums text-spark">{s.n}</div>
                    <Icon size={16} className="text-ink3 group-hover:text-spark transition-colors" aria-hidden />
                  </div>
                  <div className="font-display font-semibold text-[18px] text-ink mt-3 leading-tight">
                    {s.title}
                  </div>
                  <div className="text-ink2 text-[13px] mt-1.5 leading-[1.5]">{s.body}</div>
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Main sections */}
      <ModelPriceSection />
      <StoragePrice />

      {/* Enterprise CTA banner */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 50% 80% at 100% 50%, rgb(var(--c-spark) / 0.08), transparent 60%)',
          }}
        />
        <div className="container py-16 md:py-20 relative">
          <div className="bg-surface border border-rule2 rounded-md p-7 md:p-9 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10">
            <span className="font-display text-[36px] md:text-[44px] leading-none">💸</span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mb-1">
                ENTERPRISE
              </div>
              <h3 className="font-display font-semibold text-[20px] md:text-[24px] leading-[1.25] tracking-tight text-ink">
                Running high-volume AI?{' '}
                <span className="text-ink3 italic">We&rsquo;ll go below provider price.</span>
              </h3>
              <p className="text-ink2 text-[14px] mt-2 max-w-[640px]">
                Committed-volume discounts, on-prem / VPC deploy, dedicated SLAs.
              </p>
            </div>
            <Button href="/contact" variant="secondary">Talk to enterprise →</Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            Same price as the provider.{' '}
            <span className="text-ink3 italic">One API, one bill.</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <RabbitButton href="/signup" />
            <Button href="/contact" variant="secondary">Talk to sales</Button>
          </div>
        </div>
      </section>
    </>
  );
}
