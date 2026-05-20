import Link from 'next/link';
import type { FlowDetail } from '@/lib/flowDetail';
import { buildExampleInputJson } from '@/lib/flowDetail';
import { Button } from '@/components/ui/Button';
import { HeroPreview } from '@/components/model-detail/HeroPreview';
import { AskAiPanel } from '@/components/model-detail/AskAiPanel';

type Props = { flow: FlowDetail };

function formatNumber(n: number | null | undefined): string {
  if (n == null || n === 0) return '-';
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function inferKindFromUrl(url: string | null): 'video' | 'audio' | 'image' | 'none' {
  if (!url) return 'none';
  const lower = url.toLowerCase();
  if (/\.(mp4|webm|mov|m4v)(\?|$)/.test(lower)) return 'video';
  if (/\.(mp3|wav|ogg|m4a)(\?|$)/.test(lower)) return 'audio';
  return 'image';
}

export function FlowDetailHero({ flow }: Props) {
  const stepCount = flow.definition.steps?.length ?? 0;
  const inputCount = Object.keys(flow.definition.input_schema?.properties ?? {}).filter(
    (k) => k !== 'type',
  ).length;
  const kind = inferKindFromUrl(flow.exampleOutput);
  const primaryCategory = flow.categories[0];

  return (
    <section className="container pt-8 pb-10 border-b border-divider">
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint flex items-center gap-2 mb-6 flex-wrap"
      >
        <Link href="/ai-flows" className="hover:text-ink transition-colors">
          AI Flows
        </Link>
        {primaryCategory && (
          <>
            <span aria-hidden>›</span>
            <span>{primaryCategory}</span>
          </>
        )}
        <span aria-hidden>›</span>
        <span className="text-ink-muted normal-case tracking-normal font-sans text-caption">
          {flow.slug}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(320px,1fr)] gap-x-10 gap-y-8 items-start">
        <HeroPreview
          mediaUrl={flow.exampleOutput}
          posterUrl={flow.thumbnail}
          kind={kind}
          inferenceTime={null}
          inputJson={buildExampleInputJson(flow)}
        />

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-sans text-[clamp(26px,3.2vw,36px)] leading-[1.1] tracking-tightest text-ink">
              {flow.name}
            </h1>

            <div className="font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Flow</span>
              <span className="text-field">·</span>
              <span>
                {stepCount} step{stepCount === 1 ? '' : 's'}
              </span>
              {primaryCategory && (
                <>
                  <span className="text-field">·</span>
                  <span>{primaryCategory}</span>
                </>
              )}
            </div>

            {flow.description && (
              <p className="text-body text-ink-muted leading-[1.55] mt-3 w-full">
                {flow.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Link
              href="/sign-up"
              className="group relative inline-flex w-full items-center justify-center gap-1.5 px-3 py-3 rounded-md bg-brand text-on-brand text-body-sm font-semibold tracking-tight whitespace-nowrap hover:bg-brand-deep transition-colors shadow-[0_10px_30px_-12px_rgb(var(--brand)/0.55)] hover:shadow-[0_14px_36px_-10px_rgb(var(--brand)/0.75)]"
            >
              <span>Clone &amp; customize</span>
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <Button href="/sign-up" variant="secondary" fullWidth>
              Run template
            </Button>
            <AskAiPanel modelTitle={flow.name} modelSlug={flow.slug} fullWidth />
          </div>

          <dl className="grid grid-cols-3 gap-x-5 gap-y-3">
            <Stat label="Steps" value={String(stepCount)} mono />
            <Stat label="Inputs" value={String(inputCount)} mono />
            <Stat label="Runs" value={formatNumber(flow.triggerCount)} mono />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mb-1">{label}</dt>
      <dd className={`text-body text-ink ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</dd>
    </div>
  );
}
