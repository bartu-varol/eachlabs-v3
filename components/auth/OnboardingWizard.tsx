'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wordmark } from '@/components/ui/Wordmark';
import { EachColons } from '@/components/ui/EachColons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DotIcon, MinimizedWindow } from '@/components/auth/AuthTerminalShell';
import { Eyebrow } from '@/components/ui/Eyebrow';

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
  { id: 'small', label: '2-10 people',  sub: 'Startup or small team' },
  { id: 'mid',   label: '11-50 people', sub: 'Scaling org' },
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
            className="fixed inset-0 z-40 flex flex-col bg-surface font-mono text-ink"
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
    <div className="min-h-screen flex flex-col px-6 sm:px-10 lg:px-14 py-8 lg:py-10 bg-surface">
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
                <div className={['h-1 rounded-full transition-colors', s <= w.step ? 'bg-brand' : 'bg-field'].join(' ')} />
              </div>
            ))}
          </div>
          <Eyebrow tone="ink-faint" className="mb-8">Step {w.step} of 5</Eyebrow>

          {w.step === 1 && (
            <BrandStep eyebrow="* CHAPTER ONE · WHO ARE YOU" title={<>Tell us about<br /><span className="text-brand">your team.</span></>} sub="So we can pre-fill the boring parts.">
              <div className="space-y-5">
                <BrandField label="Organization or project name">
                  <input data-wizard-input type="text" value={w.orgName} onChange={(e) => w.setOrgName(e.target.value)} placeholder="acme-ai" autoFocus className="w-full h-11 px-3 bg-surface border border-field rounded-md text-ink placeholder-ink-faint focus:outline-none focus:border-brand" />
                </BrandField>
                <BrandField label="Your role">
                  <input data-wizard-input type="text" value={w.role} onChange={(e) => w.setRole(e.target.value)} placeholder="Founding engineer" className="w-full h-11 px-3 bg-surface border border-field rounded-md text-ink placeholder-ink-faint focus:outline-none focus:border-brand" />
                </BrandField>
              </div>
            </BrandStep>
          )}

          {w.step === 2 && (
            <BrandStep eyebrow="* CHAPTER TWO · WHAT YOU&rsquo;RE BUILDING" title={<>What&rsquo;s the<br /><span className="text-brand">shape of it?</span></>} sub="Pick the closest match. You can change this later.">
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
            <BrandStep eyebrow="* CHAPTER THREE · HOW MANY HANDS" title={<>How big is<br /><span className="text-brand">the rabbit hole?</span></>} sub="We size our suggestions to your team.">
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
            <BrandStep eyebrow="* CHAPTER FOUR · WHERE DID WE FIND YOU" title={<>How did you<br /><span className="text-brand">hear about us?</span></>} sub="Helps us figure out where to spend our weekends.">
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
              <Eyebrow>* YOU&rsquo;RE IN</Eyebrow>
              <h1 className="font-sans font-semibold text-display sm:text-display-lg leading-[1.0] tracking-tightest mt-5 text-ink">
                Welcome down,<br /><em className="text-brand">{w.orgName.trim() || 'explorer'}.</em>
              </h1>
              <p className="text-ink-muted text-body leading-relaxed mt-5 max-w-[400px] mx-auto">
                Your workspace is ready. 10K free traces are waiting. The chaos is ours to handle.
              </p>
              <BrandFinish activeIndex={w.successIndex} />
            </div>
          )}

          {w.step < 5 && <BrandNav state={w} />}
        </div>
      </div>

      <p className="text-ink-faint text-eyebrow text-center">This is a static onboarding mockup. Nothing is saved.</p>
    </div>
  );
}

function BrandStep({ eyebrow, title, sub, children }: { eyebrow: string; title: React.ReactNode; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-eyebrow uppercase tracking-eyebrow text-brand" dangerouslySetInnerHTML={{ __html: eyebrow }} />
      <h1 className="font-sans font-semibold text-h2 sm:text-display leading-[1.0] tracking-tightest mt-5 text-ink">{title}</h1>
      <p className="text-ink-muted text-body leading-relaxed mt-5">{sub}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function BrandField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <Eyebrow size="sm" tone="ink-faint" className="mb-2">{label}</Eyebrow>
      {children}
    </label>
  );
}

