'use client';

import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   CodeBlock, dev-grade snippet shell:
     · macOS-style window chrome (red/yellow/green dots)
     · filename + language tag in the header
     · copy-to-clipboard with success feedback
     · line numbers
     · light syntax highlighting (strings / comments / keywords / numbers)
────────────────────────────────────────────────────────────────────────── */

const TOKEN_RE =
  /("[^"\n]*"|'[^'\n]*'|`[^`\n]*`|\/\/[^\n]*|#[^\n"'`]*|\b(?:await|async|import|from|const|let|var|function|if|else|return|export|new|class|interface|type|true|false|null|undefined|of|in)\b|\b\d+(?:\.\d+)?\b)/g;

function highlight(code: string): ReactNode {
  const out: ReactNode[] = [];
  let lastIdx = 0;
  let key = 0;
  for (const m of code.matchAll(TOKEN_RE)) {
    const idx = m.index ?? 0;
    if (idx > lastIdx) out.push(code.slice(lastIdx, idx));
    const t = m[0];
    let cls = '';
    if (t.startsWith('//') || t.startsWith('#')) cls = 'text-ink3 italic';
    else if (t.startsWith('"') || t.startsWith("'") || t.startsWith('`')) cls = 'text-spark';
    else if (/^\d/.test(t)) cls = 'text-spark';
    else cls = 'text-highlight font-medium';
    out.push(
      <span key={key++} className={cls}>
        {t}
      </span>,
    );
    lastIdx = idx + t.length;
  }
  if (lastIdx < code.length) out.push(code.slice(lastIdx));
  return out;
}

type Props = {
  code: string;
  language?: string;     // 'ts' | 'tsx' | 'js' | 'sh' | 'py' …
  filename?: string;
  /** Hide line numbers (default false). */
  hideLineNumbers?: boolean;
};

export function CodeBlock({ code, language = 'ts', filename, hideLineNumbers }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available, silently fail */
    }
  }

  const lines = code.split('\n');

  return (
    <div className="bg-bg border border-rule2 rounded-md overflow-hidden font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-rule2 bg-surface/40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5 shrink-0" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-fail/55" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow/55" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/55" />
          </div>
          {filename && (
            <span className="text-[11px] text-ink2 truncate">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] uppercase tracking-eyebrow text-ink3">
            {language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-eyebrow text-ink3 hover:text-ink hover:bg-bg/60 transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} className="text-success" />
                <span className="text-success">copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex text-[12.5px] leading-[1.7]">
          {!hideLineNumbers && (
            <div
              aria-hidden
              className="select-none text-ink3/70 text-right py-4 pl-4 pr-3 border-r border-rule2/50 tabular-nums"
            >
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <pre className="py-4 pl-4 pr-5 flex-1 whitespace-pre text-ink">
            <code>{highlight(code)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
