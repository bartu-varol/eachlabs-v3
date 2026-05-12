import type { ModelDetail } from '@/lib/modelDetail';

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
    <div className="border border-rule2 rounded-md p-5 bg-surface/40">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">Pricing</span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {model.chargeType ?? 'fixed'}
        </span>
      </div>

      {hasUnit && unit != null && (
        <div className="font-mono text-[24px] text-ink mb-2 tabular-nums">
          ${unit.toFixed(3)}
          <span className="text-ink3 text-[13px] ml-1">/unit</span>
        </div>
      )}

      {model.fixedCharge && !hasUnit && (
        <div className="font-mono text-[24px] text-ink mb-2 tabular-nums">
          ${model.fixedCharge.toFixed(3)}
          <span className="text-ink3 text-[13px] ml-1">/run</span>
        </div>
      )}

      {lines.length > 0 ? (
        <ul className="space-y-1.5 mt-3">
          {lines.map((line) => (
            <li key={line} className="text-[13px] text-ink2 leading-[1.5] flex gap-2">
              <span className="text-ink3 shrink-0" aria-hidden>·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-ink3 italic">Pricing details available in the dashboard.</p>
      )}

      <p className="text-[11.5px] text-ink3 italic leading-[1.5] mt-4 pt-3 border-t border-rule2/60">
        * This is the estimated price based on this prompt. Real cost depends on
        your inputs (duration, resolution, mode).
      </p>
    </div>
  );
}
