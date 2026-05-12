import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthTicketShell } from '@/components/auth/AuthTicketShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export const metadata: Metadata = {
  title: 'Book your seat · each::labs',
  description: 'One-way ticket to each::run(). 10K free traces. No card.',
};

export default function Signup4Page() {
  return (
    <AuthTicketShell
      ticketLabel="Boarding pass · No. 0001 · First issue"
      ticketMeta="Gate 4 · Terminal A · 06:42"
      chapter="Chapter · IV / First boarding"
      stubFields={[
        { label: 'Passenger', value: 'New explorer' },
        { label: 'Seat', value: '4A · first class' },
        { label: 'Class', value: 'Free tier · 10K traces' },
        { label: 'From → To', value: 'here  →  each::run()' },
      ]}
      barcodeCode="EACH · 04 · 2026 · NEW"
    >
      <h1 className="font-display font-semibold text-[40px] sm:text-[52px] leading-[0.98] tracking-tightest text-ink">
        Book a seat
        <br />
        <em className="text-spark not-italic">down the rabbit hole.</em>
      </h1>

      <p className="text-ink2 text-[14.5px] leading-relaxed mt-6 max-w-[460px]">
        One-way ticket. API key in 60 seconds, 10K free traces on arrival, no
        credit card at the gate.
      </p>

      <ul className="mt-7 space-y-2.5 text-[13px] text-ink2">
        <Bullet>Free tier never expires, only scales when you do.</Bullet>
        <Bullet>Two-line SDK: <code className="font-mono text-[12px] text-spark">pip install each</code>.</Bullet>
        <Bullet>No card, no calendar invite, no sales call.</Bullet>
      </ul>

      <div className="mt-9">
        <OAuthButtons mode="signup" />
      </div>

      <div className="mt-10 grid grid-cols-3 items-center gap-3">
        <span className="h-px bg-rule2" />
        <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 text-center">
          or issue ticket by email
        </span>
        <span className="h-px bg-rule2" />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-6 flex items-stretch gap-2"
      >
        <label className="sr-only" htmlFor="signup4-email">
          Email
        </label>
        <input
          id="signup4-email"
          type="email"
          required
          placeholder="you@team.com"
          className="flex-1 px-4 py-3 bg-bg border border-rule2 rounded-md text-ink placeholder:text-ink3 text-[14px] focus:outline-none focus:border-spark/60"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-spark text-bg rounded-md text-[13.5px] font-medium whitespace-nowrap hover:bg-ember transition-colors"
        >
          Issue ticket →
        </button>
      </form>

      <p className="mt-4 font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3">
        ✱ no password, we send a one-tap link.
      </p>

      <p className="mt-9 text-ink3 text-[13px]">
        Already flown with us?{' '}
        <Link
          href="/signin4"
          className="text-ink hover:text-spark font-medium underline underline-offset-4 decoration-spark/40 hover:decoration-spark"
        >
          Re-board →
        </Link>
      </p>
    </AuthTicketShell>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden
        className="mt-[7px] w-1.5 h-1.5 rounded-sm bg-spark flex-shrink-0"
      />
      <span>{children}</span>
    </li>
  );
}
