import { models } from '@/lib/models';
import { explore } from '@/lib/content';
import { ModelCard } from '@/components/ui/ModelCard';

export function ExploreGrid() {
  return (
    <section className="container py-12">
      <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 mb-6">
        {explore.resultCount}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => (
          <ModelCard key={model.name} model={model} expanded />
        ))}
      </div>
      <div className="border-t border-rule mt-12 pt-12" />
    </section>
  );
}
