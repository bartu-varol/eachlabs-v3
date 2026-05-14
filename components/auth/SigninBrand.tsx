import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SigninBrandPanel } from '@/components/auth/AuthBrandPanels';
import { DevModeTitleToggle } from '@/components/auth/DevModeTitleToggle';

export function SigninBrand() {
  return (
    <AuthShell brand={<SigninBrandPanel />}>
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
          * CHAPTER TWO &middot; THE RETURN
        </div>
        <DevModeTitleToggle href="/signin?ui=terminal" />
      </div>

      <h1 className="font-display font-semibold text-[44px] sm:text-[56px] md:text-[64px] leading-[0.98] tracking-tightest mt-7 text-ink">
        <span className="block">
          The <span className="hero-underline">pipeline</span>
        </span>
        <span className="block">
          <em className="text-spark">kept running.</em>
        </span>
      </h1>

      <p className="text-[15.5px] leading-[1.6] text-ink2 mt-7">
        <strong className="text-ink font-semibold">Same key, same workspace.</strong>{' '}
        Pick up where you left off.
      </p>

      <div className="mt-8">
        <OAuthButtons mode="signin" />
      </div>

      <div className="mt-8 inline-flex items-center gap-2">
        <span className="relative flex size-2" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-success/50 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-success">
          99.99% &middot; all systems operational
        </span>
      </div>

      <p className="mt-7 text-center text-ink3 text-[13px]">
        New here?{' '}
        <Link
          href="/signup"
          className="text-ink hover:text-spark font-medium underline-offset-4 hover:underline"
        >
          Take the leap →
        </Link>
      </p>
    </AuthShell>
  );
}
