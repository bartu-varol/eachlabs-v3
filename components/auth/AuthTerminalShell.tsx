'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthDevMode } from '@/components/auth/AuthDevModeContext';

type Tab = { label: string; href: string; active?: boolean };

type Props = {
  /** Path shown in the window title, e.g. "~/each-auth/signup". */
  cwd: string;
  /** Window tabs at the top, used for the signup/signin switcher. */
  tabs: Tab[];
  /** Red dot destination — close terminal, go home. Default "/". */
  homeHref?: string;
  /** Yellow dot destination — close terminal, show brand variant. */
  brandHref?: string;
  children: ReactNode;
};

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AuthTerminalShell({
  cwd,
  tabs,
  homeHref = '/',
  brandHref,
  children,
}: Props) {
  const { minimized, setMinimized } = useAuthDevMode();
  const yellow = brandHref ?? homeHref;

  useEffect(() => {
    return () => setMinimized(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.div
        animate={{
          scale: minimized ? 0.18 : 1,
          opacity: minimized ? 0 : 1,
          x: minimized ? -200 : 0,
          y: minimized ? 220 : 0,
        }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        style={{ transformOrigin: 'bottom left', pointerEvents: minimized ? 'none' : 'auto' }}
        aria-hidden={minimized}
        className="fixed inset-0 z-40 flex flex-col bg-bg font-mono text-ink"
      >
        <header className="flex items-center gap-4 px-4 sm:px-6 h-11 border-b border-rule2 bg-surface select-none">
          <div className="flex items-center gap-2 shrink-0">
            <DotLink href={homeHref} color="red" title="Close · home" />
            <DotLink href={yellow} color="yellow" title="Close · brand mode" />
            <DotButton onClick={() => setMinimized(true)} color="green" title="Minimize" />
          </div>

          <div className="hidden sm:block text-[11px] uppercase tracking-eyebrow text-ink3 shrink-0">
            each@labs · zsh
          </div>

          <nav className="flex items-stretch gap-px ml-auto sm:mx-auto">
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

          <div className="ml-auto flex items-center shrink-0 [&_button]:size-7 [&_button_svg]:size-3.5">
            <ThemeToggle />
          </div>
        </header>

        <div className="px-4 sm:px-6 h-8 flex items-center border-b border-rule2 text-[11.5px] text-ink3">
          <span className="text-success">●</span>
          <span className="ml-2">
            <span className="text-ink2">{cwd}</span>
            <span className="text-spark"> ↗</span>
          </span>
        </div>

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-[760px]">{children}</div>
        </main>

        <footer className="flex items-center justify-between gap-4 px-4 sm:px-6 h-8 border-t border-rule2 bg-surface text-[10.5px] uppercase tracking-eyebrow text-ink3 select-none">
          <span>
            <span className="text-success">●</span> 99.99% ops
          </span>
          <span className="hidden sm:inline">
            [<span className="text-ink2">↑↓</span>] move · [<span className="text-ink2">↵</span>] confirm
          </span>
          <span>each::labs · 2026</span>
        </footer>
      </motion.div>

      <motion.div
        animate={{
          scale: minimized ? 1 : 0,
          opacity: minimized ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        style={{ transformOrigin: 'bottom left', pointerEvents: minimized ? 'auto' : 'none' }}
        className="fixed bottom-4 left-4 z-50"
        aria-hidden={!minimized}
      >
        <MinimizedWindow
          cwd={cwd}
          homeHref={homeHref}
          brandHref={yellow}
          onRestore={() => setMinimized(false)}
        />
      </motion.div>
    </>
  );
}

type DotColor = 'red' | 'yellow' | 'green';

const DOT_COLOR: Record<DotColor, string> = {
  red: 'bg-fail/80 hover:bg-fail',
  yellow: 'bg-sun/80 hover:bg-sun',
  green: 'bg-success/80 hover:bg-success',
};

function DotLink({ href, color, title }: { href: string; color: DotColor; title: string }) {
  return (
    <Link
      href={href}
      aria-label={title}
      title={title}
      className={`size-3 rounded-full ${DOT_COLOR[color]} transition-colors cursor-pointer`}
    />
  );
}

function DotButton({
  onClick,
  color,
  title,
}: {
  onClick: () => void;
  color: DotColor;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      title={title}
      className={`size-3 rounded-full ${DOT_COLOR[color]} transition-colors cursor-pointer`}
    />
  );
}

function MinimizedWindow({
  cwd,
  homeHref,
  brandHref,
  onRestore,
}: {
  cwd: string;
  homeHref: string;
  brandHref: string;
  onRestore: () => void;
}) {
  return (
    <div
      className="rounded-md border border-rule2 bg-surface shadow-[0_18px_40px_-12px_rgb(0_0_0_/_0.45)] overflow-hidden w-[260px] hover:border-spark/60 transition-colors group"
      role="dialog"
      aria-label="Minimized terminal"
    >
      <div className="flex items-center gap-2 px-2.5 py-2 bg-bg border-b border-rule2">
        <Link
          href={homeHref}
          aria-label="Close · home"
          title="Close · home"
          className="size-2 rounded-full bg-fail/80 hover:bg-fail transition-colors"
        />
        <Link
          href={brandHref}
          aria-label="Close · brand mode"
          title="Close · brand mode"
          className="size-2 rounded-full bg-sun/80 hover:bg-sun transition-colors"
        />
        <button
          type="button"
          onClick={onRestore}
          aria-label="Restore"
          title="Restore"
          className="size-2 rounded-full bg-success/80 hover:bg-success transition-colors"
        />
        <span className="ml-1.5 font-mono text-[9px] uppercase tracking-eyebrow text-ink3 truncate flex-1">
          {cwd}
        </span>
      </div>
      <button
        type="button"
        onClick={onRestore}
        className="w-full text-left px-3 py-2.5 font-mono text-[10.5px] leading-[1.75] text-ink2 hover:bg-spark/[0.05] transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="relative flex size-1.5">
            <span className="absolute inset-0 rounded-full bg-success/60 animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          <span className="text-success uppercase tracking-eyebrow text-[9px]">session active</span>
        </div>
        <div className="text-ink3 mt-1.5">$ each auth · running…</div>
        <div className="text-spark">
          ▸ click to restore<span aria-hidden className="inline-block w-1.5 h-3 bg-spark/80 ml-1 align-middle animate-pulse" />
        </div>
      </button>
    </div>
  );
}
