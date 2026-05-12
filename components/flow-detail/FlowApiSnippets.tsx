'use client';

import { useMemo, useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';

type Lang = 'curl' | 'js' | 'python';

type Props = {
  workflowId: string;
  versionId: string;
  inputsJson: string;
};

const TABS: { id: Lang; label: string; ext: string }[] = [
  { id: 'curl', label: 'cURL', ext: 'sh' },
  { id: 'js', label: 'JavaScript', ext: 'js' },
  { id: 'python', label: 'Python', ext: 'py' },
];

function indentBlock(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line, i) => (i === 0 ? line : pad + line))
    .join('\n');
}

export function FlowApiSnippets({ workflowId, versionId, inputsJson }: Props) {
  const [tab, setTab] = useState<Lang>('curl');

  const curl = useMemo(() => {
    const body = `{
  "version_id": "${versionId}",
  "inputs": ${indentBlock(inputsJson, 2)}
}`;
    return `# 1. Trigger the workflow
EXEC=$(curl -s -X POST https://workflows.eachlabs.run/api/v1/${workflowId}/trigger \\
  -H "X-API-Key: $EACHLABS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${indentBlock(body, 4)}' | jq -r .execution_id)

# 2. Poll the execution until it's done
curl -s https://workflows.eachlabs.run/api/v1/executions/$EXEC \\
  -H "X-API-Key: $EACHLABS_API_KEY"`;
  }, [workflowId, versionId, inputsJson]);

  const js = useMemo(() => {
    return `import { Eachlabs } from "@eachlabs/sdk";

const each = new Eachlabs({ apiKey: process.env.EACHLABS_API_KEY });

// Trigger the workflow
const { execution_id } = await each.workflows.trigger("${workflowId}", {
  version_id: "${versionId}",
  inputs: ${indentBlock(inputsJson, 2)},
});

// Wait for the result (auto-polls)
const result = await each.workflows.wait(execution_id);
console.log(result.outputs);`;
  }, [workflowId, versionId, inputsJson]);

  const python = useMemo(() => {
    const pyInputs = inputsJson
      .replace(/\btrue\b/g, 'True')
      .replace(/\bfalse\b/g, 'False')
      .replace(/\bnull\b/g, 'None');
    return `import os
from eachlabs import Eachlabs

each = Eachlabs(api_key=os.environ["EACHLABS_API_KEY"])

# Trigger the workflow
exec = each.workflows.trigger(
    "${workflowId}",
    version_id="${versionId}",
    inputs=${indentBlock(pyInputs, 4)},
)

# Wait for the result (auto-polls)
result = each.workflows.wait(exec.execution_id)
print(result.outputs)`;
  }, [workflowId, versionId, inputsJson]);

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const code = tab === 'curl' ? curl : tab === 'js' ? js : python;

  return (
    <section className="border border-rule2 rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-rule2 bg-surface/40 flex items-baseline justify-between gap-4 flex-wrap">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
          How to use this template
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
        <CodeBlock code={code} language={active.ext} filename={`trigger.${active.ext}`} />
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-3 px-1">
          Trigger returns an execution_id · poll the executions endpoint for the final output
        </p>
      </div>
    </section>
  );
}
