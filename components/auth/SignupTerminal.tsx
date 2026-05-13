import Link from 'next/link';
import { AuthTerminalShell } from '@/components/auth/AuthTerminalShell';
import { AuthTerminalAuth } from '@/components/auth/AuthTerminalAuth';

const MOTD = [
  { ts: '05:14:22', tone: 'spark',   text: 'each::router 1.4 ships, quality-aware spill' },
  { ts: '05:14:21', tone: 'ink2',    text: '284K req routed last 24h · 0 user-visible errors' },
  { ts: '05:14:19', tone: 'success', text: 'welcome.  there is no credit card field.' },
];

export function SignupTerminal() {
  return (
    <AuthTerminalShell
      cwd="~/each-auth/signup"
      brandHref="/signup?ui=brand"
      tabs={[
        { label: 'signin', href: '/signin?ui=terminal' },
        { label: 'signup', href: '/signup?ui=terminal', active: true },
      ]}
    >
      <pre className="font-mono text-[13.5px] leading-[1.85] text-ink2 whitespace-pre-wrap">
{`$ each auth signup --new
`}
        <span className="text-success">✓</span>{' checking availability'}<span className="text-ink3">............</span> <span className="text-success">ok</span>
{'\n'}
        <span className="text-success">✓</span>{' provisioning workspace'}<span className="text-ink3">..........</span> <span className="text-success">ok</span>
{'\n'}
      </pre>

      <div className="mt-5">
        <AuthTerminalAuth mode="signup" redirectTo="/onboarding?theme=terminal" />
      </div>

      <div className="mt-10 border-t border-rule2 pt-5">
        <div className="text-[11px] uppercase tracking-eyebrow text-ink3">
          ──── tail -f motd ─────────────────────────────────────────
        </div>
        <ul className="mt-3 font-mono text-[12.5px] leading-[1.9] text-ink2 space-y-0.5">
          {MOTD.map((m) => (
            <li key={m.ts}>
              <span className="text-ink3">[{m.ts}]</span>{' '}
              <span className={m.tone === 'spark' ? 'text-spark' : m.tone === 'success' ? 'text-success' : 'text-ink2'}>
                {m.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-[12.5px] text-ink3 font-mono">
        already have a key?{' '}
        <Link href="/signin?ui=terminal" className="text-spark hover:underline underline-offset-4">
          $ each auth login →
        </Link>
      </p>
    </AuthTerminalShell>
  );
}
