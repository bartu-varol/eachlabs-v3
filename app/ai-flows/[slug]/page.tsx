import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFlowDetail, getRelatedFlows, listPopularFlowSlugs } from '@/lib/flowDetail';
import { FlowDetailHero } from '@/components/flow-detail/FlowDetailHero';
import { FlowTemplate } from '@/components/flow-detail/FlowTemplate';
import { FlowApiSnippets } from '@/components/flow-detail/FlowApiSnippets';
import { FlowPlayground } from '@/components/flow-detail/FlowPlayground';
import { FlowRelated } from '@/components/flow-detail/FlowRelated';
import { FlowReadme, type FlowReadmeData } from '@/components/flow-detail/FlowReadme';
import { buildExampleInputJson } from '@/lib/flowDetail';

const MOCK_README: FlowReadmeData = {
  overview: `
    <p>
      <strong>The Last Hold</strong> is a cinematic disaster-love workflow that takes two
      portrait photos and renders a 15-second hyperreal short film: a storm on the Bosphorus,
      a meteor impact, a tsunami, and one final, wordless embrace.
    </p>
    <p>
      The flow chains a reference-to-video model with curated prompt scaffolding, audio
      direction, and camera blocking so creators get film-grade output without writing a
      single line of motion description.
    </p>
  `,
  capabilities: `
    <ul>
      <li>Two-subject reference-to-video grounding that preserves both faces across the clip</li>
      <li>Built-in dialogue beats, ambient SFX cues, and music swells</li>
      <li>Scripted camera moves: handheld push-in, orbit, locked emotional close-up</li>
      <li>15-second runtime at 720p, 16:9 aspect ratio</li>
      <li>Optional generated audio, voice + score</li>
    </ul>
  `,
  whatCanIUseFor: `
    <ul>
      <li>Short-form social: TikTok / Reels / Shorts cinematic edits</li>
      <li>Music-video teasers built around two-person chemistry</li>
      <li>Mood films, brand storytelling, festival submission proofs</li>
      <li>Wedding and anniversary keepsake reels from a single pair of stills</li>
      <li>Narrative previs, block out an emotional beat before a real shoot</li>
    </ul>
  `,
  tipsAndTricks: `
    <ul>
      <li><strong>Use front-facing portraits</strong> with both subjects clearly visible, soft natural light works best.</li>
      <li><strong>High contrast helps subject lock</strong>; avoid heavy filters or face-obscuring accessories.</li>
      <li>Two faces facing the camera produce stronger continuity than profile shots.</li>
      <li>Plain backgrounds give the storm and meteor SFX more room to breathe.</li>
      <li>If the output drifts off-character, re-upload a tighter crop from chest up.</li>
    </ul>
  `,
  technicalSpec: `
    <ul>
      <li><strong>Backbone:</strong> bytedance-seedance-2-0-reference-to-video-fast</li>
      <li><strong>Duration:</strong> 15s · <strong>Resolution:</strong> 720p · <strong>Aspect:</strong> 16:9</li>
      <li><strong>Audio:</strong> generated (voice + ambience + score)</li>
      <li><strong>Inputs:</strong> two image URLs (Person1, Person2), PNG / JPG / WebP</li>
      <li><strong>Avg. runtime:</strong> ~90–120 seconds end-to-end</li>
    </ul>
  `,
  thingsToBeAwareOf: `
    <ul>
      <li>Generated voice lines are stylized, exact lip-sync to user dialogue is not guaranteed.</li>
      <li>Faces can drift on extreme angles or under heavy occlusion (hats, sunglasses, hair across face).</li>
      <li>Output is locked to the 15-second story beats, this flow is not a generic image-to-video tool.</li>
      <li>Audio language defaults to English; non-English speech may sound accented.</li>
    </ul>
  `,
  keyConsiderations: `
    <p>
      This flow is opinionated by design. It's a <em>cinematic template</em>, not a freeform
      prompt, the storm, meteor, and tsunami beats are baked into the pipeline. If you need
      a different narrative arc, clone the flow and edit the step prompt rather than
      forcing it through inputs.
    </p>
    <p>
      For longer films, chain multiple instances and stitch the outputs in post, single-run
      length is fixed at 15 seconds.
    </p>
  `,
  limitations: `
    <ul>
      <li>Hard cap at 15 seconds per run.</li>
      <li>Two-subject only, single-person or group (3+) inputs degrade quality.</li>
      <li>720p maximum; no 1080p or 4K path in this flow.</li>
      <li>No control over background location, the Bosphorus setting is part of the template.</li>
    </ul>
  `,
};

