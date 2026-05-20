'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { LlmRouterModel } from '@/lib/llmRouter';
import { pickShineDirection } from './shine';
import { Eyebrow } from '@/components/ui/Eyebrow';

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
      className="ec-card group relative block rounded-lg overflow-hidden bg-surface-raised border border-field no-underline p-5 transition-colors hover:border-brand/40"
    >
      <div className={`ec-card-shine ${shineClass}`} aria-hidden />

      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-micro uppercase tracking-eyebrow font-semibold px-2 py-1 rounded-md bg-surface-sunken text-ink-muted">
          {model.providerName}
        </span>
        <Eyebrow as="span" size="sm" tone="ink-faint">LLM</Eyebrow>
      </div>

      <div className="font-sans font-semibold text-h4 leading-[1.2] tracking-[-0.02em] text-ink line-clamp-2">
        {model.name}
      </div>

      <div className="mt-2 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint truncate">
        {subtitle}
      </div>

      <div className="mt-4 pt-4 border-t border-field font-mono text-micro text-ink-faint truncate">
        <span className="text-ink-muted">router slug:</span> {model.routerSlug}
      </div>
    </Link>
  );
}
