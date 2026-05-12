'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CatalogFaq } from '@/lib/catalog';

type Props = {
  faqs: CatalogFaq[];
  eyebrow?: string;
  heading?: string;
};

export function FaqSection({ faqs, eyebrow = '* FAQ', heading = 'Frequently asked' }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="container border-t border-rule py-12 md:py-16">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        {eyebrow}
      </div>
      <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.05] tracking-tightest text-ink mb-8">
        {heading}
      </h2>

      <ul className="divide-y divide-rule2 border-y border-rule2 max-w-[840px]">
        {faqs.map((q, i) => {
          const open = openIdx === i;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-[15px] md:text-[16px] font-medium text-ink leading-[1.4]">
                  {q.question}
                </span>
                <ChevronDown
                  aria-hidden
                  className={`shrink-0 w-4 h-4 text-ink3 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <div
                  className="catalog-faq-answer pb-5 text-[14px] md:text-[15px] text-ink2 leading-[1.65] max-w-[760px]"
                  // Answers come from our DB as HTML.
                  dangerouslySetInnerHTML={{ __html: q.answer }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
