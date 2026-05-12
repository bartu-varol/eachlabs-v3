'use client';

import { useMemo, useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import type { ModelInput } from '@/lib/modelDetail';
import { buildPayload, payloadToJson } from '@/lib/sampleInput';

type Lang = 'curl' | 'js' | 'python';

type Props = {
  modelSlug: string;
  inputs: ModelInput[];
  examplePayload?: Record<string, unknown> | null;
};

const TABS: { id: Lang; label: string; ext: string }[] = [
  { id: 'curl', label: 'cURL', ext: 'sh' },
  { id: 'js', label: 'JavaScript', ext: 'js' },
  { id: 'python', label: 'Python', ext: 'py' },
];

export function ModelApiSnippets({ modelSlug, inputs, examplePayload }: Props) {
  const [tab, setTab] = useState<Lang>('curl');
  const payload = useMemo(
    () =>
      examplePayload && Object.keys(examplePayload).length > 0
        ? examplePayload
        : buildPayload(inputs),
    [inputs, examplePayload],
  );
  const payloadJson = useMemo(() => payloadToJson(payload), [payload]);

  const curlBody = JSON.stringify({ model: modelSlug, input: payload }, null, 2)
    .split('\n')
    .map((line, i) => (i === 0 ? line : '    ' + line))
    .join('\n');
  const curl = `curl -X POST https://api.eachlabs.ai/v1/predictions \\
  -H "Authorization: Bearer $EACHLABS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${curlBody}'`;

  const js = `import { Eachlabs } from "@eachlabs/sdk";

const each = new Eachlabs({ apiKey: process.env.EACHLABS_API_KEY });

const prediction = await each.predictions.create({
  model: "${modelSlug}",
  input: ${payloadJson},
});

console.log(prediction.output);`;

  const python = `from eachlabs import Eachlabs

each = Eachlabs(api_key=os.environ["EACHLABS_API_KEY"])

prediction = each.predictions.create(
    model="${modelSlug}",
    input=${payloadJson.replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None')},
)

print(prediction.output)`;

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const code = tab === 'curl' ? curl : tab === 'js' ? js : python;

  return (
    <section className="border border-rule2 rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-rule2 bg-surface/40 flex items-baseline justify-between gap-4 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
          Call the API
        </span>
        <div className="flex items-center gap-1" role="tablist" aria-label="API code samples">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`font-mono text-[11px] uppercase tracking-eyebrow px-2.5 py-1 rounded-full border transition-colors ${
                tab === t.id
                  ? 'border-ink text-ink bg-surface'
                  : 'border-rule2 text-ink3 hover:text-ink2 hover:border-rule'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <div className="p-4">
        <CodeBlock code={code} language={active.ext} filename={`predictions.${active.ext}`} />
      </div>
    </section>
  );
}
