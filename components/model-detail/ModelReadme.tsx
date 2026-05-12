import type { ModelDetail } from '@/lib/modelDetail';

type Props = { readme: ModelDetail['readme'] };

type Section = {
  id: string;
  label: string;
  html: string;
};

function cleanHtml(html: string): string {
  return html.replace(/^\s*<h2[^>]*>[\s\S]*?<\/h2>\s*/i, '');
}

function buildSections(readme: ModelDetail['readme']): Section[] {
  const map: { id: string; label: string; html: string | null }[] = [
    { id: 'overview', label: 'Overview', html: readme.overview },
    { id: 'capabilities', label: 'Capabilities', html: readme.capabilities },
    { id: 'use-cases', label: 'Use cases', html: readme.whatCanIUseFor },
    { id: 'tips', label: 'Tips & tricks', html: readme.tipsAndTricks },
    { id: 'spec', label: 'Technical spec', html: readme.technicalSpec },
    { id: 'aware', label: 'Things to be aware of', html: readme.thingsToBeAwareOf },
    { id: 'considerations', label: 'Key considerations', html: readme.keyConsiderations },
    { id: 'limitations', label: 'Limitations', html: readme.limitations },
  ];
  return map
    .filter((s) => s.html && s.html.trim().length > 0)
    .map((s) => ({ id: s.id, label: s.label, html: cleanHtml(s.html as string) }));
}

export function ModelReadme({ readme }: Props) {
  const sections = buildSections(readme);
  if (sections.length === 0) return null;

  return (
    <div className="border border-rule2 rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-rule2 bg-surface/40 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
          Documentation
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {sections.length} sections
        </span>
      </header>
      <ul className="divide-y divide-rule2">
        {sections.map((s) => (
          <li key={s.id}>
            <details className="group">
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none hover:bg-surface/30 transition-colors">
                <span className="text-[14px] font-medium text-ink">{s.label}</span>
                <span
                  aria-hidden
                  className="font-mono text-[14px] text-ink3 group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <div
                className="px-5 pb-5 model-readme-prose"
                dangerouslySetInnerHTML={{ __html: s.html }}
              />
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
