import {
  type CatalogFaq,
  type CatalogProvider,
  type CatalogFamily,
  providerFaqs,
  familyFaqs,
  formatPrice,
  formatLatency,
  displayName,
} from './catalog';
import type { LlmRouterModel } from './llmRouter';

// FaqSection renders `answer` via dangerouslySetInnerHTML, so all generated
// answers below ship as HTML (matches DB rows).

function p(html: string): string {
  return `<p>${html}</p>`;
}

function makeFaq(
  providerSlug: string,
  familySlug: string | null,
  question: string,
  answer: string,
  sequence: number,
): CatalogFaq {
  return { providerSlug, familySlug, question, answer, sequence };
}

export function providerFaqsWithFallback(provider: CatalogProvider, modelCount: number, familyCount: number): CatalogFaq[] {
  const real = providerFaqs(provider.slug);
  if (real.length > 0) return real;

  const name = provider.name;
  return [
    makeFaq(provider.slug, null, `What is ${name}?`,
      p(provider.description ??
        `${name} is one of 40+ AI providers available on each::labs. We expose ${name}'s models behind a single API surface so you can call them without managing a separate SDK or key.`),
      10),
    makeFaq(provider.slug, null, `How do I use ${name} models on each::labs?`,
      p(`Pick any ${name} model from the catalog, copy the cURL or SDK snippet from the model page, and call it with your each::labs API key. There's no per provider auth, no per provider client.`),
      20),
    makeFaq(provider.slug, null, `What models from ${name} are available?`,
      p(`${modelCount} ${name} model${modelCount === 1 ? '' : 's'} across ${familyCount} famil${familyCount === 1 ? 'y' : 'ies'} are live on each::labs today. New versions are pinned as ${name} ships them.`),
      30),
    makeFaq(provider.slug, null, `How is ${name} priced on each::labs?`,
      p(`Pay as you go, per call. Each ${name} model has its own price, shown on the model page. There's no platform markup on top of provider cost, you pay one bill, in USD, through each::labs.`),
      40),
    makeFaq(provider.slug, null, `What happens if ${name} has an outage?`,
      p(`each::labs ships an automatic router with provider fallback. Configure a backup model from another provider in your call config, and we'll fail over the moment ${name} returns 5xx or times out, no code changes, no pages.`),
      50),
  ];
}

export function familyFaqsWithFallback(provider: CatalogProvider, family: CatalogFamily, variantCount: number): CatalogFaq[] {
  const real = familyFaqs(provider.slug, family.slug);
  if (real.length > 0) return real;

  const fname = family.name;
  return [
    makeFaq(provider.slug, family.slug, `What is the ${fname} family?`,
      p(family.description ??
        `${fname} is a family of ${variantCount} model${variantCount === 1 ? '' : 's'} from ${provider.name}, all sharing the same input contract on each::labs. Switch between variants by changing one string.`),
      10),
    makeFaq(provider.slug, family.slug, `Which ${fname} variant should I use?`,
      p(`Start with the most popular variant for cost-sensitive work, move to the pro / 4K / large variant when quality matters more than latency. Every variant in this family takes the same inputs, so promotion is a one line change.`),
      20),
    makeFaq(provider.slug, family.slug, `How do I switch between ${fname} variants?`,
      p(`Change the model slug in your call. The input shape, output shape, and call signature are identical across the family, your client code stays the same.`),
      30),
    makeFaq(provider.slug, family.slug, `How is ${fname} priced?`,
      p(`Each variant has its own per call price, listed on its model page. You pay only for what you run, in one each::labs invoice.`),
      40),
    makeFaq(provider.slug, family.slug, `Can I fall back from ${fname} to another model?`,
      p(`Yes. The each::labs router supports cross family and cross provider failover. Pick a backup model in your call config and we'll route around outages automatically.`),
      50),
  ];
}

export type ModelFaqInput = {
  slug: string;
  name: string;
  title: string | null;
  description: string | null;
  /** Average price per call in USD, when known. */
  avgPrice: number | null;
  /** Average response time in seconds, when known. */
  avgResponseSec: number | null;
  providerSlug: string;
  providerName: string;
  familySlug: string | null;
  familyName: string | null;
};

