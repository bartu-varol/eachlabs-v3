import Link from 'next/link';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

type Tab = { label: string; href: string; active?: boolean };

type Props = {
  /** Path shown in the window title, e.g. "~/each-auth/signup". */
  cwd: string;
  /** Window tabs at the top, used for the signup/signin switcher. */
  tabs: Tab[];
  children: ReactNode;
};

export function AuthTerminalShell({ cwd, tabs, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-mono text-ink">
      {/* WINDOW CHROME ─────────────────────────────────────────── */}
      <header className="flex items-center gap-4 px-4 sm:px-6 h-11 border-b border-rule2 bg-surface select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2.5 rounded-full bg-fail/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-sun/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-success/80" aria-hidden />
        </div>

        <div className="hidden sm:block text-[11px] uppercase tracking-eyebrow text-ink3 shrink-0">
          each@labs · zsh
        </div>

        <nav className="flex items-stretch gap-px ml-auto sm:ml-0 sm:mx-auto">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={[
                'inline-flex items-center px-3 h-8 self-center rounded-sm text-[12px] transition-colors',
                t.active
                  ? 'bg-bg text-ink border border-rule2 border-b-transparent'
                  : 'text-ink3 hover:text-ink hover:bg-bg/60',
              ].join(' ')}
            >
              {t.active && <span className="text-spark mr-1.5">▸</span>}
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <Link
            href="/"
            aria-label="Close terminal · back to home"
            className="inline-flex items-center justify-center size-10 border border-rule2 rounded-md text-ink2 hover:text-fail hover:border-fail transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </Link>
        </div>
      </header>

      {/* PATH BAR ──────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 h-8 flex items-center border-b border-rule2 text-[11.5px] text-ink3">
        <span className="text-success">●</span>
        <span className="ml-2">
          <span className="text-ink2">{cwd}</span>
          <span className="text-spark"> ↗</span>
        </span>
      </div>

      {/* BODY ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-[760px]">{children}</div>
      </main>

      {/* STATUS BAR ───────────────────────────────────────────── */}
      <footer className="flex items-center justify-between gap-4 px-4 sm:px-6 h-8 border-t border-rule2 bg-surface text-[10.5px] uppercase tracking-eyebrow text-ink3 select-none">
        <span>
          <span className="text-success">●</span> 99.99% ops
        </span>
        <span className="hidden sm:inline">
          [<span className="text-ink2">↑↓</span>] move · [<span className="text-ink2">↵</span>] confirm · [<span className="text-ink2">esc</span>] home
        </span>
        <span>each::labs · 2026</span>
      </footer>
    </div>
  );
}
