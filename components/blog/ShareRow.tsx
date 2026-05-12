'use client';

import { useState } from 'react';
import { Check, Copy, Linkedin, Twitter } from 'lucide-react';

type Props = { title: string; slug: string };

export function ShareRow({ title, slug }: Props) {
  const [copied, setCopied] = useState(false);

  function url(): string {
    if (typeof window === 'undefined') return `https://www.eachlabs.ai/blog/${slug}`;
    return `${window.location.origin}/blog/${slug}`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Silent fail — clipboard may be unavailable.
    }
  }

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url());

  return (
    <div className="border border-rule2 rounded-md p-5 bg-surface/40">
      <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 mb-3">
        Share
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Twitter"
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-rule2 bg-surface text-ink2 hover:text-ink hover:border-ink/30 transition-colors"
        >
          <Twitter size={15} strokeWidth={1.7} />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-rule2 bg-surface text-ink2 hover:text-ink hover:border-ink/30 transition-colors"
        >
          <Linkedin size={15} strokeWidth={1.7} />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-rule2 bg-surface text-ink2 hover:text-ink hover:border-ink/30 transition-colors"
        >
          {copied ? <Check size={15} className="text-spark" /> : <Copy size={15} strokeWidth={1.7} />}
        </button>
        {copied && (
          <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-spark ml-1">
            copied
          </span>
        )}
      </div>
    </div>
  );
}
