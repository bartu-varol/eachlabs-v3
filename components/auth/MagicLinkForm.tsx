'use client';

import { type FormEvent } from 'react';

type Props = {
  variant: 'signin' | 'signup';
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

export function MagicLinkForm({ variant }: Props) {
  const copy = COPY[variant];
  const inputId = `${variant}4-email`;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Mock, real magic-link wiring lives elsewhere.
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-3 items-center gap-3">
        <span className="h-px bg-rule2" />
        <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 text-center">
          {copy.divider}
        </span>
        <span className="h-px bg-rule2" />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex items-stretch gap-2">
        <label className="sr-only" htmlFor={inputId}>
          Email
        </label>
        <input
          id={inputId}
          type="email"
          required
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

      {copy.footnote && (
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
          {copy.footnote}
        </p>
      )}
    </>
  );
}
