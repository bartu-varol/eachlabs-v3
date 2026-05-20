import Link from 'next/link';
import { hero } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { StatTile, StatGrid } from '@/components/ui/StatTile';
import { HeroWidget } from './HeroWidget';

export function Hero() {
  return (
    <section className="container py-16 md:py-20 lg:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
        {/* Left, copy + CTAs + stats */}
        <div className="text-center lg:text-left">
          {/* Top pill, optional */}
          {hero.pill && (
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 font-mono text-eyebrow uppercase tracking-eyebrow">
              <span className="text-brand">{hero.pill}</span>
              {hero.pillCta && (
                <>
                  <span className="text-ink-faint">·</span>
                  <Link
                    href="#"
                    className="text-ink-muted hover:text-ink transition-colors normal-case tracking-normal"
                  >
                    {hero.pillCta}
                  </Link>
                </>
              )}
            </div>
          )}

          {/* H1, "AI apps" gets a thick spark underline,
              "We handle" sits in muted ink3, "the chaos." in brand spark. */}
          <h1 className="font-sans font-semibold text-display sm:text-display-lg md:text-hero lg:text-hero leading-[0.98] tracking-tightest mt-8 text-ink">
            <span className="block">
              Ship reliable <span className="hero-underline">AI apps</span>.
            </span>
            <span className="block">
              <span className="text-ink-faint">We handle</span>{' '}
              <span className="text-brand">the chaos.</span>
            </span>
          </h1>

          {/* Body, big lead + descriptive rest */}
          <p className="text-body-lg leading-[1.6] text-ink-muted max-w-[560px] mx-auto lg:mx-0 mt-7">
            <strong className="text-ink font-semibold">{hero.bodyLead}</strong>{' '}
            {hero.body}
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
          <StatGrid columns={4} className="mt-10 max-w-[640px] mx-auto lg:mx-0">
            {hero.stats.map((s) => (
              <StatTile key={s.label} value={s.value} label={s.label} sub={s.sub} className="text-left" />
            ))}
          </StatGrid>

          {/* Subtext */}
          <p className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mt-7">
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
