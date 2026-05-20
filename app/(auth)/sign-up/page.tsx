import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AuthDevModeProvider } from '@/components/auth/AuthDevModeContext';
import { DevModeCookieSync } from '@/components/auth/DevModeCookieSync';
import { SignupBrand } from '@/components/auth/SignupBrand';
import { SignupTerminal } from '@/components/auth/SignupTerminal';

export const metadata: Metadata = {
  title: 'Sign up · each::labs',
  description: 'API key in 60 seconds. 10K free traces. No credit card.',
};

type Variant = 'brand' | 'terminal';

function isVariant(v: string | string[] | undefined): v is Variant {
  return v === 'brand' || v === 'terminal';
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ ui?: string | string[] }>;
}) {
  const sp = await searchParams;
  const urlUi = sp.ui;
  const cookieStore = await cookies();
  const cookieUi = cookieStore.get('each-auth-ui')?.value;

  const variant: Variant = isVariant(urlUi)
    ? urlUi
    : cookieUi === 'terminal'
      ? 'terminal'
      : 'brand';

  return (
    <AuthDevModeProvider>
      <DevModeCookieSync variant={variant} cleanQuery={isVariant(urlUi)} />
      <SignupBrand />
      {variant === 'terminal' && <SignupTerminal />}
    </AuthDevModeProvider>
  );
}
