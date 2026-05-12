'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   InternalDemo — the 5-second story for /usecases/internal.

   Story: six different teams running six different internal tools, all on
   the same each.run() infrastructure. We cycle through them — one tool
   activates at a time with a small call-pulse — making the "1 SDK, 6 tools,
   shared SSO + audit" message land on first paint.

   Slower, more sober tempo than consumer/retail (~1.2s per tool, 7.2s loop)
   to match the IT/Security audience.
────────────────────────────────────────────────────────────────────────── */

type Tool = {
  id: string;
  name: string;
  team: string;
  bytesIn: string;
  bytesOut: string;
  callsToday: number;
  kind: 'chat' | 'voice' | 'doc' | 'slide' | 'log' | 'list';
};

const TOOLS: Tool[] = [
  { id: 'support-draft',     name: 'support-draft-bot',    team: 'customer success', bytesIn: '420B', bytesOut: '1.2KB', callsToday: 184, kind: 'chat'  },
  { id: 'sales-summary',     name: 'sales-summary-bot',    team: 'sales',            bytesIn: '36KB', bytesOut: '2.4KB', callsToday: 67,  kind: 'voice' },
  { id: 'hr-policy-qa',      name: 'hr-policy-qa',         team: 'people',           bytesIn: '180B', bytesOut: '880B',  callsToday: 41,  kind: 'doc'   },
  { id: 'slide-formatter',   name: 'slide-formatter',      team: 'exec',             bytesIn: '1.4KB',bytesOut: '24KB',  callsToday: 12,  kind: 'slide' },
  { id: 'eng-changelog',     name: 'eng-changelog-ai',     team: 'engineering',      bytesIn: '8KB',  bytesOut: '3.2KB', callsToday: 28,  kind: 'log'   },
  { id: 'onboarding-loc',    name: 'onboarding-localizer', team: 'people',           bytesIn: '12KB', bytesOut: '144KB', callsToday: 9,   kind: 'list'  },
];

const TOOL_DURATION = 1200;
const IDLE_BUFFER = 400;
const TOTAL_LOOP = IDLE_BUFFER + TOOLS.length * TOOL_DURATION;

export function InternalDemo() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [callsToday, setCallsToday] = useState(4218);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    function tick() {
      clearAll();
      setActiveIdx(null);
      let acc = IDLE_BUFFER;
      TOOLS.forEach((_, i) => {
        timeoutsRef.current.push(setTimeout(() => {
          setActiveIdx(i);
          // Increment the global counter when a tool fires
          setCallsToday((prev) => prev + 1);
        }, acc));
        acc += TOOL_DURATION;
      });
      timeoutsRef.current.push(setTimeout(() => setActiveIdx(null), acc));
    }

    tick();
    const id = setInterval(tick, TOTAL_LOOP);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-tr from-highlight/[0.10] via-transparent to-spark/[0.05] blur-2xl"
      />

      <div className="bg-surface border border-rule2 rounded-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-rule2 bg-bg/40">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              INTERNAL TOOLS · LIVE
            </span>
          </div>
          <ActiveLabel idx={activeIdx} />
        </div>

        {/* Top: SSO + RBAC strip */}
        <div className="px-4 md:px-5 pt-3 pb-2 border-b border-rule2 bg-bg/30 flex items-center gap-3 flex-wrap">
          <SystemTag label="SSO" sub="okta · saml" />
          <SystemTag label="RBAC" sub="per team" />
          <SystemTag label="audit" sub="every call" highlight />
          <span className="font-mono text-[9px] text-ink3 ml-auto">
            shared across all 6 tools
          </span>
        </div>

        {/* 6-tool grid */}
        <div className="px-4 md:px-5 pt-4 pb-3 grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {TOOLS.map((tool, i) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              active={activeIdx === i}
            />
          ))}
        </div>

        {/* Bottom strip — aggregate metrics */}
        <div className="border-t border-rule2 bg-bg/40 px-4 md:px-5 py-3">
          <div className="flex items-center gap-3 font-mono text-[10px] flex-wrap">
            <span className="text-ink3 uppercase tracking-eyebrow">
              today
            </span>
            <span className="text-ink tabular-nums">
              {callsToday.toLocaleString('en-US')}
            </span>
            <span className="text-ink3">calls</span>
            <span className="text-ink3">·</span>
            <span className="text-ink2">$11.42</span>
            <span className="text-ink3">total</span>
            <span className="ml-auto text-spark uppercase tracking-eyebrow">
              1 SDK · 0 infra
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 text-center lg:text-left">
        six teams · six tools · one each.run() · audit on every call
      </div>
    </div>
  );
}

/* ── Active label — shows which tool is currently calling ───────────────── */

