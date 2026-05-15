'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-1000'
  | '1000+';

type Interest =
  | 'volume-pricing'
  | 'sla-terms'
  | 'security-review'
  | 'csm'
  | 'budget-controls'
  | 'other';

type FormState = {
  name: string;
  email: string;
  company: string;
  companySize: CompanySize | '';
  monthlyVolume: string;
  interest: Interest | '';
  message: string;
};

const initial: FormState = {
  name: '',
  email: '',
  company: '',
  companySize: '',
  monthlyVolume: '',
  interest: '',
  message: '',
};

const COMPANY_SIZES: { value: CompanySize; label: string }[] = [
  { value: '1-10',     label: '1-10' },
  { value: '11-50',    label: '11-50' },
  { value: '51-200',   label: '51-200' },
  { value: '201-1000', label: '201-1000' },
  { value: '1000+',    label: '1,000+' },
];

const INTERESTS: { value: Interest; label: string; sub: string }[] = [
  { value: 'volume-pricing',   label: 'Volume pricing',          sub: 'monthly commits, lower platform fee' },
  { value: 'sla-terms',        label: 'Custom uptime / terms',   sub: 'tailored to your traffic shape' },
  { value: 'security-review',  label: 'Security review',         sub: 'DPA, MSA, retention, sub processors' },
  { value: 'csm',              label: 'Dedicated CSM',           sub: 'named contact + quarterly reviews' },
  { value: 'budget-controls',  label: 'Team budget controls',    sub: 'caps, alerts, per team reporting' },
  { value: 'other',            label: 'Something else',          sub: 'tell us in the message' },
];

export default function ContactSalesPage() {
  const [data, setData] = useState<FormState>(initial);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await new Promise((r) => setTimeout(r, 500));
      const interestLabel =
        INTERESTS.find((s) => s.value === data.interest)?.label ?? 'General';
      const body = encodeURIComponent(
        `Hi sales team,\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nCompany size: ${data.companySize || '-'}\nEstimated monthly inference volume: ${data.monthlyVolume || '-'}\nInterest: ${interestLabel}\n\n${data.message}\n`,
      );
      window.location.href = `mailto:support@eachlabs.ai?subject=${encodeURIComponent(
        `[Sales] ${interestLabel} · ${data.company || data.name}`,
      )}&body=${body}`;
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <section className="container py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-12 lg:gap-20 items-start">
          {/* LEFT, copy */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              * CONTACT SALES
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[60px] lg:text-[68px] leading-[0.98] tracking-tightest mt-6 text-ink">
              Custom plan.
              <span className="block text-ink3 italic">No quick-call funnel.</span>
            </h1>
            <p className="text-ink2 text-[16px] leading-[1.6] max-w-[520px] mt-7">
              For teams shipping AI in production at scale. Tell us your traffic, your
              compliance posture, and what you actually need on a custom plan. We come back
              with numbers, not a calendar invite.
            </p>

            <ul className="mt-10 flex flex-col gap-4 max-w-[480px]">
              <Note label="WHO" body="Founding team engineer + sales lead read every form. Same business day reply." />
              <Note label="WHAT" body="Volume pricing, custom uptime, security docs, CSM, budget controls." />
              <Note label="WHEN" body="Typical timeline: kickoff to production in three weeks." />
            </ul>

            <div className="mt-10 pt-8 border-t border-rule">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-2">
                OR EMAIL THE SALES TEAM
              </div>
              <a
                href="mailto:support@eachlabs.ai?subject=Sales%20inquiry"
                className="text-spark text-[16px] font-medium hover:underline underline-offset-4 inline-flex items-center gap-2"
              >
                support@eachlabs.ai <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT, form */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="lg:sticky lg:top-24"
          >
            {status === 'sent' ? (
              <SuccessCard />
            ) : (
              <form
                onSubmit={onSubmit}
                className="bg-surface border border-rule2 rounded-md p-6 md:p-8 flex flex-col gap-5"
              >
                <Field
                  label="Your name"
                  required
                  value={data.name}
                  onChange={(v) => update('name', v)}
                  placeholder="Your name"
                />
                <Field
                  label="Work email"
                  type="email"
                  required
                  value={data.email}
                  onChange={(v) => update('email', v)}
                  placeholder="you@company.com"
                />
                <Field
                  label="Company"
                  required
                  value={data.company}
                  onChange={(v) => update('company', v)}
                  placeholder="Company name"
                />

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                    Company size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMPANY_SIZES.map((opt) => {
                      const isActive = data.companySize === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('companySize', opt.value)}
                          className={[
                            'px-3 py-2 rounded-md text-[13px] border transition-colors text-center font-medium',
                            isActive
                              ? 'bg-spark text-white border-spark'
                              : 'bg-bg border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
                          ].join(' ')}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field
                  label="Estimated monthly inference volume"
                  value={data.monthlyVolume}
                  onChange={(v) => update('monthlyVolume', v)}
                  placeholder="e.g. 5M requests / month"
                />

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                    What do you want to talk about?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {INTERESTS.map((opt) => {
                      const isActive = data.interest === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('interest', opt.value)}
                          className={[
                            'px-3 py-2.5 rounded-md text-left border transition-colors',
                            isActive
                              ? 'bg-spark text-white border-spark'
                              : 'bg-bg border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
                          ].join(' ')}
                        >
                          <div className="text-[13px] font-medium leading-tight">
                            {opt.label}
                          </div>
                          <div
                            className={`text-[11px] mt-0.5 ${
                              isActive ? 'text-white/80' : 'text-ink3'
                            }`}
                          >
                            {opt.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                    Anything else we should know?
                    <span className="text-fail ml-1" aria-hidden>*</span>
                  </label>
                  <textarea
                    required
                    value={data.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Your stack, your timeline, your compliance constraints, your favorite model. Anything we should bring to the first call."
                    rows={5}
                    className="bg-bg border border-rule2 rounded-md px-3 py-2.5 text-[14px] text-ink placeholder:text-ink3 outline-none focus:border-spark/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-spark text-white hover:bg-ember disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-md px-5 py-3 text-[14px] font-medium inline-flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send to sales'}
                  {status !== 'submitting' && <ArrowRight size={14} />}
                </button>

                {status === 'error' && (
                  <p className="font-mono text-[11px] text-fail">
                    Could not send. Try emailing support@eachlabs.ai directly.
                  </p>
                )}

                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 leading-relaxed">
                  No drip campaign. No "circle back next week." One reply, with the numbers
                  attached.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function Note({ label, body }: { label: string; body: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mt-1 w-14 shrink-0">
        {label}
      </span>
      <span className="text-ink2 text-[14.5px] leading-[1.6]">{body}</span>
    </li>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email';
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
        {label}
        {required && (
          <span className="text-fail ml-1" aria-hidden>*</span>
        )}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-bg border border-rule2 rounded-md px-3 py-2.5 text-[14px] text-ink placeholder:text-ink3 outline-none focus:border-spark/60 transition-colors"
      />
    </div>
  );
}

function SuccessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-surface border border-spark/30 rounded-md p-8 flex flex-col items-center text-center"
    >
      <div className="w-12 h-12 rounded-full bg-spark/15 flex items-center justify-center mb-5">
        <Check className="text-spark" size={22} />
      </div>
      <h2 className="font-display font-semibold text-[24px] text-ink leading-tight">
        Sent to sales.
      </h2>
      <p className="text-ink2 text-[14.5px] leading-[1.6] mt-3 max-w-[380px]">
        Your email client should be opening with the message pre-filled. Hit send and we'll
        reply within one business day with concrete numbers.
      </p>
    </motion.div>
  );
}
