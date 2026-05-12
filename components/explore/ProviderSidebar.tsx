import Link from 'next/link';
import type { CatalogFamily } from '@/lib/catalog';

type Props = {
  providerSlug: string;
  providerName: string;
  families: CatalogFamily[];
  /** Total model count across the provider — shown on the "Every X model" row. */
  totalCount: number;
  /** Count per family slug. */
  countsByFamily: Record<string, number>;
  /** Active family slug — null when the "All" row is selected. */
  activeFamily: string | null;
};

export function ProviderSidebar({
  providerSlug,
  providerName,
  families,
  totalCount,
  countsByFamily,
  activeFamily,
}: Props) {
  return (
    <aside className="lg:sticky lg:top-[120px] lg:self-start space-y-1">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
          * FAMILIES
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {families.length}
        </span>
      </div>

      <FamilyRow
        href={`/${providerSlug}`}
        label={`Every ${providerName} model`}
        count={totalCount}
        active={activeFamily === null}
        primary
      />

      <ul className="space-y-1 mt-2">
        {families.map((f) => (
          <li key={f.slug}>
            <FamilyRow
              href={`/${providerSlug}/${f.slug}`}
              label={f.name}
              count={countsByFamily[f.slug] ?? 0}
              active={activeFamily === f.slug}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FamilyRow({
  href,
  label,
  count,
  active,
  primary = false,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center justify-between rounded-md border px-3 py-2 no-underline transition-colors ${
        active
          ? 'border-spark bg-spark/8'
          : 'border-rule2/60 hover:border-rule2 bg-surface/50'
      }`}
    >
      <span
        className={`text-[13px] ${active ? 'text-ink' : 'text-ink2 hover:text-ink'} ${
          primary ? 'font-semibold' : ''
        }`}
      >
        {label}
      </span>
      <span className={`font-mono text-[10.5px] ${active ? 'text-spark' : 'text-ink3'}`}>
        {count}
      </span>
    </Link>
  );
}
