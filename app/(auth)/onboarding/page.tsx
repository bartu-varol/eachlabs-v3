import type { Metadata } from 'next';
import { OnboardingWizard } from '@/components/auth/OnboardingWizard';

export const metadata: Metadata = {
  title: 'Onboarding · each::labs',
  description: 'Two minutes to pre-flight your workspace.',
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
