import { trustedBy } from '@/lib/content';
import { Eyebrow } from '@/components/ui/Eyebrow';

export function TrustedBy() {
  const { stats } = trustedBy;

  return (
    <section className="border-t border-b border-divider py-12">
      <div className="container">
        <div className="bg-surface-sunken rounded-3xl ring-1 ring-field py-10 md:py-14 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-surface-sunken to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-surface-sunken to-transparent z-10 pointer-events-none" />
          <div className="flex justify-center px-6">
            <img
              src="/brand/our-providers.svg"
              alt="AI model providers powering each::labs"
              className="customer-logo h-16 md:h-24 lg:h-28 w-auto max-w-none opacity-95"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="container text-center">
        <Eyebrow size="sm" tone="ink-faint" className="mt-8">{stats}</Eyebrow>
      </div>
    </section>
  );
}
