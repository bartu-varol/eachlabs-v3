import { listChangelogEntries, type ChangelogEntry } from '@/lib/changelog';
import { MOCK_ENTRIES } from './_mock';
import { Eyebrow } from '@/components/ui/Eyebrow';

export const revalidate = 300;

export const metadata = {
  title: 'Changelog · each::labs',
  description: 'Product updates and releases from each::labs.',
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function Entry({ entry }: { entry: ChangelogEntry }) {
  const showFullHtml =
    entry.contentHtml && entry.contentHtml.trim() !== entry.description.trim();
  return (
    <li className="relative pl-8">
      <span className="absolute left-0 top-2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand" />
      <Eyebrow tone="ink-faint">{formatDate(entry.publishedAt)}</Eyebrow>
      <h2 className="font-sans font-semibold text-h3 md:text-h2 leading-[1.1] text-ink mt-2">
        {entry.title}
      </h2>
      {entry.description && (
        <p className="text-body-lg leading-[1.6] text-ink-muted mt-3">
          {entry.description}
        </p>
      )}
      {showFullHtml && (
        <div
          className="changelog-body mt-4 text-body-lg leading-[1.6] text-ink-muted [&>*:first-child]:mt-0 [&_h2]:font-sans [&_h2]:text-ink [&_h2]:text-h4 [&_h2]:font-semibold [&_h2]:mt-6 [&_h3]:text-ink [&_h3]:font-semibold [&_h3]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mt-3 [&_li]:mt-1 [&_a]:text-brand [&_a:hover]:text-brand-deep [&_code]:font-mono [&_code]:text-body-sm [&_code]:bg-surface-raised [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded"
          dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
        />
      )}
      {entry.link && (
        <a
          href={entry.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-4 text-body-sm font-mono text-brand hover:text-brand-deep transition-colors"
        >
          Read on docs →
        </a>
      )}
    </li>
  );
}

export default async function ChangelogPage() {
  const real = await listChangelogEntries();
  const entries = real.length > 0 ? real : MOCK_ENTRIES;

  return (
    <section className="container py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-sans font-semibold text-display sm:text-display-lg md:text-hero leading-[1.02] tracking-tightest text-ink">
          What we shipped.
        </h1>
        <p className="text-body-lg leading-[1.6] text-ink-muted max-w-[560px] mt-6">
          Production-grade orchestration is a moving target. Releases, fixes,
          and policy changes ship from the docs and surface here automatically.
        </p>

        {entries.length === 0 ? (
          <div className="mt-16 border border-divider rounded-md p-8 text-center text-ink-muted">
            <p className="text-body-lg">No entries yet.</p>
            <p className="text-body-sm text-ink-faint mt-1">
              Once the docs site publishes its first changelog update, it will
              show up here.
            </p>
          </div>
        ) : (
          <ol className="mt-16 flex flex-col gap-12 border-l border-divider">
            {entries.map((entry) => (
              <Entry key={entry.id} entry={entry} />
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
