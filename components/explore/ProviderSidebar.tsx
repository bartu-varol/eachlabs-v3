import Link from 'next/link';
import type { CatalogFamily } from '@/lib/catalog';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = {
  providerSlug: string;
  providerName: string;
  families: CatalogFamily[];
  /** Total model count across the provider, shown on the "Every X model" row. */
  totalCount: number;
  /** Count per family slug. */
  countsByFamily: Record<string, number>;
  /** Active family slug, null when the "All" row is selected. */
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
        <Eyebrow as="span">* FAMILIES</Eyebrow>
        <Eyebrow as="span" size="sm" tone="ink-faint">{families.length}</Eyebrow>
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
          ? 'border-brand bg-brand/8'
          : 'border-field/60 hover:border-field bg-surface-raised/50'
      }`}
    >
      <span
        className={`text-body-sm ${active ? 'text-ink' : 'text-ink-muted hover:text-ink'} ${
          primary ? 'font-semibold' : ''
        }`}
      >
        {label}
      </span>
      <span className={`font-mono text-micro ${active ? 'text-brand' : 'text-ink-faint'}`}>
        {count}
      </span>
    </Link>
  );
}
