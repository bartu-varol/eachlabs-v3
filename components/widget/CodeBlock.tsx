import { Fragment } from 'react';

type Token = { kind: 'cmt' | 'str' | 'num' | 'kw' | 'fn' | 'prop' | 'punct' | 'plain'; text: string };

const KEYWORDS = new Set([
  'await', 'async', 'function', 'return', 'const', 'let', 'var',
  'if', 'else', 'true', 'false', 'null', 'undefined', 'new',
]);

/**
 * Tiny JS-ish tokenizer just sufficient for the widget snippets.
 * Recognizes line comments, double-quoted strings, numbers, keywords,
 * function calls (foo(), foo.bar()), property names, and punctuation.
 */
function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);

    // line comment
    const cmt = rest.match(/^\/\/[^\n]*/);
    if (cmt) { out.push({ kind: 'cmt', text: cmt[0] }); i += cmt[0].length; continue; }

    // string (double or single)
    const str = rest.match(/^"(?:\\.|[^"\\])*"|^'(?:\\.|[^'\\])*'/);
    if (str) { out.push({ kind: 'str', text: str[0] }); i += str[0].length; continue; }

    // number
    const num = rest.match(/^\d+(?:\.\d+)?/);
    if (num) { out.push({ kind: 'num', text: num[0] }); i += num[0].length; continue; }

    // identifier / keyword / function-call / property
    const id = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
    if (id) {
      const word = id[0];
      const next = src[i + word.length];
      // function call: identifier followed by ( (with optional spaces)
      const lookahead = src.slice(i + word.length).match(/^\s*\(/);
      let kind: Token['kind'] = 'plain';
      if (KEYWORDS.has(word))      kind = 'kw';
      else if (lookahead)          kind = 'fn';
      else if (next === ':')       kind = 'prop';
      out.push({ kind, text: word });
      i += word.length;
      continue;
    }

    // whitespace
    const ws = rest.match(/^\s+/);
    if (ws) { out.push({ kind: 'plain', text: ws[0] }); i += ws[0].length; continue; }

    // punctuation / single char
    out.push({ kind: 'punct', text: src[i] });
    i += 1;
  }
  return out;
}

const classOf: Record<Token['kind'], string> = {
  cmt:   'tk-cmt',
  str:   'tk-str',
  num:   'tk-num',
  kw:    'tk-key',
  fn:    'tk-fn',
  prop:  'tk-prop',
  punct: 'tk-punct',
  plain: '',
};

type Props = { code: string; className?: string };

export function CodeBlock({ code, className = '' }: Props) {
  const tokens = tokenize(code);
  return (
    <pre className={`snippet bg-bg border border-rule2 rounded-md p-4 overflow-x-auto ${className}`}>
      <code>
        {tokens.map((tok, i) => {
          const cls = classOf[tok.kind];
          return cls ? (
            <span key={i} className={cls}>{tok.text}</span>
          ) : (
            <Fragment key={i}>{tok.text}</Fragment>
          );
        })}
      </code>
    </pre>
  );
}