type RouteParams = { slug: string };

export const revalidate = 600;

export async function generateStaticParams(): Promise<RouteParams[]> {
  const slugs = await listPopularFlowSlugs(12).catch(() => []);
  if (slugs.length === 0) return [{ slug: 'the-last-hold-video' }];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const flow = await getFlowDetail(slug).catch(() => null);
  if (!flow) return { title: 'Flow · each::labs' };
  return {
    title: `${flow.name} · each::labs`,
    description: flow.description ?? `${flow.name}, an each::labs AI flow you can clone and remix.`,
  };
}

export default async function FlowDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const flow = await getFlowDetail(slug);
  if (!flow) notFound();

  const related = await getRelatedFlows(flow.categories[0], flow.slug);
  const stepCount = flow.definition.steps?.length ?? 0;
  const inputCount = Object.keys(flow.definition.input_schema?.properties ?? {}).filter(
    (k) => k !== 'type',
  ).length;
  const lastUpdated = flow.updatedAt ? new Date(flow.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) : '-';

  return (
    <>
      <FlowDetailHero flow={flow} />

      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
          <div className="space-y-8 min-w-0">
            <FlowTemplate flow={flow} />
            <FlowApiSnippets
              workflowId={flow.workflowId}
              versionId={flow.versionId}
              inputsJson={buildExampleInputJson(flow)}
            />
            <FlowPlayground flow={flow} />
            <FlowReadme readme={MOCK_README} />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-rule2 rounded-md p-5 bg-surface/40">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
                  Cost &amp; usage
                </span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                  per run
                </span>
              </div>
              <div className="font-mono text-[24px] text-ink mb-2 tabular-nums">
                Sum of steps
              </div>
              <p className="text-[13px] text-ink2 leading-[1.55]">
                Flow orchestration is free. You only pay for the underlying model calls, each step
                bills at its model price. Estimate yours in the pricing calculator.
              </p>
              <p className="text-[11.5px] text-ink3 italic leading-[1.5] mt-3">
                * This is the estimated price based on this prompt. Real cost depends on
                your inputs (duration, resolution, mode).
              </p>
              <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-[12px] mt-4 border-t border-rule2 pt-4">
                <dt className="font-mono text-ink3 uppercase tracking-eyebrow text-[10px]">
                  Steps
                </dt>
                <dd className="font-mono text-ink text-right tabular-nums">{stepCount}</dd>
                <dt className="font-mono text-ink3 uppercase tracking-eyebrow text-[10px]">
                  Inputs
                </dt>
                <dd className="font-mono text-ink text-right tabular-nums">{inputCount}</dd>
                <dt className="font-mono text-ink3 uppercase tracking-eyebrow text-[10px]">
                  Updated
                </dt>
                <dd className="font-mono text-ink text-right">{lastUpdated}</dd>
              </dl>
            </div>

            <Link
              href="https://docs.eachlabs.ai/workflows/overview"
              className="flex items-center justify-between gap-2 px-5 py-4 border border-rule2 rounded-md text-[13px] text-ink hover:border-ink/40 hover:bg-surface/30 transition-colors"
            >
              <span>Flow docs &amp; API</span>
              <span aria-hidden className="text-ink3">→</span>
            </Link>
          </aside>
        </div>
      </section>

      <FlowRelated items={related} />
    </>
  );
}
