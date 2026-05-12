export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** Display date, "MMM dd, yyyy" formatted. */
  date: string;
  readMin: number;
  category: 'MODEL LAUNCH' | 'GUIDE' | 'COMPARISON' | 'INDUSTRY' | 'PRODUCT';
  author: { name: string; role: string; initials: string; avatarBg: string; avatarText: string };
  /** Tile accent, drives the gradient on listing cards. */
  accent: 'spark' | 'highlight' | 'success' | 'sun' | 'yellow' | 'ember';
  featured?: boolean;
  /** Original eachlabs.ai post URL, read the full article. */
  href: string;
};

const TEAM = {
  name: 'Eachlabs Team',
  role: 'Engineering · each::labs',
  initials: 'EL',
  avatarBg: 'bg-spark',
  avatarText: 'text-bg',
};

/** Posts pulled from eachlabs.ai/blog, real titles + excerpts, linked back to the source. */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'google-veo-4-what-to-expect-from-googles-next-video-model',
    title: 'Google Veo 4: What to Expect From Google’s Next Video Model',
    excerpt:
      'Veo 4 hasn’t been officially announced yet, but if you’ve been following the AI video space, you know Google’s next move is the one everyone’s pricing in. What to watch for, what changes for builders, and how to be ready on day zero.',
    date: 'Apr 29, 2026',
    readMin: 7,
    category: 'MODEL LAUNCH',
    author: TEAM,
    accent: 'spark',
    featured: true,
    href: 'https://www.eachlabs.ai/blog/google-veo-4-what-to-expect-from-googles-next-video-model',
  },
  {
    slug: 'p-avatar-video-create-talking-avatars-with-ai',
    title: 'P Avatar Video: Create Talking Avatars with AI',
    excerpt:
      'Most avatar tools make you choose between quality and speed. You either wait for cinematic output or you settle. P Avatar Video changes the tradeoff, what it does, where it shines, and how to wire it into a production pipeline.',
    date: 'Apr 30, 2026',
    readMin: 6,
    category: 'GUIDE',
    author: TEAM,
    accent: 'highlight',
    href: 'https://www.eachlabs.ai/blog/p-avatar-video-create-talking-avatars-with-ai',
  },
  {
    slug: 'realistic-vision-ai-image-generation-guide',
    title: 'Realistic Vision: AI Image Generation Guide',
    excerpt:
      'Good photography costs money, equipment, location, lighting, a subject willing to stand still. Realistic Vision flips that math. The prompts, parameters, and pitfalls that separate stock-y output from output you’d actually ship.',
    date: 'Apr 13, 2026',
    readMin: 8,
    category: 'GUIDE',
    author: TEAM,
    accent: 'success',
    href: 'https://www.eachlabs.ai/blog/realistic-vision-ai-image-generation-guide',
  },
  {
    slug: 'ovi-ai-turn-images-into-videos-with-audio',
    title: 'Ovi AI: Turn Images Into Videos With Audio',
    excerpt:
      'You’ve got a great photo, sharp, well-lit, the right subject, and it just sits there. Ovi AI fixes that. Upload an image, get a video with audio. The workflow, the limitations, and why this changes ad creative.',
    date: 'Apr 13, 2026',
    readMin: 5,
    category: 'GUIDE',
    author: TEAM,
    accent: 'yellow',
    href: 'https://www.eachlabs.ai/blog/ovi-ai-turn-images-into-videos-with-audio',
  },
  {
    slug: 'all-rumors-about-gpt-image-2',
    title: 'All Rumors About GPT Image 2',
    excerpt:
      'In our previous post we broke down the GPT Image 2 leak, Arena codenames, technical architecture, signal vs. noise. Here is everything else: the rumors, the patent filings, the timing, and what it means for production teams.',
    date: 'Apr 09, 2026',
    readMin: 6,
    category: 'INDUSTRY',
    author: TEAM,
    accent: 'ember',
    href: 'https://www.eachlabs.ai/blog/all-rumors-about-gpt-image-2',
  },
  {
    slug: 'wan-2-7-vs-seedance-2-0-the-models-everyones-talking-about',
    title: 'Wan 2.7 vs Seedance 2.0: The Models Everyone’s Talking About',
    excerpt:
      'Two models have been dominating the AI video conversation lately: Wan 2.7 and Seedance 2.0. Both dropped within days of each other. Side-by-side benchmarks, prompt fidelity, motion coherence, and the call you should make for each use case.',
    date: 'Apr 03, 2026',
    readMin: 10,
    category: 'COMPARISON',
    author: TEAM,
    accent: 'highlight',
    href: 'https://www.eachlabs.ai/blog/wan-2-7-vs-seedance-2-0-the-models-everyones-talking-about',
  },
  {
    slug: 'wan-2-7-is-here-everything-the-new-model-can-do',
    title: 'Wan 2.7 Is Here: Everything the New Model Can Do',
    excerpt:
      'When Alibaba dropped Wan 2.6, it got real attention from teams actually building with AI. The image-to-video quality alone changed our default. With 2.7, the bar moves again. What’s new, what’s genuinely better, and where to swap.',
    date: 'Apr 03, 2026',
    readMin: 8,
    category: 'MODEL LAUNCH',
    author: TEAM,
    accent: 'spark',
    href: 'https://www.eachlabs.ai/blog/wan-2-7-is-here-everything-the-new-model-can-do',
  },
  {
    slug: 'differences-between-text-to-video-and-image-to-video-models',
    title: 'Differences Between Text-to-Video and Image-to-Video Models',
    excerpt:
      'Here’s something most people don’t think about until they’re already knee-deep in an AI video project: the choice of t2v vs. i2v changes which models even compete, what your prompts look like, and how the output will fail.',
    date: 'Apr 01, 2026',
    readMin: 7,
    category: 'GUIDE',
    author: TEAM,
    accent: 'success',
    href: 'https://www.eachlabs.ai/blog/differences-between-text-to-video-and-image-to-video-models',
  },
  {
    slug: 'what-is-flux-2-pro-and-what-can-it-do',
    title: 'What Is Flux 2 Pro and What Can It Do',
    excerpt:
      'If you’ve been following the AI image space lately, you’ve probably heard Flux 2 Pro come up more than once. The actual capabilities, where it beats the BFL 1.1 line, and the workflows where it earns its price tag.',
    date: 'Apr 01, 2026',
    readMin: 7,
    category: 'MODEL LAUNCH',
    author: TEAM,
    accent: 'sun',
    href: 'https://www.eachlabs.ai/blog/what-is-flux-2-pro-and-what-can-it-do',
  },
  {
    slug: 'kling-2-5-turbo-fast-ai-video-generation-guide',
    title: 'Kling 2.5 Turbo: Fast AI Video Generation Guide',
    excerpt:
      'Speed matters in video production, not just generation speed (though that matters too), but the speed at which you can iterate on a brief. Kling 2.5 Turbo cuts the loop. What it gives up, what it keeps, when to reach for it.',
    date: 'Mar 18, 2026',
    readMin: 6,
    category: 'GUIDE',
    author: TEAM,
    accent: 'spark',
    href: 'https://www.eachlabs.ai/blog/kling-2-5-turbo-fast-ai-video-generation-guide',
  },
  {
    slug: 'kling-avatar-ai-avatar-generation-guide',
    title: 'Kling Avatar: AI Avatar Generation Guide',
    excerpt:
      'Getting a photograph to speak has always been a production problem. Hire a motion-capture studio, or settle for a stiff facial replacement. Kling Avatar makes the third option real, and it actually works for product use.',
    date: 'Mar 18, 2026',
    readMin: 6,
    category: 'GUIDE',
    author: TEAM,
    accent: 'highlight',
    href: 'https://www.eachlabs.ai/blog/kling-avatar-ai-avatar-generation-guide',
  },
  {
    slug: 'bytedance-seedream-v5-lite-text-to-image-guide',
    title: 'ByteDance Seedream V5 Lite: Text-to-Image Guide',
    excerpt:
      'Most text-to-image models take your prompt and interpret it in one pass. They guess at what you mean, apply their style, and ship a frame. Seedream V5 Lite plays a different game, multi-pass refinement on a tight budget.',
    date: 'Mar 18, 2026',
    readMin: 7,
    category: 'GUIDE',
    author: TEAM,
    accent: 'ember',
    href: 'https://www.eachlabs.ai/blog/bytedance-seedream-v5-lite-text-to-image-guide',
  },
];

export const BLOG_CATEGORIES: BlogPost['category'][] = [
  'MODEL LAUNCH',
  'GUIDE',
  'COMPARISON',
  'INDUSTRY',
  'PRODUCT',
];
