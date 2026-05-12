'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const NEXT: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
};

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'system') {
    root.removeAttribute('data-theme');
    try { localStorage.removeItem('theme'); } catch {}
  } else {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch {}
  }
}

function readTheme(): Theme {
  try {
    const v = localStorage.getItem('theme');
    if (v === 'light' || v === 'dark') return v;
  } catch {}
  return 'system';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  function handleClick() {
    const next = NEXT[theme];
    applyTheme(next);
    setTheme(next);
  }

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label =
    theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Theme: ${label}. Click to cycle.`}
      title={`Theme: ${label}`}
      suppressHydrationWarning
      className="inline-flex items-center justify-center w-10 h-10 border border-rule2 rounded-md text-ink2 hover:text-ink hover:bg-surface transition-colors"
    >
      {mounted ? <Icon size={16} strokeWidth={2} /> : <span className="w-4 h-4" />}
    </button>
  );
}
