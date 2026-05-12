'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EachLabel } from '@/components/ui/EachLabel';

/* ──────────────────────────────────────────────────────────────────────────
   InternalAnatomy — security-flavored lifecycle of one internal call.

   A user asks the HR-policy bot a question in Slack. We trace the call
   through SSO → RBAC → each.run() → trace stamp → audit log. Different
   from consumer-ai's anatomy: governance steps are first-class, not the
   model. The IT decision-maker reads this and ticks every checkbox.

   ~7.4s loop:
     idle    400    reset
     ask     900    Slack bubble appears
     sso     900    SSO check passes (Okta verifies)
     rbac    900    RBAC check resolves (allowed scopes)
     run     1500   each.run() executes
     audit   1100   trace + audit log entry materialize
     reply   1100   response returns to user in Slack
     hold    600    brief still moment before loop
────────────────────────────────────────────────────────────────────────── */

type Phase = 'idle' | 'ask' | 'sso' | 'rbac' | 'run' | 'audit' | 'reply' | 'hold';

const TIMINGS: Record<Phase, number> = {
  idle: 400,
  ask: 900,
  sso: 900,
  rbac: 900,
  run: 1500,
  audit: 1100,
  reply: 1100,
  hold: 600,
};

const TOTAL_LOOP = Object.values(TIMINGS).reduce((a, b) => a + b, 0);

export function InternalAnatomy() {
  const [phase, setPhase] = useState<Phase>('idle');
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function clearAll() {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    }

    function tick() {
      clearAll();
      setPhase('idle');
      const order: Phase[] = ['ask', 'sso', 'rbac', 'run', 'audit', 'reply', 'hold'];
      let acc = TIMINGS.idle;
      for (const p of order) {
        const at = acc;
        timeoutsRef.current.push(setTimeout(() => setPhase(p), at));
        acc += TIMINGS[p];
      }
    }

    tick();
    const id = setInterval(tick, TOTAL_LOOP);
    return () => {
      clearInterval(id);
      clearAll();
    };
  }, []);

  // Step "done" predicates
  const askDone   = ['sso','rbac','run','audit','reply','hold'].includes(phase);
  const ssoDone   = ['rbac','run','audit','reply','hold'].includes(phase);
  const rbacDone  = ['run','audit','reply','hold'].includes(phase);
  const runDone   = ['audit','reply','hold'].includes(phase);
  const auditDone = ['reply','hold'].includes(phase);
  const replyDone = phase === 'hold';

  return (
    <section className="container border-t border-rule py-24 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-3">
        ● ANATOMY · ONE INTERNAL CALL
      </div>
      <h2 className="font-display font-semibold text-[32px] md:text-[44px] leading-[1.05] tracking-tightest text-ink max-w-[760px]">
        SSO. RBAC. Trace. Audit. All on the call you didn&rsquo;t write.
      </h2>
      <p className="text-ink2 text-[15px] leading-[1.65] max-w-[640px] mt-6">
        An employee asks the HR bot a question. Your code wrote two lines:
        <span className="font-mono text-spark"> each.run() </span>
        and a Slack reply. The other six steps — auth, scopes, trace, audit —
        run inside the platform.
      </p>

      <div className="mt-12 bg-surface border border-rule2 rounded-md p-5 md:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-spark animate-pulse" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink2">
              one slack call · live
            </span>
          </div>
          <PhaseLabel phase={phase} />
        </div>

        {/* Slack-style ask bubble */}
        <SlackAsk visible={phase !== 'idle'} />

        {/* Step pipeline */}
        <div className="mt-5 flex flex-col md:flex-row gap-3 items-stretch [&>*:nth-child(odd)]:flex-1">
          <Step
            label="SSO"
            sub="okta · saml verified"
            active={phase === 'sso'}
            done={ssoDone}
          />
          <Connector active={ssoDone} />
          <Step
            label="RBAC"
            sub="scopes · hr-docs:read"
            active={phase === 'rbac'}
            done={rbacDone}
          />
          <Connector active={rbacDone} />
          <RunStep active={phase === 'run'} done={runDone} />
          <Connector active={runDone} />
          <Step
            label="TRACE + AUDIT"
            sub="stamped · 30d retention"
            active={phase === 'audit'}
            done={auditDone}
          />
        </div>

        {/* Slack reply (the user-visible thing) */}
        <SlackReply visible={replyDone || phase === 'reply'} />

        {/* Audit log entry */}
        <AuditLog visible={auditDone || phase === 'audit'} />

        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule2 border border-rule2 rounded mt-6 overflow-hidden">
          <Stat label="round-trip"   value="2.4s" tone="spark" />
          <Stat label="lines you wrote" value="2" tone="highlight" />
          <Stat label="audit entries" value="1 ✓" tone="success" />
          <Stat label="infra you maintain" value="0" tone="success" />
        </div>
      </div>
    </section>
  );
}

