import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OnboardingWizard } from '@/components/auth/OnboardingWizard';

export const metadata: Metadata = {
  title: 'Onboarding · each::labs',
  description: 'Two minutes to pre-flight your workspace.',
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingWizard />
    </Suspense>
  );
}
