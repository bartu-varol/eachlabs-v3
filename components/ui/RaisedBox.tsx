import type { ReactNode, HTMLAttributes } from 'react';

type Padding = 'none' | 'sm' | 'md' | 'lg';

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Inner spacing. */
  padding?: Padding;
  children: ReactNode;
};

const PAD: Record<Padding, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-5 md:p-6',
  lg:   'p-6 md:p-7',
};

/**
 * Rounded card-style container with the standard divider/field border on
 * `surface-raised`. Used by auth forms, pricing tiers, blog tiles, and any
 * other lifted panel. Pass `padding="none"` to opt out of the default spacing.
 */
export function RaisedBox({ padding = 'md', className = '', children, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={[
        'rounded-md border border-field bg-surface-raised',
        PAD[padding],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
