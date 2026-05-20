'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, ArrowUp } from 'lucide-react';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Props = {
  modelTitle: string;
  modelSlug: string;
  fullWidth?: boolean;
};

function buildSuggestions(title: string): string[] {
  return [
    `What does ${title} do best?`,
    'Show me an example input',
    'When should I use this vs alternatives?',
    'How is it priced?',
  ];
}

export function AskAiPanel({ modelTitle, modelSlug, fullWidth = false }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const labelId = useId();
  const suggestions = buildSuggestions(modelTitle);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => textareaRef.current?.focus(), 100);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const q = value.trim();
    if (!q) return;
    setThinking(true);
    setAnswer(null);
    window.setTimeout(() => {
      setThinking(false);
      setAnswer(
        `each::sense will answer questions about ${modelTitle} here. We're wiring up the live agent, your question (“${q}”) will route to the right docs section in production.`,
      );
    }, 700);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md text-body font-medium border border-field text-ink bg-surface hover:bg-surface-raised transition-colors ${
          fullWidth ? 'w-full' : 'whitespace-nowrap'
        }`}
      >
        <Sparkles size={14} className="text-brand" />
        <span>Ask AI</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
          >
            <button
              type="button"
              aria-label="Close panel"
              onClick={() => setOpen(false)}
              className="flex-1 bg-ink/30 backdrop-blur-sm"
            />
            <motion.aside
              className="w-full sm:max-w-[440px] bg-surface border-l border-field flex flex-col h-full shadow-[0_0_40px_-10px_rgb(0,0,0,0.4)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            >
              <header className="px-5 py-4 border-b border-field flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-brand" />
                    <span
                      id={labelId}
                      className="font-mono text-eyebrow uppercase tracking-eyebrow text-ink-muted"
                    >
                      Ask AI
                    </span>
                  </div>
                  <p className="text-body-sm text-ink mt-1 font-medium">{modelTitle}</p>
                  <p className="text-caption text-ink-faint mt-0.5">
                    Powered by each::sense (demo)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-ink-faint hover:text-ink p-1 -m-1 transition-colors"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                <div>
                  <Eyebrow size="sm" tone="ink-faint" className="mb-2">Try asking</Eyebrow>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setValue(s);
                          textareaRef.current?.focus();
                        }}
                        className="font-mono text-eyebrow text-ink-muted bg-surface-raised border border-field rounded-full px-3 py-1.5 hover:border-ink/40 hover:text-ink transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {(thinking || answer) && (
                  <div className="border border-field rounded-md p-4 bg-surface-raised/40">
                    {thinking ? (
                      <div className="flex items-center gap-2 text-body-sm text-ink-muted">
                        <span className="inline-flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"
                            style={{ animationDelay: '120ms' }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"
                            style={{ animationDelay: '240ms' }}
                          />
                        </span>
                        <span>thinking…</span>
                      </div>
                    ) : (
                      <p className="text-body-sm text-ink leading-[1.55]">{answer}</p>
                    )}
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="border-t border-field p-3 bg-surface-raised/30"
              >
                <div className="flex items-end gap-2 bg-surface border border-field rounded-md p-2 focus-within:border-ink/40 transition-colors">
                  <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    placeholder={`Ask anything about ${modelSlug}…`}
                    rows={1}
                    className="flex-1 bg-transparent text-body text-ink placeholder:text-ink-faint resize-none outline-none py-1.5 min-h-[24px] max-h-[120px]"
                  />
                  <button
                    type="submit"
                    disabled={!value.trim() || thinking}
                    aria-label="Send question"
                    className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md bg-brand text-on-brand hover:bg-brand-deep disabled:opacity-40 disabled:hover:bg-brand transition-colors"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
                <p className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mt-2 px-1">
                  Enter to send · Shift+Enter for newline · Esc to close
                </p>
              </form>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
