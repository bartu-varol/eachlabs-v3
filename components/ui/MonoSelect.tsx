'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type MonoOption = {
  value: string;
  label: string;
  /** Optional trailing hint, e.g. count or modality. */
  hint?: string | number;
};

type Props = {
  /** Leading eyebrow on the trigger, e.g. "Provider" or "Discovery". */
  label: string;
  value: string;
  options: MonoOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
  /** Aligns the open panel to the start or end of the trigger. */
  align?: 'start' | 'end';
};

export function MonoSelect({
  label,
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
  align = 'end',
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? label}
        className="group inline-flex items-center gap-2 bg-surface-raised border border-field rounded-md px-3 py-2 font-mono text-caption uppercase tracking-eyebrow text-ink-muted hover:border-brand/40 focus:outline-none focus:border-brand transition-colors"
      >
        <span className="text-brand">*</span>
        <span className="text-ink-faint">{label}</span>
        <span className="text-ink truncate max-w-[180px]">
          {active?.label ?? '—'}
        </span>
        <ChevronDown
          size={12}
          className={`text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute top-full mt-2 min-w-[240px] bg-surface-raised border border-field rounded-md shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.35)] z-40 p-1 max-h-[60vh] overflow-y-auto animate-panel-in ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="px-3 py-2 font-mono text-micro uppercase tracking-eyebrow text-ink-faint border-b border-field flex items-center justify-between">
            <span>● {label}</span>
            <span>{options.length}</span>
          </div>
          <ul className="py-1">
            {options.map((opt) => {
              const isActive = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-sm font-mono text-caption transition-colors ${
                      isActive
                        ? 'text-ink bg-surface'
                        : 'text-ink-muted hover:bg-surface hover:text-ink'
                    }`}
                  >
                    <span
                      className={`w-3 inline-flex justify-center text-caption ${
                        isActive ? 'text-brand' : 'text-transparent'
                      }`}
                      aria-hidden
                    >
                      →
                    </span>
                    <span className="flex-1 truncate">{opt.label}</span>
                    {opt.hint !== undefined && (
                      <span className="text-eyebrow text-ink-faint tabular-nums">
                        {opt.hint}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
