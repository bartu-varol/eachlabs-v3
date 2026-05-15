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
        className="group inline-flex items-center gap-2 bg-surface border border-rule2 rounded-md px-3 py-2 font-mono text-[12px] uppercase tracking-eyebrow text-ink2 hover:border-spark/40 focus:outline-none focus:border-spark transition-colors"
      >
        <span className="text-spark">*</span>
        <span className="text-ink3">{label}</span>
        <span className="text-ink truncate max-w-[180px]">
          {active?.label ?? '—'}
        </span>
        <ChevronDown
          size={12}
          className={`text-ink3 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          tabIndex={-1}
          className={`absolute top-full mt-2 min-w-[240px] bg-surface border border-rule2 rounded-md shadow-[0_8px_24px_-12px_rgb(0_0_0_/_0.35)] z-40 p-1 max-h-[60vh] overflow-y-auto animate-panel-in ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 border-b border-rule2 flex items-center justify-between">
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
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-sm font-mono text-[12.5px] transition-colors ${
                      isActive
                        ? 'text-ink bg-bg'
                        : 'text-ink2 hover:bg-bg hover:text-ink'
                    }`}
                  >
                    <span
                      className={`w-3 inline-flex justify-center text-[12px] ${
                        isActive ? 'text-spark' : 'text-transparent'
                      }`}
                      aria-hidden
                    >
                      →
                    </span>
                    <span className="flex-1 truncate">{opt.label}</span>
                    {opt.hint !== undefined && (
                      <span className="text-[11px] text-ink3 tabular-nums">
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
