import Link from 'next/link';
import { customerStories, type HeadlineToken, type Avatar as AvatarData } from '@/lib/content';

function Headline({ tokens }: { tokens: HeadlineToken[] }) {
  return (
    <h3 className="text-ink font-medium text-[22px] leading-[1.25] tracking-tight mb-6">
      {tokens.map((t, i) =>
        t.kind === 'spark' ? (
          <span key={i} className="text-spark">{t.text}</span>
        ) : (
          <span key={i}>{t.text}</span>
        ),
      )}
    </h3>
  );
}

function Avatar({ avatar }: { avatar: AvatarData }) {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-medium tracking-wide flex-shrink-0 ${avatar.bg} ${avatar.text}`}
    >
      {avatar.initials}
    </div>
  );
}

export function CustomerStories() {
  const c = customerStories;

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
        <p className="text-ink2 text-[15px] leading-[1.55] max-w-[600px] mt-6">
          {c.body}
        </p>

        {/* Carousel rail — single horizontal row, native scroll-snap */}
        <div
          role="region"
          aria-label="Customer stories"
          className="mt-16 -mx-6 md:-mx-10 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="flex gap-4 px-6 md:px-10 snap-x snap-mandatory">
            {c.caseStudies.map((cs) => (
              <article
                key={cs.name}
                className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] snap-start bg-surface border border-rule2 rounded-md p-8 flex flex-col hover:border-spark/30 transition-colors duration-200"
              >
                <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-6">
                  {cs.industry}
                </div>
                <Headline tokens={cs.headline} />
                <p className="text-ink2 italic text-[14px] leading-[1.65] mb-6 flex-1">
                  {`"${cs.quote}"`}
                </p>
                <div className="border-t border-rule pt-6 mt-auto flex items-center gap-3">
                  <Avatar avatar={cs.avatar} />
                  <div className="flex flex-col">
                    <span className="text-ink text-[14px] font-medium">{cs.name}</span>
                    <span className="text-ink3 text-[12px] mt-0.5">{cs.role}</span>
                  </div>
                </div>
                <Link
                  href={cs.href}
                  className="text-spark text-[12px] hover:underline underline-offset-4 mt-4 inline-block"
                >
                  Read the full story →
                </Link>
              </article>
            ))}

            {/* "And more" CTA card */}
            <article className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px] snap-start bg-surface2 border border-rule2 rounded-md p-8 flex flex-col items-center justify-center text-center hover:border-spark/40 transition-colors duration-200">
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-5">
                {c.ctaCard.eyebrow}
              </div>
              <div className="text-ink text-[20px] font-medium leading-[1.3] mb-3">
                {c.ctaCard.headline}
              </div>
              <p className="text-ink3 text-[13px] mb-8 max-w-[260px]">{c.ctaCard.body}</p>
              <Link
                href={c.ctaCard.href}
                className="bg-spark text-bg px-5 py-2.5 rounded-md text-[13px] font-medium hover:bg-ember transition-colors"
              >
                {c.ctaCard.cta}
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
