import type { CSSProperties } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   EachLabel — renders an "each::xxx" product name in the wordmark style:
   regular text + two pairs of spark-colored square blocks for the "::",
   matching logo (4).svg / logo-dark (2).svg.

   Sizes are em-based so the colon blocks scale with the parent's font-size.
   The text glyphs inherit `currentColor` from the parent.

   If `name` doesn't start with "each::", falls back to plain text — safe to
   use for any string in product/menu lists.
────────────────────────────────────────────────────────────────────────── */

type Props = {
  name: string;
  className?: string;
  style?: CSSProperties;
};

export function EachLabel({ name, className = '', style }: Props) {
  if (!name.startsWith('each::')) {
    return (
      <span className={className} style={style}>
        {name}
      </span>
    );
  }

  const suffix = name.slice(6);

  return (
    <span
      className={`inline-flex items-center align-baseline ${className}`}
      style={style}
    >
      <span>each</span>
      <ColonBlocks />
      <span>{suffix}</span>
    </span>
  );
}

/* "::" rendered as two pairs of stacked squares in spark — same shape as
   the SVG wordmark's colon glyph. em-based so it scales with parent text. */
function ColonBlocks() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center"
      style={{ gap: '0.18em', margin: '0 0.18em' }}
    >
      <ColonPair />
      <ColonPair />
    </span>
  );
}

function ColonPair() {
  return (
    <span
      className="inline-flex flex-col"
      style={{ gap: '0.18em' }}
    >
      <span
        className="block bg-spark"
        style={{ width: '0.22em', height: '0.22em' }}
      />
      <span
        className="block bg-spark"
        style={{ width: '0.22em', height: '0.22em' }}
      />
    </span>
  );
}
