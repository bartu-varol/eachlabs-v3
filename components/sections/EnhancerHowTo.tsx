'use client';

import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   EnhancerHowTo — "30 seconds to wire up rescue" section.

     ① Enable rescue           — one flag on the each.run() call
     ② Choose what's caught    — list of policy categories the rescuer handles
     ③ Read the rescue trace   — original + rewritten side by side
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
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● HOW TO USE IT · 30 SECONDS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        One flag. Five policies. Every refusal saved.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Add <Code>enhance.rescue: true</Code> to any each.run() call. The rescuer
        watches the policy verdict, rewrites only when it would have failed, and
        stamps the trace so you can audit what was changed.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rule border border-rule rounded-md overflow-hidden mt-12">
        {/* Step 1 */}
        <Step n="01" title="Enable rescue" delay={0}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            One flag on your existing each.run(). No SDK swap, no separate endpoint.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('await '), v('each.run('), o('{')] },
              { indent: 2, tokens: [p('model: '), s('"kling-v3-12v"'), o(',')] },
              { indent: 2, tokens: [p('inputs: '), o('{ '), p('prompt: '), p('user.prompt'), o(' },')] },
              { indent: 2, tokens: [p('enhance: '), o('{')] },
              { indent: 4, tokens: [p('rescue: '), s('true'), o(',')], highlight: true },
              { indent: 4, tokens: [p('intent_priority: '), s('"preserve"'), o(',')] },
              { indent: 2, tokens: [o('}')] },
              { tokens: [v('})')] },
            ]}
          />
          <div className="flex flex-col gap-1.5 mt-1">
            <Bullet text="Default off — opt in per call." />
            <Bullet text="Bills only when an actual rescue fires." />
            <Bullet text={`Pass <code class="font-mono text-spark">intent_priority: "preserve"</code> to lock the user&rsquo;s meaning.`} />
          </div>
        </Step>

        {/* Step 2 */}
        <Step n="02" title="What gets caught" delay={0.1}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            The rescuer adapts to each provider’s policy table. These are the
            categories it learns to swap automatically.
          </p>
          <div className="flex flex-col gap-1.5 mt-1">
            {POLICIES.map((pol) => (
              <PolicyPill key={pol.key} title={pol.title} body={pol.body} />
            ))}
          </div>
        </Step>

        {/* Step 3 */}
        <Step n="03" title="Read the rescue trace" delay={0.2}>
          <p className="text-ink2 text-[13px] leading-[1.6]">
            Every rescued call carries a <Code>trace.enhancer</Code> block — the
            original, the rewritten, what got rejected, and the recheck verdict.
          </p>
          <CodeMini
            lines={[
              { tokens: [k('const '), p('e '), o('= '), p('result.trace.enhancer')] },
              { tokens: [c('// e = {')] },
              { indent: 2, tokens: [c('//   rescued:   true,')] },
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
      className="bg-surface p-6 md:p-7 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tabular-nums text-spark">{n}</span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          STEP
        </span>
      </div>
      <h3 className="font-display font-semibold text-[20px] text-ink leading-snug">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </motion.div>
  );
}

/* ── Inline <code> for prose ────────────────────────────────────────────── */

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[12.5px] text-spark bg-bg/60 border border-rule2 rounded px-1 py-[1px]">
      {children}
    </code>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 px-2 py-1">
      <span className="text-spark mt-[2px]" aria-hidden>
        ›
      </span>
      <span
        className="text-ink2 text-[12.5px] leading-[1.55]"
        // text may include inline <code> — keep simple by using innerHTML
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}

function PolicyPill({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-baseline gap-2 px-3 py-2 border border-rule2 rounded-md bg-bg">
      <span className="font-mono text-[11px] text-spark whitespace-nowrap">{title}</span>
      <span className="text-ink2 text-[12px] leading-[1.5]">{body}</span>
    </div>
  );
}

/* ── Mini code block ────────────────────────────────────────────────────── */

type Token = { text: string; cls: string };
type Line = { tokens: Token[]; indent?: number; highlight?: boolean };

function CodeMini({ lines }: { lines: Line[] }) {
  return (
    <div className="bg-bg border border-rule2 rounded-md font-mono text-[11.5px] leading-[1.7] overflow-x-auto no-scrollbar">
      <div className="px-3 py-3">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.22, delay: 0.05 * i }}
            className={`flex items-baseline gap-0 whitespace-pre ${
              line.highlight ? 'bg-spark/[0.06] -mx-3 px-3 rounded-sm' : ''
            }`}
          >
            <span className="text-ink3/60 mr-3 select-none tabular-nums w-3 text-right">
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
const k = (text: string): Token => ({ text, cls: 'text-highlight font-medium' });
const p = (text: string): Token => ({ text, cls: 'text-ink2' });
const s = (text: string): Token => ({ text, cls: 'text-spark' });
const o = (text: string): Token => ({ text, cls: 'text-ink2' });
const c = (text: string): Token => ({ text, cls: 'text-ink3 italic' });
const v = (text: string): Token => ({ text, cls: 'text-ink' });
