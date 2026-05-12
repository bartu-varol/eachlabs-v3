'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from '@/lib/blog';

const ACCENT_VAR: Record<BlogPost['accent'], string> = {
  spark:     'rgb(var(--c-spark))',
  highlight: 'rgb(var(--c-highlight))',
  success:   'rgb(var(--c-success))',
  sun:       'rgb(var(--c-sun))',
  yellow:    'rgb(var(--c-yellow))',
  ember:     'rgb(var(--c-ember))',
};

const ACCENT_TINT: Record<BlogPost['accent'], string> = {
  spark:     'rgb(var(--c-spark)     / 0.10)',
  highlight: 'rgb(var(--c-highlight) / 0.10)',
  success:   'rgb(var(--c-success)   / 0.10)',
  sun:       'rgb(var(--c-sun)       / 0.10)',
  yellow:    'rgb(var(--c-yellow)    / 0.10)',
  ember:     'rgb(var(--c-ember)     / 0.10)',
};

function FeaturedCard({ post }: { post: BlogPost }) {
  const c = ACCENT_VAR[post.accent];
  const tint = ACCENT_TINT[post.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 bg-surface border border-rule2 rounded-md overflow-hidden hover:[border-color:var(--c)] transition-colors"
        style={{ ['--c' as string]: c }}
      >
        {/* Visual side — gradient hero with category badge */}
        <div
          className="relative min-h-[260px] flex items-end p-7 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${tint}, transparent 80%)`,
          }}
        >
          <span
            className="absolute top-5 left-5 font-mono text-[10px] uppercase tracking-eyebrow px-2 py-1 border rounded-md bg-bg/40 backdrop-blur-sm"
            style={{ color: c, borderColor: c }}
          >
            ★ FEATURED · {post.category}
          </span>
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
            {post.date} · {post.readMin} min read
          </div>
        </div>

        {/* Body */}
        <div className="p-7 md:p-9 flex flex-col">
          <h2 className="font-display font-semibold text-[28px] md:text-[36px] leading-[1.1] tracking-tightest text-ink group-hover:text-spark transition-colors">
            {post.title}
          </h2>
          <p className="text-ink2 text-[14.5px] leading-[1.7] mt-5 flex-1">{post.excerpt}</p>

          <div className="flex items-center justify-between gap-4 mt-7 pt-5 border-t border-rule">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0 ${post.author.avatarBg} ${post.author.avatarText}`}
              >
                {post.author.initials}
              </div>
              <div className="min-w-0">
                <div className="text-ink text-[13px] font-medium truncate">{post.author.name}</div>
                <div className="text-ink3 text-[11.5px] mt-0.5 truncate">{post.author.role}</div>
              </div>
            </div>
            <span
              className="text-[12.5px] font-medium inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
              style={{ color: c }}
            >
              Read post <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PostCard({ post, idx }: { post: BlogPost; idx: number }) {
  const c = ACCENT_VAR[post.accent];
  const tint = ACCENT_TINT[post.accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -50px 0px' }}
      transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="group"
      style={{ ['--c' as string]: c }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block bg-surface border border-rule2 rounded-md overflow-hidden h-full flex flex-col hover:[border-color:var(--c)] transition-colors"
      >
        {/* Top accent strip */}
        <div
          className="h-2"
          style={{ background: `linear-gradient(90deg, ${tint}, transparent)` }}
        />

        <div className="p-6 md:p-7 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 mb-4">
            <span
              className="font-mono text-[10px] uppercase tracking-eyebrow"
              style={{ color: c }}
            >
              {post.category}
            </span>
            <span className="font-mono text-[10px] text-ink3">
              {post.readMin} min
            </span>
          </div>

          <h3 className="font-display font-semibold text-[20px] md:text-[22px] leading-[1.2] tracking-tight text-ink group-hover:text-spark transition-colors">
            {post.title}
          </h3>

          <p className="text-ink2 text-[13.5px] leading-[1.65] mt-3 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-rule">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 ${post.author.avatarBg} ${post.author.avatarText}`}
              >
                {post.author.initials}
              </div>
              <span className="text-ink2 text-[12px] truncate">{post.author.name}</span>
            </div>
            <span className="font-mono text-[10px] text-ink3 shrink-0">{post.date}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState<BlogPost['category'] | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const rest = BLOG_POSTS.filter((p) => p.slug !== featured.slug);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter((p) => {
      if (activeCat !== 'ALL' && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q)
      );
    });
  }, [activeCat, query, rest]);

  return (
    <>
      {/* Hero */}
      <section className="container py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[11px] uppercase tracking-eyebrow text-spark">
            * BLOG
          </div>
          <h1 className="font-display font-semibold text-[44px] sm:text-[60px] md:text-[80px] leading-[0.98] tracking-tightest mt-6 text-ink max-w-[860px]">
            Engineering notes from the <span className="text-ink3 italic">orchestration layer.</span>
          </h1>
          <p className="text-ink2 text-[16px] leading-[1.55] max-w-[640px] mt-7">
            Deep-dives, customer stories, and changelogs from the team building each::labs. No
            growth hacks. No "10 ways to". Just what we shipped and what we learned.
          </p>
        </motion.div>
      </section>

      {/* Featured post */}
      <section className="container">
        <FeaturedCard post={featured} />
      </section>

      {/* Filters */}
      <section className="container mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCat('ALL')}
              className={[
                'px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-eyebrow border transition-colors',
                activeCat === 'ALL'
                  ? 'bg-spark text-bg border-spark'
                  : 'bg-surface border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
              ].join(' ')}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCat(c)}
                className={[
                  'px-3.5 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-eyebrow border transition-colors',
                  activeCat === c
                    ? 'bg-spark text-bg border-spark'
                    : 'bg-surface border-rule2 text-ink2 hover:text-ink hover:border-spark/40',
                ].join(' ')}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search posts…"
            aria-label="Search blog"
            className="md:w-64 px-3 py-2 bg-surface border border-rule2 rounded-md text-ink placeholder:text-ink3 font-mono text-[12.5px] focus:outline-none focus:border-spark/60"
          />
        </div>
      </section>

      {/* Posts grid */}
      <section className="container py-10 md:py-12">
        {filtered.length === 0 ? (
          <div className="py-20 text-center font-mono text-[12px] text-ink3">
            No posts match — try a different category or search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((p, i) => (
              <PostCard key={p.slug} post={p} idx={i} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container border-t border-rule py-24 md:py-32 mt-12">
        <div className="max-w-[680px] mx-auto text-center">
          <h2 className="font-display font-semibold text-[34px] md:text-[48px] leading-[1.05] tracking-tightest text-ink">
            Want this in your inbox?
          </h2>
          <p className="text-ink2 text-[15px] mt-6">
            Engineering notes ship roughly twice a month. No spam, no growth hacks, unsubscribe in
            one click.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-[460px] mx-auto"
          >
            <input
              type="email"
              required
              placeholder="you@team.com"
              className="flex-1 px-4 py-3 bg-surface border border-rule2 rounded-md text-ink placeholder:text-ink3 text-[14px] focus:outline-none focus:border-spark/60"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-spark text-bg rounded-md text-[14px] font-medium hover:bg-ember transition-colors"
            >
              Subscribe →
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
