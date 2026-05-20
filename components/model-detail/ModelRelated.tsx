'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Film } from 'lucide-react';
import type { RelatedModel } from '@/lib/modelDetail';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = { items: RelatedModel[] };

function priceLabel(m: RelatedModel): string {
  if (m.costPerSecond) return `$${m.costPerSecond.toFixed(3)}/s`;
  return '-';
}

function runtimeLabel(seconds: number | null): string {
  if (!seconds) return '-';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m`;
}

function Thumb({ src, slug }: { src: string | null; slug: string }) {
  const [failed, setFailed] = useState(false);

  // Reset failure state when the src changes (different model card).
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = !!src && !failed;

  return (
    <>
      {showImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth === 0 || img.naturalHeight === 0) {
              setFailed(true);
            }
          }}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      )}
      {!showImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-faint">
          <Film size={22} strokeWidth={1.4} />
          <span className="font-mono text-micro uppercase tracking-eyebrow truncate max-w-[80%] text-center">
            {slug}
          </span>
        </div>
      )}
    </>
  );
}

export function ModelRelated({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="container py-12 border-t border-divider">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-sans text-h3 tracking-tightest text-ink">
          More in this family
        </h2>
        <Eyebrow as="span" tone="ink-faint">{items.length} model{items.length === 1 ? '' : 's'}</Eyebrow>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((m) => (
          <Link
            key={m.slug}
            href={`/${m.providerSlug}/${m.familySlug}/${m.slug}`}
            className="group bg-surface-raised border border-field rounded-md overflow-hidden hover:border-ink/40 transition-colors flex flex-col"
          >
            <div className="bg-surface-sunken aspect-[16/10] relative overflow-hidden">
              <Thumb src={m.thumbnailUrl} slug={m.slug} />
              <span className="absolute top-3 right-3 font-mono text-micro uppercase tracking-eyebrow text-ink-muted bg-surface/80 backdrop-blur rounded-full px-2 py-0.5">
                {runtimeLabel(m.averageResponseTime)}
              </span>
            </div>
            <div className="p-4 flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-body-sm text-ink truncate">
                  {m.title?.replace(/\s*\|\s*/g, ' · ') ?? m.slug}
                </span>
                <span className="font-mono text-eyebrow text-ink-muted whitespace-nowrap">
                  {priceLabel(m)}
                </span>
              </div>
              <Eyebrow as="span" size="sm" tone="ink-faint" className="truncate">{m.slug}</Eyebrow>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
