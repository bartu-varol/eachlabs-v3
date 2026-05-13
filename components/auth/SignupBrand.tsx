import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SignupBrandPanel } from '@/components/auth/AuthBrandPanels';
import { DevModeTitleToggle } from '@/components/auth/DevModeTitleToggle';

export function SignupBrand() {
  return (
    <AuthShell brand={<SignupBrandPanel />}>
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
          * CHAPTER ONE &middot; PICK A DOOR
        </div>
        <DevModeTitleToggle href="/signup?ui=terminal" />
      </div>

      <h1 className="font-display font-semibold text-[44px] sm:text-[60px] leading-[1.0] tracking-tightest mt-5 text-ink">
        Which door?
        <br />
        <em className="text-spark">spoiler: they all go down.</em>
      </h1>

      <p className="text-ink2 text-[14.5px] leading-relaxed mt-5">
        10K traces free. No card. You bring the curiosity.
      </p>

      <div className="mt-8">
        <OAuthButtons mode="signup" redirectTo="/onboarding?theme=brand" />
      </div>

      <p className="mt-7 text-center text-ink3 text-[13px]">
        Already have a key?{' '}
        <Link
          href="/signin"
          className="text-ink hover:text-spark font-medium underline-offset-4 hover:underline"
        >
          Sign in →
        </Link>
      </p>
    </AuthShell>
  );
}
