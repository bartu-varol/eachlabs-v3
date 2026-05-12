import Link from 'next/link';
import type { RelatedFlow } from '@/lib/flowDetail';

type Props = { items: RelatedFlow[] };

export function FlowRelated({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="container py-12 border-t border-rule">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-[22px] tracking-tightest text-ink">More flows like this</h2>
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
          {items.length} flow{items.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((f) => (
          <Link
            key={f.slug}
            href={`/ai-flows/${f.slug}`}
            className="group bg-surface border border-rule2 rounded-md overflow-hidden hover:border-ink/40 transition-colors flex flex-col"
          >
            <div className="bg-surface2 aspect-[16/10] relative overflow-hidden">
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
              <span className="font-medium text-[13px] text-ink truncate">{f.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 truncate">
                {f.categories[0] ?? 'flow'} · {f.triggerCount} runs
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
