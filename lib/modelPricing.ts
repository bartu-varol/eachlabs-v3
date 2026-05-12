/** Model price entries — sampled from eachlabs.ai/pricing */

export type Modality = 'VIDEO' | 'IMAGE' | 'AUDIO';

export type ModelPrice = {
  provider: string;
  model: string;
  modality: Modality;
  /** Quality tier label, e.g. "720p". */
  quality: string;
  /** Type label — Fixed / Variable / Pro etc. */
  type: string;
  /** Duration spec — e.g. "5s" or "—" for image/audio. */
  duration: string;
  /** USD per run. */
  price: number;
};

export const MODEL_PRICES: ModelPrice[] = [
  // ───────── VIDEO — Alibaba (wan family) ─────────
  { provider: 'Alibaba',  model: 'wan-2.7-text-to-video',     modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.10 },
  { provider: 'Alibaba',  model: 'wan-2.7-image-to-video',    modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.10 },
  { provider: 'Alibaba',  model: 'wan-2.6-image-to-video',    modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.10 },
  { provider: 'Alibaba',  model: 'wan-2.5-preview-i2v',       modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.05 },
  { provider: 'Alibaba',  model: 'wan-2.2-i2v',               modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.02 },
  { provider: 'Alibaba',  model: 'wan-v2.6-image-to-video-flash', modality: 'VIDEO', quality: '720p', type: 'Fast', duration: '5s', price: 0.05 },

  // ───────── VIDEO — ByteDance (seedance) ─────────
  { provider: 'ByteDance', model: 'seedance-2.0-image-to-video',       modality: 'VIDEO', quality: '720p', type: 'Pro',  duration: '5s', price: 0.3024 },
  { provider: 'ByteDance', model: 'seedance-2.0-image-to-video-fast',  modality: 'VIDEO', quality: '720p', type: 'Fast', duration: '5s', price: 0.2419 },
  { provider: 'ByteDance', model: 'seedance-2.0-text-to-video',        modality: 'VIDEO', quality: '720p', type: 'Pro',  duration: '5s', price: 0.135  },
  { provider: 'ByteDance', model: 'seedance-2.0-text-to-video-fast',   modality: 'VIDEO', quality: '720p', type: 'Fast', duration: '5s', price: 0.1076 },
  { provider: 'ByteDance', model: 'omnihuman-v1.5',                    modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.12 },
  { provider: 'ByteDance', model: 'dreamactor-v2',                     modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.25 },

  // ───────── VIDEO — Google (veo) ─────────
  { provider: 'Google',    model: 'veo-3',                              modality: 'VIDEO', quality: '720p', type: 'Pro',   duration: '5s', price: 0.99 },
  { provider: 'Google',    model: 'veo-3-fast',                         modality: 'VIDEO', quality: '720p', type: 'Fast',  duration: '5s', price: 0.49 },
  { provider: 'Google',    model: 'veo-3.1-text-to-video',              modality: 'VIDEO', quality: '720p', type: 'Pro',   duration: '5s', price: 0.99 },
  { provider: 'Google',    model: 'veo-3.1-text-to-video-fast',         modality: 'VIDEO', quality: '720p', type: 'Fast',  duration: '5s', price: 0.49 },
  { provider: 'Google',    model: 'veo-3.1-lite-text-to-video',         modality: 'VIDEO', quality: '720p', type: 'Lite',  duration: '5s', price: 0.25 },
  { provider: 'Google',    model: 'veo-2-image-to-video',               modality: 'VIDEO', quality: '720p', type: 'Pro',   duration: '5s', price: 0.99 },

  // ───────── VIDEO — Kling ─────────
  { provider: 'Kling',     model: 'kling-o3-pro-text-to-video',         modality: 'VIDEO', quality: '720p', type: 'Pro',   duration: '5s', price: 0.70 },
  { provider: 'Kling',     model: 'kling-o3-standard-text-to-video',    modality: 'VIDEO', quality: '720p', type: 'Std',   duration: '5s', price: 0.70 },
  { provider: 'Kling',     model: 'kling-v1-6-pro-image-to-video',      modality: 'VIDEO', quality: '720p', type: 'Pro',   duration: '5s', price: 0.70 },
  { provider: 'Kling',     model: 'kling-v1-6-pro-effects',             modality: 'VIDEO', quality: '720p', type: 'FX',    duration: '5s', price: 1.99 },
  { provider: 'Kling',     model: 'kling-avatar-v2-pro',                modality: 'VIDEO', quality: '720p', type: 'Avatar', duration: '5s', price: 0.70 },

  // ───────── VIDEO — Other studios ─────────
  { provider: 'HeyGen',    model: 'heygen-video-translate',             modality: 'VIDEO', quality: '720p', type: 'Translate', duration: '5s', price: 0.1875 },
  { provider: 'Higgsfield', model: 'higgsfield-ai-visual-effects',       modality: 'VIDEO', quality: '720p', type: 'FX', duration: '5s', price: 0.625 },
  { provider: 'Creatify',  model: 'creatify-aurora',                    modality: 'VIDEO', quality: '720p', type: 'Fixed', duration: '5s', price: 0.14 },

  // ───────── IMAGE — illustrative ─────────
  { provider: 'BFL',       model: 'flux-1.1-pro',                       modality: 'IMAGE', quality: '1024',  type: 'Pro',  duration: '—',  price: 0.075 },
  { provider: 'BFL',       model: 'flux-schnell',                       modality: 'IMAGE', quality: '1024',  type: 'Fast', duration: '—',  price: 0.003 },
  { provider: 'Google',    model: 'nano-banana-2',                      modality: 'IMAGE', quality: '1024',  type: 'Fast', duration: '—',  price: 0.038 },
  { provider: 'OpenAI',    model: 'gpt-image-v2-text-to-image',         modality: 'IMAGE', quality: '1024',  type: 'Pro',  duration: '—',  price: 0.040 },
  { provider: 'OpenAI',    model: 'gpt-image-v2-edit',                  modality: 'IMAGE', quality: '1024',  type: 'Edit', duration: '—',  price: 0.040 },
  { provider: 'Stability', model: 'sdxl-turbo',                         modality: 'IMAGE', quality: '1024',  type: 'Fast', duration: '—',  price: 0.0035 },
  { provider: 'Topaz',     model: 'topaz-4x',                           modality: 'IMAGE', quality: '4×',    type: 'Upscale', duration: '—', price: 0.020 },

  // ───────── AUDIO — illustrative ─────────
  { provider: 'ElevenLabs', model: 'eleven-v3',                          modality: 'AUDIO', quality: 'studio', type: 'TTS',   duration: '1k chars', price: 0.30 },
  { provider: 'ElevenLabs', model: 'eleven-multilingual-v2',             modality: 'AUDIO', quality: 'studio', type: 'TTS',   duration: '1k chars', price: 0.18 },
  { provider: 'OpenAI',    model: 'whisper-large-v3',                    modality: 'AUDIO', quality: '—',      type: 'STT',   duration: '1 min',    price: 0.006 },
  { provider: 'Suno',      model: 'suno-v4',                             modality: 'AUDIO', quality: 'studio', type: 'Music', duration: '1 track',  price: 0.20 },
  { provider: 'Cartesia',  model: 'sonic-stream',                        modality: 'AUDIO', quality: 'realtime', type: 'TTS', duration: '1k chars', price: 0.14 },
];
