'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Copy, Download, ExternalLink, MessageSquare, Sparkles, Check } from 'lucide-react';

type Props = {
  /**
   * Either the model slug (legacy / default, derives the URL under
   * /ai-models/{slug}) or an explicit `llmsUrl` for provider + family pages.
   */
  modelSlug?: string;
  /** Optional override, e.g. https://www.eachlabs.ai/kling/llms.txt. */
  llmsUrl?: string;
  /** Friendly label used for the menu aria-label + the download filename. */
  modelName?: string;
  /** Filename base for downloads, defaults to a slug derived from llmsUrl/modelSlug. */
  downloadName?: string;
};

const LEGACY_BASE = 'https://www.eachlabs.ai/ai-models';

export function AiAssistantMenu({ modelSlug, llmsUrl, modelName, downloadName }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const url = llmsUrl ?? (modelSlug ? `${LEGACY_BASE}/${modelSlug}/llms.txt` : `${LEGACY_BASE}/llms.txt`);
  const dlBase = downloadName ?? modelSlug ?? url.split('/').filter(Boolean).slice(-2, -1)[0] ?? 'eachlabs';
  const promptText = `How can I run this eachlabs.ai resource as an API in my app ${url}`;

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function handleCopy() {
    try {
      const res = await fetch(url);
      const content = res.ok ? await res.text() : url;
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      } catch {
        /* clipboard not available */
      }
    }
  }

  function handleDownload() {
    const link = document.createElement('a');
    link.href = `${url}?download=1`;
    link.download = `${dlBase}-llms.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  }

  function handleOpen() {
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  function handleClaude() {
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(promptText)}`,
      '_blank',
      'noopener,noreferrer',
    );
    setOpen(false);
  }

  function handleChatGPT() {
    window.open(
      `https://chat.openai.com/?q=${encodeURIComponent(promptText)}`,
      '_blank',
      'noopener,noreferrer',
    );
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-body-sm font-medium border border-field bg-surface text-ink hover:bg-surface-raised transition-colors"
      >
        <Sparkles size={14} className="text-brand" />
        <span>AI Assistant</span>
        <ChevronDown
          size={14}
          className={`text-ink-faint transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={modelName ? `AI Assistant for ${modelName}` : 'AI Assistant'}
          className="absolute right-0 top-full mt-2 w-60 z-30 rounded-md border border-field bg-surface shadow-[0_12px_32px_-12px_rgba(0,0,0,0.35)] overflow-hidden animate-panel-in"
        >
          <div className="px-3 py-2 font-mono text-micro uppercase tracking-eyebrow text-ink-faint border-b border-field/60">
            AI Integration Help
          </div>
          <MenuItem icon={copied ? Check : Copy} onClick={handleCopy} highlight={copied}>
            {copied ? 'Copied!' : 'Copy llms.txt'}
          </MenuItem>
          <MenuItem icon={Download} onClick={handleDownload}>
            Download llms.txt
          </MenuItem>
          <MenuItem icon={ExternalLink} onClick={handleOpen}>
            Open llms.txt
          </MenuItem>
          <div className="border-t border-field/60" />
          <MenuItem icon={MessageSquare} onClick={handleClaude}>
            Build with Claude
          </MenuItem>
          <MenuItem icon={MessageSquare} onClick={handleChatGPT}>
            Build with ChatGPT
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon: Icon,
  onClick,
  children,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-body-sm text-ink hover:bg-surface-raised transition-colors text-left"
    >
      <Icon size={14} className={highlight ? 'text-ok' : 'text-ink-muted'} />
      <span>{children}</span>
    </button>
  );
}
