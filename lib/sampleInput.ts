import type { ModelInput } from './modelDetail';

function sampleValue(input: ModelInput): unknown {
  if (input.default) {
    if (input.type === 'boolean') return input.default === 'true';
    if (input.type === 'number') return Number(input.default);
    return input.default;
  }
  if (input.component === 'select' && input.options?.[0]) return input.options[0];
  if (input.type === 'boolean') return false;
  if (input.type === 'number') return 0;
  if (input.type === 'array') return [];
  if (input.component === 'file') return 'https://files.eachlabs.ai/your-image.jpg';
  if (input.name.includes('prompt')) return 'A cinematic close-up shot, soft lighting.';
  return '';
}

export function buildPayload(inputs: ModelInput[]): Record<string, unknown> {
  const required = inputs.filter((i) => i.required);
  const seed = (required.length > 0 ? required : inputs.slice(0, 4)).reduce<Record<string, unknown>>(
    (acc, i) => {
      acc[i.name] = sampleValue(i);
      return acc;
    },
    {},
  );
  return seed;
}

export function payloadToJson(payload: Record<string, unknown>): string {
  return JSON.stringify(payload, null, 2);
}
