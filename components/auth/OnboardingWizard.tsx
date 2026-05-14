'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wordmark } from '@/components/ui/Wordmark';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DotIcon, MinimizedWindow } from '@/components/auth/AuthTerminalShell';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SUCCESS_DESTINATIONS = ['/explore', '/docs'] as const;
type SuccessIndex = 0 | 1;

type Step = 1 | 2 | 3 | 4 | 5;

const USE_CASES = [
  { id: 'chat',   label: 'Chat & assistants',   sub: 'Conversational UX, RAG, support' },
  { id: 'agents', label: 'Agents & automation', sub: 'Tool-using workflows, scheduled jobs' },
  { id: 'media',  label: 'Media generation',    sub: 'Image, video, voice, transcription' },
  { id: 'batch',  label: 'Batch & data',        sub: 'Classification, extraction, embedding' },
  { id: 'other',  label: 'Something else',      sub: 'Tell us in a minute' },
];

const TEAM_SIZES = [
  { id: 'solo',  label: 'Just me',      sub: 'Side project, prototype' },
  { id: 'small', label: '2–10 people',  sub: 'Startup or small team' },
  { id: 'mid',   label: '11–50 people', sub: 'Scaling org' },
  { id: 'large', label: '50+ people',   sub: 'Enterprise · talk to sales' },
];

const REFERRAL_SOURCES = [
  { id: 'twitter',    label: 'X / Twitter',     sub: 'Saw a post, a thread, an edit-the-tweet thing' },
  { id: 'linkedin',   label: 'LinkedIn',        sub: 'Founder post, hiring update, company page' },
  { id: 'discord',    label: 'Discord',         sub: 'Our server, or a friend dropped the link' },
  { id: 'reddit',     label: 'Reddit',          sub: 'r/machinelearning, r/LocalLLaMA, the usual' },
  { id: 'producthunt', label: 'Product Hunt',   sub: 'Launch page or comments' },
  { id: 'search',     label: 'Search',          sub: 'Google, Bing, Kagi, the open web' },
  { id: 'friend',     label: 'From a friend',   sub: 'Word-of-mouth, the best kind' },
  { id: 'other',      label: 'Somewhere else',  sub: 'Tell us later, no pressure' },
];

type WizardState = ReturnType<typeof useWizardState>;

function useWizardState() {
  const [step, setStep] = useState<Step>(1);
  const [orgName, setOrgName] = useState('');
  const [role, setRole] = useState('');
  const [useCase, setUseCase] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [successIndex, setSuccessIndex] = useState<SuccessIndex>(0);

  const canNext =
    (step === 1 && orgName.trim().length > 0 && role.trim().length > 0) ||
    (step === 2 && useCase.length > 0) ||
    (step === 3 && teamSize.length > 0) ||
    (step === 4 && referralSource.length > 0) ||
    step === 5;

  return {
    step,
    setStep,
    orgName,
    setOrgName,
    role,
    setRole,
    useCase,
    setUseCase,
    teamSize,
    setTeamSize,
    referralSource,
    setReferralSource,
    successIndex,
    setSuccessIndex,
    canNext,
    next: () => {
      if (canNext) setStep((s) => Math.min(5, s + 1) as Step);
    },
    back: () => setStep((s) => Math.max(1, s - 1) as Step),
  };
}

