import { EachLabel } from './EachLabel';

type Size = 'sm' | 'md' | 'lg';

type Asset = { src: string; alt: string };

const ASSETS: Record<string, Asset> = {
  router:    { src: '/brand/each-router-logo.svg',    alt: 'each::router'    },
  workflows: { src: '/brand/each-workflows-logo.svg', alt: 'each::workflows' },
  sense:     { src: '/brand/each-sense-logo.svg',     alt: 'each::sense'     },
  trace:     { src: '/brand/each-trace-logo.svg',     alt: 'each::trace'     },
};

const SIZE: Record<Size, string> = {
  sm: 'h-5 md:h-[22px]',
  md: 'h-7 md:h-8',
  lg: 'h-[34px] sm:h-[38px]',
};

type Props = {
  /** Product name, case-insensitive. e.g. "router", "Workflows", "SENSE". */
  name: string;
  size?: Size;
  className?: string;
};

/**
 * Brand mark for each:: products. SVG sources are designed in dark ink on
 * transparent; the `.product-mark-img` class (defined in globals.css) auto-
 * inverts the logo in dark mode so it stays readable across themes.
 *
 * Unknown product names fall back to a styled text label.
 */
export function ProductMark({ name, size = 'sm', className = '' }: Props) {
  const key = name.toLowerCase();
  const asset = ASSETS[key];

  if (asset) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset.src}
        alt={asset.alt}
        className={['product-mark-img w-auto', SIZE[size], className].filter(Boolean).join(' ')}
      />
    );
  }

  return <EachLabel name={`each::${key}`} className={className} />;
}
