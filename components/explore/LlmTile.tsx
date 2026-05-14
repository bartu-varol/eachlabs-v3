'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { LlmRouterModel } from '@/lib/llmRouter';
import { pickShineDirection } from './shine';

export function LlmTile({ model }: { model: LlmRouterModel }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const shineClass = pickShineDirection(model.routerSlug);
  const href = `/explore/llms/${model.urlSlug}`;
  const subtitle = model.familySlug
    ? `${model.providerSlug} · ${model.familySlug}`
    : model.providerSlug;

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
      className="ec-card group relative block rounded-lg overflow-hidden bg-surface border border-rule2 no-underline p-5 transition-colors hover:border-spark/40"
    >
      <div className={`ec-card-shine ${shineClass}`} aria-hidden />

      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow font-semibold px-2 py-1 rounded-md bg-surface2 text-ink2">
          {model.providerName}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          LLM
        </span>
      </div>

      <div className="font-display font-semibold text-[19px] leading-[1.2] tracking-[-0.02em] text-ink line-clamp-2">
        {model.name}
      </div>

      <div className="mt-2 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 truncate">
        {subtitle}
      </div>

      <div className="mt-4 pt-4 border-t border-rule2 font-mono text-[10.5px] text-ink3 truncate">
        <span className="text-ink2">router slug:</span> {model.routerSlug}
      </div>
    </Link>
  );
}
