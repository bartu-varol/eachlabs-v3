'use client';

import type { FlowDetail } from '@/lib/flowDetail';
import { HeroPreview } from '@/components/model-detail/HeroPreview';

/**
 * Examples gallery shown above the Template · pipeline card on the flow detail
 * page. Mirrors ModelExamples: each card is a 1:1 HeroPreview with the same
 * hover-to-reveal-input behavior, mute toggle, and pin-on-click input panel.
 *
 * The catalog only exposes a single `exampleOutput` per flow, so the cards
 * mock with that media duplicated into N slots. Replace with curated per-flow
 * examples once the API exposes them.
 */

const MOCK_SLOT_COUNT = 6;

function inferKindFromUrl(url: string | null): 'video' | 'audio' | 'image' | 'none' {
  if (!url) return 'none';
  const lower = url.toLowerCase();
  if (/\.(mp4|webm|mov|m4v)(\?|$)/.test(lower)) return 'video';
  if (/\.(mp3|wav|ogg|m4a)(\?|$)/.test(lower)) return 'audio';
  return 'image';
}

type Props = {
  flow: FlowDetail;
  inputJson: string;
};

export function FlowExamples({ flow, inputJson }: Props) {
  const kind = inferKindFromUrl(flow.exampleOutput);
  if (kind === 'none') return null;

  const card = {
    mediaUrl: flow.exampleOutput,
    posterUrl: flow.thumbnail,
    kind,
    inferenceTime: null as number | null,
    inputJson,
  };

  return (
    <section className="border border-rule2 rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-rule2 bg-surface/40 flex items-baseline justify-between gap-4 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
          Examples
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {MOCK_SLOT_COUNT} sample runs · hover for input
        </span>
      </header>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: MOCK_SLOT_COUNT }).map((_, i) => (
          <div key={i} className="flex w-full justify-center">
            <HeroPreview
              mediaUrl={card.mediaUrl}
              posterUrl={card.posterUrl}
              kind={card.kind}
              inferenceTime={card.inferenceTime}
              inputJson={card.inputJson}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
