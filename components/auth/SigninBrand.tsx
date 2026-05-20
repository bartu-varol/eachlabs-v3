import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SigninBrandPanel } from '@/components/auth/AuthBrandPanels';
import { DevModeTitleToggle } from '@/components/auth/DevModeTitleToggle';
import { Eyebrow } from '@/components/ui/Eyebrow';

export function SigninBrand() {
  return (
    <AuthShell brand={<SigninBrandPanel />}>
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>* CHAPTER TWO &middot; THE RETURN</Eyebrow>
        <DevModeTitleToggle href="/sign-in?ui=terminal" />
      </div>

      <h1 className="font-sans font-semibold text-display sm:text-display-lg md:text-hero leading-[0.98] tracking-tightest mt-7 text-ink">
        <span className="block">
          The <span className="hero-underline">pipeline</span>
        </span>
        <span className="block">
          <em className="text-brand">kept running.</em>
        </span>
      </h1>

      <p className="text-body-lg leading-[1.6] text-ink-muted mt-7">
        <strong className="text-ink font-semibold">Same key, same workspace.</strong>{' '}
        Pick up where you left off.
      </p>

      <div className="mt-8">
        <OAuthButtons mode="signin" />
      </div>

      <div className="mt-8 inline-flex items-center gap-2">
        <span className="relative flex size-2" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-ok/50 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-ok" />
        </span>
        <span className="font-mono text-micro uppercase tracking-eyebrow text-ok">
          99.99% &middot; all systems operational
        </span>
      </div>

      <p className="mt-7 text-center text-ink-faint text-body-sm">
        New here?{' '}
        <Link
          href="/sign-up"
          className="text-ink hover:text-brand font-medium underline-offset-4 hover:underline"
        >
          Take the leap →
        </Link>
      </p>
    </AuthShell>
  );
}
