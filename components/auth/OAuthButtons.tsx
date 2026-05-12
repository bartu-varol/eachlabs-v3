'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Github, Loader2 } from 'lucide-react';

type Provider = 'github' | 'google';
type Mode = 'signup' | 'signin';

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

export function OAuthButtons({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState<Provider | null>(null);

  function handleClick(provider: Provider) {
    if (loading) return;
    setLoading(provider);
    // Mock, no real auth wired yet.
    // eslint-disable-next-line no-console
    console.log(`[mock] ${mode} via ${provider}`);
    setTimeout(() => router.push('/'), 900);
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        type="button"
        onClick={() => handleClick('github')}
        disabled={loading !== null}
        className="group w-full inline-flex items-center justify-center gap-3 h-12 rounded-md border border-rule2 bg-surface text-ink hover:bg-surface2 hover:border-rule transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading === 'github' ? (
          <Loader2 className="size-[18px] animate-spin text-ink2" />
        ) : (
          <Github className="size-[18px]" strokeWidth={1.6} />
        )}
        <span className="text-[14px] font-medium">Continue with GitHub</span>
      </button>

      <button
        type="button"
        onClick={() => handleClick('google')}
        disabled={loading !== null}
        className="group w-full inline-flex items-center justify-center gap-3 h-12 rounded-md border border-rule2 bg-surface text-ink hover:bg-surface2 hover:border-rule transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading === 'google' ? (
          <Loader2 className="size-[18px] animate-spin text-ink2" />
        ) : (
          <GoogleGlyph className="size-[18px]" />
        )}
        <span className="text-[14px] font-medium">Continue with Google</span>
      </button>
    </div>
  );
}
