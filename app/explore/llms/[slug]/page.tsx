import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodeBlock } from '@/components/ui/CodeBlock';
import {
  findLlmRouterModel,
  getRelatedLlmRouterModels,
  llmRouterModels,
} from '@/lib/llmRouter';
import { ReadmeSection } from '@/components/explore/ReadmeSection';
import { FaqSection } from '@/components/explore/FaqSection';
import { llmFaqsFallback, llmReadmeMarkdown } from '@/lib/catalogFaq';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return llmRouterModels.map((m) => ({ slug: m.urlSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const model = findLlmRouterModel(slug);
  if (!model) {
    return { title: 'LLM not found · each::labs' };
  }
  return {
    title: `${model.name} · LLMs · each::labs`,
    description: `${model.name} from ${model.providerName}, routed through the eachlabs-llm-router.`,
  };
}

export default async function LlmDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const model = findLlmRouterModel(slug);
  if (!model) notFound();

  const related = getRelatedLlmRouterModels(model);
  const readme = llmReadmeMarkdown(model);
  const faqs = llmFaqsFallback(model);

  const curlExample = [
    'curl -X POST https://api.eachlabs.ai/v1/prediction/eachlabs-llm-router \\',
    '  -H "Authorization: Bearer $EACHLABS_API_KEY" \\',
    '  -H "Content-Type: application/json" \\',
    '  -d \'{',
    '    "input": {',
    `      "model": "${model.routerSlug}",`,
    '      "messages": [',
    '        { "role": "user", "content": "Hello!" }',
    '      ]',
    '    }',
    '  }\'',
  ].join('\n');

  const tsExample = `import Eachlabs from '@eachlabs/sdk';

const client = new Eachlabs({ apiKey: process.env.EACHLABS_API_KEY });

const result = await client.predictions.create({
  model: 'eachlabs-llm-router',
  input: {
    model: '${model.routerSlug}',
    messages: [
      { role: 'user', content: 'Hello!' },
    ],
  },
});

console.log(result.output);
`;

  return (
    <>
      <section className="container py-12 md:py-16">
      <div className="font-mono text-eyebrow uppercase tracking-eyebrow text-ink-faint mb-6">
        <Link
          href="/explore?tab=llms"
          className="text-ink-faint hover:text-ink no-underline"
        >
          ← Explore · LLMs
        </Link>
      </div>

      <header className="flex flex-col gap-4 mb-10 pb-10 border-b border-divider">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-eyebrow uppercase tracking-eyebrow font-semibold px-2.5 py-1 rounded-md bg-surface-sunken text-ink-muted">
            {model.providerName}
          </span>
          {model.familySlug && (
            <Eyebrow as="span" tone="ink-faint" className="px-2.5 py-1 rounded-md border border-field">{model.familySlug}</Eyebrow>
          )}
          <Eyebrow as="span" size="sm" tone="ink-faint" className="ml-auto">via eachlabs-llm-router</Eyebrow>
        </div>
        <h1 className="font-sans font-semibold text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.025em] text-ink">
          {model.name}
        </h1>
        <p className="max-w-2xl text-body-lg leading-[1.6] text-ink-muted">
          {model.name} is available through the eachlabs LLM Router. The router
          handles authentication, retries, and provider fallback so you can
          target this model with a single API surface, no per-provider SDK
          required.
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <DetailStat label="Router slug" value={model.routerSlug} mono />
          <DetailStat label="Provider" value={model.providerName} />
          <DetailStat label="Model id" value={model.modelName} mono />
        </dl>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div className="flex flex-col gap-8 min-w-0">
          <section>
            <h2 className="font-sans text-h3 font-semibold tracking-[-0.02em] text-ink mb-4">
              Call it from cURL
            </h2>
            <CodeBlock code={curlExample} language="sh" filename="request.sh" />
          </section>

          <section>
            <h2 className="font-sans text-h3 font-semibold tracking-[-0.02em] text-ink mb-4">
              Call it from TypeScript
            </h2>
            <CodeBlock code={tsExample} language="ts" filename="route.ts" />
          </section>

          <section>
            <h2 className="font-sans text-h3 font-semibold tracking-[-0.02em] text-ink mb-4">
              Why route?
            </h2>
            <ul className="space-y-2 text-body leading-[1.6] text-ink-muted list-disc pl-5">
              <li>One key, one endpoint, swap models without rotating SDKs.</li>
              <li>
                Automatic retries and provider failover when {model.providerName}{' '}
                hits rate limits.
              </li>
              <li>Unified billing through eachlabs, pay-as-you-go.</li>
              <li>Drop-in observability, every call is traced in the dashboard.</li>
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-6 min-w-0">
          <div className="border border-field rounded-lg p-5">
            <Eyebrow size="sm" tone="ink-faint" className="mb-3">More from {model.providerName}</Eyebrow>
            {related.length === 0 ? (
              <p className="text-body-sm text-ink-faint">No siblings.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-field">
                {related.map((r) => (
                  <li key={r.routerSlug}>
                    <Link
                      href={`/explore/llms/${r.urlSlug}`}
                      className="block py-2.5 no-underline group"
                    >
                      <div className="text-body-sm font-semibold text-ink group-hover:text-brand transition-colors">
                        {r.name}
                      </div>
                      <div className="font-mono text-micro text-ink-faint truncate">
                        {r.routerSlug}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </section>

      <ReadmeSection
        markdown={readme}
        eyebrow="* README"
        heading={`Working with ${model.name}`}
      />

      <FaqSection
        faqs={faqs}
        eyebrow="* FAQ"
        heading={`About ${model.name}`}
      />
    </>
  );
}

function DetailStat({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border border-field rounded-md px-4 py-3 min-w-0">
      <dt className="font-mono text-micro uppercase tracking-eyebrow text-ink-faint mb-1">
        {label}
      </dt>
      <dd
        className={`text-body-sm text-ink truncate ${
          mono ? 'font-mono' : 'font-medium'
        }`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
