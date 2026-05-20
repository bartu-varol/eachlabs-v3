'use client';

import Link from 'next/link';
import { providers } from '@/lib/catalog';
import { llmRouterModels } from '@/lib/llmRouter';
import { Eyebrow } from '@/components/ui/Eyebrow';

export type TabHeroTab = 'MODELS' | 'WORKFLOWS' | 'TRENDS' | 'LLMS';

type Props = {
  tab: TabHeroTab;
  workflowCount?: number;
  trendsCount?: number;
  /** Switch tabs from a CTA without leaving the page. */
  onSwitchTab: (tab: TabHeroTab) => void;
};

export function TabHero({ tab, workflowCount, trendsCount, onSwitchTab }: Props) {
  if (tab === 'WORKFLOWS') {
    return (
      <Frame eyebrow="* WORKFLOW TEMPLATES" title="Pre-wired recipes." subtitle="Fork. Ship. Iterate.">
        <p className="text-body-lg md:text-body-lg text-ink-muted leading-[1.55] max-w-[680px] mt-6">
          Every template wires multiple models behind a single call. Fallbacks tuned, prices pinned,
          observability on.
          {workflowCount && workflowCount > 0 ? (
            <>
              {' '}
              <strong className="text-ink">{workflowCount}+</strong> public workflows running in
              production today.
            </>
          ) : null}
        </p>
        <Ctas
          primary={{ href: 'https://docs.eachlabs.ai/introduction', label: 'Read the API docs' }}
          secondary={{ label: 'Browse models', onClick: () => onSwitchTab('MODELS') }}
        />
      </Frame>
    );
  }

  if (tab === 'TRENDS') {
    return (
      <Frame eyebrow="* TRENDS" title="What people are remixing." subtitle="Right now.">
        <p className="text-body-lg md:text-body-lg text-ink-muted leading-[1.55] max-w-[680px] mt-6">
          The recipes others are forking, remixing, and shipping this week.
          {trendsCount && trendsCount > 0 ? (
            <>
              {' '}
              <strong className="text-ink">{trendsCount}</strong> trending workflows, refreshed
              continuously.
            </>
          ) : null}
        </p>
        <Ctas
          primary={{ label: 'Browse all workflows', onClick: () => onSwitchTab('WORKFLOWS') }}
          secondary={{ label: 'Browse models', onClick: () => onSwitchTab('MODELS') }}
        />
      </Frame>
    );
  }

  if (tab === 'LLMS') {
    return (
      <Frame eyebrow="* LLM ROUTER" title="Every LLM," subtitle="one signature.">
        <p className="text-body-lg md:text-body-lg text-ink-muted leading-[1.55] max-w-[680px] mt-6">
          <strong className="text-ink">{llmRouterModels.length}</strong> chat models from frontier
          providers, served through <code className="font-mono text-brand">eachlabs-llm-router</code>.
          Failover, retries, and one bill, no per-provider keys.
        </p>
        <Ctas
          primary={{ href: 'https://docs.eachlabs.ai/introduction', label: 'Read the API docs' }}
          secondary={{ label: 'Browse models', onClick: () => onSwitchTab('MODELS') }}
        />
      </Frame>
    );
  }

  // MODELS (default)
  return (
    <Frame
      eyebrow="* THE CATALOG"
      title="Every model worth shipping."
      subtitle="Plus the recipes that wire them up."
    >
      <p className="text-body-lg md:text-body-lg text-ink-muted leading-[1.55] max-w-[680px] mt-6">
        600+ models from {providers.length} providers, image, video, audio, text, all behind one{' '}
        <code className="font-mono text-brand">each()</code>.
        {workflowCount && workflowCount > 0 ? (
          <>
            {' '}Plus <strong className="text-ink">{workflowCount}+</strong> pre-wired workflow
            templates you can fork into your account.
          </>
        ) : (
          <> Plus production-ready workflow templates you can fork into your account.</>
        )}
      </p>
      <Ctas
        primary={{ href: 'https://docs.eachlabs.ai/introduction', label: 'Read the API docs' }}
        secondary={{ label: 'Browse templates', onClick: () => onSwitchTab('WORKFLOWS') }}
      />
    </Frame>
  );
}

function Frame({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container py-14 md:py-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-sans font-semibold text-display md:text-[80px] leading-[0.95] tracking-tightest text-ink mt-4 max-w-[820px]">
        {title}
        <span className="block text-ink-faint">{subtitle}</span>
      </h1>
      {children}
    </section>
  );
}

type CtaSpec = { label: string } & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

function Ctas({ primary, secondary }: { primary: CtaSpec; secondary: CtaSpec }) {
  return (
    <div className="flex flex-wrap gap-3 mt-8">
      <CtaButton spec={primary} variant="primary" />
      <CtaButton spec={secondary} variant="secondary" />
    </div>
  );
}

function CtaButton({ spec, variant }: { spec: CtaSpec; variant: 'primary' | 'secondary' }) {
  const classes =
    variant === 'primary'
      ? 'inline-flex items-center gap-2 px-5 py-3 bg-brand text-on-brand rounded-md text-body-sm font-semibold no-underline hover:bg-brand-deep transition-colors'
      : 'inline-flex items-center gap-2 px-5 py-3 border border-field rounded-md text-body-sm font-semibold text-ink no-underline hover:bg-surface-raised hover:border-brand/40 transition-colors';
  if ('href' in spec && spec.href) {
    return (
      <Link href={spec.href} className={classes}>
        {spec.label} <span aria-hidden>→</span>
      </Link>
    );
  }
  return (
    <button type="button" onClick={spec.onClick} className={classes}>
      {spec.label} <span aria-hidden>→</span>
    </button>
  );
}
