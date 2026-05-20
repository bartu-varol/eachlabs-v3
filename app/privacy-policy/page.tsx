'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eyebrow } from '@/components/ui/Eyebrow';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Section = {
  id: string;
  title: string;
  body: { kind: 'p' | 'h3' | 'ul'; text?: string; items?: string[] }[];
};

const SECTIONS: Section[] = [
  {
    id: 'info-we-collect',
    title: '1. Information we collect',
    body: [
      { kind: 'h3', text: 'A. Information you provide directly' },
      {
        kind: 'p',
        text: 'Users provide information when setting up accounts, including email address, password, username, full name, and optional details. Payment information may be collected for paid upgrades, along with posted content and communications with the company.',
      },
      { kind: 'h3', text: 'B. Information we collect from third parties' },
      {
        kind: 'p',
        text: 'The company may collect information from third parties that help deliver Services or process information.',
      },
      { kind: 'h3', text: 'C. Information we automatically collect from your use of the Services' },
      {
        kind: 'p',
        text: 'The company automatically records information about your use of the Services, your session (date, location), your IP address, and device details including type, model, and operating system.',
      },
      { kind: 'h3', text: 'D. Cookies' },
      {
        kind: 'p',
        text: 'Cookies are used for delivering, updating, monitoring, improving the Services, and maintaining security. Disabling cookies prevents service access.',
      },
      { kind: 'h3', text: 'E. "Do Not Track"' },
      {
        kind: 'p',
        text: 'The company honors do-not-track signals and does not track or use cookies when such mechanisms are active. California residents may request information about third party disclosures by contacting support@eachlabs.ai.',
      },
    ],
  },
  {
    id: 'use-of-information',
    title: '2. Use of information',
    body: [
      {
        kind: 'p',
        text: 'The company uses information to deliver Services, improve operations, conduct research, communicate with users, maintain security, protect rights, enforce agreements, and comply with legal obligations.',
      },
      { kind: 'h3', text: 'Grounds for the use of information' },
      {
        kind: 'p',
        text: 'Processing bases include user consent upon account creation, contractual obligations, and legitimate interests such as legal or regulatory compliance, security control, and business operations.',
      },
    ],
  },
  {
    id: 'sharing',
    title: '3. Sharing of information',
    body: [
      { kind: 'h3', text: 'A. Affiliates' },
      {
        kind: 'p',
        text: 'Information may be shared with legally affiliated companies or during mergers and acquisitions.',
      },
      { kind: 'h3', text: 'B. Third party service providers' },
      {
        kind: 'p',
        text: 'Companies providing limited services must maintain confidentiality and cannot use information for other purposes.',
      },
      { kind: 'h3', text: 'C. With your consent' },
      { kind: 'p', text: 'Users may consent to information disclosure upon request.' },
      { kind: 'h3', text: 'D. For security and safety purposes' },
      {
        kind: 'p',
        text: 'Information may be disclosed without consent for fraud prevention and protecting rights or safety.',
      },
      { kind: 'h3', text: 'E. For legal or regulatory purposes' },
      {
        kind: 'p',
        text: 'Information may be disclosed to comply with laws, regulations, and governmental requests.',
      },
      { kind: 'h3', text: 'F. Anonymous information' },
      {
        kind: 'p',
        text: 'Aggregated, non-identifying information may be disclosed to third parties, including advertisers and partners, for purposes including, but not limited to, targeting advertisements.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: '4. Your rights',
    body: [
      { kind: 'h3', text: 'A. Access your information' },
      {
        kind: 'p',
        text: 'Users may access, modify, or delete information by editing profiles. Additional requests should be directed to support@eachlabs.ai.',
      },
      { kind: 'h3', text: 'B. Data retention' },
      {
        kind: 'p',
        text: 'Information is retained as long as necessary to deliver the Services, to comply with any applicable legal requirements. Users may request erasure by contacting support@eachlabs.ai.',
      },
    ],
  },
  {
    id: 'data-security',
    title: '5. Data security',
    body: [
      {
        kind: 'p',
        text: 'The company follows generally accepted industry standards, including the use of appropriate administrative, physical, and technical safeguards. However, no method is fully secure. Users are responsible for device and password security.',
      },
    ],
  },
  {
    id: 'data-transfers',
    title: '6. Location of processing and data transfers',
    body: [
      {
        kind: 'p',
        text: 'The company and servers are located in the United States. Personal information may be stored and processed in the United States or any other country where the company maintains facilities.',
      },
    ],
  },
  {
    id: 'children',
    title: '7. Children\'s privacy',
    body: [
      {
        kind: 'p',
        text: 'Services are not directed to children under 13. The company will delete information collected from children under 13 without verifiable parental consent.',
      },
    ],
  },
  {
    id: 'communications',
    title: '8. Communications and CAN-SPAM Act',
    body: [
      {
        kind: 'p',
        text: 'The company collects email addresses to send information and respond to inquiries. Communications include business location and honor unsubscribe requests.',
      },
    ],
  },
  {
    id: 'contact',
    title: '9. Contact us',
    body: [{ kind: 'p', text: 'Questions should be directed to support@eachlabs.ai.' }],
  },
  {
    id: 'subprocessors',
    title: '10. List of third party service providers',
    body: [
      {
        kind: 'ul',
        items: [
          'Stripe, payment · United States',
          'Google / Gsuite, payment · United States',
          'Google Cloud Platform, hosting / infrastructure · United States / EMEA',
          'Docker.io, hosting / infrastructure · United States / EMEA',
          'GitHub, hosting code · United States',
          'Amazon Web Services, hosting / infrastructure · United States',
          'Google Analytics, analytics · United States',
          'Slack Technologies, communication · United States',
        ],
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-divider overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--brand) / 0.06), transparent 65%)',
          }}
        />
        <div className="container py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <Eyebrow>* LEGAL</Eyebrow>
            <h1 className="font-sans font-semibold text-display sm:text-display-lg lg:text-hero leading-[0.98] tracking-tightest text-ink mt-6">
              Privacy policy.
            </h1>
            <p className="text-ink-faint text-body mt-5 font-mono uppercase tracking-eyebrow">
              Last updated · 2026 · contact: support@eachlabs.ai
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT, sticky TOC + body */}
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24">
            <Eyebrow size="sm" tone="ink-faint" className="mb-4">▸ Sections</Eyebrow>
            <ul className="flex flex-col gap-2.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#${s.id}`}
                    className="text-body-sm text-ink-muted hover:text-brand transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Body */}
          <article className="flex flex-col gap-12">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="font-sans font-semibold text-h3 md:text-h2 text-ink leading-snug mb-5">
                  {s.title}
                </h2>
                <div className="flex flex-col gap-4">
                  {s.body.map((b, i) => {
                    if (b.kind === 'h3') {
                      return (
                        <h3
                          key={i}
                          className="font-sans font-medium text-body-lg text-ink mt-3"
                        >
                          {b.text}
                        </h3>
                      );
                    }
                    if (b.kind === 'p') {
                      return (
                        <p
                          key={i}
                          className="text-ink-muted text-body-lg leading-[1.75]"
                        >
                          {b.text}
                        </p>
                      );
                    }
                    return (
                      <ul key={i} className="flex flex-col gap-2.5 mt-1">
                        {b.items?.map((item) => (
                          <li
                            key={item}
                            className="text-ink-muted text-body leading-[1.7] flex gap-3"
                          >
                            <span className="text-brand mt-1 shrink-0">·</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  })}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
