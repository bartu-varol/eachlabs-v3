type Props = { className?: string };

/* Brand-style "::" — four spark squares in a 2×2 grid, matching the
   each::labs wordmark SVG. Sizes in em so it scales with surrounding text. */
export function EachColons({ className = '' }: Props) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      fill="currentColor"
      className={`inline-block text-brand align-baseline mx-[0.06em] ${className}`}
      style={{
        height: '0.62em',
        width: '0.59em',
        transform: 'translateY(0.04em)',
      }}
    >
      <rect x="0"   y="0"   width="4.5" height="4.5" />
      <rect x="9.5" y="0"   width="4.5" height="4.5" />
      <rect x="0"   y="9.5" width="4.5" height="4.5" />
      <rect x="9.5" y="9.5" width="4.5" height="4.5" />
    </svg>
  );
}
