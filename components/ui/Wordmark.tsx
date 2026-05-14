type Props = { className?: string };

/* Renders both wordmark variants stacked. CSS toggles visibility based on
   theme: light bg shows the dark-pixel wordmark, dark bg shows the light-pixel
   one. Both are static assets in /public/brand. */
export function Wordmark({ className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center select-none ${className}`}
      aria-label="each::labs"
    >
      <img
        src="/brand/wordmark-light.svg"
        alt=""
        aria-hidden
        className="theme-light-only h-6 w-auto"
      />
      <img
        src="/brand/wordmark-dark.svg"
        alt=""
        aria-hidden
        className="theme-dark-only h-6 w-auto"
      />
    </span>
  );
}
