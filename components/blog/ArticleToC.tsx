'use client';

import { useEffect, useState } from 'react';

export type TocItem = { id: string; text: string; level: 2 | 3 };

type Props = { items: TocItem[] };

export function ArticleToC({ items }: Props) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: [0, 1] },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="border border-rule2 rounded-md p-5 bg-surface/40">
      <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 mb-4">
        On this page
      </div>
      <ol className="space-y-1.5">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={[
                  'block py-1 text-[13px] leading-snug border-l-2 pl-3 -ml-px transition-colors',
                  isActive
                    ? 'border-spark text-ink'
                    : 'border-transparent text-ink3 hover:text-ink hover:border-rule2',
                  item.level === 3 ? 'text-[12.5px] text-ink3/80' : '',
                ].join(' ')}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
