import { EachLabel } from './EachLabel';

const LOGO_SRC: Record<string, string> = {
  Router:    '/brand/each-router-logo.svg',
  Workflows: '/brand/each-workflows-logo.svg',
  Sense:     '/brand/each-sense-logo.svg',
};

type Props = {
  name: string;
  className?: string;
};

export function ProductMark({ name, className = '' }: Props) {
  const src = LOGO_SRC[name];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`each::${name.toLowerCase()}`}
        className={`product-mark-img h-5 md:h-[22px] w-auto ${className}`}
      />
    );
  }

  return (
    <EachLabel
      name={`each::${name.toLowerCase()}`}
      className={className}
    />
  );
}
