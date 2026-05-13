import type { ModelDetail, ModelExample } from './modelDetail';

export function extractMediaUrl(output: unknown): string | null {
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

export function pickExample(model: ModelDetail): { url: string; example: ModelExample } | null {
  for (const ex of model.examples) {
    const url = extractMediaUrl(ex.output);
    if (url) return { url, example: ex };
  }
  return null;
}
