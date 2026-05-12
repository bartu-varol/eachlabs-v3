import type { Metadata } from 'next';
import { AuthPosterShell } from '@/components/auth/AuthPosterShell';
import { PosterOAuthButtons } from '@/components/auth/PosterOAuthButtons';

export const metadata: Metadata = {
  title: 'Back so soon · each::labs',
  description: 'We kept your key warm.',
};

export default function Signin3Page() {
  return (
    <AuthPosterShell switchLink={{ label: 'Take the leap →', href: '/signup3' }}>
      <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
        * CHAPTER TWO &middot; THE RETURN
      </div>

      <h1 className="font-display font-light italic text-[64px] sm:text-[88px] md:text-[112px] lg:text-[128px] leading-[0.95] tracking-tightest text-ink2 mt-6">
        Back <span className="not-italic font-medium text-spark">so soon?</span>
      </h1>

      <p className="text-ink2 text-[18px] sm:text-[20px] italic mt-7">
        we kept your key warm.
      </p>

      <div className="mt-14">
        <PosterOAuthButtons mode="signin" />
      </div>
    </AuthPosterShell>
  );
}
