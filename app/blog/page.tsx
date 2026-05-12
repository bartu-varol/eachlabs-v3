import { listBlogPosts } from '@/lib/blogPost';
import { BlogIndex } from '@/components/blog/BlogIndex';

export const revalidate = 600;

export const metadata = {
  title: 'Blog · each::labs',
  description: 'Engineering notes from the orchestration layer.',
};

export default async function BlogPage() {
  const posts = await listBlogPosts(60).catch(() => []);
  return <BlogIndex posts={posts} />;
}
