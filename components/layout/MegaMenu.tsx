import Link from 'next/link';
import type { MegaMenu as MegaMenuType } from '@/lib/content';

type Props = {
  menu: MegaMenuType;
  open: boolean;
};

/**
 * Render a feature title in the wordmark pattern:
 *   each (ink)  ::  (spark)  name (ink → spark on hover)
 * If the title doesn't start with `each::`, render plain.
 */
function FeatureTitle({ title }: { title: string }) {
  if (title.startsWith('each::')) {
    const name = title.slice(6);
    return (
      <span className="font-medium text-[15px] inline-flex items-baseline">
        <span className="text-ink group-hover:text-spark transition-colors">each</span>
        <span className="text-spark">::</span>
        <span className="text-ink group-hover:text-spark transition-colors">{name}</span>
      </span>
    );
  }
  return (
    <span className="font-medium text-[15px] text-ink group-hover:text-spark transition-colors">
      {title}
    </span>
  );
}

export function MegaMenu({ menu, open }: Props) {
  if (!open) return null;

  // Developers menu, flat list
  if (menu.flat) {
    return (
      // Hover-bridge: pt-2 makes the gap between trigger and panel hoverable,
      // so the dropdown doesn't close while the cursor crosses it.
      <div className="absolute top-full right-0 z-40 w-[260px] pt-2">
        <div className="bg-surface border border-rule2 rounded-md p-6 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
          <ul className="flex flex-col gap-3">
            {menu.flat.map((item) => {
              const isExternal = item.href.startsWith('http');
              return (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="text-[14px] text-ink2 hover:text-ink transition-colors flex items-center justify-between gap-2"
                  >
                    <span>{item.title}</span>
                    {isExternal && (
                      <span className="text-ink3 text-[10px]" aria-hidden>↗</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  // Platform / Use cases, three-column grid with featured card
  return (
    // Hover-bridge: pt-2 keeps the cursor inside the dropdown's hit-area
    // while it travels from the trigger to the panel.
    <div className="absolute top-full left-0 right-0 z-40 pt-2">
      <div className="container">
        <div className="bg-surface border border-rule2 rounded-md p-10 grid grid-cols-3 gap-10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
          {menu.columns.map((col) => (
            <div key={col.eyebrow} className="flex flex-col gap-5">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
                * {col.eyebrow}
              </div>
              <ul className="flex flex-col gap-4">
                {col.items.map((item) => {
                  const isExternal = item.href.startsWith('http');
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="block group"
                      >
                        <div className="flex items-center gap-2">
                          <FeatureTitle title={item.title} />
                          {item.comingSoon && (
                            <span className="font-mono text-[9px] uppercase tracking-eyebrow px-1.5 py-0.5 border border-yellow text-yellow rounded bg-yellow/10 leading-none">
                              ● Coming soon
                            </span>
                          )}
                          {isExternal && (
                            <span className="text-ink3 text-[10px]" aria-hidden>↗</span>
                          )}
                        </div>
                        <div className="text-[13px] text-ink2 mt-0.5 leading-[1.4]">
                          {item.body}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {menu.featured && (
            <div className="bg-surface2 border border-rule2 p-6 rounded-md flex flex-col gap-3">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
                {menu.featured.eyebrow}
              </div>
              <div className="font-medium text-[16px] text-ink leading-[1.3]">
                {menu.featured.title.startsWith('each::') ? (
                  <>
                    <span className="text-ink3">each::</span>
                    {menu.featured.title.slice(6)}
                  </>
                ) : (
                  menu.featured.title
                )}
              </div>
              <div className="text-[13px] text-ink2 leading-[1.4]">
                {menu.featured.body}
              </div>
              <Link href="#" className="text-spark text-[13px] font-medium hover:underline mt-auto">
                {menu.featured.link}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
