import { FaqShowcase, type FaqItem } from '@/components/ui/FaqShowcase';
import type { CatalogFaq } from '@/lib/catalog';

type Props = {
  faqs: CatalogFaq[];
  eyebrow?: string;
  heading?: string;
};

export function FaqSection({ faqs, eyebrow = '* FAQ', heading = 'Frequently asked' }: Props) {
  if (faqs.length === 0) return null;

  const items: FaqItem[] = faqs.map((f) => ({
    q: f.question,
    a: (
      <div
        className="catalog-faq-answer"
        // Answers come from our DB as HTML.
        dangerouslySetInnerHTML={{ __html: f.answer }}
      />
    ),
  }));

  return <FaqShowcase items={items} eyebrow={eyebrow} heading={heading} />;
}
