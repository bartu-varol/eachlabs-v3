import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  getAdjacentPosts,
  getBlogPost,
  listBlogPostSlugs,
} from '@/lib/blogPost';
import { ArticleToC, type TocItem } from '@/components/blog/ArticleToC';
import { ShareRow } from '@/components/blog/ShareRow';
import { AdjacentPosts } from '@/components/blog/AdjacentPosts';
import { ReadingProgress } from '@/components/blog/ReadingProgress';

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

function sanitizeBlogHtml(html: string): string {
  return html
    .replace(/<\s*h1(\b[^>]*)>/gi, '<h2$1>')
    .replace(/<\s*\/\s*h1\s*>/gi, '</h2>')
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript\s*>/gi, '')
    .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\s+on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/<video\b([^>]*)>/gi, (_m, attrs) =>
      /\bcontrols\b/i.test(attrs) ? `<video${attrs}>` : `<video${attrs} controls preload="metadata" playsinline>`,
    )
    .replace(/<audio\b([^>]*)>/gi, (_m, attrs) =>
      /\bcontrols\b/i.test(attrs) ? `<audio${attrs}>` : `<audio${attrs} controls preload="metadata">`,
    );
}

const HEADING_RE = /<h([23])\b[^>]*\bid\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi;
const TAG_RE = /<[^>]+>/g;

function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = HEADING_RE.exec(html)) !== null) {
    const level = Number(m[1]) as 2 | 3;
    const id = m[2];
    const text = m[3].replace(TAG_RE, '').trim();
    if (id && text) items.push({ id, text, level });
  }
  return items;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const [post, adjacent] = await Promise.all([
    getBlogPost(slug),
    getAdjacentPosts(slug),
  ]);
  if (!post) notFound();

  const body = sanitizeBlogHtml(post.html ?? '');
  const toc = extractToc(body);

  return (
    <>
      <ReadingProgress />
      <section className="container py-20 md:py-28">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-eyebrow text-ink3 hover:text-ink transition-colors"
      >
        <ArrowLeft size={12} /> all dispatches
      </Link>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,820px)_1fr_300px] gap-y-10 items-start">
        <article className="min-w-0 lg:col-start-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-eyebrow text-ink3">
            {post.primaryTag && (
              <>
                <span>{post.primaryTag.name}</span>
                <span aria-hidden>·</span>
              </>
            )}
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTime > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>

          <h1 className="font-display font-semibold text-[36px] sm:text-[52px] md:text-[64px] leading-[1.04] tracking-tightest mt-5 text-ink">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-ink2 text-[18px] leading-[1.55] mt-6 max-w-[680px] italic">
              {post.excerpt}
            </p>
          )}

          {post.author && (
            <div className="flex items-center gap-3 mt-8 pb-8 border-b border-rule">
              {post.author.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.author.profileImage}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12.5px] font-medium flex-shrink-0 bg-spark/15 text-spark">
                  {initialsFrom(post.author.name)}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-ink text-[13.5px] font-medium leading-tight">
                  {post.author.name}
                </div>
                <div className="text-ink3 text-[12px] mt-0.5 truncate">
                  {post.author.bio ?? 'each::labs'}
                </div>
              </div>
            </div>
          )}

          {post.featureImage && (
            <figure className="mt-8 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featureImage}
                alt={post.title}
                className="w-full h-auto block"
                loading="eager"
              />
            </figure>
          )}

          <div
            className="blog-prose blog-prose--dropcap mt-10"
            dangerouslySetInnerHTML={{ __html: body }}
          />

          <AdjacentPosts previous={adjacent.previous} next={adjacent.next} />

          <div className="mt-12 pt-10 border-t border-rule flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-eyebrow">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-ink3 hover:text-ink transition-colors"
            >
              <ArrowLeft size={12} /> all dispatches
            </Link>
            <a
              href="https://discord.gg/eachlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink3 hover:text-spark hover:italic transition-colors"
            >
              discuss in discord <ArrowRight size={12} />
            </a>
          </div>
        </article>

        <aside className="hidden lg:block lg:col-start-3 lg:sticky lg:top-32 space-y-4 self-start">
          <ArticleToC items={toc} />
          <ShareRow title={post.title} slug={post.slug} />
        </aside>
      </div>
    </section>
    </>
  );
}
