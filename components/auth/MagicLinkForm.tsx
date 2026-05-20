'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { RaisedBox } from '@/components/ui/RaisedBox';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Variant = 'signin' | 'signup';

type Props = {
  variant: Variant;
  redirectTo?: string;
};

const COPY = {
  signin: {
    divider: 'or show passport',
    cta: 'Send magic link →',
    ctaClass: 'bg-ink text-surface hover:bg-brand hover:text-surface',
    footnote: null as string | null,
  },
  signup: {
    divider: 'or issue ticket by email',
    cta: 'Issue ticket →',
    ctaClass: 'bg-brand text-surface hover:bg-brand-deep',
    footnote: '✱ no password, we send a one-tap link.',
  },
} as const;

const DEFAULT_DEST: Record<Variant, string> = {
  signin: '/',
  signup: '/onboarding',
};

const DEFAULT_STEPS = ['sending link', 'check your inbox'];

export function MagicLinkForm({ variant, redirectTo }: Props) {
  const router = useRouter();
  const copy = COPY[variant];
  const inputId = `${variant}-magic-email`;
  const destination = redirectTo ?? DEFAULT_DEST[variant];
  const steps = DEFAULT_STEPS;
  const stepInterval = 520;

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
        <span className="h-px bg-field" />
        <Eyebrow as="span" size="sm" tone="ink-faint" className="text-center">{copy.divider}</Eyebrow>
        <span className="h-px bg-field" />
      </div>

      {submitted ? (
        <RaisedBox padding="sm" className="mt-6 animate-panel-in">
          <div className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mb-3 flex items-center justify-between">
            <span>* on its way</span>
            <span className="text-ink-faint truncate ml-3 max-w-[180px]">{email || 'you@team.com'}</span>
          </div>
          <ul className="space-y-1.5">
            {steps.map((s, i) => {
              if (i > stepIndex) return null;
              const isDone = i < stepIndex;
              return (
                <li key={s} className="font-mono text-body-sm flex items-center gap-2 animate-panel-in">
                  {isDone ? (
                    <Check className="size-[14px] text-ok shrink-0" strokeWidth={2.5} />
                  ) : (
                    <Loader2 className="size-[14px] text-brand animate-spin shrink-0" />
                  )}
                  <span className={isDone ? 'text-ink' : 'text-ink-muted'}>{s}</span>
                  {!isDone && <span className="text-ink-faint ml-0.5 animate-pulse">…</span>}
                </li>
              );
            })}
            {stepIndex >= steps.length && (
              <li className="font-mono text-caption text-ink-faint flex items-center gap-2 pt-1 animate-panel-in">
                <span className="text-brand">↗</span>
                <span>redirecting to {destination}</span>
              </li>
            )}
          </ul>
        </RaisedBox>
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
            className="flex-1 px-4 py-3 bg-surface border border-field rounded-md text-ink placeholder:text-ink-faint text-body focus:outline-none focus:border-brand/60"
          />
          <button
            type="submit"
            className={`px-5 py-3 rounded-md text-body-sm font-medium whitespace-nowrap transition-colors ${copy.ctaClass}`}
          >
            {copy.cta}
          </button>
        </form>
      )}

      {!submitted && copy.footnote && (
        <p className="mt-4 font-mono text-micro uppercase tracking-eyebrow text-ink-faint">
          {copy.footnote}
        </p>
      )}
    </>
  );
}
