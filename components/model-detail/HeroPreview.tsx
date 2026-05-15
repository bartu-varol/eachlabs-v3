'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX } from 'lucide-react';

const IMAGE_RE = /^https?:\/\/\S+\.(png|jpe?g|webp|gif|avif)(\?|$)/i;
const VIDEO_RE = /^https?:\/\/\S+\.(mp4|webm|mov|m4v)(\?|$)/i;
const AUDIO_RE = /^https?:\/\/\S+\.(mp3|wav|ogg|m4a|flac)(\?|$)/i;

function ThumbHover({ url, type }: { url: string; type: 'image' | 'video' }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function handleMove(e: React.MouseEvent) {
    const MAX = 480;
    const PAD = 16;
    const x = Math.min(e.clientX + PAD, window.innerWidth - MAX - PAD);
    const y = Math.min(e.clientY + PAD, window.innerHeight - MAX - PAD);
    setPos({ x: Math.max(PAD, x), y: Math.max(PAD, y) });
  }

  const overlay = pos ? (
    <div
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999, maxWidth: 480, maxHeight: 480 }}
      className="pointer-events-none rounded-lg overflow-hidden ring-1 ring-white/20 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] bg-bg"
    >
      {type === 'image' ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt=""
          style={{ maxWidth: 480, maxHeight: 480 }}
          className="block w-auto h-auto"
        />
      ) : (
        <video
          src={url}
          autoPlay
          loop
          playsInline
          style={{ maxWidth: 480, maxHeight: 480 }}
          className="block w-auto h-auto"
        />
      )}
    </div>
  ) : null;

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={url}
        onMouseEnter={handleMove}
        onMouseMove={handleMove}
        onMouseLeave={() => setPos(null)}
        className="inline-block align-middle"
      >
        {type === 'image' ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={url}
            alt=""
            className="w-16 h-16 rounded object-cover ring-1 ring-white/15"
          />
        ) : (
          <video
            src={url}
            muted
            playsInline
            preload="metadata"
            className="w-24 h-16 rounded object-cover ring-1 ring-white/15"
          />
        )}
      </a>
      {mounted && overlay && createPortal(overlay, document.body)}
    </>
  );
}

function renderInputValue(value: unknown): ReactNode {
  if (typeof value === 'string') {
    if (IMAGE_RE.test(value)) {
      return <ThumbHover url={value} type="image" />;
    }
    if (VIDEO_RE.test(value)) {
      return <ThumbHover url={value} type="video" />;
    }
    if (AUDIO_RE.test(value)) {
      return (
        <audio src={value} controls preload="none" className="h-8 max-w-[260px]" />
      );
    }
    return (
      <span className="font-mono text-[12px] text-ink break-words">{`"${value}"`}</span>
    );
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="font-mono text-[12px] text-ink2">[]</span>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, i) => (
          <div key={i}>{renderInputValue(item)}</div>
        ))}
      </div>
    );
  }
  if (typeof value === 'boolean' || typeof value === 'number' || value === null) {
    return <span className="font-mono text-[12px] text-ink">{JSON.stringify(value)}</span>;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return <span className="font-mono text-[12px] text-ink2">{'{}'}</span>;
    }
    return (
      <div className="space-y-2 border-l border-rule2/50 pl-3">
        {entries.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">{k}</span>
            <div>{renderInputValue(v)}</div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <span className="font-mono text-[12px] text-ink break-words">{JSON.stringify(value)}</span>
  );
}

function parseInputJson(json: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    /* ignore */
  }
  return null;
}

type Kind = 'video' | 'audio' | 'image' | 'data' | 'none';

type Props = {
  mediaUrl: string | null;
  posterUrl: string | null;
  kind: Kind;
  inferenceTime: number | null;
  inputJson: string;
  outputData?: unknown;
  showInputOverlay?: boolean;
  /**
   * When true, the outer wrapper fills its parent (w-full / h-full) and the
   * media stretches to cover. Use inside a parent grid cell that already
   * controls width/height, e.g. the Examples gallery's resizing cells.
   */
  fillContainer?: boolean;
};

