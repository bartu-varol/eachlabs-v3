import Link from 'next/link';
import { footer } from '@/lib/content';
import { Wordmark } from '@/components/ui/Wordmark';
import { PulseDot } from '@/components/ui/PulseDot';

function FooterLink({ label }: { label: string }) {
  if (label.startsWith('each::')) {
    return (
      <>
        <span className="text-ink3">each::</span>
        {label.slice(6)}
      </>
    );
  }
  return <>{label}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-rule pt-12 pb-8 bg-bg">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-8">
          <div className="flex flex-col gap-3">
            <Wordmark />
            <p className="text-[14px] text-ink2 max-w-[280px] leading-[1.5]">
              {footer.tagline}
            </p>
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mt-2">
              {footer.city}
            </span>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-4">
                {col.title}
              </div>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-ink2 hover:text-ink transition-colors"
                    >
                      <FooterLink label={link.label} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-rule mt-12 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <span className="font-mono text-[11px] text-ink3">{footer.copyright}</span>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
            <PulseDot />
            <span>
              <span className="text-spark">*</span>{' '}99.99% · all systems operational
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
