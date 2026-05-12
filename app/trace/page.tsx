import { ProductShowcase } from '@/components/sections/ProductShowcase';
import { TraceDemo } from '@/components/sections/TraceDemo';
import { TraceHowTo } from '@/components/sections/TraceHowTo';
import { TraceAnatomy } from '@/components/sections/TraceAnatomy';
import { PRODUCTS } from '@/lib/products';

export default function TracePage() {
  return (
    <ProductShowcase
      product={PRODUCTS.trace}
      whatWhyHow={{
        what: 'Every each.run() emits a complete trace — every step, every fallback, every dollar.',
        why:  'Logs tell you what happened. Traces tell you what one user experienced.',
        how: (
          <>
            Read{' '}
            <code className="font-mono text-[12.5px] text-spark">result.trace_id</code>; fetch
            it inline or stream the fleet to BigQuery.
          </>
        ),
      }}
      demo={<TraceDemo />}
      howTo={<TraceHowTo />}
      anatomy={<TraceAnatomy />}
    />
  );
}
