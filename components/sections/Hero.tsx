import Link from 'next/link';
import { hero } from '@/lib/content';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="container py-24 md:py-32">
      <div className="max-w-[820px] mx-auto text-center">
        {/* Top pill */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-eyebrow">
          <span className="text-spark">{hero.pill}</span>
          <span className="text-ink3">·</span>
          <Link href="#" className="text-ink2 hover:text-ink transition-colors normal-case tracking-normal">
            {hero.pillCta}
          </Link>
        </div>

        {/* H1 */}
        <h1 className="font-display font-semibold text-[48px] sm:text-[64px] md:text-[80px] leading-[0.98] tracking-tightest mt-10 text-ink">
          <span className="block">Ship reliable AI apps.</span>
          <span className="block">
            We handle <em className="italic-spark">the chaos</em>.
          </span>
        </h1>

        {/* Body */}
        <p className="text-[16px] leading-[1.55] text-ink2 max-w-[600px] mx-auto mt-8">
          600+ AI models behind one API. Auto-fallback when models break. Per-call tracing. Live A/B. You write{' '}
          <code>each.run()</code> — we do the rest.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap gap-3 mt-10 justify-center">
          {hero.ctas.map((cta) => (
            <Button key={cta.label} href={cta.href} variant={cta.variant}>
              {cta.label}
            </Button>
          ))}
        </div>

        {/* Subtext */}
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-8">
          {hero.subtext}
        </p>
      </div>
    </section>
  );
}
