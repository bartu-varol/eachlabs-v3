'use client';

import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';

/* ──────────────────────────────────────────────────────────────────────────
   EnhancerHowTo, "30 seconds to wire up prompt enhance" section.

     ① Enhance prompt         , one flag on the each() call
     ② Choose what's caught   , list of policy categories the enhancer handles
     ③ Read the prompt trace  , original + rewritten side by side
────────────────────────────────────────────────────────────────────────── */

const POLICIES = [
  { key: 'brand_ip',           title: 'brand_ip',           body: 'Trademarked names, logos, products' },
  { key: 'realistic_person',   title: 'realistic_person',   body: 'Celebrities, public figures, likeness' },
  { key: 'violence_explicit',  title: 'violence_explicit',  body: 'Gore, weapons in detail, graphic injury' },
  { key: 'nsfw_borderline',    title: 'nsfw_borderline',    body: 'Suggestive descriptions; not explicit' },
  { key: 'copyrighted_work',   title: 'copyrighted_work',   body: 'Specific characters, films, books' },
];

export function EnhancerHowTo() {
  return (
    <section className="container border-t border-divider py-20 md:py-24">
      <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        One flag. Five policies. Every refusal saved.
      </h2>
      <p className="text-ink-muted text-body-lg leading-[1.65] max-w-[640px] mt-6">
        Add <Code>enhance.prompt: true</Code> to any each() call. The enhancer
        watches the policy verdict, rewrites only when it would have failed, and
        stamps the trace so you can audit what was changed.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-divider border border-divider rounded-md overflow-hidden mt-12">
        {/* Step 1 */}
        <Step n="01" title="Enhance prompt" delay={0}>
          <p className="text-ink-muted text-body-sm leading-[1.6]">
            One flag on your existing each() call. No SDK swap, no separate endpoint.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('await '), v('each('), o('{')] },
              { indent: 2, tokens: [p('model: '), s('"nano-banana-2"'), o(',')] },
              { indent: 2, tokens: [p('inputs: '), o('{ '), p('prompt: '), p('user.prompt'), o(' },')] },
              { indent: 2, tokens: [p('enhance: '), o('{')] },
              { indent: 4, tokens: [p('prompt: '), s('true'), o(',')], highlight: true },
              { indent: 4, tokens: [p('intent_priority: '), s('"preserve"'), o(',')] },
              { indent: 2, tokens: [o('}')] },
              { tokens: [v('})')] },
            ]}
          />
          <div className="flex flex-col gap-1.5 mt-1">
            <Bullet text="Default off, opt in per call." />
            <Bullet text="Bills only when the enhancer actually fires." />
            <Bullet text={`Pass <code class="font-mono text-brand">intent_priority: "preserve"</code> to lock the user&rsquo;s meaning.`} />
          </div>
        </Step>

        {/* Step 2 */}
        <Step n="02" title="What gets caught" delay={0.1}>
          <p className="text-ink-muted text-body-sm leading-[1.6]">
            The enhancer adapts to each provider’s policy table. These are the
            categories it learns to swap automatically.
          </p>
          <div className="flex flex-col gap-1.5 mt-1">
            {POLICIES.map((pol) => (
              <PolicyPill key={pol.key} title={pol.title} body={pol.body} />
            ))}
          </div>
        </Step>

        {/* Step 3 */}
        <Step n="03" title="Read the prompt trace" delay={0.2}>
          <p className="text-ink-muted text-body-sm leading-[1.6]">
            Every enhanced call carries a <Code>trace.enhancer</Code> block, the
            original, the rewritten, what got rejected, and the recheck verdict.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('const '), p('e '), o('= '), p('result.trace.enhancer')] },
              { tokens: [c('// e = {')] },
              { indent: 2, tokens: [c('//   enhanced:  true,')] },
              { indent: 2, tokens: [c('//   rejected:  "brand_ip",')], highlight: true },
              { indent: 2, tokens: [c('//   original:  "...looks like Red Bull...",')] },
              { indent: 2, tokens: [c('//   rewritten: "...vibrant blue and silver...",')], highlight: true },
              { indent: 2, tokens: [c('//   recheck:   "passed",')] },
              { indent: 2, tokens: [c('//   ms:        156')] },
              { tokens: [c('// }')] },
            ]}
          />
        </Step>
      </div>
    </section>
  );
}

/* ── Step shell ─────────────────────────────────────────────────────────── */

function Step({
  n,
  title,
  delay,
  children,
}: {
  n: string;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.36, delay }}
      className="bg-surface-raised p-6 md:p-7 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-eyebrow tabular-nums text-brand">{n}</span>
        <Eyebrow as="span" size="sm" tone="ink-faint">STEP</Eyebrow>
      </div>
      <h3 className="font-sans font-semibold text-h4 text-ink leading-snug">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

/* ── Inline <code> for prose ────────────────────────────────────────────── */

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-caption text-brand bg-surface/60 border border-field rounded px-1 py-[1px]">
      {children}
    </code>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 px-2 py-1">
      <span className="text-brand mt-[2px]" aria-hidden>
        ›
      </span>
      <span
        className="text-ink-muted text-caption leading-[1.55]"
        // text may include inline <code>, keep simple by using innerHTML
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

function PolicyPill({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-baseline gap-2 px-3 py-2 border border-field rounded-md bg-surface">
      <span className="font-mono text-eyebrow text-brand whitespace-nowrap">{title}</span>
      <span className="text-ink-muted text-caption leading-[1.5]">{body}</span>
    </div>
  );
}

/* ── Mini code block ────────────────────────────────────────────────────── */

type Token = { text: string; cls: string };
type Line = { tokens: Token[]; indent?: number; highlight?: boolean };

function CodeMini({ lines }: { lines: Line[] }) {
  return (
    <div className="bg-surface border border-field rounded-md font-mono text-eyebrow leading-[1.7] overflow-x-auto no-scrollbar">
      <div className="px-3 py-3">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.22, delay: 0.05 * i }}
            className={`flex items-baseline gap-0 whitespace-pre ${
              line.highlight ? 'bg-brand/[0.06] -mx-3 px-3 rounded-sm' : ''
            }`}
          >
            <span className="text-ink-faint/60 mr-3 select-none tabular-nums w-3 text-right">
              {i + 1}
            </span>
            {line.indent ? <span>{' '.repeat(line.indent)}</span> : null}
            {line.tokens.map((t, j) => (
              <span key={j} className={t.cls}>
                {t.text}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Token helpers
const k = (text: string): Token => ({ text, cls: 'text-cobrand font-medium' });
const p = (text: string): Token => ({ text, cls: 'text-ink-muted' });
const s = (text: string): Token => ({ text, cls: 'text-brand' });
const o = (text: string): Token => ({ text, cls: 'text-ink-muted' });
const c = (text: string): Token => ({ text, cls: 'text-ink-faint' });
const v = (text: string): Token => ({ text, cls: 'text-ink' });
