'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

type Subject =
  | 'bug'
  | 'feature'
  | 'partnership'
  | 'just-saying-hi'
  | 'something-broke'
  | 'other';

type FormState = {
  name: string;
  email: string;
  subject: Subject | '';
  message: string;
};

const initial: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const SUBJECTS: { value: Subject; label: string; sub: string }[] = [
  { value: 'something-broke',  label: 'Something\'s broken',      sub: 'and you want a human to look at it' },
  { value: 'bug',              label: 'I think I found a bug',    sub: 'we owe you a small medal' },
  { value: 'feature',          label: 'I want a feature',         sub: 'you know how to use the roadmap' },
  { value: 'partnership',      label: 'Partnership / press',      sub: 'co-marketing, podcasts, that kind' },
  { value: 'just-saying-hi',   label: 'Just saying hi',           sub: 'a noble use of the form' },
  { value: 'other',            label: 'Something else',           sub: 'we\'ll figure it out together' },
];

export default function ContactUsPage() {
  const [data, setData] = useState<FormState>(initial);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    try {
      // No backend yet, simulate then hand off to mailto: as a fallback so
      // the message actually leaves the building.
      await new Promise((r) => setTimeout(r, 500));
      const subjectLabel =
        SUBJECTS.find((s) => s.value === data.subject)?.label ?? 'General';
      const body = encodeURIComponent(
        `Hi support team,\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${subjectLabel}\n\n${data.message}\n`,
      );
      window.location.href = `mailto:support@eachlabs.ai?subject=${encodeURIComponent(
        `[Contact] ${subjectLabel}`,
      )}&body=${body}`;
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <section className="container py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] gap-12 lg:gap-20 items-start">
          {/* LEFT, playful copy */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              * CONTACT US
            </div>
            <h1 className="font-display font-semibold text-[44px] sm:text-[60px] lg:text-[68px] leading-[0.98] tracking-tightest mt-6 text-ink">
              Got a problem?
              <span className="block text-ink3 italic">Got a weird question?</span>
              <span className="block text-spark italic">Both?</span>
            </h1>
            <p className="text-ink2 text-[16px] leading-[1.6] max-w-[520px] mt-7">
              This is the catch-all form. Bugs, feature wishes, partnership requests, weird
              edge cases at 3 AM, or genuinely just to say hi, all of it lands in the same
              inbox, and a real human reads every one.
            </p>

            <ul className="mt-10 flex flex-col gap-4 max-w-[480px]">
              <Note label="ANYONE" body="No password, no signup, no waitlist. Fill the form, hit send." />
              <Note label="ANYWHERE" body="Compliance, sales, billing, the API, your cat's opinion on AI, all welcome." />
              <Note label="ANYTIME" body="Roughly one business day to reply. Sometimes faster, sometimes the on call is napping." />
            </ul>

            <div className="mt-10 pt-8 border-t border-rule">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-2">
                OR JUST EMAIL US LIKE IT'S 2008
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
                  placeholder="Whoever's typing"
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  value={data.email}
                  onChange={(v) => update('email', v)}
                  placeholder="we'll reply here"
                />

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                    What's this about?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUBJECTS.map((opt) => {
                      const isActive = data.subject === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('subject', opt.value)}
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
                    Tell us more
                    <span className="text-fail ml-1" aria-hidden>*</span>
                  </label>
                  <textarea
                    required
                    value={data.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Plain English is fine. Stack traces also fine. Vague vibes also fine."
                    rows={5}
                    className="bg-bg border border-rule2 rounded-md px-3 py-2.5 text-[14px] text-ink placeholder:text-ink3 outline-none focus:border-spark/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-spark text-white hover:bg-ember disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-md px-5 py-3 text-[14px] font-medium inline-flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? 'Sending…' : 'Send it'}
                  {status !== 'submitting' && <ArrowRight size={14} />}
                </button>

                {status === 'error' && (
                  <p className="font-mono text-[11px] text-fail">
                    Something broke on our side (the irony). Try emailing support@eachlabs.ai
                    directly.
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

function Note({ label, body }: { label: string; body: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark mt-1 w-20 shrink-0">
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
        Off it goes.
      </h2>
      <p className="text-ink2 text-[14.5px] leading-[1.6] mt-3 max-w-[360px]">
        Your email client should be opening with the message pre-filled. Hit send and we'll
        reply within one business day. Sometimes faster. Sometimes the on-call is napping.
      </p>
    </motion.div>
  );
}
