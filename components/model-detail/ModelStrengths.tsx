'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import type { ModelDetail } from '@/lib/modelDetail';
import { Eyebrow } from '@/components/ui/Eyebrow';

/**
 * "What this model is good at" card shown in the right aside below pricing.
 *
 * Each row points at a specific example slot in <ModelExamples /> via a hash
 * link (`#example-N`). Click pins, hover emphasizes + scrolls (debounced),
 * leaving the card resets everything.
 *
 * Strengths are mocked for now; real data will come from a per-model
 * `strengths[]` field once the catalog ships it.
 */

type Strength = { title: string; body: string };

const VIDEO_STRENGTHS: readonly Strength[] = [
  { title: 'Cinematic framing', body: 'Atmospheric wide shots, golden hour grading, depth that feels shot, not rendered.' },
  { title: 'Character consistency', body: 'Subject locks across the clip. No face morph, no outfit drift.' },
  { title: 'Style transfer', body: 'Match a reference image’s palette, grain, and color grade in one pass.' },
  { title: 'Motion quality', body: 'Smooth camera moves, physics aware object motion, no jelly limbs.' },
  { title: 'Prompt adherence', body: 'Long, structured prompts land as written, beat order intact.' },
  { title: 'Edge cases', body: 'Abstract or stylized requests don’t fall apart at higher guidance.' },
];

const IMAGE_STRENGTHS: readonly Strength[] = [
  { title: 'Photoreal portraits', body: 'Skin micro detail, catchlights in the eyes, no plasticky smoothing.' },
  { title: 'Compositional control', body: 'Rule of thirds, leading lines, negative space, when you ask for them.' },
  { title: 'Style range', body: 'Anime, oil, watercolor, isometric, picks up the cue without fighting you.' },
  { title: 'Text legibility', body: 'Short typography in frame stays readable; the model spells what you wrote.' },
  { title: 'Lighting fidelity', body: 'Hard rim light, soft window light, neon backwash, actually lit, not stamped.' },
  { title: 'Edge cases', body: 'Hands, jewelry, micro pattern fabric, the usual fail modes don’t fail here.' },
];

const AUDIO_STRENGTHS: readonly Strength[] = [
  { title: 'Voice character', body: 'Holds a single speaker across a long clip; tone and timbre don’t drift.' },
  { title: 'Emotional range', body: 'Whisper, laugh, urgency, the line reads the way you wrote it.' },
  { title: 'Pacing control', body: 'Beat pauses, breath room, deliberate phrasing, not a flat machine read.' },
  { title: 'Pronunciation', body: 'Names, acronyms, foreign loanwords, pronounced, not phonetic guessed.' },
  { title: 'Background tolerance', body: 'Works clean even when the prompt asks for ambience or score under voice.' },
  { title: 'Edge cases', body: 'Numbers, dates, code spellings, the things every TTS quietly mangles.' },
];

const GENERIC_STRENGTHS: readonly Strength[] = [
  { title: 'Prompt adherence', body: 'Long, structured prompts land as written, your intent survives the round-trip.' },
  { title: 'Output fidelity', body: 'Detail holds at the resolution you asked for. No quiet downsampling.' },
  { title: 'Style range', body: 'Switches register without losing the brief, clean, gritty, painterly, technical.' },
  { title: 'Consistency', body: 'Same prompt, same seed → same output. Stable enough to ship behind a feature flag.' },
  { title: 'Speed', body: 'Inference time stays in the band advertised. No long tail outliers under load.' },
  { title: 'Edge cases', body: 'The off-distribution requests other models fold on, this one keeps standing.' },
];

function pickStrengths(model: ModelDetail): readonly Strength[] {
  const haystack = `${(model.outputType ?? '').toLowerCase()} ${(model.type ?? '').toLowerCase()}`;
  if (haystack.includes('video')) return VIDEO_STRENGTHS;
  if (haystack.includes('audio')) return AUDIO_STRENGTHS;
  if (haystack.includes('image')) return IMAGE_STRENGTHS;
  return GENERIC_STRENGTHS;
}

const STRENGTHS_CARD_ID = 'model-strengths-card';
const HOVER_SCROLL_DELAY_MS = 150;
const ROW_TRANSITION = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };
const OPACITY_TRANSITION = { duration: 0.3, ease: 'easeOut' as const };

/**
 * Scroll the matching example into the same vertical line as the Strengths
 * card. Double-rAF so React state commits + framer-motion + paint settle
 * before we read getBoundingClientRect; otherwise the very first click reads
 * stale layout and the smooth scroll never visibly fires.
 */
function scrollExampleIntoAlignment(idx: number) {
  const target = document.getElementById(`example-${idx}`);
  if (!target) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const strengthsCard = document.getElementById(STRENGTHS_CARD_ID);
      if (!strengthsCard) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      const targetTop = target.getBoundingClientRect().top;
      const strengthsTop = strengthsCard.getBoundingClientRect().top;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const newScrollY = Math.max(
        0,
        Math.min(maxScroll, window.scrollY + targetTop - strengthsTop),
      );
      window.scrollTo({ top: newScrollY, behavior: 'smooth' });
    });
  });
}

function dispatchStrengthsHover(idx: number | null) {
  window.dispatchEvent(new CustomEvent('model-strengths-hover', { detail: { idx } }));
}

type StrengthRowProps = {
  idx: number;
  strength: Strength;
  emphasized: boolean;
  onClick: (idx: number) => void;
  onMouseEnter: (idx: number) => void;
  onMouseLeave: (idx: number) => void;
};