function BrandRadio({ checked, onClick, label, sub }: { checked: boolean; onClick: () => void; label: string; sub?: string }) {
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={onClick} className={['w-full text-left flex items-start gap-3 px-4 py-3 rounded-md border transition-colors', checked ? 'border-brand/60 bg-brand/[0.06]' : 'border-field hover:border-divider'].join(' ')}>
      <span aria-hidden className={['mt-1 size-3.5 rounded-full border-2 inline-block shrink-0 transition-colors', checked ? 'border-brand bg-brand' : 'border-divider'].join(' ')} />
      <div>
        <div className="text-ink text-body font-medium leading-tight">{label}</div>
        {sub && <div className="text-ink-faint text-caption mt-0.5">{sub}</div>}
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
            ? 'bg-ink text-surface ring-2 ring-brand/50 ring-offset-2 ring-offset-surface'
            : 'bg-ink/90 text-surface hover:bg-brand',
        ].join(' ')}
      >
        Get started →
      </Link>
      <Link
        href="/docs"
        className={[
          'text-body-sm underline-offset-4 transition-colors',
          activeIndex === 1
            ? 'text-ink underline decoration-brand/60'
            : 'text-ink-faint hover:text-ink hover:underline',
        ].join(' ')}
      >
        Read the quickstart
      </Link>
      <p className="mt-2 font-mono text-micro uppercase tracking-eyebrow text-ink-faint">
        [<span className="text-ink-muted">↑↓</span>] move · [<span className="text-ink-muted">↵</span>] go
      </p>
    </div>
  );
}

function BrandNav({ state: w }: { state: WizardState }) {
  return (
    <div className="mt-10 flex items-center justify-between">
      {w.step > 1 ? (
        <button type="button" onClick={w.back} className="text-ink-muted hover:text-ink text-body-sm font-medium underline-offset-4 hover:underline">
          ← Back
        </button>
      ) : <div />}
      <button type="button" onClick={w.next} disabled={!w.canNext} className="inline-flex items-center justify-center h-11 px-6 bg-ink text-surface font-medium rounded-md hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
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
      <header className="flex items-center gap-4 px-4 sm:px-6 h-11 border-b border-field bg-surface-raised select-none">
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            aria-label="Close · home"
            title="Close · home"
            className="size-3 rounded-full bg-danger/80 hover:bg-danger text-black/55 hover:text-black/80 transition-colors cursor-pointer inline-flex items-center justify-center"
          >
            <DotIcon color="red" />
          </Link>
          <button
            type="button"
            disabled
            aria-label="Disabled"
            aria-disabled
            title="Disabled"
            className="size-3 rounded-full bg-glow/30 text-black/30 cursor-not-allowed inline-flex items-center justify-center"
          >
            <DotIcon color="yellow" />
          </button>
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize"
            title="Minimize"
            className="size-3 rounded-full bg-ok/80 hover:bg-ok text-black/55 hover:text-black/80 transition-colors cursor-pointer inline-flex items-center justify-center"
          >
            <DotIcon color="green" />
          </button>
        </div>
        <div className="hidden sm:block text-eyebrow uppercase tracking-eyebrow text-ink-faint shrink-0">
          each@labs · zsh
        </div>
        <div className="ml-auto sm:ml-0 sm:mx-auto text-eyebrow uppercase tracking-eyebrow text-brand">
          ▸ each onboard {w.step < 5 ? `--step ${w.step}` : '--done'}
        </div>
        <div className="ml-auto flex items-center shrink-0 [&_button]:size-7 [&_button_svg]:size-3.5">
          <ThemeToggle />
        </div>
      </header>

      <div className="px-4 sm:px-6 h-8 flex items-center border-b border-field text-eyebrow text-ink-faint">
        <span className="text-ok">●</span>
        <span className="ml-2">
          <span className="text-ink-muted">~/each-onboarding/setup</span>
          <span className="text-brand"> ↗</span>
          <span className="ml-3 text-ink-faint">[{w.step}/5]</span>
        </span>
      </div>

      <main className="flex-1 overflow-y-auto flex justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-[760px]">
          <pre className="text-body-sm leading-[1.85] text-ink-muted whitespace-pre-wrap">
            <span className="text-ink-faint">$</span> each onboard <span className="text-brand">--step {w.step}</span>
          </pre>

          {w.step === 1 && (
            <div className="mt-5 space-y-5">
              <TerminalPrompt label="organization or project name">
                <input data-wizard-input type="text" value={w.orgName} onChange={(e) => w.setOrgName(e.target.value)} placeholder="acme-ai" autoFocus className="w-full bg-transparent border-b border-field px-0 py-1 text-ink placeholder-ink-faint focus:outline-none focus:border-brand text-body" />
              </TerminalPrompt>
              <TerminalPrompt label="your role">
                <input data-wizard-input type="text" value={w.role} onChange={(e) => w.setRole(e.target.value)} placeholder="founding engineer" className="w-full bg-transparent border-b border-field px-0 py-1 text-ink placeholder-ink-faint focus:outline-none focus:border-brand text-body" />
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
            <div className="mt-6 space-y-1 text-body-sm leading-[1.85] text-ink-muted">
              <Line tone="success">✓ workspace provisioned</Line>
              <Line tone="success">✓ api key issued · sk_live_•••••</Line>
              <Line tone="success">✓ 10,000 traces credited</Line>
              <div className="mt-6 text-ink">
                <span className="text-brand">$</span> welcome <span className="text-ink">{w.orgName.trim() || 'explorer'}</span>{' '}
                <span className="text-ink-faint">// the chaos is ours to handle</span>
              </div>
              <div className="mt-2 text-ink-muted text-body-sm">
                <span className="text-brand">?</span> next move<span className="text-ink-faint">:</span>
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
                          'group w-full text-left flex items-center gap-3 px-3 py-1.5 rounded-sm border transition-colors text-body-sm',
                          active
                            ? 'border-brand/60 bg-brand/[0.06]'
                            : 'border-transparent hover:border-field',
                        ].join(' ')}
                      >
                        <span
                          aria-hidden
                          className={['w-4 inline-block', active ? 'text-brand' : 'text-transparent'].join(' ')}
                        >
                          ▸
                        </span>
                        <span className={active ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}>
                          $ {opt.label}
                        </span>
                        <span className="text-ink-faint ml-2"># {opt.sub}</span>
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

      <footer className="flex items-center justify-between gap-4 px-4 sm:px-6 h-8 border-t border-field bg-surface-raised text-micro uppercase tracking-eyebrow text-ink-faint select-none">
        <span><span className="text-ok">●</span> mock onboard · nothing saved</span>
        <span className="hidden sm:inline">[<span className="text-ink-muted">↑↓</span>] move · [<span className="text-ink-muted">1-9</span>] pick · [<span className="text-ink-muted">↵</span>] go</span>
        <span>each::labs · 2026</span>
      </footer>
    </>
  );
}

