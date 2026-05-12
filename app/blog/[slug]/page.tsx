import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getBlogPost, listBlogPostSlugs } from '@/lib/blogPost';

export const revalidate = 600;

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  const slugs = await listBlogPostSlugs(24).catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) return { title: 'Post · each::labs' };
  const desc = post.excerpt?.replace(/\s+/g, ' ').trim().slice(0, 160);
  return {
    title: `${post.title} · each::labs blog`,
    description: desc,
    openGraph: post.featureImage
      ? { images: [{ url: post.featureImage }], title: post.title, description: desc }
      : { title: post.title, description: desc },
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function demoteHeadings(html: string): string {
  return html
    .replace(/<\s*h1(\b[^>]*)>/gi, '<h2$1>')
    .replace(/<\s*\/\s*h1\s*>/gi, '</h2>');
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const body = demoteHeadings(post.html ?? '');

  return (
    <section className="container py-20 md:py-28">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
      >
        <ArrowLeft size={12} /> all posts
      </Link>

      <article className="mt-6 max-w-[760px]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-eyebrow">
          {post.primaryTag && (
            <>
              <span className="text-spark">{post.primaryTag.name}</span>
              <span className="text-ink3">·</span>
            </>
          )}
          <span className="text-ink3">{formatDate(post.publishedAt)}</span>
          {post.readingTime > 0 && (
            <>
              <span className="text-ink3">·</span>
              <span className="text-ink3">{post.readingTime} min read</span>
            </>
          )}
        </div>

        <h1 className="font-display font-semibold text-[40px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-tightest mt-6 text-ink">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-ink2 text-[18px] leading-[1.55] mt-7">{post.excerpt}</p>
        )}

        {post.author && (
          <div className="flex items-center gap-3 mt-10 pb-10 border-b border-rule">
            {post.author.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-medium flex-shrink-0 bg-spark/15 text-spark">
                {initialsFrom(post.author.name)}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-ink text-[14px] font-medium">{post.author.name}</div>
              <div className="text-ink3 text-[12.5px] mt-0.5 truncate">
                {post.author.bio ?? 'each::labs'}
              </div>
            </div>
          </div>
        )}

        {post.featureImage && (
          <div className="mt-10 rounded-md overflow-hidden border border-rule2 bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featureImage}
              alt={post.title}
              className="w-full h-auto block"
              loading="eager"
            />
          </div>
        )}

        <div
          className="blog-prose mt-10"
          dangerouslySetInnerHTML={{ __html: body }}
        />

        <div className="mt-16 flex flex-wrap gap-3 pt-10 border-t border-rule">
          <Button href="/blog" variant="secondary">
            ← Back to blog
          </Button>
          <Button href="https://discord.gg/eachlabs" variant="primary">
            Discuss in Discord →
          </Button>
        </div>
      </article>
    </section>
  );
}
