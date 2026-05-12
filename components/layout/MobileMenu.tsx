'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navItems, megaMenus } from '@/lib/content';
import { Wordmark } from '@/components/ui/Wordmark';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-bg flex flex-col">
      <div className="flex items-center justify-between px-6 h-16 border-b border-rule">
        <Wordmark />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="font-mono text-[12px] uppercase tracking-eyebrow text-ink2 hover:text-ink"
        >
          CLOSE ✕
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-2">
        {navItems.map((item) => {
          // Plain link (no megamenu) — Explore, Customers, Pricing
          if (!('menu' in item)) {
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="text-[24px] font-display py-3 border-b border-rule text-ink"
              >
                {item.label}
              </Link>
            );
          }

          // Item with a megamenu (Platform / Use Cases / Developers).
          // On mobile, render as an accordion. The optional `item.href`
          // (overview page) is exposed via a separate "Browse" link below.
          const isOpen = expanded === item.menu;
          const menu = megaMenus[item.menu];

          return (
            <div key={item.label} className="border-b border-rule">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.menu)}
                aria-expanded={isOpen}
                className="w-full text-left text-[24px] font-display py-3 flex items-center justify-between text-ink"
              >
                <span>{item.label}</span>
                <span className="font-mono text-[14px] text-ink3">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="pb-4 pl-4 flex flex-col gap-3">
                  {menu.flat
                    ? menu.flat.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          onClick={onClose}
                          className="text-[15px] text-ink2 hover:text-ink"
                        >
                          {sub.title}
                        </Link>
                      ))
                    : menu.columns.flatMap((col) =>
                        col.items.map((sub) => (
                          <Link
                            key={col.eyebrow + sub.title}
                            href={sub.href}
                            onClick={onClose}
                            className="text-[15px] text-ink2 hover:text-ink"
                          >
                            {sub.title.startsWith('each::') ? (
                              <>
                                <span className="text-ink3">each::</span>
                                {sub.title.slice(6)}
                              </>
                            ) : (
                              sub.title
                            )}
                          </Link>
                        )),
                      )}
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-6 flex gap-3">
          <Link
            href="/signup"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-md bg-spark text-white text-[14px] font-medium"
          >
            Follow the white rabbit
          </Link>
          <Link
            href="https://docs.eachlabs.ai/introduction"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-md border border-rule2 text-ink text-[14px] font-medium"
          >
            Docs
          </Link>
        </div>
      </nav>
    </div>
  );
}
