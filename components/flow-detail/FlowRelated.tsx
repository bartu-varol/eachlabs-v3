import Link from 'next/link';
import type { RelatedFlow } from '@/lib/flowDetail';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = { items: RelatedFlow[] };

export function FlowRelated({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="container py-12 border-t border-divider">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-sans text-h3 tracking-tightest text-ink">More flows like this</h2>
        <Eyebrow as="span" tone="ink-faint">{items.length} flow{items.length === 1 ? '' : 's'}</Eyebrow>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((f) => (
          <Link
            key={f.slug}
            href={`/ai-flows/${f.slug}`}
            className="group bg-surface-raised border border-field rounded-md overflow-hidden hover:border-ink/40 transition-colors flex flex-col"
          >
            <div className="bg-surface-sunken aspect-[16/10] relative overflow-hidden">
              {f.thumbnail ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={f.thumbnail}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : null}
            </div>
            <div className="p-4 flex flex-col gap-1">
              <span className="font-medium text-body-sm text-ink truncate">{f.name}</span>
              <Eyebrow as="span" size="sm" tone="ink-faint" className="truncate">{f.categories[0] ?? 'flow'} · {f.triggerCount} runs</Eyebrow>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
