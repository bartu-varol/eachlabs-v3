import type { FlowDetail, FlowInputProperty } from '@/lib/flowDetail';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = { flow: FlowDetail };

const TYPE_LABEL: Record<string, string> = {
  image: 'image URL',
  video: 'video URL',
  audio: 'audio URL',
  string: 'text',
  number: 'number',
  boolean: 'true / false',
};

function defaultPreview(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === 'string') {
    if (value.startsWith('http')) {
      const trimmed = value.replace(/\?.*$/, '');
      const segs = trimmed.split('/');
      return segs[segs.length - 1] || trimmed;
    }
    if (value.length > 40) return value.slice(0, 40) + '…';
    return value;
  }
  return JSON.stringify(value);
}

export function FlowPlayground({ flow }: Props) {
  const props = flow.definition.input_schema?.properties ?? {};
  const entries = Object.entries(props).filter(([k]) => k !== 'type');
  const stepModels = (flow.definition.steps ?? []).map((s) => s.model);

  if (entries.length === 0) return null;

  return (
    <section className="border border-field rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-field bg-surface-raised/40 flex items-baseline justify-between">
        <Eyebrow as="span" tone="ink-muted">Playground · what you can change</Eyebrow>
        <Eyebrow as="span" size="sm" tone="ink-faint">{entries.length} input{entries.length === 1 ? '' : 's'}</Eyebrow>
      </header>

      <div className="px-5 py-4 border-b border-field/60 bg-surface/40">
        <p className="text-body-sm text-ink-muted leading-[1.55]">
          Clone this template into your workspace, then tweak any of the inputs below, or rewrite
          the step prompts, to spin up your own variation. The pipeline stays the same; the
          creative output is yours.
        </p>
      </div>

      <ul className="divide-y divide-field">
        {entries.map(([name, schema]) => (
          <li key={name} className="px-5 py-4">
            <InputRow name={name} schema={schema as FlowInputProperty} />
          </li>
        ))}
      </ul>

      <footer className="px-5 py-4 border-t border-field bg-surface-raised/30">
        <Eyebrow size="sm" tone="ink-faint" className="mb-2">Ideas for your remix</Eyebrow>
        <ul className="text-body-sm text-ink-muted space-y-1.5 leading-[1.55]">
          <li>· Swap the input media to retell the story with different subjects.</li>
          <li>
            · Edit the prompt inside <span className="font-mono text-ink">{stepModels[0] ?? 'step1'}</span>{' '}
            to change tone, scene, or pacing.
          </li>
          {stepModels.length > 1 && (
            <li>· Replace any model step with a faster or pricier alternative for a different vibe.</li>
          )}
          <li>· Chain extra steps (upscale, audio, captions) to extend the pipeline.</li>
        </ul>
      </footer>
    </section>
  );
}

function InputRow({ name, schema }: { name: string; schema: FlowInputProperty }) {
  const typeLabel = TYPE_LABEL[schema.type] ?? schema.type;
  const preview = defaultPreview(schema.default_value);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-6 gap-y-2 items-baseline">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-body font-medium text-ink">{name}</span>
          {schema.required && (
            <span className="font-mono text-micro uppercase tracking-eyebrow text-danger">
              required
            </span>
          )}
          {schema.accept_multiple_files && (
            <Eyebrow as="span" size="sm" tone="ink-faint">multi</Eyebrow>
          )}
        </div>
        {schema.description && (
          <p className="text-body-sm text-ink-muted leading-[1.5] mt-1">{schema.description}</p>
        )}
        {preview && (
          <div className="font-mono text-eyebrow text-ink-faint mt-1.5 break-all">
            default · <span className="text-ink-muted">{preview}</span>
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <Eyebrow as="span" size="sm" tone="ink-faint">{typeLabel}</Eyebrow>
      </div>
    </div>
  );
}
