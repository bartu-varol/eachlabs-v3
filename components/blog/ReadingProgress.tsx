'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setPct(total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-50 h-[2px] pointer-events-none"
    >
      <div
        className="h-full bg-spark transition-[width] duration-100 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
