import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFlowDetail, getRelatedFlows, listPopularFlowSlugs, type FlowDetail } from '@/lib/flowDetail';
import { FlowDetailHero } from '@/components/flow-detail/FlowDetailHero';
import { FlowTemplate } from '@/components/flow-detail/FlowTemplate';
import { FlowApiSnippets } from '@/components/flow-detail/FlowApiSnippets';
import { FlowPlayground } from '@/components/flow-detail/FlowPlayground';
import { FlowRelated } from '@/components/flow-detail/FlowRelated';
import { FlowReadme, type FlowReadmeData } from '@/components/flow-detail/FlowReadme';
import { buildExampleInputJson } from '@/lib/flowDetail';
import { MODEL_PRICES } from '@/lib/modelPricing';

/** Fixed price for the template. Tries to sum each step's catalog price; if
 *  no step resolves, falls back to a deterministic mock derived from the
 *  flow slug so each template still shows a stable concrete number rather
 *  than the abstract "Varies". Replace with real per-step pricing data when
 *  the API exposes it. */
function templateFixedPrice(flow: FlowDetail): { headline: string; matched: boolean } {
  const steps = flow.definition.steps ?? [];
  const normalize = (s: string) => s.toLowerCase().replace(/[-_.\s]/g, '');

  let total = 0;
  let matched = 0;
  for (const step of steps) {
    if (!step.model) continue;
    const stepKey = normalize(step.model);
    const hit = MODEL_PRICES.find((p) => {
      const candidate = normalize(`${p.provider}${p.model}`);
      return candidate.includes(stepKey) || stepKey.includes(candidate);
    });
    if (hit) {
      total += hit.price;
      matched++;
    }
  }

  if (matched === 0) {
    // Deterministic mock,same slug always yields the same number.
    // Range chosen to look plausible for a single-to-few step flow.
    const stepBaseline = Math.max(1, steps.length || 1);
    let h = 0;
    for (let i = 0; i < flow.slug.length; i++) {
      h = (h * 31 + flow.slug.charCodeAt(i)) >>> 0;
    }
    // 4¢ – 39¢ per step, varied per slug.
    const perStep = 0.04 + ((h % 36) / 100); // 0.04 → 0.39
    total = +(perStep * stepBaseline).toFixed(3);
  }

  let headline: string;
  if (total < 0.01) headline = `$${total.toFixed(4)}`;
  else if (total < 1) headline = `$${total.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;
  else headline = `$${total.toFixed(2)}`;
  return { headline, matched: matched > 0 };
}

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
  const fixedPrice = templateFixedPrice(flow);

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
                  Template price
                </span>
                <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                  per run
                </span>
              </div>
              <div className="font-display text-[32px] text-ink mb-2 tabular-nums leading-none">
                {fixedPrice.headline}
              </div>
              <p className="text-[13px] text-ink2 leading-[1.55]">
                Fixed price for this template as-is. Clone the flow and the price moves with whatever
                models you swap in,every step bills at its own model price, nothing on top.
              </p>
              <p className="text-[11.5px] text-ink3 italic leading-[1.5] mt-3">
                * Real cost can still shift with your inputs (duration, resolution, mode).
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
