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

      <h1 className="font-display font-semibold text-[44px] sm:text-[52px] leading-[1.0] tracking-tightest mt-5 text-ink">
        The pipeline
        <br />
        <em className="text-spark">kept running.</em>
      </h1>

      <p className="text-ink2 text-[14.5px] leading-relaxed mt-5">
        Same key, same workspace. Pick up where you left off.
      </p>

      <div className="mt-8">
        <OAuthButtons mode="signin" />
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
