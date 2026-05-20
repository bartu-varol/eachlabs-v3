'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CaseStudy, HeadlineToken } from '@/lib/content';
import { Eyebrow } from '@/components/ui/Eyebrow';

function Headline({ tokens }: { tokens: HeadlineToken[] }) {
  return (
    <h3 className="text-ink font-sans font-medium text-h4 leading-[1.25] tracking-tight">
      {tokens.map((t, i) =>
        t.kind === 'spark' ? (
          <span key={i} className="text-brand">{t.text}</span>
        ) : (
          <span key={i}>{t.text}</span>
        ),
      )}
    </h3>
  );
}

function Portrait({ cs }: { cs: CaseStudy }) {
  const [broken, setBroken] = useState(false);
  const photo = cs.avatar.photo;

  if (photo && !broken) {
    // Photo can be a raster (.jpg/.png/.jpeg) or an SVG containing a raster;
    // both are square-cropped via object-cover. SVGs aren't optimized by
    // next/image, but they're already client-cached after first paint.
    return (
      <span className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-field bg-surface-sunken">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={cs.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={() => setBroken(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={[
        'w-20 h-20 rounded-full flex items-center justify-center text-h3 font-medium tracking-wide flex-shrink-0',
        cs.avatar.bg,
        cs.avatar.text,
      ].join(' ')}
      aria-hidden
    >
      {cs.avatar.initials}
    </span>
  );
}

function CompanyMark({ cs }: { cs: CaseStudy }) {
  const { logo, role } = cs;
  // Fixed 40×128 bounding box, every logo renders inside the same footprint
  // via object-contain. Source assets vary wildly (Scate 1.5:1, Kata 8:1) so
  // a uniform box reads more consistent than per-logo height overrides.
  return (
    <span
      className="inline-flex h-10 w-32 items-center justify-start text-ink-faint"
      aria-label={logo.alt}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="customer-logo h-full w-full object-contain object-left opacity-90"
        unoptimized
      />
      <span className="sr-only">{role}</span>
    </span>
  );
}

type Props = {
  cs: CaseStudy;
  /**
   * `marquee` fixes the card width so the horizontal scroller can size each
   * tile predictably. `grid` lets the parent grid drive width.
   */
  variant?: 'grid' | 'marquee';
};

export function CustomerCard({ cs, variant = 'grid' }: Props) {
  const isMarquee = variant === 'marquee';

  return (
    <article
      className={[
        'bg-surface-raised border border-field rounded-md p-6 flex flex-col hover:border-brand/40 hover:bg-surface-sunken transition-colors duration-200',
        isMarquee ? 'w-[320px] sm:w-[360px] md:w-[400px] shrink-0' : 'h-full',
      ].join(' ')}
    >
      <Eyebrow size="sm" tone="ink-faint" className="mb-4">{cs.industry}</Eyebrow>

      <Headline tokens={cs.headline} />

      <p className="text-ink-muted italic text-body leading-[1.65] mt-4 flex-1">
        {`“${cs.quote}”`}
      </p>

      <div className="border-t border-divider pt-5 mt-6 flex items-center gap-5">
        <Portrait cs={cs} />
        <div className="min-w-0 flex flex-col gap-2">
          <span className="text-ink text-body-lg font-medium truncate">{cs.name}</span>
          <CompanyMark cs={cs} />
        </div>
      </div>
    </article>
  );
}
