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
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 border border-rule2 bg-surface/60 rounded-sm px-2.5 h-7 cursor-not-allowed select-none"
      >
        <span aria-hidden className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-success/60 animate-ping" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        <span className="text-success">running…</span>
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
        className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink2 hover:text-ink border border-rule2 hover:border-spark/60 hover:bg-spark/[0.05] rounded-sm px-2.5 h-7 transition-colors"
      >
        <span aria-hidden className="text-spark group-hover:animate-pulse">›_</span>
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
            className="fixed z-[100] bg-bg border border-spark/60 overflow-hidden shadow-[0_30px_80px_-30px_rgb(0_0_0_/_0.5)]"
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
    <div className="rounded-md border border-rule2 bg-surface shadow-[0_18px_40px_-12px_rgb(0_0_0_/_0.35)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bg border-b border-rule2">
        <span className="size-1.5 rounded-full bg-fail/80" aria-hidden />
        <span className="size-1.5 rounded-full bg-sun/80" aria-hidden />
        <span className="size-1.5 rounded-full bg-success/80" aria-hidden />
        <span className="ml-2 font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
          each@labs · zsh
        </span>
      </div>
      <div className="px-3 py-2.5 font-mono text-[10.5px] leading-[1.75] text-ink2 bg-bg">
        <div>
          <span className="text-ink3">$</span> each auth login
        </div>
        <div>
          <span className="text-success">✓</span> resolving identity
        </div>
        <div>
          <span className="text-success">✓</span> ready
        </div>
        <div className="text-spark">
          ▸ github <span className="text-ink3"># continue</span>
        </div>
      </div>
      <div className="px-3 py-1.5 border-t border-rule2 bg-surface font-mono text-[9px] uppercase tracking-eyebrow text-spark text-center">
        click to open →
      </div>
    </div>
  );
}

function ExpandingTerminal() {
  return (
    <div className="w-full h-full flex flex-col bg-bg font-mono text-ink">
      <div className="flex items-center gap-4 px-4 sm:px-6 h-11 border-b border-rule2 bg-surface">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="size-2.5 rounded-full bg-fail/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-sun/80" aria-hidden />
          <span className="size-2.5 rounded-full bg-success/80" aria-hidden />
        </div>
        <div className="hidden sm:block text-[11px] uppercase tracking-eyebrow text-ink3 shrink-0">
          each@labs · zsh
        </div>
      </div>
      <div className="px-4 sm:px-6 h-8 flex items-center border-b border-rule2 text-[11.5px] text-ink3">
        <span className="text-success">●</span>
        <span className="ml-2 text-ink2">~/each-auth/login</span>
        <span className="text-spark ml-1">↗</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="flex-1 px-4 sm:px-6 py-8 text-[13.5px] leading-[1.85] text-ink2"
      >
        <div>
          <span className="text-ink3">$</span> each auth login
        </div>
        <div>
          <span className="text-success">✓</span> resolving identity provider
          <span className="text-ink3">......</span>{' '}
          <span className="text-success">ok</span>
        </div>
        <div className="animate-pulse mt-1">
          <span className="text-spark">▸</span> launching terminal session…
        </div>
      </motion.div>
    </div>
  );
}
