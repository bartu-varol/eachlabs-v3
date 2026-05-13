'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const HIDE_ON = [
  '/signin',  '/signup',
  '/signin4', '/signup4',
  '/onboarding',
];

export function ChromeGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && HIDE_ON.includes(pathname)) return null;
  return <>{children}</>;
}
