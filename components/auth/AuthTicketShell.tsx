'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

type StubField = { label: string; value: string };

type Props = {
  /** Top-strip eyebrow on the left, e.g. "BOARDING PASS · NO. 0042". */
  ticketLabel: string;
  /** Top-strip eyebrow on the right, e.g. "GATE 4 · 22:14". */
  ticketMeta: string;
  /** Chapter eyebrow above the headline, e.g. "CHAPTER · IV / RETURN". */
  chapter: string;
  /** Decorative stub right-column rows (key/value pairs). */
  stubFields: StubField[];
  /** Decorative passenger code printed under the barcode. */
  barcodeCode: string;
  /** Left-column form / OAuth content. */
  children: ReactNode;
};

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Ticket / boarding-pass auth shell. Two-column printed-paper card with a
 * perforated divider and a decorative stub. Used by /signin4 and /signup4.
 */
export function AuthTicketShell({
  ticketLabel,
  ticketMeta,
  chapter,
  stubFields,
  barcodeCode,
  children,
}: Props) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg flex items-center justify-center px-4 py-16 sm:py-20">
      {/* Paper-grain dot field (very subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgb(var(--c-ink) / 0.5) 0.6px, transparent 0.6px)',
          backgroundSize: '14px 14px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 40%, rgb(0 0 0 / 0.9), transparent 85%)',
        }}
      />
      {/* Two scribble corner marks, like a print registration crop */}
      <CornerMark className="absolute top-8 left-8 sm:top-12 sm:left-12 text-ink3" />
      <CornerMark className="absolute top-8 right-8 sm:top-12 sm:right-12 text-ink3 rotate-90" />
      <CornerMark className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 text-ink3 -rotate-90" />
      <CornerMark className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-ink3 rotate-180" />

      <motion.div
        initial={{ opacity: 0, y: 18, rotate: -0.6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.7, ease: easeOutExpo }}
        className="relative z-10 w-full max-w-[1080px]"
      >
        <div className="relative bg-surface border border-ink/15 dark:border-rule2 rounded-[14px] shadow-[0_30px_80px_-30px_rgb(0_0_0_/_0.35)] overflow-hidden">
          {/* Top airline strip */}
          <div className="relative flex items-center justify-between gap-4 px-6 sm:px-10 py-3.5 border-b border-dashed border-ink/20 dark:border-rule2 bg-ink text-bg">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-display text-[16px] sm:text-[17px] tracking-tightest font-semibold">
                each<span className="text-spark">::</span>labs
              </span>
              <span className="text-bg/40">·</span>
              <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-bg/70 truncate">
                {ticketLabel}
              </span>
            </div>
            <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-bg/70 truncate">
              {ticketMeta}
            </span>
          </div>

          {/* Body, two columns with perforated divider */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] relative">
            {/* Main */}
            <div className="px-7 sm:px-10 py-10 sm:py-12">
              <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-spark">
                {chapter}
              </div>
              <div className="mt-7">{children}</div>
            </div>

            {/* Perforation divider (desktop), punched holes + dashed line */}
            <div
              aria-hidden
              className="hidden lg:block absolute top-0 bottom-0 left-[calc(100%-320px)] w-px border-l border-dashed border-ink/25 dark:border-rule2"
            />
            <div
              aria-hidden
              className="hidden lg:block absolute left-[calc(100%-320px)] -translate-x-1/2 -top-3 w-6 h-6 rounded-full bg-bg border border-ink/15 dark:border-rule2"
            />
            <div
              aria-hidden
              className="hidden lg:block absolute left-[calc(100%-320px)] -translate-x-1/2 -bottom-3 w-6 h-6 rounded-full bg-bg border border-ink/15 dark:border-rule2"
            />
            {/* Horizontal perforation for mobile */}
            <div
              aria-hidden
              className="lg:hidden border-t border-dashed border-ink/25 dark:border-rule2"
            />

            {/* Stub */}
            <motion.aside
              whileHover={{ rotate: 0.7 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="relative bg-surface2/60 px-7 sm:px-8 py-10 sm:py-12 lg:py-10"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
                  Boarding pass · stub
                </span>
                <span
                  aria-hidden
                  className="font-mono text-[10px] text-ink3 tabular-nums"
                >
                  04 / 04
                </span>
              </div>

              <dl className="mt-8 space-y-5">
                {stubFields.map((f) => (
                  <div key={f.label}>
                    <dt className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                      {f.label}
                    </dt>
                    <dd className="text-ink text-[14px] font-medium mt-1 break-words">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Barcode */}
              <div className="mt-10">
                <div
                  aria-hidden
                  className="h-12 rounded-sm"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(90deg, rgb(var(--c-ink)) 0, rgb(var(--c-ink)) 1px, transparent 1px, transparent 3px, rgb(var(--c-ink)) 3px, rgb(var(--c-ink)) 4px, transparent 4px, transparent 7px, rgb(var(--c-ink)) 7px, rgb(var(--c-ink)) 9px, transparent 9px, transparent 11px)',
                  }}
                />
                <div className="mt-2 font-mono text-[10px] tracking-[0.18em] text-ink2 text-center tabular-nums">
                  {barcodeCode}
                </div>
              </div>

              {/* Decorative stamp */}
              <div
                aria-hidden
                className="absolute bottom-6 right-6 w-20 h-20 rounded-full border-[1.5px] border-spark/40 text-spark/70 flex items-center justify-center rotate-[-14deg]"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-center leading-[1.1]">
                  each::
                  <br />
                  approved
                </span>
              </div>
            </motion.aside>
          </div>
        </div>

        {/* Tear-off line caption beneath the card */}
        <div className="mt-5 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 px-2">
          <span>✂  tear here · keep stub for boarding</span>
          <span className="tabular-nums">printed · 2026.05.12</span>
        </div>
      </motion.div>
    </main>
  );
}

function CornerMark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      className={className}
    >
      <path
        d="M2 8 V2 H8 M2 11 H6 M11 2 H6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}
