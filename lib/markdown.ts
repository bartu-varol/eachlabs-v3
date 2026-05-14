/**
 * Tiny markdown→HTML converter. Handles only what our DB content needs:
 *  - # / ## / ### headings
 *  - paragraphs separated by blank lines
 *  - - / * unordered lists
 *  - **bold**, *italic*
 *  - ```lang fenced code blocks``` → block-level <pre><code>
 *  - `inline code`
 *  - [text](url) links
 *  - autolinking of raw http(s) URLs
 *
 * NOT a general-purpose parser. Content comes from a trusted source (our DB),
 * so we don't sanitize; angle brackets are escaped to prevent accidental HTML.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inline(s: string): string {
  let out = escapeHtml(s);
  // Inline code first so its content is not further parsed.
  out = out.replace(/`([^`]+?)`/g, '<code>$1</code>');
  // Bold + italic
  out = out.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
  // Markdown links
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  );
  return out;
}

type Block =
  | { kind: 'h'; level: 2 | 3 | 4; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'code'; lang: string; text: string };

function tokenize(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // Fenced code block (```lang … ```). Preserve raw lines so indentation
    // and blank lines inside the block survive untouched.
    const fence = /^```\s*([\w-]*)\s*$/.exec(line);
    if (fence) {
      const lang = fence[1] || '';
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i].trim())) {
        body.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing fence
      blocks.push({ kind: 'code', lang, text: body.join('\n') });
      continue;
    }

    if (!line) {
      i++;
      continue;
    }

    // Heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      // Map: # → h2 (h1 reserved for the page), ## → h3, ### → h4
      const level = Math.min(4, Math.max(2, h[1].length + 1)) as 2 | 3 | 4;
      blocks.push({ kind: 'h', level, text: h[2].trim() });
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ kind: 'ul', items });
      continue;
    }

    // Paragraph (accumulate until blank line / next block)
    const para: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^#{1,6}\s+/.test(lines[i].trim()) &&
      !/^```/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: 'p', text: para.join(' ') });
  }

  return blocks;
}

export function mdToHtml(md: string | null | undefined): string {
  if (!md) return '';
  const blocks = tokenize(md);
  return blocks
    .map((b) => {
      if (b.kind === 'h') return `<h${b.level}>${inline(b.text)}</h${b.level}>`;
      if (b.kind === 'p') return `<p>${inline(b.text)}</p>`;
      if (b.kind === 'code') {
        const langAttr = b.lang ? ` data-lang="${escapeHtml(b.lang)}"` : '';
        return `<pre${langAttr}><code>${escapeHtml(b.text)}</code></pre>`;
      }
      return `<ul>${b.items.map((it) => `<li>${inline(it)}</li>`).join('')}</ul>`;
    })
    .join('\n');
}
