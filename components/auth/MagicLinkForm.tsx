'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

type Variant = 'signin' | 'signup';
type Theme = 'default' | 'boarding';

type Props = {
  variant: Variant;
  redirectTo?: string;
  theme?: Theme;
};

const COPY = {
  signin: {
    divider: 'or show passport',
    cta: 'Send magic link →',
    ctaClass: 'bg-ink text-bg hover:bg-spark hover:text-bg',
    footnote: null as string | null,
  },
  signup: {
    divider: 'or issue ticket by email',
    cta: 'Issue ticket →',
    ctaClass: 'bg-spark text-bg hover:bg-ember',
    footnote: '✱ no password, we send a one-tap link.',
  },
} as const;

const DEFAULT_DEST: Record<Variant, string> = {
  signin: '/',
  signup: '/onboarding',
};

const BOARDING_STEPS = [
  'verifying email',
  'stamping ticket',
  'opening gate',
];

const DEFAULT_STEPS = ['sending link', 'check your inbox'];

export function MagicLinkForm({ variant, redirectTo, theme = 'default' }: Props) {
  const router = useRouter();
  const copy = COPY[variant];
  const inputId = `${variant}-magic-email`;
  const destination = redirectTo ?? DEFAULT_DEST[variant];
  const steps = theme === 'boarding' ? BOARDING_STEPS : DEFAULT_STEPS;
  const stepInterval = theme === 'boarding' ? 620 : 520;

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Mock, real magic-link wiring lives elsewhere.
    if (submitted) return;
    setSubmitted(true);
    setStepIndex(0);
  }

  useEffect(() => {
    if (stepIndex < 0) return;
    if (stepIndex >= steps.length) {
      const t = setTimeout(() => router.push(destination), 380);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), stepInterval);
    return () => clearTimeout(t);
  }, [stepIndex, steps.length, stepInterval, router, destination]);

  return (
    <>
      <div className="mt-10 grid grid-cols-3 items-center gap-3">
        <span className="h-px bg-rule2" />
        <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 text-center">
          {copy.divider}
        </span>
        <span className="h-px bg-rule2" />
      </div>

      {submitted ? (
        <div className="mt-6 rounded-md border border-rule2 bg-surface p-4 animate-panel-in">
          <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 mb-3 flex items-center justify-between">
            <span>{theme === 'boarding' ? '* boarding via magic link' : '* on its way'}</span>
            <span className="text-ink3 truncate ml-3 max-w-[180px]">{email || 'you@team.com'}</span>
          </div>
          <ul className="space-y-1.5">
            {steps.map((s, i) => {
              if (i > stepIndex) return null;
              const isDone = i < stepIndex;
              return (
                <li key={s} className="font-mono text-[13px] flex items-center gap-2 animate-panel-in">
                  {isDone ? (
                    <Check className="size-[14px] text-success shrink-0" strokeWidth={2.5} />
                  ) : (
                    <Loader2 className="size-[14px] text-spark animate-spin shrink-0" />
                  )}
                  <span className={isDone ? 'text-ink' : 'text-ink2'}>{s}</span>
                  {!isDone && <span className="text-ink3 ml-0.5 animate-pulse">…</span>}
                </li>
              );
            })}
            {stepIndex >= steps.length && (
              <li className="font-mono text-[12px] text-ink3 flex items-center gap-2 pt-1 animate-panel-in">
                <span className="text-spark">↗</span>
                <span>redirecting to {destination}</span>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex items-stretch gap-2">
          <label className="sr-only" htmlFor={inputId}>
            Email
          </label>
          <input
            id={inputId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@team.com"
            className="flex-1 px-4 py-3 bg-bg border border-rule2 rounded-md text-ink placeholder:text-ink3 text-[14px] focus:outline-none focus:border-spark/60"
          />
          <button
            type="submit"
            className={`px-5 py-3 rounded-md text-[13.5px] font-medium whitespace-nowrap transition-colors ${copy.ctaClass}`}
          >
            {copy.cta}
          </button>
        </form>
      )}

      {!submitted && copy.footnote && (
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
          {copy.footnote}
        </p>
      )}
    </>
  );
}
