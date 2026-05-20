import type { ModelDetail } from '@/lib/modelDetail';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = { model: ModelDetail };

function splitSentences(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z$])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ModelPricing({ model }: Props) {
  const rule = model.pricingRules?.rules?.[0];
  const description = rule?.description?.trim();
  const lines = splitSentences(description);

  const hasUnit = typeof rule?.formula?.params?.unit_price === 'number';
  const unit = rule?.formula?.params?.unit_price;

  return (
    <div className="border border-field rounded-md p-5 bg-surface-raised/40">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <Eyebrow as="span" tone="ink-muted">Pricing</Eyebrow>
        <Eyebrow as="span" size="sm" tone="ink-faint">{model.chargeType ?? 'fixed'}</Eyebrow>
      </div>

      {hasUnit && unit != null && (
        <div className="font-mono text-h3 text-ink mb-2 tabular-nums">
          ${unit.toFixed(3)}
          <span className="text-ink-faint text-body-sm ml-1">/unit</span>
        </div>
      )}

      {model.fixedCharge && !hasUnit && (
        <div className="font-mono text-h3 text-ink mb-2 tabular-nums">
          ${model.fixedCharge.toFixed(3)}
          <span className="text-ink-faint text-body-sm ml-1">/run</span>
        </div>
      )}

      {lines.length > 0 ? (
        <ul className="space-y-1.5 mt-3">
          {lines.map((line) => (
            <li key={line} className="text-body-sm text-ink-muted leading-[1.5] flex gap-2">
              <span className="text-ink-faint shrink-0" aria-hidden>·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body-sm text-ink-faint">Pricing details available in the dashboard.</p>
      )}

      <p className="text-eyebrow text-ink-faint leading-[1.5] mt-4 pt-3 border-t border-field/60">
        * This is the estimated price based on this prompt. Real cost depends on
        your inputs (duration, resolution, mode).
      </p>
    </div>
  );
}
