import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { BlogPostSummary } from '@/lib/blogPost';

type Props = {
  previous: BlogPostSummary | null;
  next: BlogPostSummary | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function AdjacentPosts({ previous, next }: Props) {
  if (!previous && !next) return null;
  return (
    <nav
      aria-label="More posts"
      className="mt-20 pt-10 border-t border-rule grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {previous ? (
        <PostLink direction="prev" post={previous} />
      ) : (
        <div className="hidden md:block" aria-hidden />
      )}
      {next ? (
        <PostLink direction="next" post={next} />
      ) : (
        <div className="hidden md:block" aria-hidden />
      )}
    </nav>
  );
}

function PostLink({
  post,
  direction,
}: {
  post: BlogPostSummary;
  direction: 'prev' | 'next';
}) {
  const isPrev = direction === 'prev';
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={[
        'group block rounded-md border border-rule2 bg-surface p-5 transition-colors hover:border-ink/30',
        isPrev ? 'md:text-left' : 'md:text-right',
      ].join(' ')}
    >
      <div
        className={[
          'flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-eyebrow text-ink3',
          isPrev ? '' : 'md:justify-end',
        ].join(' ')}
      >
        {isPrev && <ArrowLeft size={11} />}
        <span>{isPrev ? 'Previous post' : 'Next post'}</span>
        {!isPrev && <ArrowRight size={11} />}
      </div>

      <div className="mt-4 flex gap-4 items-start">
        {!isPrev && (
          <div className="flex-1 min-w-0">
            <CardBody post={post} alignRight />
          </div>
        )}
        {post.featureImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featureImage}
            alt=""
            className={[
              'w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border border-rule2 flex-shrink-0',
              isPrev ? '' : 'order-2',
            ].join(' ')}
            loading="lazy"
          />
        )}
        {isPrev && (
          <div className="flex-1 min-w-0">
            <CardBody post={post} />
          </div>
        )}
      </div>
    </Link>
  );
}

function CardBody({
  post,
  alignRight = false,
}: {
  post: BlogPostSummary;
  alignRight?: boolean;
}) {
  return (
    <>
      <h3
        className={[
          'font-display font-semibold text-[16px] sm:text-[18px] leading-[1.25] tracking-tight text-ink group-hover:text-spark transition-colors line-clamp-3',
          alignRight ? 'md:text-right' : '',
        ].join(' ')}
      >
        {post.title}
      </h3>
      <div
        className={[
          'mt-2 font-mono text-[10px] uppercase tracking-eyebrow text-ink3 flex flex-wrap gap-x-2 gap-y-1',
          alignRight ? 'md:justify-end' : '',
        ].join(' ')}
      >
        {post.primaryTag && <span>{post.primaryTag.name}</span>}
        {post.publishedAt && (
          <>
            {post.primaryTag && <span aria-hidden>·</span>}
            <span>{formatDate(post.publishedAt)}</span>
          </>
        )}
        {post.readingTime > 0 && (
          <>
            <span aria-hidden>·</span>
            <span>{post.readingTime} min</span>
          </>
        )}
      </div>
    </>
  );
}
