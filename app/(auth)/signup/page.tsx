import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import { SignupBrandPanel } from '@/components/auth/AuthBrandPanels';

export const metadata: Metadata = {
  title: 'Sign up · each::labs',
  description: 'API key in 60 seconds. 10K free traces. No credit card.',
};

export default function SignupPage() {
  return (
    <AuthShell brand={<SignupBrandPanel />}>
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        * TAKE THE LEAP · API KEY IN 60 SECONDS
      </div>

      <h1 className="font-display font-semibold text-[44px] sm:text-[52px] leading-[1.0] tracking-tightest mt-5 text-ink">
        Sign up.
        <br />
        <em className="text-spark">welcome to the rabbit hole.</em>
      </h1>

      <p className="text-ink2 text-[14.5px] leading-relaxed mt-5">
        Two clicks, one API key, 600+ AI models. No credit card. Cancel by deleting your key.
      </p>

      <div className="mt-8">
        <OAuthButtons mode="signup" />
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
