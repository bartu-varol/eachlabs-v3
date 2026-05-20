'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { ModelDetail } from '@/lib/modelDetail';
import { buildPayload, payloadToJson } from '@/lib/sampleInput';
import { extractMediaUrl, pickExample } from '@/lib/modelOutput';
import { HeroPreview } from './HeroPreview';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * Examples gallery, wrappers carry id="example-N" so the Strengths card on
 * the right can deep-link / sync hover with a specific example.
 *
 * Each event-driven state change (flash on click, ring on strengths hover)
 * is isolated to a memoized child so unaffected examples skip re-render.
 */

export const MOCK_EXAMPLE_SLOT_COUNT = 6;

const FLASH_DURATION_MS = 2400;

type CardData = {
  id: string;
  mediaUrl: string;
  posterUrl: string | null;
  kind: 'video' | 'audio' | 'image';
  inputJson: string;
  inferenceTime: number | null;
};

function resolveKind(model: ModelDetail): CardData['kind'] {
  const outputKind = (model.outputType ?? '').toLowerCase();
  const modelType = (model.type ?? '').toLowerCase();
  if (outputKind.includes('video') || modelType.includes('video')) return 'video';
  if (outputKind.includes('audio') || modelType.includes('audio')) return 'audio';
  return 'image';
}

function resolveInputJson(
  exampleInput: Record<string, unknown> | null | undefined,
  model: ModelDetail,
): string {
  if (exampleInput && Object.keys(exampleInput).length > 0) {
    return payloadToJson(exampleInput);
  }
  if (model.defaultExampleInput && Object.keys(model.defaultExampleInput).length > 0) {
    return payloadToJson(model.defaultExampleInput);
  }
  return payloadToJson(buildPayload(model.inputs));
}

function deriveCards(model: ModelDetail): CardData[] {
  const kind = resolveKind(model);

  const usable: CardData[] = [];
  for (const ex of model.examples) {
    const url = extractMediaUrl(ex.output);
    if (!url) continue;
    usable.push({
      id: `ex-${ex.id}`,
      mediaUrl: url,
      posterUrl: model.thumbnailUrl,
      kind,
      inputJson: resolveInputJson(ex.input, model),
      inferenceTime: ex.inferenceTime ?? null,
    });
    if (usable.length === MOCK_EXAMPLE_SLOT_COUNT) return usable;
  }

  if (usable.length > 0) {
    // Pad with duplicates of the first usable example to fill the grid.
    const seed = usable[0];
    while (usable.length < MOCK_EXAMPLE_SLOT_COUNT) {
      usable.push({ ...seed, id: `${seed.id}-mock-${usable.length}` });
    }
    return usable;
  }

  // No example has a URL, fall back to pickExample (which checks the same
  // outputs in a slightly looser way) and replicate.
  const picked = pickExample(model);
  if (!picked) return [];
  const seed: CardData = {
    id: 'ex-picked',
    mediaUrl: picked.url,
    posterUrl: model.thumbnailUrl,
    kind,
    inputJson: resolveInputJson(picked.example.input, model),
    inferenceTime: picked.example.inferenceTime ?? null,
  };
  return Array.from({ length: MOCK_EXAMPLE_SLOT_COUNT }, (_, i) => ({
    ...seed,
    id: `${seed.id}-mock-${i}`,
  }));
}

type ExampleCardProps = {
  card: CardData;
  index: number;
  isActive: boolean;
  someoneElseActive: boolean;
  onHover: (idx: number | null) => void;
};

const ExampleCard = memo(function ExampleCard({
  card,
  index,
  isActive,
  someoneElseActive,
  onHover,
}: ExampleCardProps) {
  return (
    <div
      id={`example-${index}`}
      aria-current={isActive ? 'true' : undefined}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={`w-full flex items-center justify-center overflow-hidden scroll-mt-28 transition-opacity duration-300 ease-out ${
        someoneElseActive ? 'opacity-45' : 'opacity-100'
      } ${isActive ? 'relative z-10' : ''}`}
    >
      <HeroPreview
        mediaUrl={card.mediaUrl}
        posterUrl={card.posterUrl}
        kind={card.kind}
        inferenceTime={card.inferenceTime}
        inputJson={card.inputJson}
        fillContainer
      />
    </div>
  );
});

