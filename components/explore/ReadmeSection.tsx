import { mdToHtml } from '@/lib/markdown';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = {
  /** Markdown source from the DB. Renders nothing if empty. */
  markdown: string | null | undefined;
  /** Eyebrow shown above the readme. */
  eyebrow?: string;
  /** Optional section heading; falls back to "Documentation". */
  heading?: string;
};

export function ReadmeSection({ markdown, eyebrow = '* README', heading = 'Documentation' }: Props) {
  if (!markdown || !markdown.trim()) return null;
  const html = mdToHtml(markdown);

  return (
    <section className="container border-t border-divider py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-16">
        <header className="lg:sticky lg:top-[120px] lg:self-start">
          <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
          <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.05] tracking-tightest text-ink">
            {heading}
          </h2>
        </header>

        <article
          className="catalog-readme-prose max-w-[720px]"
          // Content is from our DB and rendered through our trusted converter.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
