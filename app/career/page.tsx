'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Briefcase, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Role = {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  blurb: string;
};

const HRPANDA = 'https://eachlabs.hrpanda.co';

const ROLES: Role[] = [
  {
    title: 'Fullstack Product Engineer',
    slug: 'fullstack-product-engineer-golang-react',
    department: 'Development',
    location: 'Remote',
    type: 'Full-Time',
    experience: '5+ years',
    blurb:
      'Golang on the backend, React on the front. Own features end to end, ship to production every week.',
  },
  {
    title: 'Product Engineer',
    slug: 'product-engineer',
    department: 'Development',
    location: 'Remote',
    type: 'Full-Time',
    experience: '2+ years',
    blurb:
      'Build the product surfaces customers actually use. Strong taste, fast iteration, no committee design.',
  },
  {
    title: 'Customer Support (Technical / play with AI models)',
    slug: 'customer-support-technical-play-with-ai-models',
    department: 'Customer Service',
    location: 'Remote',
    type: 'Full-Time',
    experience: '2+ years',
    blurb:
      'Talk to developers shipping AI to production. Read code, reproduce bugs, ship docs and small fixes.',
  },
  {
    title: 'Sales Development Representative',
    slug: 'sales-development-representative-4',
    department: 'Sales and Marketing',
    location: 'Remote',
    type: 'Full-Time',
    experience: '2+ years',
    blurb:
      'First voice teams hear when they evaluate each::labs. Curious, technical-enough, allergic to scripts.',
  },
];

export default function CareerPage() {
  return (
    <>
      <PageHero
        eyebrow="* CAREERS"
        headline={
          <>
            <span className="block">Build the rails</span>
            <span className="block text-ink-faint italic">for production AI.</span>
          </>
        }
        description="each::labs is a small, distributed team building the orchestration and observability layer for teams shipping AI to real users. We hire people who care about the craft and move fast without breaking things that matter."
      />

      {/* ─── Open roles ─────────────────────────────────────────────────── */}
      <section className="border-t border-divider" id="open-roles">
        <div className="container py-20 md:py-24">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <Eyebrow size="sm" tone="ink-faint" className="mb-3">OPEN ROLES</Eyebrow>
              <h2 className="font-sans font-semibold text-h2 md:text-display leading-[1.05] tracking-tightest text-ink">
                We're hiring for {ROLES.length} roles.
              </h2>
            </div>
            <span className="font-mono text-eyebrow text-ink-faint">
              applications powered by hrpanda.co
            </span>
          </div>

          <ul className="mt-10 border-t border-divider">
            {ROLES.map((role, i) => (
              <motion.li
                key={role.slug}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="border-b border-divider"
              >
                <a
                  href={`${HRPANDA}/${role.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-5 md:gap-8 items-start md:items-center py-7 md:py-8 hover:bg-surface-raised transition-colors -mx-3 px-3 rounded-md"
                >
                  <div>
                    <h3 className="font-sans font-semibold text-h4 md:text-h3 text-ink leading-tight group-hover:text-brand transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-ink-muted text-body leading-[1.55] mt-2 max-w-[520px]">
                      {role.blurb}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase size={12} /> {role.department}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} /> {role.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} /> {role.experience}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase tracking-eyebrow text-ink-muted group-hover:text-brand transition-colors whitespace-nowrap">
                    Apply
                    <ArrowUpRight size={14} />
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Don't see your role ────────────────────────────────────────── */}
      <section className="border-t border-divider">
        <div className="container py-20 md:py-24">
          <div className="bg-surface-raised border border-field rounded-md p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 md:gap-12 items-center">
            <div>
              <Eyebrow size="sm" className="mb-3">* DIDN'T SEE YOUR ROLE</Eyebrow>
              <h2 className="font-sans font-semibold text-h2 md:text-h2 leading-[1.05] tracking-tightest text-ink">
                Send us a note anyway.
              </h2>
              <p className="text-ink-muted text-body-lg leading-[1.6] mt-4 max-w-[520px]">
                If you'd be a strong fit and the listing isn't there yet, write to us. We read
                everything, and we've hired people who emailed us before the role existed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:items-stretch">
              <Button href="mailto:careers@eachlabs.ai" variant="primary">
                careers@eachlabs.ai
              </Button>
              <Button href="/about" variant="secondary">
                Learn about us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
