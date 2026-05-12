import type { ReactNode } from 'react';

// Auth pages are full-bleed: the root layout's Ticker/Nav/Footer are hidden
// by ChromeGuard on these routes. This layout exists mostly for documentation
// and to give us a place to override shared metadata defaults later.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