export function modelFaqsFallback(model: ModelFaqInput): CatalogFaq[] {
  const mname = displayName({ name: model.name, title: model.title });
  const price = formatPrice({ avgPrice: model.avgPrice });
  const latency = formatLatency({ avgResponseSec: model.avgResponseSec });
  const familyLine = model.familyName ? ` It's part of the ${model.familyName} family.` : '';

  return [
    makeFaq(model.providerSlug, model.familySlug, `What is ${mname}?`,
      p((model.description ?? `${mname} is a ${model.providerName} model available on the each::labs API.`) + familyLine),
      10),
    makeFaq(model.providerSlug, model.familySlug, `How do I call ${mname} from the each::labs API?`,
      p(`Use the cURL or SDK snippet on this page. Authenticate with your each::labs API key, pass <code>${model.slug}</code> as the model, and supply the inputs shown above.`),
      20),
    makeFaq(model.providerSlug, model.familySlug, `How much does ${mname} cost?`,
      p(price === '-'
        ? `Pricing for ${mname} is shown in the sidebar, pay as you go, per call, no platform markup.`
        : `${mname} runs at <strong>${price}</strong> per call on average. Pricing is pay as you go with no platform markup.`),
      30),
    makeFaq(model.providerSlug, model.familySlug, `How fast is ${mname}?`,
      p(latency === '-'
        ? `Latency varies by input size and queue depth. Real time numbers per call are visible in your each::labs traces.`
        : `${mname} averages around <strong>${latency}</strong> per call. Per call traces with full timing breakdowns are visible in the each::labs dashboard.`),
      40),
    makeFaq(model.providerSlug, model.familySlug, `Can I fall back to another model if ${mname} fails?`,
      p(`Yes. each::labs ships automatic provider fallback, configure a backup in your call config and we'll route around outages or timeouts without your client code changing.`),
      50),
  ];
}

export function llmFaqsFallback(model: LlmRouterModel): CatalogFaq[] {
  return [
    makeFaq(model.providerSlug, null, `What is ${model.name}?`,
      p(`${model.name} is a large language model from ${model.providerName}, exposed through the eachlabs-llm-router. You target it with a single API and a single key, no ${model.providerName}-specific SDK required.`),
      10),
    makeFaq(model.providerSlug, null, `How do I call ${model.name} on each::labs?`,
      p(`Send a request to the <code>eachlabs-llm-router</code> endpoint with <code>${model.routerSlug}</code> as the <code>model</code> input. The cURL and TypeScript snippets above show the full call.`),
      20),
    makeFaq(model.providerSlug, null, `Why use the LLM Router instead of calling ${model.providerName} directly?`,
      p(`One key, one endpoint, one bill. The router handles authentication, retries, automatic failover when ${model.providerName} rate limits or times out, and traces every call in your each::labs dashboard.`),
      30),
    makeFaq(model.providerSlug, null, `Can I fall back to another LLM if ${model.name} is unavailable?`,
      p(`Yes. The router supports cross provider failover, list backup models in your call config and we'll switch the moment ${model.providerName} returns an error.`),
      40),
    makeFaq(model.providerSlug, null, `How is ${model.name} billed?`,
      p(`Pay as you go through your each::labs invoice. Token level usage is recorded against the provider's published price; there's no platform markup.`),
      50),
    makeFaq(model.providerSlug, null, `Is ${model.name} available in production?`,
      p(`Yes. The router is the same path each::labs uses internally, no preview gates, no waitlists. Once your each::labs account is active, you can call ${model.name} from production immediately.`),
      60),
  ];
}

