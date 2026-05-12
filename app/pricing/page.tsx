'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PricingCalculator } from '@/components/sections/PricingCalculator';

type Plan = {
  n: string;
  name: string;
  tagline: string;
  price: string;
  unit: string;
  features: string[];
  cta: { label: string; href: string };
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    n: '01',
    name: 'Free',
    tagline: 'Prototype and ship your first AI product.',
    price: '$0',
    unit: '/mo',
    features: [
      'AI Gateway · pay-per-call',
      '1 GB data processed',
      '7 days retention',
      '10K traces / month',
      '3 custom attributes',
      'Community support',
    ],
    cta: { label: 'Start free →', href: '/signup' },
  },
  {
    n: '02',
    name: 'Pro',
    tagline: 'Production-grade reliability + analytics.',
    price: '$249',
    unit: '/mo',
    features: [
      '5 GB data — then $3/GB',
      '500K traces — then $1.50/1k',
      '30 days retention',
      'Unlimited custom attributes',
      'Real-time A/B + per-user cost',
      'Priority support',
    ],
    cta: { label: 'Start Pro →', href: '/signup?plan=pro' },
    popular: true,
  },
  {
    n: '03',
    name: 'Enterprise',
    tagline: 'Compliance, scale, custom routing.',
    price: 'Custom',
    unit: '',
    features: [
      'SSO, SAML, audit logs',
      'Dedicated Slack channel',
      'Custom routing + private clusters',
      'Unlimited retention',
      'On-prem / VPC deploy',
      'SLA guarantees',
    ],
    cta: { label: 'Talk to us →', href: '/contact' },
  },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Subscription plans',  body: 'Free · Pro · Enterprise' },
  { n: '02', title: 'Pay-per-call rates',   body: 'Inference, billed at cost' },
  { n: '03', title: 'FAQ',                  body: '5 common questions' },
];

function PlanCard({ plan, idx }: { plan: Plan; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'relative rounded-md p-7 md:p-8 flex flex-col',
        plan.popular
          ? 'bg-surface border-2 border-spark'
          : 'bg-surface border border-rule2',
      ].join(' ')}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-7 inline-flex items-center font-mono text-[10px] uppercase tracking-eyebrow px-2.5 py-1 rounded-md bg-spark text-bg">
          Most popular
        </span>
      )}
      <div className="font-mono text-[11px] tabular-nums text-spark mb-3">{plan.n}</div>
      <h3 className="font-display font-semibold text-[24px] text-ink leading-tight">{plan.name}</h3>
      <p className="text-ink2 text-[13.5px] mt-2 leading-[1.55]">{plan.tagline}</p>

      <div className="flex items-baseline gap-2 mt-7">
        <span className="font-display text-[44px] md:text-[52px] font-semibold text-ink tabular-nums leading-none">
          {plan.price}
        </span>
        {plan.unit && <span className="text-ink3 text-[14px]">{plan.unit}</span>}
      </div>

      <ul className="mt-7 space-y-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-ink2 text-[13.5px] leading-[1.5]">
            <Check size={14} className="mt-0.5 text-spark shrink-0" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button href={plan.cta.href} variant={plan.popular ? 'primary' : 'secondary'} fullWidth>
          {plan.cta.label}
        </Button>
      </div>
    </motion.div>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * PRICING
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[860px]">
            Pay for the calls.{' '}
            <span className="text-ink3 italic">Subscribe for the data.</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[640px] mt-7">
            <strong className="text-ink font-semibold">AI Gateway</strong> is pay-per-call, no
            markup.{' '}
            <strong className="text-ink font-semibold">Observability</strong> is an optional
            subscription.
          </p>

          {/* How it works strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule mt-10 border border-rule rounded-md overflow-hidden">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.n} className="bg-surface px-5 py-5">
                <div className="font-mono text-[11px] tabular-nums text-spark">{h.n}</div>
                <div className="font-display font-semibold text-[16px] text-ink mt-2">{h.title}</div>
                <div className="text-ink3 text-[12px] mt-1">{h.body}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="relative border-t border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgb(var(--c-spark) / 0.05), transparent 65%)' }}
        />
        <div className="container py-20 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            {PLANS.map((p, i) => (
              <PlanCard key={p.n} plan={p} idx={i} />
            ))}
          </div>
        </div>
      </section>

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
                <span className="text-ink3 italic">Run each::labs on your own infra.</span>
              </h3>
              <p className="text-ink2 text-[14px] mt-2 max-w-[640px]">
                On-premise / VPC deploy with SLA. We can offer discounts on model pricing for
                committed volume.
              </p>
            </div>
            <Button href="/contact" variant="secondary">Talk to enterprise →</Button>
          </div>
        </div>
      </section>

      {/* Model price calculator */}
      <PricingCalculator />

      {/* Bottom CTA */}
      <section className="container border-t border-rule py-24 md:py-32">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            Ship today. Pay tomorrow.{' '}
            <span className="text-ink3 italic">Subscribe when it matters.</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button href="/signup" variant="primary">Start free →</Button>
            <Button href="/contact" variant="secondary">Talk to sales</Button>
          </div>
        </div>
      </section>
    </>
  );
}