const COLS = 3;
const ACTIVE_FR = 1.3;
const INACTIVE_FR = 0.85;
const GRID_TRANSITION =
  'grid-template-columns 420ms cubic-bezier(0.22,1,0.36,1)';

function computeTemplate(count: number, activeIndex: number): string {
  if (activeIndex < 0) return Array(count).fill('1fr').join(' ');
  return Array.from({ length: count }, (_, i) =>
    i === activeIndex ? `${ACTIVE_FR}fr` : `${INACTIVE_FR}fr`,
  ).join(' ');
}

export function ModelExamples({ model }: { model: ModelDetail }) {
  const cards = useMemo(() => deriveCards(model), [model]);
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const [strengthsHoverIdx, setStrengthsHoverIdx] = useState<number | null>(null);
  const [localHoverIdx, setLocalHoverIdx] = useState<number | null>(null);

  // Priority: local hover > strengths hover > flash. Whichever fires, that
  // card grows + the others dim. Callback ref-stable for memo'd children.
  const handleLocalHover = useCallback((idx: number | null) => {
    setLocalHoverIdx(idx);
    window.dispatchEvent(
      new CustomEvent('model-example-hover', { detail: { idx } }),
    );
  }, []);

  const activeIdx = localHoverIdx ?? strengthsHoverIdx ?? flashIdx;

  useEffect(() => {
    const len = cards.length;
    if (len === 0) return;

    let flashTimer: ReturnType<typeof setTimeout> | null = null;

    function inRange(idx: unknown): idx is number {
      return typeof idx === 'number' && Number.isFinite(idx) && idx >= 0 && idx < len;
    }

    function triggerFlash(idx: number) {
      setFlashIdx(idx);
      if (flashTimer) clearTimeout(flashTimer);
      flashTimer = setTimeout(
        () => setFlashIdx((cur) => (cur === idx ? null : cur)),
        FLASH_DURATION_MS,
      );
    }

    function flashFromHash() {
      const m = window.location.hash.match(/^#example-(\d+)$/);
      if (!m) return;
      const idx = parseInt(m[1], 10);
      if (inRange(idx)) triggerFlash(idx);
    }

    function onFlashEvent(e: Event) {
      const idx = (e as CustomEvent<{ idx: number }>).detail?.idx;
      if (inRange(idx)) triggerFlash(idx);
    }

    function onStrengthsHover(e: Event) {
      const idx = (e as CustomEvent<{ idx: number | null }>).detail?.idx ?? null;
      setStrengthsHoverIdx(idx === null || inRange(idx) ? idx : null);
    }

    flashFromHash();
    window.addEventListener('hashchange', flashFromHash);
    window.addEventListener('model-example-flash', onFlashEvent);
    window.addEventListener('model-strengths-hover', onStrengthsHover);
    return () => {
      if (flashTimer) clearTimeout(flashTimer);
      window.removeEventListener('hashchange', flashFromHash);
      window.removeEventListener('model-example-flash', onFlashEvent);
      window.removeEventListener('model-strengths-hover', onStrengthsHover);
    };
  }, [cards.length]);

  if (cards.length === 0) return null;

  return (
    <section className="border border-field rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-field bg-surface-raised/40 flex items-baseline justify-between gap-4 flex-wrap">
        <Eyebrow as="span" tone="ink-muted">Examples</Eyebrow>
        <Eyebrow as="span" size="sm" tone="ink-faint">{cards.length} sample runs · hover for input</Eyebrow>
      </header>
      <div
        style={{
          gridTemplateColumns: computeTemplate(
            COLS,
            activeIdx !== null ? activeIdx % COLS : -1,
          ),
          transition: GRID_TRANSITION,
        }}
        className="p-4 grid gap-3 items-start"
      >
        {cards.map((card, i) => (
          <ExampleCard
            key={card.id}
            card={card}
            index={i}
            isActive={activeIdx === i}
            someoneElseActive={activeIdx !== null && activeIdx !== i}
            onHover={handleLocalHover}
          />
        ))}
      </div>
    </section>
  );
}
