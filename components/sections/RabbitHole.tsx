import { rabbitHole } from '@/lib/content';
import { Button } from '@/components/ui/Button';

export function RabbitHole() {
  return (
    <section className="container border-t border-rule py-24 md:py-32">
      {/* Eyebrow */}
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        {rabbitHole.eyebrow}
      </div>

      {/* Headline */}
      <h2 className="font-display font-semibold text-[40px] md:text-[64px] leading-[0.95] tracking-tightest mt-4">
        <span className="block text-ink">{rabbitHole.headline.line1}</span>
        <span className="block text-ink3 italic">{rabbitHole.headline.line2}</span>
      </h2>

      {/* 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {rabbitHole.cards.map((card) => (
          <div
            key={card.title}
            className="bg-surface border border-rule2 rounded-md p-8 flex flex-col hover:bg-surface2 transition-all duration-200"
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              {card.eyebrow}
            </div>
            <h3 className="font-display font-semibold text-2xl mt-4 text-ink">
              {card.title}
            </h3>
            <div className="text-ink2 italic text-[14px] mt-1">{card.subline}</div>
            <p className="text-ink2 text-[14px] leading-relaxed mt-4">{card.body}</p>
            <div className="mt-auto pt-6">
              <Button
                href={card.cta.href}
                variant={card.cta.style as 'primary' | 'outline' | 'text'}
                fullWidth
              >
                {card.cta.label}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtext */}
      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center mt-12">
        {rabbitHole.subtext}
      </p>
    </section>
  );
}
