import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { AuthDevModeProvider } from '@/components/auth/AuthDevModeContext';
import { DevModeCookieSync } from '@/components/auth/DevModeCookieSync';
import { SigninBrand } from '@/components/auth/SigninBrand';
import { SigninTerminal } from '@/components/auth/SigninTerminal';

export const metadata: Metadata = {
  title: 'Sign in · each::labs',
  description: 'Welcome back. The chaos missed you.',
};

type Variant = 'brand' | 'terminal';

function isVariant(v: string | string[] | undefined): v is Variant {
  return v === 'brand' || v === 'terminal';
}

export default async function SigninPage({
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
      <Suspense fallback={null}>
        <DevModeCookieSync variant={variant} cleanQuery={isVariant(urlUi)} />
      </Suspense>
      <SigninBrand />
      {variant === 'terminal' && <SigninTerminal />}
    </AuthDevModeProvider>
  );
}