function useWizardKeyboard(w: WizardState, enabled: boolean = true) {
  const router = useRouter();
  useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (w.step === 5) {
        if (inField) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          w.setSuccessIndex((i) => (i === 0 ? 1 : 0));
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          w.setSuccessIndex((i) => (i === 0 ? 1 : 0));
        } else if (e.key === '1') {
          e.preventDefault();
          w.setSuccessIndex(0);
        } else if (e.key === '2') {
          e.preventDefault();
          w.setSuccessIndex(1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          router.push(SUCCESS_DESTINATIONS[w.successIndex]);
        }
        return;
      }

      if (e.key === 'Enter') {
        if (inField && w.step === 1) {
          const inputs = Array.from(
            document.querySelectorAll<HTMLInputElement>('[data-wizard-input]'),
          );
          const currentIndex = inputs.findIndex((i) => i === target);
          for (let k = 1; k <= inputs.length; k++) {
            const idx = (currentIndex + k) % inputs.length;
            if (!inputs[idx].value.trim()) {
              e.preventDefault();
              inputs[idx].focus();
              return;
            }
          }
          if (w.canNext) {
            e.preventDefault();
            w.next();
          }
          return;
        }
        if (inField && !w.canNext) return;
        if (w.canNext) {
          e.preventDefault();
          w.next();
        }
        return;
      }

      if ((w.step === 2 || w.step === 3 || w.step === 4) && !inField) {
        const options =
          w.step === 2 ? USE_CASES : w.step === 3 ? TEAM_SIZES : REFERRAL_SOURCES;
        const current =
          w.step === 2 ? w.useCase : w.step === 3 ? w.teamSize : w.referralSource;
        const setter =
          w.step === 2 ? w.setUseCase : w.step === 3 ? w.setTeamSize : w.setReferralSource;
        const idx = options.findIndex((o) => o.id === current);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = idx < 0 ? 0 : (idx + 1) % options.length;
          setter(options[nextIdx].id);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx =
            idx < 0 ? options.length - 1 : (idx - 1 + options.length) % options.length;
          setter(options[prevIdx].id);
        } else if (/^[1-9]$/.test(e.key)) {
          const n = parseInt(e.key, 10);
          if (n <= options.length) {
            e.preventDefault();
            setter(options[n - 1].id);
          }
        }
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, w.step, w.useCase, w.teamSize, w.referralSource, w.canNext, w.successIndex]);
}

export function OnboardingWizard() {
  return (
    <Suspense fallback={<BrandFallback />}>
      <ThemedOnboarding />
    </Suspense>
  );
}

function BrandFallback() {
  const w = useWizardState();
  return <BrandOnboarding state={w} isActive />;
}

function ThemedOnboarding() {
  const searchParams = useSearchParams();
  const theme = searchParams.get('theme');
  if (theme === 'boarding') return <BoardingOnboarding />;
  return <BrandOrTerminal isTerminal={theme === 'terminal'} />;
}

