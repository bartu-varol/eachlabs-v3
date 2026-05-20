'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthDevMode } from '@/components/auth/AuthDevModeContext';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function DevModeTitleToggle({ href }: { href: string }) {
  const router = useRouter();
  const { minimized } = useAuthDevMode();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  function expand() {
    if (rect || minimized) return;
    const r = buttonRef.current?.getBoundingClientRect();
    if (!r) {
      router.push(href);
      return;
    }
    setHovered(false);
    setRect(r);
    setTimeout(() => router.push(href), 460);
  }

  useEffect(() => {
    if (!rect) return;
    const t = setTimeout(() => setRect(null), 700);
    return () => clearTimeout(t);
  }, [rect]);

  if (minimized) {
    return (
      <div
        aria-disabled
        title="Terminal running in background · use the minimized window to restore"
        className="inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint border border-field bg-surface-raised/60 rounded-sm px-2.5 h-7 cursor-not-allowed select-none"
      >
        <span aria-hidden className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-ok/60 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-ok" />
        </span>
        <span className="text-ok">running…</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={expand}
        aria-label="Open dev mode (terminal variant)"
        className="group inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-muted hover:text-ink border border-field hover:border-brand/60 hover:bg-brand/[0.05] rounded-sm px-2.5 h-7 transition-colors"
      >
        <span aria-hidden className="text-brand group-hover:animate-pulse">›_</span>
        <span>dev mode</span>
      </button>

      <AnimatePresence>
        {hovered && !rect && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: easeOutExpo }}
            className="absolute top-[calc(100%+10px)] right-0 w-[260px] z-50 pointer-events-none origin-top-right"
          >
            <MiniTerminalPreview />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rect && (
          <motion.div
            initial={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: 4,
            }}
            animate={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              borderRadius: 0,
            }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="fixed z-[100] bg-surface border border-brand/60 overflow-hidden shadow-[0_30px_80px_-30px_rgb(0_0_0_/_0.5)]"
          >
            <ExpandingTerminal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniTerminalPreview() {
  return (
    <div className="rounded-md border border-field bg-surface-raised shadow-[0_18px_40px_-12px_rgb(0_0_0_/_0.35)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface border-b border-field">
        <span className="size-1.5 rounded-full bg-danger/80" aria-hidden />
        <span className="size-1.5 rounded-full bg-glow/80" aria-hidden />
        <span className="size-1.5 rounded-full bg-ok/80" aria-hidden />
        <span className="ml-2 font-mono text-micro uppercase tracking-eyebrow text-ink-faint">
          each@labs · zsh
        </span>
      </div>
      <div className="px-3 py-2.5 font-mono text-micro leading-[1.75] text-ink-muted bg-surface">
        <div>
          <span className="text-ink-faint">$</span> each auth login
        </div>
        <div>
          <span className="text-ok">✓</span> resolving identity
        </div>
        <div>
          <span className="text-ok">✓</span> ready
        </div>
        <div className="text-brand">
          ▸ github <span className="text-ink-faint"># continue</span>
        </div>
      </div>
      <div className="px-3 py-1.5 border-t border-field bg-surface-raised font-mono text-micro uppercase tracking-eyebrow text-brand text-center">
        click to open →
      </div>
    </div>
  );
}

function ExpandingTerminal() {
  return (
    <div className="w-full h-full flex flex-col bg-surface font-mono text-ink">
      <div className="flex items-center gap-4 px-4 sm:px-6 h-11 border-b border-field bg-surface-raised">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2.5 rounded-full bg-danger/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-glow/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-ok/80" aria-hidden />
        </div>
        <div className="hidden sm:block text-eyebrow uppercase tracking-eyebrow text-ink-faint shrink-0">
          each@labs · zsh
        </div>
      </div>
      <div className="px-4 sm:px-6 h-8 flex items-center border-b border-field text-eyebrow text-ink-faint">
        <span className="text-ok">●</span>
        <span className="ml-2 text-ink-muted">~/each-auth/login</span>
        <span className="text-brand ml-1">↗</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex-1 px-4 sm:px-6 py-8 text-body-sm leading-[1.85] text-ink-muted"
      >
        <div>
          <span className="text-ink-faint">$</span> each auth login
        </div>
        <div>
          <span className="text-ok">✓</span> resolving identity provider
          <span className="text-ink-faint">......</span>{' '}
          <span className="text-ok">ok</span>
        </div>
        <div className="animate-pulse mt-1">
          <span className="text-brand">▸</span> launching terminal session…
        </div>
      </motion.div>
    </div>
  );
}
