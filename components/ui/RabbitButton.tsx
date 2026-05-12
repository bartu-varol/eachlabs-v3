'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

function BabyRabbit() {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/lottie/baby-rabbit.json')
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setData(j);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return null;

  return (
    <Lottie
      animationData={data}
      loop
      autoplay
      className="w-full h-full"
      rendererSettings={{ preserveAspectRatio: 'xMidYMax meet' }}
    />
  );
}

type Props = {
  href: string;
  className?: string;
  fullWidth?: boolean;
  label?: string;
};

const baseStyles =
  'relative inline-flex items-center justify-center px-5 py-3 rounded-md text-[14px] font-medium transition-colors duration-150 whitespace-nowrap bg-spark text-white hover:bg-ember';

export function RabbitButton({
  href,
  className = '',
  fullWidth = false,
  label = 'Follow the white rabbit',
}: Props) {
  return (
    <Link
      href={href}
      className={`${baseStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <span aria-hidden className="shrink-0 inline-block w-20" />
      <span className="px-2 text-center">{label}</span>
      <span className="shrink-0 inline-flex w-20 h-20 -my-7 -translate-y-4">
        <BabyRabbit />
      </span>
    </Link>
  );
}