function BrandOrTerminal({ isTerminal }: { isTerminal: boolean }) {
  const w = useWizardState();
  const [minimized, setMinimized] = useState(false);
  const showTerminal = isTerminal && !minimized;
  return (
    <>
      <BrandOnboarding state={w} isActive={!showTerminal} />
      {isTerminal && (
        <>
          <motion.div
            animate={{
              scale: minimized ? 0.18 : 1,
              opacity: minimized ? 0 : 1,
              x: minimized ? -200 : 0,
              y: minimized ? 220 : 0,
            }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            style={{ transformOrigin: 'bottom left', pointerEvents: minimized ? 'none' : 'auto' }}
            aria-hidden={minimized}
            className="fixed inset-0 z-40 flex flex-col bg-bg font-mono text-ink"
          >
            <TerminalOnboarding state={w} onMinimize={() => setMinimized(true)} isActive={showTerminal} />
          </motion.div>

          <motion.div
            animate={{ scale: minimized ? 1 : 0, opacity: minimized ? 1 : 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            style={{ transformOrigin: 'bottom left', pointerEvents: minimized ? 'auto' : 'none' }}
            className="fixed bottom-4 left-4 z-50"
            aria-hidden={!minimized}
          >
            <MinimizedWindow
              cwd="~/each-onboarding/setup"
              homeHref="/"
              onRestore={() => setMinimized(false)}
            />
          </motion.div>
        </>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   BRAND
───────────────────────────────────────────────────────────────────── */

function BrandOnboarding({ state: w, isActive }: { state: WizardState; isActive: boolean }) {
  useWizardKeyboard(w, isActive);
  return (
    <div className="min-h-screen flex flex-col px-6 sm:px-10 lg:px-14 py-8 lg:py-10 bg-bg">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" aria-label="each::labs home" className="inline-flex hover:opacity-80 transition-opacity">
          <Wordmark />
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-[520px]">
          <div className="flex items-center gap-2 mb-6" aria-hidden>
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex-1">
                <div className={['h-1 rounded-full transition-colors', s <= w.step ? 'bg-spark' : 'bg-rule2'].join(' ')} />
              </div>
            ))}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mb-8">
            Step {w.step} of 5
          </div>

          {w.step === 1 && (
            <BrandStep eyebrow="* CHAPTER ONE · WHO ARE YOU" title={<>Tell us about<br /><span className="text-spark">your team.</span></>} sub="So we can pre-fill the boring parts.">
              <div className="space-y-5">
                <BrandField label="Organization or project name">
                  <input data-wizard-input type="text" value={w.orgName} onChange={(e) => w.setOrgName(e.target.value)} placeholder="acme-ai" autoFocus className="w-full h-11 px-3 bg-bg border border-rule2 rounded-md text-ink placeholder-ink3 focus:outline-none focus:border-spark" />
                </BrandField>
                <BrandField label="Your role">
                  <input data-wizard-input type="text" value={w.role} onChange={(e) => w.setRole(e.target.value)} placeholder="Founding engineer" className="w-full h-11 px-3 bg-bg border border-rule2 rounded-md text-ink placeholder-ink3 focus:outline-none focus:border-spark" />
                </BrandField>
              </div>
            </BrandStep>
          )}

          {w.step === 2 && (
            <BrandStep eyebrow="* CHAPTER TWO · WHAT YOU&rsquo;RE BUILDING" title={<>What&rsquo;s the<br /><span className="text-spark">shape of it?</span></>} sub="Pick the closest match. You can change this later.">
              <ul className="space-y-2" role="radiogroup" aria-label="Primary use case">
                {USE_CASES.map((u) => (
                  <li key={u.id}>
                    <BrandRadio checked={w.useCase === u.id} onClick={() => w.setUseCase(u.id)} label={u.label} sub={u.sub} />
                  </li>
                ))}
              </ul>
            </BrandStep>
          )}

          {w.step === 3 && (
            <BrandStep eyebrow="* CHAPTER THREE · HOW MANY HANDS" title={<>How big is<br /><span className="text-spark">the rabbit hole?</span></>} sub="We size our suggestions to your team.">
              <ul className="space-y-2" role="radiogroup" aria-label="Team size">
                {TEAM_SIZES.map((t) => (
                  <li key={t.id}>
                    <BrandRadio checked={w.teamSize === t.id} onClick={() => w.setTeamSize(t.id)} label={t.label} sub={t.sub} />
                  </li>
                ))}
              </ul>
            </BrandStep>
          )}

          {w.step === 4 && (
            <BrandStep eyebrow="* CHAPTER FOUR · WHERE DID WE FIND YOU" title={<>How did you<br /><span className="text-spark">hear about us?</span></>} sub="Helps us figure out where to spend our weekends.">
              <ul className="space-y-2" role="radiogroup" aria-label="Referral source">
                {REFERRAL_SOURCES.map((r) => (
                  <li key={r.id}>
                    <BrandRadio checked={w.referralSource === r.id} onClick={() => w.setReferralSource(r.id)} label={r.label} sub={r.sub} />
                  </li>
                ))}
              </ul>
            </BrandStep>
          )}

          {w.step === 5 && (
            <div className="text-center">
              <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">* YOU&rsquo;RE IN</div>
              <h1 className="font-display font-semibold text-[44px] sm:text-[56px] leading-[1.0] tracking-tightest mt-5 text-ink">
                Welcome down,<br /><em className="text-spark">{w.orgName.trim() || 'explorer'}.</em>
              </h1>
              <p className="text-ink2 text-[14.5px] leading-relaxed mt-5 max-w-[400px] mx-auto">
                Your workspace is ready. 10K free traces are waiting. The chaos is ours to handle.
              </p>
              <BrandFinish activeIndex={w.successIndex} />
            </div>
          )}

          {w.step < 5 && <BrandNav state={w} />}
        </div>
      </div>

      <p className="text-ink3 text-[11px] text-center">This is a static onboarding mockup. Nothing is saved.</p>
    </div>
  );
}

function BrandStep({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark" dangerouslySetInnerHTML={{ __html: eyebrow }} />
      <h1 className="font-display font-semibold text-[36px] sm:text-[44px] leading-[1.0] tracking-tightest mt-5 text-ink">{title}</h1>
      <p className="text-ink2 text-[14.5px] leading-relaxed mt-5">{sub}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function BrandField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 mb-2">{label}</div>
      {children}
    </label>
  );
}

function BrandRadio({ checked, onClick, label, sub }: { checked: boolean; onClick: () => void; label: string; sub?: string }) {
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={onClick} className={['w-full text-left flex items-start gap-3 px-4 py-3 rounded-md border transition-colors', checked ? 'border-spark/60 bg-spark/[0.06]' : 'border-rule2 hover:border-rule'].join(' ')}>
      <span aria-hidden className={['mt-1 size-3.5 rounded-full border-2 inline-block shrink-0 transition-colors', checked ? 'border-spark bg-spark' : 'border-rule'].join(' ')} />
      <div>
        <div className="text-ink text-[14px] font-medium leading-tight">{label}</div>
        {sub && <div className="text-ink3 text-[12.5px] mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

function BrandFinish({ activeIndex }: { activeIndex: SuccessIndex }) {
  return (
    <div className="mt-10 flex flex-col gap-3 items-center">
      <Link
        href="/explore"
        className={[
          'inline-flex items-center justify-center h-11 px-6 rounded-md font-medium transition-all',
          activeIndex === 0
            ? 'bg-ink text-bg ring-2 ring-spark/50 ring-offset-2 ring-offset-bg'
            : 'bg-ink/90 text-bg hover:bg-spark',
        ].join(' ')}
      >
        Get started →
      </Link>
      <Link
        href="/docs"
        className={[
          'text-[13px] underline-offset-4 transition-colors',
          activeIndex === 1
            ? 'text-ink underline decoration-spark/60'
            : 'text-ink3 hover:text-ink hover:underline',
        ].join(' ')}
      >
        Read the quickstart
      </Link>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
        [<span className="text-ink2">↑↓</span>] move · [<span className="text-ink2">↵</span>] go
      </p>
    </div>
  );
}

function BrandNav({ state: w }: { state: WizardState }) {
  return (
    <div className="mt-10 flex items-center justify-between">
      {w.step > 1 ? (
        <button type="button" onClick={w.back} className="text-ink2 hover:text-ink text-[13.5px] font-medium underline-offset-4 hover:underline">
          ← Back
        </button>
      ) : <div />}
      <button type="button" onClick={w.next} disabled={!w.canNext} className="inline-flex items-center justify-center h-11 px-6 bg-ink text-bg font-medium rounded-md hover:bg-spark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Continue →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   TERMINAL
───────────────────────────────────────────────────────────────────── */

function TerminalOnboarding({ state: w, onMinimize, isActive }: { state: WizardState; onMinimize: () => void; isActive: boolean }) {
  useWizardKeyboard(w, isActive);
  return (
    <>
      <header className="flex items-center gap-4 px-4 sm:px-6 h-11 border-b border-rule2 bg-surface select-none">
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            aria-label="Close · home"
            title="Close · home"
            className="size-3 rounded-full bg-fail/80 hover:bg-fail text-black/55 hover:text-black/80 transition-colors cursor-pointer inline-flex items-center justify-center"
          >
            <DotIcon color="red" />
          </Link>
          <button
            type="button"
            disabled
            aria-label="Disabled"
            aria-disabled
            title="Disabled"
            className="size-3 rounded-full bg-sun/30 text-black/30 cursor-not-allowed inline-flex items-center justify-center"
          >
            <DotIcon color="yellow" />
          </button>
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize"
            title="Minimize"
            className="size-3 rounded-full bg-success/80 hover:bg-success text-black/55 hover:text-black/80 transition-colors cursor-pointer inline-flex items-center justify-center"
          >
            <DotIcon color="green" />
          </button>
        </div>
        <div className="hidden sm:block text-[11px] uppercase tracking-eyebrow text-ink3 shrink-0">
          each@labs · zsh
        </div>
        <div className="ml-auto sm:ml-0 sm:mx-auto text-[11px] uppercase tracking-eyebrow text-spark">
          ▸ each onboard {w.step < 5 ? `--step ${w.step}` : '--done'}
        </div>
        <div className="ml-auto flex items-center shrink-0 [&_button]:size-7 [&_button_svg]:size-3.5">
          <ThemeToggle />
        </div>
      </header>

      <div className="px-4 sm:px-6 h-8 flex items-center border-b border-rule2 text-[11.5px] text-ink3">
        <span className="text-success">●</span>
        <span className="ml-2">
          <span className="text-ink2">~/each-onboarding/setup</span>
          <span className="text-spark"> ↗</span>
          <span className="ml-3 text-ink3">[{w.step}/5]</span>
        </span>
      </div>

      <main className="flex-1 overflow-y-auto flex justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-[760px]">
          <pre className="text-[13.5px] leading-[1.85] text-ink2 whitespace-pre-wrap">
            <span className="text-ink3">$</span> each onboard <span className="text-spark">--step {w.step}</span>
          </pre>

          {w.step === 1 && (
            <div className="mt-5 space-y-5">
              <TerminalPrompt label="organization or project name">
                <input data-wizard-input type="text" value={w.orgName} onChange={(e) => w.setOrgName(e.target.value)} placeholder="acme-ai" autoFocus className="w-full bg-transparent border-b border-rule2 px-0 py-1 text-ink placeholder-ink3 focus:outline-none focus:border-spark text-[14px]" />
              </TerminalPrompt>
              <TerminalPrompt label="your role">
                <input data-wizard-input type="text" value={w.role} onChange={(e) => w.setRole(e.target.value)} placeholder="founding engineer" className="w-full bg-transparent border-b border-rule2 px-0 py-1 text-ink placeholder-ink3 focus:outline-none focus:border-spark text-[14px]" />
              </TerminalPrompt>
            </div>
          )}

          {w.step === 2 && (
            <TerminalRadio label="select primary use case" options={USE_CASES} value={w.useCase} onChange={w.setUseCase} />
          )}

          {w.step === 3 && (
            <TerminalRadio label="select team size" options={TEAM_SIZES} value={w.teamSize} onChange={w.setTeamSize} />
          )}

          {w.step === 4 && (
            <TerminalRadio label="where did you hear about us?" options={REFERRAL_SOURCES} value={w.referralSource} onChange={w.setReferralSource} />
          )}

          {w.step === 5 && (
            <div className="mt-6 space-y-1 text-[13.5px] leading-[1.85] text-ink2">
              <Line tone="success">✓ workspace provisioned</Line>
              <Line tone="success">✓ api key issued · sk_live_•••••</Line>
              <Line tone="success">✓ 10,000 traces credited</Line>
              <div className="mt-6 text-ink">
                <span className="text-spark">$</span> welcome <span className="text-ink">{w.orgName.trim() || 'explorer'}</span>{' '}
                <span className="text-ink3">// the chaos is ours to handle</span>
              </div>
              <div className="mt-2 text-ink2 text-[13.5px]">
                <span className="text-spark">?</span> next move<span className="text-ink3">:</span>
              </div>
              <ul className="mt-2 space-y-0.5">
                {[
                  { href: '/explore', label: 'each explore --start', sub: 'open the model catalog' },
                  { href: '/docs', label: 'man each', sub: 'read the quickstart' },
                ].map((opt, i) => {
                  const active = w.successIndex === i;
                  return (
                    <li key={opt.href}>
                      <Link
                        href={opt.href}
                        onMouseEnter={() => w.setSuccessIndex(i as SuccessIndex)}
                        className={[
                          'group w-full text-left flex items-center gap-3 px-3 py-1.5 rounded-sm border transition-colors text-[13.5px]',
                          active
                            ? 'border-spark/60 bg-spark/[0.06]'
                            : 'border-transparent hover:border-rule2',
                        ].join(' ')}
                      >
                        <span
                          aria-hidden
                          className={['w-4 inline-block', active ? 'text-spark' : 'text-transparent'].join(' ')}
                        >
                          ▸
                        </span>
                        <span className={active ? 'text-ink' : 'text-ink2 group-hover:text-ink'}>
                          $ {opt.label}
                        </span>
                        <span className="text-ink3 ml-2"># {opt.sub}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {w.step < 5 && <TerminalNav state={w} />}
        </div>
      </main>

      <footer className="flex items-center justify-between gap-4 px-4 sm:px-6 h-8 border-t border-rule2 bg-surface text-[10.5px] uppercase tracking-eyebrow text-ink3 select-none">
        <span><span className="text-success">●</span> mock onboard · nothing saved</span>
        <span className="hidden sm:inline">[<span className="text-ink2">↑↓</span>] move · [<span className="text-ink2">1-9</span>] pick · [<span className="text-ink2">↵</span>] go</span>
        <span>each::labs · 2026</span>
      </footer>
    </>
  );
}

function TerminalPrompt({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-ink2 text-[13.5px]">
        <span className="text-spark">?</span> {label}<span className="text-ink3">:</span>
      </div>
      <div className="mt-1 pl-4 flex items-center">
        <span className="text-spark mr-2">›</span>
        <span className="flex-1">{children}</span>
      </div>
    </label>
  );
}

function TerminalRadio({ label, options, value, onChange }: { label: string; options: { id: string; label: string; sub?: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-5">
      <div className="text-ink2 text-[13.5px]">
        <span className="text-spark">?</span> {label}<span className="text-ink3">:</span>
      </div>
      <ul className="mt-2 space-y-0.5">
        {options.map((o) => {
          const checked = value === o.id;
          return (
            <li key={o.id}>
              <button type="button" role="radio" aria-checked={checked} onClick={() => onChange(o.id)} className={['group w-full text-left flex items-center gap-3 px-3 py-1.5 rounded-sm border transition-colors text-[13.5px]', checked ? 'border-spark/60 bg-spark/[0.06]' : 'border-transparent hover:border-rule2'].join(' ')}>
                <span aria-hidden className={['w-4 inline-block', checked ? 'text-spark' : 'text-transparent'].join(' ')}>▸</span>
                <span className={checked ? 'text-ink' : 'text-ink2 group-hover:text-ink'}>{o.label}</span>
                {o.sub && <span className="text-ink3 ml-2"># {o.sub}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Line({ tone, children }: { tone: 'success' | 'ink' | 'spark'; children: React.ReactNode }) {
  const cls = tone === 'success' ? 'text-success' : tone === 'spark' ? 'text-spark' : 'text-ink';
  return <div className={cls}>{children}</div>;
}

function TerminalNav({ state: w }: { state: WizardState }) {
  return (
    <div className="mt-10 flex items-center justify-between text-[12.5px]">
      {w.step > 1 ? (
        <button type="button" onClick={w.back} className="text-ink2 hover:text-ink underline-offset-4 hover:underline">
          $ each onboard --back
        </button>
      ) : <div />}
      <button type="button" onClick={w.next} disabled={!w.canNext} className="inline-flex items-center px-3 h-9 border border-spark/60 bg-spark/[0.08] text-ink rounded-sm hover:bg-spark/[0.12] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        ▸ $ each onboard --next
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   BOARDING
───────────────────────────────────────────────────────────────────── */

const GATES = [
  { n: '01', label: 'Pre-flight check',     sub: 'Passenger &amp; role' },
  { n: '02', label: 'Cabin survey',         sub: 'What you&rsquo;re building' },
  { n: '03', label: 'Crew size',            sub: 'How many hands' },
  { n: '04', label: 'Origin of journey',    sub: 'Where you heard about us' },
  { n: '05', label: 'Cleared for takeoff',  sub: 'Welcome aboard' },
];

function BoardingOnboarding() {
  const w = useWizardState();
  useWizardKeyboard(w);
  const gate = GATES[w.step - 1];

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg flex items-center justify-center px-4 py-16 sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(rgb(var(--c-ink) / 0.5) 0.6px, transparent 0.6px)', backgroundSize: '14px 14px', maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, rgb(0 0 0 / 0.9), transparent 85%)' }} />

      <div className="relative z-10 w-full max-w-[1080px]">
        <div className="relative bg-surface border border-ink/15 dark:border-rule2 rounded-[14px] shadow-[0_30px_80px_-30px_rgb(0_0_0_/_0.35)] overflow-hidden">
          <div className="relative flex items-center justify-between gap-4 px-6 sm:px-10 py-3.5 border-b border-dashed border-ink/20 dark:border-rule2 bg-ink text-bg">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-display text-[16px] sm:text-[17px] tracking-tightest font-semibold">
                each<span className="text-spark">::</span>labs
              </span>
              <span className="text-bg/40">·</span>
              <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-bg/70 truncate">
                Onboarding pass · No. 0001
              </span>
            </div>
            <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-bg/70 truncate">
              Gate {gate.n} of 05
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] relative">
            <div className="px-7 sm:px-10 py-10 sm:py-12">
              <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-spark" dangerouslySetInnerHTML={{ __html: `Gate · ${gate.n} / ${gate.label}` }} />

              {w.step === 1 && (
                <>
                  <h1 className="font-display font-semibold text-[36px] sm:text-[48px] leading-[0.98] tracking-tightest text-ink mt-5">
                    Pre-flight
                    <br />
                    <em className="text-spark not-italic">check.</em>
                  </h1>
                  <p className="text-ink2 text-[14.5px] leading-relaxed mt-5 max-w-[460px]">
                    Two quick details for the manifest. We pre-fill the rest at the gate.
                  </p>
                  <div className="mt-8 space-y-5 max-w-[440px]">
                    <BoardingField label="Passenger / org name">
                      <input data-wizard-input type="text" value={w.orgName} onChange={(e) => w.setOrgName(e.target.value)} placeholder="acme-ai" autoFocus className="w-full h-11 px-3 bg-bg border border-rule2 rounded-md text-ink placeholder-ink3 focus:outline-none focus:border-spark" />
                    </BoardingField>
                    <BoardingField label="Travelling as">
                      <input data-wizard-input type="text" value={w.role} onChange={(e) => w.setRole(e.target.value)} placeholder="Founding engineer" className="w-full h-11 px-3 bg-bg border border-rule2 rounded-md text-ink placeholder-ink3 focus:outline-none focus:border-spark" />
                    </BoardingField>
                  </div>
                </>
              )}

              {w.step === 2 && (
                <>
                  <h1 className="font-display font-semibold text-[36px] sm:text-[48px] leading-[0.98] tracking-tightest text-ink mt-5">
                    Cabin
                    <br />
                    <em className="text-spark not-italic">survey.</em>
                  </h1>
                  <p className="text-ink2 text-[14.5px] leading-relaxed mt-5 max-w-[460px]">
                    What kind of cargo are we routing? Pick the closest match.
                  </p>
                  <ul className="mt-8 space-y-2 max-w-[480px]" role="radiogroup" aria-label="Primary use case">
                    {USE_CASES.map((u) => (
                      <li key={u.id}>
                        <BoardingRadio checked={w.useCase === u.id} onClick={() => w.setUseCase(u.id)} label={u.label} sub={u.sub} />
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {w.step === 3 && (
                <>
                  <h1 className="font-display font-semibold text-[36px] sm:text-[48px] leading-[0.98] tracking-tightest text-ink mt-5">
                    Crew
                    <br />
                    <em className="text-spark not-italic">size.</em>
                  </h1>
                  <p className="text-ink2 text-[14.5px] leading-relaxed mt-5 max-w-[460px]">
                    So we size the seat allocation correctly. Change anytime.
                  </p>
                  <ul className="mt-8 space-y-2 max-w-[480px]" role="radiogroup" aria-label="Team size">
                    {TEAM_SIZES.map((t) => (
                      <li key={t.id}>
                        <BoardingRadio checked={w.teamSize === t.id} onClick={() => w.setTeamSize(t.id)} label={t.label} sub={t.sub} />
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {w.step === 4 && (
                <>
                  <h1 className="font-display font-semibold text-[36px] sm:text-[48px] leading-[0.98] tracking-tightest text-ink mt-5">
                    Origin of
                    <br />
                    <em className="text-spark not-italic">journey.</em>
                  </h1>
                  <p className="text-ink2 text-[14.5px] leading-relaxed mt-5 max-w-[460px]">
                    Last manifest line: where did you hear about us? It helps us figure out where to spend our weekends.
                  </p>
                  <ul className="mt-8 space-y-2 max-w-[480px]" role="radiogroup" aria-label="Referral source">
                    {REFERRAL_SOURCES.map((r) => (
                      <li key={r.id}>
                        <BoardingRadio checked={w.referralSource === r.id} onClick={() => w.setReferralSource(r.id)} label={r.label} sub={r.sub} />
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {w.step === 5 && (
                <>
                  <h1 className="font-display font-semibold text-[36px] sm:text-[52px] leading-[0.98] tracking-tightest text-ink mt-5">
                    Cleared for
                    <br />
                    <em className="text-spark not-italic">takeoff, {w.orgName.trim() || 'explorer'}.</em>
                  </h1>
                  <p className="text-ink2 text-[14.5px] leading-relaxed mt-5 max-w-[460px]">
                    Boarding complete. Your workspace is at the gate, 10K traces stamped on the ticket.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/explore"
                      onMouseEnter={() => w.setSuccessIndex(0)}
                      className={[
                        'inline-flex items-center justify-center h-11 px-6 font-medium rounded-md transition-all',
                        w.successIndex === 0
                          ? 'bg-spark text-bg ring-2 ring-spark/50 ring-offset-2 ring-offset-surface'
                          : 'bg-spark/90 text-bg hover:bg-ember',
                      ].join(' ')}
                    >
                      Board now →
                    </Link>
                    <Link
                      href="/docs"
                      onMouseEnter={() => w.setSuccessIndex(1)}
                      className={[
                        'inline-flex items-center justify-center h-11 px-6 border rounded-md font-medium transition-all',
                        w.successIndex === 1
                          ? 'border-spark/60 bg-spark/[0.06] text-ink ring-2 ring-spark/30 ring-offset-2 ring-offset-surface'
                          : 'border-rule2 text-ink hover:border-rule',
                      ].join(' ')}
                    >
                      Read flight manual
                    </Link>
                  </div>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
                    [<span className="text-ink2">↑↓</span>] move · [<span className="text-ink2">↵</span>] go
                  </p>
                </>
              )}

              {w.step < 5 && <BoardingNav state={w} />}
            </div>

            <div aria-hidden className="hidden lg:block absolute top-0 bottom-0 left-[calc(100%-320px)] w-px border-l border-dashed border-ink/25 dark:border-rule2" />
            <div aria-hidden className="hidden lg:block absolute left-[calc(100%-320px)] -translate-x-1/2 -top-3 w-6 h-6 rounded-full bg-bg border border-ink/15 dark:border-rule2" />
            <div aria-hidden className="hidden lg:block absolute left-[calc(100%-320px)] -translate-x-1/2 -bottom-3 w-6 h-6 rounded-full bg-bg border border-ink/15 dark:border-rule2" />
            <div aria-hidden className="lg:hidden border-t border-dashed border-ink/25 dark:border-rule2" />

            <aside className="relative bg-surface2/60 px-7 sm:px-8 py-10 sm:py-12 lg:py-10">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">Boarding pass · stub</span>
                <span aria-hidden className="font-mono text-[10px] text-ink3 tabular-nums">{gate.n} / 05</span>
              </div>

              <ol className="mt-7 space-y-3">
                {GATES.map((g, i) => {
                  const idx = i + 1;
                  const done = idx < w.step;
                  const current = idx === w.step;
                  return (
                    <li key={g.n} className="flex items-start gap-3">
                      <span aria-hidden className={['inline-flex items-center justify-center size-6 rounded-full font-mono text-[10px] tabular-nums shrink-0 transition-colors', done ? 'bg-success text-bg' : current ? 'bg-spark text-bg' : 'border border-rule2 text-ink3'].join(' ')}>
                        {done ? '✓' : g.n}
                      </span>
                      <div>
                        <div className={['text-[13px] font-medium leading-tight', current ? 'text-ink' : done ? 'text-ink2' : 'text-ink3'].join(' ')}>
                          {g.label}
                        </div>
                        <div className="text-ink3 text-[11px] mt-0.5" dangerouslySetInnerHTML={{ __html: g.sub }} />
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-9">
                <div aria-hidden className="h-10 rounded-sm" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgb(var(--c-ink)) 0, rgb(var(--c-ink)) 1px, transparent 1px, transparent 3px, rgb(var(--c-ink)) 3px, rgb(var(--c-ink)) 4px, transparent 4px, transparent 7px, rgb(var(--c-ink)) 7px, rgb(var(--c-ink)) 9px, transparent 9px, transparent 11px)' }} />
                <div className="mt-2 font-mono text-[10px] tracking-[0.18em] text-ink2 text-center tabular-nums">
                  EACH · ONB · GATE {gate.n}
                </div>
              </div>

              {w.step === 5 && (
                <div aria-hidden className="absolute bottom-6 right-6 w-20 h-20 rounded-full border-[1.5px] border-spark/40 text-spark/70 flex items-center justify-center rotate-[-14deg]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-center leading-[1.1]">
                    each::<br />approved
                  </span>
                </div>
              )}
            </aside>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 px-2">
          <span>✂  tear here · keep stub for boarding</span>
          <span className="tabular-nums">mock pass · nothing saved</span>
        </div>
      </div>
    </main>
  );
}

function BoardingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 mb-2">{label}</div>
      {children}
    </label>
  );
}

function BoardingRadio({ checked, onClick, label, sub }: { checked: boolean; onClick: () => void; label: string; sub?: string }) {
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={onClick} className={['w-full text-left flex items-start gap-3 px-4 py-3 rounded-md border transition-colors', checked ? 'border-spark/60 bg-spark/[0.06]' : 'border-rule2 hover:border-rule'].join(' ')}>
      <span aria-hidden className={['mt-1 size-3.5 rounded-sm border-2 inline-block shrink-0 transition-colors', checked ? 'border-spark bg-spark' : 'border-rule'].join(' ')} />
      <div>
        <div className="text-ink text-[14px] font-medium leading-tight">{label}</div>
        {sub && <div className="text-ink3 text-[12.5px] mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

function BoardingNav({ state: w }: { state: WizardState }) {
  return (
    <div className="mt-10 flex items-center justify-between max-w-[480px]">
      {w.step > 1 ? (
        <button type="button" onClick={w.back} className="text-ink2 hover:text-ink text-[13.5px] font-medium underline-offset-4 hover:underline">
          ← Back to gate {GATES[w.step - 2].n}
        </button>
      ) : <div />}
      <button type="button" onClick={w.next} disabled={!w.canNext} className="inline-flex items-center justify-center h-11 px-6 bg-ink text-bg font-medium rounded-md hover:bg-spark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Proceed to gate {GATES[w.step].n} →
      </button>
    </div>
  );
}
