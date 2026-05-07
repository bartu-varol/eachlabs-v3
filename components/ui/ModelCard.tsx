import type { ModelEntry, ModelType } from '@/lib/models';

type Props = {
  model: ModelEntry;
  expanded?: boolean;
};

const TYPE_PILL: Record<ModelType, string> = {
  VIDEO:   'bg-highlight text-white',
  IMAGE:   'bg-emerald-600 text-white',
  AUDIO:   'bg-yellow text-black',
  '3D':    'bg-spark text-black',
  UPSCALE: 'bg-sun text-black',
  UTIL:    'bg-rule2 text-ink2',
};

export function ModelCard({ model, expanded = false }: Props) {
  const pillClass = TYPE_PILL[model.type] ?? TYPE_PILL.UTIL;

  return (
    <article className="bg-surface border border-rule2 rounded-md overflow-hidden hover:border-rule2/80 transition-colors flex flex-col">
      <div className="bg-surface2 border-b border-rule2 aspect-[16/10] relative flex items-center justify-center">
        <span className="absolute top-3 right-3 font-mono text-[11px] text-ink3">
          {model.latency}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase ${pillClass}`}
        >
          {model.type}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-[14px] text-ink truncate">{model.name}</span>
          <span className="font-mono text-[12px] text-ink2 whitespace-nowrap">{model.price}</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
          {model.provider}
        </span>

        {expanded && model.description && (
          <p className="text-[12px] text-ink2 leading-[1.4] mt-2">{model.description}</p>
        )}
        {expanded && model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-ink3 bg-bg border border-rule2 rounded-full px-2 py-0.5"
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
