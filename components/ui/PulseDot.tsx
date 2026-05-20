type Props = { className?: string; color?: 'success' | 'bg' };

/**
 * Small pulsing dot. Default green (success). Use color="bg" for the
 * black-on-orange variant in the ticker.
 */
export function PulseDot({ className = '', color = 'success' }: Props) {
  const fill = color === 'success' ? 'bg-ok' : 'bg-surface';
  return (
    <span
      aria-hidden
      className={`relative inline-flex h-1.5 w-1.5 items-center justify-center ${className}`}
    >
      <span className={`absolute inline-flex h-full w-full rounded-full ${fill} opacity-60 animate-ping`} />
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${fill}`} />
    </span>
  );
}
