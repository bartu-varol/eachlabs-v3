'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { CatalogModel } from '@/lib/catalog';
import { modalityOf, displayName } from '@/lib/catalog';
import { HoverVideo } from './HoverVideo';
import { pickShineDirection } from './shine';

export function ModelTile({ model }: { model: CatalogModel }) {
  const mod = modalityOf(model);
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
      className="ec-card group relative block aspect-[4/5] rounded-lg overflow-hidden bg-surface-raised no-underline"
    >
      {/* Media layer, image/video fills the card, blooms on hover. */}
      <div className="ec-card-media absolute inset-0 bg-gradient-to-br from-surface-sunken via-surface-raised to-surface-sunken">
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
      <span className="absolute top-3 left-3 z-10 max-w-[78%] truncate font-mono text-micro uppercase tracking-eyebrow font-semibold px-2.5 py-1 rounded-md backdrop-blur-md bg-white/90 text-zinc-900 shadow-sm">
        {model.categoryName ?? mod}
      </span>

      {/* Bottom, name (always) + slug (always) + description (reveal on hover). */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5 text-white">
        <div className="font-sans font-semibold text-h4 md:text-h4 leading-[1.1] tracking-[-0.02em] line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          {name}
        </div>
        <div className="mt-1.5 font-mono text-micro uppercase tracking-eyebrow text-white/80 truncate">
          {model.providerSlug} · {model.familySlug}
        </div>
        {model.description && (
          <div className="ec-card-reveal mt-2.5 text-caption text-white/85 leading-[1.5] line-clamp-3">
            {model.description}
          </div>
        )}
      </div>
    </Link>
  );
}
