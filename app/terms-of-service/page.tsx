'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type Section = {
  id: string;
  title: string;
  body: { kind: 'p' | 'h3' | 'ul'; text?: string; items?: string[] }[];
};

const SECTIONS: Section[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    body: [
      {
        kind: 'p',
        text: 'These Terms of Service apply when accessing or purchasing services at eachlabs.ai. They constitute a binding agreement between Eachlabs, Inc. (a Delaware corporation) and users or customers. By accessing, using, or purchasing the Services, you consent to all terms and policies. If you disagree, do not use the Services.',
      },
      {
        kind: 'p',
        text: 'The company may update these Terms with 10 days\' notice; continued use indicates acceptance.',
      },
    ],
  },
  {
    id: 'definitions',
    title: 'Key definitions',
    body: [
      {
        kind: 'ul',
        items: [
          'Account, user-created account secured with a strong password for accessing the Services.',
          'Agreement / Terms, all binding documents including these Terms, Supplemental Terms, notices, policies, Order Forms, and Master Services Agreements.',
          'Inference API, hosted services enabling inference runs on machine learning models.',
          'Content, any material posted or accessed on the website, including code, data, text, graphics, images, applications, or software.',
          'Dataset, structured data collections used to train machine learning models.',
          'Eachlabs Inference, hosting platform for building, benchmarking, sharing, versioning, and deploying repositories containing Models, Datasets, and Applications.',
          'Model, pre-trained machine learning models including algorithms and weights for predictions.',
          'Repository, data structure containing project files and revision history; can be public (viewable by all, editable only by the owner / organization) or private (restricted access).',
          'Services, products and offerings including Open-Source Libraries, Inference API, AutoTrain, Expert Acceleration Program, Infinity, and Inference Endpoints.',
        ],
      },
    ],
  },
  {
    id: 'services',
    title: 'Services offered',
    body: [
      {
        kind: 'ul',
        items: [
          'Open-Source Libraries (Transformers, Datasets, Tokenizers)',
          'Public workflows for building and deploying Models and Applications',
          'Private workflows accessible only to user / organization',
          'Inference API Service for running inference on hosted models',
          'AutoTrain premium service for creating state-of-the-art Models from custom training data',
          'Expert Acceleration Program providing premium support',
          'Infinity Service for optimized inference pipelines',
          'Hardware Partner Program for hardware-specific optimization',
          'Inference Endpoints for deploying models on dedicated infrastructure',
        ],
      },
      {
        kind: 'p',
        text: 'The company reserves the right to modify, suspend, or discontinue Services temporarily or permanently, with or without notice, and disclaims liability for such actions.',
      },
    ],
  },
  {
    id: 'accounts',
    title: 'Account requirements',
    body: [
      {
        kind: 'p',
        text: 'Users must be at least 13 years old or a registered legal entity. Organization account creators represent they have authority to bind their organization.',
      },
      {
        kind: 'p',
        text: 'Account creation requires basic information: email address, password, username, full name, and optional details (avatar, interests, social network usernames, payment information). All information must be accurate and valid.',
      },
      { kind: 'h3', text: 'Security responsibility' },
      {
        kind: 'p',
        text: 'Users must maintain password confidentiality and are solely responsible for Account actions. Users must immediately notify the company of suspected security breaches, password loss, or unauthorized use.',
      },
    ],
  },
  {
    id: 'content',
    title: 'Content ownership and licensing',
    body: [
      { kind: 'h3', text: 'User responsibility' },
      {
        kind: 'p',
        text: 'Users are solely responsible for all Content they post or make available, and for any actions resulting from Service use.',
      },
      { kind: 'h3', text: 'Representation' },
      {
        kind: 'p',
        text: 'Users warrant they own, control, and have responsibility for Content posted, or have the right to do so. Content must not be misleading, unlawful, or violate Terms, applicable law, or infringe on others\' rights. The company may remove Content at its discretion.',
      },
      { kind: 'h3', text: 'Ownership' },
      {
        kind: 'p',
        text: 'Users own the Content they create; the company will not sell or use it beyond Terms provisions.',
      },
      { kind: 'h3', text: 'Granted licenses' },
      {
        kind: 'p',
        text: 'By posting Content, users grant the company a worldwide, royalty-free, and non-exclusive license to use, display, publish, reproduce, distribute, and make derivative works of such Content to provide Services.',
      },
      { kind: 'h3', text: 'Public repository license' },
      {
        kind: 'p',
        text: 'Setting a Repository public grants all users a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, display, publish, reproduce, distribute, and make derivative works of your Content.',
      },
      { kind: 'h3', text: 'Private repository protection' },
      {
        kind: 'p',
        text: 'Private Content receives reasonable confidentiality measures, though the company may access it per the Privacy Policy.',
      },
      { kind: 'h3', text: 'Open source licenses' },
      {
        kind: 'p',
        text: 'Content with open source licenses (such as Creative Commons) remains under those license terms; neither party may remove license references.',
      },
    ],
  },
  {
    id: 'ai-music',
    title: 'AI-generated music and audio (non-commercial use only)',
    body: [
      {
        kind: 'p',
        text: 'AI Music Features are provided strictly for non-commercial use unless expressly authorized in writing by Eachlabs.',
      },
      { kind: 'h3', text: 'Prohibited commercial uses' },
      {
        kind: 'ul',
        items: [
          'Selling, licensing, or monetizing generated music or audio',
          'Distribution on monetized platforms or services',
          'Use in advertising, marketing, branding, or promotional materials',
          'Use in commercial products, applications, games, films, or media',
          'Any use intended to generate revenue or commercial advantage',
        ],
      },
      { kind: 'h3', text: 'No ownership rights' },
      {
        kind: 'p',
        text: 'Eachlabs does not grant ownership rights, copyright interests, or commercial licenses in AI-generated outputs. Generated outputs may resemble existing works and are not guaranteed to be original or copyright-free.',
      },
      { kind: 'h3', text: 'User responsibility and liability' },
      {
        kind: 'p',
        text: 'Users are solely responsible for how AI-generated music or audio is used, shared, or distributed. Eachlabs assumes no liability for claims, disputes, damages, or losses arising from use, misuse, or distribution of AI-generated music or audio, including copyright or intellectual property claims. Use of AI Music Features is entirely at the user\'s own risk.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    body: [
      { kind: 'h3', text: 'Pricing' },
      {
        kind: 'p',
        text: 'Plans and fees are available at /pricing. Custom plans are subject to further negotiation and will be specified in the applicable Service Agreement or Order Form.',
      },
      { kind: 'h3', text: 'Taxes' },
      {
        kind: 'p',
        text: 'All fees are exclusive of applicable taxes, which users are solely responsible for paying.',
      },
      { kind: 'h3', text: 'Price adjustments' },
      {
        kind: 'p',
        text: 'The company reserves the right to adjust pricing. Prices remain fixed during initial subscription terms; adjusted fees apply only to new subscriptions.',
      },
      { kind: 'h3', text: 'Billing' },
      {
        kind: 'p',
        text: 'Plans are billed monthly in advance; usage-based fees are billed as incurred.',
      },
      { kind: 'h3', text: 'Payment processing' },
      {
        kind: 'p',
        text: 'Payment is processed via third-party payment processors. The processor\'s agreement governs the designated account or credit card, not these Terms. By providing payment information, users authorize immediate invoicing for all due fees without additional notice or consent.',
      },
      { kind: 'h3', text: 'Non-refundable fees' },
      {
        kind: 'p',
        text: 'All fees are non-refundable and exclusive of applicable taxes.',
      },
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    body: [
      {
        kind: 'p',
        text: 'Users may cancel Accounts at any time at their sole discretion. The company reserves the right to suspend or terminate access to Services anytime, with or without cause, and with or without notice.',
      },
      { kind: 'h3', text: 'Data deletion' },
      {
        kind: 'p',
        text: 'Upon Account cancellation, the company will use commercially reasonable efforts to delete your information and Content of your own Repositories, whether public or private, within 90 days. The company will not delete Content users contributed to others\' Repositories or copies made by the company or other users.',
      },
      { kind: 'h3', text: 'Information retention' },
      {
        kind: 'p',
        text: 'The company reserves the right to retain information for legal or regulatory compliance, standard archiving, recovery, backup processes, and per the Privacy Policy.',
      },
    ],
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality',
    body: [
      {
        kind: 'p',
        text: 'All information relating to these Terms or pre-execution negotiations shall be treated as confidential. During the Service Term and for at least one year thereafter, both parties agree to maintain strict confidentiality, use Confidential Information only for performing obligations or exercising rights under the Agreement, and use at least a reasonable standard of care in protecting it.',
      },
      { kind: 'h3', text: 'Exceptions' },
      {
        kind: 'ul',
        items: [
          'Independently developed by the receiving party (evidenced by written records)',
          'Lawfully received free of restriction from another source with the right to furnish it',
          'Becomes generally available to the public without breach by the receiving party',
          'Already known to the receiving party at disclosure time, free of restriction (evidenced by documentation)',
          'Confirmed by the disclosing party in writing to be free of restrictions',
          'Required to be disclosed in legal proceedings or upon governmental / regulatory request, or pursuant to legal requirement',
        ],
      },
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    body: [
      { kind: 'h3', text: 'Proprietary rights' },
      {
        kind: 'p',
        text: 'The company retains ownership of all intellectual property related to the website and Services, including all improvements. All company-produced materials (website, design, code, graphics, interfaces, trademarks, logos) remain the company\'s exclusive property. Users may not alter, reproduce, republish, or license company proprietary materials without express written permission. All rights not expressly granted are reserved by the company.',
      },
      { kind: 'h3', text: 'Feedback license' },
      {
        kind: 'p',
        text: 'If users provide feedback regarding the website, Services, or business functionality, they grant the company a perpetual, irrevocable, worldwide, royalty-free, and non-exclusive right and license to exploit and commercialize the Feedback and develop new offerings, which the company will solely own. The company may aggregate, anonymize, or learn from usage data, subject to the Privacy Policy.',
      },
      { kind: 'h3', text: 'DMCA policy' },
      {
        kind: 'p',
        text: 'The company complies with Digital Millennium Copyright Act requirements. Claims that website content violates intellectual property rights should be sent to support@eachlabs.ai with detailed, accurate information.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    body: [
      {
        kind: 'p',
        text: 'Services are provided in accordance with the company\'s Privacy Policy available at /privacy-policy.',
      },
    ],
  },
  {
    id: 'liability',
    title: 'Liability',
    body: [
      { kind: 'h3', text: 'Disclaimer of indirect damages' },
      {
        kind: 'p',
        text: 'Neither the company nor its Related Parties (affiliates, subsidiaries, contractors, licensors, officers, directors, agents, employees) are liable for indirect, incidental, consequential, punitive, special, or similar damages, including loss of revenue, profits, data, benefits, or savings, whether or not due to fault or negligence, regardless of advice about possible damages.',
      },
      { kind: 'h3', text: 'Liability cap' },
      {
        kind: 'p',
        text: 'Either party\'s aggregate liability will not exceed the amount paid by the user in the 12 months preceding the claim (or $5 for free services). This limitation does not apply to (1) liability from fraud, gross negligence, recklessness, or willful or criminal misconduct; (2) user liability for intellectual property infringement; (3) user liability for confidentiality breaches; or (4) amounts owed for Services under payment obligations.',
      },
    ],
  },
  {
    id: 'indemnity',
    title: 'Indemnity',
    body: [
      {
        kind: 'p',
        text: 'Users are solely and exclusively responsible for their Service use and agree to indemnify, defend, and hold harmless the company and Related Parties from all claims, liability, and expenses, including attorney\'s fees, arising out of or in connection with use of (or inability to use) the Services, including violations of Terms, law, or regulation, any user-posted Content or data, or any third-party use with user credentials. This does not apply to claims arising directly from Eachlabs\'s fraud, gross negligence, recklessness, or willful or criminal misconduct.',
      },
    ],
  },
  {
    id: 'warranty',
    title: 'Warranty disclaimers',
    body: [
      {
        kind: 'p',
        text: 'Except as expressly provided, Services and Content are provided "as is" and "as available." The company disclaims all warranties or guarantees, express or implied, including merchantability, non-infringement, quiet enjoyment, and fitness for a particular purpose. The company disclaims all warranties about accuracy, reliability, benefits of Services, artificial intelligence, Models, or other technology or Content, or that Services will meet requirements, be secure, uninterrupted, error-free, or virus-free.',
      },
    ],
  },
  {
    id: 'misc',
    title: 'Miscellaneous provisions',
    body: [
      { kind: 'h3', text: 'Governing law and dispute resolution' },
      {
        kind: 'p',
        text: 'These Terms are governed by New York State law, excluding choice of law rules. Disputes require parties to make reasonable and good faith effort to agree on an out-of-court solution. If unresolved, actions must be brought exclusively in New York state or federal courts. Any claim must be brought within one year of the event giving rise to it, or it is waived to the maximum extent permitted by law.',
      },
      { kind: 'h3', text: 'Assignment' },
      {
        kind: 'p',
        text: 'The company may assign or transfer rights and obligations to affiliates, successors, or other entities without user consent. Users may not assign or transfer without company consent.',
      },
      { kind: 'h3', text: 'Export control and sanctions' },
      {
        kind: 'p',
        text: 'Services are subject to U.S. and other applicable export control and sanctions laws. Users may only access and use Services in compliance with these laws and regulations.',
      },
      { kind: 'h3', text: 'Entire agreement' },
      {
        kind: 'p',
        text: 'These Terms, together with all policies and notices at eachlabs.ai and other binding documents, constitute the entire agreement and supersede all previous negotiations, proposals, commitments, writings, and oral statements. Standard form purchase orders differing from or adding to these Terms are expressly rejected.',
      },
      { kind: 'h3', text: 'Severability' },
      {
        kind: 'p',
        text: 'If any provision is held prohibited, invalid, void, or unenforceable, it will be stricken, and remaining provisions remain in full force and effect.',
      },
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-rule overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(var(--c-spark) / 0.06), transparent 65%)',
          }}
        />
        <div className="container py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          >
            <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
              * LEGAL
            </div>
            <h1 className="font-display font-semibold text-[40px] sm:text-[56px] lg:text-[68px] leading-[0.98] tracking-tightest text-ink mt-6">
              Terms of service.
            </h1>
            <p className="text-ink3 text-[14px] mt-5 font-mono uppercase tracking-eyebrow">
              Last updated · March 29, 2024 · contact: support@eachlabs.ai
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT, sticky TOC + body */}
      <section className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24">
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-4">
              ▸ Sections
            </div>
            <ul className="flex flex-col gap-2.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#${s.id}`}
                    className="text-[13px] text-ink2 hover:text-spark transition-colors"
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
                <h2 className="font-display font-semibold text-[24px] md:text-[28px] text-ink leading-snug mb-5">
                  {s.title}
                </h2>
                <div className="flex flex-col gap-4">
                  {s.body.map((b, i) => {
                    if (b.kind === 'h3') {
                      return (
                        <h3
                          key={i}
                          className="font-display font-medium text-[16px] text-ink mt-3"
                        >
                          {b.text}
                        </h3>
                      );
                    }
                    if (b.kind === 'p') {
                      return (
                        <p
                          key={i}
                          className="text-ink2 text-[15px] leading-[1.75]"
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
                            className="text-ink2 text-[14.5px] leading-[1.7] flex gap-3"
                          >
                            <span className="text-spark mt-1 shrink-0">·</span>
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
