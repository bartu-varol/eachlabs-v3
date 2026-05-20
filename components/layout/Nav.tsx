'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navItems, megaMenus } from '@/lib/content';
import { Wordmark } from '@/components/ui/Wordmark';
import { PulseDot } from '@/components/ui/PulseDot';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';

type MenuKey = 'platform' | 'developers';

export function Nav() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        onMouseLeave={() => setOpenMenu(null)}
        className="bg-surface/80 backdrop-blur-md border-b border-divider sticky top-9 z-40"
      >
        <div className="container relative">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Left: wordmark */}
            <Link href="/" className="shrink-0">
              <Wordmark />
            </Link>

            {/* Center-left nav items (desktop) */}
            <ul className="hidden lg:flex items-center gap-7">
              {navItems.map((item) => {
                // Pure link with no megamenu (e.g., Explore, Customers, Pricing)
                if (!('menu' in item)) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onMouseEnter={() => setOpenMenu(null)}
                        className="font-medium text-body text-ink-muted hover:text-ink transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const isOpen = openMenu === item.menu;
                // Item that is both a link AND a megamenu trigger.
                // Hover opens the full-width dropdown; click navigates if href is set.
                const TriggerLabel = (
                  <span
                    className={`font-medium text-body flex items-center gap-1 transition-colors ${
                      isOpen ? 'text-brand' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {item.label}
                    <span className="text-micro mt-0.5">▾</span>
                  </span>
                );
                return (
                  <li
                    key={item.label}
                    onMouseEnter={() => setOpenMenu(item.menu)}
                  >
                    {item.href ? (
                      <Link href={item.href} aria-expanded={isOpen}>
                        {TriggerLabel}
                      </Link>
                    ) : (
                      <button type="button" aria-expanded={isOpen}>
                        {TriggerLabel}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Right cluster (desktop) */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              <span className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint">
                <PulseDot />
                <span>
                  <span className="text-brand">*</span> 99.99% · 284K req/24h
                </span>
              </span>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint hover:text-ink transition-colors"
                aria-label="llms.txt for AI agents"
              >
                <span className="text-brand">●</span>
                <span>I am AI agent · llms.txt</span>
              </a>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center px-4 py-1.5 border border-field rounded-md text-body font-medium text-ink hover:bg-surface-raised transition-colors"
              >
                Sign in
              </Link>
              <ThemeToggle />
            </div>

            {/* Mobile right: theme toggle + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="inline-flex items-center justify-center w-10 h-10 border border-field rounded-md"
              >
                <span className="block w-4 h-0.5 bg-ink relative before:absolute before:left-0 before:-top-1.5 before:w-4 before:h-0.5 before:bg-ink after:absolute after:left-0 after:top-1.5 after:w-4 after:h-0.5 after:bg-ink" />
              </button>
            </div>
          </div>

          {/* Wide mega menus, Platform & Developers, both full container width */}
          {openMenu === 'platform' && <MegaMenu menu={megaMenus.platform} open />}
          {openMenu === 'developers' && <MegaMenu menu={megaMenus.developers} open />}
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
