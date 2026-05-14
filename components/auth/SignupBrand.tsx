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

      <h1 className="font-display font-semibold text-[44px] sm:text-[56px] md:text-[64px] leading-[0.98] tracking-tightest mt-7 text-ink">
        <span className="block">
          Which <span className="hero-underline">door</span>?
        </span>
        <span className="block">
          <span className="text-ink3">spoiler:</span>{' '}
          <em className="text-spark">they all go down.</em>
        </span>
      </h1>

      <p className="text-[15.5px] leading-[1.6] text-ink2 mt-7">
        <strong className="text-ink font-semibold">10K traces free.</strong>{' '}
        No card. You bring the curiosity.
      </p>

      <div className="mt-8">
        <OAuthButtons mode="signup" redirectTo="/onboarding?theme=brand" />
      </div>

      <div className="mt-8 grid grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden">
        {[
          { v: '600+', k: 'models',     sub: 'one API'      },
          { v: '<120ms', k: 'overhead', sub: 'router-fast'  },
          { v: '$0', k: 'to start',     sub: 'no card'      },
        ].map((s) => (
          <div key={s.k} className="bg-surface px-3 py-3">
            <div className="font-display font-semibold text-[18px] text-spark tabular-nums leading-none">
              {s.v}
            </div>
            <div className="text-ink text-[10.5px] mt-1.5 font-medium">{s.k}</div>
            <div className="text-ink3 text-[10px] italic mt-0.5">{s.sub}</div>
          </div>
        ))}
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
