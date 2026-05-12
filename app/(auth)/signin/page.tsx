import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SigninBrandPanel } from '@/components/auth/AuthBrandPanels';

export const metadata: Metadata = {
  title: 'Sign in · each::labs',
  description: 'Welcome back. The chaos missed you.',
};

export default function SigninPage() {
  return (
    <AuthShell brand={<SigninBrandPanel />}>
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        * WELCOME BACK · LET&rsquo;S SHIP
      </div>

      <h1 className="font-display font-semibold text-[44px] sm:text-[52px] leading-[1.0] tracking-tightest mt-5 text-ink">
        Sign in.
        <br />
        <em className="text-spark">the chaos missed you.</em>
      </h1>

      <p className="text-ink2 text-[14.5px] leading-relaxed mt-5">
        Same key, same <code className="font-mono text-[13px] text-spark">each.run()</code>. Pick up where you left off.
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
