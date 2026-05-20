'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';

type Provider = {
  id: 'github' | 'google';
  label: string;
  note: string;
  Icon: React.ComponentType<{ className?: string }>;
};

function GoogleGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

const PROVIDERS: Provider[] = [
  { id: 'github', label: 'github', note: 'popular w/ developers', Icon: ({ className }) => <Github className={className} strokeWidth={1.6} /> },
  { id: 'google', label: 'google', note: 'popular w/ humans',     Icon: ({ className }) => <GoogleGlyph className={className} /> },
];

type Mode = 'signup' | 'signin';

const DEFAULT_DEST: Record<Mode, string> = {
  signin: '/',
  signup: '/onboarding',
};

const SIGNIN_LINES = [
  'verifying identity',
  'restoring session',
  'welcome back',
];

const SIGNUP_LINES = [
  'creating identity',
  'provisioning workspace',
  'minting api key',
  'welcome aboard',
];

export function AuthTerminalAuth({ mode, redirectTo }: { mode: Mode; redirectTo?: string }) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [confirmedProvider, setConfirmedProvider] = useState<Provider['id'] | null>(null);
  const [lineIndex, setLineIndex] = useState(-1);

  const destination = redirectTo ?? DEFAULT_DEST[mode];
  const lines = mode === 'signup' ? SIGNUP_LINES : SIGNIN_LINES;

  function confirm(p: Provider) {
    if (confirmedProvider) return;
    setConfirmedProvider(p.id);
    setLineIndex(0);
  }

  useEffect(() => {
    if (lineIndex < 0) return;
    if (lineIndex >= lines.length) {
      const t = setTimeout(() => router.push(destination), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIndex((i) => i + 1), 540);
    return () => clearTimeout(t);
  }, [lineIndex, lines.length, router, destination]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (confirmedProvider) return;
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setActive((i) => (i + 1) % PROVIDERS.length);
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setActive((i) => (i - 1 + PROVIDERS.length) % PROVIDERS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        confirm(PROVIDERS[active]);
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, confirmedProvider]);

  const question = mode === 'signup' ? 'choose an identity provider:' : 'continue as:';

  return (
    <div role="listbox" aria-label="Identity providers" className="text-body-sm leading-[1.85]">
      <div className="text-ink-muted">
        <span className="text-brand">?</span> {question}
      </div>

      <ul className="mt-2">
        {PROVIDERS.map((p, i) => {
          const isActive = i === active;
          const isConfirmed = confirmedProvider === p.id;
          const isOther = confirmedProvider !== null && !isConfirmed;
          return (
            <li key={p.id}>
              <button
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => !confirmedProvider && setActive(i)}
                onClick={() => confirm(p)}
                disabled={confirmedProvider !== null}
                className={[
                  'group w-full text-left flex items-center gap-3 px-3 py-2 rounded-sm border transition-colors',
                  isActive
                    ? 'border-brand/60 bg-brand/[0.06]'
                    : 'border-transparent hover:border-field',
                  isOther ? 'opacity-40' : '',
                ].join(' ')}
              >
                <span
                  aria-hidden
                  className={[
                    'w-4 inline-block text-body',
                    isActive ? 'text-brand' : 'text-transparent',
                  ].join(' ')}
                >
                  ▸
                </span>
                <p.Icon className="size-[16px] shrink-0" />
                <span className={isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}>
                  {p.label}
                </span>
                <span className="text-ink-faint ml-2"># {p.note}</span>
                {isConfirmed && (
                  <span className="ml-auto text-brand inline-flex items-center gap-1">
                    <span className="inline-block animate-pulse">
                      {mode === 'signin' ? 'signing in' : 'signing up'}
                    </span>
                    <span className="inline-block animate-pulse">…</span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {confirmedProvider && (
        <div className="mt-5 font-mono text-body-sm leading-[1.85] text-ink-muted animate-panel-in">
          {lines.map((line, i) => {
            if (i > lineIndex) return null;
            const isDone = i < lineIndex;
            return (
              <div key={line} className="animate-panel-in">
                <span className={isDone ? 'text-ok' : 'text-brand animate-pulse'}>
                  {isDone ? '✓' : '·'}
                </span>{' '}
                <span className={isDone ? 'text-ink' : 'text-ink-muted'}>{line}</span>
                {!isDone && <span className="text-ink-faint"> …</span>}
              </div>
            );
          })}
          {lineIndex >= lines.length && (
            <div className="mt-2 animate-panel-in">
              <span className="text-brand">↗</span>{' '}
              <span className="text-ink-faint">redirecting to {destination}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
