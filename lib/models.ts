export type ModelType = 'VIDEO' | 'IMAGE' | 'AUDIO' | '3D' | 'UPSCALE' | 'UTIL';

export type ModelEntry = {
  name: string;
  type: ModelType;
  latency: string;
  price: string;
  provider: string;
  tint: string;
  description?: string;
  tags?: string[];
  onHomepage?: boolean;
};

export const models: ModelEntry[] = [
  {
    name: 'Kling v3 Pro',
    type: 'VIDEO',
    latency: '12s',
    price: '$1.60/5s',
    provider: 'by Kuaishou',
    tint: 'bg-[#E8EFFF]',
    description: 'High quality cinematic video generation with strong motion fidelity.',
    tags: ['t2v', 'i2v', 'cinematic'],
    onHomepage: true,
  },
  {
    name: 'Veo 3',
    type: 'VIDEO',
    latency: '8s',
    price: '$3.20/8s',
    provider: 'by Google',
    tint: 'bg-[#E8EFFF]',
    description: 'Cinematic video with synthesized audio. State of the art for narrative shots.',
    tags: ['t2v', 'i2v', 'sound'],
    onHomepage: true,
  },
  {
    name: 'FLUX 1.1 Pro',
    type: 'IMAGE',
    latency: '1.8s',
    price: '$0.075',
    provider: 'by BFL',
    tint: 'bg-[#E6F5E8]',
    description: 'Best in class image quality. The default choice for serious creative work.',
    tags: ['t2i', 'photoreal', 'pro'],
    onHomepage: true,
  },
  {
    name: 'Nano Banana 2',
    type: 'IMAGE',
    latency: '0.9s',
    price: '$0.030',
    provider: 'by Google',
    tint: 'bg-[#E6F5E8]',
    description: 'Fast, cheap, surprisingly good. Ideal for high volume image workloads.',
    tags: ['t2i', 'fast', 'budget'],
    onHomepage: true,
  },
  {
    name: 'ElevenLabs v3',
    type: 'AUDIO',
    latency: '0.5s',
    price: '$0.30/1k',
    provider: 'by ElevenLabs',
    tint: 'bg-[#F5EFD9]',
    description: 'State of the art voice synthesis. Multilingual, controllable prosody.',
    tags: ['tts', 'voice', 'multilingual'],
    onHomepage: true,
  },
  {
    name: 'Suno v4',
    type: 'AUDIO',
    latency: '8s',
    price: '$0.20/track',
    provider: 'by Suno',
    tint: 'bg-[#F5EFD9]',
    description: 'Full-track music generation. Good for stings, beds, and reference tracks.',
    tags: ['music', 'composition'],
    onHomepage: true,
  },
  {
    name: 'Hunyuan 3D 2',
    type: '3D',
    latency: '8s',
    price: '$0.50',
    provider: 'by Tencent',
    tint: 'bg-[#F0EBFF]',
    description: 'Image-to-3D with clean topology. Suitable for game and product workflows.',
    tags: ['i23d', 'mesh', 'topology'],
    onHomepage: true,
  },
  {
    name: 'Topaz 4×',
    type: 'UPSCALE',
    latency: '0.6s',
    price: '$0.020',
    provider: 'by Topaz',
    tint: 'bg-[#F8E8E8]',
    description: 'Pro-grade 4× upscaling with face-aware sharpening.',
    tags: ['upscale', '4x', 'face-aware'],
    onHomepage: true,
  },
  {
    name: 'Safety Moderator',
    type: 'UTIL',
    latency: '0.1s',
    price: 'Free',
    provider: 'by each::labs',
    tint: 'bg-[#F8E8E8]',
    description: 'Built-in content safety. Routes to fallback when flagged.',
    tags: ['moderation', 'safety'],
    onHomepage: false,
  },
  {
    name: 'GPT-4o',
    type: 'UTIL',
    latency: '0.7s',
    price: '$0.005/call',
    provider: 'by OpenAI',
    tint: 'bg-[#F0EBFF]',
    description: 'General reasoning. Used for prompt enhancement, routing, and safety pre-checks.',
    tags: ['llm', 'reasoning'],
    onHomepage: false,
  },
  {
    name: 'Sora 2',
    type: 'VIDEO',
    latency: '25s',
    price: '$2.40/10s',
    provider: 'by OpenAI',
    tint: 'bg-[#E8EFFF]',
    description: 'Long form narrative video with sound design.',
    tags: ['t2v', 'long-form', 'sound'],
    onHomepage: false,
  },
  {
    name: 'Whisper Large v3',
    type: 'AUDIO',
    latency: '0.4s',
    price: '$0.006/min',
    provider: 'by OpenAI',
    tint: 'bg-[#F5EFD9]',
    description: 'Robust multilingual speech-to-text with timestamping.',
    tags: ['stt', 'multilingual', 'transcribe'],
    onHomepage: false,
  },
];

export const homepageModels = models.filter((m) => m.onHomepage);
