'use client';

import type { ModelDetail } from '@/lib/modelDetail';
import { buildPayload, payloadToJson } from '@/lib/sampleInput';
import { extractMediaUrl, pickExample } from '@/lib/modelOutput';
import { HeroPreview } from './HeroPreview';

/**
 * Examples gallery shown below the Call-the-API block on the model detail page.
 *
 * Each card mirrors the hero preview's hover-to-reveal-input behavior: rest on
 * a card and the input payload that produced this output slides over the
 * media. No navigation to a separate page.
 *
 * For now we don't have a curated multi-example set per model in the catalog,
 * so we mock by duplicating the main picked example's data into N slots.
 */

const MOCK_SLOT_COUNT = 6;

type CardData = {
  id: string;
  mediaUrl: string;
  posterUrl: string | null;
  kind: 'video' | 'audio' | 'image';
  inputJson: string;
  inferenceTime: number | null;
};

function deriveCards(model: ModelDetail): CardData[] {
  const outputKind = (model.outputType ?? '').toLowerCase();
  const modelType = (model.type ?? '').toLowerCase();
  const isVideo = outputKind.includes('video') || modelType.includes('video');
  const isAudio = outputKind.includes('audio') || modelType.includes('audio');

  // Prefer multiple real examples if the catalog exposes them; otherwise we
  // fall back to mocking with the single picked example, duplicated.
  const usable = model.examples
    .map((ex) => {
      const url = extractMediaUrl(ex.output);
      if (!url) return null;
      const kind: CardData['kind'] = isVideo ? 'video' : isAudio ? 'audio' : 'image';
      const inputJson =
        ex.input && Object.keys(ex.input).length > 0
          ? payloadToJson(ex.input)
          : model.defaultExampleInput && Object.keys(model.defaultExampleInput).length > 0
            ? payloadToJson(model.defaultExampleInput)
            : payloadToJson(buildPayload(model.inputs));
      return {
        id: `ex-${ex.id}`,
        mediaUrl: url,
        posterUrl: model.thumbnailUrl,
        kind,
        inputJson,
        inferenceTime: ex.inferenceTime ?? null,
      } satisfies CardData;
    })
    .filter((c): c is CardData => c !== null);

  if (usable.length >= MOCK_SLOT_COUNT) return usable.slice(0, MOCK_SLOT_COUNT);

  // Mock: replicate the first usable example (or the picked one) to fill slots.
  const seed = usable[0] ?? (() => {
    const picked = pickExample(model);
    if (!picked) return null;
    const kind: CardData['kind'] = isVideo ? 'video' : isAudio ? 'audio' : 'image';
    const inputJson =
      picked.example.input && Object.keys(picked.example.input).length > 0
        ? payloadToJson(picked.example.input)
        : model.defaultExampleInput && Object.keys(model.defaultExampleInput).length > 0
          ? payloadToJson(model.defaultExampleInput)
          : payloadToJson(buildPayload(model.inputs));
    return {
      id: `ex-picked`,
      mediaUrl: picked.url,
      posterUrl: model.thumbnailUrl,
      kind,
      inputJson,
      inferenceTime: picked.example.inferenceTime ?? null,
    } satisfies CardData;
  })();

  if (!seed) return [];
  return Array.from({ length: MOCK_SLOT_COUNT }, (_, i) => ({
    ...seed,
    id: `${seed.id}-mock-${i}`,
  }));
}

export function ModelExamples({ model }: { model: ModelDetail }) {
  const cards = deriveCards(model);
  if (cards.length === 0) return null;

  return (
    <section className="border border-rule2 rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-rule2 bg-surface/40 flex items-baseline justify-between gap-4 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
          Examples
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {cards.length} sample runs · hover for input
        </span>
      </header>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="flex w-full justify-center">
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
