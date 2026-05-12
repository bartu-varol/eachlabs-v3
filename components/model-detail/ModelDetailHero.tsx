import Link from 'next/link';
import type { ModelDetail, ModelExample } from '@/lib/modelDetail';
import { Button } from '@/components/ui/Button';
import { buildPayload, payloadToJson } from '@/lib/sampleInput';
import { HeroPreview } from './HeroPreview';
import { AskAiPanel } from './AskAiPanel';
import { AiAssistantMenu } from './AiAssistantMenu';

type Props = { model: ModelDetail };

const TYPE_LABEL: Record<string, string> = {
  image_gen: 'Image → Video',
  video_gen: 'Video',
  text_to_image: 'Text → Image',
  text_to_video: 'Text → Video',
  text_to_audio: 'Text → Audio',
  speech_to_text: 'Speech → Text',
  upscale: 'Upscale',
};

function prettyType(type: string | null | undefined): string {
  if (!type) return '-';
  return TYPE_LABEL[type] ?? type.replace(/_/g, ' ');
}

function cleanTitle(title: string | null, slug: string): string {
  if (!title || !title.trim()) return slug;
  const parts = title
    .split(/\s*\|\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length <= 1) return title.trim();
  const last = parts[parts.length - 1];
  const head = parts.slice(0, -1).join(' ');
  return `${head} · ${last}`;
}

