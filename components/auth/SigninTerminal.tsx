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
      cwd="~/each-auth/login"
      brandHref="/signin?ui=brand"
      tabs={[
        { label: 'signin', href: '/signin?ui=terminal', active: true },
        { label: 'signup', href: '/signup?ui=terminal' },
      ]}
    >
      <pre className="font-mono text-[13.5px] leading-[1.85] text-ink2 whitespace-pre-wrap">
{`$ each auth login
`}
        <span className="text-success">✓</span>{' resolving identity provider'}<span className="text-ink3">......</span> <span className="text-success">ok</span>
{'\n'}
        <span className="text-success">✓</span>{' restoring last session'}<span className="text-ink3">...........</span> <span className="text-sun">stale</span>
{'\n'}
      </pre>

      <div className="mt-5">
        <AuthTerminalAuth mode="signin" />
      </div>

      <div className="mt-10 border-t border-rule2 pt-5">
        <div className="text-[11px] uppercase tracking-eyebrow text-ink3">
          ──── last seen ───────────────────────────────────────────
        </div>
        <ul className="mt-3 font-mono text-[12.5px] leading-[1.9] text-ink2 space-y-0.5">
          {LASTSEEN.map((m) => (
            <li key={m.ts}>
              <span className="text-ink3">[{m.ts}]</span>{' '}
              <span className={m.tone === 'spark' ? 'text-spark' : m.tone === 'sun' ? 'text-sun' : 'text-ink2'}>
                {m.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-[12.5px] text-ink3 font-mono">
        new here?{' '}
        <Link href="/signup?ui=terminal" className="text-spark hover:underline underline-offset-4">
          $ each auth signup --new →
        </Link>
      </p>
    </AuthTerminalShell>
  );
}
