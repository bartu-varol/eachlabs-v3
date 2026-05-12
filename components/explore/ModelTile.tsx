'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { CatalogModel, Modality } from '@/lib/catalog';
import { modalityOf, displayName } from '@/lib/catalog';
import { HoverVideo } from './HoverVideo';
import { pickShineDirection } from './shine';

/** Per-modality accent, drives the empty-state gradient + the ring + the glow. */
const ACCENT: Record<Modality, string> = {
  VIDEO: '#3D6BC9',
  IMAGE: '#5B8F3A',
  AUDIO: '#C98A00',
  TEXT:  '#76726A',
  OTHER: '#8A4FB8',
};

export function ModelTile({ model }: { model: CatalogModel }) {
  const mod = modalityOf(model);
  const accent = ACCENT[mod];
  const href = `/${model.brandedSlug}`;
  const isVideo = model.thumbnailUrl?.match(/\.(webm|mp4|mov)$/i);
  const name = displayName(model);
  const shineClass = pickShineDirection(model.brandedSlug);
  const ref = useRef<HTMLAnchorElement>(null);

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
      className="ec-card group relative block aspect-[4/5] rounded-lg overflow-hidden bg-surface no-underline"
      style={{ ['--ec-accent' as string]: accent }}
    >
      {/* Media layer, image/video fills the card, blooms on hover. */}
      <div
        className="ec-card-media absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${accent}45, ${accent}15 55%, ${accent}05)` }}
      >
        {model.thumbnailUrl && !isVideo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={model.thumbnailUrl}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {model.thumbnailUrl && isVideo && (
          <HoverVideo
            src={model.thumbnailUrl}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Hash-picked shimmer sweep, one of 8 directions per card. */}
      <div className={`ec-card-shine ${shineClass}`} aria-hidden />

      {/* Bottom gradient, grows on hover so the revealed description stays legible. */}
      <div className="ec-card-scrim absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none z-[1]" />

      {/* Top-left: category pill. */}
      <span
        className="absolute top-3 left-3 z-10 max-w-[78%] truncate font-mono text-[10.5px] uppercase tracking-eyebrow font-semibold px-2.5 py-1 rounded-md backdrop-blur-md bg-white/90 shadow-sm"
        style={{ color: accent }}
      >
        {model.categoryName ?? mod}
      </span>

      {/* Bottom, name (always) + slug (always) + description (reveal on hover). */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5 text-white">
        <div className="font-display font-semibold text-[19px] md:text-[21px] leading-[1.1] tracking-[-0.02em] line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {name}
        </div>
        <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-eyebrow text-white/80 truncate">
          {model.providerSlug} · {model.familySlug}
        </div>
        {model.description && (
          <div className="ec-card-reveal mt-2.5 text-[12px] text-white/85 leading-[1.5] line-clamp-3">
            {model.description}
          </div>
        )}
      </div>
    </Link>
  );
}