function TerminalPrompt({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-ink-muted text-body-sm">
        <span className="text-brand">?</span> {label}<span className="text-ink-faint">:</span>
      </div>
      <div className="mt-1 pl-4 flex items-center">
        <span className="text-brand mr-2">›</span>
        <span className="flex-1">{children}</span>
      </div>
    </label>
  );
}

function TerminalRadio({ label, options, value, onChange }: { label: string; options: { id: string; label: string; sub?: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-5">
      <div className="text-ink-muted text-body-sm">
        <span className="text-brand">?</span> {label}<span className="text-ink-faint">:</span>
      </div>
      <ul className="mt-2 space-y-0.5">
        {options.map((o) => {
          const checked = value === o.id;
          return (
            <li key={o.id}>
              <button type="button" role="radio" aria-checked={checked} onClick={() => onChange(o.id)} className={['group w-full text-left flex items-center gap-3 px-3 py-1.5 rounded-sm border transition-colors text-body-sm', checked ? 'border-brand/60 bg-brand/[0.06]' : 'border-transparent hover:border-field'].join(' ')}>
                <span aria-hidden className={['w-4 inline-block', checked ? 'text-brand' : 'text-transparent'].join(' ')}>▸</span>
                <span className={checked ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}>{o.label}</span>
                {o.sub && <span className="text-ink-faint ml-2"># {o.sub}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Line({ tone, children }: { tone: 'success' | 'ink' | 'spark'; children: React.ReactNode }) {
  const cls = tone === 'success' ? 'text-ok' : tone === 'spark' ? 'text-brand' : 'text-ink';
  return <div className={cls}>{children}</div>;
}

function TerminalNav({ state: w }: { state: WizardState }) {
  return (
    <div className="mt-10 flex items-center justify-between text-caption">
      {w.step > 1 ? (
        <button type="button" onClick={w.back} className="text-ink-muted hover:text-ink underline-offset-4 hover:underline">
          $ each onboard --back
        </button>
      ) : <div />}
      <button type="button" onClick={w.next} disabled={!w.canNext} className="inline-flex items-center px-3 h-9 border border-brand/60 bg-brand/[0.08] text-ink rounded-sm hover:bg-brand/[0.12] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        ▸ $ each onboard --next
      </button>
    </div>
  );
}

