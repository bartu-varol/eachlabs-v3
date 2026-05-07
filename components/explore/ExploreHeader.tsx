import { explore } from '@/lib/content';

export function ExploreHeader() {
  return (
    <section className="container py-16">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
        {explore.eyebrow}
      </div>
      <h1 className="font-display font-semibold text-[48px] md:text-[80px] leading-[0.95] tracking-tightest text-ink mt-4">
        {explore.heading}
      </h1>
      <p className="text-[15px] md:text-[16px] text-ink2 leading-[1.55] max-w-[640px] mt-6">
        600+ image, video, audio, 3D, and utility models — pinned versions, transparent pricing,
        callable through one <code>each.run()</code>.
      </p>
    </section>
  );
}