const StrengthRow = memo(function StrengthRow({
  idx,
  strength,
  emphasized,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: StrengthRowProps) {
  const handleAnchorClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onClick(idx);
    },
    [idx, onClick],
  );
  const handleEnter = useCallback(() => onMouseEnter(idx), [idx, onMouseEnter]);
  const handleLeave = useCallback(() => onMouseLeave(idx), [idx, onMouseLeave]);

  return (
    <li>
      <a
        href={`#example-${idx}`}
        onClick={handleAnchorClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={`group block rounded-md border px-2.5 py-1.5 transition-all duration-200 ${
          emphasized
            ? 'border-brand bg-brand/[0.08] shadow-[0_0_18px_-8px_rgb(var(--brand)/0.5)]'
            : 'border-field hover:border-brand/60 hover:bg-surface-raised'
        }`}
      >
        <div className="flex items-baseline gap-2.5">
          <Eyebrow as="span" size="sm" className="tabular-nums shrink-0">{String(idx + 1).padStart(2, '0')}</Eyebrow>
          <span
            className={`text-body-sm font-medium leading-tight truncate flex-1 transition-colors ${
              emphasized ? 'text-brand' : 'text-ink'
            }`}
          >
            {strength.title}
          </span>
          <span
            aria-hidden
            className={`font-mono text-eyebrow shrink-0 transition-colors ${
              emphasized ? 'text-brand' : 'text-ink-faint group-hover:text-brand'
            }`}
          >
            &rarr;
          </span>
        </div>
        <motion.div
          initial={false}
          animate={{ height: emphasized ? 'auto' : 18 }}
          transition={ROW_TRANSITION}
          style={{ overflow: 'hidden' }}
          className="mt-1"
        >
          <motion.div
            initial={false}
            animate={{ opacity: emphasized ? 1 : 0.85 }}
            transition={OPACITY_TRANSITION}
            className={`text-eyebrow leading-snug transition-colors ${
              emphasized ? 'text-ink' : 'text-ink-faint'
            }`}
          >
            {strength.body}
          </motion.div>
        </motion.div>
      </a>
    </li>
  );
});

export function ModelStrengths({ model }: { model: ModelDetail }) {
  const strengths = useMemo(() => pickStrengths(model).slice(0, 6), [model]);

  // Three sources of emphasis, OR'd together:
  //   pinnedIdx      , last clicked, persists until another row is clicked
  //                     or the mouse leaves the card.
  //   localHoverIdx  , mouse is over this row right now.
  //   exampleHoverIdx, mouse is over the matching example card on the left.
  const [pinnedIdx, setPinnedIdx] = useState<number | null>(null);
  const [localHoverIdx, setLocalHoverIdx] = useState<number | null>(null);
  const [exampleHoverIdx, setExampleHoverIdx] = useState<number | null>(null);
  const hoverScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to cross-component hover events from the examples grid.
  useEffect(() => {
    function onHover(e: Event) {
      const detail = (e as CustomEvent<{ idx: number | null }>).detail;
      setExampleHoverIdx(detail?.idx ?? null);
    }
    window.addEventListener('model-example-hover', onHover);
    return () => window.removeEventListener('model-example-hover', onHover);
  }, []);

  // Clear the hover-scroll timer on unmount so it never fires against a
  // detached DOM.
  useEffect(() => {
    return () => {
      if (hoverScrollTimer.current) clearTimeout(hoverScrollTimer.current);
    };
  }, []);

  const cancelHoverScroll = useCallback(() => {
    if (hoverScrollTimer.current) {
      clearTimeout(hoverScrollTimer.current);
      hoverScrollTimer.current = null;
    }
  }, []);

  const handleRowClick = useCallback(
    (idx: number) => {
      setPinnedIdx(idx);
      window.dispatchEvent(new CustomEvent('model-example-flash', { detail: { idx } }));
      history.replaceState(null, '', `#example-${idx}`);
      scrollExampleIntoAlignment(idx);
    },
    [],
  );

  const handleRowEnter = useCallback(
    (idx: number) => {
      setLocalHoverIdx(idx);
      dispatchStrengthsHover(idx);
      if (hoverScrollTimer.current) clearTimeout(hoverScrollTimer.current);
      hoverScrollTimer.current = setTimeout(
        () => scrollExampleIntoAlignment(idx),
        HOVER_SCROLL_DELAY_MS,
      );
    },
    [],
  );

  const handleRowLeave = useCallback(
    (idx: number) => {
      setLocalHoverIdx((cur) => (cur === idx ? null : cur));
      dispatchStrengthsHover(null);
      cancelHoverScroll();
    },
    [cancelHoverScroll],
  );

  const handleCardLeave = useCallback(() => {
    setPinnedIdx(null);
    setLocalHoverIdx(null);
    cancelHoverScroll();
    dispatchStrengthsHover(null);
  }, [cancelHoverScroll]);

  return (
    <div
      id={STRENGTHS_CARD_ID}
      onMouseLeave={handleCardLeave}
      className="border border-field rounded-md p-4 bg-surface-raised/40"
    >
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <Eyebrow as="span" tone="ink-muted">What it&rsquo;s good at</Eyebrow>
        <Eyebrow as="span" size="sm" tone="ink-faint">tap to see</Eyebrow>
      </div>
      <ol className="space-y-1.5">
        {strengths.map((s, i) => (
          <StrengthRow
            key={s.title}
            idx={i}
            strength={s}
            emphasized={pinnedIdx === i || localHoverIdx === i || exampleHoverIdx === i}
            onClick={handleRowClick}
            onMouseEnter={handleRowEnter}
            onMouseLeave={handleRowLeave}
          />
        ))}
      </ol>
    </div>
  );
}
