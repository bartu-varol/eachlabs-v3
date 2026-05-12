'use client';

import { motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   InternalExamples — 6 concrete internal-AI tools, each with a real input,
   an animated mock output, and the each::xxx pieces wiring it up. Different
   from consumer/retail in tone: text-heavy, IT-friendly, calm animations.
────────────────────────────────────────────────────────────────────────── */

type Example = {
  app: string;
  team: string;
  tagline: string;
  input: { kind: 'chat' | 'audio' | 'question' | 'bullets' | 'commits' | 'role'; label: string };
  output: { kind: 'draft' | 'summary' | 'cited' | 'slides' | 'changelog' | 'locales'; label: string };
  pieces: string[];
};

const EXAMPLES: Example[] = [
  {
    app: 'support-draft-bot',
    team: 'customer success',
    tagline: 'Slack thread → draft response in your brand voice. Agent reviews and sends.',
    input:  { kind: 'chat',     label: 'customer message' },
    output: { kind: 'draft',    label: 'tone-matched draft' },
    pieces: ['each::workflows', 'each::enhancer', 'each::trace'],
  },
  {
    app: 'sales-summary-bot',
    team: 'sales',
    tagline: 'Meeting recording → CRM-ready summary + action items pushed to Salesforce.',
    input:  { kind: 'audio',    label: '34-min recording' },
    output: { kind: 'summary',  label: 'summary · 3 actions' },
    pieces: ['each::workflows', 'each::router', 'each::trace'],
  },
  {
    app: 'hr-policy-qa',
    team: 'people',
    tagline: 'Employee question → cited answer from your HR docs. Audit-logged per ask.',
    input:  { kind: 'question', label: '"parental leave?"' },
    output: { kind: 'cited',    label: 'answer · 2 citations' },
    pieces: ['each::workflows', 'each::trace', 'each::attributes'],
  },
  {
    app: 'slide-formatter',
    team: 'exec',
    tagline: 'Bullet list → branded deck section. Brand voice + visual style locked.',
    input:  { kind: 'bullets',  label: '6 bullet points' },
    output: { kind: 'slides',   label: '4 branded slides' },
    pieces: ['each::workflows', 'each::enhancer'],
  },
  {
    app: 'eng-changelog-ai',
    team: 'engineering',
    tagline: 'Git commits → human-readable release notes. Group by user-facing impact.',
    input:  { kind: 'commits',  label: '38 commits' },
    output: { kind: 'changelog',label: 'release notes' },
    pieces: ['each::workflows', 'each::trace'],
  },
  {
    app: 'onboarding-localizer',
    team: 'people ops',
    tagline: 'Role doc → 12-language training pack. New-hire ready by Monday.',
    input:  { kind: 'role',     label: 'role: backend-eng' },
    output: { kind: 'locales',  label: '12 locales · ready' },
    pieces: ['each::workflows', 'each::attributes', 'each::trace'],
  },
];

export function InternalExamples() {
  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● EXAMPLES · YOUR INTERNAL TOOLS
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        Six tools your platform team didn&rsquo;t have to build.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        Real internal apps shipped on each::labs — Slack bots, web tools, CLI
        helpers — every one sharing the same auth, the same audit, the same
        cost view. No ML platform team required.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-12">
        {EXAMPLES.map((ex, i) => (
          <ExampleCard key={ex.app} ex={ex} idx={i} />
        ))}
      </div>
    </section>
  );
}

function ExampleCard({ ex, idx }: { ex: Example; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.36, delay: (idx % 3) * 0.05 }}
      className="bg-surface border border-rule2 rounded-md p-5 md:p-6 flex flex-col gap-4 hover:border-spark/40 transition-colors"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-eyebrow text-spark">
            ◐ internal tool
          </span>
          <span className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
            {ex.team}
          </span>
        </div>
        <h3 className="font-display font-semibold text-[18px] text-ink leading-snug font-mono">
          {ex.app}
        </h3>
        <p className="text-ink2 text-[12.5px] leading-[1.55] mt-2">{ex.tagline}</p>
      </div>

      <div className="grid grid-cols-[1fr_auto_1.2fr] gap-2 items-stretch">
        <InputPanel kind={ex.input.kind} label={ex.input.label} />
        <Arrow />
        <OutputPanel kind={ex.output.kind} label={ex.output.label} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {ex.pieces.map((p) => (
          <PieceTag key={p} name={p} />
        ))}
      </div>
    </motion.div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center px-1">
      <motion.span
        className="text-spark text-[16px]"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        aria-hidden
      >
        →
      </motion.span>
    </div>
  );
}

/* ── Input panels ───────────────────────────────────────────────────────── */

function InputPanel({ kind, label }: { kind: Example['input']['kind']; label: string }) {
  return (
    <div className="bg-bg border border-rule2 rounded-md px-2 py-2 flex flex-col gap-1.5 min-h-[88px] justify-center">
      <div className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">input</div>
      <div className="flex-1 flex items-center justify-center">
        {kind === 'chat'     && <ChatInput />}
        {kind === 'audio'    && <AudioInput />}
        {kind === 'question' && <QuestionInput label={label} />}
        {kind === 'bullets'  && <BulletsInput />}
        {kind === 'commits'  && <CommitsInput />}
        {kind === 'role'     && <RoleInput label={label} />}
      </div>
      {kind !== 'question' && kind !== 'role' && (
        <div className="font-mono text-[9px] text-ink2 text-center truncate">{label}</div>
      )}
    </div>
  );
}

