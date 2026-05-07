import { comparison } from '@/lib/content';

export function Comparison() {
  return (
    <section className="container border-t border-rule py-24 md:py-32">
      {/* Eyebrow */}
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        {comparison.eyebrow}
      </div>

      {/* Headline */}
      <h2 className="font-display font-semibold text-[40px] md:text-[64px] leading-[0.95] tracking-tightest mt-4">
        <span className="text-ink">{comparison.headline.left}</span>
        <span className="text-ink3 italic"> {comparison.headline.right}</span>
      </h2>

      {/* Comparison grid: hairline dividers via gap-px bg-rule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-rule mt-12 border border-rule rounded-md overflow-hidden">
        {comparison.rows.map((row, i) => (
          <div key={`row-${i}`} className="contents">
            <div className="bg-surface p-6 flex gap-3 items-start">
              <span className="text-fail font-mono text-[14px] leading-none mt-1 shrink-0">×</span>
              <p className="text-[15px] leading-[1.55] text-ink2">
                <span className="text-ink font-medium">{row.anchor}</span>{' '}
                {row.without}
              </p>
            </div>
            <div className="bg-surface p-6 flex gap-3 items-start">
              <span className="text-success font-mono text-[14px] leading-none mt-1 shrink-0">✓</span>
              <p className="text-[15px] leading-[1.55] text-ink">
                <span className="font-medium">{row.anchor}</span>{' '}
                <span className="text-ink2">{row.with}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Closer */}
      <p className="text-ink3 italic text-[14px] text-center mt-8">
        {comparison.closer}
      </p>
    </section>
  );
}