export function HeroPreview({
  mediaUrl,
  posterUrl,
  kind,
  inferenceTime,
  inputJson,
  outputData,
  showInputOverlay = true,
  fillContainer = false,
}: Props) {
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const allowHover = kind === 'image' || kind === 'video';
  const show = pinned || (allowHover && hovering);

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      if (audioRef.current) audioRef.current.muted = next;
      return next;
    });
  }

  function detectAudio() {
    const v = videoRef.current as
      | (HTMLVideoElement & {
          mozHasAudio?: boolean;
          webkitAudioDecodedByteCount?: number;
          audioTracks?: { length: number };
        })
      | null;
    if (!v || hasAudio === true) return;
    // Confirmed: actual audio bytes decoded (Chrome/Safari counter is non-trivial)
    // or Mozilla's explicit flag is set. We ignore audioTracks alone, a webm can
    // ship with an empty/silent track that has zero real audio content.
    const decodedBytes = v.webkitAudioDecodedByteCount ?? 0;
    if (v.mozHasAudio === true || decodedBytes > 1000) {
      setHasAudio(true);
      return;
    }
    if (v.audioTracks && v.audioTracks.length === 0) {
      setHasAudio(false);
    }
  }

  const fullWidthKinds = kind === 'audio' || kind === 'data' || kind === 'none';

  return (
    <div
      onMouseEnter={allowHover ? () => setHovering(true) : undefined}
      onMouseLeave={allowHover ? () => setHovering(false) : undefined}
      className={`relative rounded-xl overflow-hidden bg-surface2 ${
        fillContainer
          ? 'w-full'
          : fullWidthKinds
            ? 'aspect-video w-full lg:w-[640px] max-w-full'
            : 'w-fit max-w-full lg:max-w-[760px]'
      }`}
    >
      {mediaUrl && kind === 'video' ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          poster={posterUrl ?? undefined}
          autoPlay
          muted={muted}
          loop
          playsInline
          onLoadedMetadata={detectAudio}
          onLoadedData={detectAudio}
          onPlaying={detectAudio}
          onTimeUpdate={detectAudio}
          style={fillContainer ? undefined : { maxHeight: 480 }}
          className={
            fillContainer
              ? 'block w-full h-auto'
              : 'block max-w-full w-auto h-auto'
          }
        />
      ) : mediaUrl && kind === 'audio' ? (
        <>
          {posterUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={posterUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface2 via-surface to-surface2" />
          )}
          <div className="absolute inset-x-4 bottom-4 z-10">
            <div className="rounded-lg bg-bg/85 backdrop-blur-md border border-rule2 px-3 py-2 shadow-[0_8px_24px_-10px_rgb(0,0,0,0.35)]">
              <audio
                ref={audioRef}
                src={mediaUrl}
                controls
                muted={muted}
                preload="metadata"
                className="w-full h-9 align-middle [&::-webkit-media-controls-panel]:bg-transparent"
              />
            </div>
          </div>
        </>
      ) : mediaUrl && kind === 'image' ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={mediaUrl}
          alt=""
          style={fillContainer ? undefined : { maxHeight: 480 }}
          className={
            fillContainer
              ? 'block w-full h-auto'
              : 'block max-w-full w-auto h-auto'
          }
        />
      ) : kind === 'data' && outputData != null ? (
        <>
          {posterUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={posterUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-surface2 via-surface to-surface2" />
          )}
          <div className="absolute inset-x-4 top-12 bottom-4 z-10 flex">
            <div className="flex flex-col w-full max-h-full rounded-lg bg-bg/85 backdrop-blur-md border border-rule2 shadow-[0_8px_24px_-10px_rgb(0,0,0,0.35)] overflow-hidden">
              <div className="px-4 py-2 border-b border-rule2/60 font-mono text-[10px] uppercase tracking-eyebrow text-ink2 shrink-0">
                Example output
              </div>
              <pre className="font-mono text-[12px] leading-[1.55] text-ink px-4 py-3 whitespace-pre-wrap break-words overflow-auto flex-1">
                {typeof outputData === 'string'
                  ? (() => {
                      try {
                        const parsed = JSON.parse(outputData);
                        return typeof parsed === 'string'
                          ? parsed
                          : JSON.stringify(parsed, null, 2);
                      } catch {
                        return outputData;
                      }
                    })()
                  : JSON.stringify(outputData, null, 2)}
              </pre>
            </div>
          </div>
        </>
      ) : mediaUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={mediaUrl}
          alt=""
          style={{ maxHeight: 480 }}
          className="block max-w-full w-auto h-auto"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
          preview unavailable
        </div>
      )}

      {showInputOverlay && (
        <button
          type="button"
          onClick={() => setPinned((p) => !p)}
          aria-pressed={pinned}
          aria-label="Show example input as JSON"
          className={`absolute top-3 left-3 z-20 font-mono text-[10px] uppercase tracking-eyebrow px-2.5 py-1 rounded-full bg-bg/85 backdrop-blur text-ink2 hover:text-ink hover:bg-bg transition-opacity duration-150 ${
            show ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {'{ } input'}
        </button>
      )}

      {inferenceTime != null && (
        <span
          className={`absolute top-3 right-3 z-20 font-mono text-[10px] uppercase tracking-eyebrow text-ink2 bg-bg/85 backdrop-blur rounded-full px-2.5 py-1 transition-opacity duration-150 ${
            show ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          inference · {inferenceTime.toFixed(1)}s
        </span>
      )}

      {mediaUrl && kind === 'video' && hasAudio === true && (
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="absolute bottom-3 right-3 z-30 inline-flex items-center justify-center w-9 h-9 rounded-full bg-bg/90 backdrop-blur text-ink2 hover:text-ink hover:bg-bg transition-colors border border-rule2"
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      )}

      <div
        aria-hidden={!show || !showInputOverlay}
        className={`absolute inset-0 z-10 bg-bg/45 backdrop-blur-md transition-opacity duration-200 flex flex-col ${
          show && showInputOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <header className="px-4 py-2.5 flex items-center justify-between shrink-0">
          <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Example input
          </span>
          {pinned ? (
            <button
              type="button"
              onClick={() => setPinned(false)}
              className="font-mono text-[10px] uppercase tracking-eyebrow text-ink hover:opacity-80 transition-opacity inline-flex items-center gap-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              aria-label="Close input panel"
            >
              <span aria-hidden>×</span>
              <span>close</span>
            </button>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              hover
            </span>
          )}
        </header>
        {(() => {
          const parsedInput = parseInputJson(inputJson);
          if (!parsedInput) {
            return (
              <pre className="font-mono text-[12.5px] leading-[1.55] text-ink p-4 overflow-auto flex-1 whitespace-pre-wrap break-words">
                {inputJson}
              </pre>
            );
          }
          return (
            <dl className="px-4 pb-4 pt-1 overflow-auto flex-1 space-y-3">
              {Object.entries(parsedInput).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 items-start"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2 pt-1.5 break-words">
                    {key}
                  </dt>
                  <dd className="min-w-0">{renderInputValue(value)}</dd>
                </div>
              ))}
            </dl>
          );
        })()}
      </div>
    </div>
  );
}
