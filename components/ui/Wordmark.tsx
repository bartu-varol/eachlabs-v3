type Props = { className?: string };

export function Wordmark({ className = '' }: Props) {
  return (
    <span className={`inline-flex items-baseline font-display font-medium text-[18px] tracking-tight ${className}`}>
      <span className="text-ink">each</span>
      <span className="text-spark">::</span>
      <span className="text-ink">labs</span>
    </span>
  );
}