function ActiveLabel({ idx }: { idx: number | null }) {
  const text = idx === null ? 'idle · 6 tools armed' : `↗ ${TOOLS[idx].name}`;
  const tone = idx === null ? 'text-ink3' : 'text-spark';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx ?? 'idle'}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.16 }}
        className={`font-mono text-[10px] uppercase tracking-eyebrow ${tone}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

/* ── System tag (SSO / RBAC / audit) ────────────────────────────────────── */

function SystemTag({
  label,
  sub,
  highlight,
}: {
  label: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 border rounded font-mono text-[9.5px] ${
        highlight
          ? 'border-highlight/55 bg-highlight/[0.06]'
          : 'border-rule2 bg-bg'
      }`}
    >
      <span aria-hidden className={`text-success ${highlight ? '' : ''}`}>✓</span>
      <span className={highlight ? 'text-highlight' : 'text-ink'}>{label}</span>
      <span className="text-ink3">· {sub}</span>
    </div>
  );
}

/* ── Tool card — one of the six ─────────────────────────────────────────── */

function ToolCard({ tool, active }: { tool: Tool; active: boolean }) {
  return (
    <motion.div
      animate={{
        borderColor: active ? 'rgb(var(--c-spark) / 0.55)' : 'rgb(var(--c-rule2))',
        boxShadow: active
          ? '0 0 0 1px rgb(var(--c-spark) / 0.18)'
          : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className="relative bg-bg border rounded-md p-3 flex flex-col gap-2 min-h-[120px]"
    >
      {/* Header line */}
      <div className="flex items-start justify-between gap-2">
        <ToolKindIcon kind={tool.kind} active={active} />
        <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-ink3 truncate">
          {tool.team}
        </span>
      </div>

      {/* Tool name */}
      <div className={`font-mono text-[10.5px] truncate ${active ? 'text-spark' : 'text-ink'}`}>
        {tool.name}
      </div>

      {/* Activity area */}
      <div className="flex-1 flex items-end">
        <ToolActivity kind={tool.kind} active={active} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between font-mono text-[8.5px] text-ink3">
        <span>{tool.bytesIn} → {tool.bytesOut}</span>
        <span className="tabular-nums">
          {(active ? tool.callsToday + 1 : tool.callsToday).toLocaleString('en-US')} today
        </span>
      </div>

      {/* Tiny pulse dot when active */}
      {active && (
        <motion.span
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-spark"
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          style={{ boxShadow: '0 0 5px rgb(var(--c-spark) / 0.7)' }}
          aria-hidden
        />
      )}
    </motion.div>
  );
}

/* ── Tool kind icon ─────────────────────────────────────────────────────── */

function ToolKindIcon({ kind, active }: { kind: Tool['kind']; active: boolean }) {
  const color = active ? 'rgb(var(--c-spark))' : 'rgb(var(--c-ink3))';
  return (
    <div
      className="w-7 h-7 rounded bg-surface border border-rule2 flex items-center justify-center"
      style={{ borderColor: active ? 'rgb(var(--c-spark) / 0.45)' : undefined }}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
        {kind === 'chat'  && (
          <>
            <rect x="2" y="3" width="12" height="8" rx="1.5" stroke={color} strokeWidth="1" fill="none" />
            <path d="M5 11 L4 13 L7 11" stroke={color} strokeWidth="1" fill="none" />
          </>
        )}
        {kind === 'voice' && (
          <>
            <rect x="6" y="2" width="4" height="9" rx="2" stroke={color} strokeWidth="1" fill="none" />
            <path d="M3 8 C 3 12, 13 12, 13 8 M8 12 V14" stroke={color} strokeWidth="1" fill="none" />
          </>
        )}
        {kind === 'doc' && (
          <>
            <path d="M4 2 L11 2 L13 4 L13 14 L4 14 Z" stroke={color} strokeWidth="1" fill="none" />
            <path d="M11 2 L11 4 L13 4" stroke={color} strokeWidth="1" fill="none" />
            <line x1="6" y1="7" x2="11" y2="7" stroke={color} strokeWidth="0.8" />
            <line x1="6" y1="9" x2="11" y2="9" stroke={color} strokeWidth="0.8" />
            <line x1="6" y1="11" x2="9" y2="11" stroke={color} strokeWidth="0.8" />
          </>
        )}
        {kind === 'slide' && (
          <>
            <rect x="2" y="3" width="12" height="8" rx="1" stroke={color} strokeWidth="1" fill="none" />
            <line x1="2" y1="14" x2="14" y2="14" stroke={color} strokeWidth="1" />
            <line x1="5" y1="6" x2="11" y2="6" stroke={color} strokeWidth="0.8" />
            <line x1="5" y1="8.5" x2="9" y2="8.5" stroke={color} strokeWidth="0.8" />
          </>
        )}
        {kind === 'log' && (
          <>
            <line x1="3" y1="4" x2="13" y2="4" stroke={color} strokeWidth="0.8" />
            <line x1="3" y1="7" x2="11" y2="7" stroke={color} strokeWidth="0.8" />
            <line x1="3" y1="10" x2="13" y2="10" stroke={color} strokeWidth="0.8" />
            <line x1="3" y1="13" x2="9" y2="13" stroke={color} strokeWidth="0.8" />
          </>
        )}
        {kind === 'list' && (
          <>
            <circle cx="3.5" cy="4" r="1" fill={color} />
            <line x1="6" y1="4" x2="13" y2="4" stroke={color} strokeWidth="0.8" />
            <circle cx="3.5" cy="8" r="1" fill={color} />
            <line x1="6" y1="8" x2="13" y2="8" stroke={color} strokeWidth="0.8" />
            <circle cx="3.5" cy="12" r="1" fill={color} />
            <line x1="6" y1="12" x2="13" y2="12" stroke={color} strokeWidth="0.8" />
          </>
        )}
      </svg>
    </div>
  );
}

/* ── Tool activity — small per-kind animation, only when active ─────────── */

function ToolActivity({ kind, active }: { kind: Tool['kind']; active: boolean }) {
  if (kind === 'chat') {
    return (
      <div className="w-full flex flex-col gap-1">
        <ChatLine width={70} active={active} delay={0} />
        <ChatLine width={50} active={active} delay={0.2} highlight />
        <ChatLine width={62} active={active} delay={0.4} highlight />
      </div>
    );
  }
  if (kind === 'voice') {
    const bars = [55, 70, 45, 80, 60, 50, 75, 65, 40, 85, 60, 50];
    return (
      <div className="w-full flex items-end gap-[1.5px] h-6">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 bg-ink3/40 rounded-sm"
            style={{ minWidth: 0 }}
            animate={{
              height: active ? [`${h * 0.4}%`, `${h}%`, `${h * 0.5}%`] : '20%',
              backgroundColor: active ? 'rgb(var(--c-spark))' : 'rgb(var(--c-ink3) / 0.4)',
            }}
            transition={{
              duration: 0.9, repeat: active ? Infinity : 0, delay: i * 0.04,
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'doc') {
    return (
      <div className="w-full flex flex-col gap-1">
        <DocLine width={88} active={active} delay={0} highlight />
        <DocLine width={62} active={active} delay={0.15} />
        <DocLine width={78} active={active} delay={0.3} />
      </div>
    );
  }
  if (kind === 'slide') {
    return (
      <div className="w-full grid grid-cols-2 gap-1">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="aspect-[4/3] rounded-sm"
            animate={{
              backgroundColor: active
                ? 'rgb(var(--c-spark) / 0.4)'
                : 'rgb(var(--c-ink3) / 0.18)',
              opacity: active ? [0.6, 1, 0.7] : 0.6,
            }}
            transition={{
              duration: 1.2, repeat: active ? Infinity : 0, delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'log') {
    return (
      <div className="w-full flex flex-col gap-[3px] font-mono text-[8px]">
        <LogLine code="+" text="add login flow" active={active} delay={0} />
        <LogLine code="-" text="drop legacy" active={active} delay={0.2} />
        <LogLine code="+" text="bump deps" active={active} delay={0.4} />
      </div>
    );
  }
  // list
  return (
    <div className="w-full grid grid-cols-4 gap-[3px]">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="aspect-square rounded-[1px] bg-ink3/25"
          animate={{
            backgroundColor: active
              ? 'rgb(var(--c-spark) / 0.55)'
              : 'rgb(var(--c-ink3) / 0.25)',
          }}
          transition={{ duration: 0.3, delay: active ? i * 0.04 : 0 }}
        />
      ))}
    </div>
  );
}

function ChatLine({
  width,
  active,
  delay,
  highlight,
}: {
  width: number;
  active: boolean;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      animate={{
        width: active ? `${width}%` : `${width * 0.3}%`,
        backgroundColor: active
          ? highlight ? 'rgb(var(--c-spark) / 0.7)' : 'rgb(var(--c-ink3) / 0.4)'
          : 'rgb(var(--c-ink3) / 0.25)',
      }}
      transition={{ duration: 0.5, delay: active ? delay : 0 }}
      className="h-1.5 rounded-sm"
    />
  );
}

function DocLine({
  width,
  active,
  delay,
  highlight,
}: {
  width: number;
  active: boolean;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      animate={{
        width: active ? `${width}%` : `${width * 0.4}%`,
        backgroundColor: active
          ? highlight ? 'rgb(var(--c-spark) / 0.7)' : 'rgb(var(--c-ink3) / 0.4)'
          : 'rgb(var(--c-ink3) / 0.22)',
      }}
      transition={{ duration: 0.5, delay: active ? delay : 0 }}
      className="h-1.5 rounded-sm"
    />
  );
}

function LogLine({
  code,
  text,
  active,
  delay,
}: {
  code: string;
  text: string;
  active: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -3 }}
      animate={{
        opacity: active ? 1 : 0.45,
        x: 0,
      }}
      transition={{ duration: 0.3, delay: active ? delay : 0 }}
      className="flex items-center gap-1"
    >
      <span className={code === '+' ? 'text-success' : 'text-fail/70'}>{code}</span>
      <span className={active ? 'text-ink' : 'text-ink3'}>{text}</span>
    </motion.div>
  );
}
