import { Hero } from '@/components/sections/Hero';
import { TrustedBy } from '@/components/sections/TrustedBy';
import { ProblemSelector } from '@/components/widget/ProblemSelector';
import { ThreeWaysIn } from '@/components/sections/ThreeWaysIn';
import { CustomerStories } from '@/components/sections/CustomerStories';
import { Comparison } from '@/components/sections/Comparison';
import { RabbitHole } from '@/components/sections/RabbitHole';
import { AskAI } from '@/components/sections/AskAI';
import { FAQ } from '@/components/sections/FAQ';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ProblemSelector />
      <ThreeWaysIn />
      <CustomerStories />
      <Comparison />
      <RabbitHole />
      <AskAI />
      <FAQ />
    </>
  );
}
