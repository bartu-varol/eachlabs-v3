import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BLOG_POSTS } from '@/lib/blog';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <section className="container py-20 md:py-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
        >
          <ArrowLeft size={12} /> all posts
        </Link>

        <div className="mt-6 max-w-[760px]">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-eyebrow">
            <span className="text-spark">{post.category}</span>
            <span className="text-ink3">·</span>
            <span className="text-ink3">{post.date}</span>
            <span className="text-ink3">·</span>
            <span className="text-ink3">{post.readMin} min read</span>
          </div>

          <h1 className="font-display font-semibold text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-tightest mt-6 text-ink">
            {post.title}
          </h1>

          <p className="text-ink2 text-[18px] leading-[1.55] mt-7">{post.excerpt}</p>

          <div className="flex items-center gap-3 mt-10 pb-10 border-b border-rule">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0 ${post.author.avatarBg} ${post.author.avatarText}`}
            >
              {post.author.initials}
            </div>
            <div>
              <div className="text-ink text-[14px] font-medium">{post.author.name}</div>
              <div className="text-ink3 text-[12.5px] mt-0.5">{post.author.role}</div>
            </div>
          </div>

          {/* Stub body */}
          <div className="mt-10 text-ink2 text-[15px] leading-[1.7] space-y-5">
            <p>
              The full article is being edited and ships on the date above. The summary at the top
              is the working thesis — once the post is live, this body will carry the deep-dive,
              charts, and code snippets.
            </p>
            <p>
              Want it the moment it ships? Subscribe to engineering notes from the blog index — we
              ship roughly twice a month, no growth hacks.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button href="/blog" variant="secondary">← Back to blog</Button>
            <Button
              href="https://discord.gg/eachlabs"
              variant="primary"
            >
              Discuss in Discord →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
