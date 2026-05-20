import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SignupBrandPanel } from '@/components/auth/AuthBrandPanels';
import { DevModeTitleToggle } from '@/components/auth/DevModeTitleToggle';
import { StatTile, StatGrid } from '@/components/ui/StatTile';
import { Eyebrow } from '@/components/ui/Eyebrow';

export function SignupBrand() {
  return (
    <AuthShell brand={<SignupBrandPanel />}>
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>* CHAPTER ONE &middot; PICK A DOOR</Eyebrow>
        <DevModeTitleToggle href="/sign-up?ui=terminal" />
      </div>

      <h1 className="font-sans font-semibold text-display sm:text-display-lg md:text-hero leading-[0.98] tracking-tightest mt-7 text-ink">
        <span className="block">
          Which <span className="hero-underline">door</span>?
        </span>
        <span className="block">
          <span className="text-ink-faint">spoiler:</span>{' '}
          <em className="text-brand">they all go down.</em>
        </span>
      </h1>

      <p className="text-body-lg leading-[1.6] text-ink-muted mt-7">
        <strong className="text-ink font-semibold">10K traces free.</strong>{' '}
        No card. You bring the curiosity.
      </p>

      <div className="mt-8">
        <OAuthButtons mode="signup" redirectTo="/onboarding?theme=brand" />
      </div>

      <StatGrid columns={3} className="mt-8">
        {[
          { v: '600+',   k: 'models',   sub: 'one API'     },
          { v: '<120ms', k: 'overhead', sub: 'router-fast' },
          { v: '$0',     k: 'to start', sub: 'no card'     },
        ].map((s) => (
          <StatTile key={s.k} value={s.v} label={s.k} sub={s.sub} size="sm" />
        ))}
      </StatGrid>

      <p className="mt-7 text-center text-ink-faint text-body-sm">
        Already have a key?{' '}
        <Link
          href="/sign-in"
          className="text-ink hover:text-brand font-medium underline-offset-4 hover:underline"
        >
          Sign in →
        </Link>
      </p>
    </AuthShell>
  );
}
