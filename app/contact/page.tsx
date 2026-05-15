'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

type Stack =
  | 'just-exploring'
  | 'evaluating-vs-others'
  | 'building-now'
  | 'in-production';

type FormState = {
  name: string;
  email: string;
  company: string;
  stack: Stack | '';
  message: string;
};

const initial: FormState = {
  name: '',
  email: '',
  company: '',
  stack: '',
  message: '',
};

const STACK_OPTIONS: { value: Stack; label: string }[] = [
  { value: 'just-exploring',      label: 'Just exploring' },
  { value: 'evaluating-vs-others', label: 'Evaluating vs others' },
  { value: 'building-now',        label: 'Building now' },
  { value: 'in-production',       label: 'Already in production' },
];

export default function ContactPage() {
  const [data, setData] = useState<FormState>(initial);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    try {
      // No backend yet, simulate a successful submission so the page is wirable later.
      // To wire up: POST to /api/contact or your CRM (HubSpot, Pipedrive, etc.).
      await new Promise((r) => setTimeout(r, 600));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <section className="container py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-12 lg:gap-20 items-start">
          {/* LEFT, copy + expectations */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              * TALK TO AN ENGINEER
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[60px] lg:text-[68px] leading-[0.98] tracking-tightest mt-6 text-ink">
              Talk to a real engineer.
              <span className="block text-ink3 italic">No sales pitch, no scripted demos.</span>
            </h1>
            <p className="text-ink2 text-[16px] leading-[1.6] max-w-[520px] mt-7">
              Pricing questions, integration help, weird production edge cases, all of it goes
              straight to the team that built each::labs. We answer within one business day.
            </p>

            <ul className="mt-10 flex flex-col gap-4 max-w-[480px]">
              <Expectation label="WHO" body="A founding team engineer reads every message. No tier-1 support queue, no chatbot." />
              <Expectation label="WHEN" body="Same-day response on weekdays; within 24h on weekends." />
              <Expectation label="WHAT" body="Concrete answers with code, traces, or pricing maths. We don't pitch." />
            </ul>

            <div className="mt-10 pt-8 border-t border-rule">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-2">
                OR EMAIL US DIRECTLY
              </div>
              <a
                href="mailto:support@eachlabs.ai"
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
                  value={data.company}
                  onChange={(v) => update('company', v)}
                  placeholder="optional"
                />

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                    Where are you in the stack?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {STACK_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update('stack', opt.value)}
                        className={[
                          'px-3 py-2.5 rounded-md text-[13px] border transition-colors text-left',
                          data.stack === opt.value
                            ? 'bg-spark text-white border-spark'
                            : 'bg-bg border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
                        ].join(' ')}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                    What do you want to talk about?
                    <span className="text-fail ml-1" aria-hidden>*</span>
                  </label>
                  <textarea
                    required
                    value={data.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="My consumer app sees ~12% refusal rates from kling, and I want to know how the enhancer handles celebrity tokens…"
                    rows={5}
                    className="bg-bg border border-rule2 rounded-md px-3 py-2.5 text-[14px] text-ink placeholder:text-ink3 outline-none focus:border-spark/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-spark text-white hover:bg-ember disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-md px-5 py-3 text-[14px] font-medium inline-flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send to engineering'}
                  {status !== 'submitting' && <ArrowRight size={14} />}
                </button>

                {status === 'error' && (
                  <p className="font-mono text-[11px] text-fail">
                    Could not send. Try emailing support@eachlabs.ai directly.
                  </p>
                )}

                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 leading-relaxed">
                  No SDR will call. No drip campaign. We use your email only to reply.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function Expectation({ label, body }: { label: string; body: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mt-1 w-12 shrink-0">
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
        Sent to engineering.
      </h2>
      <p className="text-ink2 text-[14.5px] leading-[1.6] mt-3 max-w-[360px]">
        We read every message. Expect a reply within one business day, direct from the team
        building each::labs.
      </p>
    </motion.div>
  );
}
