/**
 * Inline auto-playing video for media-forward tiles. Muted + looped so it
 * just plays continuously like a live preview. Name kept for the existing
 * import sites — drop the "hover" semantics, this now plays always.
 */
export function HoverVideo({ src, className }: { src: string; className?: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
