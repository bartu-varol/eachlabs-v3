import { trustedBy } from '@/lib/content';

export function TrustedBy() {
  const { eyebrow, customers, stats } = trustedBy;

  return (
    <section className="border-t border-b border-rule py-12">
      <div className="container text-center">
        <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark mb-8">
          {eyebrow}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          {customers.map((c) => {
            const isLume = c === 'LUME';
            return (
              <span
                key={c}
                className={[
                  'text-[15px] font-medium opacity-60 hover:opacity-100 transition-opacity',
                  isLume ? 'font-mono italic text-ink' : 'text-ink3',
                ].join(' ')}
              >
                {c}
              </span>
            );
          })}
        </div>

        <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mt-8">
          {stats}
        </div>
      </div>
    </section>
  );
}