/* ── Phase label ────────────────────────────────────────────────────────── */

function PhaseLabel({ phase }: { phase: Phase }) {
  const text =
    phase === 'idle'   ? 'queued'
    : phase === 'ask'    ? 'employee asks'
    : phase === 'sso'    ? 'sso · verifying'
    : phase === 'rbac'   ? 'rbac · checking scopes'
    : phase === 'run'    ? 'each.run() · 1.7s'
    : phase === 'audit'  ? 'trace · audit · stamped'
    : phase === 'reply'  ? 'reply · sent'
    : 'done · 2.4s';

  const tone =
    phase === 'idle' ? 'text-ink3'
    : phase === 'reply' || phase === 'hold' ? 'text-success'
    : 'text-spark';

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phase}
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

/* ── Slack ask bubble ───────────────────────────────────────────────────── */

function SlackAsk({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: visible ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-bg border border-rule2 rounded-md p-3 max-w-[480px]"
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded bg-highlight/30 flex items-center justify-center font-mono text-[10px] text-highlight font-semibold">
          MS
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[11px] text-ink">Mira S.</span>
            <span className="font-mono text-[9px] text-ink3">14:32</span>
          </div>
          <div className="font-mono text-[12px] text-ink2 leading-snug">
            "How do I claim parental leave in TR?"
            <span className="text-ink3"> · @hr-policy-bot</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Pipeline step ──────────────────────────────────────────────────────── */

function Step({
  label,
  sub,
  active,
  done,
}: {
  label: string;
  sub: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <motion.div
      animate={{
        borderColor: active
          ? 'rgb(var(--c-spark) / 0.55)'
          : done
          ? 'rgb(var(--c-success) / 0.45)'
          : 'rgb(var(--c-rule2))',
        boxShadow: active ? '0 0 0 1px rgb(var(--c-spark) / 0.18)' : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-1 px-3 py-3 border rounded-md bg-bg text-center"
    >
      <div className="flex items-center justify-center gap-1.5">
        {done && <span className="text-success text-[10px]" aria-hidden>✓</span>}
        <span
          className={`font-mono text-[10px] uppercase tracking-eyebrow ${
            active ? 'text-spark' : done ? 'text-success' : 'text-ink3'
          }`}
        >
          {label}
        </span>
      </div>
      <span className={`font-mono text-[9.5px] ${active || done ? 'text-ink2' : 'text-ink3'}`}>
        {sub}
      </span>
    </motion.div>
  );
}

/* ── Run step (visually distinct) ───────────────────────────────────────── */

function RunStep({ active, done }: { active: boolean; done: boolean }) {
  return (
    <motion.div
      animate={{
        borderColor: active
          ? 'rgb(var(--c-spark) / 0.7)'
          : done
          ? 'rgb(var(--c-success) / 0.5)'
          : 'rgb(var(--c-rule2))',
        boxShadow: active ? '0 0 0 1px rgb(var(--c-spark) / 0.22)' : '0 0 0 0 transparent',
      }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-1 px-3 py-3 border rounded-md bg-bg text-center"
    >
      <div className="flex items-center justify-center gap-1.5">
        {done && <span className="text-success text-[10px]" aria-hidden>✓</span>}
        <span className={`font-mono text-[10px] ${active ? 'text-spark' : done ? 'text-success' : 'text-ink3'}`}>
          <EachLabel name="each::run()" />
        </span>
      </div>
      <motion.span
        className="font-mono text-[9.5px] text-ink3"
        animate={{ opacity: active ? [0.5, 1, 0.5] : 1 }}
        transition={{ duration: 0.9, repeat: active ? Infinity : 0 }}
      >
        ◐ workflow · hr-policy
      </motion.span>
    </motion.div>
  );
}

/* ── Connector ──────────────────────────────────────────────────────────── */

function Connector({ active }: { active: boolean }) {
  return (
    <div className="hidden md:flex items-center justify-center relative w-6 shrink-0">
      <motion.span
        className="block h-px w-full"
        animate={{
          backgroundColor: active ? 'rgb(var(--c-spark))' : 'rgb(var(--c-rule2))',
        }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        className="absolute text-[14px]"
        animate={{
          color: active ? 'rgb(var(--c-spark))' : 'rgb(var(--c-rule2))',
          x: active ? [0, 3, 0] : 0,
        }}
        transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
        aria-hidden
      >
        →
      </motion.span>
    </div>
  );
}

/* ── Slack reply ────────────────────────────────────────────────────────── */

function SlackReply({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32 }}
          className="overflow-hidden"
        >
          <div className="mt-5 bg-bg border border-spark/35 rounded-md p-3 max-w-[480px]">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded bg-spark/30 flex items-center justify-center font-mono text-[10px] text-spark font-semibold">
                HR
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[11px] text-ink">hr-policy-bot</span>
                  <span className="font-mono text-[8.5px] uppercase tracking-eyebrow text-spark border border-spark/40 rounded px-1">
                    APP
                  </span>
                  <span className="font-mono text-[9px] text-ink3">14:32</span>
                </div>
                <div className="font-mono text-[12px] text-ink leading-snug">
                  TR employees: 8 weeks paid + 16 weeks job-protected.
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-mono text-[8.5px] text-highlight border border-highlight/45 bg-highlight/[0.06] rounded px-1">
                    [tr-leave-policy-2024]
                  </span>
                  <span className="font-mono text-[8.5px] text-highlight border border-highlight/45 bg-highlight/[0.06] rounded px-1">
                    [hr-handbook-§5]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Audit log entry ────────────────────────────────────────────────────── */

function AuditLog({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32 }}
          className="overflow-hidden"
        >
          <div className="mt-5 bg-bg border border-rule2 rounded-md">
            <div className="flex items-center justify-between px-3 py-2 border-b border-rule2">
              <span className="font-mono text-[9.5px] uppercase tracking-eyebrow text-ink3">
                audit log entry
              </span>
              <span className="font-mono text-[9px] text-success">
                ✓ written · 30d retention
              </span>
            </div>
            <div className="px-3 py-2 font-mono text-[10px] leading-relaxed">
              <AuditLine k="ts"          v="2026-01-12T14:32:14Z" />
              <AuditLine k="actor"       v='"mira.s@acme.io"' />
              <AuditLine k="tool"        v='"hr-policy-bot"' />
              <AuditLine k="prompt_hash" v='"sha256:9c2..."' />
              <AuditLine k="output_id"   v='"out_0c41"'        highlight />
              <AuditLine k="model"       v='"gpt-4o · v3"' />
              <AuditLine k="cost_usd"    v="0.0023" />
              <AuditLine k="trace_id"    v='"tr_8f2a"'         highlight />
              <AuditLine k="retention"   v='"30d"' />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AuditLine({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-ink3 w-[88px]">{k}</span>
      <span className={highlight ? 'text-spark' : 'text-ink2'}>{v}</span>
    </div>
  );
}

/* ── Stat cell ──────────────────────────────────────────────────────────── */

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'spark' | 'highlight' | 'success';
}) {
  const cls =
    tone === 'spark' ? 'text-spark'
    : tone === 'highlight' ? 'text-highlight'
    : 'text-success';
  return (
    <div className="bg-surface px-3 py-3 text-center">
      <div className="font-mono text-[9px] uppercase tracking-eyebrow text-ink3">
        {label}
      </div>
      <div className={`font-display text-[16px] font-semibold tabular-nums mt-0.5 ${cls}`}>
        {value}
      </div>
    </div>
  );
}
