import { mdToHtml } from '@/lib/markdown';

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
    <section className="container border-t border-rule py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-16">
        <header className="lg:sticky lg:top-[120px] lg:self-start">
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
            {eyebrow}
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.05] tracking-tightest text-ink">
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
