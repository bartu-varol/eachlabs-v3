import Link from 'next/link';
import type { ReactNode } from 'react';
import { Wordmark } from '@/components/ui/Wordmark';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type Props = {
  /** Form column content, eyebrow, H1, OAuth, switch link. */
  children: ReactNode;
  /** Right-side brand column content (hidden on mobile). */
  brand: ReactNode;
};

export function AuthShell({ children, brand }: Props) {
  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Theme toggle, anchored to the page top-right */}
      <div className="absolute top-6 sm:top-8 lg:top-10 right-6 sm:right-10 lg:right-14 z-10">
        <ThemeToggle />
      </div>

      {/* LEFT, form column */}
      <div className="relative flex flex-col px-6 sm:px-10 lg:px-14 py-8 lg:py-10 min-h-screen">
        <Link
          href="/"
          aria-label="each::labs home"
          className="inline-flex w-fit hover:opacity-80 transition-opacity"
        >
          <Wordmark />
        </Link>

        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>

        <p className="text-ink3 text-[11px] leading-relaxed text-center max-w-[400px] mx-auto">
          By continuing, you agree to our{' '}
          <Link
            href="/terms-of-service"
            className="text-ink2 hover:text-ink underline underline-offset-2"
          >
            Terms
          </Link>
          {' & '}
          <Link
            href="/privacy-policy"
            className="text-ink2 hover:text-ink underline underline-offset-2"
          >
            Privacy
          </Link>
          .
        </p>
      </div>

      {/* RIGHT, brand column */}
      <div className="hidden lg:flex relative items-center justify-center px-12 py-10 bg-surface border-l border-rule2 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 85% 0%, rgb(var(--c-spark) / 0.07), transparent 60%), radial-gradient(ellipse 45% 40% at 8% 100%, rgb(var(--c-highlight) / 0.06), transparent 65%)',
          }}
        />
        <div className="relative">{brand}</div>
      </div>
    </div>
  );
}
