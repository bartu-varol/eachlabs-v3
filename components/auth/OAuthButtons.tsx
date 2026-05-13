'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Loader2, Check } from 'lucide-react';

type Provider = 'github' | 'google';
type Mode = 'signup' | 'signin';
type Theme = 'default' | 'boarding';

type Props = {
  mode: Mode;
  redirectTo?: string;
  theme?: Theme;
};

const DEFAULT_DEST: Record<Mode, string> = {
  signin: '/',
  signup: '/onboarding',
};

const BOARDING_STEPS = [
  'scanning boarding pass',
  'verifying passenger',
  'assigning seat',
  'now boarding · gate 4',
];

const DEFAULT_STEPS_SIGNIN = ['signing you in', 'welcome back'];
const DEFAULT_STEPS_SIGNUP = ['provisioning workspace', 'welcome aboard'];

function GoogleGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function OAuthButtons({ mode, redirectTo, theme = 'default' }: Props) {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);

  const destination = redirectTo ?? DEFAULT_DEST[mode];
  const steps =
    theme === 'boarding'
      ? BOARDING_STEPS
      : mode === 'signin'
        ? DEFAULT_STEPS_SIGNIN
        : DEFAULT_STEPS_SIGNUP;
  const stepInterval = theme === 'boarding' ? 620 : 520;

  function handleClick(p: Provider) {
    if (provider) return;
    setProvider(p);
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

  if (provider) {
    return (
      <div className="rounded-md border border-rule2 bg-surface p-4 animate-panel-in">
        <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 mb-3 flex items-center justify-between">
          <span>{theme === 'boarding' ? '* boarding in progress' : '* one moment'}</span>
          <span className="text-ink3">via {provider}</span>
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
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        type="button"
        onClick={() => handleClick('github')}
        className="group w-full inline-flex items-center justify-center gap-3 h-12 rounded-md border border-rule2 bg-surface text-ink hover:bg-surface2 hover:border-rule transition-colors"
      >
        <Github className="size-[18px]" strokeWidth={1.6} />
        <span className="text-[14px] font-medium">Continue with GitHub</span>
      </button>

      <button
        type="button"
        onClick={() => handleClick('google')}
        className="group w-full inline-flex items-center justify-center gap-3 h-12 rounded-md border border-rule2 bg-surface text-ink hover:bg-surface2 hover:border-rule transition-colors"
      >
        <GoogleGlyph className="size-[18px]" />
        <span className="text-[14px] font-medium">Continue with Google</span>
      </button>
    </div>
  );
}
