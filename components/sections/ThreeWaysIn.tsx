import Link from 'next/link';
import { threeWaysIn, type TwayCard } from '@/lib/content';

function ProductWordmark({ name }: { name: string }) {
  return (
    <div className="font-mono text-[15px] mb-6">
      <span className="text-ink3">each</span>
      <span className="text-spark">::</span>
      <span className="text-ink">{name}</span>
    </div>
  );
}

function Card({ card }: { card: TwayCard }) {
  return (
    <article className="bg-surface border border-rule2 rounded-md p-10 flex flex-col h-full hover:border-spark/30 transition-colors duration-200">
      <ProductWordmark name={card.product} />

      <div className="text-ink font-medium text-[22px] leading-[1.3] mb-6 tracking-tight">
        {card.cardHeadline}
      </div>

      <div className="font-mono text-[12px] text-ink3 leading-[1.6] mb-6">
        {card.tags.join('  ·  ')}
      </div>

      <Link
        href={card.cta.href}
        className="text-spark text-[13px] hover:underline underline-offset-4 inline-block mt-auto"
      >
        {card.cta.label}
      </Link>
    </article>
  );
}

export function ThreeWaysIn() {
  const c = threeWaysIn;

  return (
    <section className="border-t border-rule py-24 md:py-32">
      <div className="container">
        {/* Header */}
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
          {c.eyebrow}
        </div>
        <h2 className="font-display font-semibold text-4xl md:text-6xl tracking-tightest leading-[1.05]">
          <span className="block text-ink">{c.headline.line1}</span>
          <span className="block text-ink3 italic">{c.headline.line2}</span>
        </h2>
        <p className="text-ink2 text-[15px] leading-[1.55] max-w-[640px] mt-6">
          {c.body}
        </p>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {c.cards.map((card) => (
            <Card key={card.product} card={card} />
          ))}
        </div>

        {/* Closing strip */}
        <div className="mt-16 pt-8 border-t border-rule flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-ink3 tracking-[0.15em] uppercase">
            {c.pipelineStrip}
          </div>
          <div className="text-ink3 italic text-[13px]">
            {c.pipelineCaption}
          </div>
        </div>
      </div>
    </section>
  );
}
