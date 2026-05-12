import { Hero } from '@/components/sections/Hero';
import { TrustedBy } from '@/components/sections/TrustedBy';
import { ProofSection } from '@/components/sections/ProofSection';
import { AskSense } from '@/components/sections/AskSense';
import { ModelCatalog } from '@/components/sections/ModelCatalog';
import { CustomerStories } from '@/components/sections/CustomerStories';
import { RabbitHole } from '@/components/sections/RabbitHole';
import { FAQ } from '@/components/sections/FAQ';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ProofSection />
      <AskSense />
      <ModelCatalog />
      <CustomerStories />
      <RabbitHole />
      <FAQ />
    </>
  );
}
