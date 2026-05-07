import { MessageSquare, Sparkles, Star, Search } from 'lucide-react';
import { askAI } from '@/lib/content';

const ASK_AI_PROMPT = askAI.prompt;
const ENCODED_PROMPT = encodeURIComponent(ASK_AI_PROMPT);

const buttons = [
  {
    label: 'ChatGPT',
    href: `https://chat.openai.com/?q=${ENCODED_PROMPT}`,
    Icon: MessageSquare,
    className:
      'border-emerald-600 text-emerald-500 hover:bg-emerald-950/40 hover:text-emerald-400',
  },
  {
    label: 'Claude',
    href: `https://claude.ai/new?q=${ENCODED_PROMPT}`,
    Icon: Sparkles,
    className: 'border-spark text-spark hover:bg-spark/10',
  },
  {
    label: 'Gemini',
    href: `https://gemini.google.com/app?q=${ENCODED_PROMPT}`,
    Icon: Star,
    className:
      'border-blue-500 text-blue-400 hover:bg-blue-950/40 hover:text-blue-300',
  },
  {
    label: 'Perplexity',
    href: `https://www.perplexity.ai/?q=${ENCODED_PROMPT}`,
    Icon: Search,
    className:
      'border-cyan-500 text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-300',
  },
];

export function AskAI() {
  return (
    <section className="py-24 md:py-32 border-t border-rule">
      <div className="max-w-[820px] mx-auto px-6 md:px-10 text-center">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-6">
          {askAI.eyebrow}
        </div>

        <h2 className="font-display font-semibold text-[40px] md:text-[64px] leading-[0.95] tracking-tightest">
          <span className="block text-ink">{askAI.headline.line1}</span>
          <span className="block text-ink3 italic">
            Ask <em className="italic-spark">the AI</em>.
          </span>
        </h2>

        <p className="text-ink2 text-[15px] mt-6 max-w-[480px] mx-auto">
          {askAI.body}
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {buttons.map(({ label, href, Icon, className }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'px-5 py-3 rounded-md border text-[14px] font-medium transition-all duration-150 flex items-center gap-2',
                className,
              ].join(' ')}
            >
              <Icon size={16} aria-hidden />
              {label}
            </a>
          ))}
        </div>

        <p className="text-ink3 italic text-[13px] mt-8">{askAI.footnote}</p>
      </div>
    </section>
  );
}
