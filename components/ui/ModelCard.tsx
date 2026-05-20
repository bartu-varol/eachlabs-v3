import type { ModelEntry, ModelType } from '@/lib/models';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = {
  model: ModelEntry;
  expanded?: boolean;
};

const TYPE_PILL: Record<ModelType, string> = {
  VIDEO:   'bg-cobrand text-on-cobrand',
  IMAGE:   'bg-ok text-on-ok',
  AUDIO:   'bg-caution text-on-caution',
  '3D':    'bg-brand text-on-brand',
  UPSCALE: 'bg-glow text-on-glow',
  UTIL:    'bg-field text-ink-muted',
};

export function ModelCard({ model, expanded = false }: Props) {
  const pillClass = TYPE_PILL[model.type] ?? TYPE_PILL.UTIL;

  return (
    <article className="bg-surface-raised border border-field rounded-md overflow-hidden hover:border-field/80 transition-colors flex flex-col">
      <div className="bg-surface-sunken border-b border-field aspect-[16/10] relative flex items-center justify-center">
        <span className="absolute top-3 right-3 font-mono text-eyebrow text-ink-faint">
          {model.latency}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-eyebrow font-medium tracking-wider uppercase ${pillClass}`}
        >
          {model.type}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-body text-ink truncate">{model.name}</span>
          <span className="font-mono text-caption text-ink-muted whitespace-nowrap">{model.price}</span>
        </div>
        <Eyebrow as="span" tone="ink-faint">{model.provider}</Eyebrow>

        {expanded && model.description && (
          <p className="text-caption text-ink-muted leading-[1.4] mt-2">{model.description}</p>
        )}
        {expanded && model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-micro text-ink-faint bg-surface border border-field rounded-full px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
