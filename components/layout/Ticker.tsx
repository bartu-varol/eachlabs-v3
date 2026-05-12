import { ticker } from '@/lib/content';
import { PulseDot } from '@/components/ui/PulseDot';

export function Ticker() {
  // Render the sequence twice so translateX(-50%) loops seamlessly
  const sequence = [...ticker, ...ticker];

  return (
    <div className="ticker bg-spark text-white h-9 overflow-hidden flex items-center sticky top-0 z-50">
      <div className="ticker-track flex whitespace-nowrap will-change-transform animate-marquee">
        {sequence.map((item, i) => {
          const isFirst = i === 0;
          const text = item.startsWith('* ') ? item.slice(2) : item;
          return (
            <span
              key={i}
              className="font-mono text-[11px] uppercase tracking-eyebrow font-medium flex items-center gap-3 px-6"
            >
              {isFirst && (
                <span className="inline-flex items-center mr-2">
                  <PulseDot color="bg" />
                </span>
              )}
              <span>*</span>
              <span>{text}</span>
              <span className="opacity-60">•</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
