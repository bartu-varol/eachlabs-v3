import Link from 'next/link';
import { AuthTerminalShell } from '@/components/auth/AuthTerminalShell';
import { AuthTerminalAuth } from '@/components/auth/AuthTerminalAuth';

const LASTSEEN = [
  { ts: '05:14:22', tone: 'ink2',  text: 'last login: 4 days ago from 78.x.x.x · macOS · zsh' },
  { ts: '05:14:21', tone: 'sun',   text: 'session expired · please re-auth' },
  { ts: '05:14:19', tone: 'spark', text: 'welcome back. the chaos missed you.' },
];

export function SigninTerminal() {
  return (
    <AuthTerminalShell
      cwd="~/each-auth/sign-in"
      brandHref="/sign-in?ui=brand"
      tabs={[
        { label: 'Sign in', href: '/sign-in?ui=terminal', active: true },
        { label: 'Sign up', href: '/sign-up?ui=terminal' },
      ]}
    >
      <pre className="font-mono text-body-sm leading-[1.85] text-ink-muted whitespace-pre-wrap">
{`$ each auth login
`}
        <span className="text-ok">✓</span>{' resolving identity provider'}<span className="text-ink-faint">......</span> <span className="text-ok">ok</span>
{'\n'}
        <span className="text-ok">✓</span>{' restoring last session'}<span className="text-ink-faint">...........</span> <span className="text-glow">stale</span>
{'\n'}
      </pre>

      <div className="mt-5">
        <AuthTerminalAuth mode="signin" />
      </div>

      <div className="mt-10 border-t border-field pt-5">
        <div className="text-eyebrow uppercase tracking-eyebrow text-ink-faint">
          ──── last seen ───────────────────────────────────────────
        </div>
        <ul className="mt-3 font-mono text-caption leading-[1.9] text-ink-muted space-y-0.5">
          {LASTSEEN.map((m) => (
            <li key={m.ts}>
              <span className="text-ink-faint">[{m.ts}]</span>{' '}
              <span className={m.tone === 'spark' ? 'text-brand' : m.tone === 'sun' ? 'text-glow' : 'text-ink-muted'}>
                {m.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-caption text-ink-faint font-mono">
        new here?{' '}
        <Link href="/sign-up?ui=terminal" className="text-brand hover:underline underline-offset-4">
          $ each auth signup --new →
        </Link>
      </p>
    </AuthTerminalShell>
  );
}
