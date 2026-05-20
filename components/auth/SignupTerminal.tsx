import Link from 'next/link';
import { AuthTerminalShell } from '@/components/auth/AuthTerminalShell';
import { AuthTerminalAuth } from '@/components/auth/AuthTerminalAuth';

const MOTD = [
  { ts: '05:14:22', tone: 'spark',   text: 'each::router 1.4 ships, quality aware spill' },
  { ts: '05:14:21', tone: 'ink2',    text: '284K req routed last 24h · 0 user-visible errors' },
  { ts: '05:14:19', tone: 'success', text: 'welcome.  there is no credit card field.' },
];

export function SignupTerminal() {
  return (
    <AuthTerminalShell
      cwd="~/each-auth/sign-up"
      brandHref="/sign-up?ui=brand"
      tabs={[
        { label: 'Sign in', href: '/sign-in?ui=terminal' },
        { label: 'Sign up', href: '/sign-up?ui=terminal', active: true },
      ]}
    >
      <pre className="font-mono text-body-sm leading-[1.85] text-ink-muted whitespace-pre-wrap">
{`$ each auth signup --new
`}
        <span className="text-ok">✓</span>{' checking availability'}<span className="text-ink-faint">............</span> <span className="text-ok">ok</span>
{'\n'}
        <span className="text-ok">✓</span>{' provisioning workspace'}<span className="text-ink-faint">..........</span> <span className="text-ok">ok</span>
{'\n'}
      </pre>

      <div className="mt-5">
        <AuthTerminalAuth mode="signup" redirectTo="/onboarding?theme=terminal" />
      </div>

      <div className="mt-10 border-t border-field pt-5">
        <div className="text-eyebrow uppercase tracking-eyebrow text-ink-faint">
          ──── tail -f motd ─────────────────────────────────────────
        </div>
        <ul className="mt-3 font-mono text-caption leading-[1.9] text-ink-muted space-y-0.5">
          {MOTD.map((m) => (
            <li key={m.ts}>
              <span className="text-ink-faint">[{m.ts}]</span>{' '}
              <span className={m.tone === 'spark' ? 'text-brand' : m.tone === 'success' ? 'text-ok' : 'text-ink-muted'}>
                {m.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-caption text-ink-faint font-mono">
        already have a key?{' '}
        <Link href="/sign-in?ui=terminal" className="text-brand hover:underline underline-offset-4">
          $ each auth login →
        </Link>
      </p>
    </AuthTerminalShell>
  );
}
