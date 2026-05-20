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
    <div className="fixed inset-0 z-50 bg-surface flex flex-col">
      <div className="flex items-center justify-between px-6 h-16 border-b border-divider">
        <Wordmark />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="font-mono text-caption uppercase tracking-eyebrow text-ink-muted hover:text-ink"
        >
          CLOSE ✕
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-2">
        {navItems.map((item) => {
          // Plain link (no megamenu), Explore, Customers, Pricing
          if (!('menu' in item)) {
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="text-h3 font-sans py-3 border-b border-divider text-ink"
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
            <div key={item.label} className="border-b border-divider">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.menu)}
                aria-expanded={isOpen}
                className="w-full text-left text-h3 font-sans py-3 flex items-center justify-between text-ink"
              >
                <span>{item.label}</span>
                <span className="font-mono text-body text-ink-faint">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="pb-4 pl-4 flex flex-col gap-3">
                  {menu.flat
                    ? menu.flat.map((sub) => (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          onClick={onClose}
                          className="text-body-lg text-ink-muted hover:text-ink"
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
                            className="text-body-lg text-ink-muted hover:text-ink"
                          >
                            {sub.title.startsWith('each::') ? (
                              <>
                                <span className="text-ink-faint">each::</span>
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
            href="/sign-up"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-md bg-brand text-on-brand text-body font-medium"
          >
            Follow the white rabbit
          </Link>
          <Link
            href="https://docs.eachlabs.ai/introduction"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-md border border-field text-ink text-body font-medium"
          >
            Docs
          </Link>
        </div>
      </nav>
    </div>
  );
}
