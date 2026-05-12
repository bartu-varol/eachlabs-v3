import type { FlowDetail, FlowStep } from '@/lib/flowDetail';

type Props = { flow: FlowDetail };

function isRef(value: unknown): value is string {
  return typeof value === 'string' && /^\$\.(inputs|steps)\./.test(value);
}

function summariseParam(value: unknown): string {
  if (isRef(value)) return value;
  if (typeof value === 'string') {
    if (value.length <= 60) return JSON.stringify(value);
    return JSON.stringify(value.slice(0, 60) + '…');
  }
  if (Array.isArray(value)) {
    const len = value.length;
    if (len === 0) return '[]';
    return `[${len} item${len === 1 ? '' : 's'}]`;
  }
  if (value && typeof value === 'object') return '{ … }';
  return JSON.stringify(value);
}

function topParams(step: FlowStep, limit = 5): Array<[string, unknown]> {
  const entries = Object.entries(step.params);
  return entries.slice(0, limit);
}

export function FlowTemplate({ flow }: Props) {
  const steps = flow.definition.steps ?? [];

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="border border-rule2 rounded-md overflow-hidden">
      <header className="px-5 py-3 border-b border-rule2 bg-surface/40 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink2">
          Template · pipeline
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
          {steps.length} step{steps.length === 1 ? '' : 's'}
        </span>
      </header>

      <ol className="px-5 py-5 space-y-3">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const params = topParams(step);
          const extra = Object.keys(step.params).length - params.length;
          return (
            <li key={step.id} className="relative pl-9">
              <span className="absolute left-0 top-0 inline-flex w-7 h-7 items-center justify-center rounded-full bg-surface border border-rule2 font-mono text-[11px] text-ink2">
                {idx + 1}
              </span>
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[13px] top-7 bottom-[-12px] w-px bg-rule2"
                />
              )}

              <div className="border border-rule2 rounded-md bg-surface/30 overflow-hidden">
                <div className="px-4 py-3 flex items-baseline justify-between border-b border-rule2/60 gap-3">
                  <div className="min-w-0">
                    <code className="font-mono text-[13px] text-ink truncate block">{step.model}</code>
                    <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-0.5 inline-block">
                      id · {step.id} · {step.type}
                    </span>
                  </div>
                </div>

                {params.length > 0 && (
                  <dl className="px-4 py-3 grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-[12.5px]">
                    {params.map(([key, value]) => (
                      <FragmentRow key={key} k={key} v={value} />
                    ))}
                    {extra > 0 && (
                      <>
                        <dt className="font-mono text-ink3">…</dt>
                        <dd className="font-mono text-ink3">
                          +{extra} more param{extra === 1 ? '' : 's'}
                        </dd>
                      </>
                    )}
                  </dl>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function FragmentRow({ k, v }: { k: string; v: unknown }) {
  const ref = isRef(v);
  return (
    <>
      <dt className="font-mono text-ink3 truncate">{k}</dt>
      <dd
        className={`font-mono break-words ${ref ? 'text-highlight' : 'text-ink2'}`}
        title={typeof v === 'string' ? v : undefined}
      >
        {summariseParam(v)}
      </dd>
    </>
  );
}