export function exploreFaqs(workflowCount: number): CatalogFaq[] {
  const models = '600+';
  const flows = workflowCount > 0 ? workflowCount.toLocaleString() : 'hundreds of';
  return [
    makeFaq('explore', null, 'What is the each::labs catalog?',
      p(`A unified directory of every AI model and workflow live on each::labs, ${models} models from 40+ providers and ${flows} ready to run workflows, all behind one API key.`),
      10),
    makeFaq('explore', null, 'How do models, LLMs and workflows differ?',
      p('<strong>Models</strong> are single-purpose endpoints (image, video, audio, transcription). <strong>LLMs</strong> are the chat models served through the eachlabs-llm-router. <strong>Workflows</strong> chain multiple models together into a single API call you can ship straight to production.'),
      20),
    makeFaq('explore', null, 'Do I need a separate account for each provider?',
      p('No. One each::labs key unlocks every provider in the catalog. No OpenAI key, no Replicate key, no Fal key, we own the upstream auth.'),
      30),
    makeFaq('explore', null, 'How is pricing handled across providers?',
      p('Pay as you go, per call, in USD. Each model card shows its own price and there is no platform markup on top of the provider cost. You get one invoice, regardless of how many providers you mix.'),
      40),
    makeFaq('explore', null, 'Can I run a workflow without writing glue code?',
      p('Yes. Every workflow in the catalog exposes a single HTTP endpoint. Send the inputs, get the final output, we orchestrate model to model handoffs, retries, and failover on the server.'),
      50),
    makeFaq('explore', null, 'What happens when a provider goes down?',
      p('The each::labs router supports automatic cross provider failover. Configure a backup model in your call config and we route around 5xx errors or timeouts without any client-side changes.'),
      60),
    makeFaq('explore', null, 'How often is the catalog updated?',
      p('Continuously. New model versions are pinned as providers ship them, and workflows are published by the each::labs team and verified partners. Trending picks bubble to the top of the explore feed.'),
      70),
  ];
}

export const exploreReadmeMd = `## What lives in the catalog

The each::labs catalog is the single source of truth for every AI surface you can call through our API:

- **Models**, image, video, audio, transcription, and embedding endpoints from 40+ providers.
- **LLMs**, chat models served through the \`eachlabs-llm-router\` with one unified contract.
- **Workflows**, multi step recipes that chain several models into one production ready endpoint.

Every entry has a live model card with inputs, outputs, pricing, latency, and a copy-paste cURL / TypeScript snippet.

## How to navigate

1. **Browse by tab.** Switch between Models, LLMs, Workflows, and Trends at the top of the page.
2. **Filter by provider or category.** The sidebar narrows the grid in real time, no page reload.
3. **Search by capability.** Type what you want to do ("upscale image", "voice clone", "video lipsync") and the catalog surfaces what fits.

## How to ship from a card

Open any card, copy the snippet, swap in your each::labs API key, and call it. The same call signature works in cURL, TypeScript, Python, Go, and any HTTP client.

## Why everything is in one place

- **One key, one bill.** No per provider auth juggling, no rate limit arbitrage, no separate invoices.
- **Pinned versions.** When a provider ships a new model, we pin the version and keep the old one alive, your code never breaks silently.
- **Automatic failover.** Configure a backup model and the router fails over the moment your primary returns an error.
- **Unified observability.** Every call lands in your each::labs traces with latency, cost, and token usage broken out per request.

## Production notes

- All endpoints are the same path each::labs uses internally, no preview gates, no waitlists.
- Streaming, tool calls, and structured outputs are passed through to providers as-is where supported.
- Workflows run server-side; you do not need to host any orchestration layer.
`;

export function llmReadmeMarkdown(model: LlmRouterModel): string {
  return `## About ${model.name}

${model.name} is a large language model from **${model.providerName}**, available through the each::labs LLM Router. You call it with a single API surface, the router handles authentication, retries, and provider failover so your code stays portable.

## Quick start

1. Grab your each::labs API key from the dashboard.
2. POST to \`https://api.eachlabs.ai/v1/prediction/eachlabs-llm-router\`.
3. Pass \`${model.routerSlug}\` as the \`model\` input alongside your messages array.

The cURL and TypeScript snippets above are ready to copy.

## Why route through eachlabs

- **One API, many models.** Switch from ${model.name} to any other LLM by changing one string, no SDK rotation.
- **Automatic failover.** Configure a backup model and the router fails over the moment ${model.providerName} returns an error or times out.
- **Unified observability.** Every call lands in your each::labs traces with latency, token usage, and cost broken out per request.
- **One invoice.** Pay as you go in USD, no platform markup on top of the provider's published price.

## Production notes

- The router is the same path each::labs uses internally, no preview gates.
- Streaming, system prompts, and tool calls are passed through to ${model.providerName} as-is.
- Rate limits follow ${model.providerName}'s upstream limits; the router queues and retries on transient 429s automatically.
`;
}
