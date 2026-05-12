'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const HIDE_ON = [
  '/signup',  '/signin',
  '/signup2', '/signin2',
  '/signup3', '/signin3',
];

export function ChromeGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && HIDE_ON.includes(pathname)) return null;
  return <>{children}</>;
}
