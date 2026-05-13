'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const COOKIE_KEY = 'each-auth-ui';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type Variant = 'brand' | 'terminal';

function Inner({ variant, cleanQuery }: { variant: Variant; cleanQuery: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    document.cookie = `${COOKIE_KEY}=${variant}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    if (cleanQuery) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('ui');
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, cleanQuery]);

  return null;
}

export function DevModeCookieSync(props: { variant: Variant; cleanQuery: boolean }) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  );
}
