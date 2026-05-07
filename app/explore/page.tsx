import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { ExploreFilters } from '@/components/explore/ExploreFilters';
import { ExploreGrid } from '@/components/explore/ExploreGrid';

export const metadata = {
  title: 'Explore models · each::labs',
  description: '600+ image, video, audio, 3D and utility models — one API.',
};

export default function ExplorePage() {
  return (
    <>
      <ExploreHeader />
      <ExploreFilters />
      <ExploreGrid />
    </>
  );
}
