import type { Metadata } from 'next';
import { AuthPosterShell } from '@/components/auth/AuthPosterShell';
import { PosterOAuthButtons } from '@/components/auth/PosterOAuthButtons';

export const metadata: Metadata = {
  title: 'Welcome down · each::labs',
  description: 'The rabbit hole has wifi.',
};

export default function Signup3Page() {
  return (
    <AuthPosterShell switchLink={{ label: 'Sign in →', href: '/signin3' }}>
      <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
        * CHAPTER ONE &middot; THE RABBIT HOLE
      </div>

      <h1 className="font-display font-light italic text-[64px] sm:text-[88px] md:text-[112px] lg:text-[128px] leading-[0.95] tracking-tightest text-ink2 mt-6">
        Welcome <span className="not-italic font-medium text-spark">down.</span>
      </h1>

      <p className="text-ink2 text-[18px] sm:text-[20px] italic mt-7">
        the rabbit hole has wifi.
      </p>

      <div className="mt-14">
        <PosterOAuthButtons mode="signup" />
      </div>
    </AuthPosterShell>
  );
}
