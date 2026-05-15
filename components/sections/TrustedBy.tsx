import { trustedBy } from '@/lib/content';

export function TrustedBy() {
  const { eyebrow, stats } = trustedBy;

  return (
    <section className="border-t border-b border-rule py-12">
      <div className="container text-center">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-8">
          {eyebrow}
        </div>
      </div>

      <div className="container">
        <div className="bg-black rounded-3xl ring-1 ring-white/[0.06] py-10 md:py-14 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          <div className="flex justify-center px-6">
            <img
              src="/brand/our-providers.svg"
              alt="AI model providers powering each::labs"
              className="h-16 md:h-24 lg:h-28 w-auto max-w-none opacity-95"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="container text-center">
        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-8">
          {stats}
        </div>
      </div>
    </section>
  );
}