function ChatInput() {
  return (
    <div className="w-full flex flex-col gap-1">
      <div className="bg-surface2 rounded h-2.5" style={{ width: '70%' }} />
      <div className="bg-surface2 rounded h-2.5" style={{ width: '50%' }} />
      <div className="bg-surface2 rounded h-2.5" style={{ width: '60%' }} />
    </div>
  );
}

function AudioInput() {
  const BARS = [40, 70, 55, 80, 60, 75, 50, 85];
  return (
    <div className="flex items-end gap-[2px] h-7">
      {BARS.map((h, i) => (
        <motion.span
          key={i}
          className="block bg-ink3/45 rounded-sm"
          style={{ width: '3px' }}
          animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.5}%`] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.06 }}
        />
      ))}
    </div>
  );
}

function QuestionInput({ label }: { label: string }) {
  return (
    <div className="font-mono text-[10px] text-ink leading-tight px-1 italic w-full text-center">
      {label}
      <motion.span
        className="inline-block w-[5px] h-[10px] bg-spark align-middle ml-0.5"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        aria-hidden
      />
    </div>
  );
}

function BulletsInput() {
  return (
    <div className="w-full flex flex-col gap-[3px]">
      {[80, 65, 75, 55, 70].map((w, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-ink3" aria-hidden />
          <div className="bg-surface2 rounded h-1.5" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}

function CommitsInput() {
  return (
    <div className="w-full flex flex-col gap-[3px] font-mono text-[8.5px]">
      <div className="flex items-center gap-1">
        <span className="text-spark">▸</span>
        <span className="text-ink3 truncate">7f2a feat: oauth flow</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-spark">▸</span>
        <span className="text-ink3 truncate">34dd fix: cache miss</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-spark">▸</span>
        <span className="text-ink3 truncate">e1c8 chore: bump</span>
      </div>
    </div>
  );
}

function RoleInput({ label }: { label: string }) {
  return (
    <div className="w-full bg-surface2 border border-rule2 rounded p-2 font-mono text-[10px] text-center text-ink">
      {label}
    </div>
  );
}

/* ── Output panels ──────────────────────────────────────────────────────── */

function OutputPanel({ kind, label }: { kind: Example['output']['kind']; label: string }) {
  return (
    <div className="bg-bg border border-rule2 rounded-md px-2 py-2 flex flex-col gap-1.5 min-h-[88px] justify-center">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3">
          output
        </span>
        <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark truncate ml-1">
          {label}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {kind === 'draft'     && <DraftOutput />}
        {kind === 'summary'   && <SummaryOutput />}
        {kind === 'cited'     && <CitedOutput />}
        {kind === 'slides'    && <SlidesOutput />}
        {kind === 'changelog' && <ChangelogOutput />}
        {kind === 'locales'   && <LocalesOutput />}
      </div>
    </div>
  );
}

function DraftOutput() {
  return (
    <div className="w-full flex flex-col gap-1">
      {[88, 75, 92, 68].map((w, i) => (
        <motion.div
          key={i}
          className="bg-spark/55 rounded h-1.5"
          initial={{ width: 0 }}
          whileInView={{ width: `${w}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
        />
      ))}
    </div>
  );
}

function SummaryOutput() {
  return (
    <div className="w-full flex flex-col gap-[3px]">
      {['summary', '✓ action 1', '✓ action 2', '✓ action 3'].map((text, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -3 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
          className="flex items-center gap-1 font-mono text-[9px]"
        >
          {i === 0 ? (
            <span className="text-ink2">{text}</span>
          ) : (
            <span className="text-success">{text}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function CitedOutput() {
  return (
    <div className="w-full flex flex-col gap-1">
      {[90, 78].map((w, i) => (
        <motion.div
          key={i}
          className="bg-spark/55 rounded h-1.5"
          initial={{ width: 0 }}
          whileInView={{ width: `${w}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
        />
      ))}
      <div className="flex items-center gap-1 font-mono text-[8px] mt-0.5">
        <span className="text-highlight border border-highlight/45 bg-highlight/[0.06] rounded px-1">
          [hr-doc-v3]
        </span>
        <span className="text-highlight border border-highlight/45 bg-highlight/[0.06] rounded px-1">
          [policy-2024]
        </span>
      </div>
    </div>
  );
}

function SlidesOutput() {
  return (
    <div className="w-full grid grid-cols-2 gap-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="aspect-[4/3] rounded-sm bg-spark/45 border border-spark/35 flex items-center px-1"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
        >
          <span className="font-mono text-[7.5px] text-bg/90 uppercase tracking-eyebrow">
            v{i + 1}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function ChangelogOutput() {
  return (
    <div className="w-full flex flex-col gap-[3px] font-mono text-[8.5px]">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-spark">
        ## v3.4.0
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.18 }} className="text-ink2">
        ### added
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.26 }} className="text-ink3 truncate">
        - oauth flow for partners
      </motion.div>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.34 }} className="text-ink3 truncate">
        - cache miss fix
      </motion.div>
    </div>
  );
}

function LocalesOutput() {
  const codes = ['EN', 'TR', 'DE', 'JP', 'KR', 'FR', 'ES', 'IT', 'ZH', 'BR', 'AR', 'IN'];
  return (
    <div className="w-full grid grid-cols-4 grid-rows-3 gap-[2px]">
      {codes.map((code, i) => (
        <motion.div
          key={code}
          className="bg-spark/15 border border-spark/40 rounded-sm flex items-center justify-center aspect-[3/2]"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.05 + i * 0.03 }}
        >
          <span className="font-mono text-[7.5px] text-spark">{code}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Piece tag ──────────────────────────────────────────────────────────── */

function PieceTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[10px] text-ink2 border border-rule2 bg-bg rounded px-1.5 py-[3px]">
      <EachLabel name={name} />
    </span>
  );
}
