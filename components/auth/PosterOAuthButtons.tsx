'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type Provider = 'github' | 'google';
type Mode = 'signup' | 'signin';

/** Editorial / poster styling: outlined, transparent fill, no icons, mono label. */
export function PosterOAuthButtons({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [loading, setLoading] = useState<Provider | null>(null);

  function handleClick(provider: Provider) {
    if (loading) return;
    setLoading(provider);
    // eslint-disable-next-line no-console
    console.log(`[mock] ${mode} via ${provider}`);
    setTimeout(() => router.push('/'), 950);
  }

  const providers: { id: Provider; label: string }[] = [
    { id: 'github', label: 'Continue with GitHub' },
    { id: 'google', label: 'Continue with Google' },
  ];

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-[340px] mx-auto">
      {providers.map((p) => {
        const isLoading = loading === p.id;
        const isOther = loading !== null && !isLoading;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => handleClick(p.id)}
            disabled={loading !== null}
            className={[
              'group h-11 inline-flex items-center justify-between gap-3 px-5 rounded-full',
              'border border-rule2 bg-transparent text-ink',
              'hover:border-ink hover:bg-surface/60 transition-colors',
              'disabled:cursor-not-allowed',
              isOther ? 'opacity-30' : '',
            ].join(' ')}
          >
            <span className="text-[14px] font-medium tracking-tight">{p.label}</span>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin text-ink3" />
            ) : (
              <span
                aria-hidden
                className="text-ink3 group-hover:text-spark group-hover:translate-x-0.5 transition-all text-[14px]"
              >
                →
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
