import Link from 'next/link';
import { hero } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { HeroWidget } from './HeroWidget';

export function Hero() {
  return (
    <section className="container py-20 md:py-24 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
        {/* Left, copy + CTAs + stats */}
        <div className="text-center lg:text-left">
          {/* Top pill, optional */}
          {hero.pill && (
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-eyebrow">
              <span className="text-spark">{hero.pill}</span>
              {hero.pillCta && (
                <>
                  <span className="text-ink3">·</span>
                  <Link
                    href="#"
                    className="text-ink2 hover:text-ink transition-colors normal-case tracking-normal"
                  >
                    {hero.pillCta}
                  </Link>
                </>
              )}
            </div>
          )}

          {/* H1, "AI apps" gets a thick spark underline,
              "We handle" sits in muted ink3, "the chaos." in italic spark. */}
          <h1 className="font-display font-semibold text-[44px] sm:text-[56px] md:text-[68px] lg:text-[72px] leading-[0.98] tracking-tightest mt-8 text-ink">
            <span className="block">
              Ship reliable <span className="hero-underline">AI apps</span>.
            </span>
            <span className="block">
              <span className="text-ink3">We handle</span>{' '}
              <em className="text-spark">the chaos.</em>
            </span>
          </h1>

          {/* Body, big lead + descriptive rest */}
          <p className="text-[15.5px] leading-[1.6] text-ink2 max-w-[560px] mx-auto lg:mx-0 mt-7">
            <strong className="text-ink font-semibold">{hero.bodyLead}</strong>{' '}
            {hero.body.split('each.run()').map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <code className="!bg-transparent !border-0 !p-0 text-spark">each.run()</code>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
            {hero.ctas.map((cta) => (
              <Button key={cta.label} href={cta.href} variant={cta.variant}>
                {cta.label}
              </Button>
            ))}
          </div>

          {/* Stats, 4 numbers with cheeky sublines */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule border border-rule rounded-md overflow-hidden max-w-[640px] mx-auto lg:mx-0">
            {hero.stats.map((s) => (
              <div key={s.label} className="bg-surface px-4 py-4 text-left">
                <div className="font-display font-semibold text-[22px] md:text-[24px] text-spark tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="text-ink text-[11px] mt-1.5 font-medium">{s.label}</div>
                <div className="text-ink3 text-[10.5px] italic mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Subtext */}
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-7">
            {hero.subtext}
          </p>
        </div>

        {/* Right, animated live widget */}
        <div className="relative">
          <HeroWidget />
        </div>
      </div>
    </section>
  );
}