function cleanDescription(model: ModelDetail): string | null {
  const raw = model.description?.trim();
  if (!raw) return null;
  const titleHead = model.title?.split('|')[0]?.trim();
  if (titleHead && new RegExp(`^${titleHead.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i').test(raw)) {
    const cut = raw.replace(/^[^.]*?\bis\b\s+/i, '');
    if (cut && cut.length < raw.length) {
      return cut.charAt(0).toUpperCase() + cut.slice(1);
    }
  }
  return raw;
}

function formatRuntime(seconds: number | null | undefined): string {
  if (!seconds) return '-';
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}m`;
}

function formatNumber(n: number | null | undefined): string {
  if (n == null || n === 0) return '-';
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function priceHeadline(model: ModelDetail): string {
  if (model.chargeType === 'dynamic' && model.pricingRules?.rules?.[0]) {
    const unit = model.pricingRules.rules[0].formula?.params?.unit_price;
    if (typeof unit === 'number') return `$${unit.toFixed(3)}/unit`;
  }
  if (model.fixedCharge) return `$${model.fixedCharge.toFixed(3)}/run`;
  if (model.costPerSecond) return `$${model.costPerSecond.toFixed(3)}/s`;
  return '-';
}

function extractMediaUrl(output: unknown): string | null {
  if (typeof output === 'string') {
    const trimmed = output.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('http')) return trimmed;
    try {
      return extractMediaUrl(JSON.parse(trimmed));
    } catch {
      return null;
    }
  }
  if (Array.isArray(output)) {
    for (const item of output) {
      const url = extractMediaUrl(item);
      if (url) return url;
    }
    return null;
  }
  if (output && typeof output === 'object') {
    const obj = output as Record<string, unknown>;
    const direct = obj.url ?? obj.video_url ?? obj.image_url ?? obj.audio_url ?? obj.output;
    const directUrl = extractMediaUrl(direct);
    if (directUrl) return directUrl;
    if (Array.isArray(obj.outputs)) {
      for (const item of obj.outputs) {
        const url = extractMediaUrl(item);
        if (url) return url;
      }
    }
  }
  return null;
}

function pickExample(model: ModelDetail): { url: string; example: ModelExample } | null {
  for (const ex of model.examples) {
    const url = extractMediaUrl(ex.output);
    if (url) return { url, example: ex };
  }
  return null;
}

export function ModelDetailHero({ model }: Props) {
  const headline = cleanTitle(model.title, model.slug);
  const subtitle = cleanDescription(model);
  const picked = pickExample(model);
  const mediaUrl = picked?.url ?? model.fallbackOutput?.url ?? model.thumbnailUrl;
  const outputKind = (model.outputType ?? '').toLowerCase();
  const isVideo = outputKind.includes('video') || model.type.toLowerCase().includes('video');
  const isAudio = outputKind.includes('audio') || model.type.toLowerCase().includes('audio');
  const ownRawOutput = model.examples.find((e) => e.output != null)?.output ?? null;
  const rawOutput =
    !picked && !model.fallbackOutput
      ? (ownRawOutput ?? model.defaultExampleOutputRaw ?? null)
      : null;
  const hasRawNonUrlOutput = rawOutput != null;
  const kind: 'video' | 'audio' | 'image' | 'data' | 'none' = hasRawNonUrlOutput
    ? 'data'
    : mediaUrl
      ? isVideo
        ? 'video'
        : isAudio
          ? 'audio'
          : 'image'
      : 'none';
  const inputJson =
    picked?.example.input && Object.keys(picked.example.input).length > 0
      ? payloadToJson(picked.example.input)
      : model.defaultExampleInput && Object.keys(model.defaultExampleInput).length > 0
        ? payloadToJson(model.defaultExampleInput)
        : payloadToJson(buildPayload(model.inputs));

  return (
    <section className="container pt-8 pb-10 border-b border-rule">
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 flex items-center gap-2 mb-6 flex-wrap"
      >
        <Link href="/explore" className="hover:text-ink transition-colors">
          Explore
        </Link>
        <span aria-hidden>›</span>
        <Link href={`/${model.provider.slug}`} className="hover:text-ink transition-colors">
          {model.provider.name}
        </Link>
        <span aria-hidden>›</span>
        <Link
          href={`/${model.provider.slug}/${model.family.slug}`}
          className="hover:text-ink transition-colors"
        >
          {model.family.name}
        </Link>
        <span aria-hidden>›</span>
        <span className="text-ink2 normal-case tracking-normal font-sans text-[12px]">
          {model.slug}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(320px,1fr)] gap-x-10 gap-y-8 items-start">
        <HeroPreview
          mediaUrl={mediaUrl}
          posterUrl={model.thumbnailUrl}
          kind={kind}
          inferenceTime={picked?.example.inferenceTime ?? null}
          inputJson={inputJson}
          outputData={hasRawNonUrlOutput ? rawOutput : undefined}
        />

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="flex-1 font-display text-[clamp(26px,3.2vw,36px)] leading-[1.1] tracking-tightest text-ink">
                {headline}
              </h1>
              <div className="shrink-0">
                <AiAssistantMenu modelSlug={model.slug} modelName={headline} />
              </div>
            </div>

            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{prettyType(model.type)}</span>
              <span className="text-rule2">·</span>
              <span>{model.family.name}</span>
              <span className="text-rule2">·</span>
              <span>by {model.provider.name}</span>
            </div>

            {subtitle && (
              <p className="text-[14px] text-ink2 leading-[1.55] mt-3 w-full">{subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Link
              href="/signup"
              className="group relative inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-md bg-spark text-white text-[14px] font-semibold tracking-tight hover:bg-ember transition-colors shadow-[0_10px_30px_-12px_rgb(var(--c-spark)/0.55)] hover:shadow-[0_14px_36px_-10px_rgb(var(--c-spark)/0.75)]"
            >
              <span>Try it on</span>
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Button href="https://docs.eachlabs.ai/introduction" variant="secondary" fullWidth>
              API reference
            </Button>
            <AskAiPanel modelTitle={headline} modelSlug={model.slug} fullWidth />
          </div>

          <dl className="grid grid-cols-3 gap-x-5 gap-y-3">
            <Stat label="Runtime" value={formatRuntime(model.averageResponseTime)} mono />
            <Stat label="Runs" value={formatNumber(model.executionCount)} mono />
            <Stat label="Estimated price" value={priceHeadline(model)} mono />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-1">{label}</dt>
      <dd className={`text-[14px] text-ink ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</dd>
    </div>
  );
}
