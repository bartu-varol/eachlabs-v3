import Link from 'next/link';
import type { ReactNode } from 'react';
import { Wordmark } from '@/components/ui/Wordmark';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type Props = {
  /** Switch link label + href (the OTHER auth flow). */
  switchLink: { label: string; href: string };
  children: ReactNode;
};

export function AuthPosterShell({ switchLink, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* Header, minimal */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-6">
        <Link
          href="/"
          aria-label="each::labs home"
          className="inline-flex w-fit hover:opacity-80 transition-opacity"
        >
          <Wordmark />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={switchLink.href}
            className="text-ink2 hover:text-ink text-[13px] font-medium underline-offset-4 hover:underline"
          >
            {switchLink.label}
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Body, vertically centered poster */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[820px] text-center">{children}</div>
      </main>

      {/* Footer, single line */}
      <footer className="px-6 sm:px-10 py-6 text-center">
        <p className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
          NO CREDIT CARD &middot; NO &ldquo;JUMP ON A QUICK CALL&rdquo; &middot; CANCEL BY DELETING YOUR API KEY
        </p>
      </footer>
    </div>
  );
}
