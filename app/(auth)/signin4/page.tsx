import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthTicketShell } from '@/components/auth/AuthTicketShell';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export const metadata: Metadata = {
  title: 'Re-board · each::labs',
  description: 'Welcome back. Your seat is still warm.',
};

export default function Signin4Page() {
  return (
    <AuthTicketShell
      ticketLabel="Boarding pass · No. 0042 · Re-issue"
      ticketMeta="Gate 4 · Terminal A · 22:14"
      chapter="Chapter · IV / Return boarding"
      stubFields={[
        { label: 'Passenger', value: 'Returning explorer' },
        { label: 'Seat', value: '4F · window' },
        { label: 'Class', value: 'PRO tier · loyalty' },
        { label: 'From → To', value: 'here  →  each::run()' },
      ]}
      barcodeCode="EACH · 04 · 2026 · RET"
    >
      <h1 className="font-display font-semibold text-[40px] sm:text-[52px] leading-[0.98] tracking-tightest text-ink">
        Welcome
        <br />
        <em className="text-spark not-italic">back on board.</em>
      </h1>

      <p className="text-ink2 text-[14.5px] leading-relaxed mt-6 max-w-[460px]">
        Your seat is still warm. Same key, same{' '}
        <code className="font-mono text-[13px] text-spark">each.run()</code>,
        pick up exactly where you left off.
      </p>

      <div className="mt-9">
        <OAuthButtons mode="signin" />
      </div>

      <div className="mt-10 grid grid-cols-3 items-center gap-3">
        <span className="h-px bg-rule2" />
        <span className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 text-center">
          or show passport
        </span>
        <span className="h-px bg-rule2" />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-6 flex items-stretch gap-2"
      >
        <label className="sr-only" htmlFor="signin4-email">
          Email
        </label>
        <input
          id="signin4-email"
          type="email"
          required
          placeholder="you@team.com"
          className="flex-1 px-4 py-3 bg-bg border border-rule2 rounded-md text-ink placeholder:text-ink3 text-[14px] focus:outline-none focus:border-spark/60"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-ink text-bg rounded-md text-[13.5px] font-medium whitespace-nowrap hover:bg-spark hover:text-bg transition-colors"
        >
          Send magic link →
        </button>
      </form>

      <p className="mt-9 text-ink3 text-[13px]">
        First time flying?{' '}
        <Link
          href="/signup4"
          className="text-ink hover:text-spark font-medium underline underline-offset-4 decoration-spark/40 hover:decoration-spark"
        >
          Book your seat →
        </Link>
      </p>
    </AuthTicketShell>
  );
}
