'use client';

import { Children, type ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * Wraps the homepage ModelCatalog cards with a staggered scroll-in animation.
 * Server-rendered children (ModelTile) get wrapped in motion.div so we keep
 * the cards themselves as server components for SEO + bundle size.
 */
export function CatalogStagger({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
