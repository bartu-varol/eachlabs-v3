import Link from 'next/link';
import { footer } from '@/lib/content';
import { Wordmark } from '@/components/ui/Wordmark';
import { PulseDot } from '@/components/ui/PulseDot';
import { Eyebrow } from '@/components/ui/Eyebrow';

function FooterLink({ label }: { label: string }) {
  if (label.startsWith('each::')) {
    return (
      <>
        <span className="text-ink-faint">each::</span>
        {label.slice(6)}
      </>
    );
  }
  return <>{label}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-divider pt-12 pb-8 bg-surface">
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1.2fr_repeat(6,minmax(0,1fr))] gap-8">
          <div className="col-span-2 sm:col-span-3 md:col-span-1 flex flex-col gap-3">
            <Wordmark />
            <p className="text-body text-ink-muted max-w-[280px] leading-[1.5]">
              {footer.tagline}
            </p>
            <Eyebrow as="span" tone="ink-faint" className="mt-2">{footer.city}</Eyebrow>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <Eyebrow size="sm" tone="ink-faint" className="mb-4">{col.title}</Eyebrow>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => {
                  const isExternal = link.href.startsWith('http');
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="text-body-sm text-ink-muted hover:text-ink transition-colors"
                      >
                        <FooterLink label={link.label} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-divider mt-12 pt-6 flex flex-col md:flex-row md:flex-wrap justify-between items-start md:items-center gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-mono text-eyebrow text-ink-faint">{footer.copyright}</span>
            {footer.legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-eyebrow text-ink-faint hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* AI agent pointer — quiet by default, AI crawlers still see it
              because it's plain DOM with a discoverable label + .txt href. */}
          <Link
            href="/llm.txt"
            className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint hover:text-brand transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden>«</span>
            <span>I am AI agent · llm.txt</span>
            <span aria-hidden>→</span>
          </Link>

          <span className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-muted">
            <PulseDot />
            <span>
              <span className="text-brand">*</span>{' '}99.99% · all systems operational
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
