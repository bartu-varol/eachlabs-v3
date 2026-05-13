'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { BlogPostSummary } from '@/lib/blogPost';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function FeaturedDispatch({ post }: { post: BlogPostSummary }) {
  const category = post.primaryTag?.name ?? 'POST';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        {post.featureImage && (
          <div className="relative overflow-hidden rounded-md border border-rule">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featureImage}
              alt=""
              className="w-full h-[320px] md:h-[460px] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="mt-6 max-w-[760px]">
          <div className="font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3 flex flex-wrap gap-x-2.5 gap-y-1">
            <span>{formatDate(post.publishedAt)}</span>
            <span aria-hidden>·</span>
            <span>{category}</span>
            {post.readingTime > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>

          <h2 className="font-display font-semibold text-[30px] md:text-[44px] leading-[1.05] tracking-tightest mt-4 text-ink group-hover:italic group-hover:text-spark transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-ink2 text-[15.5px] leading-[1.65] mt-4 line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function ArchiveRow({ post, idx }: { post: BlogPostSummary; idx: number }) {
  const category = post.primaryTag?.name ?? 'POST';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.3, delay: Math.min(idx, 10) * 0.025, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex flex-col md:grid md:grid-cols-[140px_1fr_220px_auto] md:items-center gap-y-4 md:gap-y-0 md:gap-x-8 py-7 md:py-8 border-t border-rule hover:border-ink/40 transition-colors"
      >
        {/* Mobile: thumb on top, full-width 16:9. Desktop: thumb sits in column 3. */}
        {post.featureImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featureImage}
            alt=""
            loading="lazy"
            className="order-first md:order-3 w-full aspect-[16/9] md:w-[220px] md:h-[140px] md:aspect-auto object-cover rounded-md border border-rule transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )}
        {!post.featureImage && (
          <div className="hidden md:block md:order-3 md:w-[220px] md:h-[140px]" aria-hidden />
        )}

        <div className="md:order-1 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 flex flex-wrap gap-x-2 gap-y-1 md:flex-col md:gap-y-1.5 md:self-start md:pt-1">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="md:hidden" aria-hidden>·</span>
          <span>{category}</span>
          {post.readingTime > 0 && (
            <>
              <span className="md:hidden" aria-hidden>·</span>
              <span className="text-ink3/70">{post.readingTime} min</span>
            </>
          )}
        </div>

        <div className="md:order-2 min-w-0">
          <h3 className="font-display font-semibold text-[22px] md:text-[26px] leading-[1.2] tracking-tight text-ink group-hover:italic group-hover:text-spark transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-ink2 text-[14.5px] leading-[1.65] mt-3 line-clamp-2 max-w-[560px]">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="md:order-4 hidden md:flex items-center text-ink3 group-hover:text-spark transition-colors">
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-eyebrow border transition-colors',
        active
          ? 'bg-ink text-bg border-ink'
          : 'bg-transparent border-rule2 text-ink2 hover:text-ink hover:border-ink/40',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

type Props = { posts: BlogPostSummary[] };

export function BlogIndex({ posts }: Props) {
  const [activeCat, setActiveCat] = useState<string>('ALL');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => {
    const set = new Map<string, string>();
    for (const p of posts) {
      if (p.primaryTag) set.set(p.primaryTag.slug, p.primaryTag.name);
    }
    return Array.from(set.entries()).map(([slug, name]) => ({ slug, name }));
  }, [posts]);

  const featured = useMemo(
    () => posts.find((p) => p.featured) ?? posts[0],
    [posts],
  );

  const rest = useMemo(
    () => (featured ? posts.filter((p) => p.slug !== featured.slug) : posts),
    [posts, featured],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter((p) => {
      if (activeCat !== 'ALL' && p.primaryTag?.slug !== activeCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.author?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [activeCat, query, rest]);

  const dispatchNumber = String(posts.length).padStart(3, '0');

  return (
    <>
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3 flex items-center gap-2">
            <span className="text-spark">*</span>
            <span>Field notes</span>
            <span aria-hidden className="text-ink3/60">·</span>
            <span>Dispatch {dispatchNumber}</span>
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[860px]">
            Dispatches from{' '}
            <span className="text-ink3 italic">the rabbit hole.</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.6] max-w-[620px] mt-7">
            Deep-dives, customer stories, and changelogs from the team building each::labs. No
            growth hacks. No "10 ways to". Just what we shipped and what we learned.
          </p>
        </motion.div>
      </section>

      {featured && (
        <section className="container">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-6">
            * Latest
          </div>
          <FeaturedDispatch post={featured} />
        </section>
      )}

      <section className="container mt-20 md:mt-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 pb-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3">
              * Archive
            </div>
            <div className="font-mono text-[11.5px] text-ink3 mt-2">
              {filtered.length} {filtered.length === 1 ? 'dispatch' : 'dispatches'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={activeCat === 'ALL'} onClick={() => setActiveCat('ALL')}>
                All
              </FilterChip>
              {categories.map((c) => (
                <FilterChip
                  key={c.slug}
                  active={activeCat === c.slug}
                  onClick={() => setActiveCat(c.slug)}
                >
                  {c.name}
                </FilterChip>
              ))}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search…"
              aria-label="Search blog"
              className="sm:w-52 px-3 py-1.5 bg-transparent border border-rule2 rounded-full text-ink placeholder:text-ink3 font-mono text-[12px] focus:outline-none focus:border-ink/40"
            />
          </div>
        </div>

        <div className="mt-2">
          {filtered.length === 0 ? (
            <div className="py-24 text-center font-mono text-[12px] text-ink3 border-t border-rule">
              No dispatches match — try a different category or search.
            </div>
          ) : (
            <div>
              {filtered.map((p, i) => (
                <ArchiveRow key={p.slug} post={p} idx={i} />
              ))}
              <div className="border-t border-rule" />
            </div>
          )}
        </div>
      </section>

      <section className="container py-24 md:py-28 mt-12">
        <div className="max-w-[560px]">
          <div className="font-mono text-[10px] uppercase tracking-eyebrow text-ink3 mb-3">
            * Subscribe
          </div>
          <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink">
            New dispatches, twice a month.
          </h2>
          <p className="text-ink2 text-[14.5px] mt-4 leading-[1.6]">
            No spam, no growth hacks, unsubscribe in one click.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex flex-col sm:flex-row items-stretch gap-3 max-w-[440px]"
          >
            <input
              type="email"
              required
              placeholder="you@team.com"
              className="flex-1 px-4 py-3 bg-transparent border border-rule2 rounded-md text-ink placeholder:text-ink3 text-[14px] focus:outline-none focus:border-ink/40"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-ink text-bg rounded-md text-[14px] font-medium hover:bg-spark transition-colors"
            >
              Subscribe →
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
